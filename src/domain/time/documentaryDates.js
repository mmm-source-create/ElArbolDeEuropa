// Documentary ranges supplement, rather than replace, legacy numeric years.
export function documentaryDate(persona, campo) {
  return persona?.documentacion?.fechas?.[campo] || null;
}

export function formatDocumentaryDate(persona, campo) {
  const d = documentaryDate(persona, campo);
  if (d?.tipo === 'intervalo') return `${d.desde}–${d.hasta}`;
  if (d?.tipo === 'antes') return `antes de ${d.hasta}`;
  if (d?.tipo === 'despues') return `después de ${d.desde}`;
  const valor = d?.tipo === 'aproximada' ? d.valor : persona?.[campo];
  return Number.isFinite(valor) ? `${d?.tipo === 'aproximada' || persona?.[`${campo}Aprox`] ? 'c. ' : ''}${valor}` : '?';
}

export function documentaryLife(persona) {
  const separator = ['nac','muer'].some(c => documentaryDate(persona,c)?.tipo === 'intervalo') ? ' · ' : ' – ';
  return `${formatDocumentaryDate(persona,'nac')}${separator}${formatDocumentaryDate(persona,'muer')}`;
}

// Open bounds are deliberately unbounded; no arbitrary margin is invented for c. dates.
export function documentaryBounds(persona, campo) {
  const d = documentaryDate(persona,campo);
  if (d?.tipo === 'intervalo') return [d.desde,d.hasta];
  if (d?.tipo === 'antes') return [-Infinity,d.hasta-1];
  if (d?.tipo === 'despues') return [d.desde+1,Infinity];
  const n=d?.valor ?? persona?.[campo];
  return Number.isFinite(n) ? [n,n] : [-Infinity,Infinity];
}

// The year filter includes years compatible with the documented limits.
// Approximate dates keep their conventional year without inventing an error margin.
export function documentaryLifeBounds(persona, governments = []) {
  const births = governments.map(g => g.desde).filter(Number.isFinite);
  const deaths = governments.map(g => g.hasta).filter(Number.isFinite);
  if (documentaryDate(persona, 'nac')) births.push(documentaryBounds(persona, 'nac')[0]);
  else if (Number.isFinite(persona?.nac)) births.push(persona.nac);
  if (documentaryDate(persona, 'muer')) deaths.push(documentaryBounds(persona, 'muer')[1]);
  else if (Number.isFinite(persona?.muer)) deaths.push(persona.muer);
  if (!births.length && !deaths.length) return null;
  return [births.length ? Math.min(...births) : -Infinity, deaths.length ? Math.max(...deaths) : Infinity];
}

export function auditDocumentation(personas) {
  const issues=[];
  const add=(p,message)=>issues.push({severity:'ERROR',code:'DOCUMENTATION_INVALID',subject:p.id,message});
  for(const p of personas) {
    for(const [field,d] of Object.entries(p.documentacion?.fechas || {})) {
      if(!['nac','muer'].includes(field)) add(p,`Campo de fecha desconocido: ${field}`);
      if(!['intervalo','antes','despues','aproximada'].includes(d?.tipo)) {add(p,'Tipo de precisión desconocido');continue;}
      if(!d.nota?.trim()) add(p,'La precisión documental necesita una explicación');
      if(d.tipo==='intervalo'&&(!Number.isInteger(d.desde)||!Number.isInteger(d.hasta)||d.desde>d.hasta)) add(p,'Intervalo documental inválido');
      if(d.tipo==='antes'&&!Number.isInteger(d.hasta)||d.tipo==='despues'&&!Number.isInteger(d.desde)) add(p,'Límite documental inválido');
      if(d.tipo==='aproximada'&&(!Number.isInteger(d.valor)||d.valor!==p[field]||!p[`${field}Aprox`])) add(p,'La fecha aproximada contradice el año de la ficha');
      const [min,max]=documentaryBounds(p,field);
      if(Number.isFinite(p[field])&&(p[field]<min||p[field]>max)) add(p,'El año de ordenación queda fuera del intervalo documental');
    }
    for(const n of p.documentacion?.notas || []) {
      if(!n.campo?.trim()||!n.texto?.trim()||!['variantes','discutida','aclaracion'].includes(n.estado)) add(p,'Nota documental incompleta o estado desconocido');
    }
  }
  return issues;
}
