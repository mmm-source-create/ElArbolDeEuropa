// 6.0.14: applies data/cartography/middle-east-review.json to the map data. It
// reruns merge-map-expansions.mjs, which includes the review in its place
// after the North Atlantic, so the result matches a full rebuild.
// Run after build-middle-east-review.mjs.
import fs from 'node:fs';
import {mapDataFile} from '../lib/project-paths.mjs';
import {mergeMapExpansions} from './merge-map-expansions.mjs';

const data = mergeMapExpansions(JSON.parse(fs.readFileSync(mapDataFile('corridor-locations.json'), 'utf8')));
fs.writeFileSync(mapDataFile('corridor-locations.json'), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Oriente Medio aplicado: ${data.middleEastReview.layerNames.length} capas`);
