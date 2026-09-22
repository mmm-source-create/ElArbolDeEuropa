import test from 'node:test';
import assert from 'node:assert/strict';
import { familyIndex, familyIds, atlasIdsFromLocation, writeAtlasIds, isolatedPopes, groupIsolatedPopes } from '../src/explorer/progressiveAtlas.js';
import { sanitizeSession, shouldResumeAtlas } from '../src/explorer/atlasSession.js';
const people=[{id:'A',nombre:'A',padre:'P',conyuge:'B'},{id:'B',nombre:'B'},{id:'P',nombre:'P'},{id:'S',nombre:'S',padre:'P'},{id:'C',nombre:'C',madre:'A'},{id:'D',nombre:'D',madre:'C'},{id:'Z',nombre:'Z',titulo:'Papa'},{id:'Q',nombre:'Q',titulo:'Papa',padre:'P'}],index=familyIndex(people);
test('familia inmediata incluye relaciones inversas, hermanos y solo una generación descendiente',()=>{
 assert.deepEqual(new Set(familyIds(index,'A')),new Set(['A','P','B','C','S','Q']));
 assert.deepEqual(familyIds(index,'A','children'),['C']);assert.deepEqual(familyIds(index,'B'),['B','A']);
 assert.deepEqual(familyIds(index,'missing'),[]);assert.deepEqual(familyIds(index,'Z'),['Z']);
});
test('selecciones compartidas y sesiones respetan alcance y no abren todas las personas con IDs inválidos',()=>{
 assert.deepEqual(atlasIdsFromLocation('/es/','?atlas=1',index),[]);
 assert.equal(atlasIdsFromLocation('/es/','?atlas=1&territorio=Castilla',index),null);
 assert.deepEqual(atlasIdsFromLocation('/es/','?atlas=1&seleccion=bad',index),[]);
 for(const ids of [null,[],['A','B']]){
  const u=writeAtlasIds(new URL('https://example.test/es/?atlas=1'),ids);
  assert.deepEqual(atlasIdsFromLocation(u.pathname,u.search,index),ids);
  assert.deepEqual(sanitizeSession({version:1,atlasIds:ids}).atlasIds,ids);
 }
 assert.equal(shouldResumeAtlas('/es/?atlas=1&continuar=1&seleccion=A'),false);
});
test('solo los pontífices sin vínculos registrados se agrupan',()=>{
 assert.deepEqual([...isolatedPopes(index)],['Z']);
 const layout={positions:{A:{x:0,y:0,w:190,h:70},Z:{x:5000,y:0,w:190,h:70},Y:{x:8000,y:0,w:190,h:70}},units:[{ids:['A'],x:0,y:0,width:190,height:70},{ids:['Z'],x:5000,y:0,width:190,height:70},{ids:['Y'],x:8000,y:0,width:190,height:70}],width:9000,height:400};
 const compact=groupIsolatedPopes(layout,['Z','Y'],{...index.byId,Y:{nombre:'Y'}});
 assert.equal(compact.positions.A,layout.positions.A);assert.ok(compact.width<layout.width);
 assert.equal(compact.units.length,3);assert.equal(compact.isolatedPopeCount,2);
});
