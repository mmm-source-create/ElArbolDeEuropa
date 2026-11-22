// 6.0.16 · Fetch the genealogy section of Neue Deutsche Biographie articles (deutsche-biographie.de)
// for people with a GND record; incremental. Kept: article id, title, the plain genealogy text.
import fs from 'node:fs';
import {UA, sleep} from './http.mjs';
const qids = JSON.parse(fs.readFileSync('qids.json')), ent = JSON.parse(fs.readFileSync('entities.json')), status = JSON.parse(fs.readFileSync('status.json')), gnd = JSON.parse(fs.readFileSync('gnd.json'));
const ndb = fs.existsSync('ndb.json') ? JSON.parse(fs.readFileSync('ndb.json')) : {};
const want = new Set();
for (const [id, s] of Object.entries(status)) if (s === 'ok') for (const g of ent[qids[id].qid]?.gnd || []) if (gnd[g] && !gnd[g].missing && !ndb[g]) want.add(g);
const list = [...want]; console.log('to fetch', list.length);
const text = html => html.replace(/<a [^>]*href="(sfz\d+)\.html"[^>]*>/g, '[$1]').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
// The genealogy paragraph follows <h4 id="ndbcontent_genealogie">; each relation starts a line (<br/>)
// whose first abbreviation carries the relation in its title (Vater, Mutter, ⚭ …).
const parse = html => {
  const at = html.indexOf('id="ndbcontent_genealogie"');
  const sfz = (html.match(/downloadRDF\?url=(sfz\d+)\.rdf/) || [])[1] || null;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]?.replace(/\s*-\s*Deutsche Biographie\s*$/, '').replace(/^Deutsche Biographie\s*-\s*/, '').trim() || null;
  if (at < 0) return {sfz, title, lines: []};
  const block = html.slice(at, html.indexOf('</p>', at));
  const lines = block.split(/<br\s*\/?>/).map(line => {
    const rel = (line.match(/title='([^']+)'/) || [])[1] || '';
    return {rel, text: text(line.replace(/^[\s\S]*?<p[^>]*>/, ''))};
  }).filter(line => line.text);
  return {sfz, title, lines};
};
let done = 0;
async function worker() { while (list.length) { const g = list.shift(); for (let a = 0; a < 4; a++) { try {
  const r = await fetch(`https://www.deutsche-biographie.de/pnd${g}.html`, {headers: UA, signal: AbortSignal.timeout(30000)});
  if (r.status === 404) { ndb[g] = {missing: true}; break; }
  if (r.status === 429 || r.status >= 500) { await sleep(10000 * (a + 1)); continue; }
  ndb[g] = parse(await r.text()); break; } catch { await sleep(3000 * (a + 1)); } }
  if (++done % 100 === 0) { fs.writeFileSync('ndb.json', JSON.stringify(ndb)); console.log(done); } await sleep(500); } }
await Promise.all([worker(), worker()]);
fs.writeFileSync('ndb.json', JSON.stringify(ndb)); console.log('done', Object.keys(ndb).length, 'with genealogy', Object.values(ndb).filter(v => v.lines?.length).length);
