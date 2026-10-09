import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
import worker from '../cloudflare/worker.js';
import {resolveHostingRoute, securityHeaders, staticHeadersFile} from '../cloudflare/routing.js';
import config from '../vercel.json' with {type: 'json'};
import {NOTICE_HASH} from '../scripts/security-policy.mjs';

const origin = 'https://preview.example.org';
const route = path => resolveHostingRoute(new URL(path, origin));
const documents = new Map([
  ['/index.html', '<div id="root"></div>'],
  ['/es/persona/carlos-v/index.html', '<h1>Carlos V</h1>'],
  ['/404.html', '<h1>Esta rama no existe</h1>'],
]);
function environment(deployment = 'preview') {
  return {DEPLOYMENT_ENV: deployment, ASSETS: {fetch: async request => {
    const html = documents.get(new URL(request.url).pathname);
    return new Response(html || 'Not found', {status: html ? 200 : 404, headers: {
      'Content-Type': 'text/html', 'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'"
    }});
  }}};
}

test('las fichas ES/EN, capítulos, catálogos, laboratorio y embeds mantienen su URL pública', () => {
  const cases = [
    ['/', '/index.html'], ['/es', '/index.html'], ['/es/', '/index.html'],
    ['/es/persona/carlos-v', '/es/persona/carlos-v/index.html'],
    ['/es/persona/carlos-v/', '/es/persona/carlos-v/index.html'],
    ['/es/dinastia/habsburgo', '/es/dinastia/habsburgo/index.html'],
    ['/es/territorio/castilla', '/es/territorio/castilla/index.html'],
    ['/es/historia/los-condotieros', '/es/historia/los-condotieros/index.html'],
    ['/es/historia/los-condotieros/capitulo/2', '/es/historia/los-condotieros/capitulo/2/index.html'],
    ['/es/historia/los-condotieros/capitulo/2/', '/es/historia/los-condotieros/capitulo/2/index.html'],
    ['/en', '/en/index.html'], ['/en/', '/en/index.html'],
    ['/en/person/charles-v', '/en/person/charles-v/index.html'],
    ['/en/story/a/chapter/2', '/en/story/a/chapter/2/index.html'],
    ['/en/story/a/chapter/2/', '/en/story/a/chapter/2/index.html'],
    ['/en/stories', '/en/stories/index.html'], ['/en/people/', '/en/people/index.html'],
    ['/en/methodology', '/en/methodology/index.html'],
    ['/en/privacy', '/index.html'], ['/es/privacidad/', '/index.html'],
    ['/es/desafio', '/index.html'], ['/es/personas', '/index.html'],
    ['/es/mapa-completo', '/prototypes/euv-locations/territorial-corridors.html'],
    ['/es/laboratorio-render/', '/index.html'],
    ['/embed/persona/carlos-v', '/index.html'], ['/embed/arbol/', '/index.html'],
    ['/persona/carlos-v', '/index.html'],
    ['/assets/main-hash.js', '/assets/main-hash.js'], ['/missing', '/missing'],
  ];
  for (const [path, asset] of cases) assert.deepEqual(route(path), {asset}, path);
});

test('atlas=1 entrega el shell sin redirigir, pero otros parámetros conservan el HTML de la ficha', async () => {
  for (const path of ['/es/persona/carlos-v', '/es/dinastia/habsburgo/', '/es/territorio/castilla', '/es/historia/los-condotieros/']) {
    assert.deepEqual(route(`${path}?atlas=1&anio=1500`), {asset: '/index.html'}, path);
    assert.notEqual(route(`${path}?atlas=0`).asset, '/index.html', path);
  }
  const response = await worker.fetch(new Request(`${origin}/es/persona/carlos-v?atlas=1`), environment());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Location'), null);
  assert.match(await response.text(), /id="root"/);
  assert.match(await (await worker.fetch(new Request(`${origin}/es/persona/carlos-v?q=atlas`), environment())).text(), /Carlos V/);
});

test('todas las redirecciones históricas conservan los parámetros y su carácter permanente', async () => {
  for (const rule of config.redirects) {
    const response = await worker.fetch(new Request(`${origin}${rule.source}?atlas=1&anio=1500`), environment());
    assert.equal(response.status, 308, rule.source);
    assert.equal(response.headers.get('Location'), `${origin}${rule.destination}?atlas=1&anio=1500`);
  }
});

test('solo los embeds previstos permiten iframe externo y la CSP conserva el hash autorizado', async () => {
  for (const path of ['/embed/arbol', '/embed/arbol/', '/embed/persona/carlos-v', '/embed/persona/carlos-v/']) {
    const response = await worker.fetch(new Request(origin + path), environment('production'));
    assert.equal(response.headers.get('X-Frame-Options'), null);
    assert.match(response.headers.get('Content-Security-Policy'), /frame-ancestors \*/);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex');
  }
  for (const path of ['/es/', '/es/persona/carlos-v', '/embed/arbol/extra', '/embed/persona/']) {
    const headers = new Headers(securityHeaders(path));
    assert.equal(headers.get('X-Frame-Options'), 'SAMEORIGIN');
    assert.ok(headers.get('Content-Security-Policy').includes(NOTICE_HASH));
    assert.match(headers.get('Content-Security-Policy'), /frame-ancestors 'self'/);
    assert.doesNotMatch(headers.get('Content-Security-Policy'), /vercel|pusher/);
  }
  assert.match(staticHeadersFile(), /Cache-Control: public, max-age=31536000, immutable/);
  assert.match(staticHeadersFile(), /workers\.dev\/\*\n  X-Robots-Tag: noindex, nofollow/);
});

test('preview no se indexa, HEAD no devuelve cuerpo, errores son 404 y las API no caen al shell', async () => {
  const request = (path, method = 'GET') => new Request(origin + path, {method});
  const preview = await worker.fetch(request('/es/persona/carlos-v'), environment());
  assert.equal(preview.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  const production = await worker.fetch(request('/es/persona/carlos-v'), environment('production'));
  assert.equal(production.headers.get('X-Robots-Tag'), null);
  const head = await worker.fetch(request('/es/persona/carlos-v', 'HEAD'), environment());
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  const missing = await worker.fetch(request('/missing'), environment('production'));
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Esta rama no existe/);
  assert.equal(missing.headers.get('X-Robots-Tag'), 'noindex, follow');
  for (const method of ['GET', 'POST']) {
    const api = await worker.fetch(request('/api/checkout', method), environment());
    assert.equal(api.status, 404);
    assert.equal(api.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(await api.json(), {error: 'not_found'});
  }
  const post = await worker.fetch(request('/es/', 'POST'), environment());
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('Allow'), 'GET, HEAD');
});

test('el build Cloudflare no inyecta Speed Insights y muestra la privacidad del alojamiento correcto', async () => {
  const temp = await fs.mkdtemp(new URL('../.ssg-build-cloudflare-', import.meta.url).pathname);
  const originalNodeEnv = process.env.NODE_ENV;
  const dom = new JSDOM('<!doctype html><head></head><body></body>', {url: origin});
  try {
    await build({configFile: false, publicDir: false, logLevel: 'error',
      define: {'import.meta.env.VITE_HOSTING_PROVIDER': JSON.stringify('cloudflare')},
      build: {ssr: 'src/monitoring.js', outDir: temp, minify: false, rolldownOptions: {output: {entryFileNames: 'monitoring.mjs'}}}
    });
    const previousWindow = globalThis.window, previousDocument = globalThis.document;
    globalThis.window = dom.window; globalThis.document = dom.window.document;
    try {
      const {startSpeedInsights} = await import(pathToFileURL(`${temp}/monitoring.mjs`).href);
      startSpeedInsights();
      assert.equal(dom.window.document.querySelectorAll('script').length, 0);
    } finally {globalThis.window = previousWindow; globalThis.document = previousDocument;}
    await build({configFile: false, publicDir: false, logLevel: 'error',
      define: {'import.meta.env.VITE_HOSTING_PROVIDER': JSON.stringify('cloudflare')},
      plugins: [{name: 'privacy-meta-fixture', enforce: 'pre',
        resolveId(id, importer) {
          if (id === './PublicSite.jsx' && importer?.endsWith('/src/public/PrivacyPage.jsx')) return '\0privacy-meta';
        },
        load(id) {if (id === '\0privacy-meta') return 'export function usePublicMeta() {}';}
      }],
      build: {ssr: 'src/public/PrivacyPage.jsx', outDir: temp, emptyOutDir: false, minify: false, rolldownOptions: {output: {entryFileNames: 'privacy.mjs'}}}
    });
    const React = await import('react');
    const {renderToStaticMarkup} = await import('react-dom/server');
    const {default: PrivacyPage} = await import(pathToFileURL(`${temp}/privacy.mjs`).href);
    for (const locale of ['es', 'en']) {
      const html = renderToStaticMarkup(React.createElement(PrivacyPage, {locale}));
      assert.match(html, /Cloudflare/);
      assert.doesNotMatch(html, /El sitio se aloja en Vercel|The site runs on Vercel/);
    }
  } finally {
    dom.window.close();
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalNodeEnv;
    await fs.rm(temp, {recursive: true, force: true});
  }
});
