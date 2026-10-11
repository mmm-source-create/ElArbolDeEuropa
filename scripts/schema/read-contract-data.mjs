import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {TERRITORIOS} from '../../src/data/territorios.js';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const readJson = async relative => JSON.parse(await fs.readFile(new URL(relative, new URL('../../', import.meta.url)), 'utf8'));

// Inspect the literal source, before the compatibility alias adds `reinados`.
// PERSONAS remains a JSON-compatible array; no source code is evaluated here.
export function readPersonLiteral(source) {
  const start = source.indexOf('export const PERSONAS = [');
  const end = source.lastIndexOf('\n];');
  if (start < 0 || end < start) throw new Error('No se encuentra el array fuente PERSONAS');
  const literal = source.slice(source.indexOf('[', start), end + 2).replace(/,\s*\]$/u, ']');
  const people = JSON.parse(literal);
  if (!Array.isArray(people)) throw new Error('PERSONAS debe ser un array');
  return people;
}

export async function readContractData() {
  const [source, mapData, inventory] = await Promise.all([
    fs.readFile(new URL('../../src/personas.jsx', import.meta.url), 'utf8'),
    readJson('prototypes/euv-locations/corridor-locations.json'),
    readJson('prototypes/euv-locations/location-inventory.json'),
  ]);
  return {people: readPersonLiteral(source), territories: TERRITORIOS, mapData,
    locationIds: new Set(inventory.cells.map(cell => cell.id))};
}
