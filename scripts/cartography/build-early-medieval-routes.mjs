import fs from 'node:fs';
import {projectRoot,mapDataFile} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';
const review=JSON.parse(fs.readFileSync(mapDataFile('early-medieval-review.json')));
fs.writeFileSync(projectRoot+'/src/data/earlyMedievalRouteData.json',JSON.stringify(compactBalkanRoutes(review))+'\n');
fs.writeFileSync(projectRoot+'/src/data/mapCoverage.js',`// Derived from the explicitly reviewed cartographic scope, not birth dates.\nexport const MAP_FROM=${review.scope.from};\nexport const MAP_THROUGH=1800;\n`);
console.log(`Atlas medieval: ${review.assignments.length} fases, ${review.scope.from}–${review.scope.through}.`);
