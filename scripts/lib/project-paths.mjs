import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const mapDataDirectory = path.resolve(projectRoot,
  process.env.EADE_MAP_DATA_DIR || 'data/cartography');
export const mapDataUrl = pathToFileURL(mapDataDirectory + path.sep);
export const mapDataFile = name => path.join(mapDataDirectory, name);

// Fresh diagnostics are disposable. Reviewed snapshots are copied explicitly
// into docs/reports/reviewed/ after their diff and context have been reviewed.
export function auditReportPath(name) {
  const directory = path.join(projectRoot, '.cache/audits');
  fs.mkdirSync(directory, {recursive: true});
  return path.join(directory, name);
}
