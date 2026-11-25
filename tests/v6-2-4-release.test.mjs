import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {authorityPatternSpec} from '../src/features/atlas/authorityPatterns.js';
import {mosaicAuthorityKind} from '../src/cartography/mosaicAuthorityKind.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const marks = spec => spec.shapes.filter(s => s.name === 'path' || s.name === 'circle');

test('a cell with several attributions keeps its dispute, fief or tributary sign', () => {
  for (const kind of ['disputed', 'apanage', 'tributary']) {
    const spec = authorityPatternSpec(['#497F67', '#7dca2b'], kind);
    // Both colours are drawn as bands, and the sign is repeated on every 0.9 cell of the tile.
    assert.deepEqual([...new Set(spec.shapes.filter(s => s.name === 'polygon').map(s => s.fill))], ['#497F67', '#7dca2b']);
    assert.equal(spec.tile, 1.8);
    assert.equal(marks(spec).length, 4, kind);
  }
  // Without a sign the bands stay alone; a sovereign single colour needs no pattern.
  assert.equal(marks(authorityPatternSpec(['#a', '#b'], null)).length, 0);
});

test('each kind keeps the sign the legend describes', () => {
  const d = kind => marks(authorityPatternSpec(['#295D8E'], kind)).map(s => s.d || s.name);
  assert.deepEqual(d('disputed'), ['M0 0 L.9 .9 M0 .9 L.9 0']);
  assert.deepEqual(d('apanage'), ['M.45 0 L.45 .9']);
  assert.deepEqual(d('delegated'), ['M0 0 L.9 .9']);
  assert.deepEqual(d('tributary'), ['circle']);
  // The tributary keeps its overlord's tint: a light veil (no longer two-thirds white) and dark dots.
  const veil = authorityPatternSpec(['#6FA59B'], 'tributary').shapes.find(s => s.name === 'rect' && s.fill === '#fff');
  assert.ok(Number(veil['fill-opacity']) <= .3);
  assert.equal(authorityPatternSpec(['#6FA59B'], 'tributary').shapes.find(s => s.name === 'circle').fill, '#1b1712');
});

test('the colour bands tile without gaps', () => {
  const {tile, shapes} = authorityPatternSpec(['#1', '#2', '#3'], null);
  const bands = shapes.filter(s => s.name === 'polygon').map(s => s.points.split(' ')[0].split(',').map(Number)[0]).sort((a, b) => a - b);
  // Band starts are evenly spaced by tile / n and cover (x + y) from -tile to 3·tile.
  for (let i = 1; i < bands.length; i++) assert.ok(Math.abs(bands[i] - bands[i - 1] - tile / 3) < 1e-9);
  assert.ok(bands[0] <= -tile + 1e-9 && bands.at(-1) + tile / 3 >= 3 * tile - 1e-9);
});

test('tributaries take dots and fiefs lines, as the common-map legend now says', () => {
  assert.equal(mosaicAuthorityKind([{tributaryRelation: {type: 'tributo'}}]), 'tributary');
  assert.equal(mosaicAuthorityKind([{tributaryRelation: {type: 'feudo'}}]), 'apanage');
  const map = read('src/features/atlas/MapaEuropa.jsx');
  assert.doesNotMatch(map, /El rayado claro indica/);
  assert.doesNotMatch(map, /tributarios otomanos como Valaquia, Moldavia o Transilvania y feudos/);
  assert.match(map, /Los puntos marcan Estados tributarios/);
  assert.match(map, /mapa-key-several/);
  assert.match(read('src/styles/app.css'), /\.mapa-key-disputed \{ background: repeating-linear-gradient\(45deg[^}]*-45deg/);
});

test('SEO I: old slugs that Google still requests redirect permanently to the current page', async () => {
  const {resolveHostingRoute} = await import('../cloudflare/routing.js');
  const expected = {
    '/es/persona/carlos-v-i-de-espana': '/es/persona/carlos-v',
    '/es/persona/matilde-de-inglaterra': '/es/persona/matilde-de-inglaterra-matildaing',
    '/es/persona/juana-de-inglaterra': '/es/persona/juana-de-inglaterra-joanenglandscot',
    '/es/historia/balduino-iv-y-saladino-un-reino-bajo-presion': '/es/historia/el-reino-de-los-cielos',
    '/es/historia/lepanto-la-alianza-imposible/capitulo/4': '/es/historia/lepanto-la-ultima-cruzada/capitulo/4',
    '/es/historia/ricardo-i-y-felipe-ii-aliados-en-la-cruzada': '/es/historia/los-reyes-cruzados',
  };
  for (const [from, to] of Object.entries(expected)) assert.deepEqual(resolveHostingRoute(new URL(from, 'https://x.test')), {redirect: to, status: 308}, from);
});

test('SEO I: every published record URL keeps answering, checked on every build', async () => {
  const {urlHistoryIssues, HISTORY_FILE, RECORD_URL} = await import('../scripts/audits/audit-url-history.mjs');
  const history = read(HISTORY_FILE).split('\n').filter(Boolean);
  assert.ok(history.length > 10000);
  assert.ok(history.every(url => RECORD_URL.test(url)));
  assert.ok(history.includes('/es/persona/carlos-v-i-de-espana'));
  // An old slug without a page needs a permanent redirect to a published page.
  const live = new Set(['/es/persona/carlos-v']);
  assert.deepEqual(urlHistoryIssues(['/es/persona/carlos-v-i-de-espana', '/es/persona/carlos-v'], live), []);
  assert.match(urlHistoryIssues(['/es/persona/nadie-de-ninguna-parte'], live)[0], /sin página ni redirección/);
  assert.match(urlHistoryIssues(['/es/persona/matilde-de-inglaterra'], live)[0], /no está publicada/);
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.scripts['build:artifacts'], /audit-url-history\.mjs/);
  assert.match(pkg.scripts['baseline:regression'], /audit-url-history\.mjs --write/);
  assert.match(read('scripts/build-cloudflare.mjs'), /audit-url-history\.mjs/);
});

test('SEO I: the 404 page declares no canonical URL; catalogues describe their lists', async () => {
  assert.match(read('src/features/public/ssg-entry.jsx'), /meta\.canonical=null;meta\.alternates=\[\];/);
  assert.match(read('scripts/lib/ssg-utils.mjs'), /\.\.\.\(meta\.canonical\?\[`<link rel="canonical"/);
  const {publicMeta, entityMeta} = await import('../src/features/public/publicMeta.js');
  const {catalogJsonLd} = await import('../src/features/public/structuredData.js');
  const data = {items: [{nombre: 'Carlos V', slug: 'carlos-v'}], partial: {total: 2904}};
  const meta = publicMeta(entityMeta('catalogo', data, 'personas'));
  const description = meta.meta.find(([, key]) => key === 'description')[2];
  assert.ok(description.length > 100 && description.length <= 160 && description.includes('2904'));
  const json = catalogJsonLd('personas', data, {path: '/es/personas', description, siteUrl: 'https://www.treeofeurope.eu', name: meta.title});
  assert.equal(json['@graph'][0]['@type'], 'CollectionPage');
  assert.equal(json['@graph'][0].mainEntity.numberOfItems, 2904);
  assert.equal(json['@graph'][0].mainEntity.itemListElement[0].url, 'https://www.treeofeurope.eu/es/persona/carlos-v');
});
