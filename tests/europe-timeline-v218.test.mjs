import test from 'node:test';
import assert from 'node:assert/strict';
import {nextRecordedYear,changesBetween,sharedGovernments,governmentRegions} from '../src/data/europeTimeline.js';
import {europaEnAnio} from '../src/data/europeYear.js';
const personas=[{id:'A',nombre:'A',gobiernos:[{territorio:'Castilla',desde:1500,hasta:1505,condicion:'efectivo',titulo:'Rey'},{territorio:'Aragón',desde:1501,hasta:1508,condicion:'efectivo',titulo:'Rey'}]},{id:'B',nombre:'B',gobiernos:[{territorio:'Francia',desde:1490,hasta:1510,condicion:'efectivo',titulo:'Rey'}]}];
test('la consulta completa permanece independiente de una selección familiar reducida',()=>{
 const all=europaEnAnio({personas,anio:1501}),subset=europaEnAnio({personas:personas.slice(0,1),anio:1501,alcanceCompleto:false});
 assert.equal(all.gobiernos.length,3);assert.equal(subset.gobiernos.length,2);
 assert.equal(sharedGovernments(all.gobiernos)[0].territorios.size,2);
});
test('comparar fechas conserva mandatos distintos y distingue incorporaciones y ausencias',()=>{
 const before=europaEnAnio({personas,anio:1500}),after=europaEnAnio({personas,anio:1506});
 const changes=changesBetween(before,after);assert.deepEqual(changes.added.map(g=>g.territorio),['Aragón']);assert.deepEqual(changes.removed.map(g=>g.territorio),['Castilla']);
 assert.equal(changesBetween(before,before).added.length,0);
});
test('el siguiente hito es posterior, respeta límites y no inventa años sin registros',()=>{
 assert.equal(nextRecordedYear(1500,{personas,eventos:[{anio:1500},{desde:1503,hasta:1504}]}),1501);
 assert.equal(nextRecordedYear(1510,{personas}),null);
 assert.equal(nextRecordedYear(1500,{eventos:[{anio:NaN},{anio:1502}],max:1501}),null);
 assert.equal(governmentRegions([{territorio:'Desconocido'}])[0][0],'Otros territorios registrados');
});
