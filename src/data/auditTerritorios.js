import {TERRITORIOS,TITULOS_POR_CLASE,CONDICIONES,gobiernoEfectivo} from './territorios.js';
export function auditarTerritorios(personas, catalogo=TERRITORIOS) {
 const issues=[]; const add=(severity,code,subject,message)=>issues.push({severity,code,subject,message});
 const gobiernos=[];
 for(const [nombre,t] of Object.entries(catalogo)) {
  if(!['entidad','compuesta','agrupacion'].includes(t.naturaleza)) add('ERROR','ENTITY_NATURE',nombre,'Naturaleza no válida');
  if(!t.clase) add('ERROR','ENTITY_CLASS',nombre,'Falta la clase territorial');
  for(const hijo of t.componentes||[]) if(!catalogo[hijo]) add('ERROR','COMPONENT_UNKNOWN',nombre,`Componente desconocido: ${hijo}`);
  const visit=(n,path=[])=>{if(path.includes(n)){add('ERROR','COMPONENT_CYCLE',nombre,[...path,n].join(' → '));return;}for(const h of catalogo[n]?.componentes||[])visit(h,[...path,n]);};visit(nombre);
 }
 for(const p of personas) {
  for(const t of p.reinos||[]) if(!catalogo[t])add('ERROR','TERRITORY_UNKNOWN',p.id,t);
  const seen=new Set();
  if(p.reinados?.length&&!p.gobiernos)add('ERROR','GOVERNMENTS_NOT_MIGRATED',p.id,'Usar gobiernos como fuente autoritativa');
  for(const [i,g] of (p.gobiernos||[]).entries()) {
   const key=`${p.id}#${i+1}`;gobiernos.push({p,g,key});
   for(const field of ['territorio','titulo','clase','condicion'])if(!g[field])add('ERROR',`GOV_${field.toUpperCase()}_MISSING`,key,`Falta ${field}`);
   const t=catalogo[g.territorio];
   if(!t)add('ERROR','GOV_TERRITORY_UNKNOWN',key,g.territorio);
   if(t?.naturaleza==='compuesta'&&Number.isFinite(t.desde)&&g.desde<t.desde)add('ERROR','GOV_BEFORE_ENTITY',key,`Gobierno anterior a la formación de ${g.territorio} en ${t.desde}`);
   if(t?.naturaleza==='agrupacion')add('ERROR','GROUP_GOVERNMENT',key,`${g.territorio} es una agrupación, no admite gobiernos`);
   if(!TITULOS_POR_CLASE[g.clase]?.includes(g.titulo))add('ERROR','TITLE_CLASS_MISMATCH',key,`${g.titulo} no corresponde a ${g.clase}`);
   if(!CONDICIONES.includes(g.condicion))add('ERROR','CONDITION_UNKNOWN',key,g.condicion);
   if(!Number.isFinite(g.desde)||!Number.isFinite(g.hasta)||g.desde>g.hasta)add('ERROR','GOV_DATES',key,'Intervalo no válido');
   if(g.efectivo===true&&['titular','pretensión'].includes(g.condicion))add('ERROR','CONDITION_CONTRADICTION',key,'Título nominal marcado efectivo');
   if(g.condicion==='rama'&&!g.ambito)add('ERROR','BRANCH_SCOPE_MISSING',key,'Falta ámbito de la rama');
   if(g.titulo?.includes('/'))add('ERROR','TITLE_AMBIGUOUS',key,g.titulo);
   const sig=[g.territorio,g.desde,g.hasta,g.clase,g.condicion,g.ambito||''].join('|');
   if(seen.has(sig))add('ERROR','DUPLICATE_GOVERNMENT',key,sig);seen.add(sig);
   const territorial=(t?.etapas||[]).map(e=>e.clase).concat(t?.clase||[]);
   const normalize=c=>({reino:'reinado',estado_pontificio:'pontificado',territorio_compuesto:'gobierno',republica:'gobierno'})[c]||c;
   const permitidas={Transilvania:['gobierno'],Valaquia:['voivodato'],Moldavia:['voivodato'],Bulgaria:['zarato'],Serbia:['despotado'],Rusia:['principado'],Sajonia:['ducado'],Baviera:['electorado'],Brandeburgo:['margraviato'],Palatinado:['condado','principado'],Florencia:['ducado'],Nassau:['principado'],Urbino:['condado'],Anjou:['condado'],Hannover:['electorado'], 'Países Bajos':['reinado']};
   if(t&& !['regencia','estatuderato'].includes(g.clase)&& !territorial.map(normalize).concat(permitidas[g.territorio]||[]).includes(g.clase))add('ERROR','TERRITORY_CLASS_MISMATCH',key,`${g.territorio}: ${g.clase} no concuerda con su rango documentado`);
  }
 }
 for(let i=0;i<gobiernos.length;i++)for(let j=i+1;j<gobiernos.length;j++){
  const a=gobiernos[i],b=gobiernos[j];
  if(a.p.id===b.p.id||a.g.territorio!==b.g.territorio||a.g.clase!==b.g.clase)continue;
  if(!gobiernoEfectivo(a.g)||!gobiernoEfectivo(b.g))continue;
  if(Math.max(a.g.desde,b.g.desde)>=Math.min(a.g.hasta,b.g.hasta))continue;
  if([a.g,b.g].some(g=>['corregente','jure uxoris'].includes(g.condicion)))continue;
  if([a.g,b.g].some(g=>g.condicion==='rama') && a.g.ambito!==b.g.ambito)continue;
  add('WARNING','SUCCESSION_OVERLAP',`${a.key}/${b.key}`,`${a.g.territorio}: ${a.p.nombre} (${a.g.desde}–${a.g.hasta}) / ${b.p.nombre} (${b.g.desde}–${b.g.hasta})`);
 }
 return issues;
}
