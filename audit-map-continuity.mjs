import fs from 'node:fs/promises';
import {PERSONAS} from './src/personas.jsx';
import {auditMapContinuity} from './src/data/mapContinuityAudit.js';
import {auditLocationMap, atlasLocationIds} from './src/data/locationMapAudit.js';

const data=JSON.parse(await fs.readFile(new URL('./prototypes/euv-locations/corridor-locations.json',import.meta.url),'utf8'));
data.burgundy=JSON.parse(await fs.readFile(new URL('./prototypes/euv-locations/burgundian-locations.json',import.meta.url),'utf8'));
const svg=await fs.readFile(new URL('./prototypes/euv-locations/euv-locations-crop.svg',import.meta.url),'utf8');
const report={...auditMapContinuity(PERSONAS),locations:auditLocationMap(PERSONAS,data,atlasLocationIds(svg))};
await fs.writeFile(new URL('./audit-map-continuity-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`Continuidad de ${report.focusTerritory}: ${report.yearsWithoutAuthority.length} años sin autoridad registrada · ${report.unexplainedOverlaps.length} solapamientos sin explicación.`);
console.log(`Cinco cortes: ${report.totals.cutRegions} regiones coloreadas · ${report.totals.unsourcedGovernmentsAtCuts} gobiernos con geometría sin fuente específica.`);
console.log(`Locations ${data.from}–${data.through}: ${report.locations.geometry.mappedLocations} regiones · ${report.locations.authorityGaps.length} intervalos sin autoridad · ${report.locations.overlapCandidates.length} solapamientos para revisar · ${report.locations.geometry.missingGeometry.length} etiquetas inexistentes.`);
console.log(`Revisión agrupada: ${report.locations.reviewTasks.length} tareas, con prioridad para Balcanes y norte/Báltico.`);
if (process.argv.includes('--fail-on-errors') && report.locations.geometry.missingGeometry.length) process.exitCode=1;
if (process.argv.includes('--fail-on-errors') && (report.yearsWithoutAuthority.length || report.unexplainedOverlaps.length)) process.exitCode=1;
