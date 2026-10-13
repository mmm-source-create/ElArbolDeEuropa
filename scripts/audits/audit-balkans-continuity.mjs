import fs from 'node:fs';
import path from 'node:path';
import {auditRegionalContinuity} from './audit-regional-continuity.mjs';
import {projectRoot, auditReportPath} from '../lib/project-paths.mjs';

export function balkanGeographicReview(review, geography, {coreOnly = false} = {}) {
  if (geography.schema !== 1 || geography.definition !== 'balkans-geography.json')
    throw new Error('Invalid independent Balkan geography');
  const candidates = geography.cells.map(cell => cell.id).sort();
  if (JSON.stringify([...review.scope.ids].sort()) !== JSON.stringify(candidates))
    throw new Error('Regional review omits a geographic candidate');
  const ids = geography.cells.filter(cell => !coreOnly || cell.scopeAreas.balkans > 0).map(cell => cell.id);
  if (!ids.length || new Set(ids).size !== ids.length) throw new Error('Invalid Balkan geographic inventory');
  return {...review, scope: {...review.scope, name: coreOnly
    ? 'Balcanes completos, frontera cárpática y Egeo'
    : 'Balcanes, Egeo, Anatolia, frontera caucásica y Chipre', ids}};
}

export function auditBalkansContinuity(data, inventory, review, geography) {
  return auditRegionalContinuity(data, inventory, balkanGeographicReview(review, geography));
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const read = file => JSON.parse(fs.readFileSync(path.join(projectRoot, 'prototypes/euv-locations', file)));
  const result = auditBalkansContinuity(read('corridor-locations.json'), read('location-inventory.json'),
    read('balkans-full-review.json'), read('balkans-geographic-cells.json'));
  fs.writeFileSync(auditReportPath('audit-balkans-continuity-report.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(result.scope.name + ': ' + JSON.stringify(result.summary));
  if (result.summary.missingCellYears || result.summary.unexplainedCellYears
    || result.summary.missingEvidenceYears || result.summary.missingGeometry.length)
    throw new Error('Balkan coverage or attribution incomplete');
}
