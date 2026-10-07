// Annual comparison of the lab's territorial layers and personal Atlas mandates.
import fs from 'node:fs';
import {PERSONAS} from './src/personas.jsx';
import {gobiernoEfectivo} from './src/data/territorios.js';
import {idsDeGobiernoEnAño} from './src/Territorios.jsx';
import {mapLocationsForGovernment, reviewedLayerLocations, reviewedLayerEvidence} from './src/data/locationMapPilot.js';
import {territorialIdentity, territorialLabel} from './src/data/territorialIdentity.js';
import {supersededRegionalLayers} from './src/data/regionalExtentRoutes.js';
import {mapAuthoritiesForPerson} from './src/data/mapAuthorities.js';

const data=JSON.parse(fs.readFileSync('prototypes/euv-locations/corridor-locations.json'));
const review=JSON.parse(fs.readFileSync('prototypes/euv-locations/continuity-review.json'));
const entries=[...data.territories,...data.additionalTerritories];
const expected=new Map([
  ['Francia',[1200,1800]],['Bohemia',[1200,1800]],['Moravia',[1200,1800]],
  ['Dinamarca',[1200,1800]],['Noruega',[1200,1800]],['Suecia',[1200,1800]],
  ['Inglaterra',[1200,1706]],['Escocia',[1200,1706]],['Irlanda',[1200,1800]],
  ['Gran Bretaña',[1707,1800]],['Polonia',[1320,1794]],['Lituania',[1253,1794]],
  ['Carintia',[1200,1800]],['Carniola',[1200,1800]],['Estiria',[1200,1800]],
]);
const intervals=years=>years.reduce((rows,year)=>{if(rows.at(-1)?.through===year-1)rows.at(-1).through=year;else rows.push({from:year,through:year});return rows;},[]);
const rows=[];
for(const [identity,[from,through]] of expected){
  const layers=entries.filter(e=>territorialIdentity(e.name)===identity);
  const mandates=PERSONAS.flatMap(p=>(p.gobiernos||[]).filter(g=>(territorialIdentity(g.territorio)===identity
    || ['Estiria','Carintia','Carniola'].includes(identity)&&(g.territorio==='Austria Interior'||g.ambito?.includes('Austria Interior')))
    &&gobiernoEfectivo(g)&&g.hasta>=from&&g.desde<=through).map(g=>({p,g})));
  const labMissing=[],personalMissing=[],noMandate=[],partial=[];
  let minCells=Infinity,maxCells=0;
  for(let year=from;year<=through;year++){
    const superseded=supersededRegionalLayers(data,year);
    const activeLayers=layers.filter(e=>!superseded.has(e.name));
    const ids=new Set(activeLayers.flatMap(e=>reviewedLayerLocations(data,e,year)));
    minCells=Math.min(minCells,ids.size);maxCells=Math.max(maxCells,ids.size);
    if(!ids.size)labMissing.push(year);
    if(activeLayers.some(e=>reviewedLayerEvidence(e,year).limitedCore))partial.push(year);
    const active=mandates.filter(({g})=>g.desde<=year&&year<=g.hasta);
    if(!active.length){noMandate.push(year);continue;}
    if(!active.some(({p,g})=>g.ambito?.includes('Austria Interior')
      ? mapAuthoritiesForPerson(p,year,data).some(a=>a.paint&&a.ids.some(id=>ids.has(id)))
      : mapLocationsForGovernment(data,g,year,p.id,idsDeGobiernoEnAño(g,year,p.id)).some(id=>ids.has(id))))personalMissing.push(year);
  }
  rows.push({identity,title:territorialLabel(identity,from),from,through,
    lab:{missingYears:labMissing.length,missingIntervals:intervals(labMissing),minCells,maxCells,limitedCoreIntervals:intervals(partial)},
    personal:{recordedMandates:mandates.length,yearsWithNoRecordedEffectiveMandate:noMandate.length,noMandateIntervals:intervals(noMandate),yearsWithMandatesButNoGeometry:personalMissing.length,missingGeometryIntervals:intervals(personalMissing)}});
}
const errors=rows.filter(row=>row.lab.missingYears);
const report={from:1200,through:1800,reviewedAt:review.reviewedAt,
  method:'Cada año de las 15 identidades prioritarias. El laboratorio y los mandatos personales se comprueban por separado. Se reconocen los gobiernos de Austria Interior que incluyen sus provincias, sin inventarles mandatos individuales. Un año sin gobernante documentado no prueba la extinción del territorio; tener alguna geometría no acredita cobertura completa.',
  counts:{identities:rows.length,labContinuityErrors:errors.length,identitiesWithMissingPersonalGeometry:rows.filter(r=>r.personal.yearsWithMandatesButNoGeometry).length,identitiesWithUnrecordedMandateYears:rows.filter(r=>r.personal.yearsWithNoRecordedEffectiveMandate).length},
  territories:rows,limitations:review.limitations};
fs.mkdirSync('docs',{recursive:true});
fs.writeFileSync('docs/atlas-continuity-audit.json',JSON.stringify(report,null,2)+'\n');
const range=xs=>xs.map(x=>x.from===x.through?x.from:x.from+'–'+x.through).join(', ')||'—';
fs.writeFileSync('docs/atlas-continuity-audit.md',[
  '# Continuidad territorial · 1200–1800','',report.method,'',
  '| Identidad | Período contrastado | Huecos del laboratorio | Mandatos presentes sin mapa | Años sin mandato efectivo registrado |',
  '|---|---|---|---|---|',
  ...rows.map(r=>'| '+[r.identity,r.from+'–'+r.through,range(r.lab.missingIntervals),range(r.personal.missingGeometryIntervals),range(r.personal.noMandateIntervals)].join(' | ')+' |'),
  '', 'Las ausencias de mandatos y de geometría son tareas de documentación; no se rellenan atribuyéndolas al vecino. Polonia anterior a 1320 requiere ducados separados; Lituania anterior a 1253 queda fuera de esta prueba. Gran Bretaña comienza en 1707 por una unión real, mientras Irlanda conserva su identidad.',
  '',...review.limitations.map(x=>'- '+x),'',
].join('\n'));
console.log(JSON.stringify(report.counts));
if(process.argv.includes('--fail-on-errors')&&errors.length)process.exitCode=1;
