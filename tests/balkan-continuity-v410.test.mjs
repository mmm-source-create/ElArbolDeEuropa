import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {personClaims} from '../src/evidence/claims.js';
import {BALKAN_AUTHORITY_REVIEWS} from '../src/evidence/balkanReviewData.js';
import {buildPoliticalMapIndex, inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {pilotLocationsFor, mapLocationsForGovernment} from '../src/data/locationMapPilot.js';
import {idsDeGobiernoEnAño} from '../src/Territorios.jsx';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const inspect=(id,year)=>inspectMapRegion(id,year,buildPoliticalMapIndex(PERSONAS,year,data,{includeClaims:true}),data);

test('Ottoman succession covers 1617–1640 without swallowing the Romanian principalities',()=>{
 for(let year=1617;year<=1640;year++) {
  const entries=inspect('Smederevo',year).entries;
  assert(entries.some(e=>e.territory==='Imperio otomano'),`Serbia ${year}`);
  for(const entry of entries.filter(e=>e.territory==='Imperio otomano')) {
   const ids=mapAuthoritiesForPerson(entry.person,year,data).flatMap(e=>e.ids);
   assert(!ids.includes('Bucharest')&&!ids.includes('Suceava')&&!ids.includes('Cluj'));
  }
 }
 assert(inspect('Edirne',1400).entries.some(e=>e.person?.id==='BAYEZID1OSM'));
 assert(inspect('Edirne',1415).entries.some(e=>e.person?.id==='MEHMED1OSM'));
 assert.equal(inspect('Edirne',1408).entries.length,0,'the interregnum is not assigned to a single invented ruler');
});

test('Wallachia and Moldavia have sourced princely governments throughout 1601–1650',()=>{
 for(let year=1601;year<=1650;year++) for(const [id,territory] of [['Bucharest','Valaquia'],['Suceava','Moldavia']]) {
  const entries=inspect(id,year).entries.filter(e=>e.territory===territory);
  assert(entries.length,`${territory} ${year}`);
  assert(entries.some(e=>e.claim?.sources.length),`${territory} ${year}: source`);
 }
 assert(inspect('Cluj',1607).entries.some(e=>e.person?.id==='SIGISMUNDRAKOCZI'));
 assert(inspect('Cluj',1610).entries.some(e=>e.person?.id==='GABRIELBATHORY'));
});

test('Bosnian rivalry and Ragusan republican government have distinct authority types',()=>{
 assert(inspect('Zenica',1419).entries.some(e=>e.person?.id==='STJEPANOSTOJICBOS'&&e.kind==='sovereign'));
 const entries=inspect('Zenica',1420).entries;
 assert(entries.filter(e=>['STJEPANOSTOJICBOS','TVRTKO2BOS'].includes(e.person?.id)).every(e=>e.kind==='disputed'));
 assert.equal(mapAuthoritiesForPerson(people.get('TVRTKO2BOS'),1434,data)[0].kind,'disputed');
 assert.equal(mapAuthoritiesForPerson(people.get('TVRTKO2BOS'),1436,data)[0].kind,'sovereign');
 const ragusa=inspect('Dubrovnik',1630).entries.find(e=>e.collective);
 assert.equal(ragusa.kind,'collective');assert(ragusa.collective.fuente.url);
 assert(!pilotLocationsFor(data,'Imperio otomano',1630).includes('Dubrovnik'));
});

test('Serbian occupation and restoration and Venetian Greek ports follow documented dates',()=>{
 assert(pilotLocationsFor(data,'Serbia',1438).includes('Smederevo'));
 for(const year of [1439,1440,1443]) {
  assert(!pilotLocationsFor(data,'Serbia',year).includes('Smederevo'));
  assert(pilotLocationsFor(data,'Imperio otomano',year).includes('Smederevo'));
 }
 assert(pilotLocationsFor(data,'Serbia',1444).includes('Smederevo'));
 assert(!pilotLocationsFor(data,'Imperio otomano',1444).includes('Smederevo'));
 assert(pilotLocationsFor(data,'Venecia',1539).includes('Monemvasia'));
 assert(!pilotLocationsFor(data,'Imperio otomano',1539).includes('Monemvasia'));
 assert(pilotLocationsFor(data,'Imperio otomano',1540).includes('Monemvasia'));
 assert(!pilotLocationsFor(data,'Venecia',1540).includes('Monemvasia'));
 assert(pilotLocationsFor(data,'Venecia',1462).includes('Argos'));
 assert(!pilotLocationsFor(data,'Imperio otomano',1462).includes('Argos'));
});

test('Puigcerdà belongs to Charles V and is not permanently ceded to France after 1659',()=>{
 for(const year of [1516,1530,1550]) {
  const entry=mapAuthoritiesForPerson(people.get('CARLOS5'),year,data).find(e=>e.ids.includes('Puigcerda'));
  assert.equal(entry.territory,'Condado de Barcelona');assert(entry.paint&&entry.mapSources.length);
 }
 for(const year of [1660,1700,1720,1800,1850]) {
  const g={territorio:'Francia',desde:year,hasta:year,titulo:'Rey',condicion:'efectivo'};
  assert(!mapLocationsForGovernment(data,g,year,null,idsDeGobiernoEnAño(g,year)).includes('Puigcerda'));
  assert(mapLocationsForGovernment(data,{territorio:'Condado de Barcelona'},year).includes('Puigcerda'));
 }
 const occupation=mapAuthoritiesForPerson(people.get('LUIS14FRA'),1710,data).find(e=>e.ids.includes('Puigcerda'));
 assert.equal(occupation.kind,'disputed');assert(occupation.mapSources.length);
});

test('each Balkan mandate review resolves to its individual claim and a dated source passage',()=>{
 for(const [key,review] of Object.entries(BALKAN_AUTHORITY_REVIEWS)) {
  const claim=personClaims(people.get(key.split(':')[1])).find(c=>c.id===key);
  assert(claim,key);assert.equal(claim.certainty,'documented');
  assert(review.sources.every(s=>s.locator&&s.url.startsWith('https://')),key);
 }
});
