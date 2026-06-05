import { ImageResponse } from "@vercel/og";

/**
 * GET /api/og
 *
 * Dynamic Open Graph image for social previews (LinkedIn, Slack, Discord,
 * Twitter/X, WhatsApp, etc.).
 *
 * Optional query params:
 *   ?title=...      Headline shown in large type
 *   ?subtitle=...   Smaller secondary line
 *
 * Defaults match the gunnarwrld.com brand: dark canvas, grid background,
 * Syne-style heavy display headline, mono accent.
 *
 * Renders at 1200x630 — the canonical OG card size (also fine for Twitter
 * `summary_large_image`).
 *
 * NOTE: We're on Vite (Vercel framework preset = "Other"), not Next.js.
 * In that mode `export const runtime = "edge"` is IGNORED and the function
 * is built as a Node.js serverless function — where @vercel/og crashes.
 * The required form is `export const config = { runtime: "edge" }`.
 * Source: https://vercel.com/docs/functions/runtimes/edge (framework=other)
 */
export const config = {
  runtime: "edge",
};

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Gunnar Arias").slice(0, 60);
  const subtitle = (
    searchParams.get("subtitle") ??
    "Full-Stack Developer & CS Student — building modern web applications"
  ).slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0a",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a1a1aa",
            fontSize: 22,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#fafafa",
            }}
          />
          gunnarwrld.com
        </div>

        {/* Main title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 132,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#fafafa",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: "#a1a1aa",
              maxWidth: 980,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#a1a1aa",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>React · TypeScript · Cloud · AI</div>
          <div style={{ display: "flex" }}>Sweden</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // 1 hour CDN cache, 1 day stale-while-revalidate.
        "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
