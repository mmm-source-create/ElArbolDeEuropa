import assert from 'node:assert/strict';
import test from 'node:test';
import {auditMapSpatial} from '../src/data/mapSpatialAudit.js';

const geometry={scope:'Test',bbox:[0,0,10,10],method:'Clipped geometry',cells:[
  {id:'Town',visibleArea:2},{id:'Pindus_Mountains1',visibleArea:6},
  {id:'Never_linked',visibleArea:2},{id:'Outside',visibleArea:0}]};
test('spatial coverage catches unlinked land and includes physical relief without assigning it automatically',()=>{
  const report=auditMapSpatial(geometry,[{year:1530,byLocation:new Map([['Town',[{}]]])}]);
  const cut=report.cuts[0];
  assert.equal(cut.visibleCells,3);
  assert.equal(cut.assignedAreaPercent,20);
  assert.deepEqual(cut.unassigned.map(cell=>cell.id),['Pindus_Mountains1','Never_linked']);
  const later=auditMapSpatial(geometry,[{year:1600,byLocation:new Map([['Town',[{}]],['Pindus_Mountains1',[{}]]])}]);
  assert.equal(later.cuts[0].assignedAreaPercent,80);
  assert.equal(later.cuts[0].unassignedCells,1);
});
test('spatial counts reject duplicate cells and invalid areas',()=>{
  assert.throws(()=>auditMapSpatial({...geometry,cells:[geometry.cells[0],geometry.cells[0]]},[]),/Duplicate/);
  assert.throws(()=>auditMapSpatial({...geometry,cells:[{id:'Invalid',visibleArea:-1}]},[]),/Invalid/);
});
