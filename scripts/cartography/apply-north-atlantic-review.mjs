// 6.0.13: applies data/cartography/north-atlantic-review.json to the map data.
// It reruns merge-map-expansions.mjs, which includes the review in its place
// after North Africa, so the result is the same as a full rebuild.
// Run after build-north-atlantic-review.mjs.
import fs from 'node:fs';
import {mapDataFile} from '../lib/project-paths.mjs';
import {mergeMapExpansions} from './merge-map-expansions.mjs';

const data = mergeMapExpansions(JSON.parse(fs.readFileSync(mapDataFile('corridor-locations.json'), 'utf8')));
fs.writeFileSync(mapDataFile('corridor-locations.json'), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Atlántico norte aplicado: ${data.northAtlanticReview.layerNames.length} capas`);
