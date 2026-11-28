import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {BY_ID, HIJOS_POR_ID} from '../src/domain/genealogy/relations.js';
import {layoutSelection} from '../src/domain/genealogy/selectionTree.js';
import {PAPAL_SUCCESSION,PAPAL_RANK,papalSuccessionPaths} from '../src/domain/genealogy/papalSuccession.js';
let full;
const base=()=>full??=layoutSelection(PERSONAS,BY_ID,HIJOS_POR_ID,{swapLimit:Infinity});
test('638: all 76 canonical pontiffs form one ordered column, including short pontificates',()=>{
 const {columns,layout}=base();
 assert.equal(PAPAL_SUCCESSION.length,76);assert.equal(new Set(PAPAL_SUCCESSION).size,76);
 assert.equal(new Set(PAPAL_SUCCESSION.map(id=>columns[id])).size,1);
 assert.equal(new Set(PAPAL_SUCCESSION.map(id=>layout.positions[id].x+layout.positions[id].w/2)).size,1);
 let bottom=-Infinity;
 for(const id of PAPAL_SUCCESSION){const p=layout.positions[id];assert(p.y>bottom,id);bottom=p.y+p.h;assert(p.y+p.h<=layout.height);}
 assert.equal(papalSuccessionPaths(layout.positions).length,75);
 for(const [a,b] of [['PAPA_INOCENCIO5','PAPA_ADRIANO5'],['PAPA_MARCELO2','PAPA_PAULO4'],['PAPA_URBANO7','PAPA_GREGORIO14']])assert(PAPAL_RANK.get(a)<PAPAL_RANK.get(b));
});
test('638: papal layout keeps real dynasties, partners, children and genealogical constraints',()=>{
 const before=JSON.stringify(PERSONAS),{gen,layout,columns}=base();
 for(const p of PERSONAS)for(const id of [p.padre,p.madre])if(BY_ID[id])assert(gen[p.id]>gen[id],`${p.id} below ${id}`);
 assert.equal(BY_ID.RODRIGOBORJA.dinastia,'Borja');
 for(const id of ['RODRIGOBORJA','ALFONSOBORJA','PAPA_PAULO3','PAPA_LEON10'])assert(layout.positions[id],id);
 assert.notEqual(columns.RODRIGOBORJA,columns.LUCRECIABORJA);
 assert(layout.pairContacts&&Object.keys(layout.pairContacts).some(k=>k.includes('RODRIGOBORJA')));
 assert.equal(JSON.stringify(PERSONAS),before);
 const popeBoxes=PAPAL_SUCCESSION.map(id=>layout.positions[id]);
 for(const p of PERSONAS.filter(p=>!PAPAL_RANK.has(p.id))){const b=layout.positions[p.id];assert(popeBoxes.every(a=>a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y),p.id);}
});
test('638: filtered papal selections do not invent succession across missing pontiffs',()=>{
 const people=['PAPA_LEON10','PAPA_CLEMENTE7','PAPA_PAULO3'].map(id=>BY_ID[id]);
 const {layout}=layoutSelection(people,BY_ID,HIJOS_POR_ID);
 const edges=papalSuccessionPaths(layout.positions);
 assert.equal(edges.length,1);assert.equal(edges[0].from,'PAPA_CLEMENTE7');assert.equal(edges[0].to,'PAPA_PAULO3');
 assert(!Object.keys(layout.positions).includes('PAPA_ADRIANO6'));
});

test('638: Explorer uses the generated papal column without the obsolete six-column regrouping',()=>{
 const explorer=fs.readFileSync(new URL('../src/features/atlas/Explorer.jsx',import.meta.url),'utf8');
 assert.doesNotMatch(explorer,/\bgroupIsolatedPopes\b|\bisolatedPopeIds\b/);
 assert.match(explorer,/visiblePeople\.length === PERSONAS\.length \? TREE_BASE\.layout/);
 const generated=JSON.parse(fs.readFileSync(new URL('../src/generated/treeBase.json',import.meta.url),'utf8'));
 const centers=PAPAL_SUCCESSION.map(id=>{const p=generated.layout.positions[id];return p.x+p.w/2;});
 assert.equal(new Set(centers).size,1,'full-tree artifact must contain the same column that Explorer renders');
 const paths=papalSuccessionPaths(generated.layout.positions);
 assert.equal(paths.length,75);
 for(const {from,to} of paths){const a=generated.layout.positions[from],b=generated.layout.positions[to];assert(b.y>=a.y+a.h,`${from} to ${to}`);}
});
