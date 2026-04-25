import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { Resend } from "resend";

/**
 * POST /api/contact
 * Body: { name: string, email: string, message: string }
 *
 * Required environment variables (set in Vercel project settings):
 *   RESEND_API_KEY  – API key from https://resend.com
 *   CONTACT_TO      – the address that should receive submissions (e.g. ariasgunnar@gmail.com)
 *   CONTACT_FROM    – verified sender (e.g. "Portfolio <contact@gunnarwrld.com>")
 *                     During development you can use "onboarding@resend.dev".
 */

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
  // Honeypot — bots typically fill every field. Real users leave it blank.
  website: z.string().max(0).optional().or(z.literal("")),
});

// Very small in-memory rate limiter (per warm lambda instance).
// Good enough to slow down casual abuse; for production replace with Upstash/Redis.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Try again in a minute." });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  // Honeypot — silently succeed so bots don't learn it failed.
  if (parsed.data.website) {
    return res.status(200).json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO environment variables.");
    return res.status(500).json({ error: "Server is not configured to send email." });
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\nIP: ${ip}\n\n${message}`,
      html: `
        <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;line-height:1.55;color:#111">
          <h2 style="margin:0 0 12px">New message from gunnarwrld.com</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 16px;color:#666;font-size:12px"><strong>IP:</strong> ${escapeHtml(ip)}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return res.status(502).json({ error: "Email provider rejected the message." });
    }

    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("Unexpected error sending email:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
}
