import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spanishRecordRoute, recordFromHtml} from '../src/utils/staticMetadata.js';
import {serializePage} from '../src/features/public/staticData.js';
import {IMAGE_VARIANTS} from '../src/data/imageVariants.js';
import {OG_DEFAULT_IMAGE, OG_DEFAULT_IMAGE_EN} from '../src/features/public/ogImages.js';
import worker from '../cloudflare/worker.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const record = {id: 'CARLOS5', slug: 'carlos-v', nombre: 'Carlos V', gobiernos: [], fuentes: [], quote: '</script> & <b>'};
const page = {schema: 2, kind: 'persona', slug: 'carlos-v', path: '/es/persona/carlos-v', data: record};
const html = p => `<h1>${p.data.nombre}</h1><script id="eade-initial-page" type="application/json">${serializePage(p)}</script>`;

test('Spanish record files map one-to-one onto their static pages', () => {
  assert.equal(spanishRecordRoute('/personas-meta/carlos-v.json'), '/es/persona/carlos-v');
  assert.equal(spanishRecordRoute('/dinastias-meta/habsburgo.json'), '/es/dinastia/habsburgo');
  assert.equal(spanishRecordRoute('/territorios-meta/navarra.json'), '/es/territorio/navarra');
  assert.equal(spanishRecordRoute('/historias-meta/mohacs-caida-buda.json'), '/es/historia/mohacs-caida-buda');
  assert.equal(spanishRecordRoute('/historias-meta/mohacs-caida-buda/capitulo/3.json'), '/es/historia/mohacs-caida-buda/capitulo/3');
  // The id → slug index is not a record; chapters only exist for stories.
  for (const path of ['/personas-meta/index.json', '/personas-meta/carlos-v/capitulo/2.json', '/english-meta/person-charles-v.json', '/catalogos/personas.json', '/personas-meta/Carlos V.json'])
    assert.equal(spanishRecordRoute(path), null, path);
});

test('the record is read from the page that carries it, and only from that page', () => {
  assert.deepEqual(recordFromHtml(html(page), page.path), record);
  assert.throws(() => recordFromHtml(html(page), '/es/persona/felipe-ii'), /Mismatched/);
  assert.throws(() => recordFromHtml(html({...page, kind: 'english'}), page.path), /Mismatched/);
  assert.throws(() => recordFromHtml('<h1>404</h1>', page.path), /Missing/);
});

test('old JSON addresses still answer from the static page through the Worker', async () => {
  const env = {DEPLOYMENT_ENV: 'production', ASSETS: {fetch: async request => {
    const path = new URL(request instanceof Request ? request.url : request).pathname;
    return path === page.path ? new Response(html(page)) : new Response('Missing', {status: 404});
  }}};
  const response = await worker.fetch(new Request('https://www.treeofeurope.eu/personas-meta/carlos-v.json'), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), record);
  const missing = await worker.fetch(new Request('https://www.treeofeurope.eu/personas-meta/nadie.json'), env);
  assert.equal(missing.status, 404);
});

test('the Cloudflare upload leaves out every record file its page reproduces', () => {
  const source = read('scripts/prepare-cloudflare.mjs');
  assert.match(source, /Record data differs/);
  assert.match(source, /if\(fromHtml\.has\(relative\)\)continue;/);
  assert.match(read('src/utils/loadAsset.js'), /recordFromHtml\(await loadTextAsset\(record \+ query\), record\)/);
  // The person page no longer fetches the JSON directly, so it follows the same path.
  assert.doesNotMatch(read('src/features/public/PublicSite.jsx'), /fetch\(`\/personas-meta/);
});

test('one share card per language; the per-person and per-house cards are gone', () => {
  for (const file of [OG_DEFAULT_IMAGE, OG_DEFAULT_IMAGE_EN]) assert.ok(fs.existsSync(new URL(`../public${file}`, import.meta.url)), file);
  assert.ok(!fs.existsSync(new URL('../scripts/generate/generate-og-images.mjs', import.meta.url)));
  assert.doesNotMatch(read('scripts/generate/generate-tree-base.mjs'), /ogImage/);
  assert.doesNotMatch(read('scripts/generate/generate-dinastias.mjs'), /ogImage/);
  for (const batch of fs.readdirSync(new URL('../src/features/english/v6/', import.meta.url)).filter(d => d.startsWith('batch-')))
    for (const file of fs.readdirSync(new URL(`../src/features/english/v6/${batch}/`, import.meta.url)).filter(f => f.endsWith('.json')))
      assert.doesNotMatch(read(`src/features/english/v6/${batch}/${file}`), /"ogImage"/, `${batch}/${file}`);
});

test('portraits have no 96 px variant; thumbnails use the 192 px one', () => {
  for (const [key, image] of Object.entries(IMAGE_VARIANTS)) {
    assert.ok(image.variants.length, key);
    assert.ok(image.variants.every(v => v.width !== 96), key);
  }
  assert.equal(fs.readdirSync(new URL('../public/personas-img/responsive/', import.meta.url)).filter(f => f.endsWith('-96.webp')).length, 0);
  assert.match(read('scripts/assets/portrait-variants.mjs'), /\[192, 384, 576\]/);
});

test('the Europe year is also saved when a phone sends the tab to the background', () => {
  const hook = read('src/features/atlas/useEuropeYearUrl.js');
  assert.match(hook, /addEventListener\('visibilitychange',hidden\)/);
  assert.match(hook, /removeEventListener\('visibilitychange',hidden\)/);
  assert.match(hook, /visibilityState==='hidden'/);
});
