// 6.0.15: picks portraits for Kościuszko and for rulers without one, ranked by
// title and years of effective rule. Each person is matched to Wikidata
// (human, birth and death years within one year) and its main image (P18) is
// taken only when Commons publishes it in the public domain or under a CC
// licence and it is a picture of the person (not arms, a seal, a signature or
// a tomb). Writes scripts/assets/sources/portraits-615.json for
// fetch-portraits-608.mjs 615.
// Usage: node scripts/assets/select-portraits-615.mjs <candidates.json> [count]
import fs from 'node:fs';

const UA = {'User-Agent': 'ElArbolDeEuropa-portrait-tool/1.0 (https://www.treeofeurope.eu/)'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const getJSON = async url => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, {headers: UA, signal: AbortSignal.timeout(20000)});
      if (res.status === 429) { await sleep(15000 * (attempt + 1)); continue; }
      return await res.json();
    } catch { await sleep(3000 * (attempt + 1)); }
  }
  return {};
};
const candidates = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const WANT = Number(process.argv[3] || 100);
const year = claim => { const t = claim?.mainsnak?.datavalue?.value?.time; const m = t?.match(/^([+-])(\d+)-/); return m ? (m[1] === '-' ? -1 : 1) * Number(m[2]) : null; };
const strip = html => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const SKIP = /coat|arms|wappen|blason|escudo|herb|signature|firma|unterschrift|seal|siegel|sello|sceau|tomb|grave|sarcoph|monogram|map|coin|medal|stamp|\.svg$/i;
const LICENCE = /public domain|^pd|cc0|cc[- ]by/i;

// Images that the review found are not of the person (a general photograph,
// a charter, an unrelated engraving) or cannot be made out (a worn carving).
const EXCLUDED = new Set(['BAGRAT3IMER', 'GIORGI8GEO', 'DAVIDTREB', 'RUAIDRICONN']);
const cleanDate = text => text.replace(/\s*date QS:.*$/i, '').replace(/\(original upload date\)/i, '').trim();
const cleanAuthor = text => {
  const value = text.replace(/\b(Unknown author|Anonymous|anonymous|Unidentified painter|Autor desconocido)\b/g, '').replace(/\s+/g, ' ').trim();
  return /^(unknown|unknown author)?$/i.test(value) || /^(Unknown|Public domain)/i.test(value) ? 'Autor desconocido' : value;
};
// Kind of image, from the file name and its description.
const KINDS = [
  [/coin|asper|denar|gros\b|numismatic|aspron|dinar/i, ['Moneda', 'Coin']],
  [/fresco|fresque|svetitskhoveli|gelati|betania|philotheou|arilje|ljevi|monastery|church|kirke/i, ['Pintura mural', 'Wall painting']],
  [/carving|stone|statue|tomb|kongefrisen|relief|sculpt/i, ['Escultura', 'Sculpture']],
  [/tumbo|codex|kodex|biblioteca|british library|royal \d|hünername|compendio|chronicle|manuscript|folio|privilegis|ms\./i, ['Miniatura', 'Miniature']],
  [/engraving|gartenlaube|stich|grabado|kupferstich|lithograph/i, ['Grabado', 'Engraving']],
];
const kindOf = (file, description) => (KINDS.find(([pattern]) => pattern.test(`${file} ${description}`)) || [null, ['Retrato', 'Portrait']])[1];
const meta = {}, report = [];
for (const person of candidates) {
  if (Object.keys(meta).length >= WANT) break;
  if (EXCLUDED.has(person.id)) continue;
  const ids = new Set();
  for (const [lang, name] of [['es', person.nombre], ['en', person.aliases[0] || person.nombre]]) {
    const search = await getJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=${lang}&uselang=${lang}&type=item&limit=6&search=${encodeURIComponent(name)}`);
    for (const hit of search.search || []) ids.add(hit.id);
    await sleep(400);
  }
  if (!ids.size) { report.push(`${person.id}: sin resultados`); continue; }
  const entities = (await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels&languages=es|en&ids=${[...ids].join('|')}`)).entities || {};
  const matches = Object.entries(entities).filter(([, e]) => {
    const c = e.claims || {};
    if (!(c.P31 || []).some(s => s.mainsnak?.datavalue?.value?.id === 'Q5')) return false;
    const births = (c.P569 || []).map(year).filter(v => v !== null), deaths = (c.P570 || []).map(year).filter(v => v !== null);
    const birthOk = Number.isInteger(person.nac) ? births.some(y => Math.abs(y - person.nac) <= 1) : null;
    const deathOk = Number.isInteger(person.muer) ? deaths.some(y => Math.abs(y - person.muer) <= 1) : null;
    // Both known dates must match; a single date is not enough to accept a namesake.
    // Every known date must match; a person with no dates is not accepted.
    return birthOk !== false && deathOk !== false && (birthOk || deathOk);
  });
  if (matches.length !== 1) { report.push(`${person.id}: ${matches.length} coincidencias`); await sleep(400); continue; }
  const [qid, entity] = matches[0];
  const file = entity.claims.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!file || SKIP.test(file)) { report.push(`${person.id}: ${qid} sin imagen utilizable (${file || '—'})`); await sleep(400); continue; }
  const info = await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|size&titles=${encodeURIComponent('File:' + file)}`);
  const page = Object.values(info.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0], em = ii?.extmetadata || {};
  const licence = strip(em.LicenseShortName?.value);
  if (!ii || ii.width < 300 || !LICENCE.test(licence)) { report.push(`${person.id}: ${file} licencia o tamaño (${licence}, ${ii?.width})`); await sleep(400); continue; }
  const autor = cleanAuthor(strip(em.Artist?.value).replace(/\s*\(.*$/, '').slice(0, 90));
  const fecha = cleanDate(strip(em.DateTimeOriginal?.value)).slice(0, 40);
  const [tipoEs, tipoEn] = kindOf(file, strip(em.ImageDescription?.value));
  const obra = strip(em.ObjectName?.value).slice(0, 120) || file.replace(/\.[a-z]+$/i, '').replace(/_/g, ' ');
  const pd = /public domain|^pd|cc0/i.test(licence);
  meta[person.id] = {
    commons: `File:${file}`, encuadre: '50% 20%', qid,
    es: {tipo: tipoEs, obra, autor, ...(fecha ? {fecha} : {})},
    en: {tipo: tipoEn, obra, autor: autor === 'Autor desconocido' ? 'Unknown author' : autor, ...(fecha ? {fecha} : {})},
    ...(pd ? {} : {derechos: licence, derechosUrl: em.LicenseUrl?.value || 'https://creativecommons.org/licenses/'}),
  };
  report.push(`${person.id}: ${qid} ${file} (${licence})`);
  console.log(Object.keys(meta).length, person.id, file);
  await sleep(500);
}
fs.writeFileSync('scripts/assets/sources/portraits-615.json', `${JSON.stringify(meta, null, 2)}\n`);
fs.writeFileSync('.cache/portraits-615-report.txt', report.join('\n') + '\n');
console.log(`Seleccionados ${Object.keys(meta).length}`);
