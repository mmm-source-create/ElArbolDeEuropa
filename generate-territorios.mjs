import {UNIONES_CORONAS} from './src/content/coronas/index.js';
import {prepararUniones} from './src/data/crowns.js';
import {RELEVOS,CRISIS} from './src/content/sucesiones/index.js';
import {prepararSucesiones} from './src/data/successionHistory.js';
import {SOURCES} from './src/content/sources.js';
import fs from 'node:fs/promises';
import {TERRITORIOS,componentesDe} from './src/data/territorios.js';
import {HISTORIA_TERRITORIOS,FUENTES_TERRITORIOS} from './src/content/territorios/index.js';
import {slugPublico,slugBasePersona,resumenCortoPersona} from './src/utils/personPresentation.js';
const read = async p => import('data:text/javascript;base64,'+Buffer.from(await fs.readFile(p)).toString('base64'));
const {PERSONAS}=await read('./src/personas.jsx');
const {EVENTOS_HISTORICOS,HISTORIAS}=await read('./src/historiaData.jsx');
const slugs = new Map();
for(const p of PERSONAS) {const s=slugBasePersona(p);slugs.set(s,(slugs.get(s)||0)+1);}
const ref=p=>({id:p.id,nombre:p.nombre,slug:slugBasePersona(p)+(slugs.get(slugBasePersona(p))>1?'-'+slugPublico(p.id):''),dinastia:p.dinastia,resumen:resumenCortoPersona(p)});
const sucesiones=prepararSucesiones(PERSONAS,RELEVOS,CRISIS,ref,SOURCES);
const uniones=prepararUniones(UNIONES_CORONAS,id=>{const p=PERSONAS.find(p=>p.id===id);return p?ref(p):null;},SOURCES);
const out='./public/territorios-meta';await fs.mkdir(out,{recursive:true});
for(const [nombre,entidad] of Object.entries(TERRITORIOS)) {
 const nombres=[nombre,...componentesDe(nombre)];
 const personas=PERSONAS.filter(p=>(p.reinos||[]).some(t=>nombres.includes(t)));
 const ids=new Set(personas.map(p=>p.id));
 const gobiernos=personas.flatMap(p=>(p.gobiernos||[]).filter(g=>nombres.includes(g.territorio) && (entidad.naturaleza!=="compuesta" || !Number.isFinite(entidad.desde) || g.hasta>=entidad.desde)).map(g=>({...g,persona:ref(p)}))).sort((a,b)=>a.desde-b.desde||a.hasta-b.hasta);
 const dinastias=[...new Set(gobiernos.map(g=>g.persona.dinastia).filter(Boolean))];
 const historia=HISTORIA_TERRITORIOS[nombre]||{};
 const relacionados=Object.entries(TERRITORIOS).filter(([n,t])=>n!==nombre&&(t.componentes.includes(nombre)||entidad.componentes.includes(n))).map(([n,t])=>({nombre:n,clase:t.clase,slug:slugPublico(n)}));
 const meta={uniones:uniones.filter(u=>u.territorios.some(t=>nombres.includes(t))),sucesiones:{relevos:sucesiones.relevos.filter(r=>nombres.includes(r.territorio)),crisis:sucesiones.crisis.filter(c=>c.territorios.some(t=>nombres.includes(t)))},nombre,slug:slugPublico(nombre),...entidad,...historia,editorial:Boolean(historia.resumen),fuentes:FUENTES_TERRITORIOS[nombre]||[],gobiernos,dinastias,relacionados,
 personas:personas.map(ref),
 eventos:EVENTOS_HISTORICOS.filter(e=>(e.personas||[]).some(id=>ids.has(id))),
 historias:HISTORIAS.filter(h=>h.disponible&&(h.pasos||[]).some(p=>(p.personas||[]).some(id=>ids.has(id)))).map(h=>({titulo:h.titulo,slug:slugPublico(h.titulo)}))};
 await fs.writeFile(`${out}/${meta.slug}.json`,JSON.stringify(meta));
}
console.log(`Fichas territoriales: ${Object.keys(TERRITORIOS).length}; historias editoriales: ${Object.keys(HISTORIA_TERRITORIOS).length}`);
