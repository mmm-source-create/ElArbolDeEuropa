// Descarga y registra los retratos de la 6.0.8 (personas sin retrato del top 300,
// gobernadores de los Países Bajos y nietos de Juana I).
// Uso, desde un equipo con acceso normal a Wikimedia Commons:
//   node scripts/assets/fetch-portraits-608.mjs [608|609]
//   node scripts/assets/portrait-variants.mjs .cache/portraits-<versión>/stage
// La 6.0.9 reutiliza el script con sources/portraits-609.json (homónimas y retratos alternativos),
// y la 6.0.15 con sources/portraits-615.json (Kościuszko y 99 gobernantes).
// Después: npm test y npm run baseline:regression -- --reason "6.0.8: retratos".
// Los créditos (autor, fecha, institución, tipo y atribuciones) están en sources/portraits-608.json. Las imágenes
// con licencia CC conservan su atribución en derechos/derechosUrl.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {PERSONAS} from '../../src/data/personas.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';

const UA = 'ElArbolDeEuropa-portrait-tool/1.0 (https://www.treeofeurope.eu/)';
const V = process.argv[2] || '608';
const meta = JSON.parse(fs.readFileSync(`scripts/assets/sources/portraits-${V}.json`, 'utf8'));
const raw = `.cache/portraits-${V}/raw`, stage = `.cache/portraits-${V}/stage`;
fs.mkdirSync(raw, {recursive: true}); fs.mkdirSync(stage, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Commons sirve el original mediante Special:FilePath.
async function download(id, title) {
  const out = path.join(raw, id);
  if (fs.existsSync(out) && fs.statSync(out).size > 20000) return out;
  const url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title.replace(/^File:/, '').replace(/ /g, '_')) + '?width=1600';
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {headers: {'User-Agent': UA}, redirect: 'follow'});
    if (res.ok) { fs.writeFileSync(out, Buffer.from(await res.arrayBuffer())); return out; }
    console.warn(`${id}: HTTP ${res.status}, reintento`); await sleep(5000 * (attempt + 1));
  }
  throw new Error(`${id}: no se pudo descargar ${title}`);
}

const es = {}, en = {}, missing = [];
const names = new Map(PERSONAS.map(p => [p.id, p.nombre]));
for (const [id, m] of Object.entries(meta)) {
  try {
    const file = await download(id, m.commons);
    const info = await sharp(file).metadata();
    if (info.width < 300) throw new Error(`${id}: imagen demasiado pequeña (${info.width}px)`);
    const name = `${id}_${V}`, target = path.join('public/personas-img', name + '.webp');
    await sharp(file).rotate().resize({width: Math.min(info.width, 900), withoutEnlargement: true}).webp({quality: 82}).toFile(target);
    fs.copyFileSync(target, path.join(stage, name + '.webp'));
    es[id] = {archivo: `/personas-img/${name}.webp`, encuadre: m.encuadre, ...m.es,
      alt: m.es.alt || `${m.es.tipo} de ${names.get(id)}`, fuente: 'Wikimedia Commons',
      fuenteUrl: 'https://commons.wikimedia.org/wiki/' + encodeURI(m.commons.replace(/ /g, '_')),
      derechos: m.derechos || 'Dominio público', derechosUrl: m.derechosUrl || 'https://creativecommons.org/publicdomain/mark/1.0/'};
    en[id] = {...m.en, alt: m.en.alt || `${m.en.tipo} of ${COMPLETE_ENGLISH_PROFILES[id]?.name || names.get(id)}`};
    console.log(`${id}: ${info.width}×${info.height}`);
  } catch (error) { missing.push(id); console.error(error.message); }
  await sleep(1500);
}
const HEADERS = {
  '608': '// 6.0.8: portraits for the most relevant people without one, the governors\n// of the Netherlands and the grandchildren of Joanna I. Attributions are kept as published.\n',
  '609': '// 6.0.9: portraits for people who share a name and alternative images (sculpture,\n// miniature, coin) for relevant people without a painted portrait. Attributions are kept as published.\n',
  '613': '// 6.1.3: portraits for the new people of culture, science, the School of Salamanca,\n// revolutions and exploration, matched on Wikidata and credited from Commons (scripts/research/people613). Attributions are kept as published.\n',
  '615': '// 6.0.15: portraits for Kościuszko and 99 rulers without one, matched on Wikidata and\n// credited from Commons (select-portraits-615.mjs, normalize-portraits-615.mjs). Attributions are kept as published.\n',
};
fs.writeFileSync(`src/data/imagenesPersonas${V}.js`, `${HEADERS[V]}export const PORTRAITS_${V} = ${JSON.stringify(es, null, 2)};\n`);
fs.writeFileSync(`src/features/english/portraits${V}.js`, `export const PORTRAITS_${V}_EN = ${JSON.stringify(en, null, 2)};\n`);
console.log(`Registrados ${Object.keys(es).length}/${Object.keys(meta).length}.` + (missing.length ? ` Faltan: ${missing.join(', ')}` : ''));
if (missing.length) process.exitCode = 1;
