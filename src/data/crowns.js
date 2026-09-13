import {gobiernoEfectivo} from './territorios.js';
import {coincideMandato,MOTIVOS_SUCESION} from './successionHistory.js';
export const gobiernosDe = p => p?.gobiernos || p?.reinados || [];
export const mandatoEn = (g, anio) => Number.isInteger(anio) && Number.isInteger(g.desde) && Number.isInteger(g.hasta) && g.desde <= anio && anio <= g.hasta;
export const claveMandato = g => `${g.territorio}|${g.desde}|${g.clase}`;

export function coronasEn(persona, anio) {
 const activos=gobiernosDe(persona).filter(g=>mandatoEn(g,anio));
 return {efectivos:activos.filter(gobiernoEfectivo),nominales:activos.filter(g=>!gobiernoEfectivo(g))};
}

// Cambios por año. Un inicio y un final dentro del mismo año no prueban simultaneidad diaria.
export function etapasCoronas(persona) {
 const gobiernos=gobiernosDe(persona).filter(g=>Number.isInteger(g.desde)&&Number.isInteger(g.hasta)&&g.desde<=g.hasta);
 const cortes=[...new Set(gobiernos.flatMap(g=>[g.desde,g.hasta+1]))].sort((a,b)=>a-b);
 return cortes.slice(0,-1).map((desde,i)=>({desde,hasta:cortes[i+1]-1,...coronasEn({gobiernos},desde)})).filter(e=>e.efectivos.length||e.nominales.length);
}
export function accesosDe(persona, accesos=[], relevos=[]) {
 const propios=accesos.filter(a=>a.persona===persona.id);
 const heredados=relevos.filter(r=>r.sucesor.persona===persona.id).map(r=>({persona:persona.id,territorio:r.territorio,desde:r.sucesor.desde,clase:r.sucesor.clase,motivos:r.motivos,explicacion:r.explicacion,fuentes:r.fuentes}));
 return gobiernosDe(persona).flatMap(g=>{
  const a=[...propios,...heredados].find(a=>coincideMandato(g,a,a.territorio));
  return a?[{...a,clase:g.clase}]:[];
 });
}
// Una misma transmisión se explica una vez, manteniendo sus mandatos identificables.
export function agruparAccesos(accesos=[]) {
 const grupos=new Map();
 for(const a of [...accesos].sort((a,b)=>a.desde-b.desde)) {
  const key=JSON.stringify([a.desde,a.motivos,a.explicacion,a.fuentes]);
  if(!grupos.has(key))grupos.set(key,{...a,territorios:[],mandatos:[]});
  const grupo=grupos.get(key);grupo.territorios.push(a.territorio);grupo.mandatos.push(claveMandato(a));
 }
 return [...grupos.values()];
}

export function prepararUniones(uniones, referencia, sources) {
 return uniones.map(u=>({...u,fuentes:u.fuentes.map(url=>sources.find(s=>s.url===url)).filter(Boolean).map(({titulo,url})=>({titulo,url})),etapas:u.etapas.map(e=>({...e,personas:e.personas.map(referencia).filter(Boolean)}))}));
}

export function auditarCoronas(personas, accesos, uniones, territorios, sources) {
 const issues=[],ids=new Map(personas.map(p=>[p.id,p])),urls=new Set(sources.map(s=>s.url)),keys=new Set(),unionIds=new Set();
 const add=(subject,message)=>issues.push({code:'CORONAS_INVALID',subject,message});
 const fuentes=(subject,list)=>{if(!list?.length)add(subject,'Faltan fuentes');for(const url of list||[])if(!urls.has(url))add(subject,`Fuente fuera del registro: ${url}`);};
 for(const a of accesos) {
  const key=`${a.persona}|${claveMandato(a)}`;
  if(keys.has(key))add(key,'Acceso duplicado');keys.add(key);
  if(!gobiernosDe(ids.get(a.persona)).some(g=>coincideMandato(g,a,a.territorio)))add(key,'No corresponde a un mandato registrado');
  if(!territorios[a.territorio]||territorios[a.territorio].naturaleza==='agrupacion')add(key,'Territorio inexistente o agrupación');
  if(!a.explicacion?.trim()||!a.motivos?.length||a.motivos.some(m=>!MOTIVOS_SUCESION.includes(m)))add(key,'Explicación o motivo inválido');
  fuentes(key,a.fuentes);
 }
 for(const u of uniones) {
  if(!u.id||unionIds.has(u.id))add(u.id,'Identificador duplicado o vacío');unionIds.add(u.id);
  if(!Number.isInteger(u.desde)||(u.hasta!==null&&(!Number.isInteger(u.hasta)||u.desde>u.hasta)))add(u.id,'Límites de la unión inválidos');
  if(!u.titulo?.trim()||!u.resumen?.trim()||!u.instituciones?.trim()||u.territorios.length<2||!u.etapas?.length)add(u.id,'Contexto de la unión incompleto');
  for(const t of u.territorios)if(!territorios[t])add(u.id,`Territorio desconocido: ${t}`);
  let anterior=-Infinity;
  for(const e of u.etapas||[]) {
   if(!Number.isInteger(e.anio)||e.anio<anterior||!e.titulo?.trim()||!e.texto?.trim())add(u.id,'Etapas desordenadas o incompletas');anterior=e.anio;
   for(const id of e.personas||[])if(!ids.has(id))add(u.id,`Persona desconocida: ${id}`);
  }
  fuentes(u.id,u.fuentes);
 }
 return issues;
}
