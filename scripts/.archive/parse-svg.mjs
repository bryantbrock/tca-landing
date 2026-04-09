// Streaming parser for the large Figma SVG export.
// Pulls out structure clues even though text is outlined to paths.

import { createReadStream, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve(process.cwd(), 'docs/Desktop _ Home.svg');
const size = statSync(filePath).size;
console.log(`File: ${filePath}`);
console.log(`Size: ${(size / 1024 / 1024).toFixed(2)} MB`);

const colorCounts = new Map();
const strokeColors = new Map();
const allRects = [];
const allClipPaths = [];
const groupIds = [];
const titles = [];
const ariaLabels = [];
const descs = [];
const dataNames = [];
const imageHrefs = [];
const transforms = []; // {transform, nearbyContent}
const linearGradients = [];
const filterIds = new Set();

// rough heuristic: capture comment-like structure markers
const allRectsLite = [];

let buffer = '';

const stream = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 1 << 20 });

const FILL_RE = /fill="(#[0-9a-fA-F]{3,8})"/g;
const STROKE_RE = /stroke="(#[0-9a-fA-F]{3,8})"/g;
const STOP_COLOR_RE = /stop-color="(#[0-9a-fA-F]{3,8})"/g;

const TITLE_RE = /<title[^>]*>([^<]+)<\/title>/g;
const DESC_RE  = /<desc[^>]*>([^<]+)<\/desc>/g;
const ARIA_RE  = /aria-label="([^"]+)"/g;
const ID_RE    = /\bid="([^"]+)"/g;
const DATA_NAME_RE = /data-name="([^"]+)"/g;

const IMAGE_TAG_RE = /<image\b[^>]*?>/g;
const HREF_RE = /(?:xlink:)?href="([^"]+)"/;
const RECT_TAG_RE = /<rect\b[^>]*?\/?>/g;

function tally(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function processChunk(chunk) {
  for (const m of chunk.matchAll(FILL_RE)) tally(colorCounts, m[1].toLowerCase());
  for (const m of chunk.matchAll(STROKE_RE)) tally(strokeColors, m[1].toLowerCase());
  for (const m of chunk.matchAll(STOP_COLOR_RE)) tally(colorCounts, m[1].toLowerCase());

  for (const m of chunk.matchAll(TITLE_RE)) titles.push(m[1]);
  for (const m of chunk.matchAll(DESC_RE)) descs.push(m[1]);
  for (const m of chunk.matchAll(ARIA_RE)) ariaLabels.push(m[1]);
  for (const m of chunk.matchAll(ID_RE)) groupIds.push(m[1]);
  for (const m of chunk.matchAll(DATA_NAME_RE)) dataNames.push(m[1]);

  for (const tag of chunk.matchAll(IMAGE_TAG_RE)) {
    const t = tag[0];
    const href = (t.match(HREF_RE) ?? [])[1] ?? '';
    const x = parseFloat((t.match(/\sx="([^"]+)"/) ?? [])[1] ?? '0');
    const y = parseFloat((t.match(/\sy="([^"]+)"/) ?? [])[1] ?? '0');
    const w = parseFloat((t.match(/\swidth="([^"]+)"/) ?? [])[1] ?? '0');
    const h = parseFloat((t.match(/\sheight="([^"]+)"/) ?? [])[1] ?? '0');
    const transform = (t.match(/\stransform="([^"]+)"/) ?? [])[1];
    imageHrefs.push({ x, y, w, h, transform, hrefPrefix: href.slice(0, 80) });
  }

  for (const tag of chunk.matchAll(RECT_TAG_RE)) {
    const t = tag[0];
    const x = parseFloat((t.match(/\sx="([^"]+)"/) ?? [])[1] ?? '0');
    const y = parseFloat((t.match(/\sy="([^"]+)"/) ?? [])[1] ?? '0');
    const w = parseFloat((t.match(/\swidth="([^"]+)"/) ?? [])[1] ?? '0');
    const h = parseFloat((t.match(/\sheight="([^"]+)"/) ?? [])[1] ?? '0');
    const fill = ((t.match(/\sfill="([^"]+)"/) ?? [])[1] ?? '').toLowerCase();
    const stroke = ((t.match(/\sstroke="([^"]+)"/) ?? [])[1] ?? '').toLowerCase();
    const rx = parseFloat((t.match(/\srx="([^"]+)"/) ?? [])[1] ?? '0');
    const transform = (t.match(/\stransform="([^"]+)"/) ?? [])[1];
    allRectsLite.push({ x, y, w, h, fill, stroke, rx, transform });
  }
}

stream.on('data', (chunk) => {
  const combined = buffer + chunk;
  const safeEnd = combined.length - 8192;
  const toScan = safeEnd > 0 ? combined.slice(0, safeEnd) : combined;
  buffer = safeEnd > 0 ? combined.slice(safeEnd) : '';
  processChunk(toScan);
});

stream.on('end', () => {
  if (buffer) processChunk(buffer);

  const sortByCount = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]);

  console.log('\n=== COLORS ===');
  for (const [hex, c] of sortByCount(colorCounts)) console.log(`${hex}  ${c}`);

  console.log('\n=== STROKE COLORS ===');
  for (const [hex, c] of sortByCount(strokeColors)) console.log(`${hex}  ${c}`);

  console.log(`\n=== TITLES (${titles.length}) ===`);
  titles.slice(0, 30).forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== DESCS (${descs.length}) ===`);
  descs.slice(0, 30).forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== ARIA-LABELS (${ariaLabels.length}) ===`);
  ariaLabels.slice(0, 30).forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== DATA-NAMES (${dataNames.length}) — first 60 ===`);
  dataNames.slice(0, 60).forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== IDs (${groupIds.length}) — first 60 ===`);
  groupIds.slice(0, 60).forEach((t) => console.log(`  ${t}`));

  console.log(`\n=== IMAGES (${imageHrefs.length}) ===`);
  imageHrefs.forEach((i) =>
    console.log(`  x=${i.x} y=${i.y} ${i.w}×${i.h}  transform=${i.transform ?? '-'}  href=${i.hrefPrefix}`),
  );

  // Show rects sorted by y, but only "interesting" ones (not 0×0 etc.)
  const interesting = allRectsLite
    .filter((r) => r.w >= 20 && r.h >= 20)
    .sort((a, b) => a.y - b.y);
  console.log(`\n=== ALL RECTS (w≥20 h≥20) — count: ${interesting.length} ===`);
  for (const r of interesting) {
    const t = r.transform ? `T:${r.transform}` : '';
    console.log(
      `y=${r.y.toFixed(0).padStart(5)} x=${r.x.toFixed(0).padStart(5)} ${r.w.toFixed(0).padStart(5)}×${r.h.toFixed(0).padEnd(5)} fill=${r.fill || '-'} stroke=${r.stroke || '-'} rx=${r.rx} ${t}`,
    );
  }

  // Persist the rect dump too for follow-up tooling
  writeFileSync(
    resolve(process.cwd(), 'scripts/.svg-rects.json'),
    JSON.stringify(interesting, null, 2),
  );
});
