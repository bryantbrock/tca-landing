// Helper to crop a tight rectangle from the rendered full PNG
// usage: node scripts/zoom.mjs <left> <top> <width> <height> <out>

import sharp from 'sharp';
import { resolve } from 'node:path';

const [, , left, top, width, height, out] = process.argv;
const input = resolve(process.cwd(), 'scripts/.renders/full.png');
const outPath = resolve(process.cwd(), 'scripts/.renders', out);

await sharp(input)
  .extract({
    left: parseInt(left, 10),
    top: parseInt(top, 10),
    width: parseInt(width, 10),
    height: parseInt(height, 10),
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);
console.log(`Wrote ${outPath}`);
