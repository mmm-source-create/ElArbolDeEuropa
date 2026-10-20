import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
import {PERSONAS} from '../src/data/personas.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {colorTerritorioEnMapa,REINO_COLOR} from '../src/cartography/kingdomMaps.js';
import {COLLECTIVE_AUTHORITIES,buildPoliticalMapIndex,inspectMapRegion} from '../src/cartography/politicalMapIndex.js';
import {renderImperialOverlay} from '../src/cartography/imperialOverlay.js';
import {mapAuthoritiesForPerson} from '../src/cartography/mapAuthorities.js';
import {pilotImperialFrameFor} from '../src/cartography/locationMapPilot.js';
import {auditRoyalSuccessions} from '../scripts/audits/audit-royal-successions.mjs';
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../data/cartography/burgundian-locations.json',import.meta.url)));
const cache=new Map(),mosaic=year=>{if(!cache.has(year))cache.set(year,europeMosaicAt(data,year,PERSONAS));return cache.get(year);};
const colors=(year,id)=>[...new Set((mosaic(year).byLocation.get(id)||[]).map(l=>l.mosaicColor))];

test('Matthias succeeds Rudolf in 1611 without deleting either last-year title or provincial scope',()=>{
 for(const id of ['Prague','Brno','Wroclaw'])assert.deepEqual(colors(1611,id),colors(1611,'Vienna'));
 assert(mosaic(1611).byLocation.get('Wroclaw')[0].candidates.some(g=>g.personId==='RODOLFO2HRE'));
 assert.notDeepEqual(colors(1610,'Wroclaw'),colors(1610,'Vienna'));
});
test('dated medieval unions join in the common map; transient personal unions keep their crowns apart in personal maps',()=>{
 for(const [year,ids] of [[1270,['Prague','Brno','Vienna']],[1375,['Krakow','Buda']],[1443,['Krakow','Buda']],[1447,['Vienna','Buda']],[1454,['Prague','Vienna','Buda']],[1480,['Buda','Brno','Wroclaw']],[1500,['Prague','Buda']]])
  for(const id of ids.slice(1))assert.deepEqual(colors(year,id),colors(year,ids[0]),`${year}/${id}`);
 assert.notDeepEqual(colors(1480,'Prague'),colors(1480,'Buda'),'Corvinus cannot acquire Prague through his rival royal title');
 assert.notDeepEqual(colors(1447,'Prague'),colors(1447,'Buda'),'Bohemia is still in its interregnum');
 for(const [person,territories,year] of [['OTAK2',['Bohemia','Moravia'],1270],['LUIS1',['Polonia','Hungría'],1375]])
  assert.notEqual(colorTerritorioEnMapa(by.get(person),territories[0],year),colorTerritorioEnMapa(by.get(person),territories[1],year));
 // The Bourbon crowns, ruled together from Naples, share their personal colour too.
 assert.equal(colorTerritorioEnMapa(by.get('CARLOS3ESP'),'Nápoles',1750),colorTerritorioEnMapa(by.get('CARLOS3ESP'),'Trinacria',1750));
});
test('Prussian blue never transfers Royal Prussia or Warmia to the Great Elector',()=>{
 assert.deepEqual(colors(1660,'Berlin'),[REINO_COLOR.Prusia]);
 assert.deepEqual(colors(1660,'Konigsberg'),colors(1660,'Berlin'));
 assert.notDeepEqual(colors(1660,'Gdansk'),colors(1660,'Berlin'));
 assert.notDeepEqual(colors(1660,'Olsztyn'),colors(1660,'Berlin'));
 assert(mosaic(1640).byLocation.get('Konigsberg').some(l=>l.tributaryRelation),'Polish suzerainty survives until 1657');
});
test('Bourbon Naples and Sicily share exterior colour, retaining separate kingdoms and the 1799 republic',()=>{
 for(const y of [1750,1770])assert.deepEqual(colors(y,'Naples'),colors(y,'Palermo'));
 assert.notDeepEqual(colors(1799,'Naples'),colors(1799,'Palermo'));
 assert.notEqual(REINO_COLOR.Venecia,REINO_COLOR['Imperio otomano']);
 assert.deepEqual(colors(1750,'Rome'),['#C9C6AE']);
});
test('Anjou in 1582 follows the renewed French appanage instead of an independent red principality',()=>{
 const layer=mosaic(1582).byLocation.get('Angers')[0];
 assert.equal(layer.crownRelation?.type,'apanage');assert.notEqual(layer.mosaicColor,REINO_COLOR.Anjou);
 assert.equal(mosaic(1585).byLocation.get('Angers')[0].crownRelation,null);
});
test('Frederick’s Austrian title respects the partition and cannot give him occupied Vienna',()=>{
 const ids=year=>mapAuthoritiesForPerson(by.get('FED3HAB'),year,data).filter(e=>e.territory==='Austria').flatMap(e=>e.ids);
 assert(!ids(1460).includes('Steyr'));
 assert(!ids(1486).includes('Vienna'));
 assert(ids(1486).includes('Steyr'));
 assert(ids(1492).includes('Vienna'));
});
test('the Bohemian interregnum is inspectable in 1447 and ends before the 1453 coronation',()=>{
 const entry=COLLECTIVE_AUTHORITIES.find(c=>c.territorio==='Bohemia'&&c.desde===1440);
 assert(entry&&entry.hasta===1452&&entry.fuente.url);
 const index=buildPoliticalMapIndex(PERSONAS,1447,data,{includeClaims:true,includeDependencies:true});
 const context=inspectMapRegion('Prague',1447,index,data);
 assert(JSON.stringify(context).includes('Interregno de Bohemia'));
});
test('royal succession register covers 22 series, detects missing brief reigns and missing assigned titles',()=>{
 const report=auditRoyalSuccessions();assert.deepEqual(report.errors,[]);assert.equal(report.crowns,22);assert(report.offices>650);
 for(const id of ['JUAN1FRA','FEODOR2GODUNOV','JUANA2NAP','GUTTORMNOR'])
  assert(auditRoyalSuccessions(PERSONAS.filter(p=>p.id!==id)).errors.some(e=>e.includes(id)));
 const changed=PERSONAS.map(p=>p.id==='LUIS1'?{...p,gobiernos:p.gobiernos.filter(g=>g.territorio!=='Polonia')}:p);
 assert(auditRoyalSuccessions(changed).errors.some(e=>e.includes('LUIS1')));
});
test('imperial overlay stays above original paint, leaves patterns and coordinates untouched and removes cleanly',()=>{
 const dom=new JSDOM('<svg xmlns="http://www.w3.org/2000/svg"><defs/><g transform="translate(3 4)"><path id="Vienna" d="M0 0L1 1" style="fill:url(#occupation);stroke:red"/></g></svg>',{contentType:'image/svg+xml'});
 const svg=dom.window.document.documentElement,original=svg.querySelector('#Vienna'),before=original.outerHTML;
 renderImperialOverlay(svg,['Vienna','Vienna'],id=>svg.querySelector('#'+id));
 const overlay=svg.lastElementChild;assert(overlay.hasAttribute('data-imperial-overlay'));assert.equal(overlay.getAttribute('pointer-events'),'none');
 assert.equal(overlay.querySelectorAll('path').length,1);assert.equal(svg.querySelectorAll('#Vienna').length,1);
 assert.equal(overlay.firstElementChild.getAttribute('transform'),'translate(3 4)');assert.equal(original.outerHTML,before);
 renderImperialOverlay(svg,[],()=>null);assert(!svg.querySelector('[data-imperial-overlay]'));assert.equal(original.outerHTML,before);
 assert(pilotImperialFrameFor(data,1582).includes('Vienna'));
 assert(!pilotImperialFrameFor(data,1582).includes('Konigsberg'));
 const frame1447=pilotImperialFrameFor(data,1447);
 assert(frame1447.includes('Vienna')&&frame1447.includes('Aix_En_Provence'),'the medieval frame uses its own dated blocks');
 assert(frame1447.includes('Wroclaw'),'Silesia belongs to the Bohemian crown since 1335');
 assert(!frame1447.includes('Verona')&&!frame1447.includes('Buda'),'Venetian Terraferma and Hungary stay outside');
});
