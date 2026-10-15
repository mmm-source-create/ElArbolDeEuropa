import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {europeMosaicAt,governmentTableAt} from '../src/data/europePanorama.js';
import {governmentGroupsAt,groupedGovernmentIntervals} from '../src/data/governmentPresentation.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {pilotLocationsFor,pilotJurisdictionsFor} from '../src/data/locationMapPilot.js';
import {earlyPeopleInventory} from '../src/data/earlyPeopleInventory.js';
import {REINO_COLOR} from '../src/Territorios.jsx';
const read=n=>JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/'+n,import.meta.url)));
const data=read('corridor-locations.json'),partition=read('poland-lithuania-partitions.json');
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const owners=(m,id)=>new Set((m.byLocation.get(id)||[]).map(l=>l.entityId));
const color=(m,id)=>[...new Set((m.byLocation.get(id)||[]).map(l=>l.mosaicColor))];

test('annual Austria integrates every Inner Austrian province in 1800, retaining the 1600 partition',()=>{
 const late=europeMosaicAt(data,1800,PERSONAS),early=europeMosaicAt(data,1600,PERSONAS);
 for(const territory of ['Ducado de Estiria','Carintia','Carniola']){
  const ids=pilotLocationsFor(data,territory,1800);assert(ids.length>10,territory);
  for(const id of ids)assert.deepEqual(color(late,id),[REINO_COLOR.Austria],territory+'/'+id);
 }
 for(const id of ['Graz','Ljubljana','Klagenfurt'])assert.deepEqual(color(early,id),[REINO_COLOR['Austria Interior']],id);
 assert.deepEqual(color(early,'Vienna'),[REINO_COLOR.Austria]);
});
test('Lublin joins the Crown and Grand Duchy in annual maps, personal maps and the ruler table',()=>{
 const before=europeMosaicAt(data,1568,PERSONAS),after=europeMosaicAt(data,1569,PERSONAS);
 assert.notDeepEqual(color(before,'Warsaw'),color(before,'Vilnius'));
 for(const id of ['Warsaw','Vilnius','Gdansk'])assert.deepEqual(color(after,id),[REINO_COLOR['Polonia-Lituania']],id);
 assert.notDeepEqual(color(after,'Konigsberg'),color(after,'Warsaw'));
 const p=by.get('SEGIS2JAG');assert.equal(governmentGroupsAt(p,1569).filter(g=>g.id==='polonia-lituania').length,1);
 assert(governmentGroupsAt(p,1568).some(g=>g.id==='Lituania'));
 const rows=governmentTableAt(PERSONAS,1570);assert(rows.some(r=>r.id==='polonia-lituania'));
 assert(!rows.some(r=>r.id==='Lituania'||r.id==='Polonia'));
 const ids=mapAuthoritiesForPerson(p,1569,data).flatMap(e=>e.ids);assert(ids.includes('Warsaw')&&ids.includes('Vilnius'));
 const cuts=groupedGovernmentIntervals(p);assert(cuts.some(g=>g.id==='polonia-lituania'&&g.from===1569));
});
test('the three partitions assign the recipients without prematurely removing retained provinces',()=>{
 const expected={1772:{Lviv:'Reino de Galicia y Lodomeria',Krakow:'Polonia',Warsaw:'Polonia',Gdansk:'Prusia Real',Torun:'Prusia Real',Poznan:'Polonia',Kamianets_Podilskyi:'Polonia',Daugavpils:'Rusia',Jelgava:'Curlandia'},1793:{Poznan:'Prusia',Gdansk:'Prusia',Torun:'Prusia',Kamianets_Podilskyi:'Rusia',Bila_Tserkva:'Rusia',Warsaw:'Polonia',Krakow:'Polonia',Lutsk:'Polonia'},1795:{Warsaw:'Prusia',Suwalki:'Prusia',Vilnius:'Rusia',Jelgava:'Rusia',Lutsk:'Rusia',Krakow:'Reino de Galicia y Lodomeria',Lublin:'Reino de Galicia y Lodomeria'}};
 for(const [y,cells]of Object.entries(expected)){const m=europeMosaicAt(data,+y,PERSONAS);for(const[id,owner]of Object.entries(cells))assert.deepEqual([...owners(m,id)],[owner],y+'/'+id);}
 const m=europeMosaicAt(data,1800,PERSONAS);assert.deepEqual(color(m,'Krakow'),[REINO_COLOR.Austria]);assert.deepEqual(color(m,'Lviv'),[REINO_COLOR.Austria]);
});
test('every partition cell remains attributed in every year through 1800, with mixed river cells explicit',()=>{
 for(let y=1772;y<=1800;y++){
  const m=europeMosaicAt(data,y,PERSONAS);
  for(const c of partition.cells){const layers=m.byLocation.get(c.id);assert(layers?.length,y+'/'+c.id);if(y>=1795)assert(layers.every(l=>!['Polonia','Lituania','Prusia Real','Curlandia','Livonia polaca'].includes(l.entityId)),y+'/'+c.id);}
 }
 for(const[y,id]of[[1772,'Polotsk'],[1795,'Kaunas'],[1795,'Alytus']]){
  const m=europeMosaicAt(data,y,PERSONAS),layers=m.byLocation.get(id);assert.equal(layers.length,2);assert(layers.every(l=>l.scopes.some(s=>s.condition==='composición geográfica')));
 }
});
test('the medieval inventory distinguishes birth, effective government, later titles and family associations',()=>{
 const inv=earlyPeopleInventory(PERSONAS);assert.equal(inv.length,157);assert.equal(new Set(inv.map(p=>p.id)).size,157);
 assert.equal(inv[0].birth,1081);const louis=inv.find(p=>p.id==='LUIS6FRA');assert(louis.governments.some(g=>g.territory==='Francia'&&g.from===1108));
 const family=inv.find(p=>p.id==='EDUVKYB');assert.equal(family.governments.length,0);assert(family.familyAssociations.includes('Habsburgo'));
 assert.equal(new Set(inv.flatMap(p=>p.governments.map(g=>g.territory))).size,53);
 assert.equal(data.from,1106);assert.equal(data.through,1800);
});
test('pre-1200 maps distinguish dated conquests and the loss of Jerusalem, without future borders',()=>{
 const ids=(id,y,t)=>mapAuthoritiesForPerson(by.get(id),y,data,{includeClaims:true}).filter(e=>!t||e.territory===t).flatMap(e=>e.ids);
 assert(ids('TAIRDELBACHCONN',1106).includes('Roscommon'));
 assert(ids('LUIS6FRA',1108).includes('Paris'));assert(!ids('LUIS6FRA',1108).includes('Calais'));
 assert(!ids('ALF8CAST',1170).includes('Cuenca'));assert(ids('ALF8CAST',1180).includes('Cuenca'));
 assert(!ids('ALF2AR',1164,'Condado de Barcelona').includes('Perpignan'));assert(ids('ALF2AR',1175,'Condado de Barcelona').includes('Perpignan'));
 assert(ids('SANCHO6NAV',1180).includes('Vitoria'));
 assert(ids('BALDWIN4JER',1180).includes('Jerusalem'));assert(!ids('ISABELLA1JER',1195).includes('Jerusalem'));
 assert(ids('ISABELLA1JER',1195).includes('Acre'));
 assert(!ids('LEOP6BAB',1198,'Austria').includes('Pordenone'));
 assert(!ids('VLADHENMOR',1197).includes('Olomouc'));
 assert(ids('SALADIN',1180).includes('Cairo'));assert(!ids('SALADIN',1180).includes('Aleppo'));assert(ids('SALADIN',1185).includes('Aleppo'));
});

test('medieval principalities and the eastern frontier keep their distinct chronology',()=>{
 const cases=[[1200,'Krakow','Ducado de Cracovia'],[1300,'Krakow','Polonia'],[1250,'Warsaw','Mazovia'],[1350,'Minsk','Lituania'],[1568,'Smolensk','Rusia'],[1620,'Smolensk','Lituania'],[1620,'Chernihiv','Polonia'],[1700,'Chernihiv','Hetmanato cosaco'],[1770,'Chernihiv','Rusia'],[1700,'Kyiv','Rusia']];
 for(const[y,id,identity]of cases)assert(owners(europeMosaicAt(data,y,PERSONAS),id).has(identity),y+'/'+id+'/'+identity);
 const m=europeMosaicAt(data,1771,PERSONAS);assert(owners(m,'Kwidzyn').has('Prusia'));assert(!partition.cells.some(c=>c.id==='Kwidzyn'));
});

test('a caller cannot mutate cached routes or borrow another year or person’s scope',()=>{
 const first=pilotJurisdictionsFor('Polonia',1570);const expected=[...first];first.push('invalid');
 assert.deepEqual(pilotJurisdictionsFor('Polonia',1570),expected);
 assert.notDeepEqual(pilotJurisdictionsFor('Lituania',1568),pilotJurisdictionsFor('Lituania',1570));
 assert(!pilotJurisdictionsFor('Baviera',1400,'JUAN2BAV').some(n=>/Landshut/.test(n)));
});
