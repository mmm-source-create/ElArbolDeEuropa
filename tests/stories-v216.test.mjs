import test from 'node:test';
import assert from 'node:assert/strict';
import { resolverRuta } from '../src/routing.js';
import { storyPath, storyAtlasUrl, safeStoryReturn, readStoryProgress, saveStoryProgress, STORY_PROGRESS_KEY } from '../src/stories/storyModel.js';
import { staticRoute, validatePage, initialPageForLocation } from '../src/public/staticData.js';
const story = {id:'test',slug:'test',nombre:'Prueba',storyTitle:'Prueba',descripcion:'Una historia',chapter:null,pasos:[{anio:1250,titulo:'Inicio',texto:'Texto',personas:['A','B']},{anio:1260,titulo:'Final',texto:'Final',personas:['C']}],protagonists:[],fuentes:[]};
const storage = () => { const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)}; };
test('entrada, capítulo y exploración son rutas distintas y los enlaces antiguos siguen resolviendo',()=>{
 assert.equal(resolverRuta('/historia/test').view,'story');
 assert.equal(resolverRuta('/es/historia/test').view,'story');
 assert.equal(resolverRuta('/es/historia/test/capitulo/2').chapter,2);
 assert.equal(resolverRuta('/es/historia/test','?atlas=1').view,'explorer');
 assert.equal(storyPath('test',2),'/es/historia/test/capitulo/2');
 const page={schema:1,...staticRoute('/es/historia/test'),data:story};assert.ok(validatePage(page));
 assert.equal(initialPageForLocation(page,page.path,'?atlas=1'),null);
 assert.equal(validatePage({...page,chapter:3}),false);
});
test('el progreso conserva capítulos visitados sin marcar como leídos los saltos',()=>{
 const s=storage();assert.deepEqual(readStoryProgress(s,'test',2),{last:1,read:[]});
 saveStoryProgress(s,'test',2,2);assert.deepEqual(readStoryProgress(s,'test',2),{last:2,read:[2]});
 saveStoryProgress(s,'test',2,1);assert.deepEqual(readStoryProgress(s,'test',2),{last:1,read:[2,1]});
 saveStoryProgress(s,'other',4,3);assert.equal(readStoryProgress(s,'test',2).read.length,2);
 s.setItem(STORY_PROGRESS_KEY,'{');assert.equal(saveStoryProgress(s,'test',2,2).last,2);
 assert.deepEqual(readStoryProgress({getItem(){throw Error();}},'test',2),{last:1,read:[]});
});
test('el Atlas conserva toda la historia, destaca el capítulo y solo permite un regreso interno de lectura',()=>{
 const u=new URL(storyAtlasUrl(story,1),'https://example.test');
 assert.deepEqual(u.searchParams.getAll('seleccion'),['A','B','C']);assert.equal(u.searchParams.get('anio'),'1250');
 assert.deepEqual(u.searchParams.getAll('resaltar'),['A','B']);assert.equal(u.searchParams.get('historia'),'test');assert.equal(u.searchParams.get('paso'),'1');
 const next=new URL(storyAtlasUrl(story,2),'https://example.test');assert.deepEqual(next.searchParams.getAll('seleccion'),u.searchParams.getAll('seleccion'));assert.deepEqual(next.searchParams.getAll('resaltar'),['C']);
 assert.equal(safeStoryReturn(u.search),'/es/historia/test/capitulo/1');
 for(const target of ['https://evil.test','//evil.test','/es/historia/test/capitulo/1?x=1','/es/historia/test/capitulo/0'])assert.equal(safeStoryReturn('?regreso='+encodeURIComponent(target)),null);
});
