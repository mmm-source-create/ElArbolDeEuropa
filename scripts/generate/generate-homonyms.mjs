// Personas que comparten nombre visible (en español o en inglés). Las tarjetas
// añaden sus años de vida para distinguirlas sin cargar todo el árbol.
// Uso: node --import ./tests/jsx-loader.mjs scripts/generate/generate-homonyms.mjs
import fs from 'node:fs';
import {homonymYears} from '../../src/domain/genealogy/homonyms.js';
import {PERSONAS} from '../../src/data/personas.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
const years = homonymYears(PERSONAS, id => COMPLETE_ENGLISH_PROFILES[id]?.name);
fs.writeFileSync('src/data/homonyms.js', `// Generado por scripts/generate/generate-homonyms.mjs; no editar a mano.\nexport const HOMONYM_YEARS = Object.freeze(${JSON.stringify(years, null, 0)});\n`);
console.log(`Homónimos: ${Object.keys(years).length} personas.`);
