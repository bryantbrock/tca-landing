// Slice the rendered full page PNG into section-sized pieces so that
// they can be viewed and measured one at a time.

import sharp from 'sharp';
import { resolve } from 'node:path';

const input = resolve(process.cwd(), 'scripts/.renders/full.png');
const outDir = resolve(process.cwd(), 'scripts/.renders');

const slices = [
  { name: 's1-header-hero', y: 0,    h: 600 },
  { name: 's2-image-band',  y: 560,  h: 720 },
  { name: 's3-values',      y: 1240, h: 780 },
  { name: 's4-programs',    y: 2020, h: 820 },
  { name: 's5-feature',     y: 2820, h: 720 },
  { name: 's6-footer',      y: 3500, h: 744 },
];

const meta = await sharp(input).metadata();
console.log(`Source: ${meta.width}×${meta.height}`);

for (const s of slices) {
  const height = Math.min(s.h, meta.height - s.y);
  // Full resolution full-width slice
  const out = resolve(outDir, `${s.name}.png`);
  await sharp(input)
    .extract({ left: 0, top: s.y, width: meta.width, height })
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`Wrote ${out}  (${meta.width}×${height})`);
  // Left/right halves for closer reading where needed
  const half = Math.floor(meta.width / 2);
  await sharp(input)
    .extract({ left: 0, top: s.y, width: half, height })
    .png({ compressionLevel: 9 })
    .toFile(resolve(outDir, `${s.name}-L.png`));
  await sharp(input)
    .extract({ left: half, top: s.y, width: meta.width - half, height })
    .png({ compressionLevel: 9 })
    .toFile(resolve(outDir, `${s.name}-R.png`));
}
