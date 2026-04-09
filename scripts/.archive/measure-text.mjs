// Measure cap heights of glyphs at known x/y by walking pixels
// vertically and finding dark→light/light→dark transitions.

import sharp from 'sharp';
import { resolve } from 'node:path';

const input = resolve(process.cwd(), 'scripts/.renders/full.png');
const img = sharp(input);
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

const at = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return data[i]; // grayscale-ish (just take R)
};

// Probe column x from yStart to yEnd; return [topDark, bottomDark]
function darkRange(x, yStart, yEnd, threshold = 100) {
  let top = -1, bot = -1;
  for (let y = yStart; y <= yEnd; y++) {
    if (at(x, y) < threshold) {
      if (top === -1) top = y;
      bot = y;
    }
  }
  return { top, bot, h: bot - top + 1 };
}

const probes = [
  { name: 'HERO "T" of TRUTH stem',         x: 60,   y0: 100,  y1: 320 },
  { name: 'HERO "G" of GOODNESS left',      x: 50,   y0: 280,  y1: 470 },
  { name: 'TRINITY italic "T"',             x: 80,   y0: 600,  y1: 800 },
  { name: 'CORE BELIEFS heading "W"',       x: 30,   y0: 1380, y1: 1500 },
  { name: 'value heading italic "N" One',   x: 740,  y0: 1390, y1: 1480 },
  { name: 'value body row',                 x: 740,  y0: 1530, y1: 1560 },
  { name: 'How it Works italic "H"',        x: 35,   y0: 2100, y1: 2160 },
  { name: 'programs body row',              x: 740,  y0: 2125, y1: 2150 },
  { name: 'Were not filling seats W',       x: 750,  y0: 2935, y1: 3010 },
  { name: 'TRINITY footer huge T stem',     x: 50,   y0: 3850, y1: 4150 },
  { name: 'footer italic Trinity body',     x: 30,   y0: 3640, y1: 3680 },
  { name: 'footer eyebrow OUR SCHOOL',      x: 740,  y0: 3680, y1: 3700 },
];

for (const p of probes) {
  const r = darkRange(p.x, p.y0, p.y1);
  console.log(`${p.name.padEnd(40)} x=${p.x}  topY=${r.top}  botY=${r.bot}  height=${r.h}px`);
}
