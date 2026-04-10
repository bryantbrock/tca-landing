import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out       = join(__dirname, '..', 'public', 'og-image.png');
const emblemPath = join(__dirname, '..', 'src', 'assets', 'images', 'emblem-cream.png');

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const brand       = '#003622';  // deep green
const cream       = '#fbf5e3';  // warm off-white
const action      = '#64ff5f';  // lime CTA
const brandAccent = '#276d33';  // mid green (used subtly)

// ─── Grid ─────────────────────────────────────────────────────────────────────
// 1200 × 630 canvas.
// 4-col grid matching the site's 25/50/75% layout:
//   Col dividers: x=300, x=600, x=900
//   Left margin: x=72  (≈ lg:px-12 scaled from 1440→1200)
//   Right margin: x=1128
//
// Layout:
//   Headline zone:   x=72 … x=900  (cols 1-3, left 75%)
//   Right panel:     x=916 … x=1128  (col 4, right 25%)
//   TRINITY wm:      full-bleed bottom, bleeds off canvas
// ─────────────────────────────────────────────────────────────────────────────

// Headline: 3 stacked lines of italic uppercase serif.
// We use 155px — at that size "BEAUTY." comfortably fits in ~700px,
// and all three lines fit vertically with tight 0.95 leading.
//
// Vertical math (y = baseline):
//   top pad 78px + font-size 155 = line1Y 233
//   line2Y = 233 + 155×0.95    = 380
//   line3Y = 380 + 155×0.95    = 527
//
// All three baselines are inside the 630px canvas (527 + descenders ≈ 570 < 630).

const hs = 155;                     // hero font-size
const hx = 72;                      // hero left x
const l1 = 78 + hs;                 // 233
const l2 = l1 + Math.round(hs * 0.95); // 380
const l3 = l2 + Math.round(hs * 0.95); // 527

// Right panel x — start 16px past the 75% divider
const rx = 916;
const rw = 1128 - rx;               // ≈ 212px

// TRINITY watermark: giant text bleeding off bottom edge, anchored left.
// At 330px tall it spans roughly the lower half of the card.
const ts = 330;

// ─── SVG ──────────────────────────────────────────────────────────────────────
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">

  <!-- ═══ 0. BACKGROUND ═══ -->
  <rect width="1200" height="630" fill="${brand}"/>

  <!-- ═══ 1. TRINITY WATERMARK ═══
       Giant italic serif spanning the lower ~60% of the canvas, bleeding off
       the bottom edge. This mirrors the footer's massive "TRINITY" wordmark.
       The text is cream at very low opacity so it reads as structural texture —
       it shouldn't compete with the headline. We use overflow visible (default
       for SVG text) so it bleeds naturally past the viewport. -->
  <text
    x="${hx - 6}"
    y="700"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="italic"
    font-size="${ts}"
    font-weight="400"
    fill="${cream}"
    opacity="0.085"
    letter-spacing="-10"
  >TRINITY</text>

  <!-- ═══ 2. COLUMN DIVIDERS ═══
       Vertical hairlines at 25/50/75% of canvas width, cream/15 on brand green,
       matching the footer's cream dividers (bg-cream/15). -->
  <line x1="300" y1="0" x2="300" y2="630" stroke="${cream}" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="600" y1="0" x2="600" y2="630" stroke="${cream}" stroke-opacity="0.15" stroke-width="1"/>
  <line x1="900" y1="0" x2="900" y2="630" stroke="${cream}" stroke-opacity="0.15" stroke-width="1"/>

  <!-- ═══ 3. EYEBROW ═══
       Short lime rule + mono uppercase eyebrow above the headline.
       Matches: font-mono text-xs tracking-eyebrow text-action (footer headers). -->
  <line
    x1="${hx}" y1="46"
    x2="${hx + 36}" y2="46"
    stroke="${action}" stroke-width="2"
  />
  <text
    x="${hx}" y="62"
    font-family="'Courier New', Courier, monospace"
    font-size="11" font-weight="600"
    fill="${action}" letter-spacing="2.5"
  >TRINITY CLASSICAL ACADEMY</text>

  <!-- ═══ 4. HEADLINE — TRUTH. / GOODNESS. / BEAUTY. ═══
       Three stacked lines, uppercase italic serif, left-aligned.
       Matches the Hero component: font-display italic uppercase leading-[0.95] tracking-tight. -->
  <text
    x="${hx}" y="${l1}"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="italic" font-size="${hs}" font-weight="400"
    fill="${cream}" letter-spacing="-4" text-anchor="start"
  >TRUTH.</text>

  <text
    x="${hx}" y="${l2}"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="italic" font-size="${hs}" font-weight="400"
    fill="${cream}" letter-spacing="-4" text-anchor="start"
  >GOODNESS.</text>

  <text
    x="${hx}" y="${l3}"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="italic" font-size="${hs}" font-weight="400"
    fill="${cream}" letter-spacing="-4" text-anchor="start"
  >BEAUTY.</text>

  <!-- ═══ 5. RIGHT PANEL ═══
       Narrow column in the 4th grid slot (x=916–1128).
       Sits aligned with the 75% column divider — like the footer's col 4
       (GET IN TOUCH / FOR FAMILIES). This is the right detail column.

       Panel structure (top-to-bottom):
         46px  — lime rule
         62px  — "CLASSICAL CHRISTIAN" eyebrow label
         82px  — separator rule
         96px  — "EST. 2026" + address block
         274px — separator rule
         292px — "LEARN MORE" lime pill
         —     — (emblem composited at bottom via sharp)
  -->

  <!-- Short lime rule at same vertical position as left eyebrow rule -->
  <line
    x1="${rx}" y1="46"
    x2="${rx + 24}" y2="46"
    stroke="${action}" stroke-width="2"
  />

  <!-- Italic display serif headline — "Classical / Christian / Education" -->
  <text
    x="${rx}" y="70"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="italic" font-size="20" font-weight="400"
    fill="${cream}" opacity="0.90" text-anchor="start"
  >
    <tspan x="${rx}" dy="0">Classical</tspan>
    <tspan x="${rx}" dy="26">Christian</tspan>
    <tspan x="${rx}" dy="26">Education</tspan>
  </text>

  <!-- Upright serif body detail -->
  <text
    x="${rx}" y="170"
    font-family="Georgia, 'Times New Roman', serif"
    font-style="normal" font-size="15" font-weight="400"
    fill="${cream}" opacity="0.55" text-anchor="start"
  >
    <tspan x="${rx}" dy="0">Birmingham,</tspan>
    <tspan x="${rx}" dy="22">Alabama.</tspan>
  </text>

  <!-- Separator rule -->
  <line
    x1="${rx}" y1="222"
    x2="${rx + rw}" y2="222"
    stroke="${cream}" stroke-opacity="0.18" stroke-width="1"
  />

  <!-- EST. label — lime mono eyebrow -->
  <text
    x="${rx}" y="240"
    font-family="'Courier New', Courier, monospace"
    font-size="9" font-weight="600"
    fill="${action}" letter-spacing="2" opacity="1"
  >EST. 2026</text>

  <!-- Address block in mono -->
  <text
    x="${rx}" y="260"
    font-family="'Courier New', Courier, monospace"
    font-size="9" font-weight="400"
    fill="${cream}" opacity="0.45" letter-spacing="0.3"
  >
    <tspan x="${rx}" dy="0">7160 Cahaba Valley Rd</tspan>
    <tspan x="${rx}" dy="15">Birmingham, AL 35242</tspan>
  </text>

  <!-- Separator rule -->
  <line
    x1="${rx}" y1="302"
    x2="${rx + rw}" y2="302"
    stroke="${cream}" stroke-opacity="0.18" stroke-width="1"
  />

  <!-- "LEARN MORE" lime pill CTA -->
  <rect
    x="${rx}" y="318"
    width="${rw}" height="34"
    rx="8"
    fill="${action}" opacity="0.95"
  />
  <text
    x="${rx + rw / 2}" y="340"
    font-family="'Courier New', Courier, monospace"
    font-size="9" font-weight="600"
    fill="#1e1e1e" letter-spacing="2.5"
    text-anchor="middle"
  >LEARN MORE</text>

  <!-- Separator rule above URL -->
  <line
    x1="${rx}" y1="370"
    x2="${rx + rw}" y2="370"
    stroke="${cream}" stroke-opacity="0.18" stroke-width="1"
  />

  <!-- URL — tiny mono, very muted -->
  <text
    x="${rx}" y="388"
    font-family="'Courier New', Courier, monospace"
    font-size="8" font-weight="400"
    fill="${cream}" opacity="0.30" letter-spacing="0.5"
  >
    <tspan x="${rx}" dy="0">TRINITYCLASSICAL</tspan>
    <tspan x="${rx}" dy="13">.ACADEMY</tspan>
  </text>

</svg>`;

// ─── Render pipeline ──────────────────────────────────────────────────────────

// 1. SVG → PNG buffer
const cardBuf = await sharp(Buffer.from(svg)).png().toBuffer();

// 2. Composite cream emblem — in the right panel below the URL block.
//    Resize to 56px tall for good visual weight in the lower panel zone.
try {
  const emblemResized = await sharp(emblemPath)
    .resize({ height: 56, withoutEnlargement: true })
    .toBuffer();

  const { width: emblemW = 56 } = await sharp(emblemPath)
    .resize({ height: 56, withoutEnlargement: true })
    .metadata();

  // Place emblem in the right panel below the URL label (~y=415)
  // so it occupies the remaining vertical space in the panel.
  // Centered horizontally within the right panel (rx … rx+rw).
  const emblemLeft = Math.round(rx + (rw - emblemW) / 2);
  const emblemTop  = 440;

  const final = await sharp(cardBuf)
    .composite([{ input: emblemResized, left: emblemLeft, top: emblemTop }])
    .png()
    .toBuffer();

  writeFileSync(out, final);
} catch (err) {
  console.warn('Emblem compositing skipped:', err.message);
  writeFileSync(out, cardBuf);
}

console.log('Wrote', out);
