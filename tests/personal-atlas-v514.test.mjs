import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {personClaims} from '../src/evidence/claims.js';
import {PERSONAL_ATLAS_REVIEWS} from '../src/evidence/personalAtlasReviews.js';
import {mapAuthoritiesForPerson, mapAuthoritiesAcrossLife} from '../src/cartography/mapAuthorities.js';
import {composeRegionalAuthorityScopes} from '../src/cartography/authorityMapScopes.js';
import {colorTerritorioEnMapa, agrupacionesPoliticasEnMapa} from '../src/cartography/kingdomMaps.js';
import {ORANGE_NASSAU} from '../src/cartography/mapColors.js';
import {atlasPoliticalMosaicAt} from '../src/cartography/atlasMosaic.js';
const read = name => JSON.parse(fs.readFileSync(new URL('../data/cartography/'+name,import.meta.url)));
const data=read('corridor-locations.json');data.burgundy=read('burgundian-locations.json');
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const entries=(p,y)=>mapAuthoritiesForPerson(people.get(p),y,data);
const ids=(p,y,t)=>new Set(entries(p,y).filter(e=>!t||e.territory===t).flatMap(e=>e.ids));
test('regional replacement excludes stale in-footprint rights, retaining only prior rights outside the review',()=>{
 const old={ids:['A','B','C'],coverageIds:['A','B','C'],source:{url:'old'},note:'old'};
 const recent={ids:['A'],coverageIds:['A','B'],source:{url:'new'},note:'new'};
 assert.deepEqual(composeRegionalAuthorityScopes([recent,old]).ids,['A','C']);
 assert.deepEqual(recent.ids,['A']);assert.deepEqual(old.ids,['A','B','C']);
});
test('Navarra retains all eight documented cells throughout Spanish Habsburg mandates, without Lower Navarre',()=>{
 for(const p of ['CARLOS5','FEL2ESP','FEL3ESP','FEL4ESP','CARLOS2ESP']){
  const g=people.get(p).gobiernos.find(g=>g.territorio==='Navarra');
  for(let y=g.desde;y<=g.hasta;y++){
   assert.equal(ids(p,y,'Navarra').size,8,`${p} ${y}`);
   for(const id of ['Pamplona','Tudela','Olite','Estella','Sanguesa','Viana'])assert(ids(p,y,'Navarra').has(id));
   assert(!ids(p,y,'Navarra').has('Saint_Jean_Pied_de_Port'));
  }
 }
});
test('sourced provincial titles recover the southern Netherlands without transferring republican or ecclesiastical lands',()=>{
 for(const [p,y] of [['FEL4ESP',1650],['CARLOS2ESP',1680]]){
  for(const id of ['Brussels','Ghent','Mons','Namur','Luxembourg','Mechelen','Roermond'])assert(ids(p,y).has(id),`${p} ${id}`);
  for(const id of ['Amsterdam','Breda','Liege','Dinant','Dijon'])assert(!ids(p,y).has(id),`${p} ${id}`);
 }
 assert(ids('FEL4ESP',1650).has('Tournai'));assert(!ids('CARLOS2ESP',1680).has('Tournai'));
 assert(!ids('FEL3ESP',1610).has('Brussels'));
 assert(entries('ISABCLARAEUG',1630).filter(e=>e.territory==='Países Bajos').every(e=>e.kind==='delegated'));
 for(const [key,review] of Object.entries(PERSONAL_ATLAS_REVIEWS)){
  assert(personClaims(people.get(key.split(':')[1])).some(c=>c.id===key&&c.certainty===review.certainty),key);
  assert(review.sources.every(s=>s.url&&s.locator));
 }
});
test('Bohemian Crown shares color and preserves titles, with the 1749 administrative change and no Prussian Silesia',()=>{
 for(const [p,y] of [['FERN1EMP',1560],['CARLOS6HRE',1730],['MARIATERESAHAB',1750]]){
  const person=people.get(p);
  assert.equal(colorTerritorioEnMapa(person,'Moravia',y),colorTerritorioEnMapa(person,'Bohemia',y));
  assert(ids(p,y,'Moravia').has('Brno'));assert(ids(p,y,'Bohemia').has('Prague'));
  assert(person.gobiernos.some(g=>g.territorio==='Moravia'&&g.titulo==='Margrave'));
  const mosaic=atlasPoliticalMosaicAt(data,y);
  for(const territory of ['Bohemia','Moravia']){
   const reviewed=new Set(mosaic.layers.filter(l=>l.entityId===territory).flatMap(l=>l.ids));
   assert.deepEqual(ids(p,y,territory),reviewed,`${p} ${y}: whole reviewed ${territory}`);
  }
 }
 assert(!ids('MARIATERESAHAB',1750,'Silesia').has('Wroclaw'));
 const mt=people.get('MARIATERESAHAB');assert.equal(colorTerritorioEnMapa(mt,'Austria',1750),colorTerritorioEnMapa(mt,'Moravia',1750));
 assert.notEqual(colorTerritorioEnMapa(mt,'Hungría',1750),colorTerritorioEnMapa(mt,'Moravia',1750));
 assert(agrupacionesPoliticasEnMapa(mt,1750).some(g=>g.id==='austro-bohemia'));
});
test('Republican provinces and generality lands share Orange-Nassau orange, while identities and dated owners remain',()=>{
 const mosaic=atlasPoliticalMosaicAt(data,1705);
 for(const id of ['Amsterdam','Groningen','Breda'])assert.equal(mosaic.byLocation.get(id)[0].mosaicColor,ORANGE_NASSAU,id);
 assert.notEqual(mosaic.byLocation.get('Ghent')[0].mosaicColor,ORANGE_NASSAU);
 assert.equal(mosaic.byLocation.get('Amsterdam')[0].entityId,'Holanda');
 assert.notEqual(atlasPoliticalMosaicAt(data,1560).byLocation.get('Amsterdam')[0].mosaicColor,ORANGE_NASSAU);
});

test('all-years view retains possessions lost later and keeps delegated offices hatched and orange',async()=>{
 const philip=await mapAuthoritiesAcrossLife(people.get('FEL4ESP'),data);
 assert(philip.some(e=>e.ids.includes('Breda')));
 assert(!ids('FEL4ESP',1650).has('Breda'));
 assert(philip.some(e=>e.territory==='Navarra'&&e.ids.includes('Pamplona')));
 assert(!philip.some(e=>e.ids.includes('Dijon')));
 const maurice=await mapAuthoritiesAcrossLife(people.get('MAURICEORANGE'),data);
 assert(maurice.some(e=>e.ids.includes('Amsterdam')));
 const commissions=maurice.filter(e=>e.territory==='Países Bajos');
 assert(commissions.length);
 assert(commissions.every(e=>['delegated','mixed','disputed'].includes(e.kind)&&e.color===ORANGE_NASSAU));
 assert(commissions.some(e=>e.kind==='delegated'&&e.ids.includes('Amsterdam')));
 assert.equal(await mapAuthoritiesAcrossLife(people.get('FEL4ESP'),data),philip);
});

test('cancelled lifetime computation cannot deliver stale ownership to a new selection',async()=>{
 const controller=new AbortController();controller.abort();
 await assert.rejects(mapAuthoritiesAcrossLife(people.get('CARLOS5'),data,{signal:controller.signal}),{name:'AbortError'});
});
