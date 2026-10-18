import {gobiernosDe} from '../genealogy/personAccessors.js';
import {gobiernoEfectivo} from '../../data/territorios.js';

// ---------------------------------------------------------------------------
// ¿Gobernaba de verdad, o solo estaba vinculado al territorio (consorte,
// noble de corte, hijo con título honorífico...)? Solo quien gobierna debe
// iluminar el mapa; el resto sigue apareciendo en el filtro de territorios
// y en su biografía con normalidad, simplemente no pinta nada en el mapa.
//
// La autoridad depende de mandatos fechados y de su condición. El título
// resumido y las asociaciones dinásticas no acreditan gobierno territorial.

// Cada mandato canónico conserva su intervalo independiente por territorio.
export function listaReinados(persona) {
  return gobiernosDe(persona).filter((r) =>
      r && typeof r.territorio === "string"
      && Number.isFinite(r.desde) && Number.isFinite(r.hasta)
    );
}

export function reinadoEsEfectivo(reinado) {
  return Boolean(reinado) && gobiernoEfectivo(reinado);
}

// Los años del dataset son inclusivos. Esto permite representar también
// reinados de pocos meses dentro de un mismo año, como Juan I de Francia.
export function reinadosActivos(persona, año, { soloEfectivos = false } = {}) {
  if (!Number.isFinite(año)) return [];
  return listaReinados(persona).filter((r) =>
    (!soloEfectivos || reinadoEsEfectivo(r))
    && año >= r.desde && año <= r.hasta
  );
}

export function territoriosGobernadosEnAño(persona, año) {
  const detallados = listaReinados(persona);
  if (detallados.length) {
    const vigentes = Number.isFinite(año)
      ? reinadosActivos(persona, año, { soloEfectivos: true })
      : detallados.filter(reinadoEsEfectivo);
    return [...new Set(vigentes.map((r) => r.territorio).filter(Boolean))];
  }
  // Sin un intervalo de gobierno no inferimos dominio territorial a partir
  // de `reinos`: ese campo también expresa procedencia, matrimonio o vínculo
  // dinástico.
  return [];
}

export function esGobernante(persona) {
  if (!persona) return false;
  const reinadosDetallados = listaReinados(persona);
  if (reinadosDetallados.length) return reinadosDetallados.some(reinadoEsEfectivo);
  return false;
}

// Año usado para escoger la versión cartográfica de UN territorio concreto.
// Cuando existe el nuevo modelo se toma el último intervalo efectivo de ese
// territorio. Como REINO_VERSIONES usa rangos [desde,hasta), se emplea el
// penúltimo límite anual en reinados de más de un año para no saltar a las
// fronteras del sucesor en el mismo año de terminación.
