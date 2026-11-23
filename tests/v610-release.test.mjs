import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pageJsonLd, citations} from '../src/features/public/structuredData.js';
import {entityMeta, publicMeta, ENGLISH_HOME_TITLE} from '../src/features/public/publicMeta.js';
import {catalogPreview, staticPageData, CATALOG_PREVIEW, featuredOrder} from '../src/features/public/catalogPreview.js';
import {ENTITY_SUMMARIES_610, CARTOGRAPHIC_GROUPING, normalizeGrouping} from '../src/features/english/entitySummaries610.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {responsiveImage} from '../src/utils/responsiveImage.js';

const site = 'https://www.treeofeurope.eu';
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));
const graph = (kind, slug, data) => {
  const meta = publicMeta(entityMeta(kind, data, slug), site);
  return {meta, nodes: pageJsonLd({kind, slug, data}, meta, site)['@graph']};
};
const byType = (nodes, type) => nodes.find(n => n['@type'] === type);

test('both homes describe the site and its publisher, and the English home says what the site is', () => {
  const es = graph('catalogo', 'inicio', json('public/catalogos/home.json'));
  assert.equal(byType(es.nodes, 'WebSite').name, 'El Árbol de Europa');
  assert.ok(byType(es.nodes, 'Organization').logo.url.endsWith('/brand/apple-touch-icon.png'));
  const home = json('public/english-meta/home.json');
  assert.match(home.description, /^A free genealogical atlas of medieval and early modern Europe: [\d,]+ people, [\d,]+ royal and noble houses and [\d,]+ territories/);
  assert.ok(home.description.length >= 120 && home.description.length <= 170, String(home.description.length));
  const en = graph('english', 'home', home);
  assert.equal(en.meta.title, ENGLISH_HOME_TITLE);
  assert.equal(en.meta.meta.find(([, key]) => key === 'og:image:alt')[2], 'The Tree of Europe');
  assert.equal(byType(en.nodes, 'WebSite').inLanguage.join(), 'es,en');
});

test('stories are Articles about their protagonists, with their sources', () => {
  const data = json('public/historias-meta/puertas-viena.json');
  const {nodes} = graph('historia', 'puertas-viena', data);
  const article = byType(nodes, 'Article');
  assert.equal(article.headline, 'A las puertas de Viena');
  assert.ok(article.about.some(p => p.name === 'Mehmed IV' && p.url.endsWith('/es/persona/mehmed-iv')));
  assert.ok(article.citation.length > 0 && article.citation.every(c => /^https?:\/\//.test(c.url)));
  assert.equal(article.author.name, 'El Árbol de Europa');
  assert.ok(byType(nodes, 'BreadcrumbList'));
});

test('territories are places, houses are collections of their members, and records cite their sources', () => {
  const t = graph('territorio', 'castilla', json('public/territorios-meta/castilla.json')).nodes;
  assert.equal(byType(t, 'AdministrativeArea').name, 'Castilla');
  assert.equal(byType(t, 'WebPage').about['@id'], byType(t, 'AdministrativeArea')['@id']);
  const d = graph('dinastia', 'habsburgo', json('public/dinastias-meta/habsburgo.json')).nodes;
  const list = byType(d, 'CollectionPage').mainEntity;
  assert.equal(list['@type'], 'ItemList');
  assert.ok(list.itemListElement.length > 10 && list.itemListElement.length <= 50);
  assert.ok(list.numberOfItems >= list.itemListElement.length);
  const p = graph('persona', 'carlos-v', json('public/personas-meta/carlos-v.json')).nodes;
  assert.ok(byType(p, 'WebPage').citation.length > 0 && byType(p, 'WebPage').citation.length <= 12);
  assert.deepEqual(citations([{titulo: 'A', url: 'https://a.test'}, {titulo: 'A again', url: 'https://a.test'}, {titulo: 'No link'}, 'text']), [{'@type': 'CreativeWork', name: 'A', url: 'https://a.test'}]);
});

test('catalogue pages carry their first items in display order, the totals and the facets', () => {
  const full = json('public/catalogos/personas.json');
  const preview = staticPageData({kind: 'catalogo', slug: 'personas'}, full);
  assert.equal(preview.items.length, CATALOG_PREVIEW);
  assert.deepEqual(preview.items.map(p => p.id), featuredOrder(full.items).slice(0, CATALOG_PREVIEW).map(p => p.id));
  assert.equal(preview.partial.total, full.items.length);
  assert.equal(preview.partial.full, '/catalogos/personas.json');
  assert.equal(preview.partial.facetas.siglos.reduce((n, [, c]) => n + c, 0), full.items.filter(p => p.siglo != null).length);
  assert.equal(staticPageData({kind: 'catalogo', slug: 'historias'}, {items: [1]}).partial, undefined);
  assert.equal(catalogPreview({items: [1, 2]}, {tipo: 'dinastias', full: '/x.json'}).partial, undefined);
  // English: the page carries the preview; the complete list is its own file.
  const people = json('public/english-meta/people.json');
  assert.equal(people.people.length, CATALOG_PREVIEW);
  assert.equal(people.partial.full, '/catalogos/people-en.json');
  assert.equal(json('public/catalogos/people-en.json').items.length, people.partial.total);
  for (const type of ['dynasties', 'territories']) assert.equal(json(`public/catalogos/${type}-en.json`).items.length, json(`public/english-meta/${type}.json`).partial.total);
  assert.match(read('src/features/public/PublicSite.jsx'), /loadJsonAsset\(preview\.full\)/);
});

test('the root, trailing slashes and /index.html redirect permanently; the home map is preloaded', () => {
  const routes = json('routes.json');
  assert.deepEqual(routes.redirects[0], {source: '/', destination: '/es', permanent: true});
  const prerender = read('scripts/generate/prerender-ssg.mjs');
  assert.match(prerender, /rel="preload" as="image" href="\/home\/mapa-1500-\$\{name\}\$\{size\}\.webp"/);
  assert.match(read('scripts/lib/ssg-utils.mjs'), /media="not all"/);
  // Phones do not show the home map, so it is neither preloaded nor downloaded there.
  assert.match(read('src/features/public/home-atlas.css'), /@media \(max-width:650px\)\{\.home-atlas-map\{display:none\}\}/);
  assert.match(prerender, /min-width: 651px\) and \(max-width: 980px/);
});

test('portraits have a 576 px variant, which phones use on the home cards', () => {
  const large = Object.values(IMAGE_VARIANTS).filter(image => image.variants.some(v => v.width === 768));
  assert.ok(large.length > 300);
  for (const image of large) {
    const v576 = image.variants.find(v => v.width === 576);
    assert.ok(v576, JSON.stringify(image.variants));
    assert.ok(fs.existsSync(new URL(`../public${v576.src}`, import.meta.url)), v576.src);
  }
  const key = Object.keys(IMAGE_VARIANTS).find(k => IMAGE_VARIANTS[k].variants.some(v => v.width === 768));
  assert.match(responsiveImage(key).srcSet, /576w/);
  assert.match(read('src/features/public/HomeDiscovery.jsx'), /sizes = '\(max-width: 650px\) 76vw, 300px'/);
  for (const year of [1250, 1500, 1789]) for (const theme of ['claro', 'oscuro']) assert.ok(fs.existsSync(new URL(`../public/home/mapa-${year}-${theme}-800.webp`, import.meta.url)));
});

test('English summaries of houses and territories are rewritten by hand, without calques', () => {
  assert.ok(Object.keys(ENTITY_SUMMARIES_610).length >= 140);
  const flanders = json('public/english-meta/territory-flanders.json');
  assert.match(flanders.description, /^The County of Flanders had a history of its own/);
  assert.equal(json('public/english-meta/territory-mecklemburgo-strelitz.json').nombre, 'Mecklenburg-Strelitz');
  assert.equal(normalizeGrouping('Mapping of jurisdictions, communities or transition phases; does not establish a single government. More.'), `${CARTOGRAPHIC_GROUPING} More.`);
  const bad = /\b(kroner|Oldburgh|San Galo|Gold Bullet|habsburgic|Magnanimousus|preposterous|Buy for|Senescales|Condal|Abasial|cysterciense|feudenite|trilvane|Koropanić|Cirkrena|Lusacia|Mecklemburgo)\b/;
  for (const file of fs.readdirSync(new URL('../public/english-meta/', import.meta.url)).filter(f => /^(territory|dynasty)-.*\.json$/.test(f))) {
    const page = json(`public/english-meta/${file}`);
    assert.doesNotMatch(`${page.nombre} ${page.description || ''}`, bad, file);
    assert.doesNotMatch(page.description || '', /^(?:A |This )?(?:cartographic grouping|mapping) of jurisdictions/i, file);
  }
});
