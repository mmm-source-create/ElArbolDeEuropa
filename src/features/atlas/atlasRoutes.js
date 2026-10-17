import {canonicalDynastySlug} from '../../data/dynastyAliases.js';
import {DEFAULT_LOCALE} from '../../app/i18n.js';
import {PERSONAS} from '../../data/personas.js';
import {slugBasePersona, slugPublico} from '../../domain/people/personPresentation.js';

export const PERSONA_SLUG_BASE_COUNT = PERSONAS.reduce((acc, persona) => {
  const base = slugBasePersona(persona, "es");
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});

export const PERSONA_SLUG_POR_ID = Object.fromEntries(PERSONAS.map((persona) => {
  const base = slugBasePersona(persona, "es");
  const slug = PERSONA_SLUG_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));

export const PERSONA_ID_POR_SLUG = Object.fromEntries(
  Object.entries(PERSONA_SLUG_POR_ID).map(([id, slug]) => [slug, id])
);

// La versión inglesa solo crea páginas individuales cuando una ficha tiene un
// nombre inglés explícito. Así evitamos publicar miles de URLs /en/ cuyo
// contenido principal seguiría estando en español.
export const PERSONA_ENGLISH = PERSONAS.filter((persona) => typeof persona.nombreEn === "string" && persona.nombreEn.trim());
export const PERSONA_SLUG_EN_BASE_COUNT = PERSONA_ENGLISH.reduce((acc, persona) => {
  const base = slugBasePersona(persona, "en");
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});
export const PERSONA_SLUG_EN_POR_ID = Object.fromEntries(PERSONA_ENGLISH.map((persona) => {
  const base = slugBasePersona(persona, "en");
  const slug = PERSONA_SLUG_EN_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));
export const PERSONA_ID_POR_SLUG_EN = Object.fromEntries(
  Object.entries(PERSONA_SLUG_EN_POR_ID).map(([id, slug]) => [slug, id])
);

export const ROUTE_SEGMENTS = Object.freeze({
  es: Object.freeze({ persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" }),
  en: Object.freeze({ persona: "person", dinastia: "dynasty", territorio: "territory", historia: "story" }),
});
export const ROUTE_TYPE_BY_SEGMENT = Object.freeze({
  es: Object.fromEntries(Object.entries(ROUTE_SEGMENTS.es).map(([tipo, segmento]) => [segmento, tipo])),
  en: Object.fromEntries(Object.entries(ROUTE_SEGMENTS.en).map(([tipo, segmento]) => [segmento, tipo])),
});

export function localeDesdePath(pathname) {
  const match = String(pathname || "").match(/^\/(es|en)(?:\/|$)/);
  return match?.[1] || DEFAULT_LOCALE;
}

export function rutaEntidadLocalizada(locale, tipo, slug) {
  const idioma = locale === "en" ? "en" : "es";
  const segmento = ROUTE_SEGMENTS[idioma]?.[tipo];
  if (!segmento || !slug) return `/${idioma}/`;
  return `/${idioma}/${segmento}/${encodeURIComponent(slug)}`;
}

export function slugPersonaPorLocale(persona, locale) {
  if (!persona) return null;
  if (locale === "en") return PERSONA_SLUG_EN_POR_ID[persona.id] || null;
  return PERSONA_SLUG_POR_ID[persona.id] || slugPublico(persona.nombre);
}

export function rutaPublicaDesdePath(pathname) {
  let path = String(pathname || "/");
  const prefix = path.match(/^\/(es|en)(?=\/|$)/);
  const locale = prefix?.[1] || DEFAULT_LOCALE;
  const localizada = Boolean(prefix);
  if (prefix) path = path.slice(prefix[0].length) || "/";

  const match = path.match(/^\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return { locale, localizada, tipo: null, slug: null };
  const tipo = localizada
    ? ROUTE_TYPE_BY_SEGMENT[locale]?.[match[1]] || null
    : ROUTE_TYPE_BY_SEGMENT.es?.[match[1]] || null;
  if (!tipo) return { locale, localizada, tipo: null, slug: null };
  let slug = match[2];
  try { slug = decodeURIComponent(slug); } catch { /* conserva el slug original */ }
  return { locale, localizada, tipo, slug };
}

export function personaIdDesdeRuta(pathname) {
  const ruta = rutaPublicaDesdePath(pathname);
  if (ruta?.tipo !== "persona") return null;
  return ruta.locale === "en"
    ? PERSONA_ID_POR_SLUG_EN[ruta.slug] || null
    : PERSONA_ID_POR_SLUG[ruta.slug] || null;
}

export function valorPorSlug(slug, valores) {
  return (valores || []).find((valor) => slugPublico(valor) === canonicalDynastySlug(slug)) || null;
}
