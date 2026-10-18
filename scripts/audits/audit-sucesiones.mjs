import {RELEVOS,CRISIS} from '../../src/content/sucesiones/index.js';
import {auditarSucesiones} from '../../src/domain/government/successionHistory.js';
import {TERRITORIOS} from '../../src/data/territorios.js';
import {SOURCES} from '../../src/content/sources.js';
import {PERSONAS} from '../../src/data/personas.js';
const issues=auditarSucesiones(PERSONAS,RELEVOS,CRISIS,TERRITORIOS,SOURCES);
console.log(`Sucesiones explicadas: ${RELEVOS.length} relevos · ${CRISIS.length} crisis · ${issues.length} errores`);
for(const i of issues)console.error(`${i.code} · ${i.subject}: ${i.message}`);
if(issues.length)process.exitCode=1;
