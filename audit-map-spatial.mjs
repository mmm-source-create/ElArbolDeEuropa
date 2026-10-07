import fs from 'node:fs/promises';
import {atlasMosaicPalette, atlasPoliticalMosaicAt} from './prototypes/euv-locations/atlas-mosaic.js';
import {auditMapSpatial} from './src/data/mapSpatialAudit.js';

const read = async name => JSON.parse(await fs.readFile(new URL(name,import.meta.url),'utf8'));
const data = await read('./prototypes/euv-locations/corridor-locations.json');
data.burgundy = await read('./prototypes/euv-locations/burgundian-locations.json');
const geometry = await read('./prototypes/euv-locations/balkan-spatial-cells.json');
const palette = atlasMosaicPalette(data);
const years = [1200,1300,1400,1450,1530,1600,1700,1800].filter(year => data.from <= year && year <= data.through);
const report = auditMapSpatial(geometry,years.map(year => atlasPoliticalMosaicAt(data,year,palette)));
await fs.writeFile(new URL('./audit-map-spatial-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
for (const cut of report.cuts) console.log(`Inspección espacial ${cut.year}: ${cut.unassignedCells}/${cut.visibleCells} celdas sin capa · ${(100-cut.assignedAreaPercent).toFixed(1)}% del área visible del marco.`);
for (const window of report.windows) for (const cut of window.cuts)
  console.log(`Marco focal ${cut.year}: ${cut.unassignedCells}/${cut.visibleCells} celdas sin capa · ${(100-cut.assignedAreaPercent).toFixed(1)}% del área visible.`);
