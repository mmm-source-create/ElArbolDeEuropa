import {gobiernoEfectivo} from '../data/territorios.js';

export function reinadosEfectivos(persona) {
  const governments=persona?.gobiernos ?? persona?.reinados ?? [];
  return governments.filter(g=>g && typeof g.territorio==='string' && Number.isFinite(g.desde) && Number.isFinite(g.hasta) && g.desde<=g.hasta && gobiernoEfectivo(g) && !['titular','pretensión','pretension'].includes(g.tipo));
}

// Las preguntas automáticas se limitan a cambios anuales contiguos y no ambiguos.
// Los conflictos y regencias requieren una explicación editorial, no una respuesta única.
export function sucesionesDirectas(personas) {
  const porTerritorio=new Map();
  for(const persona of personas) for(const reinado of persona.gobiernos ?? persona.reinados ?? []) {
    if(!reinado || !Number.isFinite(reinado.desde) || !Number.isFinite(reinado.hasta))continue;
    if(!porTerritorio.has(reinado.territorio))porTerritorio.set(reinado.territorio,[]);
    porTerritorio.get(reinado.territorio).push({persona,reinado});
  }
  const pares=[];
  const simple=g=>gobiernoEfectivo(g)&&g.condicion==='efectivo'&&g.clase!=='regencia'&&g.desde<g.hasta&&!g.ambito;
  for(const [territorio,entradas] of porTerritorio) {
    for(const a of entradas.filter(e=>simple(e.reinado))) {
      const candidates=entradas.filter(b=>b.persona.id!==a.persona.id&&simple(b.reinado)&&b.reinado.clase===a.reinado.clase&&b.reinado.desde===a.reinado.hasta);
      if(candidates.length!==1)continue;
      const b=candidates[0];
      const ambiguous=entradas.some(e=>e!==a&&e!==b&&e.reinado.clase===a.reinado.clase&&e.reinado.desde<=a.reinado.hasta&&e.reinado.hasta>=a.reinado.hasta);
      if(!ambiguous)pares.push({territorio,anterior:a,siguiente:b});
    }
  }
  return pares;
}
