// 6.0.16 · Compares each built Spanish page with its English counterpart (needs dist/).
// It measures parity (same years, similar length) and flags leftover Spanish in the English text.
// Usage: node scripts/audits/audit-english-parity.mjs [--write]
import fs from 'node:fs';
import path from 'node:path';
const DIST = new URL('../../dist/', import.meta.url).pathname;
const KINDS = [['persona', 'person'], ['dinastia', 'dynasty'], ['territorio', 'territory'], ['historia', 'story']];
const mainText = file => {
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] || '';
  return main.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
};
const enHref = file => fs.readFileSync(file, 'utf8').match(/hreflang="en" href="https:\/\/www\.treeofeurope\.eu(\/en\/[^"]+)"/)?.[1];
// Spanish words that have no business in English running text. Proper names are excluded on purpose.
const SPANISH = /\b(?:del|los|las|fue|murió|nació|hijo|hija|hermano|hermana|esposa|esposo|reino|reina|duque|duquesa|condesa|señorío|señor|ducado|condado|marquesado|principado|también|sucesión|gobierno|matrimonio|casó|heredó|tras|hasta|entre|sobre|aunque|pero|como|cuando|donde|primero|segunda?|tercera?|desde|sin|años|siglo|corona|emperador|emperatriz|regente|regencia|Borgoña|Aragón|Castilla|Navarra|Sajonia|Baviera|Saboya|Hungría|Bohemia la|Francia|Inglaterra|Escocia|Nápoles|Sicilia|Cerdeña|Polonia|Lituania|Dinamarca|Noruega|Suecia|Austria la|Alemania|Brandeburgo|Lorena|Flandes|Holanda|Baviera|Toscana|Milán|Génova|Venecia|Bretaña|Normandía|Aquitania|Constantinopla|Jerusalén|Chipre|Armenia la)\b/g;
// Words that may legitimately appear (titles of works, Iberian names); counted only when two or more appear.
const yearsOf = text => new Set((text.match(/\b(?:1[0-9]{3}|[5-9][0-9]{2})\b/g) || []));
const rows = [];
for (const [es, en] of KINDS) {
  const dir = path.join(DIST, 'es', es);
  if (!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    const esFile = path.join(dir, slug, 'index.html');
    if (!fs.existsSync(esFile)) continue;
    const href = enHref(esFile);
    const enFile = href && path.join(DIST, href, 'index.html');
    if (!enFile || !fs.existsSync(enFile)) { rows.push({kind: en, slug, missing: true}); continue; }
    const a = mainText(esFile), b = mainText(enFile);
    const ya = yearsOf(a), yb = yearsOf(b);
    const lostYears = [...ya].filter(y => !yb.has(y));
    // 6.0.22: verbatim quotations of sources («…» in Spanish, “…” in English) keep their original language.
    const spanish = [...new Set(b.replace(/“[^”]*”|«[^»]*»/g, ' ').match(SPANISH) || [])];
    rows.push({kind: en, slug, en: href, esLength: a.length, enLength: b.length, ratio: +(b.length / Math.max(a.length, 1)).toFixed(2), lostYears, spanish});
  }
}
const flag = r => r.missing || r.ratio < 0.75 || r.lostYears.length > 0 || r.spanish.length >= 2;
const byKind = {};
for (const r of rows) {
  const k = byKind[r.kind] ||= {pages: 0, missing: 0, shortEnglish: 0, lostYears: 0, spanishWords: 0, clean: 0};
  k.pages++;
  if (r.missing) { k.missing++; continue; }
  if (r.ratio < 0.75) k.shortEnglish++;
  if (r.lostYears.length) k.lostYears++;
  if (r.spanish.length >= 2) k.spanishWords++;
  if (!flag(r)) k.clean++;
}
const total = rows.length, clean = rows.filter(r => !flag(r)).length;
const summary = {pages: total, clean, cleanShare: +(clean / total).toFixed(3), byKind};
console.log(JSON.stringify(summary, null, 2));
if (process.argv.includes('--write')) {
  fs.mkdirSync(new URL('../../docs/reports/', import.meta.url), {recursive: true});
  fs.writeFileSync(new URL('../../docs/reports/english-parity.json', import.meta.url), JSON.stringify({summary, flagged: rows.filter(flag)}, null, 1));
}
