import test from 'node:test';import assert from 'node:assert/strict';
import {countFamilyCrossings} from '../src/domain/genealogy/crossingCount.js';
const naive=edges=>{let n=0;for(let i=0;i<edges.length;i++)for(let j=i+1;j<edges.length;j++)if(edges[i].familyKey!==edges[j].familyKey&&(edges[i].source-edges[j].source)*(edges[i].target-edges[j].target)<0)n++;return n;};
test('the faster crossing score preserves the original pair count, including tied endpoints and shared families',()=>{
 let seed=622;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(let trial=0;trial<180;trial++){
  const edges=Array.from({length:Math.floor(random()*100)},()=>({source:Math.floor(random()*20)/7,target:Math.floor(random()*20)/11,familyKey:'family-'+Math.floor(random()*12)}));
  assert.equal(countFamilyCrossings(edges),naive(edges),String(trial));assert.equal(countFamilyCrossings(edges.slice().reverse()),naive(edges));
 }
 assert.equal(countFamilyCrossings([{source:0,target:1,familyKey:'A'},{source:0,target:0,familyKey:'B'}]),0);
 assert.equal(countFamilyCrossings([{source:0,target:1,familyKey:'A'},{source:1,target:0,familyKey:'A'}]),0);
});
