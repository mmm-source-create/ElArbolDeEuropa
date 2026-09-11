import fs from 'node:fs/promises';
import {auditDynasties} from './src/data/dynastyModel.js';
import {auditDocumentation} from './src/utils/documentaryDates.js';
import {HISTORIA_DINASTIAS,RAMAS_DINASTICAS} from './src/content/dinastias/index.js';
import {TERRITORIOS} from './src/data/territorios.js';

const {PERSONAS}=await import('data:text/javascript;base64,'+Buffer.from(await fs.readFile('./src/personas.jsx')).toString('base64'));
const issues=[...auditDynasties(PERSONAS),...auditDocumentation(PERSONAS)];
for(const [name,h] of Object.entries(HISTORIA_DINASTIAS))for(const t of h.territorios)if(!TERRITORIOS[t])issues.push({severity:'ERROR',code:'DYNASTY_TERRITORY',subject:name,message:`Territorio desconocido: ${t}`});
console.log(`Auditoría dinástica y documental: ${Object.keys(HISTORIA_DINASTIAS).length} historias · ${RAMAS_DINASTICAS.length} ramas y transmisiones · ${PERSONAS.filter(p=>p.documentacion).length} fichas con notas`);
console.log(`ERROR ${issues.length}`);
for(const i of issues)console.log(`${i.subject}: ${i.message}`);
if(issues.length)process.exitCode=1;
