import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {governmentGroupsAt} from '../src/domain/government/governmentPresentation.js';
import {REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {ORANGE_NASSAU} from '../src/cartography/mapColors.js';
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));data.burgundy=JSON.parse(fs.readFileSync('data/cartography/burgundian-locations.json'));
const people=new Map(PERSONAS.map(p=>[p.id,p])),cache=new Map();
const at=y=>{if(!cache.has(y))cache.set(y,europeMosaicAt(data,y,PERSONAS));return cache.get(y);};
const rows=(y,id)=>at(y).byLocation.get(id)||[];
const colors=(y,id)=>[...new Set(rows(y,id).map(r=>r.mosaicColor))];
const group=(id,y)=>governmentGroupsAt(people.get(id),y,{view:'panorama'});
test('637.01: Cambrai follows the Spanish crown from 1595; the joint archducal inheritance stays together',()=>{
 assert.notDeepEqual(colors(1594,'Cambrai'),colors(1594,'Madrid'));
 for(const y of [1595,1596,1600,1622])assert.deepEqual(colors(y,'Cambrai'),colors(y,'Madrid'),String(y));
 for(const y of [1599,1600,1610,1620])assert.deepEqual(colors(y,'Brussels'),colors(y,'Dole'),String(y));
 assert.notDeepEqual(colors(1600,'Brussels'),colors(1600,'Madrid'));
 assert.deepEqual([...new Set(rows(1600,'Cambrai').flatMap(r=>r.candidates.map(c=>c.personId)))],['FEL3ESP']);
});
test('637.02: Cuijk follows the dated changes of control, including 1602 rather than waiting until 1648',()=>{
 for(const y of [1576,1586])assert.deepEqual(colors(y,'Cuijk'),colors(y,'Madrid'),String(y));
 assert.deepEqual(colors(1600,'Cuijk'),colors(1600,'Brussels'));
 for(const y of [1577,1602,1648])assert.deepEqual(colors(y,'Cuijk'),[ORANGE_NASSAU],String(y));
});
test('637.03: African Castilian outposts change palette in 1516, without anticipating their conquests',()=>{
 for(const [id,year] of [['Melilla',1497],['Oran',1509]]){
  assert.deepEqual(colors(year,id),[REINO_COLOR.Castilla],id);
  assert.deepEqual(colors(1515,id),[REINO_COLOR.Castilla],id);
  assert.deepEqual(colors(1516,id),[REINO_COLOR.España],id);
 }
 assert.notDeepEqual(colors(1496,'Melilla'),[REINO_COLOR.Castilla]);
});
test('637.04: Henry III keeps the formal dates, while effective government and later claims are separate',()=>{
 const p=people.get('ENRIQ3FRA');
 for(const t of ['Polonia','Lituania']){
  const reign=p.gobiernos.find(g=>g.territorio===t&&g.desde===1573);assert.equal(reign.hasta,1575);assert.equal(reign.ejercicioHasta,1574);assert.match(reign.nota,/18 al 19 de junio/);
  assert(p.gobiernos.some(g=>g.territorio===t&&g.desde===1575&&g.hasta===1589&&g.condicion==='pretensión'));
 }
 assert.notDeepEqual(colors(1574,'Paris'),colors(1574,'Krakow'));
 assert(!group('ENRIQ3FRA',1575).some(g=>g.mandates.some(m=>['Polonia','Lituania'].includes(m.territorio))));
});
test('637.05: Savoy keeps its swatch when Victor Amadeus receives Sicily, then Sardinia',()=>{
 for(let y=1709;y<=1721;y++){
  const groups=group('VICTORAMADEO2SAB',y);
  assert(groups.filter(g=>g.kind==='sovereign').every(g=>g.color===REINO_COLOR.Saboya),String(y));
 }
 assert.deepEqual(colors(1714,'Turin'),[REINO_COLOR.Saboya]);
 assert.deepEqual(colors(1721,'Turin'),[REINO_COLOR.Saboya]);
 assert(!group('FEL2ESP',1585).some(g=>g.id==='saboya'),'The two island titles alone cannot create a Savoyard polity');
});
test('637.06: the Protectorate uses England’s swatch rather than alphabetical Scottish priority',()=>{
 for(const y of [1653,1655,1658])assert(group('OLIVERCROMWELL',y).filter(g=>g.kind==='sovereign').every(g=>g.color===REINO_COLOR.Inglaterra),String(y));
 assert.deepEqual(colors(1655,'London'),[REINO_COLOR.Inglaterra]);
 assert.deepEqual(colors(1603,'London'),colors(1603,'Edinburgh'));
});
test('637.07: the British swatch is separated from Danish red',()=>{
 const rgb=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16));const a=rgb(REINO_COLOR['Gran Bretaña']),b=rgb(REINO_COLOR.Dinamarca);
 assert(Math.hypot(...a.map((x,i)=>x-b[i]))>40);
 assert.deepEqual(colors(1714,'London'),[REINO_COLOR['Gran Bretaña']]);
});
test('637.08: Saxony has one electoral layer after 1547, retaining earlier separate duchies',()=>{
 for(const id of ['Dresden','Chemnitz','Leipzig','Annaburg','Schweinitz']){
  assert.equal(rows(1638,id).length,1,id);assert.equal(rows(1638,id)[0].entityId,'Sajonia',id);assert.deepEqual(colors(1638,id),[REINO_COLOR.Sajonia],id);
 }
 assert(rows(1530,'Dresden').some(r=>r.entityId==='Sajonia albertina'));
});
test('637.09: the Austrian Forelands have their Tyrolean ruler and regent in 1638',()=>{
 for(const id of ['Freiburg','Waldshut','Gunzburg']){
  const r=rows(1638,id);assert(r.some(r=>r.candidates.some(c=>c.personId==='FERNKARLTIROL')),id);
  assert.deepEqual(colors(1638,id),colors(1638,'Innsbruck'),id);
 }
 assert(people.get('CLAUDIA_MEDICI').gobiernos.some(g=>g.territorio==='Austria Anterior'&&g.soberano==='FERNKARLTIROL'));
 assert.notDeepEqual(colors(1638,'Innsbruck'),colors(1638,'Vienna'));
});
test('637.10: Looz integrates with Liège from 1366, with its county identity preserved',()=>{
 assert.notDeepEqual(colors(1365,'Borgloon'),colors(1365,'Liege'));
 for(const y of [1366,1367,1500,1638])for(const id of ['Borgloon','Bree','Hasselt'])assert.deepEqual(colors(y,id),colors(y,'Liege'),id+'/'+y);
 assert.equal(rows(1366,'Borgloon')[0].entityId,'Looz');
});
test('637.11: Cologne is under the archbishop before Worringen, separate after 1288',()=>{
 assert.equal(rows(1287,'Cologne')[0].entityId,'Electorado de Colonia');
 assert.deepEqual(colors(1287,'Cologne'),colors(1287,'Bonn'));
 assert.equal(rows(1288,'Cologne')[0].entityId,'Ciudad libre de Colonia');
 assert.notDeepEqual(colors(1288,'Cologne'),colors(1288,'Bonn'));
});
test('637.12: Mongol dependencies retain dated interruptions and the local polity',()=>{
 assert.equal(rows(1241,'Kyiv')[0].tributaryRelation?.id,'kyiv-horde');
 assert.equal(rows(1362,'Kyiv')[0].tributaryRelation,null);
 for(const y of [1246,1251,1259,1299])assert.equal(rows(y,'Lviv')[0].tributaryRelation?.id,'galicia-volhynia-horde',String(y));
 for(const y of [1245,1252,1258,1301])assert.equal(rows(y,'Lviv')[0].tributaryRelation,null,String(y));
 assert.equal(rows(1479,'Moscow')[0].tributaryRelation?.id,'moscow-horde');
 assert.equal(rows(1480,'Moscow')[0].tributaryRelation,null);
 assert.equal(rows(1258,'Novgorod')[0].tributaryRelation,null);
 assert.equal(rows(1259,'Novgorod')[0].tributaryRelation?.id,'novgorod-horde');
 assert.equal(rows(1456,'Novgorod')[0].tributaryRelation?.id,'novgorod-moscow');
});
test('637.13: Charolais stays Habsburg until the Condé award, with the documented wartime confiscation',()=>{
 assert.deepEqual(colors(1600,'Charolles'),colors(1600,'Brussels'));
 assert.equal(rows(1632,'Charolles')[0].politicalGroup,'charolais-archducal');
 assert.deepEqual(colors(1632,'Charolles'),['#8E295C']);
 for(const y of [1673,1679,1683])assert.deepEqual(colors(y,'Charolles'),colors(y,'Madrid'),String(y));
 for(const y of [1674,1678])assert.deepEqual(colors(y,'Charolles'),colors(y,'Paris'),String(y));
 assert.notDeepEqual(colors(1684,'Charolles'),colors(1684,'Madrid'));
 assert(rows(1760,'Charolles')[0].crownRelation);assert.equal(rows(1761,'Charolles')[0].crownRelation,null);
});
test('637.14: French suzerainty is a pattern, not a French foreign-policy colour for Charles V’s Flanders',()=>{
 assert.deepEqual(colors(1523,'Bruges'),colors(1523,'Madrid'));
 assert.equal(rows(1523,'Bruges')[0].crownRelation?.type,'feudo');
 assert.equal(rows(1530,'Bruges')[0].crownRelation,null);
});
test('637.15: the associated duchies keep distinct feudal overlords and a dated common colour',()=>{
 for(const y of [1460,1500,1600,1638])assert.deepEqual(colors(y,'Slesvig'),colors(y,'Kiel'),String(y));
 assert.equal(rows(1638,'Slesvig')[0].tributaryRelation?.overlord,'Dinamarca');
 assert.equal(rows(1638,'Kiel')[0].tributaryRelation?.overlord,'Sacro Imperio');
 assert.equal(rows(1658,'Slesvig')[0].tributaryRelation,null);
 assert.equal(rows(1773,'Kiel')[0].tributaryRelation?.overlord,'Sacro Imperio');
 assert.deepEqual(colors(1773,'Kiel'),[REINO_COLOR.Dinamarca]);
});
test('637.16: Danish suzerainty over Rügen survives its inheritance, without spreading across Wolgast',()=>{
 assert.equal(rows(1226,'Wolgast')[0].tributaryRelation?.id,'pomerania-denmark');
 assert.equal(rows(1227,'Wolgast')[0].tributaryRelation,null);
 for(const y of [1324,1325,1400,1437])assert.equal(rows(y,'Rugen')[0].tributaryRelation?.id,'rugen-denmark',String(y));
 assert.equal(rows(1400,'Wolgast')[0].tributaryRelation,null);
 assert.equal(rows(1438,'Rugen')[0].tributaryRelation,null);
});

import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {englishNote} from '../src/features/english/v6/atlasPresentation.js';
test('637: dependencies without a registered khan retain visible institutional authority and bilingual sources',()=>{
 const inspected=inspectMapRegion('Kyiv',1300,buildPoliticalMapIndex(PERSONAS,1300,data),data);
 const entry=inspected.entries.find(e=>e.relationship?.id==='kyiv-horde');
 assert(entry);assert.equal(entry.person,null);assert.equal(entry.collective.nombre,'Horda de Oro');
 assert.notEqual(englishNote(entry.mapNote),entry.mapNote);assert(entry.mapSources.every(s=>s.locatorEn));
});
import {originalPreservationMap} from '../scripts/audits/audit-germany-completion.mjs';
test('637: the Saxon preservation exception accepts only the documented cell and expected attribution',()=>{
 const correction=JSON.parse(fs.readFileSync('data/cartography/germany-completion-preservation-corrections.json')).find(c=>c.locationId==='Dresden'&&c.id.startsWith('saxony-637-'));
 assert(correction);const map=new Map([['Dresden',[{entityId:'Sajonia'}]]]);
 assert.deepEqual(originalPreservationMap(map,1638,[correction]).get('Dresden').map(l=>l.entityId),correction.previous);
 assert.throws(()=>originalPreservationMap(new Map([['Dresden',[{entityId:'Baviera'}]]]),1638,[correction]),/Unexpected preservation correction/);
});
