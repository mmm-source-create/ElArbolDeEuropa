import fs from 'node:fs';
import path from 'node:path';
import {projectRoot} from '../lib/project-paths.mjs';
import {compactBalkanRoutes} from './build-balkans-routes.mjs';
const review = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/cartography/france-low-countries-full-review.json')));
fs.writeFileSync(path.join(projectRoot, 'src/cartography/regions/franceLowCountriesRouteData.json'), JSON.stringify(compactBalkanRoutes(review)) + '\n');
console.log(`Rutas de Francia y Países Bajos: ${review.assignments.length} fases; evidencia completa en la revisión.`);
