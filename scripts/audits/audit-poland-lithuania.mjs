import fs from 'node:fs';
import {atlasPoliticalMosaicAt} from '../../prototypes/euv-locations/atlas-mosaic.js';
import {mapDataFile,projectRoot,auditReportPath} from '../lib/project-paths.mjs';
const read=n=>JSON.parse(fs.readFileSync(mapDataFile(n)));
const data=read('corridor-locations.json'),partitions=read('poland-lithuania-partitions.json'),medieval=read('poland-lithuania-medieval-review.json'),frontier=read('poland-lithuania-frontier-review.json');
const cells=[...new Set([...partitions.cells.map(c=>c.id),...medieval.scope.ids,...frontier.scope.ids])].sort();
const missing=[],unexplained=[],withoutEvidence=[];const snapshots=[];
for(let year=1200;year<=1800;year++){
 const m=atlasPoliticalMosaicAt(data,year);let mixed=0;
 for(const id of cells){
  const layers=m.byLocation.get(id)||[];
  if(!layers.length)missing.push({id,year});
  const identities=new Set(layers.map(l=>l.entityId));
  if(identities.size>1){mixed++;if(!layers.some(l=>l.scopes.some(s=>['control disputado','composición geográfica','ocupación'].includes(s.condition))))unexplained.push({id,year,identities:[...identities]});}
  if(layers.some(l=>!l.scopes.some(s=>s.ids.includes(id)&&s.sources?.length)))withoutEvidence.push({id,year});
 }
 if([1200,1250,1300,1350,1400,1568,1569,1648,1667,1771,1772,1793,1795,1800].includes(year))snapshots.push({year,colored:cells.filter(id=>m.byLocation.has(id)).length,mixed});
}
const result={from:1200,through:1800,cells:cells.length,cellYears:cells.length*601,missing,unexplained,withoutEvidence,snapshots};
fs.writeFileSync(auditReportPath('poland-lithuania.json'),JSON.stringify(result,null,2)+'\n');
if(process.argv.includes('--publish')){
 const rows=[['Location','Identidad anterior','Año del reparto','Estado receptor','Ámbito provincial'],...partitions.cells.map(c=>[c.id,c.identityBefore,c.annexedIn,c.annexedBy,c.province])];
 fs.writeFileSync(projectRoot+'/public/data/repartos-polonia-lituania.csv','\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n');
 const md=['# Polonia-Lituania · revisión geográfica y cronológica V5.17','',`Ámbito: **${cells.length} celdas**, 1200–1800, **${result.cellYears.toLocaleString('es')} celdas/año**. Las ${partitions.cells.length} celdas de los repartos tienen registro individual de procedencia, fecha y estado receptor. Se comprueba también la frontera oriental, Drahim y las celdas medievales anteriores a la monarquía reunificada.`,
  '',`Resultado: **${missing.length} celdas/año vacías**, ${unexplained.length} atribuciones múltiples sin explicación y ${withoutEvidence.length} atribuciones sin evidencia local.`,
  '', '| Año | Celdas representadas | Celdas con varias identidades |','|---|---:|---:|',...snapshots.map(s=>`| ${s.year} | ${s.colored} | ${s.mixed} |`),
  '', '## Cambios comprobados','',
  '- Los ducados piastas preceden al reino reunificado; 1295–1296 y 1300–1305 conservan sus episodios regios. Mazovia no se incorpora de golpe en 1400.',
  '- Lituania se amplía por sectores rutenos fechados, conservando sus principados y autonomías. Las comunidades bálticas anteriores a la consolidación estatal se identifican como ámbitos regionales, sin inventar un monarca común.',
  '- La Unión de Lublin de 1569 comparte color y fila de gobierno; la Corona y el Gran Ducado mantienen títulos y contornos propios. Curlandia y la Prusia ducal mantienen su condición separada.',
  '- Prusia Real, Warmia, Curlandia y Latgalia continúan después de 1650. Kwidzyn permanece en la rama prusiana después de 1466; no se cuenta como una adquisición de 1772.',
  '- Los repartos de 1772, 1793 y 1795 transfieren cada celda a Prusia, Rusia o Austria. Varsovia es prusiana desde 1795; Cracovia y Lublin, austríacas; Vilna y Curlandia, rusas. Gdansk y Torun no se transfieren antes de 1793.',
  '- Se corrigen las fechas de Podolia y de la Ucrania de la margen derecha, y se conservan explícitamente las celdas que cruzan el Dvina o el Niemen.',
  '- Smolensk, Chernigov y Kyiv siguen sus transferencias anteriores a los repartos. El Hetmanato conserva su identidad antes de la supresión de su gobierno autónomo; no se convierte retrospectivamente en una provincia rusa ordinaria.',
  '', '## Evidencia e interpretación','',
  'La auditoría mide continuidad y evidencia, no demuestra por sí sola cada frontera. Los polígonos son comarcas de referencia: se preservan las reservas regionales, las disputas y las celdas compartidas. La escala anual no reproduce todos los cambios de una campaña. Las comunidades bálticas se describen como tierras, sin atribuirles una forma estatal unitaria que las fuentes no sostienen.',
  '', 'Fuentes cartográficas y documentales:', '', ...Object.values({...partitions.sources,...medieval.sources,...frontier.sources}).map(s=>`- [${s.title}](${s.url}): ${s.locator}`),
  '', '## Registro individual de los repartos','', '| Location | Identidad anterior | Fecha | Estado receptor | Ámbito |','|---|---|---:|---|---|',...partitions.cells.map(c=>`| ${c.id} | ${c.identityBefore} | ${c.annexedIn} | ${c.annexedBy} | ${c.province} |`),
  '', '## Ámbito completo auditado','',cells.join(', ')+'.',''];
 fs.writeFileSync(projectRoot+'/docs/reports/reviewed/V5.17_POLONIA_LITUANIA.md',md.join('\n'));
}
console.log(JSON.stringify({cells:cells.length,years:601,cellYears:result.cellYears,missing:missing.length,unexplained:unexplained.length,withoutEvidence:withoutEvidence.length}));
if(missing.length||unexplained.length||withoutEvidence.length){console.error({missing:missing.slice(0,8),unexplained:unexplained.slice(0,8),withoutEvidence:withoutEvidence.slice(0,8)});process.exitCode=1;}
