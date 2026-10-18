// Share-preview cards (Open Graph) at 1200×630. They carry no live text, so
// the build does not depend on the fonts installed on the server: the page
// title comes from og:title and the brand from a pre-rendered wordmark.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {PERSONAS} from '../../src/data/personas.js';
import {IMAGENES_PERSONAS} from '../../src/data/imagenesPersonas.js';
import {IMAGE_VARIANTS} from '../../src/data/imageVariants.js';
import {ESCUDOS, escudoDe} from '../../src/content/dinastias/escudos.js';
import DynastyArms from '../../src/components/DynastyArms.jsx';
import {PERSONA_SLUG_POR_ID} from '../../src/features/atlas/atlasRoutes.js';
import {slugPublico} from '../../src/domain/people/personLabels.js';
import {OG_DEFAULT_IMAGE, OG_IMAGE_SIZE, ogDynastyImage, ogPersonaImage} from '../../src/features/public/ogImages.js';

const {width: W, height: H} = OG_IMAGE_SIZE;
const PANEL = 640;
const WINE = '#7A2E2E';
const PARCHMENT = '#F4EBD8';
const publicFile = url => path.join('public', url);
const crown = size => sharp('public/EADE.png').resize(size, size).toBuffer();
const wordmark = widthPx => sharp('public/brand/og-wordmark.png').resize({width: widthPx}).toBuffer();
const rule = (x, y, w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#C9A45C"/></svg>`);

async function brandPanel() {
  const side = W - PANEL;
  return [
    {input: await crown(250), left: PANEL + Math.round((side - 250) / 2), top: 96},
    {input: await wordmark(500), left: PANEL + Math.round((side - 500) / 2), top: 372},
    {input: rule(0, 0, 6, H), left: PANEL, top: 0},
  ];
}

// Same framing as the profile: CSS object-position percentages on a cover crop.
async function portraitLayer(file, framing = '50% 25%') {
  const [fx, fy] = framing.split(/\s+/).map(v => Math.min(1, Math.max(0, parseFloat(v) / 100)));
  const {width, height} = await sharp(file).metadata();
  const scale = Math.max(PANEL / width, H / height);
  const sw = Math.ceil(width * scale), sh = Math.ceil(height * scale);
  const left = Math.round((sw - PANEL) * (Number.isFinite(fx) ? fx : .5));
  const top = Math.round((sh - H) * (Number.isFinite(fy) ? fy : .25));
  return sharp(file).resize(sw, sh).extract({left, top, width: PANEL, height: H}).toBuffer();
}

// A share card cannot carry the credit that CC BY and CC BY-SA require, so it
// uses a Commons image only when it is in the public domain or under CC0.
const FREE = /^(Dominio público|CC0)/;
async function armsLayer(dinastia) {
  const imagen = escudoDe(dinastia)?.imagen;
  const source = imagen && FREE.test(imagen.licencia) ? publicFile(imagen.archivo) : Buffer.from(
    renderToStaticMarkup(React.createElement(DynastyArms, {dinastia, size: 360, drawn: true})).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
  const arms = await sharp(source, {density: 144}).resize({height: 470, width: 560, fit: 'inside'}).png().toBuffer();
  const {width} = await sharp(arms).metadata();
  const frame = await sharp({create: {width: PANEL, height: H, channels: 3, background: PARCHMENT}})
    .composite([{input: arms, left: Math.round((PANEL - width) / 2), top: 80}]).png().toBuffer();
  return frame;
}

async function writeCard(out, layers, background = WINE) {
  await fs.mkdir(path.dirname(out), {recursive: true});
  await sharp({create: {width: W, height: H, channels: 3, background}})
    .composite(layers).jpeg({quality: 80, mozjpeg: true}).toFile(out);
}

await fs.rm('public/og', {recursive: true, force: true});
const brand = await brandPanel();
await writeCard(publicFile(OG_DEFAULT_IMAGE), [
  {input: await crown(300), left: Math.round((W - 300) / 2), top: 70},
  {input: await wordmark(560), left: Math.round((W - 560) / 2), top: 390},
]);

let people = 0;
for (const person of PERSONAS) {
  const image = IMAGENES_PERSONAS[person.id];
  if (!image) continue;
  // Only the responsive variants are published; take the widest.
  const widest = IMAGE_VARIANTS[image.archivo]?.variants.at(-1)?.src;
  if (!widest) throw new Error(`Retrato sin variantes publicadas: ${person.id}`);
  const source = publicFile(widest);
  await writeCard(publicFile(ogPersonaImage(PERSONA_SLUG_POR_ID[person.id])),
    [{input: await portraitLayer(source, image.encuadre), left: 0, top: 0}, ...brand]);
  people += 1;
}
let houses = 0;
for (const dinastia of Object.keys(ESCUDOS)) {
  await writeCard(publicFile(ogDynastyImage(slugPublico(dinastia))), [{input: await armsLayer(dinastia), left: 0, top: 0}, ...brand]);
  houses += 1;
}
console.log(`Vistas previas para compartir: ${people} retratos, ${houses} escudos y la tarjeta general.`);
