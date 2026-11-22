// 6.0.17 · Downloads the regional pages of Medieval Lands (Foundation for Medieval Genealogy) listed in
// CONTENTS.htm into .cache/fmg/pages, slowly and incrementally. Usage: node scripts/research/fmg/fetch.mjs
import fs from 'node:fs';
const root = new URL('../../../.cache/fmg/', import.meta.url);
fs.mkdirSync(new URL('pages/', root), {recursive: true});
const HEADERS = {'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en', 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const get = async url => { for (let a = 0; a < 4; a++) { try { const r = await fetch(url, {headers: HEADERS, signal: AbortSignal.timeout(90000)}); if (r.ok) return Buffer.from(await r.arrayBuffer()); if (r.status === 404) return null; } catch {} await sleep(20000 * (a + 1)); } return null; };
const contents = (await get('https://fmg.ac/Projects/MedLands/CONTENTS.htm')).toString('latin1');
const pages = [...new Set([...contents.matchAll(/href="([A-Za-z0-9][^"#/]*\.htm)"/g)].map(m => m[1].replace(/&amp;/g, '&')))].filter(p => !/^(Intro|abbrevs|Search|Updates|CONTENTS|index)\.htm$/i.test(p));
console.log('pages', pages.length);
let done = 0;
for (const page of pages) {
  const file = new URL(`pages/${decodeURIComponent(page)}`, root);
  if (!fs.existsSync(file)) { const body = await get(`https://fmg.ac/Projects/MedLands/${page}`); if (body) fs.writeFileSync(file, body); await sleep(4000); }
  if (++done % 20 === 0) console.log(done);
}
console.log('done', fs.readdirSync(new URL('pages/', root)).length);
