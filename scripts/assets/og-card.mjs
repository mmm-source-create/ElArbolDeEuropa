// 6.2.0 · Tarjeta para compartir (Open Graph, 1200×630), una por idioma.
// Se genera una vez en un equipo con Iowan Old Style y se publica como archivo
// estático en public/brand/, para que el build no dependa de las fuentes del
// servidor. Volver a ejecutar solo si cambia el diseño:
//   node scripts/assets/og-card.mjs
import sharp from 'sharp';
import {OG_IMAGE_SIZE, OG_DEFAULT_IMAGE, OG_DEFAULT_IMAGE_EN} from '../../src/features/public/ogImages.js';

const {width: W, height: H} = OG_IMAGE_SIZE;
const WINE = '#7A2E2E', PARCHMENT = '#F6EEDC', GOLD = '#D2AE68';
const MAP_X = 560;
const SERIF = "'Iowan Old Style', 'Palatino', Georgia, serif";
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const TEXT = {
  es: {
    out: OG_DEFAULT_IMAGE,
    title: 'El Árbol de Europa',
    tagline: 'ATLAS GENEALÓGICO E HISTÓRICO',
    lines: ['Personas, dinastías, territorios e historias', 'de la Europa medieval y moderna'],
  },
  en: {
    out: OG_DEFAULT_IMAGE_EN,
    title: 'The Tree of Europe',
    tagline: 'A GENEALOGICAL AND HISTORICAL ATLAS',
    lines: ['People, dynasties, territories and stories', 'of medieval and early modern Europe'],
  },
};

// Europa central en 1500, del mapa de la portada, algo apagada para que el
// texto mande y unida al panel granate con un degradado.
async function mapLayer() {
  const crop = await sharp('public/home/mapa-1500-claro.webp')
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

function textLayer({title, tagline, lines}) {
  const x = 72;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <text x="${x}" y="268" font-family="${SERIF}" font-size="76" fill="${PARCHMENT}">${esc(title)}</text>
    <rect x="${x}" y="300" width="88" height="3" fill="${GOLD}"/>
    <text x="${x}" y="350" font-family="${SERIF}" font-size="21" letter-spacing="4.2" fill="${GOLD}">${esc(tagline)}</text>
    ${lines.map((line, i) => `<text x="${x}" y="${420 + i * 40}" font-family="${SERIF}" font-size="30" fill="${PARCHMENT}" fill-opacity="0.92">${esc(line)}</text>`).join('')}
    <text x="${x}" y="566" font-family="${SERIF}" font-size="22" letter-spacing="1.5" fill="${GOLD}">treeofeurope.eu</text>
  </svg>`);
}

const map = await mapLayer();
const crown = await sharp('public/EADE.png').resize(84, 84).toBuffer();
for (const text of Object.values(TEXT)) {
  await sharp({create: {width: W, height: H, channels: 3, background: WINE}})
    .composite([
      {input: map, left: MAP_X, top: 0},
      {input: crown, left: 72, top: 96},
      {input: textLayer(text), left: 0, top: 0},
    ])
    .jpeg({quality: 84, mozjpeg: true})
    .toFile(`public${text.out}`);
  console.log(`public${text.out}`);
}
