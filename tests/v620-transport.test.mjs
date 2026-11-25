import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';
import {packPage,unpackPage,parsePage} from '../src/features/public/pageTransport.js';
import {serializePage,readInitialPage} from '../src/features/public/staticData.js';
import {metadataFromHtml} from '../src/utils/staticMetadata.js';
import worker from '../cloudflare/worker.js';
import {makeStaticDocument} from '../scripts/lib/ssg-utils.mjs';
import {publicMeta} from '../src/features/public/publicMeta.js';
const repeat='A complete biography with documentary sources and all its chapters.';
const data={slug:'person-charles-v',nombre:'Charles V',path:'/en/person/charles-v',chapter:null,type:'person',sections:Array.from({length:30},(_,i)=>({title:`Chapter ${i}`,text:repeat,source:{title:'An individually located source',url:'https://example.test/biography',locator:'Genealogy: father and mother'}}))};
const page={schema:2,kind:'english',slug:'person-charles-v',chapter:null,path:data.path,data};
const embedded=p=>`<script id="eade-initial-page" type="application/json">${serializePage(p)}</script>`;

test('the page dictionary preserves complete nested records with less JSON to parse',()=>{
 const packed=packPage(page);assert.equal(packed.format,'eade-page-1');
 assert.deepEqual(unpackPage(packed),page);
 assert(JSON.stringify(packed).length<JSON.stringify(page).length);
 assert.deepEqual(parsePage(serializePage(page)),page);
});

test('literal markers, arrays, Unicode, object-like keys and JSON semantics survive the wire format',()=>{
 const unusual=JSON.parse('{"__proto__":{"safe":true},"constructor":"constructor","prototype":"value"}');
 const input={...page,unusual,markers:['~:','~o','~0','~~o','~not a reference',['~o',0,null],['~o'],['~:']],text:'Świdnica · Árbol · სამეფო',missing:undefined,array:[undefined,NaN,Infinity],date:new Date('2026-11-22T00:00:00Z')};
 const expected=JSON.parse(JSON.stringify(input));const result=parsePage(serializePage(input));
 assert.deepEqual(result,expected);assert(Object.hasOwn(result.unusual,'__proto__'));assert.equal({}.safe,undefined);
});

test('an array beginning with dictionary reference 24 remains an array',()=>{
 const strings=Array.from({length:36},(_,i)=>`value-${i}`);
 assert.deepEqual(unpackPage({format:'eade-page-1',strings,value:['~o']}),['value-24']);
});

test('legacy JSON remains readable and small records do not grow',()=>{
 const plain={schema:2,short:'text'};assert.deepEqual(packPage(plain),plain);
 assert.deepEqual(parsePage(JSON.stringify(page)),page);
 assert.deepEqual(metadataFromHtml(`<script id="eade-initial-page" type="application/json">${JSON.stringify(page)}</script>`,page.path),data);
});

test('the publisher chooses the smaller complete gzip document and preserves its rendered content',()=>{
 const shell='<!doctype html><html lang="en"><head><title>Shell</title></head><body><div id="root"></div></body></html>';
 const rendered='<h1>Charles V</h1><p>'+repeat.repeat(20)+'</p>';
 const meta=publicMeta({title:'Charles V',description:repeat,path:page.path});
 const result=makeStaticDocument(shell,{html:rendered,meta},page,{css:[],js:[]});
 const replace=payload=>result.replace(/(<script id="eade-initial-page" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+payload+b);
 const ordinary=replace(serializePage(page,false)),compact=replace(serializePage(page));
 assert.equal(gzipSync(result).length,Math.min(gzipSync(ordinary).length,gzipSync(compact).length));
 assert(result.includes(rendered));assert.deepEqual(metadataFromHtml(result,page.path),data);
});

test('invalid references, duplicate keys and excessive nesting are rejected',()=>{
 const p=value=>({format:'eade-page-1',strings:['key'],value});
 for(const value of ['~1',['~:',-1,0],['~:',0],['~:',0,1,0,2]])assert.throws(()=>unpackPage(p(value)));
 assert.throws(()=>unpackPage({...p(null),strings:[null]}));
 let nested=null;for(let i=0;i<102;i++)nested=[nested];assert.throws(()=>unpackPage(p(nested)),/nesting/);
});

test('compacted hostile text remains inert and hydration reads the original full page',()=>{
 const record=structuredClone(page);record.data.sections[0].text='</script><img src=x onerror=alert(1)> & \u2028 \u2029';
 const text=serializePage(record);assert(!/[<>&\u2028\u2029]/.test(text));
 const dom=new JSDOM(embedded(record),{url:'https://www.treeofeurope.eu'+page.path});
 assert.equal(dom.window.document.querySelectorAll('script').length,1);assert.equal(dom.window.document.querySelector('img'),null);
 assert.deepEqual(readInitialPage(dom.window.document,dom.window.location),record);dom.window.close();
 assert.throws(()=>metadataFromHtml(embedded(record),'/en/person/wrong'),/Mismatched/);
});

test('Cloudflare legacy metadata endpoints decode the packed HTML into ordinary full JSON',async()=>{
 const env={DEPLOYMENT_ENV:'production',ASSETS:{fetch:async request=>{
  const path=new URL(request instanceof Request?request.url:request).pathname;
  if(path==='/cloudflare-meta-index.json')return Response.json({'/english-meta/person-charles-v.json':page.path});
  if(path===page.path)return new Response(embedded(page));
  return new Response('Missing',{status:404});
 }}};
 const response=await worker.fetch(new Request('https://www.treeofeurope.eu/english-meta/person-charles-v.json'),env);
 assert.equal(response.status,200);assert.deepEqual(await response.json(),data);
 const head=await worker.fetch(new Request('https://www.treeofeurope.eu/english-meta/person-charles-v.json',{method:'HEAD'}),env);assert.equal(await head.text(),'');
});

test('real English biographies, sources, chapters and catalogues survive compaction unchanged',async()=>{
 const files=['english-meta/person-charles-v.json','english-meta/person-alexander-iii-of-scotland.json','catalogos/personas.json','catalogos/historias.json'];
 for(const file of files){const record=JSON.parse(await fs.readFile(new URL('../public/'+file,import.meta.url),'utf8'));assert.deepEqual(parsePage(serializePage(record)),record,file);const wrapped={schema:2,kind:file.startsWith('english-meta')?'english':'catalogo',slug:record.slug,path:record.path,chapter:null,data:record};assert.deepEqual(parsePage(serializePage(wrapped)),JSON.parse(JSON.stringify(wrapped)),file+' embedded envelope');if(file==='english-meta/person-charles-v.json')assert(gzipSync(serializePage(record)).length<gzipSync(JSON.stringify(record)).length*0.8,'Charles V transfer budget');}
 const people=JSON.parse(await fs.readFile(new URL('../public/catalogos/personas.json',import.meta.url),'utf8'));
 assert.equal(people.items.length,2904);assert(people.items.every(p=>!Object.hasOwn(p,'resumen')));
 const person=JSON.parse(await fs.readFile(new URL('../public/personas-meta/carlos-v.json',import.meta.url),'utf8'));
 assert(person.resumen.length>100);assert(person.biografiaExtensa);assert(person.fuentes.length);
});
