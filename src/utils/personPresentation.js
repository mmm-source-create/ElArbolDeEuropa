import { gobiernoEfectivo } from "../data/territorios.js";
import { contenidoPersona, tieneContenidoEditorial } from "../content/personas/index.js";

export { slugPublico, aliasesDePersona, slugBasePersona, normalizarBusquedaPublica, textoBusquedaPersona, etiquetaClaseGobierno } from "./personLabels.js";

function resumenBiografiaAtlas(texto) {
  const limpio = String(texto || "").replace(/\s+/g, " ").trim();
  if (!limpio) return "";
  if (limpio.length <= 300) return limpio;
  const frases = limpio.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [limpio];
  const dos = frases.slice(0, 2).join(" ").replace(/\s+/g, " ").trim();
  if (dos.length <= 320) return dos;
  const una = frases[0]?.trim() || limpio;
  return una.length <= 320 ? una : `${una.slice(0, 317).trimEnd()}…`;
}

function primerReinadoUtil(persona) {
  const reinados = persona?.gobiernos || persona?.reinados || [];
  return reinados.find((r) => r && Number.isFinite(r.desde) && Number.isFinite(r.hasta) && gobiernoEfectivo(r))
    || reinados.find((r) => r && Number.isFinite(r.desde) && Number.isFinite(r.hasta))
    || null;
}

export function resumenCortoPersona(persona) {
  if (!persona) return "";
  const contenido = contenidoPersona(persona);
  if (typeof contenido?.resumen === "string" && contenido.resumen.trim()) return contenido.resumen.trim();
  if (typeof contenido?.biografia === "string" && contenido.biografia.trim()) return resumenBiografiaAtlas(contenido.biografia);

  const titulo = String(persona.titulo || "Figura histórica").split("/")[0].trim();
  const dinastia = String(persona.dinastia || "").trim();
  const reinos = Array.isArray(persona.reinos) ? persona.reinos.filter(Boolean) : [];
  const reinado = primerReinadoUtil(persona);
  const primera = dinastia && !/^sin casa/i.test(dinastia)
    ? `${titulo} de la dinastía ${dinastia}.`
    : `${titulo}.`;

  if (reinado) {
    return `${reinado.titulo || "Titular"} de ${reinado.territorio}, ${reinado.desde}–${reinado.hasta}${reinado.condicion !== "efectivo" ? ` (${reinado.condicion})` : ""}. ${primera}`;
  }
  if (reinos.length) {
    const lista = reinos.slice(0, 3).join(", ");
    return `${primera} Su trayectoria está vinculada a ${lista}.`;
  }
  return primera;
}

export function biografiaPublicaPersona(persona) {
  if (!persona) return "";
  const contenido = contenidoPersona(persona);
  if (typeof contenido?.biografia === "string" && contenido.biografia.trim()) return contenido.biografia.trim();
  if (typeof contenido?.resumen === "string" && contenido.resumen.trim()) return contenido.resumen.trim();
  return resumenCortoPersona(persona);
}

export function contenidoEditorialPersona(persona) {
  return contenidoPersona(persona) || {};
}

export { tieneContenidoEditorial };

