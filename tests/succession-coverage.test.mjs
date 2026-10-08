import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {SUCCESSION_REVIEWS} from '../src/evidence/successionReviewData.js';
import {personClaims} from '../src/evidence/claims.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {reviewedMapLayers,reviewedLayerLocations,pilotLocationsFor} from '../src/data/locationMapPilot.js';
import {auditLocationCoverage} from '../audit-uncolored-locations.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
const inventory=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/location-inventory.json',import.meta.url)));
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const layer=(name,year)=>reviewedLayerLocations(data,reviewedMapLayers(data).find(e=>e.name===name),year);
const authority=(id,year)=>mapAuthoritiesForPerson(people.get(id),year,data).flatMap(a=>a.ids);

test('Bulgarian accession crises have sourced mandates and Chaka has only a capital scope',()=>{
 for(const [id,year] of [['KALIMAN2BUL',1256],['MITSOASENBUL',1257],['SMILETSBUL',1295],['IVAN2SMILETSBUL',1298]])assert(authority(id,year).includes('Tarnovo'),id);
 assert.deepEqual([...new Set(authority('CHAKABUL',1299))].sort(),['Lyaskovets','Tarnovo']);
 assert.equal(people.get('IVANASEN3BUL').padre,'MITSOASENBUL');
 assert.equal(people.get('IVAN2SMILETSBUL').padre,'SMILETSBUL');
});
test('Dobruja separates the coastal despot, Wallachian recovery and final Ottoman administration',()=>{
 assert.equal(people.get('BALIKDOB').gobiernos[0].titulo,'Arconte');
 assert(authority('DOBROTITSA',1360).includes('Constanta'));
 assert(!authority('IVANKODOB',1389).includes('Tulcea'));
 assert(layer('Dobruja · dominios de Valaquia',1405).includes('Tulcea'));
 assert(!layer('Dobruja otomana',1405).includes('Tulcea'));
 assert(layer('Dobruja otomana',1419).includes('Tulcea'));
 assert(layer('Dobruja · dominios de Valaquia',1395).length===0);
});
test('coastal polygons and mountain cells follow their dated authorities, not modern Croatia',()=>{
 assert(layer('Croacia medieval',1500).includes('Crikvenica'));
 assert(!layer('Croacia habsbúrgica',1560).includes('Dinaric_Alps9'));
 assert(layer('Lika otomana',1560).includes('Dinaric_Alps9'));
 assert(layer('Croacia habsbúrgica',1690).includes('Dinaric_Alps9'));
 assert(layer('República de Ragusa',1300).includes('Lastovo_Island_Wasteland'));
 for(const [year,venetian] of [[1277,false],[1278,true],[1360,false],[1420,true]])assert.equal(layer('Dalmacia veneciana',year).includes('Brac'),venetian,year);
 assert(!layer('Dalmacia veneciana',1326).includes('Split'));
 assert(layer('Dalmacia veneciana',1327).includes('Split'));
 assert(!layer('Dalmacia veneciana',1479).includes('Krk'));
 assert(layer('Dalmacia veneciana',1480).includes('Krk'));
 for(const [year,venetian] of [[1572,true],[1573,false],[1646,true],[1671,false],[1684,true]])assert.equal(layer('Dalmacia veneciana',year).includes('Makarska'),venetian,year);
});
test('Meissen and Thuringia do not swallow bishoprics or the other Wettin branch',()=>{
 assert(authority('HEINRICH3MEISSEN',1250).includes('Eisenach'));
 assert(authority('FREDTUTTAMEISSEN',1289).includes('Dresden'));
 assert(authority('WILHELM1MEISSEN',1390).includes('Chemnitz'));
 assert(!authority('WILHELM1MEISSEN',1390).includes('Eisenach'));
 for(const id of ['Erfurt','Wurzen','Sondershausen','Schleusingen'])assert(!authority('WILHELM1MEISSEN',1390).includes(id),id);
 assert(!layer('Sajonia albertina',1490).includes('Altenburg'));
 assert(layer('Turingia ernestina',1490).includes('Altenburg'));
 assert(!layer('Ducado de Sajonia-Weimar',1610).includes('Saalfeld'));
 assert(layer('Ducado de Sajonia-Altenburg',1610).includes('Saalfeld'));
 assert(layer('Ducado de Sajonia-Saalfeld',1690).includes('Saalfeld'));
});
test('Nassau-Dietz never inherits the walramian surface and princely promotion does not enlarge it',()=>{
 assert(!authority('HENRY2NASSAU',1240).includes('Diez'));
 assert(authority('WALRAM2',1260).includes('Wiesbaden'));
 assert(!authority('OTTO1NASSAU',1260).includes('Wiesbaden'));
 assert(authority('HENRYCASIMIR1',1635).includes('Diez'));
 assert(!authority('HENRYCASIMIR1',1635).includes('Siegen'));
 assert(authority('WILLIAM4ORANGE',1743).includes('Siegen'));
 assert(!authority('WILLIAM4ORANGE',1743).includes('Wiesbaden'));
 assert.deepEqual(authority('WILLIAMFREDNASSAU',1653).filter(id=>id==='Diez'),authority('WILLIAMFREDNASSAU',1654).filter(id=>id==='Diez'));
});
test('Swabia ends its effective Staufen frame without extending it into neighbouring ecclesiastical states',()=>{
 for(const id of ['FED2HOH','ENRIQ7HOH','CONRADO4HOH'])assert(people.get(id).gobiernos.some(g=>g.territorio==='Suabia'&&g.titulo==='Duque'));
 assert(authority('CONRADO4HOH',1240).includes('Ulm'));
 for(const id of ['Augsburg','Konstanz','Kempten'])assert(!authority('CONRADO4HOH',1240).includes(id),id);
 assert.deepEqual(pilotLocationsFor(data,'Suabia',1269),[]);
});
test('each editorial review names a real claim; no retired title remains in the evidence index',()=>{
 for(const [key,value] of Object.entries(SUCCESSION_REVIEWS)){
  assert(personClaims(people.get(key.split(':')[1])).some(c=>c.id===key),key);
  assert(value.sources.length&&value.sources.every(s=>s.url.startsWith('https://')&&s.locator),key);
 }
});
test('the annual audit honours exclusions and supersession, and includes physical areas',()=>{
 const fixture={from:1200,through:1202,territories:[{name:'old',versions:[{from:1200,ids:['obsolete']}]},{name:'new',coverage:{from:1200,through:1202},supersedes:['old'],versions:[{from:1200,ids:['Removed_Alps']},{from:1201,ids:['Removed_Alps','peak']},{from:1202,ids:[]}]}],additionalTerritories:[],overrides:[{territory:'new',id:'Removed_Alps',action:'remove',from:1200,through:1202}],locationCrosswalk:{}};
 const cells=['Removed_Alps','peak','obsolete'].map(id=>({id,visible:true,area:1,bounds:[595,140,596,141],centroid:[595.5,140.5]}));
 const report=auditLocationCoverage(fixture,{cells},{people:[]});
 assert.equal(report.summary.everColored,1);assert.equal(report.cells.find(c=>c.id==='peak').coloredYears,1);
 assert(!report.cells.find(c=>c.id==='obsolete').colored);
 const alps=report.cells.find(c=>c.id==='Removed_Alps');assert(alps.physicalFeature&&alps.research.targets.length);
});
test('all actual visible SVG areas get coverage or an explicitly unverified research target',()=>{
 const report=auditLocationCoverage(data,inventory);
 assert.equal(report.summary.paths,7672);assert.equal(report.summary.visible,7641);
 assert.equal(report.summary.untriaged,0);
 assert(report.cells.filter(c=>c.visible&&!c.colored).every(c=>c.research.certainty==='unverified'&&c.research.targets.length));
 assert.equal(report.queues.reduce((n,q)=>n+q.cells,0),report.summary.neverColored);
});
