import assert from 'node:assert/strict';
import {metadataFromHtml} from '../src/utils/staticMetadata.js';
const origin=new URL(process.argv[2]||'http://127.0.0.1:8787').origin;
const get=(path,options={})=>fetch(origin+path,{redirect:'manual',...options});
const direct=[
 '/es/persona/carlos-v','/en/person/charles-v',
 '/es/historia/maria-de-borgona-una-herencia-negociada',
 '/en/story/habsburgs-and-capetians',
 '/es/persona/carlos-v?atlas=1&anio=1500','/es/personas','/es/privacidad','/en/privacy'
];
for(const path of direct){
 const response=await get(path);assert.equal(response.status,200,path);
 assert.equal(response.headers.get('X-EADE-Routing'),null,`Worker invoked for static path ${path}`);
 assert.equal(response.headers.get('X-Frame-Options'),'SAMEORIGIN',path);
 await response.arrayBuffer();
}
const profile=await get('/en/person/charles-v'),html=await profile.text();
const data=metadataFromHtml(html,'/en/person/charles-v');assert.match(data.nombre,/Charles V/);
const metadataIndex=await(await get('/cloudflare-meta-index.json')).json();
const metadataPath=Object.keys(metadataIndex).find(key=>metadataIndex[key]==='/en/person/charles-v');
const legacy=await get(metadataPath);assert.equal(legacy.status,200);assert.deepEqual(await legacy.json(),data);
const head=await get('/es/persona/carlos-v',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
const redirect=await get('/es/historia/borgona?atlas=1');assert.equal(redirect.status,308);
assert.equal(new URL(redirect.headers.get('Location')).pathname,'/es/historia/borgona-el-reino-que-no-fue');
assert.equal(new URL(redirect.headers.get('Location')).search,'?atlas=1');
const map=await get('/es/mapa-completo');assert.equal(map.status,200);await map.arrayBuffer();
const embed=await get('/embed/arbol');assert.equal(embed.status,200);assert.equal(embed.headers.get('X-Frame-Options'),null);assert.match(embed.headers.get('Content-Security-Policy'),/frame-ancestors \*/);await embed.arrayBuffer();
const missing=await get('/no-existe-cloudflare-check');assert.equal(missing.status,404);await missing.arrayBuffer();
const api=await get('/api/payments');assert.equal(api.status,404);assert.deepEqual(await api.json(),{error:'not_found'});
const assetPath=html.match(/src="(\/assets\/[^" ]+\.js)"/)[1];
const asset=await get(assetPath);assert.equal(asset.status,200);assert.match(asset.headers.get('Cache-Control'),/immutable/);assert.equal(asset.headers.get('X-EADE-Routing'),null);await asset.arrayBuffer();
assert.equal((await get('/ssg-report.json')).status,404);
console.log('Cloudflare HTTP: static-first ES/EN, Atlas URL, legacy JSON, HEAD, redirects, maps, embeds, 404, API and assets OK.');
