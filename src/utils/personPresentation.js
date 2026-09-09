import { gobiernoEfectivo } from "../data/territorios.js";
import { contenidoPersona, tieneContenidoEditorial } from "../content/personas/index.js";

const LATIN_EXTENDED_FOLD = Object.freeze({
  "ß": "ss", "ẞ": "SS",
  "ł": "l", "Ł": "L",
  "ı": "i", "İ": "I",
  "đ": "d", "Đ": "D",
  "ð": "d", "Ð": "D",
  "þ": "th", "Þ": "Th",
  "æ": "ae", "Æ": "AE",
  "œ": "oe", "Œ": "OE",
});

function plegarLatino(valor) {
  return String(valor ?? "").replace(/[ßẞłŁıİđĐðÐþÞæÆœŒ]/g, (caracter) => LATIN_EXTENDED_FOLD[caracter] || caracter);
}

export function slugPublico(valor) {
  return plegarLatino(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "persona";
}

export function normalizarBusquedaPublica(valor) {
  return plegarLatino(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’‘ʼ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function aliasesDePersona(persona) {
  return [...new Set((Array.isArray(persona?.aliases) ? persona.aliases : [])
    .map((valor) => String(valor || "").trim())
    .filter(Boolean))];
}

export function slugBasePersona(persona, locale = "es") {
  if (!persona) return "persona";
  if (locale === "en" && typeof persona.slugEn === "string" && persona.slugEn.trim()) return slugPublico(persona.slugEn);
  if (locale === "es" && typeof persona.slug === "string" && persona.slug.trim()) return slugPublico(persona.slug);
  const nombre = locale === "en" && typeof persona.nombreEn === "string" && persona.nombreEn.trim()
    ? persona.nombreEn
    : persona.nombre;
  return slugPublico(nombre);
}

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

export function textoBusquedaPersona(persona) {
  if (!persona) return "";
  return [
    persona.nombre,
    persona.nombreEn,
    ...aliasesDePersona(persona),
    persona.sobrenombre,
    persona.titulo,
    persona.dinastia,
    ...(Array.isArray(persona.reinos) ? persona.reinos : []),
  ].filter(Boolean).join(" ");
}

const ETIQUETAS_GOBIERNO_POR_TIPO = Object.freeze({
  regencia: "Regencia",
  electorado: "Electorado",
  estatuderato: "Estatuderato",
  reinado: "Reinado",
  archiducado: "Archiducado",
  gran_ducado: "Gran ducado",
  gran_principado: "Gran principado",
  zarato: "Zarato",
  ducado: "Ducado",
  condado: "Condado",
  principado: "Principado",
  margraviato: "Margraviato",
  landgraviato: "Landgraviato",
  banato: "Banato",
  voivodato: "Voivodato",
  emirato: "Emirato",
  sultanato: "Sultanato",
  despotado: "Despotado",
  imperio: "Imperio",
  marquesado: "Marquesado",
  pontificado: "Pontificado",
  gobierno: "Gobierno",
  "señorío": "Señorío",
});

export function etiquetaClaseGobierno(persona, gobierno) {
  const clase = gobierno?.clase;
  if (!clase) return "Gobierno sin clasificar";
  return ETIQUETAS_GOBIERNO_POR_TIPO[clase] || clase;
}
