import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {REINO_A_IDS,colorTerritorioEnMapa,idsDeReinoEnAño,reinadosActivos} from '../src/Territorios.jsx';
import {UNIONES_CORONAS} from '../src/content/coronas/index.js';

const person=id=>PERSONAS.find(p=>p.id===id);
const painted=(id,year)=>new Set(reinadosActivos(person(id),year,{soloEfectivos:true})
  .flatMap(g=>idsDeReinoEnAño(g.territorio,year)));

test('el título ducal representa Dijon y Autun, no todo el Estado borgoñón',()=>{
  assert.deepEqual(REINO_A_IDS.Borgoña,['Dijonnais','Autunnais']);
  assert.deepEqual(idsDeReinoEnAño('Borgoña',1390),['Dijonnais','Autunnais']);
  assert.deepEqual(idsDeReinoEnAño('Borgoña',1476),['Dijonnais','Autunnais']);
  for(const id of ['Liege','Loon','Pays_Nancy','Upper_Alsace','Niederrhein','Amienois','Vermandois']){
    assert.ok(!painted('CAR1BORG',1476).has(id),`${id} no es parte hereditaria del ducado`);
  }
});

test('la concentración territorial sigue los accesos sucesivos y la ruptura de 1477',()=>{
  const ph=painted('FEL2BORG',1370);
  assert.ok(ph.has('Dijonnais'));
  assert.ok(!ph.has('West_Flanders')&&!ph.has('Amont'));
  for(const id of ['West_Flanders','Upper_Artois','Amont']){
    assert.ok(painted('MARGFLAN',1390).has(id),`la herencia de Margarita incluye ${id}`);
  }
  assert.ok(!painted('MARGFLAN',1390).has('Nevernais'));
  assert.ok(!painted('MARGFLAN',1395).has('Rethelois'));
  assert.ok(painted('JUAN1BORG',1390).has('Nevernais'));
  assert.ok(painted('ANTONBRAB',1395).has('Rethelois'));
  const good=year=>painted('FEL3BORG',year);
  for(const [before,from,id] of [[1428,1429,'Namur'],[1429,1430,'Kempenland'],[1427,1428,'North_Holland'],[1442,1443,'East_Luxembourg']]){
    assert.ok(!good(before).has(id),`${id} se adelanta a ${from}`);
    assert.ok(good(from).has(id),`${id} falta desde ${from}`);
  }
  assert.equal(reinadosActivos(person('FEL3BORG'),1428).find(g=>g.territorio==='Holanda').condicion,'regencia');
  assert.equal(reinadosActivos(person('FEL3BORG'),1433).find(g=>g.territorio==='Holanda'&&g.clase==='condado').condicion,'efectivo');
  assert.ok(painted('CAR1BORG',1476).has('Gelderland'));
  const mary=painted('MARIABORG',1478);
  for(const id of ['Dijonnais','Autunnais','Upper_Artois','Amont','Auxerrois','Ponthieu']){
    assert.ok(!mary.has(id),`${id} no era posesión efectiva de María en 1478`);
  }
  assert.ok(mary.has('West_Flanders')&&mary.has('Brabant'));
  assert.ok(!painted('FEL1CAST',1492).has('Amont'));
  assert.ok(painted('FEL1CAST',1493).has('Amont'));
  assert.ok(!painted('CARLOS5',1544).has('Dijonnais'));
});

test('Nevers y Rethel tienen una sucesión propia, separada de Carlos el Temerario',()=>{
  for(const [id,year] of [['LUIS2FLA',1370],['FEL2BORG',1390],['PHIL2NEVERS',1410],['CAR1NEVERS',1440],['JUAN2NEVERS',1476]]){
    assert.ok(painted(id,year).has('Nevernais'),`${id}: Nevers ${year}`);
    assert.ok(painted(id,year).has('Rethelois'),`${id}: Rethel ${year}`);
  }
  assert.ok(!painted('CAR1BORG',1476).has('Nevernais'));
  assert.ok(!painted('CAR1BORG',1476).has('Rethelois'));
  assert.ok(!painted('FEL2BORG',1394).has('Rethelois'));
  assert.ok(painted('JUAN1BORG',1403).has('Nevernais'));
  assert.ok(!painted('JUAN1BORG',1405).has('Nevernais'));
  assert.ok(painted('PHIL2NEVERS',1404).has('Nevernais'));
  assert.ok(!painted('PHIL2NEVERS',1405).has('Rethelois'));
  assert.ok(painted('PHIL2NEVERS',1406).has('Rethelois'));
  assert.equal(person('PHILSTPOL').padre,'ANTONBRAB');
  assert.ok(UNIONES_CORONAS.find(u=>u.id==='herencia-borgonona')?.etapas.some(e=>e.personas.includes('MARGFLAN')));
});

test('los topónimos aportados están en el SVG; el color borgoñón precede a la unión hispánica',()=>{
  const svg=fs.readFileSync(new URL('../src/MapChart_Map.svg',import.meta.url),'utf8');
  const ids=new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  const requested=`West_Flanders Upper_Artois Lower_Artois Ponthieu Amienois Vermandois Caux Thierache Soissonais Remois Rethelois West_Luxembourg Verdunois Barrois Pays_Nancy Sarregueminois Lower_Alsace Upper_Alsace Rhine_Valley Schwarzwald Neckar Kraichgau Palatinate Hunsruck Pays_Messin East_Luxembourg Eifel Namur Liege Julich Koln_Bucht Limburg Niederrhein Gelderland Overijssel Drenthe Friesland Ommelanden North_Holland South_Holland Antwerp Kempenland East_Friesland Emsland Munsterland Ruhr Bergisches_Land Westerwald Taunus Untermain Odenwald Swabian_Alb Hegau Vosges Amont Millieu Aval Dijonnais Auxerrois Bassigny Perthois Senonais Champagne Brie_Champenois Beauvaisis Rouennais Hainaut Roman_Flanders East_Flanders Brabant Loon Neuchatel Vaud Bresse Autunnais Beaujolais Viennois Lyonnais Nevernais Orleanais Upper_Berry Gatinais Pays_France Chartrain Savoy Gresivaudan Dignois Avignonnais Dracenois Aquisextain Valentinois Vivarais Nimois Gevaudan Lower_Auvergne Bourbon Combraille Upper_Auvergne Turenne Nice`.split(' ');
  assert.equal(requested.length,100);
  for(const id of requested)assert.ok(ids.has(id),`${id} no existe en el SVG`);
  for(const [territory,regions] of Object.entries(REINO_A_IDS))for(const id of regions){
    if(['Borgoña','Condado de Borgoña','Flandes','Artois','Nevers','Rethel','Auxerre','Brabante','Limburgo','Henao','Holanda','Namur','Luxemburgo','Güeldres','Frisia','Overijssel','Drente','Groninga'].includes(territory)){
      assert.ok(ids.has(id),`${territory} → ${id} no existe`);
    }
  }
  const carlos=person('CARLOS5');
  assert.equal(colorTerritorioEnMapa(carlos,'Artois',1510),colorTerritorioEnMapa(carlos,'Flandes',1510));
  assert.equal(colorTerritorioEnMapa(carlos,'Flandes',1510),colorTerritorioEnMapa(carlos,'Luxemburgo',1510));
  assert.notEqual(colorTerritorioEnMapa(carlos,'Flandes',1540),colorTerritorioEnMapa(carlos,'Milán',1540));
});
