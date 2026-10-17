import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {esGobernante, territoriosGobernadosEnAño} from '../src/domain/government/reigns.js';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';

const people=new Map(PERSONAS.map(person=>[person.id,person]));
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/burgundian-locations.json',import.meta.url)));
const mandates=[['FERN2ALBA',1567,1573],['LUISREQUESENS',1573,1576],['DONJUANAUST',1576,1578],['ALEJFARNESIO',1578,1592]];
const entries=(id,year)=>mapAuthoritiesForPerson(people.get(id),year,data);

test('la selección de gobernantes exige un mandato y conserva los cuatro casos retirados',()=>{
  assert(PERSONAS.every(person=>!Object.hasOwn(person,'gobernante')));
  for(const [id,expected] of [['ELEANORAQUIT',true],['CONRADINOHOH',true],['ISABESLAV',false],['INESDUR',false]])assert.equal(esGobernante(people.get(id)),expected,id);
  assert.equal(esGobernante({id:'sin-mandato',titulo:'Rey',gobernante:true,reinos:['Francia']}),false);
  assert.deepEqual(territoriosGobernadosEnAño({titulo:'Rey',gobernante:true,reinos:['Francia']},1500),[]);
  assert.equal(esGobernante({gobernante:false,gobiernos:[{territorio:'Francia',desde:1500,hasta:1510,condicion:'efectivo'}]}),true);
  assert.equal(esGobernante({gobiernos:[{territorio:'Francia',desde:1500,hasta:1510,condicion:'titular'}]}),false);
});

test('cada gobernador tiene un mandato único, fechas, soberano y evidencia del cargo',()=>{
  for(const [id,from,through] of mandates){
    const p=people.get(id),govs=p.gobiernos.filter(g=>g.territorio==='Países Bajos');
    assert.equal(govs.length,1,id);
    const g=govs[0];
    assert.equal(g.desde,from);assert.equal(g.hasta,through);
    assert.equal(g.titulo,'Gobernador');assert.equal(g.clase,'gobierno');
    assert.equal(g.condicion,'gobierno delegado');assert.equal(g.soberano,'FEL2ESP');
    const claim=personClaims(p).find(c=>c.value===g);
    assert.equal(claim.certainty,'documented');assert(claim.sources.every(s=>s.locator&&s.url));
    assert(entries(id,from).some(e=>e.government===g&&e.claim?.id===claim.id));
    assert(!entries(id,from-1).some(e=>e.government===g));
    assert(!entries(id,through+1).some(e=>e.government===g));
  }
  const life=personClaims(people.get('LUISREQUESENS'));
  assert.equal(life.find(c=>c.field==='Nacimiento').certainty,'documented');
  assert.equal(life.find(c=>c.id==='person:LUISREQUESENS:death').exactDate,'1576-03-05');
});

test('gobernación y soberanía coexisten sin atribuir el norte rebelde a los gobernadores',()=>{
  const index=buildPoliticalMapIndex(PERSONAS,1568,data,{includeClaims:true});
  const brussels=inspectMapRegion('Brussels',1568,index,data);
  assert(brussels.entries.some(e=>e.person.id==='FEL2ESP'&&e.kind==='sovereign'));
  assert(brussels.entries.some(e=>e.person.id==='FERN2ALBA'&&e.kind==='delegated'));
  for(const [id,year] of [['FERN2ALBA',1572],['LUISREQUESENS',1574],['DONJUANAUST',1577],['ALEJFARNESIO',1586]]){
    assert(!entries(id,year).some(e=>e.ids.includes('Amsterdam')||e.ids.includes('Middelburg')),id);
    assert(!entries(id,year).some(e=>e.ids.includes('Dinant')),id);
    assert(entries(id,year).every(e=>e.kind!=='sovereign'||e.government.territorio==='Parma'),id);
  }
});

test('el ámbito limitado de don Juan no transforma la toma de Namur en dominio de todas las provincias',()=>{
  assert(entries('DONJUANAUST',1576).some(e=>e.kind==='delegated'&&e.ids.includes('Luxembourg')));
  assert(!entries('DONJUANAUST',1576).some(e=>e.ids.includes('Namur')));
  for(const year of [1577,1578]){
    assert(entries('DONJUANAUST',year).some(e=>e.kind==='disputed'&&e.ids.includes('Namur')));
    assert(!entries('DONJUANAUST',year).some(e=>e.ids.includes('Brussels')||e.ids.includes('Antwerp')));
    assert(entries('DONJUANAUST',year).every(e=>e.mapSources.length&&e.mapNote));
  }
});

test('Farnesio incorpora ámbitos fechados y conserva Parma como mandato separado',()=>{
  assert(!entries('ALEJFARNESIO',1578).some(e=>e.ids.includes('Arras')));
  assert(entries('ALEJFARNESIO',1579).some(e=>e.kind==='delegated'&&e.ids.includes('Arras')&&e.ids.includes('Mons')));
  assert(!entries('ALEJFARNESIO',1584).some(e=>e.ids.includes('Antwerp')));
  assert(entries('ALEJFARNESIO',1585).some(e=>e.kind==='disputed'&&e.ids.includes('Antwerp')));
  assert(entries('ALEJFARNESIO',1589).some(e=>e.ids.includes('Breda')));
  assert(!entries('ALEJFARNESIO',1590).some(e=>e.ids.includes('Breda')));
  for(const year of [1585,1589,1592])assert(!entries('ALEJFARNESIO',year).some(e=>e.ids.includes('Ostend')||e.ids.includes('Bergen_Zoom')));
  assert(entries('ALEJFARNESIO',1586).some(e=>e.kind==='sovereign'&&e.government.territorio==='Parma'));
});
