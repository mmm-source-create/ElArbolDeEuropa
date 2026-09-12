import test from 'node:test';
import assert from 'node:assert/strict';
import {resolverRuta} from '../src/routing.js';
import {assignIntervalLanes,mergeIntervals,roundedPath,pointToward} from '../src/explorer/treeGeometry.js';
import {reinadosEfectivos,sucesionesDirectas} from '../src/desafio/desafioGovernments.js';
import {crearDesafioDiario,crearPartida} from '../src/desafio/desafioEngine.jsx';
import {PERSONAS} from '../src/personas.jsx';

test('rutas públicas, catálogos, inglés y desafío conservan su destino',()=>{
 for(const [path,view] of [['/','home'],['/es/','home'],['/en/','english'],['/persona/carlos-v','person'],['/es/personas','catalog'],['/es/territorios/','catalog'],['/es/fuentes','info'],['/es/desafio','desafio'],['/es/dinastia/bourbon','dynasty'],['/territorio/brabante','territory']])assert.equal(resolverRuta(path).view,view,path);
 assert.equal(resolverRuta('/es/','?panel=desafio').view,'desafio');
});
test('enlaces al Atlas y a personas antiguas prevalecen sin perder el identificador',()=>{
 const old=resolverRuta('/','?persona=CARLOS5');assert.equal(old.view,'person');assert.equal(old.legacyPersonId,'CARLOS5');
 const atlas=resolverRuta('/es/persona/carlos-v','?atlas=1');assert.equal(atlas.view,'explorer');assert.equal(atlas.personSlug,'carlos-v');
 assert.equal(resolverRuta('/es/territorio/brabante','?atlas=1').view,'explorer');
 assert.equal(resolverRuta('/es/','?atlas=1&panel=historias').panel,'historias');
});
test('un slug mal escapado no deja la aplicación en blanco',()=>{
 for(const entity of ['persona','territorio','dinastia'])assert.doesNotThrow(()=>resolverRuta(`/es/${entity}/%E0%A4%A`));
 assert.equal(resolverRuta('/es/territorio/G%C3%BCeldres').territorySlug,'Güeldres');
});
test('los conectores que se solapan usan carriles distintos y reutilizan los libres',()=>{
 const requests=[{id:'a',x1:0,x2:100},{id:'b',x1:50,x2:150},{id:'c',x1:120,x2:180}];
 const result=assignIntervalLanes(requests,10);
 assert.notEqual(result.assignment.a,result.assignment.b);assert.equal(result.assignment.a,result.assignment.c);assert.equal(result.count,2);
 assert.deepEqual(mergeIntervals([[30,10],[28,45],[90,100]]),[[10,45],[90,100]]);
});
test('trazos cortos y puntos repetidos producen SVG finito sin sobrepasar la esquina',()=>{
 assert.equal(roundedPath([]),'');assert.equal(roundedPath([[0,0],[0,0],[10,0]]),'M 0 0 L 10 0');
 const p=pointToward(0,0,2,0,20);assert.deepEqual(p,[1,0]);
 const d=roundedPath([[0,0],[2,0],[2,2]],20);assert.ok(d.startsWith('M 0 0'));assert.ok(d.endsWith('L 2 2'));assert.doesNotMatch(d,/NaN|Infinity/);
});
const gov=(desde,hasta,extra={})=>({territorio:'Test',desde,hasta,clase:'reinado',condicion:'efectivo',...extra});
const person=(id,...gobiernos)=>({id,nombre:id,gobiernos});
test('el quiz usa gobiernos como fuente autoritativa y excluye pretensiones',()=>{
 const p={...person('a',gov(1000,1010,{condicion:'titular'})),reinados:[gov(1000,1010)]};
 assert.deepEqual(reinadosEfectivos(p),[]);
 for(const condicion of ['disputado','pretensión','rival'])assert.equal(reinadosEfectivos(person('p',gov(1000,1010,{condicion}))).length,0);
});
test('el quiz no formula sucesiones únicas con lagunas, corregencias o rivales',()=>{
 const a=person('a',gov(1000,1010)),b=person('b',gov(1010,1020));
 assert.equal(sucesionesDirectas([a,b]).length,1);
 assert.equal(sucesionesDirectas([a,person('b',gov(1015,1020))]).length,0);
 assert.equal(sucesionesDirectas([a,b,person('c',gov(1005,1015,{condicion:'corregente'}))]).length,0);
 assert.equal(sucesionesDirectas([a,b,person('c',gov(1010,1020))]).length,0);
 assert.equal(sucesionesDirectas([a,b,person('c',gov(1005,1015,{condicion:'disputado'}))]).length,0);
});
test('el desafío diario es reproducible, tiene respuestas válidas y no repite preguntas',()=>{
 const first=crearDesafioDiario(PERSONAS,'2026-09-12');
 assert.deepEqual(first,crearDesafioDiario(PERSONAS,'2026-09-12'));
 assert.equal(first.length,5);assert.equal(new Set(first.map(p=>p.firma)).size,first.length);
 for(const q of first){validarRespuesta(q);assert.ok(q.explicacion);}
});
test('una partida completa genera opciones distintas y una sola respuesta correcta',()=>{
 const partida=crearPartida(PERSONAS,10);
 assert.equal(partida.length,10);
 for(const q of partida)validarRespuesta(q);
});

function validarRespuesta(q) {
 assert.equal(new Set(q.opciones.map(o=>o.id)).size,q.opciones.length);
 if(q.formato==='orden') {
  assert.deepEqual(q.ordenCorrecto.slice().sort(),q.opciones.map(o=>o.id).sort());
  const years=q.ordenCorrecto.map(id=>PERSONAS.find(p=>p.id===id).nac);
  assert.deepEqual(years,years.slice().sort((a,b)=>a-b));
 } else assert.equal(q.opciones.filter(o=>o.id===q.correctaId).length,1);
}
