import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {TERRITORIOS} from '../src/data/territorios.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {reviewedLayerLocations, reviewedLayerEvidence} from '../src/data/locationMapPilot.js';
import {territorialIdentity, territorialLabel, territorialColor} from '../src/data/territorialIdentity.js';
import {politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';
import {applyContinuityReview} from '../prototypes/euv-locations/apply-continuity-review.mjs';

const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const entries=[...data.territories,...data.additionalTerritories];
const ids=(name,year)=>new Set(reviewedLayerLocations(data,entries.find(e=>e.name===name),year));
const person=id=>PERSONAS.find(p=>p.id===id);

test('Scandinavian kingdoms retain geometry and identity across both old survey cutoffs',()=>{
 for(const identity of ['Dinamarca','Noruega','Suecia']){
  const snapshots=[1200,1399,1400,1650,1651,1800].map(year=>politicalMosaicAt(data,year).layers.find(l=>l.entityId===identity));
  assert(snapshots.every(Boolean),identity);
  assert(snapshots.every(l=>l.ids.length>10));
  assert.equal(new Set(snapshots.map(l=>l.mosaicColor)).size,1);
 }
 assert(ids('Reino de Suecia',1332).has('Lund'));
 assert(!ids('Reino de Dinamarca',1332).has('Lund'));
 assert(ids('Reino de Dinamarca',1360).has('Lund'));
 assert(!ids('Reino de Suecia',1360).has('Lund'));
 for(const year of [1200,1399,1650,1651,1709,1800]){
  const faroe=politicalMosaicAt(data,year).layers.find(l=>l.entityId==='Islas Feroe');
  assert(faroe?.ids.includes('Torshavn'));
  assert.equal(faroe.displayName,'Islas Feroe');
  assert(reviewedLayerEvidence(entries.find(e=>e.name==='Islas Feroe bajo la Corona noruega'),year).limitedCore);
 }
});

test('the documented Danish succession reaches 1200 without inventing a king during the interregnum',()=>{
 for(const [id,year] of [['KNUD6DEN',1200],['VALDEMAR2DEN',1210],['ABELDEN',1251],['CHRIST1DEN',1255],['ERIK5DEN',1270],['ERIK6DEN',1300],['CHRIST2DEN',1321],['VALDEMAR3DEN',1327]]){
  const authority=mapAuthoritiesForPerson(person(id),year,data).find(l=>l.territory==='Dinamarca');
  assert(authority?.paint,id);assert(authority.ids.includes('Kobenhavn'));assert(authority.ids.includes('Lund'));
 }
 assert(!PERSONAS.some(p=>(p.gobiernos||[]).some(g=>g.territorio==='Dinamarca'&&g.desde<=1335&&g.hasta>=1335)));
 assert(ids('Reino de Dinamarca',1335).has('Kobenhavn'));
 assert(!ids('Reino de Dinamarca',1335).has('Lund'));
});

test('Bohemia and Moravia have distinct provincial contours before and after the Crown',()=>{
 for(const year of [1200,1348,1400,1526,1742,1800]){
  const boh=ids('Bohemia',year),mor=ids('Margraviato de Moravia',year);
  assert(boh.has('Prague'));assert(mor.has('Brno'));
  assert(!boh.has('Brno'));assert(!mor.has('Prague'));
  assert(![...boh].some(id=>mor.has(id)));
 }
 assert(!ids('Bohemia',1200).has('Cheb'));assert(ids('Bohemia',1322).has('Cheb'));
 assert(ids('Bohemia',1741).has('Klodzko'));assert(!ids('Bohemia',1742).has('Klodzko'));
 const early=mapAuthoritiesForPerson(person('VLADHENMOR'),1200,data).find(l=>l.territory==='Moravia');
 const later=mapAuthoritiesForPerson(person('VLADHENMOR'),1212,data).find(l=>l.territory==='Moravia');
 assert(early.ids.includes('Brno'));assert(!early.ids.includes('Olomouc'));assert(later.ids.includes('Olomouc'));
});

test('Neuberg changes government grouping without extinguishing the provinces',()=>{
 for(const year of [1200,1335,1378,1379,1400,1651,1780,1800]){
  const mosaic=politicalMosaicAt(data,year);
  for(const identity of ['Estiria','Carintia','Carniola']){
   const province=mosaic.layers.find(l=>l.entityId===identity);
   assert(province?.ids.length,identity+' '+year);
   assert.equal(province.mosaicColor,territorialColor(identity));
   assert(!mosaic.layers.find(l=>l.name==='Austria Interior')?.ids.some(id=>province.ids.includes(id)));
  }
 }
 assert(!ids('Carintia',1335).has('Lienz'));
 assert.equal(TERRITORIOS['Ducado de Estiria'].hasta,undefined);
});

test('France remains visible during the war and gains reviewed regional surfaces at dated transfers',()=>{
 assert(ids('Francia',1200).has('Paris'));
 assert(!ids('Francia',1429).has('Rouen'));assert(ids('Francia',1452).has('Rouen'));
 assert(!ids('Francia',1452).has('Bordeaux'));assert(ids('Francia',1453).has('Bordeaux'));
 assert(!ids('Francia',1348).has('Grenoble'));assert(ids('Francia',1349).has('Grenoble'));
 assert(!ids('Francia',1658).has('Perpignan'));assert(ids('Francia',1659).has('Perpignan'));
 for(const year of [1200,1530,1659,1800])for(const id of ['Puigcerda','South_Eastern_Pyrenees'])assert(!ids('Francia',year).has(id));
 assert(!ids('Francia',1765).has('Nancy'));assert(ids('Francia',1766).has('Nancy'));
 assert(!ids('Francia',1768).has('Corte'));assert(ids('Francia',1769).has('Corte'));
});

test('Anne fills the personal 1702–1714 gap and the union preserves Ireland separately',()=>{
 for(let year=1703;year<=1713;year++){
  const authorities=mapAuthoritiesForPerson(person('ANNEQUEEN'),year,data).filter(l=>l.paint);
  assert(authorities.find(l=>l.territory==='Irlanda')?.ids.includes('Dublin'));
  const british=authorities.find(l=>l.territory===(year<1707?'Inglaterra':'Gran Bretaña'));
  assert(british?.ids.includes('London'));assert(!british.ids.includes('Dublin'));
  if(year>=1707){assert(british.ids.includes('Edinburgh'));assert(!authorities.some(l=>l.territory==='Inglaterra'||l.territory==='Escocia'));}
 }
});

test('Silesia keeps one identity while inspection retains the two authorities on their own cells',()=>{
 const silesia=politicalMosaicAt(data,1742).layers.find(l=>l.entityId==='Silesia');
 assert.equal(silesia.displayName,'Ducados de Silesia');
 assert(silesia.scopes.some(s=>s.label==='parte prusiana'&&s.ids.includes('Wroclaw')));
 assert(silesia.scopes.some(s=>s.label==='remanente austríaco'&&s.ids.includes('Tesin')));
 assert(!silesia.scopes.filter(s=>s.label==='remanente austríaco').some(s=>s.ids.includes('Wroclaw')));
 assert.equal(territorialColor('Silesia austríaca'),territorialColor('Silesia'));
 for(const id of ['FRED2PRUSSIA','MARIATERESAHAB']){
  const mapped=mapAuthoritiesForPerson(person(id),1742,data).filter(l=>l.territory==='Silesia').flatMap(l=>l.ids);
  assert(mapped.length);
  if(id==='MARIATERESAHAB')assert(!mapped.includes('Wroclaw'));
 }
});

test('delegated offices retain actual county identity and partial reconstructions stay explicit',()=>{
 for(const id of ['BALINTTOROK','PETERPETROVICS','IMRECZIBAK']){
  const g=person(id).gobiernos.find(g=>g.condicion==='gobierno delegado');
  assert(['Condado de Temes','Condado de Bihar'].includes(g.territorio));
  assert.equal(TERRITORIOS[g.territorio].clase,'condado');assert.equal(g.clase,'gobierno');assert(g.soberano);
 }
 assert.equal(territorialIdentity('Gran Ducado de Lituania'),'Lituania');
 assert.equal(territorialLabel('Carniola',1364),'Ducado de Carniola');
 assert(reviewedLayerEvidence(entries.find(e=>e.name==='Gran Ducado de Lituania'),1300).limitedCore);
 assert(reviewedLayerEvidence(entries.find(e=>e.name==='Núcleo inglés en Irlanda'),1500).limitedCore);
});

test('regeneration replaces reviewed series without accumulating layers',()=>{
 const review=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/continuity-review.json',import.meta.url)));
 const once=applyContinuityReview(structuredClone(data),review);
 assert.deepEqual(applyContinuityReview(structuredClone(once),review),once);
});
