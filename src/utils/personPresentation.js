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
  const reinados = Array.isArray(persona?.reinados) ? persona.reinados : [];
  return reinados.find((r) => r && Number.isFinite(r.desde) && Number.isFinite(r.hasta) && r.tipo !== "pretensión" && r.tipo !== "titular")
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
    return `${primera} Gobernó ${reinado.territorio || reinos[0] || "uno de sus territorios"} entre ${reinado.desde} y ${reinado.hasta}.`;
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
  estaduderato: "Estatuderato",
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
  senorio: "Señorío",
});

export function etiquetaClaseGobierno(persona, reinado) {
  const tipo = String(reinado?.tipo || "").trim().toLowerCase();
  if (ETIQUETAS_GOBIERNO_POR_TIPO[tipo]) return ETIQUETAS_GOBIERNO_POR_TIPO[tipo];

  const titulo = String(persona?.titulo || "").toLowerCase();
  if (/\bpapa\b/.test(titulo)) return "Pontificado";
  if (/\bestat[uú]der\b/.test(titulo)) return "Estatuderato";
  if (/\belector/.test(titulo)) return "Electorado";
  if (/\bgran duque|\bduque|\bduquesa/.test(titulo)) return "Ducado";
  if (/\blandgrave|\blandgravina/.test(titulo)) return "Landgraviato";
  if (/\bmargrave|\bmargravina/.test(titulo)) return "Margraviato";
  if (/\bconde|\bcondesa/.test(titulo)) return "Condado";
  if (/\bvoivoda|\bvoivod/.test(titulo)) return "Voivodato";
  if (/\bban\b/.test(titulo)) return "Banato";
  if (/\bd[eé]spota/.test(titulo)) return "Despotado";
  if (/\bemir\b/.test(titulo)) return "Emirato";
  if (/\bsult[aá]n/.test(titulo)) return "Sultanato";
  if (/\bpr[ií]ncipe|\bprincesa/.test(titulo)) return "Principado";
  if (/\bregente|\bregencia/.test(titulo)) return "Regencia";
  if (/\bgobernador|\bgobernadora|\bseñor|\bseñora/.test(titulo)) return "Gobierno";
  if (/\bemperador|\bemperatriz|\brey\b|\breina\b|\bzar\b|\bzarina\b/.test(titulo)) return "Reinado";
  return "Gobierno";
}
