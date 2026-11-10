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
 * Defaults match the gunnarwrld.com brand: the star mascot in its amber light
 * on a mahogany stage, the name in ivory wood type.
 *
 * Renders at 1200x630: the canonical OG card size (also fine for Twitter
 * `summary_large_image`).
 *
 * The display font and the mascot are fetched from this deployment's own
 * static files. If either fetch fails the card still renders, in the default
 * font and without the mascot.
 *
 * NOTE: We're on Vite (Vercel framework preset = "Other"), not Next.js.
 * In that mode `export const runtime = "edge"` is IGNORED and the function
 * is built as a Node.js serverless function: where @vercel/og crashes.
 * The required form is `export const config = { runtime: "edge" }`.
 * Source: https://vercel.com/docs/functions/runtimes/edge (framework=other)
 */
export const config = {
  runtime: "edge",
};

// The site palette (src/index.css). Satori cannot read CSS variables.
const MAHOGANY = "#441505";
const ESPRESSO = "#260B02";
const IVORY = "#FAF5E8";
const PARCHMENT = "#DECBB8";
const COCOA = "#8C6B56";
const AMBER = "#FFB700";

async function load(url: URL): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function dataUri(buffer: ArrayBuffer, type: string): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // In chunks: spreading a whole image into one call overflows the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${type};base64,${btoa(binary)}`;
}

/** The name fits at full size; longer custom titles step down so they stay inside the card. */
function titleSize(length: number): number {
  if (length <= 13) return 116;
  if (length <= 22) return 88;
  if (length <= 36) return 66;
  return 52;
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Gunnar Arias").slice(0, 60);
  const subtitle = (
    searchParams.get("subtitle") ?? "Full-stack developer, backend first. REST APIs, auth, tests and deploys."
  ).slice(0, 140);

  const [display, text, mascot] = await Promise.all([
    // Satori reads WOFF but not WOFF2, so both faces are also shipped as .woff.
    load(new URL("/fonts/alfa-slab-one-latin.woff", req.url)),
    load(new URL("/fonts/work-sans-500-latin.woff", req.url)),
    load(new URL("/mascot/estrella-og.png", req.url)),
  ]);
  const fonts = [
    ...(display ? [{ name: "Alfa Slab One", data: display, weight: 400 as const, style: "normal" as const }] : []),
    ...(text ? [{ name: "Work Sans", data: text, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          // Flat colour on purpose: a gradient makes the PNG several times larger.
          backgroundColor: MAHOGANY,
          color: IVORY,
          fontFamily: text ? "Work Sans" : "sans-serif",
        }}
      >
        {/* Ink frame */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            display: "flex",
            border: `4px solid ${IVORY}`,
          }}
        />

        {/* The star in its light. Without the star (its file could not be fetched) the light is left out too. */}
        {mascot ? (
          <div
            style={{
              position: "relative",
              width: 500,
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <svg width="500" height="630" viewBox="0 0 500 630" style={{ position: "absolute", left: 0, top: 0 }}>
              <polygon points="205,26 295,26 472,574 28,574" fill={AMBER} fillOpacity="0.24" />
              <path d="M205 26 L28 574 M295 26 L472 574" stroke={AMBER} strokeWidth="3" fill="none" />
              <ellipse cx="250" cy="574" rx="222" ry="24" fill={AMBER} />
              <ellipse cx="268" cy="576" rx="128" ry="9" fill={ESPRESSO} fillOpacity="0.9" />
            </svg>
            <img src={dataUri(mascot, "image/png")} width={421} height={520} alt="" style={{ marginBottom: 46 }} />
          </div>
        ) : (
          <div style={{ display: "flex", width: 84 }} />
        )}

        {/* The name */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 12,
            paddingRight: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: display ? "Alfa Slab One" : "sans-serif",
              fontSize: titleSize(title.length),
              fontWeight: display ? 400 : 800,
              lineHeight: 0.95,
              textTransform: "uppercase",
              textShadow: `6px 6px 0 ${COCOA}`,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 31,
              lineHeight: 1.35,
              color: PARCHMENT,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
              fontSize: 24,
              color: IVORY,
            }}
          >
            <div style={{ display: "flex", width: 34, height: 4, marginRight: 14, backgroundColor: IVORY }} />
            gunnarwrld.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
      headers: {
        // 1 hour CDN cache, 1 day stale-while-revalidate.
        "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
