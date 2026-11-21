// 6.0.12: colour pairs that touch on the common map and are hard to tell apart.
// Renders the mosaic of several years with crisp edges and compares the colours
// on each side of every border (CIE76 ΔE). Identical colours are deliberate
// (one sovereign, one colour) and are not reported.
// Usage: node scripts/audits/audit-map-palette.mjs [ΔE=12] [years…]
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {PERSONAS} from '../../src/data/personas.js';
import {europeMosaicAt} from '../../src/cartography/europePanorama.js';
import {deltaE} from '../lib/colorDistance.mjs';

const [limitArg, ...yearArgs] = process.argv.slice(2);
const LIMIT = Number(limitArg) || 12;
const YEARS = yearArgs.length ? yearArgs.map(Number) : [1250, 1300, 1350, 1400, 1453, 1500, 1556, 1600, 1648, 1714, 1789];
const SVG = (await fs.readFile('data/cartography/euv-locations-crop.svg', 'utf8')).replace(/ style="fill:#d8d6ce;stroke:#d8d6ce;stroke-width:0\.08"/g, '');
const data = {...JSON.parse(await fs.readFile('data/cartography/corridor-locations.json', 'utf8')), burgundy: JSON.parse(await fs.readFile('data/cartography/burgundian-locations.json', 'utf8'))};


const pairs = new Map();
for (const year of YEARS) {
  const mosaic = europeMosaicAt(data, year, PERSONAS);
  // Each layer gets a unique index colour so borders are exact.
  const indexOf = new Map(), layers = [];
  const colorOf = new Map();
  for (const [id, matches] of mosaic.byLocation) {
    const layer = matches[0], key = `${layer.mosaicColor}|${layer.politicalLabel || layer.displayName || layer.name}`;
    if (!indexOf.has(key)) { indexOf.set(key, layers.length + 1); layers.push({color: layer.mosaicColor, label: layer.politicalLabel || layer.displayName || layer.name}); }
    colorOf.set(id, indexOf.get(key));
  }
  const code = n => `#${n.toString(16).padStart(6, '0')}`;
  const svg = SVG.replace('<svg ', '<svg shape-rendering="crispEdges" ').replace(/<path id="([^"]+)" fill="#d8d6ce" stroke="#d8d6ce"/g, (m, id) => {
    const c = colorOf.has(id) ? code(colorOf.get(id)) : '#000000';
    return `<path id="${id}" fill="${c}" stroke="${c}"`;
  });
  const {data: px, info} = await sharp(Buffer.from(svg), {density: 300}).resize({width: 1600, kernel: 'nearest'}).raw().toBuffer({resolveWithObject: true});
  const at = (x, y) => { const i = (y * info.width + x) * info.channels; return (px[i] << 16) | (px[i + 1] << 8) | px[i + 2]; };
  for (let y = 0; y < info.height - 1; y++) for (let x = 0; x < info.width - 1; x++) {
    const a = at(x, y);
    for (const b of [at(x + 1, y), at(x, y + 1)]) {
      if (a === b || !a || !b || a > layers.length || b > layers.length) continue;
      const A = layers[a - 1], B = layers[b - 1];
      if (A.color.toLowerCase() === B.color.toLowerCase()) continue;
      const d = deltaE(A.color, B.color);
      if (d >= LIMIT) continue;
      const key = [A.label, B.label].sort().join(' ↔ ');
      const entry = pairs.get(key) || {d, colors: [A.color, B.color], years: new Set(), border: 0};
      entry.years.add(year); entry.border++; pairs.set(key, entry);
    }
  }
}
const rows = [...pairs].filter(([, e]) => e.border >= 20).sort((a, b) => a[1].d - b[1].d);
for (const [key, e] of rows) console.log(`${e.d.toFixed(1).padStart(5)}  ${key}  ${e.colors.join(' / ')}  ${[...e.years].join(',')}  (${e.border} px)`);
console.log(`${rows.length} pares limítrofes con ΔE < ${LIMIT}`);
