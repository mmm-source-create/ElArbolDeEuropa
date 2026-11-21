// 6.0.16 · Replaces Wikipedia citations with reference works (see resolve-wikipedia.mjs).
// The chosen URL is checked online, except Britannica, which refuses automated requests and is
// taken from the identifier recorded in Wikidata. Pages with no counterpart in a reference work use
// the article chosen in MANUAL. Image pages are left alone: they credit a picture, not a fact.
// Usage: node scripts/research/reliable-sources/replace-wikipedia.mjs [--write]
import fs from 'node:fs';
import {execSync} from 'node:child_process';
const root = new URL('../../../', import.meta.url).pathname;
const resolved = JSON.parse(fs.readFileSync(`${root}.cache/reliable-sources/wikipedia.json`, 'utf8'));
const ORDER = ['P7314', 'P1417', 'P1986', 'P3365', 'P7902', 'P1415', 'P4459', 'P902', 'P3219', 'P6058', 'P3021', 'P7982', 'P4342', 'P8313', 'P3222'];
const FMG = page => ({title: 'Foundation for Medieval Genealogy · Medieval Lands', url: `https://fmg.ac/Projects/MedLands/${page}.htm`});
const BRIT = (path, label) => ({title: `Encyclopaedia Britannica · ${label}`, url: `https://www.britannica.com/${path}`});
const wiki = title => `https://en.wikipedia.org/wiki/${title}`;
const MANUAL = {
  [wiki('List_of_governors_of_the_Habsburg_Netherlands')]: BRIT('place/Spanish-Netherlands', 'Spanish Netherlands'),
  [wiki('Margraviate_of_Baden')]: BRIT('place/Baden-historical-state-Germany', 'Baden'),
  [wiki('House_of_Avesnes')]: FMG('HAINAUT'),
  [wiki('List_of_monarchs_of_the_Armenian_Kingdom_of_Cilicia')]: BRIT('place/Little-Armenia', 'Little Armenia'),
  [wiki('Isabella,_Queen_of_Armenia')]: BRIT('topic/Hethumid-dynasty', 'Hethumid dynasty'),
  [wiki('Constantine_II,_King_of_Armenia')]: BRIT('topic/Lusignan-family', 'Lusignan family'),
  [wiki('Leo_V,_King_of_Armenia')]: BRIT('topic/Lusignan-family', 'Lusignan family'),
  [wiki('George_V_of_Georgia')]: FMG('GEORGIA'),
  [wiki('Demetrius_II_of_Georgia')]: FMG('GEORGIA'),
  [wiki('Beka_I_Jaqeli')]: FMG('GEORGIA'),
  [wiki('Bagrat_VI_of_Georgia')]: FMG('GEORGIA'),
  [wiki('George_(son_of_Constantine_I_of_Georgia)')]: FMG('GEORGIA'),
  [wiki('Vakhtang_V')]: BRIT('place/Georgia', 'Georgia: history'),
  [wiki('Rostom_of_Kartli')]: BRIT('place/Georgia', 'Georgia: history'),
  [wiki('Teimuraz_I_of_Kakheti')]: BRIT('place/Georgia', 'Georgia: history'),
  [wiki('List_of_monarchs_of_Kakheti')]: BRIT('place/Georgia', 'Georgia: history'),
  [wiki('List_of_monarchs_of_Georgia')]: FMG('GEORGIA'),
  [wiki('Helvis_of_Brunswick-Grubenhagen')]: FMG('CYPRUS'),
  [wiki('Peter_II_of_Cyprus')]: FMG('CYPRUS'),
  [wiki('Janus_of_Cyprus')]: FMG('CYPRUS'),
  [wiki('Hugh_IV_of_Cyprus')]: FMG('CYPRUS'),
  [wiki('George_V_of_Georgia')]: FMG('GEORGIA'),
  [wiki('List_of_princes_of_Transylvania')]: {title: 'Treccani · Enciclopedia', url: 'https://www.treccani.it/enciclopedia/transilvania/'},
  [wiki('Battle_of_the_Alte_Veste')]: BRIT('biography/Gustav-II-Adolf', 'Gustavus Adolphus'),
  [wiki('Asen_dynasty')]: BRIT('place/Second-Bulgarian-empire', 'Second Bulgarian Empire'),
  [wiki('House_of_La_Marck')]: {title: 'Deutsche Nationalbibliothek · GND authority record · Mark von der, Familie', url: 'https://d-nb.info/gnd/141872225'},
  ['https://es.wikipedia.org/wiki/Estado_borgo%C3%B1%C3%B3n']: {title: 'Encyclopædia Universalis · Duché de Bourgogne', url: 'https://www.universalis.fr/encyclopedie/duche-de-bourgogne/'},
};
const alive = url => { if (url.includes('britannica.com') || url.startsWith('https://d-nb.info/')) return true; try { return /^(200|301|302|308)$/.test(execSync(`curl -s -m 25 -o /dev/null -w "%{http_code}" -H "Accept: text/html" -A "Mozilla/5.0 (Macintosh)" "${url}"`, {encoding: 'utf8'})); } catch { return false; } };
const choice = {};
for (const [url, entry] of Object.entries(resolved)) {
  if (/Archivo:|File:/.test(url)) continue;
  if (MANUAL[url]) { choice[url] = MANUAL[url]; continue; }
  const works = ORDER.flatMap(p => entry.works.filter(w => w.property === p));
  const ok = works.find(w => alive(w.url));
  if (ok) choice[url] = {title: `${ok.title} · ${entry.label}`.replace(/^(Encyclopaedia Britannica|Deutsche Biographie|Treccani · Enciclopedia|Encyclopædia Universalis|Hrvatska enciklopedija) · (.*)$/, '$1 · $2'), url: ok.url};
}
for (const [url, value] of Object.entries(MANUAL)) if (!value.url.includes('britannica.com') && !alive(value.url)) console.warn('unreachable', value.url);
fs.writeFileSync(`${root}.cache/reliable-sources/replacements.json`, JSON.stringify(choice, null, 1));
console.log('replacements', Object.keys(choice).length);
