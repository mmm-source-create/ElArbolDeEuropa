import fs from 'node:fs';
import {atlasPoliticalMosaicAt} from '../../src/cartography/atlasMosaic.js';
import {mapDataFile,projectRoot,auditReportPath} from '../lib/project-paths.mjs';

const read=name=>JSON.parse(fs.readFileSync(mapDataFile(name)));
const data=read('corridor-locations.json'),review=read('eastern-europe-full-review.json');
const geography=read('eastern-europe-geography.json');
const missing=[],unexplained=[],withoutEvidence=[],snapshots=[];
for(let year=1200;year<=1800;year++){
  const mosaic=atlasPoliticalMosaicAt(data,year);let mixed=0;
  for(const id of review.scope.ids){
    const layers=mosaic.byLocation.get(id)||[];
    if(!layers.length)missing.push({id,year});
    if(new Set(layers.map(l=>l.entityId)).size>1){
      mixed++;
      if(!layers.some(l=>l.scopes.some(s=>['control disputado','composición geográfica','ocupación'].includes(s.condition))))
        unexplained.push({id,year});
    }
    if(layers.some(l=>!l.scopes.some(s=>s.ids.includes(id)&&s.note&&s.sources?.some(v=>v.url&&v.locator))))
      withoutEvidence.push({id,year});
  }
  if([1200,1250,1300,1350,1400,1470,1500,1552,1569,1580,1617,1654,1710,1721,1772,1793,1795,1800].includes(year))
    snapshots.push({year,colored:review.scope.ids.filter(id=>mosaic.byLocation.has(id)).length,mixed});
}
const result={from:1200,through:1800,cells:review.scope.ids.length,cellYears:review.scope.ids.length*601,
  sectors:geography.groups.length,missing,unexplained,withoutEvidence,snapshots};
fs.writeFileSync(auditReportPath('eastern-europe.json'),JSON.stringify(result,null,2)+'\n');
if(process.argv.includes('--publish')){
  const lines=['# Polonia-Lituania, Rusia y Báltico · V5.26','',
    `Se revisan **${result.cells} celdas** durante **601 años**, 1200–1800: **${result.cellYears.toLocaleString('es')} celdas/año**. ${result.sectors} sectores geográficos y ${review.assignments.length} fases fechadas.`,
    '',`Resultado: **${missing.length} huecos**, **${unexplained.length} solapamientos sin explicación**, **${withoutEvidence.length} atribuciones sin evidencia local**.`,
    '', 'La continuidad mide cobertura y evidencia: no demuestra por sí sola cada frontera. Las celdas son comarcas aproximadas. Las tierras de comunidades bálticas, komi, nenets, bashkirias y siberianas conservan su condición regional; una reclamación o pago de tributo no se transforma en administración directa. Nueva Zembla mantiene un contexto físico sin poblamiento documentado, no una soberanía inventada.',
    '', '## Comprobaciones por año','', '| Año | Celdas representadas | Con varias identidades |','|---|---:|---:|',
    ...snapshots.map(s=>`| ${s.year} | ${s.colored} | ${s.mixed} |`),
    '', '## Sectores revisados','', '| Sector | Celdas |','|---|---:|',
    ...geography.groups.map(g=>`| ${g.label||g.key} | ${g.ids.length} |`),
    '', '## Fuentes y pasajes','',...Object.values(review.sources).map(s=>`- [${s.title}](${s.url}): ${s.locator}`),
    '', '## Inventario geográfico','',...geography.groups.map(g=>`- **${g.label||g.key}**: ${g.ids.join(', ')}.`),''];
  fs.writeFileSync(projectRoot+'/docs/reports/reviewed/V5.26_EUROPA_ORIENTAL.md',lines.join('\n'));
}
console.log(JSON.stringify({cells:result.cells,cellYears:result.cellYears,missing:missing.length,unexplained:unexplained.length,withoutEvidence:withoutEvidence.length}));
if(missing.length||unexplained.length||withoutEvidence.length){
  console.error({missing:missing.slice(0,8),unexplained:unexplained.slice(0,8),withoutEvidence:withoutEvidence.slice(0,8)});
  process.exitCode=1;
}
