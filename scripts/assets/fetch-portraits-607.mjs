// Descarga y registra los retratos de la 6.0.7 (Jagellón y retratos elegidos por el autor).
// Uso, desde un equipo con acceso normal a Wikimedia Commons:
//   node scripts/assets/fetch-portraits-607.mjs
//   node scripts/assets/portrait-variants.mjs .cache/portraits-607/stage
// Después: npm test y npm run baseline:regression -- --reason "6.0.7: retratos Jagellón restantes".
// Los créditos (autor, fecha, institución, tipo y atribuciones) están en sources/portraits-607.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const UA = 'ElArbolDeEuropa-portrait-tool/1.0 (https://www.treeofeurope.eu/)';
const meta = JSON.parse(fs.readFileSync('scripts/assets/sources/portraits-607.json', 'utf8'));
const raw = '.cache/portraits-607/raw', stage = '.cache/portraits-607/stage';
fs.mkdirSync(raw, {recursive: true}); fs.mkdirSync(stage, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Commons sirve el original mediante Special:FilePath.
async function download(id, title) {
  const out = path.join(raw, id);
  if (fs.existsSync(out) && fs.statSync(out).size > 20000) return out;
  const url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title.replace(/^File:/, '').replace(/ /g, '_'));
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {headers: {'User-Agent': UA}, redirect: 'follow'});
    if (res.ok) { fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); return out; }
    console.warn(`${id}: HTTP ${res.status}, reintento`); await sleep(5000 * (attempt + 1));
  }
  throw new Error(`${id}: no se pudo descargar ${title}`);
}

const es = {}, en = {}, missing = [];
for (const [id, m] of Object.entries(meta)) {
  try {
    const file = await download(id, m.commons);
    const info = await sharp(file).metadata();
    if (info.width < 300) throw new Error(`${id}: imagen demasiado pequeña (${info.width}px)`);
    const name = `${id}_607`, target = path.join('public/personas-img', name + '.webp');
    await sharp(file).rotate().resize({width: Math.min(info.width, 900), withoutEnlargement: true}).webp({quality: 82}).toFile(target);
    fs.copyFileSync(target, path.join(stage, name + '.webp'));
    es[id] = {archivo: `/personas-img/${name}.webp`, encuadre: m.encuadre, ...m.es, fuente: 'Wikimedia Commons',
      fuenteUrl: 'https://commons.wikimedia.org/wiki/' + encodeURI(m.commons.replace(/ /g, '_')),
      derechos: 'Dominio público', derechosUrl: 'https://creativecommons.org/publicdomain/mark/1.0/'};
    en[id] = {...m.en};
    console.log(`${id}: ${info.width}×${info.height}`);
  } catch (error) { missing.push(id); console.error(error.message); }
  await sleep(1500);
}
fs.writeFileSync('src/data/imagenesPersonas607.js', `// 6.0.7: Jagiellonian kings and queens and portraits chosen by the author.\n// Attributions and traditional identifications are kept as published.\nexport const PORTRAITS_607 = ${JSON.stringify(es, null, 2)};\n`);
fs.writeFileSync('src/features/english/portraits607.js', `export const PORTRAITS_607_EN = ${JSON.stringify(en, null, 2)};\n`);
console.log(`Registrados ${Object.keys(es).length}/${Object.keys(meta).length}.` + (missing.length ? ` Faltan: ${missing.join(', ')}` : ''));
if (missing.length) process.exitCode = 1;
