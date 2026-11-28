import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {PAPAL_SUCCESSION,PAPAL_RANK} from '../src/domain/genealogy/papalSuccession.js';
import {computeParentGroups} from '../src/domain/genealogy/relationshipGraph.js';
import {layoutSelection} from '../src/domain/genealogy/selectionTree.js';
import {routeFamilyConnectors} from '../src/domain/genealogy/treeLayout.js';
const byId=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
function segments(d){
 const t=d.match(/[MLQ]|[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)||[],out=[];let i=0,p;
 while(i<t.length){const cmd=t[i++];
  if(cmd==='M')p=[+t[i++],+t[i++]];
  else if(cmd==='L'){const q=[+t[i++],+t[i++]];out.push([p,q]);p=q;}
  else if(cmd==='Q'){
   const c=[+t[i++],+t[i++]],q=[+t[i++],+t[i++]];let last=p;
   for(let n=1;n<=12;n++){const a=n/12,b=1-a,x=[b*b*p[0]+2*b*a*c[0]+a*a*q[0],b*b*p[1]+2*b*a*c[1]+a*a*q[1]];out.push([last,x]);last=x;}p=q;
  }else throw Error(`Unknown path command ${cmd}`);
 }
 return out;
}
function crossesInterior([a,b],r){
 let lo=0,hi=1;
 for(const [p,q,min,max]of[[a[0],b[0],r.x+.5,r.x+r.w-.5],[a[1],b[1],r.y+.5,r.y+r.h-.5]]){
  if(Math.abs(q-p)<1e-9){if(p<min||p>max)return false;}
  else{const aa=(min-p)/(q-p),bb=(max-p)/(q-p);lo=Math.max(lo,Math.min(aa,bb));hi=Math.min(hi,Math.max(aa,bb));}
 }
 return lo<=hi;
}
function route(people,tree){
 const {gen,rows,layout}=tree,before=JSON.stringify(layout.positions);
 const result=routeFamilyConnectors({groupsByRow:computeParentGroups(people,gen),positions:layout.positions,pairContacts:layout.pairContacts,gen,rows,rowBands:layout.rowBands,canvasWidth:layout.width});
 assert.equal(JSON.stringify(layout.positions),before,'routing must leave the papal stack and canvas unchanged');
 return result;
}
function assertClearPapalFamily(routing,positions,popeId){
 const papalKeys=new Set(Object.entries(positions).filter(([id])=>PAPAL_RANK.has(id)).map(([,p])=>p.unitKey).filter(Boolean));
 const obstacles=Object.entries(positions).filter(([id,p])=>PAPAL_RANK.has(id)||p.unitKey&&papalKeys.has(p.unitKey));
 const families=routing.families.filter(f=>f.childIds.includes(popeId)||f.parentIds.includes(popeId));assert(families.length,popeId);
 for(const family of families)for(const [kind,path]of [['trunk',family.trunkD],...(family.busDs||[]).map(d=>['bus',d]),...family.branches.map(b=>[b.childId,b.d])]){
  const lines=segments(path);
  for(const [id,box]of obstacles)if(!family.parentIds.includes(id)&&!family.childIds.includes(id))
   assert(!lines.some(line=>crossesInterior(line,box)),`${popeId}: ${family.key}/${kind} crosses ${id}`);
 }
}
test('638: family connectors reach Clement VII, Alexander VI and Paul III without crossing earlier pontiffs',()=>{
 const tree=JSON.parse(fs.readFileSync(new URL('../src/generated/treeBase.json',import.meta.url))),routing=route(PERSONAS,tree);
 for(const id of ['PAPA_CLEMENTE7','RODRIGOBORJA','PAPA_PAULO3'])assertClearPapalFamily(routing,tree.layout.positions,id);
});
test('638: a pope shown without his partner exits the column before descending to his children',()=>{
 const people=[...PAPAL_SUCCESSION.map(id=>byId[id]),byId.LUCRECIABORJA];
 const children={RODRIGOBORJA:['LUCRECIABORJA']},tree=layoutSelection(people,byId,children),routing=route(people,tree);
 assertClearPapalFamily(routing,tree.layout.positions,'RODRIGOBORJA');
 const family=routing.families.find(f=>f.parentIds.includes('RODRIGOBORJA'));
 assert(family.branches.some(b=>b.childId==='LUCRECIABORJA'));
});
