// Sample pixel colors at known coordinates from the rendered PNG
// to learn what colors are actually shown for buttons/backgrounds.

import sharp from 'sharp';
import { resolve } from 'node:path';

const input = resolve(process.cwd(), 'scripts/.renders/full.png');

const samples = [
  // Buttons (empty pill area, away from text)
  ['hero CTA bg',              1095, 482],
  ['overlay APPLY pill bg',    1290, 1175],
  ['programs LEARN MORE bg',   1305, 2132],
  ['feature BOOK MEETING bg',  765,  3222],
  // Surfaces
  ['footer bg',                50,   3700],
  ['programs card outer band', 20,   2098],
  ['programs card inner bg',   50,   2125],
  ['overlay card bg',          770,  900],
  ['canvas bg (hero side)',    1100, 100],
  ['canvas bg (values area)',  720,  1335],
  // Text on dark
  ['core beliefs eyebrow',     50,   1340],
  ['big TRINITY wordmark',     150,  4030],
  ['italic 1st-letter glyph',  60,   3640],
  // Text on light
  ['headline 1st letter',      100,  220],
  ['nav text',                 920,  35],
  ['body text',                1110, 380],
];

const img = sharp(input);
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

const at = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  return { r, g, b, hex };
};

for (const [label, x, y] of samples) {
  const c = at(x, y);
  console.log(`${label.padEnd(35)} (${x},${y})  ${c.hex}  rgb(${c.r},${c.g},${c.b})`);
}
