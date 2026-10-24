import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import DynastyArms, {ArmsCredit} from '../src/components/DynastyArms.jsx';
import {escudoDe} from '../src/content/dinastias/escudos.js';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';

const read = name => JSON.parse(fs.readFileSync(new URL(`../data/cartography/${name}.json`,import.meta.url)));
const review = read('north-africa-levant-review');
const data = read('corridor-locations');
data.burgundy = read('burgundian-locations');
const mosaics = new Map();
const owner = (year,id) => {
  if(!mosaics.has(year))mosaics.set(year,europeMosaicAt(data,year,PERSONAS));
  return (mosaics.get(year).byLocation.get(id)||[]).map(e=>e.entityId);
};

test('las plazas cambian de dueño en los límites documentados y dejan libre el interior', () => {
  for (const [id,from,through,identity] of [
    ['Asfi',1508,1540,'Plazas portuguesas del Magreb'],['Azemmour',1513,1540,'Plazas portuguesas del Magreb'],
    ['Agadir',1505,1540,'Plazas portuguesas del Magreb'],['Mogador',1506,1509,'Plazas portuguesas del Magreb'],
    ['Aguz',1508,1524,'Plazas portuguesas del Magreb'],['Asilah',1577,1588,'Plazas portuguesas del Magreb'],
    ['Larache',1610,1688,'Presidios españoles del Magreb'],['La_Mamora',1614,1680,'Presidios españoles del Magreb'],
    ['Mazaghan',1514,1768,'Plazas portuguesas del Magreb'],['Bejaia',1510,1554,'Presidios españoles del Magreb'],
  ]) {
    for(const year of [from,through])assert.ok(owner(year,id).includes(identity),`${id}/${year}`);
    for(const year of [from-1,through+1])assert.ok(!owner(year,id).includes(identity),`${id}/${year}`);
  }
  assert.ok(!owner(1708,'Oran').includes('Presidios españoles del Magreb'));
  assert.ok(owner(1707,'Oran').includes('Presidios españoles del Magreb'));
  assert.ok(owner(1534,'Tunis').includes('Imperio otomano'));
  assert.ok(owner(1569,'Tunis').includes('Imperio otomano'));
  assert.ok(owner(1573,'Tunis').includes('Presidios españoles del Magreb'));
  assert.ok(owner(1574,'Tunis').includes('Regencia de Túnez'));
  for(const id of ['Marrakesh','Fez','Tlemcen'])assert.ok(!owner(1520,id).some(x=>/Plazas portuguesas|Presidios españoles/.test(x)),id);
});

test('cada celda de África y Levante conserva una sola fase en los 601 años', () => {
  const phases = new Map(review.scope.ids.map(id=>[id,[]]));
  for(const p of review.assignments)for(const id of p.ids)phases.get(id).push(p);
  for(const[id,list]of phases)for(let year=1200;year<=1800;year++)
    assert.equal(list.filter(p=>p.from<=year&&year<=p.through).length,1,`${id}/${year}`);
});

test('las nuevas plazas portuguesas llegan al mapa personal del soberano', () => {
  const manuel=PERSONAS.find(p=>p.id==='MAN1PORT');assert.ok(manuel);
  const ids=new Set(mapAuthoritiesForPerson(manuel,1520,data).filter(e=>e.paint).flatMap(e=>e.ids));
  for(const id of ['Asfi','Agadir','Aguz','Azemmour','Mazaghan','Tangier'])assert.ok(ids.has(id),id);
  for(const id of ['Marrakesh','Fez','Tlemcen','Tunis'])assert.ok(!ids.has(id),id);
});

test('el signo ruríkida se presenta como sello principesco en ambos idiomas y al pedir dibujo', () => {
  const emblem=escudoDe('Rurikida');assert.equal(emblem.tipo,'signo');
  assert.match(emblem.nota,/signos personales/);assert.match(emblem.nota,/Sviatoslav/);
  assert.match(renderToStaticMarkup(React.createElement(DynastyArms,{dinastia:'Rurikida',drawn:true})),/^<img[^>]+alt="Signo principesco de Sviatoslav/);
  assert.match(renderToStaticMarkup(React.createElement(DynastyArms,{dinastia:'Rurikida',locale:'en'})),/alt="Princely sign of Sviatoslav/);
  assert.match(renderToStaticMarkup(React.createElement(ArmsCredit,{dinastia:'Rurikida'})),/Signo principesco:/);
  for(const house of ['Bagrationi','Bogdan-Mușat'])assert.ok(fs.existsSync(new URL(`../public${escudoDe(house).imagen.archivo}`,import.meta.url)),house);
});


test('el protectorado hafsí conserva identidad y trama sin extenderse a toda Ifriqiya', () => {
  const at1535=europeMosaicAt(data,1535,PERSONAS);
  const tunis=at1535.byLocation.get('Tunis');
  assert.ok(tunis.some(e=>e.tributaryRelation?.id==='tunis-hafsid-spain'));
  for(const id of ['Kairouan','Sousse','Bizerte'])
    assert.ok(!(at1535.byLocation.get(id)||[]).some(e=>e.tributaryRelation?.id==='tunis-hafsid-spain'),id);
  for(const year of [1534,1569])assert.ok(!owner(year,'Tunis').some((_,i)=>mosaics.get(year).byLocation.get('Tunis')[i].tributaryRelation?.id==='tunis-hafsid-spain'));
  const emperor=PERSONAS.find(p=>p.id==='CARLOS5');
  const entries=mapAuthoritiesForPerson(emperor,1535,data,{includeDependencies:true});
  assert.ok(entries.some(e=>e.kind==='tributary'&&e.relationship?.id==='tunis-hafsid-spain'&&e.ids.length===1&&e.ids[0]==='Tunis'));
});


test('las plazas españolas se vinculan al mandato efectivo de los reyes, sin inventar uno de España', () => {
  for(const [id,year,expected] of [
    ['CARLOS5',1520,['Melilla','Oran','Bejaia','Tripoli']],
    ['FEL2ESP',1573,['Melilla','Oran','Tunis']],
    ['FEL3ESP',1620,['Melilla','Oran','Larache','La_Mamora']],
  ]) {
    const p=PERSONAS.find(p=>p.id===id);assert.ok(p,id);
    const ids=new Set(mapAuthoritiesForPerson(p,year,data).filter(e=>e.paint).flatMap(e=>e.ids));
    for(const cell of expected)assert.ok(ids.has(cell),`${id}/${cell}`);
    for(const cell of ['Marrakesh','Fez','Tlemcen'])assert.ok(!ids.has(cell),`${id}/${cell}`);
  }
});
