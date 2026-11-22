// 6.0.22 · Finds DBE biographies (Real Academia de la Historia) for Iberian-related Atlas people whose
// Wikidata entry gives no DBE identifier, with the site's search. A biography is accepted only when the
// given name is compatible and the life years agree: both, when the Atlas gives both without doubt;
// otherwise the one the Atlas gives, and the article must name the father or the mother.
// Results go into .cache/rah/bios.json like those of fetch.mjs. Usage: node --import ./tests/jsx-loader.mjs scripts/research/rah/search.mjs
import fs from 'node:fs';
import {nameParts, compatible} from '../fmg/names.mjs';
const cache = new URL('../../../.cache/rah/', import.meta.url);
const file = new URL('bios.json', cache), searched = new URL('searched.json', cache);
const bios = JSON.parse(fs.readFileSync(file)), done = fs.existsSync(searched) ? JSON.parse(fs.readFileSync(searched)) : {};
const todo = JSON.parse(fs.readFileSync(new URL('search-todo.json', cache)));
const {PERSONAS} = await import('../../../src/data/personas.js');
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)', 'Accept': 'application/json'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const strip = html => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/\s+/g, ' ').trim();
const yearOf = t => { const m = String(t || '').match(/(\d{3,4})(?!.*\d{3,4})/); return m ? +m[1] : null; };
const fold = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const get = async url => { for (let a = 0; a < 3; a++) { try { const r = await fetch(url, {headers: UA, signal: AbortSignal.timeout(30000)}); if (r.ok) return await r.json(); } catch {} await sleep(3000 * (a + 1)); } return null; };
let n = 0;
for (const id of todo) {
  if (done[id] !== undefined || bios[id]) continue;
  const p = byId.get(id), query = p.nombre.replace(/\s+\(.*\)$/, '');
  const res = await get(`https://historia-hispanica.rah.es/api/search/${encodeURIComponent(query)}`);
  await sleep(1200);
  const ours = nameParts(p.nombre);
  const cands = (res?.biographies || []).filter(b => !b.aka && compatible(ours, nameParts(b.name || b.title) || {given: '', numeral: null}) || !b.aka && fold(b.title).includes(fold(p.nombre.split(' ')[0]))).slice(0, 6);
  const hits = [];
  for (const c of cands) {
    const j = await get(`https://historia-hispanica.rah.es/api/biographies/${c.nid}`);
    await sleep(1200);
    if (!j) continue;
    const b = yearOf(j.birth?.datetext), d = yearOf(j.death?.datetext);
    const sure = [[p.nac, p.nacAprox, b], [p.muer, p.muerAprox, d]].filter(([y, approx]) => Number.isInteger(y) && !approx);
    if (!sure.length || sure.some(([y, , r]) => r !== null && r !== y) || !sure.some(([y, , r]) => r === y)) continue;
    const text = strip(j.biography);
    if (sure.length < 2 || sure.some(([, , r]) => r === null)) {
      const parents = [p.padre, p.madre].map(x => byId.get(x)).filter(Boolean);
      if (!parents.some(par => { const n2 = nameParts(par.nombre); return n2 && new RegExp(`\\b${par.nombre.split(' ')[0]}\\b`).test(text.slice(0, 1500)); })) continue;
    }
    hits.push({nid: j.nid, slug: `${j.nid}-${fold(j.title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, title: j.title, label: strip(j.label), birth: j.birth?.datetext || null, death: j.death?.datetext || null, author: j.author || null, text: text.slice(0, 40000), found: 'search'});
  }
  done[id] = hits.length;
  if (hits.length === 1) bios[id] = hits[0];
  if (++n % 10 === 0) { fs.writeFileSync(file, JSON.stringify(bios)); fs.writeFileSync(searched, JSON.stringify(done)); console.log(n, Object.values(done).filter(x => x === 1).length); }
}
fs.writeFileSync(file, JSON.stringify(bios)); fs.writeFileSync(searched, JSON.stringify(done));
console.log('found', Object.values(done).filter(x => x === 1).length, 'ambiguous', Object.values(done).filter(x => x > 1).length);
