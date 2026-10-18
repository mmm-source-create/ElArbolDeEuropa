// Revisiones de corredores (src/evidence/corridorReviewData.js), derivadas de PERSONAS.
// Se versiona porque los tests lo leen antes del build; tests/corridor-reviews.test.mjs comprueba que está al día.
import fs from 'node:fs/promises';
import {PERSONAS} from '../../src/data/personas.js';
import {buildCorridorReviews} from '../../src/evidence/corridorReviews.js';
const file = new URL('../../src/evidence/corridorReviewData.js', import.meta.url);
const text = `export const CORRIDOR_REVIEWS=Object.freeze(${JSON.stringify(buildCorridorReviews(PERSONAS))});\n`;
const previous = await fs.readFile(file, 'utf8').catch(() => '');
if (previous !== text) await fs.writeFile(file, text, 'utf8');
console.log(`Revisiones de corredores: ${previous === text ? 'sin cambios' : 'actualizadas'}`);
