// 6.2.2 · Tarjeta para compartir (Open Graph, 1200×630), una por idioma.
// Se genera una vez en un equipo con Iowan Old Style y se publica como archivo
// estático en public/brand/, para que el build no dependa de las fuentes del
// servidor. Volver a ejecutar solo si cambia el diseño:
//   node scripts/assets/og-card.mjs
import sharp from 'sharp';
import {OG_IMAGE_SIZE, OG_DEFAULT_IMAGE, OG_DEFAULT_IMAGE_EN} from '../../src/features/public/ogImages.js';

const {width: W, height: H} = OG_IMAGE_SIZE;
const WINE = '#7A2E2E', PARCHMENT = '#F6EEDC', GOLD = '#D2AE68';
const MAP_X = 620;
const SERIF = "'Iowan Old Style', 'Palatino', Georgia, serif";
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const TEXT = {
  es: {
    out: OG_DEFAULT_IMAGE,
    title: ['El Árbol', 'de Europa'],
    tagline: ['ATLAS GENEALÓGICO', 'E HISTÓRICO'],
    year: 'EUROPA · 1655',
    lines: ['Personas, dinastías e historias', 'de la Europa medieval y moderna'],
  },
  en: {
    out: OG_DEFAULT_IMAGE_EN,
    title: ['The Tree', 'of Europe'],
    tagline: ['A GENEALOGICAL', 'AND HISTORICAL ATLAS'],
    year: 'EUROPE · 1655',
    lines: ['People, dynasties and stories', 'of medieval and early modern Europe'],
  },
};

// Europa central en 1655, del mapa de la portada, algo apagada para que el
// texto mande y unida al panel granate con un degradado.
async function mapLayer() {
  const crop = await sharp('public/home/mapa-1655-claro.webp')
    .extract({left: 330, top: 250, width: 1180, height: 1000})
    .resize(W - MAP_X, H, {fit: 'cover', position: 'centre'})
    .modulate({saturation: 0.72, brightness: 0.96})
    .toBuffer();
  const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W - MAP_X}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${WINE}" stop-opacity="1"/>
      <stop offset="0.38" stop-color="${WINE}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${WINE}" stop-opacity="0.08"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/></svg>`);
  return sharp(crop).composite([{input: fade}]).png().toBuffer();
}

function textLayer({title, tagline, lines,year}) {
  const x = 64;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    ${title.map((line,i)=>`<text x="${x}" y="${225+i*77}" font-family="${SERIF}" font-size="76" fill="${PARCHMENT}">${esc(line)}</text>`).join('')}
    <rect x="${x}" y="334" width="80" height="3" fill="${GOLD}"/>
    ${tagline.map((line,i)=>`<text x="${x}" y="${376+i*27}" font-family="${SERIF}" font-size="18" letter-spacing="2.8" fill="${GOLD}">${esc(line)}</text>`).join('')}
    ${lines.map((line, i) => `<text x="${x}" y="${464 + i * 34}" font-family="${SERIF}" font-size="26" fill="${PARCHMENT}" fill-opacity="0.96">${esc(line)}</text>`).join('')}
    <text x="${x}" y="570" font-family="${SERIF}" font-size="21" letter-spacing="1.3" fill="${GOLD}">treeofeurope.eu</text>
    <rect x="922" y="550" width="238" height="43" rx="5" fill="${WINE}" fill-opacity="0.92"/>
    <text x="1041" y="578" text-anchor="middle" font-family="${SERIF}" font-size="20" letter-spacing="1.8" fill="${PARCHMENT}">${esc(year)}</text>
  </svg>`);
}

const map = await mapLayer();
const crown = await sharp('public/EADE.png').resize(76, 76).toBuffer();
for (const text of Object.values(TEXT)) {
  await sharp({create: {width: W, height: H, channels: 3, background: WINE}})
    .composite([
      {input: map, left: MAP_X, top: 0},
      {input: crown, left: 64, top: 62},
      {input: textLayer(text), left: 0, top: 0},
    ])
    .jpeg({quality: 84, mozjpeg: true})
    .toFile(`public${text.out}`);
  console.log(`public${text.out}`);
}
