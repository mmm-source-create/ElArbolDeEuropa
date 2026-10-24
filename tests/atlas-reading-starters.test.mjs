import {treeSvg} from '../src/features/connections/treeExport.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {STARTER_POOLS,STARTER_TRIOS,chooseStarterPeople,compatibleStarters} from '../src/features/atlas/starterPeople.js';
import {catalogStoryAtlasUrl} from '../src/features/stories/storyModel.js';
import {resolveStoryNavigation} from '../src/features/atlas/storyNavigation.js';
import {HISTORIAS} from '../src/data/historias.js';
import {TREE_BOX_W,TREE_BOX_H} from '../src/domain/genealogy/treeMetrics.js';
import {selectionLayout} from '../src/features/connections/selectionLayout.js';

test('cada sugerencia pertenece a un periodo y ninguna terna repite nombre ni corona',()=>{
 const ids=new Set(PERSONAS.map(p=>p.id));
 assert.deepEqual(STARTER_POOLS.map(pool=>pool.length),[7,8,6]);
 for(const pool of STARTER_POOLS)for(const person of pool)assert.ok(ids.has(person.id),person.id);
 assert.ok(STARTER_TRIOS.length>100);
 for(const trio of STARTER_TRIOS){trio.forEach((p,i)=>assert.ok(STARTER_POOLS[i].includes(p)));for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert.ok(compatibleStarters(trio[i],trio[j]));}
 assert.deepEqual(chooseStarterPeople(()=>0),STARTER_TRIOS[0]);
 assert.deepEqual(chooseStarterPeople(()=>.999999),STARTER_TRIOS.at(-1));
});
test('el catálogo entra en el árbol con el capítulo guardado y su regreso ES/EN',()=>{
 for(const [locale,path] of [['es','/es/historia/borgona-el-reino-que-no-fue'],['en','/en/story/burgundy-the-kingdom-that-never-was']]){
  const story=HISTORIAS.find(s=>s.id==='borgona');
  const url=new URL(catalogStoryAtlasUrl({...story,path},2,locale),'https://example.test');
  const nav=resolveStoryNavigation(url.pathname,url.search,HISTORIAS);
  assert.equal(nav.story.id,story.id);assert.equal(nav.index,1);assert.equal(nav.returnPath,`${path}/${locale==='en'?'chapter':'capitulo'}/2`);assert.equal(url.searchParams.get('vista'),'arbol');
  assert.ok(nav.ids.length); // Full story content is resolved in the Atlas.
 }
});
test('Conectar comparte las dimensiones de las tarjetas del árbol',()=>{
 const p=selectionLayout(['A','B'],{},{A:{nac:1200},B:{nac:1230}},[{from:'A',to:'B',type:'sangre'}]).positions;
 assert.equal(p.A.w,TREE_BOX_W);assert.equal(p.A.h,TREE_BOX_H);assert.equal(p.B.row,p.A.row+1);
});

test('las familias irlandesas también exportan su banda de color con un trazo SVG válido',()=>{
 const scene=treeSvg({people:[{id:'IRISH',nombre:'Hugh O’Neill',dinastia:'O’Neill',titulo:'Conde',nac:1550,muer:1616,reinos:['Tír Eoghain']}],edges:[]});
 for(const [,stroke] of scene.svg.matchAll(/\bstroke="([^"]*)"/g))assert.match(stroke,/^#[0-9a-f]{6}$/i);
});
