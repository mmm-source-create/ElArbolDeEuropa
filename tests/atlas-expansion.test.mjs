import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {pilotLocationsFor, reviewedLayerLocations} from '../src/data/locationMapPilot.js';
import {AUTHORITY_GAPS_REVIEWS} from '../src/evidence/authorityGapsReviewData.js';
import {personClaims} from '../src/evidence/claims.js';
import {auditarTerritorios} from '../src/data/auditTerritorios.js';
import {politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const ids=(id,year)=>mapAuthoritiesForPerson(people.get(id),year,data).flatMap(e=>e.ids);

test('dated regional rivals and delegates do not inherit a whole empire or principality',()=>{
 assert(ids('SULEYMANCELEBI',1408).includes('Edirne'));
 assert(!ids('SULEYMANCELEBI',1408).includes('Drastar'));
 assert(ids('SULEYMANCELEBI',1408).includes('Constantia_Bul'));
 assert.deepEqual(ids('MUSACELEBI',1410),['Edirne']);
 assert(!ids('MUSACELEBI',1413).includes('Nis'));
 assert(ids('MOSESSZEKELY',1603).includes('Cluj'));
 assert(!ids('MOSESSZEKELY',1603).includes('Miercurea_Cluc'));
 const governor=mapAuthoritiesForPerson(people.get('GIORGIOBASTA'),1604,data).find(e=>e.territory==='Transilvania');
 assert.equal(governor.kind,'delegated');assert.equal(governor.government.soberano,'RODOLFO2HRE');
 assert(governor.mapSources.length&&governor.ids.includes('Cluj'));
 assert.equal(mapAuthoritiesForPerson(people.get('RODOLFO2HRE'),1603,data).find(e=>e.territory==='Transilvania').kind,'disputed');
});

test('Dobruja and Niš follow their own city chronology and checked geometry',()=>{
 for(const id of ['Drastar','Constanta','Karvuna','Kaliakra'])assert(ids('MIRCEA1WAL',1408).includes(id),id);
 for(const year of [1415,1427,1444,1455]){
  assert(!pilotLocationsFor(data,'Imperio otomano',year).includes('Nis'));
  assert(pilotLocationsFor(data,'Serbia',year).includes('Nis'));
 }
 for(const year of [1410,1428,1443,1456]){
  assert(pilotLocationsFor(data,'Imperio otomano',year).includes('Nis'));
  assert(!pilotLocationsFor(data,'Serbia',year).includes('Nis'));
 }
 for(const territory of ['Bosnia','Imperio otomano']){
  const names=territory==='Bosnia'?['Reino de Bosnia']:['Bosnia y Herzegovina otomanas'];
  for(const name of names){const entry=data.additionalTerritories.find(t=>t.name===name);
   assert(entry.versions.every(v=>!v.ids.includes('Foca')&&!v.ids.includes('Ravno')));}
 }
});

test('imperial branches and eastern territories use cores within the documented dates',()=>{
 assert(ids('THEODORE2MOREA',1443).includes('Mystras'));
 assert.equal(ids('THOMASPALA',1450).length,0);
 assert(ids('GEORGEBRUNSCAL',1640).includes('Hanover'));
 assert(!ids('GEORGEBRUNSCAL',1640).includes('Celle'));
 assert(!ids('GEORGEBRUNSCAL',1635).includes('Hanover'));
 assert(ids('WILLIAMYOUNGERBRUN',1570).includes('Celle'));
 assert(!ids('WILLIAMYOUNGERBRUN',1570).includes('Hanover'));
 const herz=data.additionalTerritories.find(t=>t.name==='Núcleo de Herzegovina');
 assert.deepEqual(reviewedLayerLocations(data,herz,1465),[]);
 const cyprus=data.additionalTerritories.find(t=>t.name==='Núcleo del reino de Chipre');
 assert.equal(reviewedLayerLocations(data,cyprus,1462).length,0);
 assert.equal(reviewedLayerLocations(data,cyprus,1464).length,5);
});

test('the mosaic and the selected map share dated exclusions despite merged source order',()=>{
 const entry={name:'Capa',versions:[{from:1400,ids:['A']}],active:{from:1400,through:1650}};
 const sample={from:1400,through:1650,territories:[entry],overrides:[
  {territory:'Capa',id:'A',action:'remove',from:1400,through:1450},
  {territory:'Capa',id:'A',action:'add',from:1400,through:1650},
 ]};
 assert.deepEqual(reviewedLayerLocations(sample,entry,1408),[]);
 assert.equal(politicalMosaicAt(sample,1408).byLocation.size,0);
 assert.deepEqual(reviewedLayerLocations(sample,entry,1451),['A']);
 for(const entry of data.additionalTerritories){
  assert.match(entry.color,/^#[0-9a-f]{6}$/i);
  for(const source of entry.sources||[])assert(!/\s/.test(source.url),source.url);
 }
});

test('claim sources remain linked to actual mandates and a delegated governor is not a rival succession',()=>{
 for(const [key,review] of Object.entries(AUTHORITY_GAPS_REVIEWS)){
  assert(personClaims(people.get(key.split(':')[1])).some(claim=>claim.id===key),key);
  assert(review.sources.every(s=>s.locator&&new URL(s.url).protocol==='https:'));
 }
 const issues=auditarTerritorios([people.get('GIORGIOBASTA'),people.get('RODOLFO2HRE')]);
 assert(!issues.some(i=>i.code==='SUCCESSION_OVERLAP'));
});
