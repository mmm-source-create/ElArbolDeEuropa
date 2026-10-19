import fs from 'node:fs';
import {PERSONAS} from '../../src/data/personas.js';
import {earlyPeopleInventory} from './lib/earlyPeopleInventory.js';
import {mapLocationsForGovernment} from '../../src/cartography/locationMapPilot.js';
import {idsDeGobiernoEnAño} from '../../src/cartography/kingdomMaps.js';
import {gobiernosDe} from '../../src/domain/genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../../src/data/territorios.js';
import {mapDataFile,projectRoot,auditReportPath} from '../lib/project-paths.mjs';
const data=JSON.parse(fs.readFileSync(mapDataFile('corridor-locations.json')));
// V5.25 titles that are documented but have no reviewed cartography before 1200. They are
// not drawn in those years; the list keeps the gap visible instead of failing silently.
const WITHOUT_EARLY_CARTOGRAPHY=new Set(['TEOB3CHAMP|Champaña','ENRIQLEON|Sajonia','ENRIQLEON|Baviera','HENRYSCOT|Northumbria','DAVIDHUNTINGDON|Huntingdon',
 // V5.31 · Aragonese vassals documented before the regional reviews start in 1200.
 'GUILLERMA1PALLARS|Pallars Sobirà','RAMON6TOLOSA|Toulouse','RAMONROGERFOIX|Foix','TRENCAVEL1|Vizcondado de Carcasona','ROGER2TRENCAVEL|Vizcondado de Carcasona',
 'RAMONROGERTRENCAVEL|Vizcondado de Carcasona','MARIABEARNE|Bearne','GASTON6BEARN|Bearne','GASTON6BEARN|Condado de Bigorra','PETRONILABIGORRA|Condado de Bigorra','GUILLERMO8MONTP|Montpellier']);
const people=earlyPeopleInventory(PERSONAS),missing=[],uncharted=[];let checked=0;
for(const p of PERSONAS)for(const g of gobiernosDe(p).filter(g=>g.desde<1200&&gobiernoEfectivo(g)))for(let y=g.desde;y<=Math.min(g.hasta,1199);y++){
 checked++;
 if(!mapLocationsForGovernment(data,g,y,p.id,idsDeGobiernoEnAño(g,y,p.id)).length)(WITHOUT_EARLY_CARTOGRAPHY.has(p.id+'|'+g.territorio)?uncharted:missing).push({id:p.id,territory:g.territorio,year:y});
}
const territories=[...new Set(people.flatMap(p=>p.governments.map(g=>g.territory)))].sort((a,b)=>a.localeCompare(b,'es'));
const result={people:people.length,territories:territories.length,territorialSeries:52,from:data.from,through:data.through,governmentYearsChecked:checked,missing,uncharted,peopleInventory:people};
fs.writeFileSync(auditReportPath('early-map.json'),JSON.stringify(result,null,2)+'\n');
if(process.argv.includes('--publish')){
 const rows=[['ID','Persona','Nacimiento','Fallecimiento','Gobiernos registrados anteriores a 1200','Gobiernos posteriores','Vínculos familiares (no prueban gobierno)'],...people.map(p=>[p.id,p.name,p.birth??'',p.death??'',p.governments.map(g=>`${g.territory}: ${g.from}–${g.through} (${g.condition})`).join('; '),p.laterTerritories.join('; '),p.familyAssociations.join('; ')])];
 const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
 fs.mkdirSync(projectRoot+'/public/data',{recursive:true});fs.writeFileSync(projectRoot+'/public/data/personas-antes-de-1200.csv','\uFEFF'+csv);
 const esc=v=>String(v??'—').replaceAll('|','\\|');
 const lines=['# Personas anteriores a 1200 y sus territorios','',`Revisión V5.17 · ${people.length} personas; ${territories.length} denominaciones de gobierno; 52 series territoriales cartografiadas desde ${data.from}.`,
  '', 'La selección incluye a quien nació, murió o empezó un gobierno antes de 1200. Las asociaciones familiares y los gobiernos posteriores se enumeran aparte: no otorgan posesión antes de su fecha. La dignidad de rey de Alemania es un marco político, no dominio territorial directo; no se colorea todo el Imperio como patrimonio de Felipe de Suabia u Otón IV.',
  '',`Se comprueban ${checked} combinaciones de gobierno efectivo y año anteriores a 1200. Resultado: ${missing.length} sin geometría. Las celdas conservan las limitaciones y fuentes de [la revisión medieval](../../../data/cartography/early-medieval-review.json).`,
  '', '## Territorios','',...territories.map(t=>`- ${t}${t==='Alemania'?' — dignidad regia, sin atribución patrimonial del Imperio':''}`),
  '', '## Lista completa','', '| Persona | Vida | Gobiernos que empiezan antes de 1200 | Gobiernos posteriores | Asociaciones familiares |', '|---|---|---|---|---|',
  ...people.map(p=>`| ${esc(p.name)} (${p.id}) | ${esc(p.birth)}–${esc(p.death)} | ${esc(p.governments.map(g=>`${g.territory} ${g.from}–${g.through} (${g.condition})`).join('; ')||'Sin gobierno anterior registrado')} | ${esc(p.laterTerritories.join('; ')||'—')} | ${esc(p.familyAssociations.join('; ')||'—')} |`),
  '', 'Los contornos medievales son aproximaciones regionales: el recorte limita especialmente Georgia y el Mediterráneo oriental. Se distinguen conquistas fechadas, feudos y alta realeza irlandesa; no se retrocede automáticamente la frontera de 1200 a toda la vida de una persona.',''];
 fs.writeFileSync(projectRoot+'/docs/reports/reviewed/V5.17_PERSONAS_ANTES_DE_1200.md',lines.join('\n'));
}
console.log(`Atlas anterior a 1200: ${people.length} personas, ${territories.length} denominaciones, ${checked} gobiernos/año, ${missing.length} sin geometría; ${uncharted.length} años de títulos registrados sin cartografía revisada.`);
if(missing.length){console.error(missing.slice(0,10));process.exitCode=1;}
