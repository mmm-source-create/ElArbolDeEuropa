import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {europeMosaicAt} from '../src/data/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {personClaims} from '../src/evidence/claims.js';
import {EASTERN_EUROPE_REVIEWS} from '../src/evidence/easternEuropeReviews.js';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const owner=(year,id)=>new Set((europeMosaicAt(data,year,PERSONAS).byLocation.get(id)||[]).map(l=>l.entityId));
const ids=(id,year,options)=>new Set(mapAuthoritiesForPerson(by.get(id),year,data,options).flatMap(e=>e.ids));

test('Russian consolidation retains neighbouring principalities until their own annexation',()=>{
  for(const [year,id,identity] of [
    [1200,'Murom','Principado de Múrom'],[1350,'Tver','Principado de Tver'],
    [1477,'Novgorod','República de Nóvgorod'],[1478,'Novgorod','Rusia'],
    [1484,'Tver','Principado de Tver'],[1485,'Tver','Rusia'],
    [1509,'Pskov','República de Pskov'],[1510,'Pskov','Rusia'],
    [1520,'Ryazan','Principado de Riazán'],[1521,'Ryazan','Rusia'],
    [1551,'Kazan','Kanato de Kazán'],[1552,'Kazan','Rusia'],
    [1472,'Cherdyn','Principado de Gran Perm'],[1504,'Cherdyn','Principado de Gran Perm'],[1505,'Cherdyn','Rusia'],
  ])assert(owner(year,id).has(identity),`${year}/${id}/${identity}`);
});
test('Livonian conquests, Danish islands and the Great Northern War have separate dated outcomes',()=>{
  for(const [year,id,identity] of [
    [1557,'Narva','Orden de Livonia'],[1558,'Narva','Rusia'],[1583,'Narva','Suecia'],
    [1704,'Narva','Rusia'],[1560,'Tartu','Rusia'],[1582,'Tartu','Livonia polaca'],
    [1644,'Kuressaare','Dinamarca'],[1645,'Kuressaare','Suecia'],
    [1710,'Riga','Rusia'],[1720,'Jelgava','Curlandia'],[1795,'Jelgava','Rusia'],
    [1700,'Oreshek','Suecia'],[1703,'Oreshek','Rusia'],
    [1742,'Villmanstrand','Suecia'],[1743,'Villmanstrand','Rusia'],
  ])assert(owner(year,id).has(identity),`${year}/${id}/${identity}`);
});
test('Lithuanian genealogy connects Jogaila and Vytautas without inventing unknown ancestors',()=>{
  assert.equal(by.get('LADI2').padre,'ALGIRDASLIT');
  assert.equal(by.get('VYTAUTASLIT').padre,'KESTUTISLIT');
  assert.equal(by.get('ALGIRDASLIT').padre,'GEDIMINASLIT');
  assert.equal(by.get('KESTUTISLIT').padre,'GEDIMINASLIT');
  assert(!by.get('MINDAUGASLIT').nac);
  assert(!by.get('TRENIOTALIT').padre);
  for(const key of Object.keys(EASTERN_EUROPE_REVIEWS)){
    const claim=personClaims(by.get(key.split(':')[1])).find(c=>c.id===key);
    assert(claim?.sources.length,key);
  }
});
test('medieval personal maps do not borrow future Russia or the rival Lithuanian capital',()=>{
  assert(ids('GEDIMINASLIT',1330).has('Vilnius'));
  assert(!ids('GEDIMINASLIT',1330).has('Moscow'));
  assert(!ids('YAROSLAV2VLAD',1240).has('Kazan'));
  assert(!ids('YAROSLAV2VLAD',1240).has('Pskov'));
  assert(ids('KESTUTISLIT',1360).has('Trakai'));
  assert(!ids('KESTUTISLIT',1360).has('Vilnius'));
  assert(!ids('SVITRIGAILALIT',1434,{includeClaims:true}).has('Vilnius'));
  assert(ids('SVITRIGAILALIT',1434,{includeClaims:true}).has('Lutsk'));
  assert(!ids('ZYGIMANTASLIT',1434).has('Lutsk'));
  assert(!ids('SVITRIGAILALIT',1437,{includeClaims:true}).has('Polotsk'));
  assert(ids('ZYGIMANTASLIT',1437).has('Polotsk'));
  assert(ids('ZYGIMANTASLIT',1434).has('Vilnius'));
  const sk=mapAuthoritiesForPerson(by.get('SKIRGAILALIT'),1390,data);
  assert(sk.some(e=>e.kind==='delegated'&&e.ids.includes('Vilnius')));
});
test('the southern steppe and indigenous northern lands retain authority without invented annexation',()=>{
  for(const [year,id,identity] of [
    [1200,'Kolguyev','Tierras de los nenets y janty'],
    [1800,'Yuzhny','Nueva Zembla'],[1420,'Taman','Señorío de Matrega'],
    [1774,'Vosporo','Rusia'],[1700,'Gomel','Lituania'],
    [1700,'Ulla','Lituania'],[1795,'Gomel','Rusia'],
  ])assert(owner(year,id).has(identity),`${year}/${id}/${identity}`);
});

test('a sultan keeps the Crimean ports as direct holdings and the khanate as a dated dependency',()=>{
  const p=by.get('SULEIMAN1OSM');
  const direct=mapAuthoritiesForPerson(p,1530,data);
  assert(direct.some(e=>e.ids.includes('Kaffa')));
  assert(!direct.some(e=>e.ids.includes('Qirq_Yer')));
  const extended=mapAuthoritiesForPerson(p,1530,data,{includeDependencies:true});
  const crimea=extended.find(e=>e.kind==='tributary'&&e.territory==='Kanato de Crimea');
  assert(crimea?.ids.includes('Qirq_Yer'));
  assert(!crimea.ids.includes('Kaffa'));
  assert(crimea.mapSources.every(s=>s.locator));
});
