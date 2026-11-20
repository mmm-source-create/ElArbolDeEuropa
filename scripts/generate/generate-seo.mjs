// 6.0.10: data for the static hub pages and sitemaps split by type.
// 1. public/catalogos: the Spanish home, catalogues and the A–Z people index
//    (both languages) as static page data.
// 2. lastmod: the date a page's data last changed. src/data/sitemapLastmod.json
//    keeps a hash per URL; a new or changed hash takes today's date. Commit the
//    file after `npm run prebuild` so the dates stay stable between builds.
// 3. public/sitemap-full.xml (every URL, read by the static build) with lastmod,
//    one sitemap per type in public/sitemaps/ and public/sitemap.xml as index.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {loadEnv} from 'vite';
import {resolveSiteUrl} from '../../src/app/siteConfig.js';
import {STATIC_FOLDERS, staticRoute} from '../../src/features/public/staticData.js';
import {lifeDates} from '../../src/features/public/seoText.js';
import {isNamedDynasty} from '../../src/data/dynastyNames.js';

const ROOT = process.cwd();
const SITE_URL = resolveSiteUrl(loadEnv('production', ROOT, 'VITE_').VITE_SITE_URL);
const PUBLIC = path.join(ROOT, 'public');
const LASTMOD_FILE = path.join(ROOT, 'src/data/sitemapLastmod.json');
const today = process.env.SITEMAP_DATE || new Date().toISOString().slice(0, 10);
const read = async file => JSON.parse(await fs.readFile(path.join(PUBLIC, file), 'utf8'));
const write = (file, data) => fs.writeFile(path.join(PUBLIC, file), JSON.stringify(data));

// 1. Static page data.
const home = JSON.parse(await fs.readFile(path.join(ROOT, 'src/generated/home.json'), 'utf8'));
await write('catalogos/inicio.json', {...home, nombre: 'La historia de Europa, vista como una red', slug: 'inicio'});
const names = {personas: 'Personas', dinastias: 'Dinastías', territorios: 'Territorios', historias: 'Historias'};
for (const [slug, nombre] of Object.entries(names)) {
  const data = await read(`catalogos/${slug}.json`);
  await write(`catalogos/${slug}.json`, {...data, nombre, slug});
}
const compare = locale => (a, b) => a.n.localeCompare(b.n, locale, {sensitivity: 'base'});
const esPeople = (await read('catalogos/personas.json')).items;
await write('catalogos/indice.json', {nombre: 'Índice de personas de la A a la Z', slug: 'indice', items: esPeople.map(p => ({n: p.nombre, p: `/es/persona/${p.slug}`, d: lifeDates(p), c: isNamedDynasty(p.dinastia) ? p.dinastia : ''})).sort(compare('es'))});
const enPeople = (await read('english-meta/people.json')).people;
await write('catalogos/index-en.json', {nombre: 'People from A to Z', slug: 'index-en', items: enPeople.map(p => ({n: p.nombre, p: p.path, d: lifeDates(p, 'en'), c: isNamedDynasty(p.dinastia) ? p.dinastia : ''})).sort(compare('en'))});

// 2. lastmod per URL.
const xml = await fs.readFile(path.join(PUBLIC, 'sitemap-full.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
let previous = {};
try { previous = JSON.parse(await fs.readFile(LASTMOD_FILE, 'utf8')); } catch { /* first run */ }
const lastmod = {};
async function pageHash(pathname) {
  const route = staticRoute(pathname);
  const file = route && path.join(PUBLIC, STATIC_FOLDERS[route.kind], `${route.slug}${route.chapter ? `/capitulo/${route.chapter}` : ''}.json`);
  let content = pathname;
  if (file) try { content = await fs.readFile(file, 'utf8'); } catch { /* pages without data keep their first date */ }
  return crypto.createHash('sha1').update(content).digest('hex').slice(0, 12);
}
for (const url of urls) {
  const pathname = new URL(url.replace(/&amp;/g, '&')).pathname;
  const hash = await pageHash(pathname);
  const [oldHash, oldDate] = previous[pathname] || [];
  lastmod[pathname] = [hash, oldHash === hash && oldDate ? oldDate : today];
}
await fs.writeFile(LASTMOD_FILE, `${JSON.stringify(lastmod, null, 0).replace(/\],"/g, '],\n"')}\n`);

// 3. Sitemaps.
const GROUPS = [
  ['personas', p => p.startsWith('/es/persona/')],
  ['people-en', p => p.startsWith('/en/person/')],
  ['dinastias', p => p.startsWith('/es/dinastia/') || p.startsWith('/en/dynasty/')],
  ['territorios', p => p.startsWith('/es/territorio/') || p.startsWith('/en/territory/')],
  ['historias', p => p.startsWith('/es/historia/') || p.startsWith('/en/story/')],
  ['paginas', () => true],
];
const entry = url => { const pathname = new URL(url.replace(/&amp;/g, '&')).pathname; return `  <url><loc>${url}</loc><lastmod>${lastmod[pathname][1]}</lastmod></url>`; };
const urlset = list => ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...list.map(entry), '</urlset>', ''].join('\n');
await fs.writeFile(path.join(PUBLIC, 'sitemap-full.xml'), urlset(urls));
await fs.mkdir(path.join(PUBLIC, 'sitemaps'), {recursive: true});
const remaining = new Set(urls), index = [];
for (const [name, test] of GROUPS) {
  const list = [...remaining].filter(url => test(new URL(url.replace(/&amp;/g, '&')).pathname));
  list.forEach(url => remaining.delete(url));
  if (!list.length) continue;
  await fs.writeFile(path.join(PUBLIC, 'sitemaps', `${name}.xml`), urlset(list));
  const newest = list.map(url => lastmod[new URL(url.replace(/&amp;/g, '&')).pathname][1]).sort().at(-1);
  index.push(`  <sitemap><loc>${SITE_URL}/sitemaps/${name}.xml</loc><lastmod>${newest}</lastmod></sitemap>`);
}
await fs.writeFile(path.join(PUBLIC, 'sitemap.xml'), ['<?xml version="1.0" encoding="UTF-8"?>', '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...index, '</sitemapindex>', ''].join('\n'));
console.log(`SEO: ${urls.length} URL en ${index.length} sitemaps · ${Object.values(lastmod).filter(([, d]) => d === today).length} con fecha ${today}`);
