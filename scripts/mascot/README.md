# Mascot pipeline

How the files in `public/mascot/`, the favicons and `src/styles/mascot-moves.css` were made.
Run these again when the mascot artwork changes.

The scripts need [sharp](https://sharp.pixelplumbing.com), which is not a project dependency:

```bash
npm install --no-save sharp
```

## 1. Cut the sticker

The source is the mascot on a plain white background (the current files came from a 1024 px image).

```bash
node scripts/mascot/sticker.mjs path/to/mascot.png .mascot-work --scale 2 --ring 22
```

This upscales the art, removes the white backdrop by flooding in from the edges (so teeth, shoe
stripes and the cap drawings stay), warms the remaining whites to the palette ivory, and adds an
ivory edge around the silhouette. The edge is what lets the black cap and sneakers read on the
dark page. It writes `sticker.png`, `sticker-canvas.png` and `sticker.json` to the work folder.

## 2. Export the site files

```bash
node scripts/mascot/exports.mjs .mascot-work public
```

| File | Used for |
|---|---|
| `public/mascot/estrella-{480,960}.{avif,webp}` | The star in the hero, on the contact poster and on the 404 pages |
| `public/mascot/estrella-og.png` | The social card (`api/og.tsx`) |
| `public/mascot/badge-{96,192}.webp` | The logo: nav bar and section headings |
| `public/icon-{192,512}.png`, `public/apple-touch-icon.png`, `public/favicon.ico` | Browser and home-screen icons |

If the new art has a different pose, check two numbers by eye: `HEAD` in `exports.mjs` (the circle
the badge is cut from) and the `ground` value the script prints (where the feet are; it is the
`transform-origin` in `moves-to-css.mjs`).

## 3. The moves

The star's moves (pop in, idle sway, wave, jump, flinch, tap squish) come from Mascot Designer's
movement library, ported to CSS keyframes so the site needs no animation runtime:

```bash
node scripts/mascot/moves-to-css.mjs path/to/mascot-designer/runtime/motion.json > src/styles/mascot-moves.css
```
