import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {institutionalPolityAt,ORDER_MALTA_COLOR,FORELANDS_TYROL_COLOR,TEUTONIC_ORDER_COLOR} from '../src/cartography/institutionalPolities638.js';
import {TRIBUTARY_RELATIONS} from '../src/cartography/tributaryRelations.js';
import {tributaryColor,ENGLISH_CROWN_COLOR} from '../src/cartography/mapColors.js';
import {authorityPatternSpec} from '../src/features/atlas/authorityPatterns.js';
import {englishNote,englishLabel} from '../src/features/english/v6/atlasPresentation.js';
import {CLAIM_REVIEWS} from '../src/evidence/reviewRecords.js';
import {treeSvg} from '../src/features/connections/treeExport.js';
const data=JSON.parse(fs.readFileSync('data/cartography/corridor-locations.json'));data.burgundy=JSON.parse(fs.readFileSync('data/cartography/burgundian-locations.json'));
const cache=new Map(),at=y=>{if(!cache.has(y))cache.set(y,europeMosaicAt(data,y,PERSONAS));return cache.get(y);};
const rows=(y,id)=>at(y).byLocation.get(id)||[],colors=(y,id)=>[...new Set(rows(y,id).map(r=>r.mosaicColor))];
const people=new Map(PERSONAS.map(p=>[p.id,p]));
test('638: Albert has a documented delegated Portuguese viceroyalty, alongside Spanish royal authority',()=>{
 const p=people.get('ALB7AUST'),g=p.gobiernos.find(g=>g.territorio==='Portugal');
 assert.deepEqual([g.desde,g.hasta,g.titulo,g.condicion,g.soberano],[1583,1593,'Virrey','gobierno delegado','FEL2ESP']);
 assert(CLAIM_REVIEWS['person:ALB7AUST:government:Portugal:1583:1593:Virrey'].sources.some(s=>s.url.includes('pares.cultura.gob.es')));
 assert(p.gobiernos.some(g=>g.territorio==='Países Bajos'&&g.desde===1598&&g.titulo==='Soberano'));
});
test('638: archducal Netherlands, Burgundy and Charolais share Spanish foreign-policy colour without Spanish sovereign titles',()=>{
 for(const year of [1599,1600,1610,1620])for(const id of ['Brussels','Dole','Charolles','Tournai'])assert.deepEqual(colors(year,id),colors(year,'Madrid'),`${year} ${id}`);
 assert(rows(1600,'Brussels').some(r=>r.candidates.some(c=>c.personId==='ALB7AUST')));
 assert(!rows(1600,'Brussels').some(r=>r.candidates.some(c=>c.personId==='FEL3ESP')));
});
test('638: Sicily follows Savoy from 1713; Sardinia follows from 1720, while Corsica remains separate',()=>{
 for(const year of [1713,1714,1717])assert.deepEqual(colors(year,'Palermo'),colors(year,'Turin'),String(year));
 assert.notDeepEqual(colors(1712,'Palermo'),colors(1712,'Turin'));
 for(const year of [1721,1730]){assert.deepEqual(colors(year,'Cagliari'),colors(year,'Turin'));assert.notDeepEqual(colors(year,'Ajaccio'),colors(year,'Turin'));assert.notDeepEqual(colors(year,'Palermo'),colors(year,'Turin'));}
});
test('638: Hospitaller Malta and Tripoli are one dated polity, with no annexation of Ottoman Tripoli',()=>{
 for(const year of [1530,1540,1550]){assert.deepEqual(colors(year,'Malta'),[ORDER_MALTA_COLOR]);assert.deepEqual(colors(year,'Tripoli'),[ORDER_MALTA_COLOR]);}
 for(const year of [1551,1600])assert.notDeepEqual(colors(year,'Tripoli'),[ORDER_MALTA_COLOR]);
 assert.notDeepEqual(colors(1798,'Malta'),[ORDER_MALTA_COLOR]);
});
test('638: Teutonic Prussia and the Livonian branch share early order colour, excluding episcopal states and later secular Prussia',()=>{
 assert.deepEqual(colors(1393,'Aizkraukle'),[TEUTONIC_ORDER_COLOR]);assert.deepEqual(colors(1393,'Memel'),[TEUTONIC_ORDER_COLOR]);
 assert.notDeepEqual(colors(1393,'Riga'),[TEUTONIC_ORDER_COLOR]);
 assert.equal(institutionalPolityAt('Orden de Livonia',1410),null);
 assert.equal(institutionalPolityAt('Orden de Livonia',1525),null);
 assert(!TRIBUTARY_RELATIONS.some(r=>r.subject==='Orden de Livonia'&&r.overlord==='Prusia'));
});
test('638: Forelands rulers reach the Alsatian and German routes, but not lost or occupied cells',()=>{
 for(const [y,id] of [[1540,'FERN1EMP'],[1585,'FERN2TIROL'],[1632,'FERNKARLTIROL'],[1714,'CARLOS6HRE']])for(const location of ['Freiburg','Waldshut','Gunzburg'])assert(rows(y,location).some(r=>r.candidates.some(c=>c.personId===id)),`${y} ${location} ${id}`);
 assert.deepEqual(colors(1585,'Ensisheim'),[FORELANDS_TYROL_COLOR]);
 assert(rows(1585,'Ensisheim').some(r=>r.candidates.some(c=>c.personId==='FERN2TIROL')));
 assert(rows(1638,'Ensisheim').every(r=>!r.candidates.some(c=>c.ids.has('Ensisheim')&&c.personId==='FERNKARLTIROL')));
 assert.match(rows(1638,'Ensisheim')[0].displayName,/control disputado/);
 assert.deepEqual(colors(1714,'Freiburg'),[REINO_COLOR.Austria]);assert.deepEqual(colors(1714,'Ensisheim'),[REINO_COLOR.Francia]);
});
test('638: Jogaila’s union includes Jadwiga and Vytautas without removing them from the inspector',()=>{
 assert.deepEqual(colors(1393,'Krakow'),colors(1393,'Vilnius'));
 assert(rows(1393,'Krakow').some(r=>r.candidates.some(c=>c.personId==='EDUV1')));
 assert(rows(1393,'Vilnius').some(r=>r.candidates.some(c=>c.personId==='VYTAUTASLIT')));
 assert.notDeepEqual(colors(1495,'Krakow'),colors(1495,'Vilnius'));
});
test('638: Horde tributaries keep ochre in their dotted pattern, rather than a pale wash',()=>{
 const r=TRIBUTARY_RELATIONS.find(r=>r.id==='kyiv-horde'),color=tributaryColor(r,1300);
 const spec=authorityPatternSpec([color],'tributary');
 const wash=spec.shapes.find(s=>s.fill==='#fff');
 const rgb=color.slice(1).match(/../g).map(x=>parseInt(x,16));const opacity=Number(wash['fill-opacity']);
 assert(rgb.every(x=>x*(1-opacity)+255*opacity<210));assert(spec.shapes.some(s=>s.name==='circle'));
});
test('638: Brittany has the English brown during the documented Angevin years, not during later alliances',()=>{
 assert.deepEqual(colors(1200,'Rennes'),[ENGLISH_CROWN_COLOR]);assert.deepEqual(colors(1201,'Rennes'),[ENGLISH_CROWN_COLOR]);
 assert.equal(rows(1202,'Rennes')[0].tributaryRelation,null);assert.equal(rows(1372,'Rennes')[0].tributaryRelation,null);
});
test('638: Holstein has no imperial dependency hatch; Schleswig retains its Danish fief and common ducal colour',()=>{
 assert(!TRIBUTARY_RELATIONS.some(r=>r.id==='holstein-empire'));
 assert.equal(rows(1638,'Kiel')[0].tributaryRelation,null);assert.equal(rows(1638,'Slesvig')[0].tributaryRelation?.overlord,'Dinamarca');
 assert.deepEqual(colors(1638,'Kiel'),colors(1638,'Slesvig'));assert.deepEqual(colors(1773,'Kiel'),[REINO_COLOR.Dinamarca]);
});
test('638: reviewed papal fiefs keep their local dukes and stop before direct annexation',()=>{
 for(const [id,subject,end] of [['ferrara-papacy','Ferrara',1597],['urbino-papacy','Urbino',1623]]){
  const r=TRIBUTARY_RELATIONS.find(r=>r.id===id);assert.equal(r.subject,subject);assert.equal(r.overlord,'Estados Pontificios');assert(r.periods.some(([a,b])=>a<=1594&&b===end));assert(r.sources.every(s=>s.locator&&s.locatorEn));
  assert.notEqual(englishNote(r.note),r.note);
 }
});
test('638: institutional labels are bilingual and papal exports include succession without changing family edges',()=>{
 assert.equal(englishLabel('Orden de San Juan'),'Order of Saint John');
 const p=['PAPA_LEON10','PAPA_ADRIANO6','PAPA_CLEMENTE7'].map(id=>people.get(id));
 const exported=treeSvg({people:p,edges:[],gen:{},locale:'en'});
 assert.match(exported.svg,/Papal succession: gold dashes/);assert.equal((exported.svg.match(/stroke="#9B8246"/g)||[]).length,2);
 assert.doesNotMatch(treeSvg({people:p,edges:[],papalColumn:false}).svg,/stroke="#9B8246"/);
});
test('638: territory-name inventory is reproducible and includes adjectives and distant Hospitaller possessions',()=>{
 const report=JSON.parse(fs.readFileSync('docs/reviews/6.3.8-territory-names.json'));
 assert.equal(report.count,report.rows.length);assert(report.rows.some(r=>r.name==='Dalmacia austríaca'&&r.mentions.some(m=>m.territory==='Austria')));
 assert(report.rows.some(r=>r.name==='Trípoli de los caballeros de Malta'&&r.mentions.some(m=>m.territory==='Malta')));
});

import {mosaicAuthorityKind} from '../src/cartography/mosaicAuthorityKind.js';
import {buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
test('638: archducal dependency is yellow and vertically patterned, with its own sovereigns and specific military sources',()=>{
 for(const year of [1599,1600,1610,1620])for(const id of ['Brussels','Dole','Tournai','Charolles']) {
  const entries=rows(year,id);assert(entries.some(r=>r.tributaryRelation?.type==='dependencia'),`${year} ${id}`);
  assert.equal(mosaicAuthorityKind(entries),'dependency');assert.deepEqual(colors(year,id),[REINO_COLOR.España]);
 }
 for(const [year,id] of [[1600,'Amsterdam'],[1600,'Cambrai'],[1602,'Cuijk'],[1622,'Brussels']])assert(rows(year,id).every(r=>r.tributaryRelation?.id!=='archducal-spanish-dependency'),`${year} ${id}`);
 const cell=inspectMapRegion('Brussels',1600,buildPoliticalMapIndex(PERSONAS,1600,data),data);
 const relationship=cell.entries.find(e=>e.relationship?.id==='archducal-spanish-dependency');
 assert.equal(relationship.kind,'dependency');assert.match(englishNote(relationship.relationship.note),/dynastic and military/);
 assert(relationship.mapSources.some(s=>s.url.includes('tile.loc.gov')));
 for(const id of ['ALB7AUST','ISABCLARAEUG'])for(const location of ['Tournai','Brussels','Dole'])assert(mapAuthoritiesForPerson(people.get(id),1600,data).some(e=>e.ids.includes(location)&&e.dependencyPattern),`${id} ${location}`);
 assert(authorityPatternSpec([REINO_COLOR.España],'dependency').shapes.some(s=>s.name==='path'));
});
test('638: institutional colours and occupation labels have their own evidence in the inspector',()=>{
 const cell=inspectMapRegion('Ensisheim',1638,buildPoliticalMapIndex(PERSONAS,1638,data),data);
 const institution=cell.entries.find(e=>e.institution?.id==='ocupacion-weimar-alsacia');assert(institution);
 assert(institution.mapSources.some(s=>s.url.includes('archives68.alsace.eu')));assert.equal(institution.person,null);
 assert.equal(mosaicAuthorityKind(rows(1638,'Ensisheim')),'disputed');
 assert.notEqual(englishLabel(institution.territory),institution.territory);
});

test('638: recovered Lingen and Oldenzaal join only in their documented years',()=>{
 for(const year of [1605,1610,1620])for(const id of ['Lingen','Oldenzaal']) {
  assert(rows(year,id).some(r=>r.candidates.some(c=>c.ids.has(id)&&c.personId==='ALB7AUST')),`${year} ${id}`);
  assert(rows(year,id).some(r=>r.tributaryRelation?.id==='archducal-spanish-dependency'),`${year} ${id}`);
  assert.equal(mosaicAuthorityKind(rows(year,id)),'dependency',`${year} ${id}`);
 }
 for(const id of ['Lingen','Oldenzaal'])assert(rows(1604,id).every(r=>r.tributaryRelation?.id!=='archducal-spanish-dependency'),id);
 assert.deepEqual(colors(1622,'Lingen'),[REINO_COLOR.España]);
 assert(rows(1622,'Lingen').every(r=>!r.candidates.some(c=>c.ids.has('Lingen')&&c.personId==='ALB7AUST')));
});
