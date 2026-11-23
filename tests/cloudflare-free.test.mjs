import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../cloudflare/worker.js';
import {resolveHostingRoute,securityHeaders,staticHeadersFile,staticRedirectsFile,redirectWorkerPatterns} from '../cloudflare/routing.js';
import {metadataFromHtml} from '../src/utils/staticMetadata.js';
const url=path=>new URL(path,'https://example.test');
const config=JSON.parse(fs.readFileSync(new URL('../wrangler.jsonc',import.meta.url)));

test('common SSG and atlas URLs remain static-first; only legacy redirects force the Worker',()=>{
 assert.equal(config.assets.html_handling,'drop-trailing-slash');
 assert.equal(config.assets.not_found_handling,'none');
 assert.deepEqual(config.assets.run_worker_first,redirectWorkerPatterns);
 for(const path of ['/es/persona/carlos-v','/es/persona/carlos-v?atlas=1','/en/person/charles-v','/assets/main.js','/personas-meta/carlos-v.json']) {
  const pathname=url(path).pathname;
  assert(!redirectWorkerPatterns.some(p=>p.endsWith('*')?pathname.startsWith(p.slice(0,-1)):p===pathname),path);
 }
 assert.equal(config.env.preview.name,'eade-cloudflare-preview');assert.equal(config.env.preview.vars.DEPLOYMENT_ENV,'preview');assert(!config.env.preview.routes);assert(!config.account_id);
});

test('the adapter preserves languages, chapters, atlas selection and wildcard redirects',()=>{
 for(const [path,asset]of [
  ['/es/persona/carlos-v','/es/persona/carlos-v/index.html'],
  ['/es/persona/carlos-v?atlas=1','/index.html'],
  ['/en/person/charles-v','/en/person/charles-v/index.html'],
  ['/en/story/a-story/chapter/2','/en/story/a-story/chapter/2/index.html'],
  ['/es/historia/una-historia/capitulo/2','/es/historia/una-historia/capitulo/2/index.html'],
  ['/es/mapa-completo','/labs/cartography/territorial-corridors.html'],
  ['/embed/persona/CARLOS5','/index.html']])assert.equal(resolveHostingRoute(url(path)).asset,asset,path);
 assert.deepEqual(resolveHostingRoute(url('/es/historia/la-revolucion-protestante/capitulo/3')),{redirect:'/es/historia/la-reforma-protestante/capitulo/3',status:308});
});

test('embedded metadata can replace the separate JSON without interpreting HTML as code',()=>{
 const data={path:'/en/person/charles-v',nombre:'Charles V',slug:'charles-v',quote:'<script> & "'};
 const html=`<h1>Charles V</h1><script id="eade-initial-page" type="application/json">${JSON.stringify({schema:2,kind:'english',path:data.path,data}).replaceAll('<','\\u003c')}</script>`;
 assert.deepEqual(metadataFromHtml(html,data.path),data);
 assert.throws(()=>metadataFromHtml(html,'/en/person/someone-else'));
 assert.throws(()=>metadataFromHtml('<html>Unavailable</html>',data.path));
});

test('security policy preserves script hashes, limits framing and removes unused Vercel endpoints',()=>{
 const headers=new Map(securityHeaders('/es'));
 assert.equal(headers.get('X-Frame-Options'),'SAMEORIGIN');
 assert.match(headers.get('Content-Security-Policy'),/sha256-WHY0CX3yDCytjSEVpF8QXtv386ZqbX3iSd2\+iIVu2HU=/);
 assert(!headers.get('Content-Security-Policy').includes('vercel'));
 assert.match(new Map(securityHeaders('/embed/arbol')).get('Content-Security-Policy'),/frame-ancestors \*/);
 assert.match(staticHeadersFile(),/max-age=31536000, immutable/);
});

const env={DEPLOYMENT_ENV:'preview',ASSETS:{fetch:async request=>{
 const pathname=new URL(request instanceof Request?request.url:request).pathname;
 if(pathname==='/'||pathname==='/404')return new Response('<h1>Page</h1>',{headers:{'Content-Type':'text/html'}});
 return new Response('Missing',{status:404});
}}};
test('fallback routes return real errors and API/POST requests do not become successful HTML',async()=>{
 const missing=await worker.fetch(new Request(url('/no-such-page')),env);assert.equal(missing.status,404);
 assert.equal(missing.headers.get('X-Robots-Tag'),'noindex, nofollow');
 const api=await worker.fetch(new Request(url('/api/payments')),env);assert.equal(api.status,404);assert.deepEqual(await api.json(),{error:'not_found'});
 const post=await worker.fetch(new Request(url('/es'),{method:'POST'}),env);assert.equal(post.status,405);
 const embed=await worker.fetch(new Request(url('/embed/arbol')),env);assert.equal(embed.status,200);assert.equal(embed.headers.get('X-Frame-Options'),null);
 const redirect=await worker.fetch(new Request(url('/es/dinastia/ivrea?atlas=1')),env);assert.equal(redirect.status,308);assert.equal(redirect.headers.get('Location'),'https://example.test/es/dinastia/ivrea-borgona?atlas=1');
});

test('production is explicit, limited to the owned domains, and temporary hosts remain noindex',async()=>{
 assert.equal(config.name,'el-arbol-de-europa');
 assert.equal(config.vars.DEPLOYMENT_ENV,'production');
 assert.deepEqual(config.routes.map(r=>r.pattern).sort(),['treeofeurope.eu','www.treeofeurope.eu']);
 assert(config.routes.every(r=>r.custom_domain===true));
 const response=await worker.fetch(new Request('https://example.workers.dev/embed/arbol'),{...env,DEPLOYMENT_ENV:'production'});
 assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow');
});

test('6.1.0: the root and the alternative URL forms redirect permanently to the canonical page',()=>{
 assert.deepEqual(resolveHostingRoute(url('/')),{redirect:'/es',status:308});
 assert(redirectWorkerPatterns.includes('/'));
 const rules=staticRedirectsFile().trim().split('\n').map(line=>line.split(' '));
 assert(rules.every(rule=>rule.length===3&&rule[2]==='301'));
 assert(rules.some(([from,to])=>from==='/:p0/:p1/:p2/'&&to==='/:p0/:p1/:p2'));
 assert(rules.some(([from,to])=>from==='/:p0/:p1/:p2/:p3/:p4/index.html'&&to==='/:p0/:p1/:p2/:p3/:p4'));
 // A rule for "/" would also redirect the shell the Worker fetches for embeds.
 assert(!rules.some(([from])=>from==='/'));
 assert.match(fs.readFileSync(new URL('../scripts/prepare-cloudflare.mjs',import.meta.url),'utf8'),/'_redirects'\),staticRedirectsFile\(\)/);
});
