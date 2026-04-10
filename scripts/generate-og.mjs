import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og-image.png');
const emblemPath = join(__dirname, '..', 'src', 'assets', 'images', 'emblem-cream.png');

// Brand tokens (matching tailwind.config.mjs)
const brand = '#003622';
const cream = '#fbf5e3';
const action = '#64ff5f';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <!-- Brand green background -->
  <rect width="1200" height="630" fill="${brand}"/>

  <!-- Subtle vertical column dividers (echoing the site's grid) -->
  <line x1="300" y1="0" x2="300" y2="630" stroke="${cream}" stroke-opacity="0.08" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="${cream}" stroke-opacity="0.08" stroke-width="1"/>
  <line x1="900" y1="0" x2="900" y2="630" stroke="${cream}" stroke-opacity="0.08" stroke-width="1"/>

  <!-- "Truth. Goodness. Beauty." — italic serif, the hero headline -->
  <text x="600" y="230" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-style="italic" font-size="80" font-weight="400"
        fill="${cream}" letter-spacing="-1">
    Truth. Goodness. Beauty.
  </text>

  <!-- Thin divider line -->
  <line x1="480" y1="275" x2="720" y2="275" stroke="${action}" stroke-opacity="0.6" stroke-width="2"/>

  <!-- "TRINITY CLASSICAL ACADEMY" — mono small-caps eyebrow -->
  <text x="600" y="340" text-anchor="middle"
        font-family="'Courier New', Courier, monospace"
        font-size="16" font-weight="600"
        fill="${action}" letter-spacing="6">
    TRINITY CLASSICAL ACADEMY
  </text>

  <!-- Tagline -->
  <text x="600" y="390" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="22" font-weight="400"
        fill="${cream}" opacity="0.7">
    Classical Christian Education in Birmingham, Alabama
  </text>
</svg>`;

// Render the SVG text card
const cardBuf = await sharp(Buffer.from(svg)).png().toBuffer();

// Composite the cream emblem centered below the tagline
try {
  const emblem = await sharp(emblemPath)
    .resize({ height: 60, withoutEnlargement: true })
    .toBuffer();

  const final = await sharp(cardBuf)
    .composite([{ input: emblem, gravity: 'south', top: 470, left: 570 }])
    .png()
    .toBuffer();

  writeFileSync(out, final);
} catch {
  // If emblem compositing fails, write the card without it
  writeFileSync(out, cardBuf);
}

console.log('Wrote', out);
