// 6.1.0: intermediate 576 px portrait variant. On phones a 300 px card at
// DPR 1.75–2 asked for the 768 px file (≈250 KB); 576 px is enough and weighs
// about half. Made from the 768 px variant, so it does not need the originals.
// Usage: node scripts/assets/portrait-576.mjs [--data src/data/imageVariants.js]
import fs from 'node:fs/promises';
import sharp from 'sharp';

const dataFile = process.argv.includes('--data') ? process.argv[process.argv.indexOf('--data') + 1] : 'src/data/imageVariants.js';
const variants = JSON.parse((await fs.readFile(dataFile, 'utf8')).replace(/^export const IMAGE_VARIANTS = /, '').replace(/;\s*$/, ''));
let made = 0;
for (const entry of Object.values(variants)) {
  const largest = entry.variants.at(-1);
  if (largest.width !== 768 || entry.variants.some(v => v.width === 576)) continue;
  const src = largest.src.replace(/-768\.webp$/, '-576.webp');
  await sharp(`public${largest.src}`).resize({width: 576}).webp({quality: 78}).toFile(`public${src}`);
  entry.variants.splice(-1, 0, {src, width: 576});
  made++;
}
await fs.writeFile(dataFile, `export const IMAGE_VARIANTS = ${JSON.stringify(variants)};\n`);
console.log(`${made} variants of 576 px`);
