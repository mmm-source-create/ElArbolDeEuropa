import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/data/personas.js';
import {agrupacionesPoliticasEnMapa,colorTerritorioEnMapa,politicalGroupingReview} from '../src/cartography/kingdomMaps.js';
import {governmentGroupsAt,groupedGovernmentIntervals} from '../src/domain/government/governmentPresentation.js';
import {atlasPoliticalMosaicAt} from '../src/cartography/atlasMosaic.js';
import {europeMosaicAt} from '../src/cartography/europePanorama.js';
import {governmentTableAt} from '../src/cartography/europePanorama.js';
import {governmentRegion} from '../src/features/atlas/EuropeGovernments.jsx';
import {FILTER_REGIONS} from '../src/domain/filters/filterRegions.js';
import {MAP_READING_GUIDE} from '../src/content/mapReadingGuide.js';
import {auditPoliticalUnions} from '../scripts/audits/audit-political-unions.mjs';
const by=new Map(PERSONAS.map(p=>[p.id,p]));
const data=JSON.parse(fs.readFileSync(new URL('../data/cartography/corridor-locations.json',import.meta.url)));
data.burgundy=JSON.parse(fs.readFileSync(new URL('../data/cartography/burgundian-locations.json',import.meta.url)));
const cache=new Map(),mosaic=y=>{if(!cache.has(y))cache.set(y,europeMosaicAt(data,y,PERSONAS));return cache.get(y);};
const colors=(y,id)=>[...new Set((mosaic(y).byLocation.get(id)||[]).map(l=>l.mosaicColor))];
const groups=(id,y,view='panorama')=>agrupacionesPoliticasEnMapa(by.get(id),y,{view});

test('all registered rules have a dated, sourced classification; active memberships are checked for all 601 years',()=>{
 const report=auditPoliticalUnions();assert.equal(report.years,601);assert(report.rules>=21);assert(report.memberships>10000);
 assert.equal(report.rules,politicalGroupingReview().length);
});
test('Iberian union and effective Spanish Netherlands join externally, leaving Portugal separate before and after and provinces inspectable',()=>{
 for(const y of [1585,1650])assert.deepEqual(colors(y,'Madrid'),colors(y,'Brussels'));
 assert.deepEqual(colors(1585,'Lisbon'),colors(1585,'Madrid'));
 for(const y of [1579,1641])assert.notDeepEqual(colors(y,'Lisbon'),colors(y,'Madrid'));
 assert.notDeepEqual(colors(1585,'Amsterdam'),colors(1585,'Brussels'));
 assert.notDeepEqual(colors(1610,'Brussels'),colors(1610,'Madrid'),'archducal government is not inherited by Philip III');
 const p=by.get('FEL2ESP');assert.notEqual(colorTerritorioEnMapa(p,'Portugal',1585),colorTerritorioEnMapa(p,'Castilla',1585));
 assert.notEqual(colorTerritorioEnMapa(p,'Aragón',1585),colorTerritorioEnMapa(p,'Valencia',1585));
 assert.equal(mosaic(1585).byLocation.get('Brussels')[0].entityId,'Brabante');
});
test('Austrian exterior unity respects partitions, junior co-kings, Ottoman control and Spanish branch',()=>{
 for(const y of [1540,1650,1720,1750])assert.deepEqual(colors(y,'Vienna'),colors(y,'Prague'),String(y));
 assert.deepEqual(colors(1720,'Vienna'),colors(1720,'Buda'));
 assert.deepEqual(colors(1720,'Vienna'),colors(1720,'Brussels'));
 assert.notDeepEqual(colors(1585,'Vienna'),colors(1585,'Buda'));
 assert.notDeepEqual(colors(1585,'Vienna'),colors(1585,'Innsbruck'),'Tyrolean branch has its own government');
 assert.notDeepEqual(colors(1585,'Vienna'),colors(1585,'Madrid'));
 assert(!groups('FERN1EMP',1540).flatMap(g=>[...g.territorios]).some(t=>['Alemania','Sacro Imperio'].includes(t)));
});
test('personal integration changes at its recorded date, preserves Navarra and Hungary and splits timeline intervals',()=>{
 const p=by.get('FEL5ESP');
 for(const [territory,year] of [['Aragón',1707],['Valencia',1707],['Mallorca',1715],['Condado de Barcelona',1716]]){
  assert.notEqual(colorTerritorioEnMapa(p,territory,year-1),colorTerritorioEnMapa(p,'Castilla',year-1),territory);
  assert.equal(colorTerritorioEnMapa(p,territory,year),colorTerritorioEnMapa(p,'Castilla',year),territory);
 }
 assert.notEqual(colorTerritorioEnMapa(p,'Navarra',1720),colorTerritorioEnMapa(p,'Castilla',1720));
 const mt=by.get('MARIATERESAHAB');
 assert.notEqual(colorTerritorioEnMapa(mt,'Bohemia',1748),colorTerritorioEnMapa(mt,'Austria',1748));
 assert.equal(colorTerritorioEnMapa(mt,'Bohemia',1749),colorTerritorioEnMapa(mt,'Austria',1749));
 assert.notEqual(colorTerritorioEnMapa(mt,'Hungría',1750),colorTerritorioEnMapa(mt,'Austria',1750));
 for(const y of [1706,1707,1714,1715,1716])assert.deepEqual(groupedGovernmentIntervals(p).filter(g=>g.from<=y&&y<=g.through).map(g=>g.key).sort(),governmentGroupsAt(p,y).map(g=>g.key).sort());
});
test('coinciding crowns, delegates and claims cannot fabricate union membership; dependencies keep their pattern',()=>{
 const person={id:'synthetic',gobiernos:[{territorio:'Castilla',desde:1500,hasta:1700,condicion:'efectivo'},
  {territorio:'Aragón',desde:1500,hasta:1700,condicion:'gobierno delegado'},
  {territorio:'Portugal',desde:1500,hasta:1700,condicion:'titular'}]};
 assert.equal(agrupacionesPoliticasEnMapa(person,1590,{view:'panorama'}).length,0);
 const h={gobiernos:['Gran Bretaña','Hannover','Polonia','Sajonia'].map(territorio=>({territorio,desde:1700,hasta:1800,condicion:'efectivo'}))};
 assert.equal(agrupacionesPoliticasEnMapa(h,1750,{view:'panorama'}).length,0);
 assert(mosaic(1640).byLocation.get('Konigsberg').some(l=>l.tributaryRelation));
 assert.notDeepEqual(colors(1640,'Konigsberg'),colors(1640,'Berlin'));
});
test('panorama changes no constituent geometry, evidence or overlap order at union and integration transitions',()=>{
 for(const y of [1537,1540,1569,1585,1610,1640,1641,1650,1707,1715,1716,1720,1749,1750]){
  const original=atlasPoliticalMosaicAt(data,y),panorama=mosaic(y);
  assert.deepEqual([...panorama.byLocation.keys()],[...original.byLocation.keys()],String(y));
  assert.deepEqual(panorama.layers.map(l=>[l.key,l.ids,l.scopes,l.sources]),original.layers.map(l=>[l.key,l.ids,l.scopes,l.sources]),String(y));
  for(const [id,layers] of original.byLocation)assert.deepEqual(panorama.byLocation.get(id).map(l=>l.key),layers.map(l=>l.key),`${y}/${id}`);
 }
 assert(MAP_READING_GUIDE.paragraphs.some(text=>text.includes('no significa que formasen un Estado unitario')));
});

test('composite monarchies stay in their home region despite the number of provincial titles',()=>{
 const rows=governmentTableAt(PERSONAS,1720);
 for(const [id,index] of [['monarquia-hispanica-exterior',0],['monarquia-austriaca-exterior',3],['dinamarca-noruega-exterior',5]]) {const row=rows.find(r=>r.id===id);assert(row,id);assert.equal(governmentRegion(row),FILTER_REGIONS[index]);}
});

test('a separate Inner Austrian branch shares only its own exterior colour; a lone Savoyard title cannot create a union',()=>{
 const inner=governmentGroupsAt(by.get('CARLOS2ESTIRIA'),1570,{view:'panorama'});
 const branch=inner.find(g=>g.id==='austria-interior-exterior');assert(branch);
 assert(branch.mandates.some(m=>m.territorio==='Austria Interior'));
 assert(!branch.mandates.some(m=>m.territorio==='Tirol'));
 const main=governmentGroupsAt(by.get('MAXIM2'),1570,{view:'panorama'}).find(g=>g.id==='monarquia-austriaca-exterior');
 assert(main);assert.notEqual(main.color,branch.color);
 const prince={gobiernos:[{territorio:'Piamonte',desde:1300,hasta:1400,condicion:'efectivo'}]};
 assert(!agrupacionesPoliticasEnMapa(prince,1350,{view:'panorama'}).some(g=>g.id==='saboya'));
});
