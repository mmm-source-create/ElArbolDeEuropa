import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from '../lib/project-paths.mjs';
import {PERSONAS} from '../../src/personas.jsx';
import {PERSONAL_ATLAS_REVIEWS} from '../../src/evidence/personalAtlasReviews.js';
import {mapAuthoritiesForPerson} from '../../src/data/mapAuthorities.js';
import {colorTerritorioEnMapa} from '../../src/Territorios.jsx';
import {authorityColor} from '../../src/data/mapColors.js';
import {atlasPoliticalMosaicAt} from '../../prototypes/euv-locations/atlas-mosaic.js';
const read=name=>JSON.parse(fs.readFileSync(path.join(projectRoot,'prototypes/euv-locations',name)));
const data=read('corridor-locations.json');data.burgundy=read('burgundian-locations.json');
const people=new Map(PERSONAS.map(p=>[p.id,p]));
const cases=[['CARLOS5',1530],['CARLOS5',1550],['FEL2ESP',1560],['FEL3ESP',1610],
 ['FEL4ESP',1650],['CARLOS2ESP',1680],['FERN1EMP',1560],['CARLOS6HRE',1730],['MARIATERESAHAB',1750],['ISABCLARAEUG',1630]];
const navarraIds=['Elizondo','Estella','Olite','Pamplona','Roncesvalles','Sanguesa','Tudela','Viana'];
let navarraMandateYears=0;
for(const personId of ['CARLOS5','FEL2ESP','FEL3ESP','FEL4ESP','CARLOS2ESP']){
 const person=people.get(personId),g=person.gobiernos.find(g=>g.territorio==='Navarra');
 for(let year=g.desde;year<=g.hasta;year++){
  const ids=new Set(mapAuthoritiesForPerson(person,year,data).filter(e=>e.territory==='Navarra'&&e.paint).flatMap(e=>e.ids));
  if(ids.size!==8||navarraIds.some(id=>!ids.has(id)))throw new Error(`Navarra incompleta: ${personId} ${year}`);
  navarraMandateYears++;
 }
}
const crownComparisons=[];
for(const [personId,year] of [['FERN1EMP',1560],['CARLOS6HRE',1730],['MARIATERESAHAB',1750]]){
 const entries=mapAuthoritiesForPerson(people.get(personId),year,data),mosaic=atlasPoliticalMosaicAt(data,year);
 for(const territory of ['Bohemia','Moravia']){
  const personal=new Set(entries.filter(e=>e.territory===territory&&e.paint).flatMap(e=>e.ids));
  const expected=new Set(mosaic.layers.filter(l=>l.entityId===territory).flatMap(l=>l.ids));
  const missing=[...expected].filter(id=>!personal.has(id));
  if(missing.length)throw new Error(`${personId} ${year} ${territory}: ${missing.join(', ')}`);
  crownComparisons.push({personId,year,territory,personalCells:personal.size,reviewedMosaicCells:expected.size,missingIds:missing});
 }
}
const report={schema:1,version:'5.14.0',scope:'Personal maps: Spanish and Austrian Habsburgs; Navarra, Bohemian Crown and southern Netherlands.',
 limitations:'Annual approximate map cells. This audit checks the named regressions and sampled titles, not the historical accuracy of all European borders.',
 navarra:{people:5,mandateYears:navarraMandateYears,expectedIds:navarraIds,missingCellYears:0},
 crownComparisons,
 sourcedMandates:Object.keys(PERSONAL_ATLAS_REVIEWS).length,
 cases:cases.map(([personId,year])=>{
  const person=people.get(personId);
  return {personId,year,territories:mapAuthoritiesForPerson(person,year,data).filter(e=>e.paint&&e.ids.length)
   .map(e=>({territory:e.territory,title:e.government.titulo,condition:e.kind,ids:e.ids,color:authorityColor(e,colorTerritorioEnMapa(person,e.colorTerritory||e.territory,year))}))};
 })};
if(process.argv.includes('--publish'))fs.writeFileSync(path.join(projectRoot,'docs/reports/reviewed/v5.14-personal-atlas.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Atlas personal: ${cases.length} casos; Navarra ${navarraMandateYears} mandatos/año, 0 celdas ausentes; ${report.sourcedMandates} mandatos con revisión individual.`);
