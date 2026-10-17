import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {HISTORIAS,EVENTOS_HISTORICOS} from '../src/historiaData.jsx';
import {governmentGroupsAt,governmentSummary,groupedGovernmentIntervals} from '../src/data/governmentPresentation.js';
import {governmentTableAt,protagonistsAt,europeMosaicAt} from '../src/data/europePanorama.js';
import {atlasPoliticalMosaicAt} from '../src/data/atlasMosaic.js';
import {COLLECTIVE_AUTHORITIES} from '../src/data/politicalMapIndex.js';
import {colorTerritorioEnMapa} from '../src/Territorios.jsx';
import {buildTimelineRows,layoutTimelineEvents,timelineYearAt} from '../src/explorer/timelineLayout.js';
import {vidaEnAnio} from '../src/data/europeYear.js';
import {sanitizeSession,shouldResumeAtlas} from '../src/explorer/atlasSession.js';
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/burgundian-locations.json',import.meta.url)));

test('Carlos V has one Spanish entity, retains external groups and every constituent mandate',()=>{
 const p=by.get('CARLOS5'),before=JSON.stringify(p);
 const groups=governmentGroupsAt(p,1530),spain=groups.filter(g=>g.label==='España');
 assert.equal(spain.length,1);assert(spain[0].mandates.some(m=>m.territorio==='Navarra'));
 assert(spain[0].mandates.some(m=>m.territorio==='Castilla'));
 assert(!governmentSummary(p,1530).includes('Castilla'));
 assert(groups.some(g=>g.label==='Sacro Imperio (Alemania)'));
 assert(groups.some(g=>g.mandates.some(m=>m.territorio==='Brabante')));
 assert.equal(JSON.stringify(p),before);
 const row=governmentTableAt(PERSONAS,1530).find(g=>g.label==='España');
 assert.equal(row.governments.filter(g=>g.person.id==='CARLOS5').length,1);
});
test('dated grouping does not unify medieval crowns or turn a personal union into one state',()=>{
 assert(!governmentGroupsAt(by.get('CARLOS5'),1515).some(g=>g.label==='España'));
 const p=by.get('FEL2ESP');assert(governmentSummary(p,1590).includes('Portugal'));
 assert(governmentSummary(p,1590).includes('España'));
 const england=PERSONAS.find(p=>p.gobiernos?.some(g=>g.territorio==='Hannover'&&g.desde<=1720&&g.hasta>=1720)&&p.gobiernos.some(g=>g.territorio==='Gran Bretaña'));
 assert(england);const labels=governmentSummary(england,1720);assert(labels.includes('Hannover'));assert(labels.includes('Gran Bretaña'));
});
test('delegated government and institutional authority stay distinct from hereditary sovereignty',()=>{
 const groups=governmentGroupsAt(by.get('MAURICEORANGE'),1600);
 assert(groups.some(g=>g.kind==='delegated'));assert(!groups.filter(g=>g.kind==='delegated').some(g=>g.id==='paises-bajos'));
 const rows=governmentTableAt(PERSONAS,1705,COLLECTIVE_AUTHORITIES);
 assert(rows.some(r=>r.collectives?.some(c=>c.territorio==='Provincias Unidas')));
 for(const row of rows)assert.equal(new Set(row.governments.map(g=>g.person.id)).size,row.governments.length);
});
test('timeline grouped periods cover active authorities without extending them into absent years',()=>{
 const p=by.get('FEL4ESP'),intervals=groupedGovernmentIntervals(p);
 for(let year=1600;year<=1670;year++) {
  const expected=governmentGroupsAt(p,year).map(g=>g.key).sort();
  const actual=intervals.filter(g=>g.from<=year&&year<=g.through).map(g=>g.key).sort();
  assert.deepEqual(actual,expected,year);
 }
});
test('panorama preserves every researched and approximate laboratory cell at representative transitions',()=>{
 for(const year of [1200,1350,1530,1585,1705,1750,1800]){
  const original=atlasPoliticalMosaicAt(data,year),panorama=europeMosaicAt(data,year,PERSONAS);
  assert.deepEqual([...panorama.byLocation.keys()].sort(),[...original.byLocation.keys()].sort(),year);
  assert.deepEqual(panorama.layers.map(l=>[l.name,[...l.ids].sort()]),original.layers.map(l=>[l.name,[...l.ids].sort()]),year);
 }
});
test('Spain uses the personal-map gold while Portugal and republican Netherlands retain their own identity',()=>{
 const year=1585,m=europeMosaicAt(data,year,PERSONAS),p=by.get('FEL2ESP');
 for(const id of ['Madrid','Barcelona','Pamplona'])assert(m.byLocation.get(id)?.every(l=>l.mosaicColor===colorTerritorioEnMapa(p,'Castilla',year)),id);
 assert(m.byLocation.get('Saint_Jean_Pied_de_Port')?.every(l=>l.mosaicColor!==colorTerritorioEnMapa(p,'Castilla',year)));
 assert(m.byLocation.get('Lisbon')?.every(l=>l.mosaicColor!==colorTerritorioEnMapa(p,'Castilla',year)));
 const dutch=europeMosaicAt(data,1705,PERSONAS);assert(dutch.byLocation.get('Amsterdam')?.every(l=>l.mosaicColor==='#C08A38'));
});
test('protagonists come from current story steps/events, excluding people without a documentary life in that year',()=>{
 const people=[{id:'alive',nombre:'Viva',nac:1400,muer:1500},{id:'dead',nombre:'Anterior',nac:1300,muer:1399}];
 const stories=[{id:'story',disponible:true,titulo:'Historia',pasos:[{anio:1450,persona:'alive',personas:['alive','dead']},{anio:1460,persona:'dead'}]}];
 const selected=protagonistsAt(people,1455,stories,[]);assert.deepEqual(selected.map(e=>e.person.id),['alive']);assert.equal(selected[0].stories.length,1);
 assert.equal(protagonistsAt(people,1465,stories,[]).length,0);
 const actual=protagonistsAt(PERSONAS,1530,HISTORIAS,EVENTOS_HISTORICOS.filter(e=>(e.desde??e.anio)<=1530&&1530<=(e.hasta??e.desde??e.anio)));
 assert(actual.length>0);for(const entry of actual){assert(vidaEnAnio(entry.person,1530));assert(entry.reasons.length>0);}
});
test('packed timeline preserves every person exactly once and never collides across labels in a lane',()=>{
 const rows=buildTimelineRows(PERSONAS,3.2),ids=rows.flatMap(r=>(r.people||[]).map(e=>e.person.id));
 assert.equal(ids.length,PERSONAS.length);assert.equal(new Set(ids).size,PERSONAS.length);
 for(const row of rows)for(let i=1;i<(row.people||[]).length;i++)assert(row.people[i-1].end+14<=row.people[i].start);
 assert(rows.length<PERSONAS.length/2);
});
test('event packing and choosing an axis year stay bounded across narrow and wide scales',()=>{
 const events=[{id:'a',anio:1500,titulo:'Un acontecimiento largo'},{id:'b',desde:1500,hasta:1530,titulo:'Un periodo'},{id:'c',anio:1550,titulo:'Otro'}];
 for(const scale of [1.6,14]){const layout=layoutTimelineEvents(events,scale);for(const a of layout.items)for(const b of layout.items)if(a!==b&&a.lane===b.lane)assert(a.start+a.width+10<=b.start||b.start+b.width+10<=a.start);}
 assert.equal(timelineYearAt(-100,3.2,1200,1800),1200);assert.equal(timelineYearAt(99999,3.2,1200,1800),1800);assert.equal(timelineYearAt(960,3.2,1200,1800),1500);
});
test('an explicit Europa scene cannot silently resume a different saved selection',()=>{
 assert.equal(sanitizeSession({version:1,atlasScene:'europa'}).atlasScene,'europa');
 assert.equal(sanitizeSession({version:1,atlasScene:'invalid'}).atlasScene,'atlas');
 assert.equal(shouldResumeAtlas('/es/?atlas=1&continuar=1&escena=europa'),false);
});
