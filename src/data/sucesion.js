import { TERRITORIOS, componentesDe, gobiernoEfectivo } from './territorios.js';
export function sucesionDe(personas, territorio, { disputas = false } = {}) {
  const entidad = TERRITORIOS[territorio];
  const incluidos = entidad?.naturaleza === 'entidad' ? [territorio] : [territorio, ...componentesDe(territorio)];
  const filas = personas.flatMap(persona => (persona.gobiernos || persona.reinados || []).map((gobierno, index) => ({persona, gobierno, key: `${persona.id}:${index}`})))
    .filter(({gobierno:g}) => incluidos.includes(g.territorio) && (disputas || gobiernoEfectivo(g)) && (entidad?.naturaleza !== "compuesta" || !Number.isFinite(entidad.desde) || g.hasta >= entidad.desde))
    .sort((a,b) => a.gobierno.desde-b.gobierno.desde || a.gobierno.hasta-b.gobierno.hasta || a.persona.nombre.localeCompare(b.persona.nombre,'es'));
  return filas.map(f => ({...f, contextoDesde: entidad?.naturaleza === "compuesta" && Number.isFinite(entidad.desde) ? Math.max(entidad.desde, f.gobierno.desde) : null, solapados: filas.filter(o => o.persona.id !== f.persona.id && o.gobierno.territorio === f.gobierno.territorio && o.gobierno.clase === f.gobierno.clase && Math.max(o.gobierno.desde,f.gobierno.desde)<Math.min(o.gobierno.hasta,f.gobierno.hasta)).map(o=>o.persona.nombre)}));
}
