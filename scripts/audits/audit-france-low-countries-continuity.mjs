import fs from 'node:fs';
import path from 'node:path';
import {auditRegionalContinuity} from './audit-regional-continuity.mjs';
import {projectRoot, auditReportPath} from '../lib/project-paths.mjs';
export function franceLowCountriesGeographicReview(review, geography) {
  if (geography.schema !== 1 || geography.definition !== 'france-low-countries-geography.json')
    throw new Error('Invalid independent France and Low Countries geography');
  const ids = geography.cells.map(cell => cell.id).sort();
  if (!ids.length || new Set(ids).size !== ids.length
    || JSON.stringify([...review.scope.ids].sort()) !== JSON.stringify(ids))
    throw new Error('Regional review omits a geographic candidate');
  return review;
}
export function auditFranceLowCountriesContinuity(data, inventory, review, geography) {
  return auditRegionalContinuity(data, inventory, franceLowCountriesGeographicReview(review, geography));
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const read = file => JSON.parse(fs.readFileSync(path.join(projectRoot, 'prototypes/euv-locations', file)));
  const result = auditFranceLowCountriesContinuity(read('corridor-locations.json'), read('location-inventory.json'),
    read('france-low-countries-full-review.json'), read('france-low-countries-geographic-cells.json'));
  fs.writeFileSync(auditReportPath('audit-france-low-countries-continuity-report.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(result.scope.name + ': ' + JSON.stringify(result.summary));
  if (result.summary.missingCellYears || result.summary.unexplainedCellYears
    || result.summary.missingEvidenceYears || result.summary.missingGeometry.length)
    throw new Error('French or Low Countries coverage, local evidence or attribution incomplete');
}
