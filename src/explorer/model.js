import { PERSONAS } from "../personas.jsx";
import { listaReinados } from "../Territorios.jsx";
import { DEFAULT_LOCALE, SITE } from "../i18n.jsx";
import { normalizarBusquedaPublica, slugBasePersona, slugPublico } from "../utils/personPresentation.js";

export const OTRAS_DINASTIAS = "Otras dinastías";
export const SIN_FECHA = "sin-fecha";

// Solo agrupamos ramas cuya pertenencia dinástica es clara. Las casas no
// incluidas aquí permanecen como filtros independientes o dentro de
// "Otras dinastías"; no se fuerzan parentescos históricos dudosos.
export const GRUPOS_DINASTICOS_GENEALOGICOS = {
  Capeto: [
    "Capeto", "Anjou", "Anjou-Durazzo", "Anjou-Hungría", "Anjou-Tarento",
    "Artois", "Borbón", "Borbón-Orleans", "Borgoña", "Capeto-Évreux",
    "Clermont", "Courtenay", "Dreux", "Évreux", "Valois",
    "Valois-Alençon", "Valois-Angulema", "Valois-Borgoña", "Valois-Orleans",
  ],
  Habsburgo: ["Habsburgo", "Habsburgo-Lorena"],
  Ivrea: ["Ivrea", "Ivrea-Borgoña", "La Cerda", "Trastámara"],
  Barcelona: ["Barcelona", "Casa de Aragón", "Barcelona-Sicilia", "Barcelona-Urgel", "Aragón-Urgel"],
  Plantagenet: ["Plantagenet", "Plantagenet-Lancaster", "Plantagenet-York", "Lancaster", "York"],
  Tudor: ["Tudor", "Tudor-Brandon", "Douglas-Tudor"],
  Avís: ["Avís", "Avís-Beja", "Avís-Coímbra"],
  Paleólogo: ["Paleólogo", "Paleólogo-Monferrato"],
  Přemysl: ["Přemysl", "Přemysl-Opava"],
  Lorena: ["Lorena", "Lorena-Guisa"],
};

// Los grupos regionales no afirman que todas sus casas pertenezcan a una
// misma línea de sangre: son carpetas de navegación para evitar un bloque
// inmanejable de más de cien apellidos menores.
export const GRUPOS_DINASTICOS_REGIONALES = {
  "Casas italianas": [
    "Aquino", "Borri", "Cattanei", "Cornaro", "Della Scala", "Doria",
    "Falangola", "Gazela", "Lancia", "Morosini", "Pirovano", "Sanseverino",
    "Da Vinci", "Del Giocondo", "Gherardini", "Melzi", "Orsini", "Soderini",
  ],
  "Casas ibéricas": [
    "Castro", "D’Avalos", "Enríquez", "Entenza",
    "Fernández de Córdoba", "Figueroa", "Fortiá", "Gurrea", "Guzmán",
    "Ivorra", "Lara", "Luna", "Manrique de Lara", "Manuel",
    "Medina Sidonia", "Meneses", "Noroña", "Padilla", "Pereira",
    "Pimentel", "Ponce de León", "Quiñones", "Sandoval", "Velasco", "Zúñiga",
  ],
  "Casas francesas": [
    "Albret", "Amboise", "Armagnac", "Armañac", "Auvernia", "Bar", "Beauvau", "Chambly",
    "Boulogne", "Brienne", "Châtillon", "Dammartín", "Estrées",
    "Guilhem", "Laval", "Montfort", "Montoire", "Poitiers",
    "Rohan", "Sabran", "Taillefer", "Talleyrand-Périgord",
  ],
  "Casas germánicas": [
    "Andechs", "Celje", "Gorizia", "Hohenberg", "Isenburg", "Katzenelnbogen",
    "Kyburg", "La Marck", "Ludovingios", "Schwarzburgo",
    "Avesnes", "Casa de Flandes", "Gerulfinga",
  ],
  "Casas británicas": [
    "Bohun", "Bolena", "Brandon", "Douglas", "Grey", "Holland", "Mortimer",
    "Neville", "Seymour", "Woodville", "Clare", "Marshal", "MacDonald",
  ],
  "Casas irlandesas": ["Ua Conchobair", "Mac Murchada", "O’Neill", "O’Donnell", "O’Brien", "MacCarthy", "Burgh", "Bourke", "FitzGerald", "Butler", "O’Malley", "Preston", "Talbot", "Sarsfield"],
  "Casas escandinavas": ["Estridsen", "Folkung"],
  "Casas orientales": [
    "Ángelo", "Báthory", "Cumanos", "Halshany", "Hunyadi", "Láscaris",
    "Poitiers-Antioquía", "Zápolya", "Jakeli", "Alania", "Gran Comneno",
    "Hetúmida", "Rubénida", "Lusignan", "Bethlen", "Bocskai", "Apafi", "Rákóczi", "Drăculești",
  ],
  "Sin casa identificada": ["Desconocida", "Familias menores"],
};

export const GRUPOS_DINASTICOS = {
  ...GRUPOS_DINASTICOS_GENEALOGICOS,
  ...GRUPOS_DINASTICOS_REGIONALES,
};

export const DINASTIAS_DESTACADAS = [
  "Capeto", "Habsburgo", "Ivrea", "Barcelona", "Plantagenet", "Tudor", "Estuardo",
  "Avís", "Braganza", "Alfonsina", "Árpád", "Piast", "Jagellón", "Vasa",
  "Bagrationi", "Rurikida", "Přemysl", "Hohenstaufen", "Wittelsbach", "Luxemburgo",
  "Hohenzollern", "Nassau", "Welf", "Wettin", "Oldemburgo", "Paleólogo", "Saboya",
  "Lorena", "Brabante", "Champaña", "Foix", "Dampierre", "Baux",
  "Visconti", "Sforza", "Este", "Gonzaga", "Médici", "Farnesio", "Borja",
  "Álvarez de Toledo", "Jimena", "Nemanjić", "Asen", "Shishman", "Basarab", "Bogdan-Mușat", "Kotromanić", "Nazarí", "Württemberg", "Grifo", "Zähringen-Baden",
  "Casas italianas", "Casas ibéricas", "Casas francesas", "Casas germánicas",
  "Casas británicas", "Casas irlandesas", "Casas escandinavas",
  "Casas orientales", "Sin casa identificada",
];

export const RAMA_A_PRINCIPAL = Object.fromEntries(
  Object.entries(GRUPOS_DINASTICOS).flatMap(([principal, ramas]) =>
    ramas.filter((rama) => rama !== principal).map((rama) => [rama, principal])
  )
);

export const RAMA_A_PRINCIPAL_COLOR = Object.fromEntries(
  Object.entries(GRUPOS_DINASTICOS_GENEALOGICOS).flatMap(([principal, ramas]) =>
    ramas.filter((rama) => rama !== principal).map((rama) => [rama, principal])
  )
);

export const getCategoriaDinastía = (dinastia) => RAMA_A_PRINCIPAL_COLOR[dinastia] || dinastia || OTRAS_DINASTIAS;

export function normalizaTexto(valor) {
  return normalizarBusquedaPublica(valor);
}

export { slugPublico };


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
  return (valores || []).find((valor) => slugPublico(valor) === slug) || null;
}

export function ensureMetaTag(selector, attributes) {
  if (typeof document === "undefined") return null;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

export function setMetaContent(selector, attributes, content) {
  const element = ensureMetaTag(selector, attributes);
  if (element) element.setAttribute("content", content);
}

export function ensureCanonical(href) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function setHreflangAlternates(items) {
  if (typeof document === "undefined") return;
  document.head.querySelectorAll('link[data-eade-hreflang="1"]').forEach((node) => node.remove());
  items.filter((item) => item?.hreflang && item?.href).forEach((item) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", item.hreflang);
    link.setAttribute("href", item.href);
    link.setAttribute("data-eade-hreflang", "1");
    document.head.appendChild(link);
  });
}

export const CATEGORIAS_TITULO = [
  {
    id: "monarquia",
    label: "Monarquía y soberanía",
    test: (titulo) => /(^|\s|\/)(papa|emperador|emperatriz|rey|reina|soberano|soberana)(\s|$|\/)/.test(titulo),
  },
  {
    id: "principes",
    label: "Príncipes e infantes",
    test: (titulo) => /(principe|infante|infanta|pretendiente)/.test(titulo),
  },
  {
    id: "alta-nobleza",
    label: "Alta nobleza",
    test: (titulo) => /(gran duque|archiduque|duque|condestable|conde|condesa|marques)/.test(titulo),
  },
  {
    id: "senorio",
    label: "Señorío",
    test: (titulo) => /(senor|senora)/.test(titulo),
  },
  {
    id: "consortes",
    label: "Consortes",
    test: (titulo) => /consorte/.test(titulo),
  },
  {
    id: "nobleza",
    label: "Nobleza sin título",
    test: (titulo) => /(^|\/)\s*noble(\s|$|\/)/.test(titulo),
  },
  {
    id: "gobierno-milicia",
    label: "Gobierno y milicia",
    test: (titulo) => /(gobernador|gobernadora|general|valido|almirante|condestable)/.test(titulo),
  },
  {
    id: "clero-cultura",
    label: "Clero y cultura",
    test: (titulo) => /(papa|arzobispo|santo|teologo|poeta|artista|pintor|arquitecto|ingeniero|humanista|mecenas)/.test(titulo),
  },
];

export const FILTROS_RELACION = [
  { id: "matrimonio", label: "Con matrimonio" },
  { id: "amantes", label: "Con amantes" },
  { id: "descendencia", label: "Con descendencia" },
  { id: "ascendencia", label: "Con padres registrados" },
  { id: "sin-pareja", label: "Sin pareja registrada" },
];

export const BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p]));

export const CONYUGES_INVERSOS = PERSONAS.reduce((acc, persona) => {
  const declarados = [persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || [])].filter(Boolean);
  declarados.forEach((id) => {
    if (!BY_ID[id]) return;
    (acc[id] ||= new Set()).add(persona.id);
  });
  return acc;
}, {});

export const HIJOS_POR_ID = PERSONAS.reduce((acc, persona) => {
  [persona.padre, persona.madre].filter(Boolean).forEach((progenitorId) => {
    (acc[progenitorId] ||= []).push(persona.id);
  });
  return acc;
}, {});

export const ACCENTS = {
  "Přemysl":"#6b56a5","Árpád":"#d47e4c","Piast":"#b772a6","Habsburgo":"#c14c4c",
  "Anjou":"#474a8e","Paleólogo":"#9B3E6E","Wittelsbach":"#517b9d","Hohenstaufen":"#946B3D",
  "Luxemburgo":"#175180","Jagellón":"#2c6748","Familias menores":"#71717A","Capeto":"#1f1a99",
  "Borgoña":"#8C5A2B","Barcelona":"#A13D3D","Brabante":"#3D7A5C","Visconti":"#6B7280","Alfonsina":"#B08628",
  "Borbón":"#3B4E9E","Courtenay":"#7A4E9E","Valois":"#5A7EA8","Ivrea":"#acb055","Trastámara":"#e1de3e","Avís":"#4ad0ac",
  "Plantagenet":"#7B4F32","Sforza":"#486B8A","Borja":"#7A375B","Braganza":"#3E7563",
  "Gonzaga":"#7D6840","Otras dinastías":"#71717A",

  // Grandes ramas que antes caían en el color genérico.
  "Wettin":"#4F7B58","Ivrea-Borgoña":"#9BA55A","Valois-Angulema":"#688FB2","Valois-Borgoña":"#776F9B",
  "Valois-Orleans":"#6C8CA5","Casa de Aragón":"#AA4D43","Barcelona-Sicilia":"#A54C50","Habsburgo-Lorena":"#B05B61",
  "Plantagenet-Lancaster":"#8B5D3F","Plantagenet-York":"#6B7F4B","Saboya-Carignano":"#C1728D","Évreux":"#6E82A8",
  "Artois":"#8B6F9D","Colonna":"#7D6B88","Orsini":"#9B7548","Della Rovere":"#718665","Albret":"#6C7D52",
  "Borbón-Orleans":"#5B72A9","Anjou-Durazzo":"#565991","Anjou-Tarento":"#63619C","Ludovingios":"#6F7954",

  // Casas británicas, germánicas, orientales y escandinavas.
  "Tudor":"#8A5C45","Estuardo":"#6C567F","Rurikida":"#526F8D",
  "Hohenzollern":"#303C59","Nassau":"#C08A38","Welf":"#A65C43","Oldemburgo":"#486D75",
  "Romanov":"#6F527A","Holstein-Gottorp":"#47727A","Hannover":"#6B5C91",
  "Mecklemburgo":"#4F8075","Hesse":"#6E7B45","Ascania":"#8D7A45","Estridsen":"#8FB9C9",
  "Nemanjić":"#76504A","Branković":"#8A6656","Lazarević":"#6E5E79",
  "Asen":"#7E6542","Terter":"#8B704A","Shishman":"#6E5B4D",
  "Basarab":"#6C5E85","Bogdan-Mușat":"#7B6D45","Kotromanić":"#57705F","Nazarí":"#4F7C68",
  "Württemberg":"#8A684C","Grifo":"#557486","Zähringen-Baden":"#7B5968","Jülich":"#756489",

  // Suecia: una familia visual de azules claros, manteniendo cada casa distinguible.
  "Vasa":"#8EC5E8","Bjälbo":"#A8D8EE","Folkunga":"#9FCFE6","Erik":"#B4DDF0","Sverker":"#91BED6",
  "Bonde":"#7FB5D2","Sture":"#6FA8C8","Bernadotte":"#5E9BC2",

  "Saboya":"#B65C78","Lorena":"#9A7A46","Champaña":"#A57C52","Foix":"#8F5E3E",
  "Dampierre":"#6F7A45","Baux":"#8A6A62","Este":"#8A5D70","Médici":"#A67032","Medici de Milán":"#8B784C",
  "Farnesio":"#725D8A","Álvarez de Toledo":"#5F6874",
  "Casas italianas":"#7A6658","Casas ibéricas":"#7B5D4A","Casas francesas":"#687A91",
  "Casas germánicas":"#606B57","Casas británicas":"#756777",
  "Casas irlandesas": ["Ua Conchobair", "Mac Murchada", "O’Neill", "O’Donnell"],
  "Casas escandinavas":"#557987","Casas orientales":"#765B83","Sin casa identificada":"#71717A",
};
export const PATH_COLOR = "#C97B2E";

// ---------------------------------------------------------------------------
// Información editorial pública del proyecto
// ---------------------------------------------------------------------------
// Añade aquí los nombres o alias de las personas que quieras acreditar.
export const CORRECTORES = [
  // "Nombre o alias",
];

// Puedes añadir uno o varios correos. El primero se usa para preparar el
// enlace mailto del formulario de errores.
export const CORREOS_CORRECCIONES = SITE.contactEmail ? [SITE.contactEmail] : [];

export const FAVORITOS_STORAGE_KEY = "arbol-europa-favoritos-v1";
export const PANELES_STORAGE_KEY = "arbol-europa-paneles-v1";
export const TIMELINE_SCALES = [3.2, 4.8, 6.4];
export const TIMELINE_FIXED_COLUMN = 212;



// Normaliza las relaciones sin alterar el formato de la base de datos.
// `conyuge` se conserva para una sola unión y `conyuges` para varias.
export function listaConyuges(persona) {
  if (!persona) return [];
  return [...new Set([
    persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || []),
    ...[...(CONYUGES_INVERSOS[persona.id] || [])],
  ].filter(Boolean))];
}

export function listaAmantes(persona) {
  return [...new Set((persona?.amantes || []).filter(Boolean))];
}

export function categoriasDeTitulo(persona) {
  const titulo = normalizaTexto(persona?.titulo);
  return CATEGORIAS_TITULO.filter((categoria) => categoria.test(titulo)).map((categoria) => categoria.id);
}

export function siglosDePersona(persona) {
  const fechas = [
    persona?.nac,
    persona?.muer,
    ...listaReinados(persona).flatMap((r) => [r.desde, r.hasta]),
  ].filter(Number.isFinite);
  if (!fechas.length) return [];
  const primero = Math.ceil(Math.min(...fechas) / 100);
  const ultimo = Math.ceil(Math.max(...fechas) / 100);
  return Array.from({ length: ultimo - primero + 1 }, (_, i) => primero + i);
}

export function fechasIncompletas(persona) {
  return !Number.isFinite(persona?.nac) || !Number.isFinite(persona?.muer);
}

export function estaVivaEn(persona, año) {
  if (!Number.isFinite(año) || !persona) return true;
  const reinados = listaReinados(persona);
  const inicios = [persona.nac, ...reinados.map((r) => r.desde)].filter(Number.isFinite);
  const finales = [persona.muer, ...reinados.map((r) => r.hasta)].filter(Number.isFinite);
  if (!inicios.length && !finales.length) return false;
  const inicio = inicios.length ? Math.min(...inicios) : -Infinity;
  const fin = finales.length ? Math.max(...finales) : Infinity;
  return año >= inicio && año <= fin;
}

export function etiquetaTipoReinado(tipo) {
  if (!tipo) return "";
  const etiquetas = {
    "jure uxoris": "jure uxoris",
    rival: "rival",
    titular: "titular",
    "pretensión": "pretensión",
  };
  return etiquetas[tipo] || tipo;
}

export function cumpleFiltroRelacion(persona, filtroId) {
  const conyuges = listaConyuges(persona);
  const amantes = listaAmantes(persona);
  if (filtroId === "matrimonio") return conyuges.length > 0;
  if (filtroId === "amantes") return amantes.length > 0;
  if (filtroId === "descendencia") return (HIJOS_POR_ID[persona.id] || []).length > 0;
  if (filtroId === "ascendencia") return Boolean(persona.padre || persona.madre);
  if (filtroId === "sin-pareja") return conyuges.length === 0 && amantes.length === 0;
  return false;
}

export function listaParejas(persona) {
  return [...new Set([...listaConyuges(persona), ...listaAmantes(persona)].filter(Boolean))];
}

export function clavePareja(a, b) {
  return [a, b].filter(Boolean).sort().join("|");
}

export function sonAmantes(a, b) {
  if (!a || !b) return false;
  return listaAmantes(BY_ID[a]).includes(b) || listaAmantes(BY_ID[b]).includes(a);
}

export function mediana(valores) {
  if (!valores.length) return null;
  const ordenados = valores.slice().sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[mitad]
    : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}
