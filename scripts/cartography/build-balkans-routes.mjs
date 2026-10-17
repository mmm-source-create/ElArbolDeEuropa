import fs from 'node:fs';
import {projectRoot} from '../lib/project-paths.mjs';
import path from 'node:path';

// The source review and compiled map retain full geographic evidence. The
// client needs dated routes, personal scopes and the survey footprint so a
// later review cannot erase documented holdings outside its geographic area.
export function compactBalkanRoutes(review) {
  const keys = new Set((review.authorityScopes || []).flatMap(scope => scope.sourceKeys));
  return {coverageIds: review.precedenceIds || review.scope.ids,
    assignments: review.assignments.map(({name, from, through, identity, governmentTerritories, authorityPeople}) =>
    ({name, from, through, identity, governmentTerritories, ...(authorityPeople ? {authorityPeople} : {})})),
    authorityScopes: review.authorityScopes || [],
    sources: Object.fromEntries([...keys].map(key => [key, review.sources[key]]))};
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const review = JSON.parse(fs.readFileSync(path.join(projectRoot, 'prototypes/euv-locations/balkans-full-review.json')));
  fs.writeFileSync(path.join(projectRoot, 'src/cartography/regions/balkansFullRouteData.json'), JSON.stringify(compactBalkanRoutes(review)) + '\n');
  console.log(`Rutas balcánicas: ${review.assignments.length} fases; evidencia completa conservada en la revisión y el mapa.`);
}
