import fs from 'node:fs/promises';
import {buildDynastyPages,auditDynasties} from './src/data/dynastyModel.js';
import {DINASTIA_ALIASES} from './src/content/dinastias/index.js';
import {slugPublico} from './src/utils/personLabels.js';

const {PERSONAS}=await import('data:text/javascript;base64,'+Buffer.from(await fs.readFile('./src/personas.jsx')).toString('base64'));
const errors=auditDynasties(PERSONAS);
if(errors.length)throw new Error(JSON.stringify(errors));
const pages=buildDynastyPages(PERSONAS);
const out='./public/dinastias-meta';
await fs.mkdir(out,{recursive:true});
for(const p of pages)await fs.writeFile(`${out}/${p.slug}.json`,JSON.stringify(p));
for(const [alias,target] of Object.entries(DINASTIA_ALIASES)){
  const p=pages.find(p=>p.nombre===target);
  await fs.writeFile(`${out}/${slugPublico(alias)}.json`,JSON.stringify(p));
}
console.log(`Fichas dinásticas: ${pages.length}; historias editoriales: ${pages.filter(p=>p.editorial).length}; ramas y transmisiones: ${new Set(pages.flatMap(p=>p.ramas.map(r=>r.id))).size}`);
