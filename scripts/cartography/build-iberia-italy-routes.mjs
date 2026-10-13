import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';
const review = JSON.parse(fs.readFileSync(path.join(projectRoot, 'prototypes/euv-locations/iberia-italy-full-review.json')));
fs.writeFileSync(path.join(projectRoot, 'src/data/iberiaItalyRouteData.json'), JSON.stringify(compactBalkanRoutes(review)) + '\n');
console.log(`Iberia e Italia: ${review.assignments.length} rutas fechadas; evidencia completa conservada en la revisión.`);
