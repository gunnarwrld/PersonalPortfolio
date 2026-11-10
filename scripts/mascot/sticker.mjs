// Step 1 of the mascot pipeline (see README.md in this folder).
//
// Turns the mascot source (flat art on a white backdrop) into a "sticker":
// the character, its whites warmed to the palette ivory, with an ivory die-cut
// edge around the silhouette and a transparent outside. The edge is what lets
// the black cap and sneakers read on the site's dark background.
//
//   node scripts/mascot/sticker.mjs <source image> <work dir> [--scale 2] [--ring 22]
//
// Needs sharp (not a project dependency): npm install --no-save sharp
// sharp only reads, resizes and writes; all pixel work is plain JS.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [src, outDir] = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : Number(process.argv[i + 1]);
};
const SCALE = arg("--scale", 2);
const RING = arg("--ring", 22);
const IVORY = [250, 245, 232];

fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(src).metadata();
const W = Math.round(meta.width * SCALE);
const H = Math.round(meta.height * SCALE);
const { data } = await sharp(src)
  .resize(W, H, { kernel: "lanczos3" })
  .sharpen({ sigma: 0.6 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// 1. Backdrop: flood in from the border over near-white pixels.
const N = W * H;
const whiteDist = (i) => Math.hypot(255 - data[i], 255 - data[i + 1], 255 - data[i + 2]);
const bg = new Uint8Array(N);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
while (stack.length) {
  const p = stack.pop();
  if (bg[p]) continue;
  if (whiteDist(p * 4) > 34) continue;
  bg[p] = 1;
  const x = p % W;
  const y = (p / W) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < W - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - W);
  if (y < H - 1) stack.push(p + W);
}

// 2. Keep only the largest solid blob (drops stray specks of JPEG noise).
const label = new Int32Array(N).fill(-1);
const sizes = [];
for (let p = 0; p < N; p++) {
  if (bg[p] || label[p] >= 0) continue;
  const id = sizes.length;
  let n = 0;
  const st = [p];
  label[p] = id;
  while (st.length) {
    const q = st.pop();
    n++;
    const x = q % W;
    const y = (q / W) | 0;
    if (x > 0 && !bg[q - 1] && label[q - 1] < 0) { label[q - 1] = id; st.push(q - 1); }
    if (x < W - 1 && !bg[q + 1] && label[q + 1] < 0) { label[q + 1] = id; st.push(q + 1); }
    if (y > 0 && !bg[q - W] && label[q - W] < 0) { label[q - W] = id; st.push(q - W); }
    if (y < H - 1 && !bg[q + W] && label[q + W] < 0) { label[q + W] = id; st.push(q + W); }
  }
  sizes.push(n);
}
const biggest = sizes.indexOf(Math.max(...sizes));
const solid = new Uint8Array(N);
for (let p = 0; p < N; p++) solid[p] = label[p] === biggest ? 1 : 0;

// 3. Exact Euclidean distance to the solid shape (Felzenszwalb, two passes).
const INF = 1e20;
function edt1d(f, n, d, v, z) {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s;
    do {
      const r = v[k];
      s = (f[q] + q * q - (f[r] + r * r)) / (2 * q - 2 * r);
    } while (s <= z[k] && --k >= 0);
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    d[q] = (q - r) * (q - r) + f[r];
  }
}
const dist2 = new Float64Array(N);
for (let p = 0; p < N; p++) dist2[p] = solid[p] ? 0 : INF;
{
  const n = Math.max(W, H);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = dist2[y * W + x];
    edt1d(f, H, d, v, z);
    for (let y = 0; y < H; y++) dist2[y * W + x] = d[y];
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) f[x] = dist2[y * W + x];
    edt1d(f, W, d, v, z);
    for (let x = 0; x < W; x++) dist2[y * W + x] = d[x];
  }
}

// 4. Compose: warm every near-white toward ivory, ring = solid ivory, soft outer edge.
const out = Buffer.alloc(N * 4);
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let p = 0; p < N; p++) {
  const i = p * 4;
  const d = Math.sqrt(dist2[p]);
  const alpha = Math.max(0, Math.min(1, RING + 0.5 - d));
  if (alpha <= 0) continue;
  let r = data[i], g = data[i + 1], b = data[i + 2];
  if (d > 1.5) {
    [r, g, b] = IVORY;
  } else {
    const lo = Math.min(r, g, b);
    const sat = Math.max(r, g, b) - lo;
    const w = Math.max(0, Math.min(1, (lo - 170) / 85)) * Math.max(0, Math.min(1, 1 - sat / 60));
    r += w * (IVORY[0] - 255);
    g += w * (IVORY[1] - 255);
    b += w * (IVORY[2] - 255);
  }
  out[i] = Math.round(r);
  out[i + 1] = Math.round(g);
  out[i + 2] = Math.round(b);
  out[i + 3] = Math.round(alpha * 255);
  const x = p % W;
  const y = (p / W) | 0;
  if (x < minX) minX = x;
  if (x > maxX) maxX = x;
  if (y < minY) minY = y;
  if (y > maxY) maxY = y;
}

// 5. Body bounds (without the ring), for anchoring crops later.
let bx0 = W, by0 = H, bx1 = 0, by1 = 0;
for (let p = 0; p < N; p++) {
  if (!solid[p]) continue;
  const x = p % W;
  const y = (p / W) | 0;
  if (x < bx0) bx0 = x;
  if (x > bx1) bx1 = x;
  if (y < by0) by0 = y;
  if (y > by1) by1 = y;
}

const pad = 4;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(W, maxX + pad + 1) - Math.max(0, minX - pad),
  height: Math.min(H, maxY + pad + 1) - Math.max(0, minY - pad),
};
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, "sticker-canvas.png"));
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .extract(crop)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outDir, "sticker.png"));

const info = {
  canvas: { width: W, height: H },
  sticker: crop,
  body: { left: bx0, top: by0, right: bx1, bottom: by1, width: bx1 - bx0 + 1, height: by1 - by0 + 1 },
  ring: RING,
  specksDropped: sizes.length - 1,
};
fs.writeFileSync(path.join(outDir, "sticker.json"), JSON.stringify(info, null, 2));
console.log(JSON.stringify(info));
