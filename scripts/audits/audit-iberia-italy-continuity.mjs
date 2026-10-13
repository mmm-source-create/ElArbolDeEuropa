import fs from 'node:fs';
import path from 'node:path';
import {auditRegionalContinuity} from './audit-regional-continuity.mjs';
import {projectRoot, auditReportPath} from '../lib/project-paths.mjs';
export function iberiaItalyGeographicReview(review, geography) {
  if (geography.schema !== 1 || geography.definition !== 'iberia-italy-geography.json')
    throw new Error('Invalid independent Iberian and Italian geography');
  const ids = geography.cells.map(cell => cell.id).sort();
  if (!ids.length || new Set(ids).size !== ids.length
    || JSON.stringify([...review.scope.ids].sort()) !== JSON.stringify(ids))
    throw new Error('Regional review omits a geographic candidate');
  return review;
}
export function auditIberiaItalyContinuity(data, inventory, review, geography) {
  return auditRegionalContinuity(data, inventory, iberiaItalyGeographicReview(review, geography));
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const read = file => JSON.parse(fs.readFileSync(path.join(projectRoot, 'prototypes/euv-locations', file)));
  const result = auditIberiaItalyContinuity(read('corridor-locations.json'), read('location-inventory.json'),
    read('iberia-italy-full-review.json'), read('iberia-italy-geographic-cells.json'));
  fs.writeFileSync(auditReportPath('audit-iberia-italy-continuity-report.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(result.scope.name + ': ' + JSON.stringify(result.summary));
  if (result.summary.missingCellYears || result.summary.unexplainedCellYears
    || result.summary.missingEvidenceYears || result.summary.missingGeometry.length)
    throw new Error('Iberian or Italian coverage, local evidence or attribution incomplete');
}
