import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {auditarTerritorios} from '../src/data/auditTerritorios.js';
import {personClaims} from '../src/evidence/claims.js';
import {FRONTIER_REVIEWS} from '../src/evidence/frontierReviewData.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {pilotLocationsFor, reviewedMapLayers, reviewedLayerLocations} from '../src/data/locationMapPilot.js';
import {territorialIdentity, territorialLabel} from '../src/data/territorialIdentity.js';

const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const people=new Map(PERSONAS.map(person=>[person.id,person]));
const cells=(territory,year,personId)=>pilotLocationsFor(data,territory,year,personId);
const layer=(name,year)=>reviewedLayerLocations(data,reviewedMapLayers(data).find(e=>e.name===name),year);
const authority=(personId,year)=>mapAuthoritiesForPerson(people.get(personId),year,data);

test('medieval Bulgaria includes mountain contours while vassal neighbours remain separate',()=>{
 const early=cells('Bulgaria',1200,'KALOYANBUL');
 assert(early.includes('Tarnovo')&&early.includes('Balkan_Mountains3'));
 assert(!early.includes('Varna'));
 const expanded=cells('Bulgaria',1230,'IVANASEN2BUL');
 for(const id of ['Plovdiv','Skopje','Ohrid','Kavala','Rhodope_Mountains3']) assert(expanded.includes(id),id);
 for(const id of ['Thessaloniki','Ioannina','Bucharest','Suceava']) assert(!expanded.includes(id),id);
 const ivaylo=authority('IVAYLOBUL',1279);
 assert(ivaylo.some(e=>e.kind==='disputed'&&e.ids.includes('Pleven')));
 const rival=authority('IVANASEN3BUL',1279);
 assert.deepEqual(rival.flatMap(e=>e.ids).sort(),['Lyaskovets','Tarnovo']);
 assert(rival.every(e=>e.kind==='disputed'&&e.claim?.sources.length));
});

test('Vidin occupation and coastal secession do not create two sovereign Bulgarian fills',()=>{
 assert.deepEqual(cells('Bulgaria',1367,'IVANSTRATSIMIRBUL'),[]);
 assert(cells('Bulgaria',1369,'IVANSTRATSIMIRBUL').includes('Vidin'));
 assert(!cells('Bulgaria',1360,'IVANALEXBUL').includes('Tulcea'));
 assert(layer('Despotado de Dobruja',1360).includes('Tulcea'));
 assert(cells('Bulgaria',1360,'IVANALEXBUL').includes('Varna'));
 assert(!cells('Bulgaria',1369,'IVANALEXBUL').includes('Varna'));
 assert.deepEqual(cells('Bulgaria',1394,'IVANSHISHMANBUL'),['Nikopol']);
 const occupied=authority('LUIS1',1367).find(e=>e.ids.includes('Vidin'));
 assert.equal(occupied.kind,'disputed');
});

test('Dragutin’s Sirmia is not the modern province north of the Sava',()=>{
 const ids=cells('Sirmia',1300,'DRAGUTINSER');
 for(const id of ['Sabac','Belgrad','Soli','Doboj','Rudnik']) assert(ids.includes(id),id);
 for(const id of ['Sremska_Mitrovica','Ilok','Petrovaradin']) assert(!ids.includes(id),id);
 assert(authority('DRAGUTINSER',1300).some(e=>e.mapSources.some(s=>s.url.includes('enciklopedija.hr'))));
});

test('Hungarian partition dates Buda, Gyula, Temes and the northern provinces independently',()=>{
 assert(!layer('Hungría otomana',1537).includes('Buda'));
 assert(layer('Hungría otomana',1541).includes('Buda'));
 assert(!layer('Hungría real',1527).includes('Petrovaradin'));
 assert(!layer('Hungría real',1537).includes('Pozega'));
 for(const id of ['Eastern_Carpathians1','Western_Carpathians2','Rakhiv','Miskolc'])
   assert(layer('Hungría real',1552).includes(id),id);
 assert(layer('Hungría real',1552).includes('Bekes'));
 assert(!layer('Hungría otomana',1552).includes('Bekes'));
 assert(layer('Hungría otomana',1566).includes('Bekes'));
 assert(!cells('Hungría',1566,'FERN1EMP').includes('Timisoara'));
 assert(layer('Hungría otomana',1691).includes('Oradea'));
 assert(!layer('Hungría otomana',1692).includes('Oradea'));
 assert(layer('Hungría real',1692).includes('Oradea'));
 assert(layer('Hungría otomana',1694).includes('Bekes'));
 assert(layer('Hungría real',1695).includes('Bekes'));
 assert(layer('Hungría otomana',1699).includes('Timisoara'));
 assert(!layer('Hungría real',1699).includes('Timisoara'));
 assert(layer('Banato de Temes',1720).includes('Timisoara'));
 assert(!layer('Hungría real',1720).includes('Timisoara'));
 assert(layer('Hungría real',1779).includes('Timisoara'));
 assert.equal(territorialIdentity('Núcleo oriental de Zápolya'),'Hungría');
 assert.equal(territorialLabel('Hungría real',1530),'Reino de Hungría');
});

test('French annexations and English Aquitaine preserve dates and neighbouring identities',()=>{
 assert(!cells('Francia',1311).includes('Lyon'));
 assert(cells('Francia',1312).includes('Lyon'));
 assert(!cells('Francia',1365).includes('Poitiers'));
 assert(cells('Aquitania',1365).includes('Poitiers'));
 assert(cells('Francia',1373).includes('Poitiers'));
 assert(!cells('Aquitania',1373).includes('Poitiers'));
 assert(!cells('Francia',1600).includes('Bourg_En_Bresse'));
 assert(cells('Francia',1601).includes('Bourg_En_Bresse'));
 for(const [id,date] of [['Foix',1607],['Pau',1620],['Avignon',1791]]) {
   assert(!cells('Francia',date-1).includes(id),`${id} before annexation`);
   assert(cells('Francia',date).includes(id),`${id} after annexation`);
 }
 for(const id of ['Jersey','Bern','Zurich','Geneva','Puigcerda']) assert(!cells('Francia',1715).includes(id),id);
 assert.equal(territorialLabel('Touraine angevina',1200),'Condado de Touraine');
 const prince=authority('EDUNEGRO',1365).find(e=>e.territory==='Aquitania');
 assert(prince?.ids.includes('Poitiers')&&prince.claim?.sources.length);
 assert(!authority('ENRIQ6ING',1453).some(e=>e.territory==='Aquitania'));
});

test('Hannover stays a separate mandate and excludes neighbouring imperial states',()=>{
 assert(!cells('Hannover',1704).includes('Celle'));
 assert(cells('Hannover',1705).includes('Celle'));
 assert(!cells('Hannover',1714).includes('Stade'));
 assert(cells('Hannover',1715).includes('Stade'));
 for(const id of ['Bremen','Brunswick','Wolfenbuttel','Hildesheim','Osnabruck'])
   assert(!cells('Hannover',1715).includes(id),id);
 const king=authority('GEORGE1GB',1715);
 assert(king.find(e=>e.territory==='Hannover')?.ids.includes('Hanover'));
 assert(!king.find(e=>e.territory==='Gran Bretaña')?.ids.includes('Hanover'));
});

test('Gibraltar and Menorca switch authorities instead of duplicating the Spanish fill',()=>{
 assert.equal(authority('ANNEQUEEN',1705).find(e=>e.ids.includes('Gibraltar'))?.kind,'disputed');
 assert.equal(authority('ANNEQUEEN',1713).find(e=>e.ids.includes('Gibraltar'))?.kind,'sovereign');
 assert(!authority('FEL5ESP',1705).some(e=>e.ids.includes('Gibraltar')));
 assert(!cells('Gran Bretaña',1756).includes('Ciudadela_de_Menorca'));
 assert(cells('Francia',1756).includes('Ciudadela_de_Menorca'));
 assert(cells('Gran Bretaña',1763).includes('Ciudadela_de_Menorca'));
 assert(!cells('Mallorca',1756).includes('Ciudadela_de_Menorca'));
 assert(cells('Mallorca',1782).includes('Ciudadela_de_Menorca'));
 assert(!cells('Mallorca',1798).includes('Ciudadela_de_Menorca'));
});

test('every new authority review links the actual mandate and records a source passage',()=>{
 for(const [id,review] of Object.entries(FRONTIER_REVIEWS)) {
   const claim=personClaims(people.get(id.split(':')[1])).find(c=>c.id===id);
   assert(claim,id);assert(claim.sources.length,id);
   assert(review.sources.every(source=>source.locator&&source.url.startsWith('https://')),id);
 }
});

test('provincial sovereignty preserves actual titles without turning Temes into a kingdom',()=>{
 for(const id of ['CARLOS6HRE','MARIATERESAHAB']) {
  const p=people.get(id),g=p.gobiernos.find(g=>g.territorio==='Banato de Temes');
  assert.equal(g.clase,'gobierno');assert(['Emperador','Archiduquesa'].includes(g.titulo));
  assert(!auditarTerritorios([{...p,gobiernos:[g]}]).some(e=>e.severity==='ERROR'));
  assert(auditarTerritorios([{...p,gobiernos:[{...g,titulo:'Rey'}]}]).some(e=>e.code==='TITLE_CLASS_MISMATCH'));
 }
});
