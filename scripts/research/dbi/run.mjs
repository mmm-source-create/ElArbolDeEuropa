// 6.0.17 · Parentage from the Dizionario Biografico degli Italiani (Treccani).
// The article's opening sentence names the parents («Nacque … da X e da Y»). A pending father or mother
// claim is documented when the parent named there has a compatible given name (and the same regnal
// number when both give one) and, for names without a number, shares another distinctive part of the name.
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/dbi/run.mjs
import fs from 'node:fs';
import {nameParts, compatible} from '../fmg/names.mjs';
const cacheDir = new URL('../../../.cache/dbi/', import.meta.url); fs.mkdirSync(cacheDir, {recursive: true});
const authority = new URL('../../../.cache/sources-616/', import.meta.url);
const read = f => JSON.parse(fs.readFileSync(new URL(f, authority)));
const qids = read('qids.json'), ent = read('entities.json'), status = read('status.json');
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const {COMPLETE_ENGLISH_PROFILES} = await import('../../../src/features/english/fullProfiles.js');
const byId = new Map(PERSONAS.map(p => [p.id, p]));
const pagesFile = new URL('pages.json', cacheDir);
const pages = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile)) : {};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const decode = s => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
const todo = PERSONAS.filter(p => status[p.id] === 'ok' && ent[qids[p.id].qid]?.dbi && personClaims(p).some(c => c.certainty === 'pending' && /:(father|mother)$/.test(c.id)));
console.log('people', todo.length);
for (const p of todo) {
  const id = ent[qids[p.id].qid].dbi;
  if (pages[id] !== undefined) continue;
  try {
    const r = await fetch(`https://www.treccani.it/enciclopedia/${id}_(Dizionario-Biografico)/`, {headers: {'User-Agent': 'Mozilla/5.0 (Macintosh)'}, signal: AbortSignal.timeout(40000)});
    const html = r.ok ? await r.text() : '';
    const text = decode(html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
    const at = text.search(/\b(?:Nacque|Nato|Nata|nacque)\b/);
    pages[id] = at >= 0 ? {title: (html.match(/<title>([^<]*)<\/title>/) || [])[1]?.replace(/\s*-\s*Treccani.*$/, '').trim() || id, opening: text.slice(at, at + 700)} : null;
  } catch { pages[id] = null; }
  fs.writeFileSync(pagesFile, JSON.stringify(pages));
  await sleep(1500);
}
const STOP = new Set(['de', 'di', 'da', 'del', 'della', 'dei', 'of', 'the', 'y', 'e', 're', 'regina', 'duca', 'conte', 'marchese', 'signore', 'principe', 'figlio', 'figlia']);
const stem = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().slice(0, 6);
const namesOf = p => [p.nombre, COMPLETE_ENGLISH_PROFILES[p.id]?.name, ...(p.aliases || [])].filter(Boolean);
// The opening sentence names the parents in many forms («da X e da Y», «dal conte X … e dalla moglie Y»,
// «figlio del re X e di Y»). A parent is found when, within the first 320 characters and after a filiation
// word, a word with the same given name is followed (within eight words) by the same regnal number or by
// another distinctive part of the parent's name.
const FILIATION = /\b(?:da|dal|dalla|dallo|dai|figli[oa]?|genitori|primogenit[oa])\b/;
const words = text => text.split(/[\s,;:.()'’]+/).filter(Boolean);
const found = (person, opening) => {
  const head = opening.slice(0, 320), at = head.search(FILIATION);
  if (at < 0) return null;
  // Only the sentence that states the filiation, and never one that doubts it.
  const rest = head.slice(at), end = rest.search(/[.;](?:\s|$)(?![a-z])/);
  const sentence = end < 0 ? rest : rest.slice(0, end);
  if (/identificazion|tradizion|ipotesi|incert|discuss|controvers|dubbi/i.test(sentence)) return null;
  const list = words(sentence);
  for (const n of namesOf(person)) {
    const ours = nameParts(n);
    if (!ours) continue;
    const distinct = n.split(/[\s,()'’-]+/).filter(w => w.length >= 4 && !STOP.has(w.toLowerCase()) && !/^[IVX]+$/.test(w)).slice(1).map(stem);
    for (let i = 0; i < list.length; i++) {
      if (!/^\p{Lu}/u.test(list[i]) || !compatible(ours, {given: nameParts(list[i]).given, numeral: null})) continue;
      const window = list.slice(i + 1, i + 9);
      const numeral = window.slice(0, 2).find(w => /^[IVX]+$/.test(w));
      if (ours.numeral && numeral) { if (numeral === ours.numeral) return head; continue; }
      if (window.some(w => w.length >= 4 && distinct.includes(stem(w)))) return head;
    }
  }
  return null;
};
const out = {}, stats = {};
for (const p of todo) {
  const id = ent[qids[p.id].qid].dbi, page = pages[id];
  if (!page) continue;
  for (const claim of personClaims(p)) {
    if (claim.certainty !== 'pending' || !/:(father|mother)$/.test(claim.id)) continue;
    const kind = claim.id.endsWith('father') ? 'father' : 'mother';
    const relative = byId.get(claim.value);
    if (!relative || !found(relative, page.opening)) continue;
    const quote = page.opening.slice(0, 200);
    out[claim.id] = {certainty: 'documented', sources: [{title: `Treccani · Dizionario Biografico degli Italiani · ${page.title}`, url: `https://www.treccani.it/enciclopedia/${id}_(Dizionario-Biografico)/`, locator: `Comienzo del artículo: «${quote}»`, locatorEn: `Opening of the article: “${quote}”`}],
      note: `El Dizionario Biografico degli Italiani confirma el vínculo (${kind === 'father' ? 'padre' : 'madre'}).`, noteEn: `The Dizionario Biografico degli Italiani confirms the relationship (${kind}).`, reviewedAt: '2026-11-22', editor: 'El Árbol de Europa'};
    stats[kind] = (stats[kind] || 0) + 1;
  }
}
fs.writeFileSync(new URL('reviews617.json', cacheDir), JSON.stringify(out));
console.log(stats, 'total', Object.keys(out).length);
