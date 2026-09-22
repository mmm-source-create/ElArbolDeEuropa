import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {printDocument,educationalDocuments,embedCode,exportFilename} from '../src/connections/printExport.js';
import {embedSelection} from '../src/embed/EmbedPage.jsx';
import {MAIN_FRAME_SOURCE,EMBED_CSP,CONTENT_SECURITY_POLICY} from '../scripts/security-policy.mjs';
import {resolverRuta} from '../src/routing.js';
const people=[{id:'A',nombre:'Persona <A>',slug:'persona-a',nac:1500,muer:1550},{id:'B',nombre:'Persona B',slug:'persona-b',nac:1525,muer:1590,padres:[{id:'A'}]}];
test('el material separa actividad y respuestas, conserva fuentes y escapa contenido',()=>{
 const docs=educationalDocuments({people,edges:[{from:'A',to:'B',type:'sangre'}],title:'Una familia'});
 const a=new JSDOM(docs.activity),b=new JSDOM(docs.answers);
 assert.match(a.window.document.body.textContent,/Cronología/);assert.match(a.window.document.body.textContent,/Preguntas/);
 assert.doesNotMatch(a.window.document.body.textContent,/Filiación\./);assert.match(b.window.document.body.textContent,/Filiación\./);
 assert.equal(a.window.document.querySelector('a[href$="persona-a"]').textContent,'Ficha de Persona <A>');
 assert.equal(a.window.document.querySelector('script'),null);a.window.close();b.window.close();
 assert.throws(()=>educationalDocuments({people:[],edges:[]}));
});
test('la impresión respeta orientación y márgenes admitidos y el nombre es legible',()=>{
 assert.match(printDocument({svg:'<svg></svg>'},{orientation:'portrait',margin:20}),/size:A4 portrait;margin:20mm/);
 assert.match(printDocument({svg:'<svg></svg>'},{orientation:'bad',margin:-1}),/size:A4 landscape;margin:12mm/);
 assert.equal(exportFilename('Familia de Isabel I'),'familia-de-isabel-i');
});
test('las inserciones son acotadas y la excepción de framing solo afecta a sus rutas',()=>{
 assert.match(embedCode(['A','B'],'https://example.test'),/\/embed\/arbol\?persona=A&amp;persona=B/);
 assert.throws(()=>embedCode(Array(13).fill('A')));
 assert.equal(resolverRuta('/embed/persona/A').view,'embed');
 const protectedRoute=new RegExp('^'+MAIN_FRAME_SOURCE+'$');
 for(const p of ['/es/','/es/persona/a','/embed/otra','/embed/arbol/extra','/embedding/arbol'])assert.ok(protectedRoute.test(p));
 for(const p of ['/embed/persona/A','/embed/persona/A/','/embed/arbol','/embed/arbol/'])assert.equal(protectedRoute.test(p),false);
 assert.match(CONTENT_SECURITY_POLICY,/frame-ancestors 'self'/);assert.match(EMBED_CSP,/frame-ancestors \*/);
 const scene=embedSelection(people);assert.deepEqual(scene.edges,[{from:'A',to:'B',type:'sangre'}]);assert.ok(scene.gen.B>scene.gen.A);
});
