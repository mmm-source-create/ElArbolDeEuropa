// 6.0.22 · Wikidata identifiers of national biographies (Dictionary of Irish Biography, Svenskt
// biografiskt lexikon, Norsk biografisk leksikon, Dansk Biografisk Leksikon) for the Atlas people with
// pending claims. Wikidata is used only to find the article; the article is the source.
import fs from 'node:fs';
const read = f => JSON.parse(fs.readFileSync(new URL(`../../.cache/sources-616/${f}`, import.meta.url)));
const qids = read('qids.json'), status = read('status.json');
const {PERSONAS} = await import('../../src/data/personas.js');
const {personClaims} = await import('../../src/evidence/claims.js');
const want = PERSONAS.filter(p => status[p.id] === 'ok' && personClaims(p).some(c => c.certainty === 'pending')).map(p => [p.id, qids[p.id].qid]);
const out = {};
for (let i = 0; i < want.length; i += 200) {
  const chunk = want.slice(i, i + 200), values = chunk.map(([, q]) => `wd:${q}`).join(' ');
  const query = `SELECT ?item ?dib ?sbl ?nbl ?dbl WHERE { VALUES ?item { ${values} } OPTIONAL { ?item wdt:P6829 ?dib } OPTIONAL { ?item wdt:P3217 ?sbl } OPTIONAL { ?item wdt:P5080 ?nbl } OPTIONAL { ?item wdt:P8341 ?dbl } }`;
  const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query), {headers: {'User-Agent': 'ElArbolDeEuropa-research/1.0', Accept: 'application/sparql-results+json'}});
  const j = await r.json();
  for (const b of j.results.bindings) {
    const q = b.item.value.split('/').pop(), id = chunk.find(([, x]) => x === q)?.[0];
    for (const k of ['dib', 'sbl', 'nbl', 'dbl']) if (b[k]) ((out[id] ||= {})[k] ||= b[k].value);
  }
  await new Promise(r => setTimeout(r, 1500));
}
fs.writeFileSync(new URL('../../.cache/natbio/ids.json', import.meta.url), JSON.stringify(out, null, 1));
const c = {}; for (const v of Object.values(out)) for (const k of Object.keys(v)) c[k] = (c[k] || 0) + 1;
console.log(want.length, c);
