// 6.0.21 · Downloads the full text of the Dizionario Biografico degli Italiani articles of people with
// pending claims into .cache/dbi/articles621.json (slowly, incrementally).
// Usage: node --import ./tests/jsx-loader.mjs scripts/research/dbi/fetch621.mjs
import fs from 'node:fs';
const cacheDir = new URL('../../../.cache/dbi/', import.meta.url);
const authority = new URL('../../../.cache/sources-616/', import.meta.url);
const read = f => JSON.parse(fs.readFileSync(new URL(f, authority)));
const qids = read('qids.json'), ent = read('entities.json'), status = read('status.json');
const {PERSONAS} = await import('../../../src/data/personas.js');
const {personClaims} = await import('../../../src/evidence/claims.js');
const file = new URL('articles621.json', cacheDir);
const articles = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
const decode = s => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const todo = [...new Set(PERSONAS.filter(p => status[p.id] === 'ok' && ent[qids[p.id].qid]?.dbi && personClaims(p).some(c => c.certainty === 'pending')).map(p => ent[qids[p.id].qid].dbi))];
console.log('articles', todo.length);
for (const id of todo) {
  if (articles[id] !== undefined) continue;
  try {
    const r = await fetch(`https://www.treccani.it/enciclopedia/${id}_(Dizionario-Biografico)/`, {headers: {'User-Agent': 'Mozilla/5.0 (Macintosh)'}, signal: AbortSignal.timeout(40000)});
    const html = r.ok ? await r.text() : '';
    const text = decode(html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
    const at = text.search(/\b(?:Nacque|Nato|Nata|nacque)\b/);
    const end = text.search(/\bFonti e Bibl\.|\bFONTI E BIBL/);
    articles[id] = at >= 0 ? {title: (html.match(/<title>([^<]*)<\/title>/) || [])[1]?.replace(/\s*-\s*Treccani.*$/, '').trim() || id, text: text.slice(at, end > at ? end : at + 60000)} : null;
  } catch { articles[id] = null; }
  fs.writeFileSync(file, JSON.stringify(articles));
  await sleep(1200);
}
console.log('done', Object.values(articles).filter(Boolean).length);
