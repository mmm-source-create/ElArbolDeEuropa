import { SUCESIONES_V27 } from "./sucesiones-v27.js";
import { MONARCAS_MEDIEVALES } from "./monarcas-medievales.js";
import { MONARCAS_MODERNOS } from "./monarcas-modernos.js";
import { PAPAS_RELIGION } from "./papas-religion.js";
import { MILITARES_POLITICOS } from "./militares-politicos.js";
import { CULTURA_PENSAMIENTO } from "./cultura-pensamiento.js";
import { FRONTERAS_ORIENTALES } from "./fronteras-orientales.js";
import { PRINCIPADOS_DUCADOS } from "./principados-ducados.js";

export const PERSONA_CONTENT = Object.freeze({
  ...MONARCAS_MEDIEVALES,
  ...MONARCAS_MODERNOS,
  ...PAPAS_RELIGION,
  ...MILITARES_POLITICOS,
  ...CULTURA_PENSAMIENTO,
  ...FRONTERAS_ORIENTALES,
  ...PRINCIPADOS_DUCADOS,
  ...SUCESIONES_V27,
});

export function contenidoPersona(personaOId) {
  const id = typeof personaOId === "string" ? personaOId : personaOId?.id;
  return id ? PERSONA_CONTENT[id] || null : null;
}

export function tieneContenidoEditorial(personaOId) {
  const contenido = contenidoPersona(personaOId);
  return Boolean(contenido?.resumen || contenido?.biografia);
}
