// Textos públicos centrales. La interfaz sigue siendo española, pero este
// archivo evita seguir incrustando la marca y metadatos en componentes y deja
// preparado un punto único para una futura versión es/en.

export const DEFAULT_LOCALE = "es";
export const SUPPORTED_LOCALES = ["es"];

export const SITE = Object.freeze({
  name: "El Árbol de Europa",
  descriptor: "Atlas genealógico e histórico interactivo",
  period: "1200–1800",
  locale: "es_ES",
  language: "es",
  // Configurables en Vercel sin tocar el código. VITE_* es público por diseño.
  publicUrl: String(import.meta.env.VITE_SITE_URL || "").replace(/\/$/, ""),
  contactEmail: String(import.meta.env.VITE_CONTACT_EMAIL || "").trim(),
});

const MESSAGES = {
  es: {
    "brand.name": "El Árbol de Europa",
    "brand.descriptor": "Atlas genealógico e histórico interactivo",
    "brand.scope": "Genealogía · Dinastías · Reinados · Territorios · 1200–1800",
    "meta.defaultTitle": "El Árbol de Europa | Atlas genealógico e histórico interactivo",
    "meta.defaultDescription": "Explora quién estaba conectado con quién, cuándo vivió, qué gobernó y qué estaba ocurriendo en Europa al mismo tiempo.",
    "share.personTitle": "{name} — El Árbol de Europa",
    "share.personText": "Explora la ficha de {name} en El Árbol de Europa.",
  },
};

function getNestedMessage(locale, key) {
  return MESSAGES[locale]?.[key] ?? MESSAGES[DEFAULT_LOCALE]?.[key] ?? key;
}

export function t(key, vars = {}, locale = DEFAULT_LOCALE) {
  const template = getNestedMessage(locale, key);
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value ?? "")),
    template,
  );
}
