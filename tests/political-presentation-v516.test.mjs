import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PERSONAS} from '../src/personas.jsx';
import {atlasFilterOptions,personMatchesTerritory} from '../src/data/atlasFilters.js';
import {GRUPOS_DINASTICOS} from '../src/explorer/model.js';
import {governmentGroupsAt,groupedGovernmentIntervals} from '../src/data/governmentPresentation.js';
import {governmentTableAt,europeMosaicAt} from '../src/data/europePanorama.js';
import {mapAuthoritiesForPerson} from '../src/data/mapAuthorities.js';
import {COLLECTIVE_AUTHORITIES,buildPoliticalMapIndex,inspectMapRegion} from '../src/data/politicalMapIndex.js';
import {FRENCH_CROWN_COLOR,ORANGE_NASSAU,authorityColor} from '../src/data/mapColors.js';
import {subterritoriosDeFiltro} from '../src/Territorios.jsx';
const data=JSON.parse(fs.readFileSync(new URL('../prototypes/euv-locations/corridor-locations.json',import.meta.url))),by=new Map(PERSONAS.map(p=>[p.id,p]));
test('territorial and dynastic filters are alphabetic, reachable and distinguish genealogical houses from folders',()=>{
 const o=atlasFilterOptions(PERSONAS),sort=a=>a.toSorted((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
 assert.deepEqual(o.territorios,sort(o.territorios));assert.deepEqual(o.dynastyFamilies,sort(o.dynastyFamilies));assert.deepEqual(o.dynastyFolders.filter(n=>n!=='Otras dinastías'),sort(o.dynastyFolders.filter(n=>n!=='Otras dinastías')));
 const reachable=new Set(),walk=n=>{if(reachable.has(n))return;reachable.add(n);for(const c of o.ramasPorPrincipal[n]||[])walk(c);};for(const n of o.dinastias)walk(n);
 for(const p of PERSONAS)if(p.dinastia)assert(reachable.has(p.dinastia),p.dinastia);
 for(const p of PERSONAS)for(const n of p.reinos||[])assert(o.territorios.some(root=>root===n||subterritoriosDeFiltro(root).includes(n)),n);
 for(const n of ['Poitou','Toulouse','Maine'])assert(subterritoriosDeFiltro('Francia').includes(n));
 for(const n of ['Carniola','Ducado de Estiria','Tirol'])assert(subterritoriosDeFiltro('Austria').includes(n));
 assert(!o.dynastyFamilies.includes('Casas italianas'));assert(o.dynastyFolders.includes('Casas italianas'));
 assert(GRUPOS_DINASTICOS.Capeto.includes('Borbón-Parma'));assert(GRUPOS_DINASTICOS.Borbón.includes('Borbón-Condé'));
 assert(o.ramasPorPrincipal.Borbón.includes('Borbón-Condé'));assert(o.ramasPorPrincipal.Borbón.includes('Borbón-Parma'));
});
test('effective-year filtering excludes personal associations and separated Transylvania',()=>{
 const consort={reinos:['Francia'],gobiernos:[]};assert(personMatchesTerritory(consort,'Francia',1700));assert(!personMatchesTerritory(consort,'Francia',1700,true));
 assert(personMatchesTerritory(by.get('LEOP1HRE'),'Hungría',1700,true));
 const p={reinos:['Transilvania'],gobiernos:[{territorio:'Transilvania',desde:1400,hasta:1700,condicion:'efectivo'}]};
 assert(personMatchesTerritory(p,'Hungría',1450,true));assert(!personMatchesTerritory(p,'Hungría',1650,true));
});
test('French king includes Orleans as an apanage while its duke retains actual government, with no Dijon/Dole confusion',()=>{
 const king=PERSONAS.find(p=>p.nombre==='Luis XIV de Francia');assert(king);
 const entries=mapAuthoritiesForPerson(king,1710,data);
 const orleans=entries.find(e=>e.kind==='apanage'&&e.ids.includes('Orleans'));assert(orleans);assert.equal(orleans.government,null);assert.equal(orleans.color,FRENCH_CROWN_COLOR);assert(orleans.mapSources.every(s=>s.url));
 assert(!entries.some(e=>e.kind==='tributary'&&e.ids.includes('Orleans')));
 const inspection=inspectMapRegion('Orleans',1710,buildPoliticalMapIndex([king],1710,data),data);
 const relation=inspection.entries.find(e=>e.kind==='apanage');assert(relation);assert(relation.mapSources.some(s=>s.url.includes('larousse')));assert.equal(relation.mapNote.split('Ducado/apanage de Orléans').length,2);
 assert(mapAuthoritiesForPerson(by.get('FELIPE2ORLEANS'),1710,data).some(e=>e.kind==='sovereign'&&e.ids.includes('Orleans')));
 const medieval=PERSONAS.find(p=>p.nombre==='Carlos VI de Francia');assert(medieval);
 const old=mapAuthoritiesForPerson(medieval,1400,data);assert(old.some(e=>e.kind==='apanage'&&e.ids.includes('Dijon')));assert(!old.some(e=>e.kind==='apanage'&&e.ids.includes('Dole')));
 const m=europeMosaicAt(data,1710,PERSONAS);assert(m.byLocation.get('Orleans').every(e=>e.mosaicColor===FRENCH_CROWN_COLOR&&e.crownRelation));
});
test('Republic is one orange entity with its collective government and provincial delegated offices',()=>{
 const rows=governmentTableAt(PERSONAS,1755,COLLECTIVE_AUTHORITIES),republic=rows.filter(r=>r.id==='provincias-unidas');assert.equal(republic.length,1);assert.equal(republic[0].color,ORANGE_NASSAU);assert(republic[0].collectives.length);
 assert(republic[0].governments.some(g=>g.person.id==='ANNEGBORANGE'));assert(republic[0].governments.every(g=>g.kind==='delegated'));
 const regency=mapAuthoritiesForPerson(by.get('ANNEGBORANGE'),1755,data).find(e=>e.kind==='delegated');assert(regency);assert.equal(authorityColor(regency,'#907085'),ORANGE_NASSAU);
 const m=governmentGroupsAt(by.get('MAURICEORANGE'),1600).find(g=>g.id==='provincias-unidas');assert(m);assert.equal(m.kind,'delegated');assert.equal(m.color,ORANGE_NASSAU);
 assert(personMatchesTerritory(by.get('MAURICEORANGE'),'Provincias Unidas',1600,true));assert(!personMatchesTerritory(by.get('MARGPARMA'),'Provincias Unidas',1560,true));
 const mosaic=europeMosaicAt(data,1705,PERSONAS);for(const id of ['Amsterdam','Groningen','Utrecht','Hertogenbosch'])assert(mosaic.byLocation.get(id).every(l=>l.mosaicColor===ORANGE_NASSAU),id);
});
test('Austria reunites only active lands and Transylvania retains a stable identity and its dated title',()=>{
 const leopold=governmentGroupsAt(by.get('LEOP1HRE'),1700);assert(leopold.some(g=>g.label==='Austria'&&g.mandates.some(m=>m.territorio==='Tirol')));
 assert(leopold.some(g=>g.id==='Transilvania'&&g.label==='Principado de Transilvania'));assert(!leopold.find(g=>g.id==='corona-san-esteban')?.mandates.some(m=>m.territorio.includes('Transilvania')));
 const intervals=groupedGovernmentIntervals(by.get('MARIATERESAHAB')).filter(g=>g.id==='Transilvania');assert(intervals.some(g=>g.through===1764));assert(intervals.some(g=>g.from===1765&&g.label==='Gran Principado de Transilvania'));
 assert(governmentGroupsAt(by.get('MARIATERESAHAB'),1770).some(g=>g.id==='Transilvania'&&g.label==='Gran Principado de Transilvania'));
 const temes=year=>europeMosaicAt(data,year,PERSONAS).byLocation.get('Timisoara');assert(temes(1750).some(l=>l.entityId==='Banato de Temes'));assert(temes(1790).some(l=>l.entityId==='Hungría'));
});
