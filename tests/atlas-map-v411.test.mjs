import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {personClaims} from '../src/evidence/claims.js';
import {ROMANIAN_AUTHORITY_REVIEWS} from '../src/evidence/romanianReviewData.js';
import {NORTHERN_AUTHORITY_REVIEWS} from '../src/evidence/northernReviewData.js';
import {buildPoliticalMapIndex, inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {mapLocationsForGovernment, pilotLocationsFor} from '../src/data/locationMapPilot.js';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const indexes=new Map();
const inspect=(id,year)=>{
 if(!indexes.has(year)) indexes.set(year,buildPoliticalMapIndex(PERSONAS,year,data,{includeClaims:true}));
 return inspectMapRegion(id,year,indexes.get(year),data);
};
const ids=(person,year)=>mapAuthoritiesForPerson(people.get(person),year,data).filter(e=>e.paint).flatMap(e=>e.ids);

test('every year in Wallachia and Moldavia from 1400 to 1650 has its own princely authority',()=>{
 for(let year=1400;year<=1650;year++) for(const [id,territory] of [['Bucharest','Valaquia'],['Suceava','Moldavia']]) {
  const entries=inspect(id,year).entries.filter(e=>e.territory===territory);
  assert(entries.length,`${territory}: ${year}`);
  assert(entries.every(e=>e.person&&e.government.territorio===territory));
  assert(!inspect(id,year).entries.some(e=>e.territory==='Imperio otomano'),`${territory} is not an Ottoman province: ${year}`);
 }
});

test('co-rule, rival restorations and usurpations are represented only in the relevant years',()=>{
 for(const id of ['ILIAS1MOLD','STEFAN2MOLD']) assert(inspect('Suceava',1438).entries.some(e=>e.person?.id===id&&e.government.condicion==='corregente'));
 const kind=(id,year)=>mapAuthoritiesForPerson(people.get(id),year,data).find(e=>e.territory==='Valaquia')?.kind;
 assert.equal(kind('VLADISLAV2WAL',1448),'disputed');assert.equal(kind('VLADISLAV2WAL',1450),'sovereign');
 assert.equal(kind('RADUPAISIE',1539),'disputed');assert.equal(kind('RADUPAISIE',1544),'disputed');assert.equal(kind('RADUPAISIE',1541),'sovereign');
 assert.equal(kind('BASARABTEPELUS',1481),'disputed');assert.equal(kind('BASARABTEPELUS',1479),'sovereign');
 assert(inspect('Suceava',1593).entries.some(e=>e.person?.id==='ARONTIRANUL'));
});

test('all new Romanian and northern mandates resolve to individually documented claims',()=>{
 for(const [key,review] of Object.entries({...ROMANIAN_AUTHORITY_REVIEWS,...NORTHERN_AUTHORITY_REVIEWS})) {
  const claim=personClaims(people.get(key.split(':')[1])).find(c=>c.id===key);
  assert(claim,key);assert.equal(claim.certainty,'documented',key);
  assert(review.sources.length&&review.sources.every(s=>s.locator&&s.url.startsWith('https://')),key);
 }
});

test('southern Catalan Pyrenees remain attached to Spanish governments across the 1659 partition',()=>{
 for(const year of [1516,1530,1550]) {
  const entry=mapAuthoritiesForPerson(people.get('CARLOS5'),year,data).find(e=>e.ids.includes('South_Eastern_Pyrenees'));
  assert.equal(entry.territory,'Condado de Barcelona');assert(entry.mapSources.length);
 }
 for(const year of [1660,1700,1710,1850]) {
  assert(!mapLocationsForGovernment(data,{territorio:'Francia'},year,null,['Roussillon']).includes('South_Eastern_Pyrenees'));
  assert(mapLocationsForGovernment(data,{territorio:'España'},year).includes('South_Eastern_Pyrenees'));
 }
});

test('visual northern omissions are filled while Scania and the separate duchies keep their governments',()=>{
 const sw=pilotLocationsFor(data,'Suecia',1530),no=pilotLocationsFor(data,'Noruega',1530),dk=pilotLocationsFor(data,'Dinamarca',1530);
 for(const oldId of ['Vastmanland','Nerike','Dalsland','Tioharad','Satakunta']) {
  const locations=data.locationCrosswalk.newIdsByOldId[oldId].ids;
  assert(locations.length);assert(locations.every(id=>sw.includes(id)),oldId);
 }
 for(const oldId of ['Troms','Akershus','Ostfold']) assert(data.locationCrosswalk.newIdsByOldId[oldId].ids.every(id=>no.includes(id)),oldId);
 for(const id of ['Aalborg','Ars','Viborg','Randers','Helsingborg','Lund','Malmo','Osby','Gladsax']) assert(dk.includes(id),id);
 for(const id of ['Malmo','Lund','Helsingborg']) assert(!sw.includes(id),id);
 for(const id of ['Flensburg','Husum','Slesvig']) assert(!dk.includes(id),id);
});

test('Swedish regencies add delegated government before and between royal mandates',()=>{
 for(const [person,year] of [['ENGELBREKT',1435],['CARLOS8SUE',1437],['CARLOS8SUE',1439],['JONSBENGTSSON',1465],['ERIKAXELSSONTOTT',1466],['GUSTAV1VASA',1522],['CARLOS9SUE',1602]]) {
  assert(ids(person,year).includes('Stockholm'),`${person} ${year}`);
  const entry=mapAuthoritiesForPerson(people.get(person),year,data).find(e=>e.territory==='Suecia');
  assert(['delegated','disputed'].includes(entry.kind));assert(entry.claim.sources.length);
 }
 assert(mapAuthoritiesForPerson(people.get('GUSTAV1VASA'),1530,data).some(e=>e.territory==='Suecia'&&e.kind==='sovereign'));
});

test('Saxon and Württemberg partitions map the actual dynastic branch',()=>{
 assert(ids('MORITZSAX',1545).includes('Dresden'));assert(!ids('MORITZSAX',1545).includes('Wittenberg'));
 assert(ids('MORITZSAX',1550).includes('Wittenberg'));
 assert(ids('FRED3SAX',1510).includes('Wittenberg'));assert(!ids('FRED3SAX',1510).includes('Dresden'));
 assert.deepEqual(ids('ULRICH5WURTT',1460),['Stuttgart']);
 assert(ids('EBERHARD1WURTT',1460).includes('Urach'));assert(!ids('EBERHARD1WURTT',1460).includes('Stuttgart'));
 assert(ids('EBERHARD1WURTT',1490).includes('Stuttgart'));
});

test('Brandenburg incorporation and Hesse inheritance do not swallow independent territories',()=>{
 assert(!ids('JOACHIM1BRAND',1520).includes('Ruppin'));assert(ids('JOACHIM1BRAND',1530).includes('Ruppin'));
 assert(ids('FRED1BRAND',1420).includes('Berlin'));assert(!ids('JOHNALCHEMIST',1430).includes('Berlin'));
 assert(ids('FELIPEHESSE',1550).includes('Marburg'));
 assert(ids('WILLIAM4HESSE',1580).includes('Kassel'));assert(!ids('WILLIAM4HESSE',1580).includes('Darmstadt'));
 assert(ids('GEORGE1HESSEDARM',1580).includes('Darmstadt'));assert(!ids('GEORGE1HESSEDARM',1580).includes('Kassel'));
 assert(!ids('MAURICEHESSEKASS',1610).includes('Marburg'));
 assert(!ids('CARLOS5',1530).includes('Berlin'));
});

test('new imperial layers use existing SVG cells and match the canonical source',()=>{
 const canonical=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/imperial-core-locations.json',import.meta.url)));
 const succession=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/succession-review.json',import.meta.url)));
 const svg=fs.readFileSync(new URL('../prototypes/euv-locations/euv-locations-crop.svg',import.meta.url),'utf8');
 for(const layer of canonical.territories) {
  const replacement=succession.replacements.find(t=>t.name===layer.name);
  const expected={...layer,...replacement};
  if(replacement){delete expected.active;delete expected.periods;delete expected.temporalExtensions}
  assert.deepEqual(data.additionalTerritories.find(t=>t.name===layer.name),expected,layer.name);
  assert(layer.active.source.startsWith('https://'));
  for(const version of layer.versions) for(const id of version.ids) assert(svg.includes(`id="${id}"`),id);
 }
});
