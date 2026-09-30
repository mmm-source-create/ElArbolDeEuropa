import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {REINO_A_IDS,REINO_VERSIONES,idsDeReinoEnAño,reinadosActivos} from '../src/Territorios.jsx';
import {HISTORIA_DINASTIAS} from '../src/content/dinastias/index.js';
import {personClaims} from '../src/evidence/claims.js';

const person=id=>PERSONAS.find(p=>p.id===id);

test('la herencia borgoñona no convierte el título ducal de Carlos V en posesión del ducado',()=>{
  const carlos=person('CARLOS5');
  assert.equal(carlos.gobiernos.find(g=>g.territorio==='Borgoña').condicion,'titular');
  assert.deepEqual(idsDeReinoEnAño('Condado de Borgoña',1540),['Aval','Millieu','Amont']);
  assert.ok(idsDeReinoEnAño('Borgoña',1540).includes('Dijonnais'));
  assert.ok(!idsDeReinoEnAño('Borgoña',1540).includes('Amont'));
  assert.ok(reinadosActivos(carlos,1540,{soloEfectivos:true}).some(g=>g.territorio==='Condado de Borgoña'));
  for(const id of ['FEL1CAST','CARLOS5','FEL2ESP']){
    assert.ok(person(id).gobiernos.some(g=>g.territorio==='Artois'&&g.condicion==='efectivo'),id);
  }
  assert.ok(personClaims(carlos).some(c=>c.field==='Gobierno'&&c.value.territorio==='Condado de Borgoña'&&c.certainty==='inferred'&&c.sources.length));
});

test('Irlanda usa regiones presentes en el SVG y no pinta la isla entera en 1542',()=>{
  const svg=fs.readFileSync(new URL('../src/MapChart_Map.svg',import.meta.url),'utf8');
  const svgIds=new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
  const irish=['Connacht','Leinster','Tír Eoghain','Tír Chonaill','Condado de Tyrone','Condado de Tyrconnell','Thomond','Condado de Thomond','Desmond','Condado de Desmond','Condado de Clancare','Condado de Ulster','Kildare','Ormond','Clanricarde','Vizcondado de Mayo'];
  for(const name of irish){
    assert.ok(REINO_A_IDS[name]?.length,`${name} no tiene cartografía`);
    for(const id of REINO_A_IDS[name])assert.ok(svgIds.has(id),`${name}: falta ${id} en el SVG`);
  }
  for(const version of REINO_VERSIONES.Irlanda)for(const id of version.ids)assert.ok(svgIds.has(id),`Irlanda: falta ${id}`);
  assert.deepEqual(idsDeReinoEnAño('Irlanda',1500),[]);
  assert.deepEqual(idsDeReinoEnAño('Irlanda',1550),['Dublin','Meath','Kildare']);
  assert.ok(idsDeReinoEnAño('Irlanda',1610).includes('Donegal'));
  assert.notDeepEqual(REINO_A_IDS['Tír Eoghain'],REINO_A_IDS['Tír Chonaill']);
});

test('la historia Capeto explica la línea directa, 1328 y sus ramas con fuentes concretas',()=>{
  const history=HISTORIA_DINASTIAS.Capeto;
  assert.match(history.trayectoria,/Normandía.*1202.*1204/);
  assert.match(history.legado,/1328/);
  for(const id of history.protagonistas)assert.ok(person(id),`falta ${id}`);
  assert.ok(history.fuentes.some(url=>url.includes('bnf.fr')));
  assert.ok(history.fuentes.some(url=>url.includes('francearchives.gouv.fr')));
});
