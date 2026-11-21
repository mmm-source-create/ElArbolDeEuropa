// 6.0.11: maps of Europe for the home page, one per year of the time line and
// theme. Painted with the Atlas's own mosaic (europeMosaicAt) on the cell SVG,
// with each cell's stroke in its fill colour as in the Atlas, so no seams show.
// Run after changing the map data: `node scripts/generate/generate-home-maps.mjs`.
import fs from 'node:fs/promises';
import sharp from 'sharp';
import {PERSONAS} from '../../src/data/personas.js';
import {europeMosaicAt} from '../../src/cartography/europePanorama.js';
import {HOME_YEARS} from '../../src/features/public/homeYears.js';

const SVG = await fs.readFile('data/cartography/euv-locations-crop.svg', 'utf8');
const data = {...JSON.parse(await fs.readFile('data/cartography/corridor-locations.json', 'utf8')), burgundy: JSON.parse(await fs.readFile('data/cartography/burgundian-locations.json', 'utf8'))};
// Same colours as the Atlas (app.css and preferences.css).
const THEMES = {claro: {sea: '#dbe7e6', land: '#FBF7EC'}, oscuro: {sea: '#24221f', land: '#2e2a26'}};
// The map's own frame (Iceland to the Caspian, North Africa); 2000 px wide is
// sharp on wide and high-density screens.
const WIDTH = 2000;

function paint(svg, colors, theme) {
  const {sea, land} = THEMES[theme];
  return svg
    .replace(/<rect id="svg-background"([^>]*?)fill="[^"]*"/, `<rect id="svg-background"$1fill="${sea}"`)
    .replace(/style="background-color:#faf7ef"/, `style="background-color:${sea}"`)
    .replace(/<text[\s\S]*?<\/text>/g, '')
    // Each cell repeats its colour in a style attribute, which would win.
    .replace(/ style="fill:#d8d6ce;stroke:#d8d6ce;stroke-width:0\.08"/g, '')
    .replace(/<path id="([^"]+)" fill="#d8d6ce" stroke="#d8d6ce"/g, (match, id) => {
      const color = colors.get(id) || land;
      return `<path id="${id}" fill="${color}" stroke="${color}"`;
    });
}

await fs.mkdir('public/home', {recursive: true});
for (const year of HOME_YEARS) {
  const mosaic = europeMosaicAt(data, year, PERSONAS);
  const colors = new Map();
  for (const [id, layers] of mosaic.byLocation) colors.set(id, layers[0].mosaicColor);
  for (const theme of Object.keys(THEMES)) {
    const out = `public/home/mapa-${year}-${theme}.webp`;
    await sharp(Buffer.from(paint(SVG, colors, theme)), {density: 600})
      .resize({width: WIDTH})
      .webp({quality: 82, smartSubsample: true})
      .toFile(out);
  }
  console.log(`${year}: ${colors.size} celdas coloreadas`);
}
