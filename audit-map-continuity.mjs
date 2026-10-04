import fs from 'node:fs/promises';
import {PERSONAS} from './src/personas.jsx';
import {auditMapContinuity} from './src/data/mapContinuityAudit.js';

const report=auditMapContinuity(PERSONAS);
await fs.writeFile(new URL('./audit-map-continuity-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`Continuidad de ${report.focusTerritory}: ${report.yearsWithoutAuthority.length} años sin autoridad registrada · ${report.unexplainedOverlaps.length} solapamientos sin explicación.`);
console.log(`Cinco cortes: ${report.totals.cutRegions} regiones coloreadas · ${report.totals.unsourcedGovernmentsAtCuts} gobiernos con geometría sin fuente específica.`);
if (process.argv.includes('--fail-on-errors') && (report.yearsWithoutAuthority.length || report.unexplainedOverlaps.length)) process.exitCode=1;
