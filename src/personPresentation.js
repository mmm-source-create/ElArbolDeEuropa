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

function primeraFrase(texto) {
  const limpio = String(texto || "").replace(/\s+/g, " ").trim();
  if (!limpio) return "";
  const match = limpio.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || limpio).trim();
}

function primerReinadoUtil(persona) {
  const reinados = Array.isArray(persona?.reinados) ? persona.reinados : [];
  return reinados.find((r) => r && Number.isFinite(r.desde) && Number.isFinite(r.hasta) && r.tipo !== "pretensión" && r.tipo !== "titular")
    || reinados.find((r) => r && Number.isFinite(r.desde) && Number.isFinite(r.hasta))
    || null;
}

export function resumenCortoPersona(persona) {
  if (!persona) return "";
  if (typeof persona.resumen === "string" && persona.resumen.trim()) return persona.resumen.trim();
  if (typeof persona.biografia === "string" && persona.biografia.trim()) return primeraFrase(persona.biografia);

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
  if (typeof persona.biografia === "string" && persona.biografia.trim()) return persona.biografia.trim();
  return resumenCortoPersona(persona);
}

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
