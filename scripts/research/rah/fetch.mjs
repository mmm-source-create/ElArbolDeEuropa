// 6.0.22 · Downloads the biographies of the Diccionario Biográfico Español (Real Academia de la Historia,
// historia-hispanica.rah.es) of the Atlas people whose Wikidata entry gives a DBE identifier. The old
// dbe.rah.es address redirects to the new record number; the record is read from the site's own API.
// Slow and incremental: .cache/rah/bios.json. Usage: node --import ./tests/jsx-loader.mjs scripts/research/rah/fetch.mjs
import fs from 'node:fs';
const cache = new URL('../../../.cache/rah/', import.meta.url); fs.mkdirSync(cache, {recursive: true});
const authority = new URL('../../../.cache/sources-616/', import.meta.url);
const read = f => JSON.parse(fs.readFileSync(new URL(f, authority)));
const qids = read('qids.json'), ent = read('entities.json'), status = read('status.json');
const {PERSONAS} = await import('../../../src/data/personas.js');
const file = new URL('bios.json', cache);
const bios = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
const UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)', 'Accept': 'application/json'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const strip = html => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ').trim();
const todo = PERSONAS.filter(p => status[p.id] === 'ok' && ent[qids[p.id].qid]?.dbe).map(p => [p.id, ent[qids[p.id].qid].dbe]);
console.log('people', todo.length);
let n = 0;
for (const [id, dbe] of todo) {
  if (bios[id] !== undefined) continue;
  try {
    const [old, slug] = String(dbe).split('/');
    const r = await fetch(`https://dbe.rah.es/biografias/${old}/${slug || ''}`, {headers: UA, redirect: 'manual', signal: AbortSignal.timeout(30000)});
    const nid = (r.headers.get('location') || '').match(/biografias\/(\d+)-/)?.[1];
    if (!nid) { bios[id] = null; continue; }
    const j = await (await fetch(`https://historia-hispanica.rah.es/api/biographies/${nid}`, {headers: UA, signal: AbortSignal.timeout(30000)})).json();
    bios[id] = {nid: j.nid, slug: (r.headers.get('location') || '').split('/').pop(), title: j.title, label: strip(j.label), birth: j.birth?.datetext || null, death: j.death?.datetext || null, author: j.author || null, text: strip(j.biography).slice(0, 40000)};
  } catch (e) { bios[id] = null; }
  if (++n % 10 === 0) fs.writeFileSync(file, JSON.stringify(bios));
  await sleep(1500);
}
fs.writeFileSync(file, JSON.stringify(bios));
console.log('done', Object.values(bios).filter(Boolean).length);
