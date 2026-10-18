// Variantes WebP de retratos y su registro en src/data/imageVariants.js (proceso de la V5.18).
// Uso: node scripts/assets/portrait-variants.mjs <carpeta-originales> [--public public] [--data src/data/imageVariants.js]
// Cada original se llama <ID>.<webp|jpg|png>; genera <ID>-<ancho>.webp en personas-img/responsive con
// 96, 192 y 384 px (solo los menores que el original) más el ancho original con un máximo de 768 px.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : fallback; };
const publicDir = option('--public', 'public'), dataFile = option('--data', 'src/data/imageVariants.js');
const [sourceDir] = args;
if (!sourceDir) { console.error('Indica la carpeta de originales.'); process.exit(1); }

const variantWidths = width => [...[96, 192, 384].filter(w => w < Math.min(width, 768)), Math.min(width, 768)];

const dataText = await fs.readFile(dataFile, 'utf8');
const variants = JSON.parse(dataText.replace(/^export const IMAGE_VARIANTS = /, '').replace(/;\s*$/, ''));
const outDir = path.join(publicDir, 'personas-img', 'responsive');
await fs.mkdir(outDir, {recursive: true});
for (const name of (await fs.readdir(sourceDir)).filter(f => /\.(webp|jpe?g|png)$/i.test(f)).sort()) {
  const id = name.replace(/\.[^.]+$/, ''), input = path.join(sourceDir, name);
  const {width, height} = await sharp(input).metadata();
  const entry = {width, height, variants: []};
  for (const w of variantWidths(width)) {
    const file = `${id}-${w}.webp`;
    await sharp(input).resize({width: w}).webp({quality: 82}).toFile(path.join(outDir, file));
    entry.variants.push({src: `/personas-img/responsive/${file}`, width: w});
  }
  variants[`/personas-img/${id}.webp`] = entry;
  console.log(`${id}: ${entry.variants.map(v => v.width).join(', ')} px`);
}
const sorted = Object.fromEntries(Object.entries(variants).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
await fs.writeFile(dataFile, `export const IMAGE_VARIANTS = ${JSON.stringify(sorted)};\n`);
