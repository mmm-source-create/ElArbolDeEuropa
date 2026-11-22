// 6.0.22 · Downloads the national-biography articles found by natbio-ids.mjs (plain text) into
// .cache/natbio/pages.json. Slow and incremental.
import fs from 'node:fs';
const dir = new URL('../../.cache/natbio/', import.meta.url);
const ids = JSON.parse(fs.readFileSync(new URL('ids.json', dir)));
const file = new URL('pages.json', dir);
const pages = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
const URLS = {dib: id => `https://www.dib.ie/biography/${id}`, sbl: id => `https://sok.riksarkivet.se/sbl/Presentation.aspx?id=${id}`, nbl: id => `https://nbl.snl.no/${id}`, dbl: id => `https://biografiskleksikon.lex.dk/${id}`};
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCharCode(parseInt(n, 16)));
for (const [person, set] of Object.entries(ids)) for (const [kind, id] of Object.entries(set)) {
  const key = `${person}|${kind}`;
  if (pages[key] !== undefined) continue;
  const url = URLS[kind](id);
  try {
    const r = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0 (Macintosh)'}, signal: AbortSignal.timeout(30000)});
    const html = r.ok ? await r.text() : '';
    const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').trim();
    const body = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, ' ').replace(/<br\s*\/?>|<\/p>|<\/div>|<\/h\d>/g, '\n').replace(/<[^>]+>/g, ' ')).replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
    pages[key] = r.ok ? {url, title, text: body.slice(0, 30000)} : null;
  } catch { pages[key] = null; }
  fs.writeFileSync(file, JSON.stringify(pages));
  await new Promise(r => setTimeout(r, 1500));
}
console.log('pages', Object.values(pages).filter(Boolean).length, 'of', Object.keys(pages).length);
