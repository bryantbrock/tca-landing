// Extract every <image> data: URI from the Figma SVG export to public/images/.
// We use a streaming line scanner because the file is 43 MB.

import { createReadStream, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

const filePath = resolve(process.cwd(), 'docs/Desktop _ Home.svg');
const outDir = resolve(process.cwd(), 'public/images');
mkdirSync(outDir, { recursive: true });

// We need to handle <image> tags that may span lines, but Figma usually
// emits each element on its own line. Read line-by-line and look for tags.

const rl = createInterface({
  input: createReadStream(filePath, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

let buffer = '';
let inImage = false;
let count = 0;

for await (const line of rl) {
  if (!inImage) {
    const idx = line.indexOf('<image');
    if (idx >= 0) {
      inImage = true;
      buffer = line.slice(idx);
    }
  } else {
    buffer += line;
  }
  if (inImage && buffer.includes('/>')) {
    // Got a full <image .../> tag
    const hrefMatch = buffer.match(/(?:xlink:)?href="(data:image\/([a-z]+);base64,([^"]+))"/);
    const widthMatch = buffer.match(/\swidth="([^"]+)"/);
    const heightMatch = buffer.match(/\sheight="([^"]+)"/);
    if (hrefMatch) {
      const ext = hrefMatch[2];
      const b64 = hrefMatch[3];
      const w = widthMatch?.[1] ?? '?';
      const h = heightMatch?.[1] ?? '?';
      const filename = `image${count}-${w}x${h}.${ext}`;
      const out = resolve(outDir, filename);
      writeFileSync(out, Buffer.from(b64, 'base64'));
      console.log(`wrote ${out}`);
      count++;
    }
    buffer = '';
    inImage = false;
  }
}

console.log(`\nExtracted ${count} images.`);
