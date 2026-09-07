import { MONARCAS_MEDIEVALES } from "./monarcas-medievales.js";
import { MONARCAS_MODERNOS } from "./monarcas-modernos.js";
import { PAPAS_RELIGION } from "./papas-religion.js";
import { MILITARES_POLITICOS } from "./militares-politicos.js";
import { CULTURA_PENSAMIENTO } from "./cultura-pensamiento.js";

export const PERSONA_CONTENT = Object.freeze({
  ...MONARCAS_MEDIEVALES,
  ...MONARCAS_MODERNOS,
  ...PAPAS_RELIGION,
  ...MILITARES_POLITICOS,
  ...CULTURA_PENSAMIENTO,
});

export function contenidoPersona(personaOId) {
  const id = typeof personaOId === "string" ? personaOId : personaOId?.id;
  return id ? PERSONA_CONTENT[id] || null : null;
}

export function tieneContenidoEditorial(personaOId) {
  const contenido = contenidoPersona(personaOId);
  return Boolean(contenido?.resumen || contenido?.biografia);
}
