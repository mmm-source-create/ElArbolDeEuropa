// 6.0.16 · Finds reliable reference works for every Wikipedia page cited in the project.
// Each Wikipedia page is resolved to its Wikidata item only to read the identifiers that the item
// stores for national encyclopaedias and biographical dictionaries. Wikipedia and Wikidata are not cited.
// Usage: node scripts/research/reliable-sources/resolve-wikipedia.mjs  → .cache/reliable-sources/wikipedia.json
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import {getJSON,sleep} from '../authority-review/http.mjs';
export const WORKS = [
  ['P1417', 'Encyclopaedia Britannica', id => `https://www.britannica.com/${id}`],
  ['P1986', 'Treccani · Dizionario Biografico degli Italiani', id => `https://www.treccani.it/enciclopedia/${id}_(Dizionario-Biografico)`],
  ['P3365', 'Treccani · Enciclopedia', id => `https://www.treccani.it/enciclopedia/${id}`],
  ['P7902', 'Deutsche Biographie', id => `https://www.deutsche-biographie.de/${id}.html`],
  ['P1415', 'Oxford Dictionary of National Biography', id => `https://doi.org/10.1093/ref:odnb/${id}`],
  ['P4459', 'Real Academia de la Historia · Diccionario Biográfico español', id => `https://dbe.rah.es/biografias/${id}`],
  ['P902', 'Historisches Lexikon der Schweiz', id => `https://hls-dhs-dss.ch/de/articles/${id}/`],
  ['P1296', 'Gran Enciclopèdia Catalana', id => `https://www.enciclopedia.cat/${id}`],
  ['P6058', 'Larousse · Encyclopédie', id => `https://www.larousse.fr/encyclopedie/${id}`],
  ['P3219', 'Encyclopædia Universalis', id => `https://www.universalis.fr/encyclopedie/${id}/`],
  ['P3021', 'Encyclopædia Iranica', id => `https://www.iranicaonline.org/articles/${id}`],
  ['P4342', 'Store norske leksikon', id => `https://snl.no/${id}`],
  ['P8313', 'Den Store Danske', id => `https://denstoredanske.lex.dk/${id}`],
  ['P3222', 'Nationalencyklopedin', id => `https://www.ne.se/uppslagsverk/encyklopedi/lång/${id}`],
  ['P7982', 'Hrvatska enciklopedija', id => `https://www.enciklopedija.hr/clanak/${id}`],
  ['P7314', 'TDV İslâm Ansiklopedisi', id => `https://islamansiklopedisi.org.tr/${id}`],
  ['P2924', 'Gran Enciclopedia Rusa', id => `https://old.bigenc.ru/text/${id}`],
];
const cache = new URL('../../../.cache/reliable-sources/', import.meta.url);
fs.mkdirSync(cache, {recursive: true});
const file = new URL('wikipedia.json', cache);
const out = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
const root = new URL('../../../', import.meta.url).pathname;
const grep = execSync(`grep -rhoE "https://[a-z]{2}\\.wikipedia\\.org/wiki/[^\\"' \\\`]+" src --exclude-dir=generated --exclude-dir=v6 || true`, {cwd: root, encoding: 'utf8'});
// A closing parenthesis belongs to the URL only when the title opened one.
const balanced = url => { while (url.endsWith(')') && (url.match(/\(/g) || []).length < (url.match(/\)/g) || []).length) url = url.slice(0, -1); return url.replace(/[.,;]+$/, ''); };
// Broader articles used when the cited page has no counterpart in a reference work.
const EXTRA = ['Margraviate of Baden', 'Baden', 'Burgundian State', 'Transylvania', 'Kingdom of Georgia', 'Kingdom of Kakheti', 'Kingdom of Kartli', 'Armenian Kingdom of Cilicia', 'Habsburg Netherlands', 'Spanish Netherlands', 'Seventeen Provinces', 'House of Avesnes', 'County of Hainaut', 'Bagrationi dynasty', 'Lusignan dynasty', 'Hethumids', 'Rubenids', 'House of Lusignan', 'Battle of the Alte Veste', 'Second Bulgarian Empire', 'Duchy of Burgundy', 'Burgundian Netherlands', 'Georgia (country)', 'Kingdom of Kartli-Kakheti', 'County of Mark', 'Duchy of Cleves', 'Hainaut (province)'].map(t => `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, '_'))}`);
// Biography references built by helper functions are read from the modules themselves.
const {V607_REFERENCES} = await import('../../../src/content/v607People.js');
const built = Object.values(V607_REFERENCES).flat().map(ref => ref.url).filter(url => /wikipedia\.org\/wiki\//.test(url));
const urls = [...new Set([...grep.split('\n').filter(Boolean).map(balanced), ...EXTRA, ...built])].filter(url => !out[url]);
console.log('to resolve', urls.length);
for (const url of urls) {
  const {hostname, pathname} = new URL(url);
  const lang = hostname.split('.')[0], title = decodeURIComponent(pathname.slice(6)).replace(/_/g, ' ');
  const page = await getJSON(`https://${lang}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageprops&ppprop=wikibase_item&titles=${encodeURIComponent(title)}`);
  const qid = Object.values(page.query?.pages || {})[0]?.pageprops?.wikibase_item;
  if (!qid) { out[url] = {qid: null, works: []}; continue; }
  const item = await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims|labels&languages=en&ids=${qid}`);
  const claims = item.entities?.[qid]?.claims || {};
  const works = WORKS.flatMap(([property, title, link]) => (claims[property] || []).slice(0, 1).map(s => s.mainsnak?.datavalue?.value).filter(Boolean).map(id => ({property, title, url: link(id)})));
  out[url] = {qid, label: item.entities?.[qid]?.labels?.en?.value || title, works};
  await sleep(400);
}
fs.writeFileSync(file, JSON.stringify(out, null, 1));
const found = Object.values(out).filter(v => v.works.length).length;
console.log('resolved', Object.keys(out).length, 'with a reliable work', found);
