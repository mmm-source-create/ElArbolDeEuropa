import {HISTORIA_DINASTIAS,DINASTIA_ALIASES,RAMAS_DINASTICAS,TIPOS_RAMAS} from '../content/dinastias/index.js';
import {SOURCES} from '../content/sources.js';
import {slugPublico,slugBasePersona} from '../utils/personLabels.js';
import {canonicalDynasty} from './dynastyAliases.js';

export function auditDynasties(personas) {
  const issues=[];
  const ids=new Set(personas.map(p=>p.id));
  const names=new Set(personas.map(p=>canonicalDynasty(p.dinastia)).filter(Boolean));
  const sourceUrls=new Set(SOURCES.map(s=>s.url));
  const add=(subject,message)=>issues.push({severity:'ERROR',code:'DYNASTY_INVALID',subject,message});
  const checkPeople=(subject,values)=>{for(const id of values||[])if(!ids.has(id))add(subject,`Persona inexistente: ${id}`);};
  for(const [name,h] of Object.entries(HISTORIA_DINASTIAS)) {
    if(!names.has(name))add(name,'Casa sin miembros en la base');
    for(const field of ['resumen','origen','trayectoria','legado'])if(!h[field]?.trim())add(name,`Falta ${field}`);
    checkPeople(name,h.protagonistas);
    for(const url of h.fuentes||[])if(!sourceUrls.has(url))add(name,`Fuente ajena al registro general: ${url}`);
  }
  const branchIds=new Set();
  for(const r of RAMAS_DINASTICAS) {
    if(branchIds.has(r.id))add(r.id,'Rama duplicada');branchIds.add(r.id);
    if(!names.has(r.origen)||!names.has(r.destino))add(r.id,'Casa de origen o destino desconocida');
    if(!TIPOS_RAMAS[r.tipo])add(r.id,'Tipo de vínculo desconocido');
    if(!r.texto?.trim()||!r.periodo?.trim())add(r.id,'Falta explicación o periodo');
    checkPeople(r.id,[r.fundador,...r.personas]);
    for(const url of r.fuentes||[])if(!sourceUrls.has(url))add(r.id,'Fuente de rama desconocida');
  }
  const edges=RAMAS_DINASTICAS.filter(r=>r.tipo==='rama_cadete'&&r.origen!==r.destino);
  const visit=(name,path=[])=>{if(path.includes(name)){add(name,'Ciclo entre casas cadetes');return;}for(const r of edges.filter(r=>r.origen===name))visit(r.destino,[...path,name]);};
  for(const name of names)visit(name);
  for(const [alias,target] of Object.entries(DINASTIA_ALIASES))if(!names.has(target)||alias===target)add(alias,'Alias dinástico inválido');
  return issues;
}

export function buildDynastyPages(personas) {
  const byId=new Map(personas.map(p=>[p.id,p]));
  const slugs=new Map();
  for(const p of personas){const s=slugBasePersona(p);slugs.set(s,(slugs.get(s)||0)+1);}
  const ref=id=>{const p=byId.get(id);return p?{id:p.id,nombre:p.nombre,dinastia:p.dinastia,titulo:p.titulo,aliases:p.aliases||[],nac:p.nac,muer:p.muer,nacAprox:p.nacAprox,muerAprox:p.muerAprox,documentacion:p.documentacion,slug:slugBasePersona(p)+(slugs.get(slugBasePersona(p))>1?'-'+slugPublico(p.id):'')}:null;};
  const source=url=>{const s=SOURCES.find(s=>s.url===url);return {titulo:s?.titulo||url,url};};
  const names=[...new Set(personas.map(p=>canonicalDynasty(p.dinastia)).filter(Boolean))];
  return names.map(nombre=>{
    const h=HISTORIA_DINASTIAS[nombre];
    const members=personas.filter(p=>canonicalDynasty(p.dinastia)===nombre).sort((a,b)=>(a.nac??9999)-(b.nac??9999)||a.nombre.localeCompare(b.nombre,'es'));
    const governments=members.flatMap(p=>(p.gobiernos||[]).map(g=>({...g,persona:ref(p.id)}))).sort((a,b)=>a.desde-b.desde);
    const branches=RAMAS_DINASTICAS.filter(r=>r.origen===nombre||r.destino===nombre).map(r=>({...r,etiqueta:TIPOS_RAMAS[r.tipo],origenSlug:slugPublico(r.origen),destinoSlug:slugPublico(r.destino),fundador:ref(r.fundador),personas:r.personas.map(ref),fuentes:r.fuentes.map(source)}));
    return {nombre,slug:slugPublico(nombre),editorial:Boolean(h),resumen:h?.resumen||'',origen:h?.origen||'',trayectoria:h?.trayectoria||'',legado:h?.legado||'',territorios:[...new Set([...(h?.territorios||[]),...governments.map(g=>g.territorio)])],protagonistas:(h?.protagonistas||members.slice(0,6).map(p=>p.id)).map(ref),miembros:members.map(p=>ref(p.id)),total:members.length,gobiernos:governments,ramas:branches,fuentes:(h?.fuentes||[]).map(source)};
  });
}
