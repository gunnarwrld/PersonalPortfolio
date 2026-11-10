// Step 2 of the mascot pipeline (see README.md in this folder).
//
// Exports every mascot file the site needs from the sticker made in step 1:
// the hero sticker (AVIF and WebP, 1x and 2x), the social card PNG, the round
// logo badge, the app icons and favicon.ico.
//
//   node scripts/mascot/exports.mjs <work dir> public
//
// Needs sharp (not a project dependency): npm install --no-save sharp
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [buildDir, publicDir] = process.argv.slice(2);
const info = JSON.parse(fs.readFileSync(path.join(buildDir, "sticker.json"), "utf8"));
const master = path.join(buildDir, "sticker.png");
const canvas = path.join(buildDir, "sticker-canvas.png");
const mascotDir = path.join(publicDir, "mascot");
fs.mkdirSync(mascotDir, { recursive: true });

const AMBER = "#FFB700";
const IVORY = "#FAF5E8";
const MAHOGANY = "#441505";
const ESPRESSO = "#260B02";

const sizes = {};
const record = (file) => { sizes[path.relative(publicDir, file)] = fs.statSync(file).size; };

// ---- 1. Full-body sticker for the hero (1x and 2x), plus a PNG for the social card.
for (const w of [480, 960]) {
  const base = sharp(master).resize({ width: w, kernel: "lanczos3" });
  const webp = path.join(mascotDir, `estrella-${w}.webp`);
  const avif = path.join(mascotDir, `estrella-${w}.avif`);
  await base.clone().webp({ quality: 76, alphaQuality: 92, effort: 6 }).toFile(webp);
  await base.clone().avif({ quality: 52, effort: 7 }).toFile(avif);
  record(webp);
  record(avif);
}
{
  const og = path.join(mascotDir, "estrella-og.png");
  await sharp(master).resize({ height: 540, kernel: "lanczos3" }).png({ compressionLevel: 9, palette: true, quality: 90, colours: 128 }).toFile(og);
  record(og);
}
const heroMeta = await sharp(path.join(mascotDir, "estrella-480.webp")).metadata();

// ---- 2. Round badge: the head inside a disc of amber light, ivory rim. This is the logo.
// Head centre and radius in master-canvas pixels (2x the 1024 source).
const HEAD = { cx: 985, cy: 585, r: 480 };
async function badge(size, { rim = 0.055, background = null } = {}) {
  const S = 1024; // work size, scaled down at the end
  const outer = Math.round(S / 2 - (background ? S * 0.06 : 0)); // radius of the whole badge
  const inner = Math.round(outer - S * rim); // radius of the amber disc
  const head = await sharp(canvas)
    .extract({ left: HEAD.cx - HEAD.r, top: HEAD.cy - HEAD.r, width: HEAD.r * 2, height: HEAD.r * 2 })
    .resize(inner * 2, inner * 2, { kernel: "lanczos3" })
    .png()
    .toBuffer();
  const circle = (fill) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${inner * 2}" height="${inner * 2}"><circle cx="${inner}" cy="${inner}" r="${inner}" fill="${fill}"/></svg>`,
    );
  const face = await sharp(circle(AMBER))
    .composite([{ input: head }, { input: circle("#fff"), blend: "dest-in" }])
    .png()
    .toBuffer();
  const frame = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">` +
      (background ? `<rect width="${S}" height="${S}" fill="${background}"/>` : "") +
      `<circle cx="${S / 2}" cy="${S / 2}" r="${outer}" fill="${ESPRESSO}"/>` +
      `<circle cx="${S / 2}" cy="${S / 2}" r="${outer - S * 0.012}" fill="${IVORY}"/>` +
      `</svg>`,
  );
  // sharp resizes before it composites, so flatten first and scale in a second pass.
  const full = await sharp(frame)
    .composite([{ input: face, left: S / 2 - inner, top: S / 2 - inner }])
    .png()
    .toBuffer();
  return sharp(full).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
}

for (const s of [96, 192]) {
  const file = path.join(mascotDir, `badge-${s}.webp`);
  await sharp(await badge(s)).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(file);
  record(file);
}
// App icons: transparent round badge for browsers, mahogany square for iOS.
for (const s of [192, 512]) {
  const file = path.join(publicDir, `icon-${s}.png`);
  await sharp(await badge(s)).png({ compressionLevel: 9, palette: true, quality: 90, colours: 128 }).toFile(file);
  record(file);
}
{
  const file = path.join(publicDir, "apple-touch-icon.png");
  await sharp(await badge(180, { background: MAHOGANY })).png({ compressionLevel: 9, palette: true, quality: 90, colours: 128 }).toFile(file);
  record(file);
}
// favicon.ico with 16/32/48 PNG entries.
{
  const entries = [];
  for (const s of [16, 32, 48]) entries.push({ s, png: await badge(s) });
  const header = Buffer.alloc(6 + entries.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = header.length;
  entries.forEach((e, i) => {
    const o = 6 + i * 16;
    header.writeUInt8(e.s, o);
    header.writeUInt8(e.s, o + 1);
    header.writeUInt8(0, o + 2);
    header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(e.png.length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += e.png.length;
  });
  const file = path.join(publicDir, "favicon.ico");
  fs.writeFileSync(file, Buffer.concat([header, ...entries.map((e) => e.png)]));
  record(file);
}

// ---- report
const ground = (info.body.bottom - info.sticker.top) / info.sticker.height;
console.log(JSON.stringify({ hero: { width: heroMeta.width, height: heroMeta.height }, ground: +ground.toFixed(4), sizes }, null, 2));
