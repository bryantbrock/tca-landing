// Optimize the raw extracted images into web-ready sizes named for their use.
// Outputs go to public/images/ alongside the originals (which we delete after).

import sharp from 'sharp';
import { resolve } from 'node:path';
import { unlinkSync, existsSync } from 'node:fs';

const dir = resolve(process.cwd(), 'public/images');

// Source → output mapping. The "fit" rect is the largest size we'd ever
// render at — Cards 438×292 max, hero band 1440×666, feature 720×536.
// We bake in 2x for retina.
const work = [
  { src: 'image1-768x432.png',   out: 'hero-band.jpg',     w: 2880, h: 1332 }, // 1440×666 ×2
  { src: 'image2-2670x1780.png', out: 'cohort.jpg',        w: 876,  h: 584 },  // 438×292 ×2
  { src: 'image3-1587x2381.png', out: 'week.jpg',          w: 876,  h: 584 },
  { src: 'image4-760x985.png',   out: 'foundation.jpg',    w: 876,  h: 584 },
  { src: 'image5-1328x690.png',  out: 'creation.jpg',      w: 1440, h: 1072 }, // 720×536 ×2
];

for (const job of work) {
  const inPath = resolve(dir, job.src);
  const outPath = resolve(dir, job.out);
  await sharp(inPath)
    .resize(job.w, job.h, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);
  console.log(`wrote ${job.out}`);
}

// Remove the raw extracts to keep public/ tidy
const raws = [
  'image0-4096x2731.png',
  'image1-768x432.png',
  'image2-2670x1780.png',
  'image3-1587x2381.png',
  'image4-760x985.png',
  'image5-1328x690.png',
];
for (const r of raws) {
  const p = resolve(dir, r);
  if (existsSync(p)) {
    unlinkSync(p);
    console.log(`removed ${r}`);
  }
}
