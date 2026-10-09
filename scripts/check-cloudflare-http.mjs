import assert from 'node:assert/strict';

// Comprobación contra el runtime local o una preview real; no escribe datos.
const origin = new URL(process.argv[2] || 'http://127.0.0.1:8787').origin;
const get = (path, options = {}) => fetch(origin + path, {redirect: 'manual', ...options});
const profile = await get('/es/persona/carlos-v');
assert.equal(profile.status, 200);
assert.equal(profile.headers.get('X-Robots-Tag'), 'noindex, nofollow');
const html = await profile.text();
assert.match(html, /Carlos V/);
assert.match(html, /application\/json/);
const shell = await get('/es/persona/carlos-v?atlas=1&anio=1500');
assert.equal(shell.status, 200);
assert.doesNotMatch(await shell.text(), /"kind":"persona"/);
const head = await get('/es/persona/carlos-v', {method: 'HEAD'});
assert.equal(head.status, 200);
assert.equal(await head.text(), '');
for (const path of ['/en/person/charles-v', '/es/privacidad', '/es/mapa-completo']) {
  assert.equal((await get(path)).status, 200, path);
}
const redirect = await get('/es/historia/borgona?atlas=1');
assert.equal(redirect.status, 308);
assert.equal(new URL(redirect.headers.get('Location')).pathname, '/es/historia/borgona-el-reino-que-no-fue');
assert.equal(new URL(redirect.headers.get('Location')).search, '?atlas=1');
const embed = await get('/embed/arbol');
assert.equal(embed.status, 200);
assert.equal(embed.headers.get('X-Frame-Options'), null);
assert.match(embed.headers.get('Content-Security-Policy'), /frame-ancestors \*/);
const missing = await get('/no-existe-cloudflare-check');
assert.equal(missing.status, 404);
assert.match(await missing.text(), /id="root"/);
const api = await get('/api/payments');
assert.equal(api.status, 404);
assert.equal(api.headers.get('Cache-Control'), 'no-store');
assert.deepEqual(await api.json(), {error: 'not_found'});
const assetPath = html.match(/src="(\/assets\/[^" ]+\.js)"/)[1];
const asset = await get(assetPath);
assert.equal(asset.status, 200);
assert.match(asset.headers.get('Cache-Control'), /immutable/);
assert.ok(asset.headers.get('Content-Security-Policy'));
assert.equal((await get('/ssg-report.json')).status, 404);
console.log('Cloudflare HTTP: fichas, atlas, idioma, laboratorio, redirects, embeds, HEAD, 404, API y assets OK.');
