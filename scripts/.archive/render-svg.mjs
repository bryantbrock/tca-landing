// Render the large Figma SVG export to several PNGs so the assistant
// can actually read the outlined-text content and measure layout.
//
// Outputs written to scripts/.renders/ :
//   full.png      — 0.3x scale of the whole page (overview)
//   s1.png ... s6.png — full-width slices at 1.0x for reading text
//
// Sharp handles SVG input directly via librsvg.

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const input = resolve(process.cwd(), 'docs/Desktop _ Home.svg');
const outDir = resolve(process.cwd(), 'scripts/.renders');
mkdirSync(outDir, { recursive: true });

// Canvas is 1440 × 4244. We know from the parser pass.
const W = 1440;
const H = 4244;

// Section y-ranges inferred from the rect dump.
// These are intentionally generous — we want each slice to overlap its neighbours.
const slices = [
  { name: 's1-header-hero', y: 0,    h: 600 },
  { name: 's2-image-band',  y: 560,  h: 720 },   // 589–1255 w/ overlay card
  { name: 's3-values',      y: 1240, h: 760 },   // 1381 + 1736 text blocks
  { name: 's4-programs',    y: 2020, h: 820 },   // 2094 bordered card + 3 cards
  { name: 's5-feature',     y: 2820, h: 700 },   // 2887 image + 2920/3212 text
  { name: 's6-footer',      y: 3500, h: 744 },   // 3532 footer
];

async function renderFull(scale) {
  const out = resolve(outDir, `full-${scale}x.png`);
  await sharp(input, { density: Math.round(96 * scale) })
    .resize(Math.round(W * scale), Math.round(H * scale), { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`Wrote ${out}`);
}

async function renderSlice(slice, scale = 1) {
  const out = resolve(outDir, `${slice.name}.png`);
  // Render whole page at desired density, then extract the slice
  await sharp(input, { density: Math.round(96 * scale) })
    .resize(Math.round(W * scale), Math.round(H * scale), { fit: 'fill' })
    .extract({
      left: 0,
      top: Math.round(slice.y * scale),
      width: Math.round(W * scale),
      height: Math.round(Math.min(slice.h, H - slice.y) * scale),
    })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`Wrote ${out}`);
}

(async () => {
  try {
    // Overview — small
    await renderFull(0.3);
    // Slices — at 1x so text is crisp
    for (const s of slices) {
      await renderSlice(s, 1);
    }
    console.log('Done.');
  } catch (err) {
    console.error('Render failed:', err);
    process.exit(1);
  }
})();
