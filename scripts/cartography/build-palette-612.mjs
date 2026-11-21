// 6.0.12: palette review of the common map. Finds neighbouring territories whose
// colours are hard to tell apart in any audited year and gives the smaller one a
// new colour from a muted palette, as far as possible from all its neighbours.
// Only territories whose colour comes from the automatic series (territorialColor
// and the eastern Europe table) or from the territory table are changed; the 15
// largest states keep theirs, French and Aragonese fief tints and tributary
// tints are left alone, and only colours shown by a single territory change:
// the common map replaces each old colour with its new one (europePanorama.js).
// Writes src/cartography/paletteReview612.js. Run again after map changes.
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {PERSONAS} from '../../src/data/personas.js';
import {europeMosaicAt} from '../../src/cartography/europePanorama.js';
import {PALETTE_612} from '../../src/cartography/paletteReview612.js';
import {deltaE} from '../lib/colorDistance.mjs';

const YEARS = [1250, 1300, 1350, 1400, 1453, 1500, 1556, 1600, 1648, 1714, 1789];
const LIMIT = 14, PROTECTED_LARGEST = 15;
if (Object.keys(PALETTE_612).length) throw new Error('Vacía src/cartography/paletteReview612.js antes de recalcular la paleta.');
const SVG = (await fs.readFile('data/cartography/euv-locations-crop.svg', 'utf8')).replace(/ style="fill:#d8d6ce;stroke:#d8d6ce;stroke-width:0\.08"/g, '');
const data = {...JSON.parse(await fs.readFile('data/cartography/corridor-locations.json', 'utf8')), burgundy: JSON.parse(await fs.readFile('data/cartography/burgundian-locations.json', 'utf8'))};

const area = new Map(), border = new Map(), shown = new Map(); // identity → px, "a|b" → px, identity → Map(year → colour)
for (const year of YEARS) {
  const mosaic = europeMosaicAt(data, year, PERSONAS);
  const ids = [], index = new Map(), cellCode = new Map();
  for (const [cell, matches] of mosaic.byLocation) {
    const layer = matches[0];
    // Deliberate families of tints are not part of the review.
    const tinted = layer.crownRelation || layer.tributaryRelation || layer.englishCrown || layer.republic;
    const identity = tinted ? `·${layer.mosaicColor}` : layer.entityId || layer.name;
    if (!index.has(identity)) { index.set(identity, ids.length + 1); ids.push(identity); }
    if (!tinted) { if (!shown.has(identity)) shown.set(identity, new Map()); shown.get(identity).set(year, layer.mosaicColor); }
    cellCode.set(cell, index.get(identity));
  }
  const svg = SVG.replace('<svg ', '<svg shape-rendering="crispEdges" ').replace(/<path id="([^"]+)" fill="#d8d6ce" stroke="#d8d6ce"/g, (m, id) => {
    const c = `#${(cellCode.get(id) || 0).toString(16).padStart(6, '0')}`;
    return `<path id="${id}" fill="${c}" stroke="${c}"`;
  });
  const {data: px, info} = await sharp(Buffer.from(svg), {density: 300}).resize({width: 1600, kernel: 'nearest'}).raw().toBuffer({resolveWithObject: true});
  const at = (x, y) => { const i = (y * info.width + x) * info.channels; return (px[i] << 16) | (px[i + 1] << 8) | px[i + 2]; };
  for (let y = 0; y < info.height - 1; y++) for (let x = 0; x < info.width - 1; x++) {
    const a = at(x, y);
    if (a && a <= ids.length) area.set(ids[a - 1], (area.get(ids[a - 1]) || 0) + 1);
    for (const b of [at(x + 1, y), at(x, y + 1)]) {
      if (a === b || !a || !b || a > ids.length || b > ids.length) continue;
      const key = [ids[a - 1], ids[b - 1]].sort().join('|') + `|${year}`;
      border.set(key, (border.get(key) || 0) + 1);
    }
  }
}

// A colour can be replaced only when a single territory shows it.
const owners = new Map();
for (const [identity, years] of shown) for (const color of years.values()) { const key = color.toLowerCase(); if (!owners.has(key)) owners.set(key, new Set()); owners.get(key).add(identity); }
const ownColor = identity => { const colors = [...new Set([...(shown.get(identity)?.values() || [])].map(c => c.toLowerCase()))]; return colors.length === 1 && owners.get(colors[0]).size === 1 ? colors[0] : null; };
const largest = new Set([...area].filter(([id]) => !id.startsWith('·')).sort((a, b) => b[1] - a[1]).slice(0, PROTECTED_LARGEST).map(([id]) => id));
const colorAt = (identity, year, chosen) => identity.startsWith('·') ? identity.slice(1) : chosen.get(identity) ?? shown.get(identity)?.get(year);
// Muted candidates: 48 hues × 3 lightness × 2 saturation levels (30–40%).
const candidates = [];
for (let h = 0; h < 360; h += 7.5) for (const l of [40, 50, 60]) for (const s of [30, 40]) candidates.push(`hsl(${h} ${s}% ${l}%)`);
const toHex = hsl => { const [h, s, l] = hsl.match(/[\d.]+/g).map(Number), S = s / 100, L = l / 100, a = S * Math.min(L, 1 - L);
  const f = n => Math.round(255 * (L - a * Math.max(-1, Math.min((n + h / 30) % 12 - 3, 9 - (n + h / 30) % 12, 1)))).toString(16).padStart(2, '0');
  return `#${f(0)}${f(8)}${f(4)}`; };

const neighbours = new Map();
for (const [key, px] of border) {
  if (px < 6) continue;
  const [a, b, year] = key.split('|');
  for (const [x, y] of [[a, b], [b, a]]) { if (!neighbours.has(x)) neighbours.set(x, []); neighbours.get(x).push({other: y, year: Number(year), px}); }
}
const chosen = new Map();
const conflicts = identity => (neighbours.get(identity) || []).filter(({other, year}) => {
  const a = colorAt(identity, year, chosen), b = colorAt(other, year, chosen);
  return a && b && a.toLowerCase() !== b.toLowerCase() && deltaE(a, b) < LIMIT;
});
// The smaller side of each conflict is recoloured, largest borders first.
const queue = [...new Set([...border].filter(([, px]) => px >= 6).flatMap(([key]) => {
  const [a, b, year] = key.split('|'), ca = colorAt(a, Number(year), chosen), cb = colorAt(b, Number(year), chosen);
  if (!ca || !cb || ca.toLowerCase() === cb.toLowerCase() || deltaE(ca, cb) >= LIMIT) return [];
  const movable = [a, b].filter(id => !id.startsWith('·') && !largest.has(id) && ownColor(id));
  return movable.length ? [movable.sort((x, y) => (area.get(x) || 0) - (area.get(y) || 0))[0]] : [];
}))];
for (const identity of queue) {
  if (!conflicts(identity).length) continue;
  const original = ownColor(identity);
  let best = null;
  for (const candidate of candidates) {
    const hex = toHex(candidate);
    const worst = Math.min(...(neighbours.get(identity) || []).map(({other, year}) => { const c = colorAt(other, year, chosen); return c ? deltaE(hex, c) : 99; }));
    const score = worst * 1000 - deltaE(hex, original);
    if (!best || score > best.score) best = {hex, score, worst};
  }
  chosen.set(identity, best.hex);
}
const sorted = Object.fromEntries([...chosen].sort(([a], [b]) => a.localeCompare(b, 'es')).map(([identity, to]) => [identity, {from: ownColor(identity), to}]));
await fs.writeFile('src/cartography/paletteReview612.js', `// Generated by scripts/cartography/build-palette-612.mjs (6.0.12): new colours for
// territories that were hard to tell apart from a neighbour on the common map.
export const PALETTE_612 = Object.freeze(${JSON.stringify(sorted, null, 2)});\nexport const COLOR_612 = Object.freeze(Object.fromEntries(Object.values(PALETTE_612).map(({from, to}) => [from.toLowerCase(), to])));\n`);
console.log(`${chosen.size} territorios con color nuevo; ${largest.size} estados mayores conservan el suyo`);
