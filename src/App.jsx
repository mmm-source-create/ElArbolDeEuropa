import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { Crown, Search, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ZoomIn, ZoomOut, RotateCcw, GitCompare, Focus, Share2, Play, Pause, SkipBack, SkipForward, X, Info, Heart, BookOpen, Scale, Flag, Mail, ExternalLink } from "lucide-react";
import { MapaEuropa } from "./MapaEuropa";
import {
  TERRITORIOS_SUB,
  TERRITORIOS_DESTACADOS,
  REINO_COLOR,
  REINO_COLOR_DEFAULT,
  esGobernante,
  territorioCoincideConFiltro,
  listaReinados,
  reinadosActivos,
  reinadoEsEfectivo,
  territoriosGobernadosEnAño,
} from "./Territorios";
import { PERSONAS } from "./personas.jsx";
import { EVENTOS_HISTORICOS, HISTORIAS } from "./historiaData.jsx";
import { DEFAULT_LOCALE, SITE, t } from "./i18n.jsx";
import "./App.css";
import EADELogo from "./EADE.png";

// ---------------------------------------------------------------------------
// Taxonomías de filtros
// ---------------------------------------------------------------------------
const OTRAS_DINASTIAS = "Otras dinastías";
const SIN_FECHA = "sin-fecha";

// Solo agrupamos ramas cuya pertenencia dinástica es clara. Las casas no
// incluidas aquí permanecen como filtros independientes o dentro de
// "Otras dinastías"; no se fuerzan parentescos históricos dudosos.
const GRUPOS_DINASTICOS_GENEALOGICOS = {
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
const GRUPOS_DINASTICOS_REGIONALES = {
  "Casas italianas": [
    "Aquino", "Borri", "Cattanei", "Della Scala", "Doria",
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
    "Neville", "Seymour", "Woodville",
  ],
  "Casas escandinavas": ["Estridsen", "Folkung"],
  "Casas orientales": [
    "Ángelo", "Báthory", "Cumanos", "Halshany", "Hunyadi", "Láscaris",
    "Poitiers-Antioquía", "Zápolya",
  ],
  "Sin casa identificada": ["Desconocida", "Familias menores"],
};

const GRUPOS_DINASTICOS = {
  ...GRUPOS_DINASTICOS_GENEALOGICOS,
  ...GRUPOS_DINASTICOS_REGIONALES,
};

const DINASTIAS_DESTACADAS = [
  "Capeto", "Habsburgo", "Ivrea", "Barcelona", "Plantagenet", "Tudor", "Estuardo",
  "Avís", "Braganza", "Alfonsina", "Árpád", "Piast", "Jagellón", "Vasa",
  "Rurikida", "Přemysl", "Hohenstaufen", "Wittelsbach", "Luxemburgo",
  "Hohenzollern", "Nassau", "Welf", "Oldemburgo", "Paleólogo", "Saboya",
  "Lorena", "Brabante", "Champaña", "Foix", "Dampierre", "Baux",
  "Visconti", "Sforza", "Este", "Gonzaga", "Médici", "Farnesio", "Borja",
  "Álvarez de Toledo", "Jimena",
  "Casas italianas", "Casas ibéricas", "Casas francesas", "Casas germánicas",
  "Casas británicas", "Casas escandinavas",
  "Casas orientales", "Sin casa identificada",
];

const RAMA_A_PRINCIPAL = Object.fromEntries(
  Object.entries(GRUPOS_DINASTICOS).flatMap(([principal, ramas]) =>
    ramas.filter((rama) => rama !== principal).map((rama) => [rama, principal])
  )
);

const RAMA_A_PRINCIPAL_COLOR = Object.fromEntries(
  Object.entries(GRUPOS_DINASTICOS_GENEALOGICOS).flatMap(([principal, ramas]) =>
    ramas.filter((rama) => rama !== principal).map((rama) => [rama, principal])
  )
);

const getCategoriaDinastía = (dinastia) => RAMA_A_PRINCIPAL_COLOR[dinastia] || dinastia || OTRAS_DINASTIAS;

function normalizaTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugPublico(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "persona";
}

const PERSONA_SLUG_BASE_COUNT = PERSONAS.reduce((acc, persona) => {
  const base = slugPublico(persona.nombre);
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});

const PERSONA_SLUG_POR_ID = Object.fromEntries(PERSONAS.map((persona) => {
  const base = slugPublico(persona.nombre);
  const slug = PERSONA_SLUG_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));

const PERSONA_ID_POR_SLUG = Object.fromEntries(
  Object.entries(PERSONA_SLUG_POR_ID).map(([id, slug]) => [slug, id])
);

// La versión inglesa solo crea páginas individuales cuando una ficha tiene un
// nombre inglés explícito. Así evitamos publicar miles de URLs /en/ cuyo
// contenido principal seguiría estando en español.
const PERSONA_ENGLISH = PERSONAS.filter((persona) => typeof persona.nombreEn === "string" && persona.nombreEn.trim());
const PERSONA_SLUG_EN_BASE_COUNT = PERSONA_ENGLISH.reduce((acc, persona) => {
  const base = slugPublico(persona.nombreEn);
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});
const PERSONA_SLUG_EN_POR_ID = Object.fromEntries(PERSONA_ENGLISH.map((persona) => {
  const base = slugPublico(persona.nombreEn);
  const slug = PERSONA_SLUG_EN_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));
const PERSONA_ID_POR_SLUG_EN = Object.fromEntries(
  Object.entries(PERSONA_SLUG_EN_POR_ID).map(([id, slug]) => [slug, id])
);

const ROUTE_SEGMENTS = Object.freeze({
  es: Object.freeze({ persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" }),
  en: Object.freeze({ persona: "person", dinastia: "dynasty", territorio: "territory", historia: "story" }),
});
const ROUTE_TYPE_BY_SEGMENT = Object.freeze({
  es: Object.fromEntries(Object.entries(ROUTE_SEGMENTS.es).map(([tipo, segmento]) => [segmento, tipo])),
  en: Object.fromEntries(Object.entries(ROUTE_SEGMENTS.en).map(([tipo, segmento]) => [segmento, tipo])),
});

function localeDesdePath(pathname) {
  const match = String(pathname || "").match(/^\/(es|en)(?:\/|$)/);
  return match?.[1] || DEFAULT_LOCALE;
}

function rutaEntidadLocalizada(locale, tipo, slug) {
  const idioma = locale === "en" ? "en" : "es";
  const segmento = ROUTE_SEGMENTS[idioma]?.[tipo];
  if (!segmento || !slug) return `/${idioma}/`;
  return `/${idioma}/${segmento}/${encodeURIComponent(slug)}`;
}

function slugPersonaPorLocale(persona, locale) {
  if (!persona) return null;
  if (locale === "en") return PERSONA_SLUG_EN_POR_ID[persona.id] || null;
  return PERSONA_SLUG_POR_ID[persona.id] || slugPublico(persona.nombre);
}

function rutaPublicaDesdePath(pathname) {
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

function personaIdDesdeRuta(pathname) {
  const ruta = rutaPublicaDesdePath(pathname);
  if (ruta?.tipo !== "persona") return null;
  return ruta.locale === "en"
    ? PERSONA_ID_POR_SLUG_EN[ruta.slug] || null
    : PERSONA_ID_POR_SLUG[ruta.slug] || null;
}

function valorPorSlug(slug, valores) {
  return (valores || []).find((valor) => slugPublico(valor) === slug) || null;
}

function ensureMetaTag(selector, attributes) {
  if (typeof document === "undefined") return null;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

function setMetaContent(selector, attributes, content) {
  const element = ensureMetaTag(selector, attributes);
  if (element) element.setAttribute("content", content);
}

function ensureCanonical(href) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setHreflangAlternates(items) {
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

const CATEGORIAS_TITULO = [
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

const FILTROS_RELACION = [
  { id: "matrimonio", label: "Con matrimonio" },
  { id: "amantes", label: "Con amantes" },
  { id: "descendencia", label: "Con descendencia" },
  { id: "ascendencia", label: "Con padres registrados" },
  { id: "sin-pareja", label: "Sin pareja registrada" },
];

const BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p]));

const CONYUGES_INVERSOS = PERSONAS.reduce((acc, persona) => {
  const declarados = [persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || [])].filter(Boolean);
  declarados.forEach((id) => {
    if (!BY_ID[id]) return;
    (acc[id] ||= new Set()).add(persona.id);
  });
  return acc;
}, {});

const HIJOS_POR_ID = PERSONAS.reduce((acc, persona) => {
  [persona.padre, persona.madre].filter(Boolean).forEach((progenitorId) => {
    (acc[progenitorId] ||= []).push(persona.id);
  });
  return acc;
}, {});

const ACCENTS = {
  "Přemysl":"#6b56a5","Árpád":"#d47e4c","Piast":"#b772a6","Habsburgo":"#c14c4c",
  "Anjou":"#474a8e","Paleólogo":"#9B3E6E","Wittelsbach":"#517b9d","Hohenstaufen":"#946B3D",
  "Luxemburgo":"#175180","Jagellón":"#2c6748","Familias menores":"#71717A","Capeto":"#1f1a99",
  "Borgoña":"#8C5A2B","Barcelona":"#A13D3D","Brabante":"#3D7A5C","Visconti":"#6B7280","Alfonsina":"#B08628",
  "Borbón":"#3B4E9E","Courtenay":"#7A4E9E","Valois":"#5A7EA8","Ivrea":"#acb055","Trastámara":"#e1de3e", "Avís":"#4ad0ac",
  "Plantagenet":"#7B4F32", "Sforza":"#486B8A", "Borja":"#7A375B", "Braganza":"#3E7563",
  "Gonzaga":"#7D6840", "Paleólogo":"#9B3E6E", "Otras dinastías":"#71717A",
  "Tudor":"#8A5C45", "Estuardo":"#6C567F", "Vasa":"#B48A2F", "Rurikida":"#526F8D",
  "Hohenzollern":"#303C59", "Nassau":"#C08A38", "Welf":"#A65C43", "Oldemburgo":"#486D75",
  "Saboya":"#B65C78", "Lorena":"#9A7A46", "Champaña":"#A57C52", "Foix":"#8F5E3E",
  "Dampierre":"#6F7A45", "Baux":"#8A6A62", "Este":"#8A5D70", "Médici":"#A67032",
  "Farnesio":"#725D8A", "Álvarez de Toledo":"#5F6874",
  "Casas italianas":"#7A6658", "Casas ibéricas":"#7B5D4A", "Casas francesas":"#687A91",
  "Casas germánicas":"#606B57", "Casas británicas":"#756777",
  "Casas escandinavas":"#557987", "Casas orientales":"#765B83", "Sin casa identificada":"#71717A",
};
const PATH_COLOR = "#C97B2E";

// ---------------------------------------------------------------------------
// Información editorial pública del proyecto
// ---------------------------------------------------------------------------
// Añade aquí los nombres o alias de las personas que quieras acreditar.
const CORRECTORES = [
  // "Nombre o alias",
];

// Puedes añadir uno o varios correos. El primero se usa para preparar el
// enlace mailto del formulario de errores.
const CORREOS_CORRECCIONES = SITE.contactEmail ? [SITE.contactEmail] : [];

const PORTADA_STORAGE_KEY = "arbol-europa-portada-v1";
const FAVORITOS_STORAGE_KEY = "arbol-europa-favoritos-v1";
const TIMELINE_SCALES = [3.2, 4.8, 6.4];
const TIMELINE_FIXED_COLUMN = 212;



// Normaliza las relaciones sin alterar el formato de la base de datos.
// `conyuge` se conserva para una sola unión y `conyuges` para varias.
function listaConyuges(persona) {
  if (!persona) return [];
  return [...new Set([
    persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || []),
    ...[...(CONYUGES_INVERSOS[persona.id] || [])],
  ].filter(Boolean))];
}

function listaAmantes(persona) {
  return [...new Set((persona?.amantes || []).filter(Boolean))];
}

function categoriasDeTitulo(persona) {
  const titulo = normalizaTexto(persona?.titulo);
  return CATEGORIAS_TITULO.filter((categoria) => categoria.test(titulo)).map((categoria) => categoria.id);
}

function siglosDePersona(persona) {
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

function fechasIncompletas(persona) {
  return !Number.isFinite(persona?.nac) || !Number.isFinite(persona?.muer);
}

function estaVivaEn(persona, año) {
  if (!Number.isFinite(año) || !persona) return true;
  const reinados = listaReinados(persona);
  const inicios = [persona.nac, ...reinados.map((r) => r.desde)].filter(Number.isFinite);
  const finales = [persona.muer, ...reinados.map((r) => r.hasta)].filter(Number.isFinite);
  if (!inicios.length && !finales.length) return false;
  const inicio = inicios.length ? Math.min(...inicios) : -Infinity;
  const fin = finales.length ? Math.max(...finales) : Infinity;
  return año >= inicio && año <= fin;
}

function etiquetaTipoReinado(tipo) {
  if (!tipo) return "";
  const etiquetas = {
    "jure uxoris": "jure uxoris",
    rival: "rival",
    titular: "titular",
    "pretensión": "pretensión",
  };
  return etiquetas[tipo] || tipo;
}

function cumpleFiltroRelacion(persona, filtroId) {
  const conyuges = listaConyuges(persona);
  const amantes = listaAmantes(persona);
  if (filtroId === "matrimonio") return conyuges.length > 0;
  if (filtroId === "amantes") return amantes.length > 0;
  if (filtroId === "descendencia") return (HIJOS_POR_ID[persona.id] || []).length > 0;
  if (filtroId === "ascendencia") return Boolean(persona.padre || persona.madre);
  if (filtroId === "sin-pareja") return conyuges.length === 0 && amantes.length === 0;
  return false;
}

function listaParejas(persona) {
  return [...new Set([...listaConyuges(persona), ...listaAmantes(persona)].filter(Boolean))];
}

function clavePareja(a, b) {
  return [a, b].filter(Boolean).sort().join("|");
}

function sonAmantes(a, b) {
  if (!a || !b) return false;
  return listaAmantes(BY_ID[a]).includes(b) || listaAmantes(BY_ID[b]).includes(a);
}

function mediana(valores) {
  if (!valores.length) return null;
  const ordenados = valores.slice().sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[mitad]
    : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}

const TREE_BOX_W = 190;
const TREE_BOX_H = 70;
const TREE_MINI_MIN_H = 28;
const TREE_UNIT_GAP = 112;
const TREE_ROW_GAP = 190;
const TREE_PAD_X = 92;
const TREE_PAD_TOP = 38;
const TREE_PAD_BOTTOM = 64;
const TREE_ROW_STEP = TREE_BOX_H + TREE_ROW_GAP;
const TREE_COLUMN_STEP = 14;
const TREE_PARTNER_EXIT_BASE = 14;
const TREE_PARTNER_EXIT_STEP = 10;

function computeGenerations(people) {
  const knownIds = new Set(people.map((persona) => persona.id));
  const gen = Object.fromEntries(people.map((persona) => [persona.id, 0]));
  const maxPasses = Math.max(40, people.length + 5);

  const relaxConstraints = () => {
    let changed = true;
    let guard = 0;
    while (changed && guard < maxPasses) {
      changed = false;

      people.forEach((persona) => {
        let nextGen = gen[persona.id];
        [persona.padre, persona.madre].forEach((parentId) => {
          if (knownIds.has(parentId)) nextGen = Math.max(nextGen, gen[parentId] + 1);
        });
        if (nextGen !== gen[persona.id]) {
          gen[persona.id] = nextGen;
          changed = true;
        }
      });

      // Matrimonios y relaciones de amantes se representan en la misma fila.
      people.forEach((persona) => {
        listaParejas(persona).forEach((partnerId) => {
          if (!knownIds.has(partnerId)) return;
          const sharedGen = Math.max(gen[persona.id], gen[partnerId]);
          if (gen[persona.id] !== sharedGen) {
            gen[persona.id] = sharedGen;
            changed = true;
          }
          if (gen[partnerId] !== sharedGen) {
            gen[partnerId] = sharedGen;
            changed = true;
          }
        });
      });

      guard += 1;
    }
    return changed;
  };

  // Primero respetamos exclusivamente la genealogía conocida.
  let hitGuard = relaxConstraints();

  // Las personas sin padres registrados ya no se amontonan automáticamente
  // en la primera fila. Estimamos el ritmo generacional real de la propia
  // base (mediana de la diferencia padre/madre -> hijo) y situamos cada
  // componente de pareja sin ascendencia conocida cerca de sus coetáneos.
  // Esto solo eleva raíces desconectadas: nunca mueve a un hijo por encima de
  // sus progenitores ni separa cónyuges/amantes de su misma fila.
  const parentAgeGaps = [];
  people.forEach((persona) => {
    if (!Number.isFinite(persona.nac)) return;
    [persona.padre, persona.madre].forEach((parentId) => {
      const parent = BY_ID[parentId];
      if (!knownIds.has(parentId) || !Number.isFinite(parent?.nac)) return;
      const gap = persona.nac - parent.nac;
      if (gap >= 14 && gap <= 65) parentAgeGaps.push(gap);
    });
  });
  const generationSpan = Math.max(23, Math.min(35, mediana(parentAgeGaps) || 28));

  const originSamples = people
    .filter((persona) => Number.isFinite(persona.nac)
      && [persona.padre, persona.madre].some((parentId) => knownIds.has(parentId)))
    .map((persona) => persona.nac - gen[persona.id] * generationSpan);
  const datedYears = people.map((persona) => persona.nac).filter(Number.isFinite);
  const originYear = mediana(originSamples)
    ?? (datedYears.length ? Math.min(...datedYears) : 1200);

  const visited = new Set();
  people.forEach((persona) => {
    if (visited.has(persona.id)) return;
    const component = [];
    const queue = [persona.id];
    visited.add(persona.id);

    while (queue.length) {
      const currentId = queue.shift();
      component.push(currentId);
      listaParejas(BY_ID[currentId]).forEach((partnerId) => {
        if (!knownIds.has(partnerId) || visited.has(partnerId)) return;
        visited.add(partnerId);
        queue.push(partnerId);
      });
    }

    const hasKnownParent = component.some((id) => {
      const member = BY_ID[id];
      return [member?.padre, member?.madre].some((parentId) => knownIds.has(parentId));
    });
    if (hasKnownParent) return;

    const cohortYear = mediana(component.map((id) => BY_ID[id]?.nac).filter(Number.isFinite));
    if (!Number.isFinite(cohortYear)) return;
    const targetGeneration = Math.max(
      ...component.map((id) => gen[id]),
      Math.max(0, Math.round((cohortYear - originYear) / generationSpan))
    );
    component.forEach((id) => {
      gen[id] = targetGeneration;
    });
  });

  // Al elevar una raíz coetánea, toda su descendencia debe acompañarla.
  hitGuard = relaxConstraints() || hitGuard;

  // Evita filas vacías por encima de la primera cohorte visible.
  const minGeneration = Math.min(...Object.values(gen));
  if (Number.isFinite(minGeneration) && minGeneration > 0) {
    Object.keys(gen).forEach((id) => {
      gen[id] -= minGeneration;
    });
  }

  if (hitGuard) {
    console.warn("[Árbol] El cálculo de generaciones alcanzó el límite de seguridad; revisa posibles ciclos de filiación.");
  }
  return gen;
}

function orderPartnerComponent(ids, adjacency, inputIndex) {
  if (ids.length <= 1) return ids.slice();

  const componentSet = new Set(ids);
  const edges = [];
  const degrees = Object.fromEntries(ids.map((id) => [id, 0]));
  ids.forEach((id) => {
    (adjacency[id] || []).forEach((otherId) => {
      if (!componentSet.has(otherId) || inputIndex[id] >= inputIndex[otherId]) return;
      edges.push([id, otherId]);
      degrees[id] += 1;
      degrees[otherId] += 1;
    });
  });

  const scoreOrder = (order) => {
    const pos = Object.fromEntries(order.map((id, index) => [id, index]));
    const center = (order.length - 1) / 2;
    let score = 0;

    edges.forEach(([a, b]) => {
      const distance = Math.abs(pos[a] - pos[b]);
      score += ((distance - 1) ** 2) * 1000 + distance * 12;
    });
    order.forEach((id) => {
      score += degrees[id] * Math.abs(pos[id] - center) * 4;
    });
    return score;
  };

  // En la base actual el componente mayor tiene seis personas. Probar todas
  // las permutaciones nos permite colocar el núcleo de cada unión en el centro
  // y reducir al mínimo la distancia entre parejas sin heurísticas frágiles.
  if (ids.length <= 7) {
    let best = null;
    let bestScore = Infinity;
    let bestTie = "";
    const used = new Set();
    const order = [];

    const visit = () => {
      if (order.length === ids.length) {
        const score = scoreOrder(order);
        const tie = order.map((id) => String(inputIndex[id]).padStart(5, "0")).join("|");
        if (score < bestScore || (score === bestScore && (!best || tie < bestTie))) {
          best = order.slice();
          bestScore = score;
          bestTie = tie;
        }
        return;
      }
      ids
        .slice()
        .sort((a, b) => (degrees[b] - degrees[a]) || (inputIndex[a] - inputIndex[b]))
        .forEach((id) => {
          if (used.has(id)) return;
          used.add(id);
          order.push(id);
          visit();
          order.pop();
          used.delete(id);
        });
    };
    visit();
    return best || ids.slice();
  }

  // Respaldo para futuras bases con componentes de pareja mucho mayores.
  const pending = new Set(ids);
  const start = ids.slice().sort((a, b) => (degrees[b] - degrees[a]) || (inputIndex[a] - inputIndex[b]))[0];
  const ordered = [start];
  pending.delete(start);
  while (pending.size) {
    const candidate = [...pending].sort((a, b) => {
      const aLinks = (adjacency[a] || []).filter((id) => ordered.includes(id)).length;
      const bLinks = (adjacency[b] || []).filter((id) => ordered.includes(id)).length;
      return bLinks - aLinks || degrees[b] - degrees[a] || inputIndex[a] - inputIndex[b];
    })[0];
    const leftCost = scoreOrder([candidate, ...ordered]);
    const rightCost = scoreOrder([...ordered, candidate]);
    if (leftCost < rightCost) ordered.unshift(candidate);
    else ordered.push(candidate);
    pending.delete(candidate);
  }
  return ordered;
}


// Cuando los filtros ocultan a una persona central, una unidad de pareja puede
// quedar partida en varios grupos. Los separamos para que dos ex-cónyuges que
// ya no tienen una persona visible en común no aparezcan pegados entre sí.
function splitPartnerComponents(ids, byId) {
  if (ids.length <= 1) return ids.length ? [ids.slice()] : [];
  const idSet = new Set(ids);
  const rank = Object.fromEntries(ids.map((id, index) => [id, index]));

  // La relación de pareja se trata como un vínculo simétrico aunque solo una
  // de las dos fichas declare conyuge/amantes. Esto evita que una pareja real
  // se separe al aplicar filtros (p. ej. Caterina Sforza y Popolano).
  const adjacency = Object.fromEntries(ids.map((id) => [id, new Set()]));
  ids.forEach((id) => {
    listaParejas(byId[id]).forEach((partnerId) => {
      if (!idSet.has(partnerId)) return;
      adjacency[id].add(partnerId);
      adjacency[partnerId].add(id);
    });
  });

  const seen = new Set();
  const components = [];
  ids.forEach((startId) => {
    if (seen.has(startId)) return;
    const queue = [startId];
    const component = [];
    seen.add(startId);
    while (queue.length) {
      const current = queue.shift();
      component.push(current);
      adjacency[current].forEach((partnerId) => {
        if (seen.has(partnerId)) return;
        seen.add(partnerId);
        queue.push(partnerId);
      });
    }
    component.sort((a, b) => rank[a] - rank[b]);
    components.push(component);
  });
  return components;
}

function orderPathIds(ids, adjacency, rank) {
  if (ids.length <= 1) return ids.slice();
  const idSet = new Set(ids);
  const degree = (id) => (adjacency[id] || []).filter((otherId) => idSet.has(otherId)).length;
  const endpoints = ids.filter((id) => degree(id) <= 1);
  const start = (endpoints.length ? endpoints : ids)
    .slice()
    .sort((a, b) => rank[a] - rank[b])[0];
  const ordered = [];
  const seen = new Set();
  let current = start;

  while (current && !seen.has(current)) {
    ordered.push(current);
    seen.add(current);
    const next = (adjacency[current] || [])
      .filter((otherId) => idSet.has(otherId) && !seen.has(otherId))
      .sort((a, b) => rank[a] - rank[b])[0];
    current = next;
  }

  ids
    .filter((id) => !seen.has(id))
    .sort((a, b) => rank[a] - rank[b])
    .forEach((id) => ordered.push(id));
  return ordered;
}

// Construye la geometría interna de una unidad de pareja sin dibujar líneas
// entre sus integrantes. Las cadenas de matrimonios sucesivos se mantienen
// como una sucesión de cajas normales en contacto. Cuando una persona reúne
// tres o más parejas, las parejas laterales vuelven al formato compacto de
// cajas pequeñas apiladas alrededor de la caja principal.
function createPartnerUnitBlueprint(ids, byId) {
  const rank = Object.fromEntries(ids.map((id, index) => [id, index]));
  const idSet = new Set(ids);
  const adjacency = Object.fromEntries(ids.map((id) => [id, []]));

  ids.forEach((id) => {
    listaParejas(byId[id]).forEach((partnerId) => {
      if (!idSet.has(partnerId)) return;
      if (!adjacency[id].includes(partnerId)) adjacency[id].push(partnerId);
      if (!adjacency[partnerId].includes(id)) adjacency[partnerId].push(id);
    });
  });

  const degree = Object.fromEntries(ids.map((id) => [id, adjacency[id].length]));
  const maxDegree = Math.max(0, ...Object.values(degree));
  const addContact = (contacts, a, b, points) => {
    if (!a || !b || !(adjacency[a] || []).includes(b)) return;
    contacts[clavePareja(a, b)] = {
      parentIds: [a, b],
      points,
    };
  };

  const fullSequence = (order) => {
    const boxes = order.map((id, index) => ({
      id,
      x: index * TREE_BOX_W,
      y: 0,
      w: TREE_BOX_W,
      h: TREE_BOX_H,
      mini: false,
    }));
    const contacts = {};
    for (let index = 0; index < order.length - 1; index += 1) {
      const a = order[index];
      const b = order[index + 1];
      addContact(contacts, a, b, [[(index + 1) * TREE_BOX_W, TREE_BOX_H]]);
    }
    return {
      ids: order.slice(),
      boxes,
      contacts,
      width: Math.max(TREE_BOX_W, order.length * TREE_BOX_W),
      height: TREE_BOX_H,
    };
  };

  if (ids.length <= 1) return fullSequence(ids);

  // Una pareja simple o una verdadera cadena de matrimonios sucesivos puede
  // representarse íntegramente como una fila de cajas normales en contacto.
  if (maxDegree <= 2) {
    return fullSequence(orderPathIds(ids, adjacency, rank));
  }

  const coreIds = ids.filter((id) => degree[id] > 1);
  const coreSet = new Set(coreIds);
  const coreAdjacency = Object.fromEntries(coreIds.map((id) => [
    id,
    adjacency[id].filter((otherId) => coreSet.has(otherId)),
  ]));
  const coreOrder = orderPathIds(coreIds, coreAdjacency, rank);

  // Si en el futuro aparece una estructura de parejas mucho más compleja que
  // un eje central con parejas laterales, priorizamos no perder a nadie y la
  // mostramos como secuencia completa.
  const coreEdges = coreOrder.slice(0, -1).every((id, index) =>
    (coreAdjacency[id] || []).includes(coreOrder[index + 1])
  );
  if (!coreOrder.length || !coreEdges) {
    return fullSequence(orderPartnerComponent(ids, adjacency, rank));
  }

  const leavesFor = (coreId) => (adjacency[coreId] || [])
    .filter((otherId) => !coreSet.has(otherId))
    .sort((a, b) => rank[a] - rank[b]);

  let leftMiniIds = [];
  let rightMiniIds = [];
  const topLeavesByCore = {};
  let leftSpineLeaf = null;
  let rightSpineLeaf = null;

  if (coreOrder.length === 1) {
    const hub = coreOrder[0];
    const leaves = leavesFor(hub);
    const hubIndex = rank[hub];
    const before = leaves.filter((id) => rank[id] < hubIndex);
    const after = leaves.filter((id) => rank[id] > hubIndex);
    if (before.length && after.length) {
      leftMiniIds = before;
      rightMiniIds = after;
    } else {
      const split = Math.ceil(leaves.length / 2);
      leftMiniIds = leaves.slice(0, split);
      rightMiniIds = leaves.slice(split);
    }
  } else {
    const firstCore = coreOrder[0];
    const lastCore = coreOrder[coreOrder.length - 1];
    const firstLeaves = leavesFor(firstCore);
    const lastLeaves = leavesFor(lastCore);

    // Un único matrimonio anterior/posterior prolonga el eje como en la
    // referencia de matrimonios sucesivos. Dos o más parejas permanecen en
    // una columna compacta al lado de la persona correspondiente.
    if (firstLeaves.length === 1) leftSpineLeaf = firstLeaves[0];
    else leftMiniIds = firstLeaves;
    if (lastLeaves.length === 1) rightSpineLeaf = lastLeaves[0];
    else rightMiniIds = lastLeaves;

    coreOrder.slice(1, -1).forEach((coreId) => {
      const leaves = leavesFor(coreId);
      if (leaves.length) topLeavesByCore[coreId] = leaves;
    });
  }

  const fullOrder = [
    ...(leftSpineLeaf ? [leftSpineLeaf] : []),
    ...coreOrder,
    ...(rightSpineLeaf ? [rightSpineLeaf] : []),
  ];
  const topLeafCount = Object.values(topLeavesByCore).reduce((sum, leaves) => sum + leaves.length, 0);
  const topHeight = topLeafCount ? TREE_MINI_MIN_H : 0;
  const miniHeightFor = (count) => {
    if (!count) return 0;
    if (count === 1) return Math.floor(TREE_BOX_H / 2);
    return Math.max(TREE_MINI_MIN_H, Math.floor(TREE_BOX_H / count));
  };
  const leftMiniH = miniHeightFor(leftMiniIds.length);
  const rightMiniH = miniHeightFor(rightMiniIds.length);
  const leftStackH = leftMiniH * leftMiniIds.length;
  const rightStackH = rightMiniH * rightMiniIds.length;
  const contentHeight = Math.max(TREE_BOX_H, leftStackH, rightStackH);
  const coreY = topHeight + (contentHeight - TREE_BOX_H) / 2;
  const unitHeight = topHeight + contentHeight;
  const hasLeftColumn = leftMiniIds.length > 0;
  const hasRightColumn = rightMiniIds.length > 0;
  const fullStartX = hasLeftColumn ? TREE_BOX_W : 0;
  const rightColumnX = fullStartX + fullOrder.length * TREE_BOX_W;
  const unitWidth = rightColumnX + (hasRightColumn ? TREE_BOX_W : 0);
  const boxes = [];
  const contacts = {};
  const fullBoxById = {};

  fullOrder.forEach((id, index) => {
    const box = {
      id,
      x: fullStartX + index * TREE_BOX_W,
      y: coreY,
      w: TREE_BOX_W,
      h: TREE_BOX_H,
      mini: false,
    };
    boxes.push(box);
    fullBoxById[id] = box;
  });

  for (let index = 0; index < fullOrder.length - 1; index += 1) {
    const a = fullOrder[index];
    const b = fullOrder[index + 1];
    addContact(
      contacts,
      a,
      b,
      [[fullStartX + (index + 1) * TREE_BOX_W, coreY + TREE_BOX_H]]
    );
  }

  if (leftMiniIds.length) {
    const hubId = coreOrder[0];
    const hubBox = fullBoxById[hubId];
    const stackY = topHeight + (contentHeight - leftStackH) / 2;
    leftMiniIds.forEach((id, index) => {
      const y = stackY + index * leftMiniH;
      const box = { id, x: 0, y, w: TREE_BOX_W, h: leftMiniH, mini: true, side: "left", hubId };
      boxes.push(box);
      const contactY = y + leftMiniH;
      const exitX = -TREE_PARTNER_EXIT_BASE - index * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, id, hubId, [[hubBox.x, contactY], [exitX, contactY]]);
    });
  }

  if (rightMiniIds.length) {
    const hubId = coreOrder[coreOrder.length - 1];
    const hubBox = fullBoxById[hubId];
    const stackY = topHeight + (contentHeight - rightStackH) / 2;
    rightMiniIds.forEach((id, index) => {
      const y = stackY + index * rightMiniH;
      const box = { id, x: rightColumnX, y, w: TREE_BOX_W, h: rightMiniH, mini: true, side: "right", hubId };
      boxes.push(box);
      const contactY = y + rightMiniH;
      const exitX = unitWidth + TREE_PARTNER_EXIT_BASE + index * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, hubId, id, [[hubBox.x + hubBox.w, contactY], [exitX, contactY]]);
    });
  }

  let topLeftExit = 0;
  let topRightExit = 0;
  Object.entries(topLeavesByCore).forEach(([hubId, leaves]) => {
    const hubBox = fullBoxById[hubId];
    const miniW = TREE_BOX_W / leaves.length;
    leaves.forEach((id, index) => {
      const x = hubBox.x + index * miniW;
      const y = coreY - TREE_MINI_MIN_H;
      boxes.push({ id, x, y, w: miniW, h: TREE_MINI_MIN_H, mini: true, side: "top", hubId });
      const contactX = x + miniW / 2;
      const goLeft = contactX <= hubBox.x + hubBox.w / 2;
      const boundaryX = goLeft ? hubBox.x : hubBox.x + hubBox.w;
      const exitIndex = goLeft ? topLeftExit++ : topRightExit++;
      const exitX = goLeft
        ? -TREE_PARTNER_EXIT_BASE - exitIndex * TREE_PARTNER_EXIT_STEP
        : unitWidth + TREE_PARTNER_EXIT_BASE + exitIndex * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, hubId, id, [[contactX, coreY], [boundaryX, coreY], [exitX, coreY]]);
    });
  });

  if (boxes.length !== ids.length) {
    return fullSequence(orderPartnerComponent(ids, adjacency, rank));
  }

  return {
    ids: ids.slice(),
    boxes,
    contacts,
    width: Math.max(TREE_BOX_W, unitWidth),
    height: Math.max(TREE_BOX_H, unitHeight),
  };
}

function buildRows(people, gen) {
  const maxGen = Math.max(0, ...Object.values(gen));
  const rows = Array.from({ length: maxGen + 1 }, () => []);
  const inputIndex = Object.fromEntries(people.map((persona, index) => [persona.id, index]));
  const knownIds = new Set(people.map((persona) => persona.id));
  const partnerAdj = Object.fromEntries(people.map((persona) => [persona.id, []]));

  people.forEach((persona) => {
    listaParejas(persona).forEach((partnerId) => {
      if (!knownIds.has(partnerId) || gen[partnerId] !== gen[persona.id]) return;
      if (!partnerAdj[persona.id].includes(partnerId)) partnerAdj[persona.id].push(partnerId);
      if (!partnerAdj[partnerId].includes(persona.id)) partnerAdj[partnerId].push(persona.id);
    });
  });

  const used = new Set();
  people.forEach((persona) => {
    if (used.has(persona.id)) return;
    const component = [];
    const queue = [persona.id];
    used.add(persona.id);
    while (queue.length) {
      const current = queue.shift();
      component.push(current);
      (partnerAdj[current] || []).forEach((partnerId) => {
        if (!used.has(partnerId)) {
          used.add(partnerId);
          queue.push(partnerId);
        }
      });
    }
    rows[gen[persona.id]].push(orderPartnerComponent(component, partnerAdj, inputIndex));
  });

  const childrenOf = {};
  people.forEach((persona) => {
    [persona.padre, persona.madre].filter((id) => knownIds.has(id)).forEach((parentId) => {
      (childrenOf[parentId] ||= []).push(persona.id);
    });
  });

  const normalizedOrder = (rowsState) => rowsState.map((row) => {
    const order = new Map();
    const total = row.reduce((sum, unit) => sum + unit.length, 0) + Math.max(0, row.length - 1) * 0.58;
    let cursor = 0;
    row.forEach((unit) => {
      const center = total > 0 ? (cursor + unit.length / 2) / total : 0.5;
      unit.forEach((id) => order.set(id, center));
      cursor += unit.length + 0.58;
    });
    return order;
  });

  const sortRow = (row, refFn) => row
    .map((unit, originalIndex) => {
      const refs = unit.flatMap((id) => refFn(id)).filter(Number.isFinite);
      return {
        unit,
        originalIndex,
        key: refs.length ? mediana(refs) : originalIndex,
      };
    })
    .sort((a, b) => a.key - b.key || a.originalIndex - b.originalIndex)
    .map(({ unit }) => unit);

  const scoreRows = (rowsState) => {
    const order = normalizedOrder(rowsState);
    const edgesByLayer = {};
    let distanceScore = 0;
    const siblingGroups = {};

    people.forEach((child) => {
      const childOrder = order[gen[child.id]]?.get(child.id);
      if (!Number.isFinite(childOrder)) return;
      const familyKey = [child.padre, child.madre].filter((id) => knownIds.has(id)).sort().join("|") || child.id;
      (siblingGroups[`${familyKey}@${gen[child.id]}`] ||= []).push(childOrder);

      [child.padre, child.madre].forEach((parentId) => {
        if (!knownIds.has(parentId)) return;
        const parentOrder = order[gen[parentId]]?.get(parentId);
        if (!Number.isFinite(parentOrder)) return;
        const layerKey = `${gen[parentId]}>${gen[child.id]}`;
        (edgesByLayer[layerKey] ||= []).push({
          source: parentOrder,
          target: childOrder,
          familyKey,
        });
        distanceScore += Math.abs(parentOrder - childOrder);
      });
    });

    let crossings = 0;
    Object.values(edgesByLayer).forEach((edges) => {
      for (let i = 0; i < edges.length; i += 1) {
        for (let j = i + 1; j < edges.length; j += 1) {
          if (edges[i].familyKey === edges[j].familyKey) continue;
          if ((edges[i].source - edges[j].source) * (edges[i].target - edges[j].target) < 0) crossings += 1;
        }
      }
    });

    let siblingSpread = 0;
    Object.values(siblingGroups).forEach((values) => {
      if (values.length > 1) siblingSpread += Math.max(...values) - Math.min(...values);
    });

    return crossings * 100000 + siblingSpread * 700 + distanceScore * 100;
  };

  let current = rows.map((row) => row.map((unit) => unit.slice()));
  let best = current.map((row) => row.map((unit) => unit.slice()));
  let bestScore = scoreRows(best);

  for (let pass = 0; pass < 12; pass += 1) {
    let order = normalizedOrder(current);
    if (pass % 2 === 0) {
      for (let rowIndex = 1; rowIndex <= maxGen; rowIndex += 1) {
        current[rowIndex] = sortRow(current[rowIndex], (id) => {
          const persona = BY_ID[id];
          if (!persona) return [];
          return [persona.padre, persona.madre]
            .map((parentId) => order[gen[parentId]]?.get(parentId))
            .filter(Number.isFinite);
        });
        order = normalizedOrder(current);
      }
    } else {
      for (let rowIndex = maxGen - 1; rowIndex >= 0; rowIndex -= 1) {
        current[rowIndex] = sortRow(current[rowIndex], (id) =>
          (childrenOf[id] || [])
            .map((childId) => order[gen[childId]]?.get(childId))
            .filter(Number.isFinite)
        );
        order = normalizedOrder(current);
      }
    }

    const score = scoreRows(current);
    if (score < bestScore) {
      bestScore = score;
      best = current.map((row) => row.map((unit) => unit.slice()));
    }
  }

  // Última pasada local: un intercambio adyacente solo se conserva si
  // reduce cruces, distancia entre generaciones o dispersión de hermanos.
  current = best.map((row) => row.map((unit) => unit.slice()));
  for (let round = 0; round < 2; round += 1) {
    for (let rowIndex = 0; rowIndex < current.length; rowIndex += 1) {
      for (let index = 0; index < current[rowIndex].length - 1; index += 1) {
        const before = scoreRows(current);
        [current[rowIndex][index], current[rowIndex][index + 1]] = [current[rowIndex][index + 1], current[rowIndex][index]];
        const after = scoreRows(current);
        if (after < before) {
          if (after < bestScore) {
            bestScore = after;
            best = current.map((row) => row.map((unit) => unit.slice()));
          }
        } else {
          [current[rowIndex][index], current[rowIndex][index + 1]] = [current[rowIndex][index + 1], current[rowIndex][index]];
        }
      }
    }
  }

  return best;
}

function pavaNonDecreasing(targets, weights) {
  const blocks = targets.map((value, index) => ({
    start: index,
    end: index,
    weight: weights[index],
    value,
  }));

  for (let index = 0; index < blocks.length - 1;) {
    if (blocks[index].value <= blocks[index + 1].value) {
      index += 1;
      continue;
    }
    const left = blocks[index];
    const right = blocks[index + 1];
    const weight = left.weight + right.weight;
    blocks.splice(index, 2, {
      start: left.start,
      end: right.end,
      weight,
      value: (left.value * left.weight + right.value * right.weight) / weight,
    });
    if (index > 0) index -= 1;
  }

  const result = Array(targets.length);
  blocks.forEach((block) => {
    for (let index = block.start; index <= block.end; index += 1) result[index] = block.value;
  });
  return result;
}

function computeTreeLayout(rows, byId, childrenById) {
  const rowUnits = rows.map((row, rowIndex) => {
    const blueprints = row.map((ids) => createPartnerUnitBlueprint(ids, byId));
    const totalWidth = blueprints.reduce((sum, unit) => sum + unit.width, 0)
      + Math.max(0, blueprints.length - 1) * TREE_UNIT_GAP;
    let cursor = -totalWidth / 2;
    return blueprints.map((blueprint, unitIndex) => {
      const unit = {
        ...blueprint,
        key: `${rowIndex}-${unitIndex}-${blueprint.ids.join("-")}`,
        row: rowIndex,
        x: cursor,
      };
      cursor += unit.width + TREE_UNIT_GAP;
      return unit;
    });
  });

  const rebuildUnitByPerson = () => {
    const map = {};
    rowUnits.forEach((row) => row.forEach((unit) => unit.ids.forEach((id) => { map[id] = unit; })));
    return map;
  };

  const repositionRow = (rowIndex, direction) => {
    const row = rowUnits[rowIndex];
    if (!row.length) return;
    const unitByPerson = rebuildUnitByPerson();
    const offsets = [];
    let offset = 0;
    row.forEach((unit, index) => {
      offsets[index] = offset;
      offset += unit.width + TREE_UNIT_GAP;
    });

    const targets = [];
    const weights = [];
    row.forEach((unit, index) => {
      const references = [];
      unit.ids.forEach((id) => {
        const persona = byId[id];
        if (!persona) return;
        const linkedIds = direction === "down"
          ? [persona.padre, persona.madre]
          : (childrenById[id] || []);
        linkedIds.forEach((linkedId) => {
          const linkedUnit = unitByPerson[linkedId];
          if (linkedUnit) references.push(linkedUnit.x + linkedUnit.width / 2);
        });
      });

      const currentCenter = unit.x + unit.width / 2;
      const targetCenter = references.length
        ? currentCenter * 0.18 + mediana(references) * 0.82
        : currentCenter;
      targets[index] = targetCenter - unit.width / 2 - offsets[index];
      weights[index] = references.length ? Math.min(6, references.length + 1) : 0.35;
    });

    const fitted = pavaNonDecreasing(targets, weights);
    row.forEach((unit, index) => {
      unit.x = fitted[index] + offsets[index];
    });
  };

  for (let pass = 0; pass < 10; pass += 1) {
    for (let rowIndex = 1; rowIndex < rowUnits.length; rowIndex += 1) repositionRow(rowIndex, "down");
    for (let rowIndex = rowUnits.length - 2; rowIndex >= 0; rowIndex -= 1) repositionRow(rowIndex, "up");
  }

  const allUnits = rowUnits.flat();
  const minX = allUnits.length ? Math.min(...allUnits.map((unit) => unit.x)) : 0;
  const shiftX = TREE_PAD_X - minX;
  allUnits.forEach((unit) => { unit.x += shiftX; });

  const rowHeights = rowUnits.map((row) => Math.max(TREE_BOX_H, ...row.map((unit) => unit.height)));
  const rowTops = [];
  let nextRowTop = TREE_PAD_TOP;
  rowHeights.forEach((height, rowIndex) => {
    rowTops[rowIndex] = nextRowTop;
    nextRowTop += height + TREE_ROW_GAP;
  });

  const positions = {};
  const pairContacts = {};
  allUnits.forEach((unit) => {
    const rowHeight = rowHeights[unit.row] || TREE_BOX_H;
    unit.y = rowTops[unit.row] + (rowHeight - unit.height) / 2;
    unit.boxes.forEach((box) => {
      positions[box.id] = {
        x: unit.x + box.x,
        y: unit.y + box.y,
        w: box.w,
        h: box.h,
        row: unit.row,
        unitKey: unit.key,
        mini: box.mini,
        side: box.side,
        hubId: box.hubId,
      };
    });
    Object.entries(unit.contacts || {}).forEach(([pairKey, contact]) => {
      pairContacts[pairKey] = {
        ...contact,
        unitKey: unit.key,
        points: contact.points.map(([x, y]) => [unit.x + x, unit.y + y]),
      };
    });
  });

  const maxX = allUnits.length ? Math.max(...allUnits.map((unit) => unit.x + unit.width)) : 0;
  const width = Math.max(1200, maxX + TREE_PAD_X);
  const height = Math.max(
    700,
    (rowTops[rowTops.length - 1] ?? TREE_PAD_TOP)
      + (rowHeights[rowHeights.length - 1] ?? TREE_BOX_H)
      + TREE_PAD_BOTTOM
  );

  const rowBands = rows.map((_, rowIndex) => {
    const top = rowTops[rowIndex] ?? (TREE_PAD_TOP + rowIndex * TREE_ROW_STEP);
    return [top, top + (rowHeights[rowIndex] || TREE_BOX_H)];
  });

  return {
    positions,
    pairContacts,
    units: allUnits,
    rowUnits,
    rowBands,
    rowHeights,
    width,
    height,
  };
}

function mergeIntervals(intervals, margin = 0) {
  const sorted = intervals
    .map(([start, end]) => [Math.min(start, end), Math.max(start, end)])
    .sort((a, b) => a[0] - b[0]);
  const merged = [];
  sorted.forEach(([start, end]) => {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + margin) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  });
  return merged;
}

function assignIntervalLanes(requests, margin = 10) {
  if (!requests.length) return { assignment: {}, count: 0 };
  const lanes = [];
  requests
    .slice()
    .sort((a, b) => a.x1 - b.x1 || a.x2 - b.x2)
    .forEach((request) => {
      let bestLane = -1;
      let bestEnd = -Infinity;
      lanes.forEach((lane, index) => {
        if (lane.end + margin <= request.x1 && lane.end > bestEnd) {
          bestLane = index;
          bestEnd = lane.end;
        }
      });
      if (bestLane < 0) {
        lanes.push({ end: request.x2, requests: [request] });
      } else {
        lanes[bestLane].requests.push(request);
        lanes[bestLane].end = Math.max(lanes[bestLane].end, request.x2);
      }
    });

  const orderedLanes = lanes
    .map((lane) => ({
      ...lane,
      preference: lane.requests.reduce((sum, request) => sum + (request.preference ?? 0.5), 0) / lane.requests.length,
    }))
    .sort((a, b) => a.preference - b.preference);

  const assignment = {};
  orderedLanes.forEach((lane, laneIndex) => {
    lane.requests.forEach((request) => { assignment[request.id] = laneIndex; });
  });
  return { assignment, count: orderedLanes.length };
}

function computeColumnCandidates(rowsData, positions, canvasWidth, rowStart, rowEnd) {
  const occupied = [];
  rowsData.forEach((row, rowIndex) => {
    if (rowIndex < rowStart || rowIndex > rowEnd) return;
    row.flat().forEach((id) => {
      const pos = positions[id];
      if (pos) occupied.push([pos.x - 8, pos.x + pos.w + 8]);
    });
  });

  const merged = mergeIntervals(occupied, 2);
  const gaps = [];
  let cursor = 8;
  merged.forEach(([start, end]) => {
    if (start > cursor) gaps.push([cursor, start]);
    cursor = Math.max(cursor, end);
  });
  if (cursor < canvasWidth - 8) gaps.push([cursor, canvasWidth - 8]);
  if (!gaps.length) gaps.push([8, canvasWidth - 8]);

  const candidates = [];
  gaps.forEach(([start, end]) => {
    const low = start + 8;
    const high = end - 8;
    if (high < low) {
      candidates.push((start + end) / 2);
      return;
    }
    const count = Math.max(1, Math.floor((high - low) / TREE_COLUMN_STEP) + 1);
    const usedWidth = (count - 1) * TREE_COLUMN_STEP;
    const first = (low + high - usedWidth) / 2;
    for (let index = 0; index < count; index += 1) candidates.push(first + index * TREE_COLUMN_STEP);
  });
  return [...new Set(candidates.map((value) => Math.round(value * 10) / 10))];
}

function claimColumn(candidates, targetX, claims, yStart, yEnd, familyKey) {
  const lo = Math.min(yStart, yEnd);
  const hi = Math.max(yStart, yEnd);
  const sorted = candidates.slice().sort((a, b) => Math.abs(a - targetX) - Math.abs(b - targetX));

  // Una columna visual pertenece a UNA sola familia. La única excepción son
  // los grupos del mismo familyKey: hermanos completos que han quedado en
  // generaciones distintas y, por tanto, deben prolongar el mismo tronco.
  // Aunque dos familias no se solapen verticalmente, reutilizar exactamente la
  // misma X hace que parezcan una línea continua y visualmente las "emparenta".
  const conflictsFor = (x) => {
    let conflicts = 0;
    claims.forEach((claim) => {
      if (claim.familyKey === familyKey) return;
      const sameVisualColumn = Math.abs(x - claim.x) < TREE_COLUMN_STEP * 0.82;
      if (!sameVisualColumn) return;
      const overlapsVertically = lo < claim.yEnd + 8 && hi > claim.yStart - 8;
      conflicts += overlapsVertically ? 1000 : 100;
    });
    return conflicts;
  };

  let selected = sorted.find((x) => conflictsFor(x) === 0);
  if (!Number.isFinite(selected)) {
    selected = sorted
      .map((x) => ({ x, conflicts: conflictsFor(x), distance: Math.abs(x - targetX) }))
      .sort((a, b) => a.conflicts - b.conflicts || a.distance - b.distance)[0]?.x;
  }
  if (!Number.isFinite(selected)) selected = targetX;
  claims.push({ x: selected, yStart: lo, yEnd: hi, familyKey });
  return selected;
}

function dedupePts(points) {
  if (!points.length) return [];
  const result = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    const [previousX, previousY] = result[result.length - 1];
    if (Math.abs(x - previousX) > 0.5 || Math.abs(y - previousY) > 0.5) result.push(points[index]);
  }
  return result;
}

function dist(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}

function pointToward(x1, y1, x2, y2, distance) {
  const length = dist(x1, y1, x2, y2) || 1;
  const factor = Math.min(distance, length / 2) / length;
  return [x1 + (x2 - x1) * factor, y1 + (y2 - y1) * factor];
}

function roundedPath(rawPoints, radius = 8) {
  const points = dedupePts(rawPoints);
  if (!points.length) return "";
  if (points.length < 3) return `M ${points.map((point) => point.join(" ")).join(" L ")}`;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const before = pointToward(x1, y1, x0, y0, radius);
    const after = pointToward(x1, y1, x2, y2, radius);
    d += ` L ${before[0]} ${before[1]} Q ${x1} ${y1} ${after[0]} ${after[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
}

function routeFamilyConnectors({ groupsByRow, positions, pairContacts, gen, rows, rowBands, canvasWidth }) {
  if (!Object.keys(positions).length) return { families: [], diagnostics: {} };

  // Mantener la geometría V17: cada fila de hijos conserva su barra y sus
  // curvas propias. Lo único que se comparte entre hermanos completos que
  // han caído en generaciones visuales distintas es la salida desde los
  // mismos progenitores (carril superior + canal vertical).
  const visibleGroups = Object.values(groupsByRow).flatMap((groups) => groups).map((group) => {
    const parentIds = group.parentIds.filter((id) => positions[id]);
    const childIds = group.childIds.filter((id) => positions[id]);
    if (!parentIds.length || !childIds.length) return null;
    const parentRow = Math.max(...parentIds.map((id) => gen[id]));
    const childRow = gen[childIds[0]];
    if (!Number.isFinite(childRow) || childRow <= parentRow) return null;
    const childXs = childIds.map((id) => positions[id].x + positions[id].w / 2).sort((a, b) => a - b);
    const familyBaseKey = group.familyBaseKey || group.parentIds.slice().sort().join("|");
    return {
      ...group,
      parentIds,
      childIds,
      parentRow,
      childRow,
      childXs,
      childCenter: (childXs[0] + childXs[childXs.length - 1]) / 2,
      familyBaseKey,
      familyKey: `${familyBaseKey}@${childRow}`,
    };
  }).filter(Boolean);

  const groupsByFamily = {};
  visibleGroups.forEach((group) => {
    (groupsByFamily[group.familyBaseKey] ||= []).push(group);
  });

  const verticalClaims = [];
  Object.values(groupsByFamily).forEach((familyGroups) => {
    const first = familyGroups[0];
    const parentCenters = first.parentIds.map((id) => positions[id].x + positions[id].w / 2);
    const pair = first.parentIds.length === 2 ? clavePareja(first.parentIds[0], first.parentIds[1]) : null;
    const contact = pair ? pairContacts?.[pair] : null;
    const fallbackAnchor = {
      x: parentCenters.reduce((sum, value) => sum + value, 0) / parentCenters.length,
      y: Math.max(...first.parentIds.map((id) => positions[id].y + positions[id].h)),
    };
    const anchorPoints = contact?.points?.length
      ? contact.points.map(([x, y]) => [x, y])
      : [[fallbackAnchor.x, fallbackAnchor.y]];
    const [anchorX, anchorY] = anchorPoints[anchorPoints.length - 1];

    familyGroups.forEach((group) => {
      group.anchorPoints = anchorPoints;
      group.anchor = { x: anchorX, y: anchorY };
    });

    const nonDirect = familyGroups.filter((group) => group.childRow > group.parentRow + 1);
    if (!nonDirect.length) return;

    // Un solo canal para todos los hermanos completos, calculado hasta el hijo
    // visualmente más profundo. No se usa el centro de los hijos para elegirlo:
    // su referencia es exclusivamente el anclaje real de los progenitores.
    const deepestChildRow = Math.max(...nonDirect.map((group) => group.childRow));
    const deepestGroup = nonDirect.find((group) => group.childRow === deepestChildRow) || nonDirect[nonDirect.length - 1];
    const candidates = computeColumnCandidates(rows, positions, canvasWidth, first.parentRow + 1, deepestChildRow - 1);
    const sharedTrunkX = claimColumn(
      candidates,
      anchorX,
      verticalClaims,
      rowBands[first.parentRow]?.[1] ?? anchorY,
      rowBands[deepestChildRow]?.[0] ?? positions[nonDirect[nonDirect.length - 1].childIds[0]].y,
      first.familyBaseKey
    );
    nonDirect.forEach((group) => {
      group.trunkX = sharedTrunkX;
      group.sharedTrunkOwner = group === deepestGroup;
    });
  });

  const horizontalRequestsByGap = {};
  Object.values(groupsByFamily).forEach((familyGroups) => {
    const first = familyGroups[0];
    const parentRequestId = `${first.familyBaseKey}:parent-shared`;
    const directGroups = familyGroups.filter((group) => group.childRow === group.parentRow + 1);
    const nonDirectGroups = familyGroups.filter((group) => group.childRow > group.parentRow + 1);

    // Reservar UN solo carril inmediatamente bajo los progenitores para todos
    // los hermanos completos, aunque terminen dibujados varias filas más abajo.
    const parentXs = [first.anchor.x];
    directGroups.forEach((group) => parentXs.push(group.childXs[0], group.childXs[group.childXs.length - 1]));
    nonDirectGroups.forEach((group) => parentXs.push(group.trunkX));
    (horizontalRequestsByGap[first.parentRow] ||= []).push({
      id: parentRequestId,
      x1: Math.min(...parentXs),
      x2: Math.max(...parentXs),
      preference: directGroups.length ? 0.5 : 0,
    });

    familyGroups.forEach((group) => {
      group.startRequestId = parentRequestId;
      if (group.childRow === group.parentRow + 1) {
        group.endRequestId = parentRequestId;
        return;
      }
      const endId = `${group.familyKey}:end`;
      (horizontalRequestsByGap[group.childRow - 1] ||= []).push({
        id: endId,
        x1: Math.min(group.trunkX, group.childXs[0]),
        x2: Math.max(group.trunkX, group.childXs[group.childXs.length - 1]),
        preference: 1,
      });
      group.endRequestId = endId;
    });
  });

  const laneAssignmentsByGap = {};
  const laneCountsByGap = {};
  Object.entries(horizontalRequestsByGap).forEach(([gapKey, requests]) => {
    const gap = Number(gapKey);
    const result = assignIntervalLanes(requests, 12);
    laneAssignmentsByGap[gap] = result.assignment;
    laneCountsByGap[gap] = result.count;
  });

  const laneY = (gap, requestId) => {
    const rowBottom = rowBands[gap]?.[1] ?? (TREE_PAD_TOP + gap * TREE_ROW_STEP + TREE_BOX_H);
    const nextTop = rowBands[gap + 1]?.[0] ?? (rowBottom + TREE_ROW_GAP);
    let top = rowBottom + 18;
    let bottom = nextTop - 22;
    if (bottom <= top) {
      top = rowBottom + 12;
      bottom = nextTop - 12;
    }
    const count = Math.max(1, laneCountsByGap[gap] || 1);
    const lane = laneAssignmentsByGap[gap]?.[requestId] ?? 0;
    return top + ((lane + 1) * (bottom - top)) / (count + 1);
  };

  const allChildrenByFamily = {};
  Object.entries(groupsByFamily).forEach(([familyKey, groups]) => {
    allChildrenByFamily[familyKey] = [...new Set(groups.flatMap((group) => group.childIds))];
  });

  const families = visibleGroups.map((group) => {
    const startY = laneY(group.parentRow, group.startRequestId);
    const endY = laneY(group.childRow - 1, group.endRequestId);
    const childMin = group.childXs[0];
    const childMax = group.childXs[group.childXs.length - 1];
    const direct = group.childRow === group.parentRow + 1;
    const busOriginX = direct ? group.anchor.x : group.trunkX;
    const busY = direct ? startY : endY;

    // Geometría V17, con una única corrección direccional: los extremos se
    // curvan HACIA el origen real de su barra. Así nunca hacen primero un giro
    // en sentido contrario para después corregirlo.
    const branchSpecs = group.childIds.map((childId) => {
      const childPos = positions[childId];
      const childX = childPos.x + childPos.w / 2;
      const isOnlyChild = group.childIds.length === 1;
      const isLeftEnd = Math.abs(childX - childMin) < 0.75;
      const isRightEnd = Math.abs(childX - childMax) < 0.75;
      let startX = childX;

      if ((isOnlyChild || isLeftEnd || isRightEnd) && Math.abs(busOriginX - childX) > 1) {
        startX = childX + Math.sign(busOriginX - childX) * Math.min(20, Math.abs(busOriginX - childX));
      }
      return { childId, childPos, childX, startX };
    });

    const branchStartMin = Math.min(...branchSpecs.map((branch) => branch.startX));
    const branchStartMax = Math.max(...branchSpecs.map((branch) => branch.startX));
    const busMin = Math.min(busOriginX, branchStartMin);
    const busMax = Math.max(busOriginX, branchStartMax);
    const [anchorTailX] = group.anchorPoints[group.anchorPoints.length - 1];

    const BUS_ENTRY_RADIUS = 11;
    const hasLeftArm = busMin < busOriginX - 0.5;
    const hasRightArm = busMax > busOriginX + 0.5;
    const hasBusArm = hasLeftArm || hasRightArm;
    const trunkEndY = hasBusArm ? busY - BUS_ENTRY_RADIUS : busY;

    const trunkPoints = direct
      ? [...group.anchorPoints, [anchorTailX, trunkEndY], [busOriginX, trunkEndY]]
      : [...group.anchorPoints, [anchorTailX, startY], [group.trunkX, startY], [group.trunkX, trunkEndY]];

    const busDs = [];
    if (hasLeftArm) {
      busDs.push(roundedPath([
        [busOriginX, trunkEndY],
        [busOriginX, busY],
        [busMin, busY],
      ], BUS_ENTRY_RADIUS));
    }
    if (hasRightArm) {
      busDs.push(roundedPath([
        [busOriginX, trunkEndY],
        [busOriginX, busY],
        [busMax, busY],
      ], BUS_ENTRY_RADIUS));
    }

    return {
      key: group.familyKey,
      familyBaseKey: group.familyBaseKey,
      parentIds: group.parentIds,
      childIds: group.childIds,
      allChildIds: allChildrenByFamily[group.familyBaseKey] || group.childIds,
      trunkD: direct || group.sharedTrunkOwner ? roundedPath(trunkPoints, 11) : "",
      busDs,
      branches: branchSpecs.map(({ childId, childPos, childX, startX }) => {
        const points = Math.abs(startX - childX) > 0.5
          ? [[startX, busY], [childX, busY], [childX, childPos.y]]
          : [[childX, busY], [childX, childPos.y]];
        return {
          childId,
          d: roundedPath(points, 10),
        };
      }),
    };
  });

  return {
    families,
    diagnostics: {
      familyGroups: families.length,
      sharedSiblingBuses: families.filter((family) => family.childIds.length > 1).length,
      sharedMultiRowFamilies: Object.values(groupsByFamily).filter((groups) => groups.length > 1).length,
      verticalColumns: verticalClaims.length,
      maxHorizontalLanes: Math.max(0, ...Object.values(laneCountsByGap)),
    },
  };
}

function ancestorsOf(id) {
  const set = new Set(BY_ID[id] ? [id] : []);
  const climb = (pid) => {
    if (!pid || set.has(pid) || !BY_ID[pid]) return;
    set.add(pid);
    const persona = BY_ID[pid];
    climb(persona.padre);
    climb(persona.madre);
  };
  const start = BY_ID[id];
  if (start) { climb(start.padre); climb(start.madre); }
  return set;
}

function descendantsOf(id) {
  const set = new Set(BY_ID[id] ? [id] : []);
  const queue = BY_ID[id] ? [id] : [];
  while (queue.length) {
    const actual = queue.shift();
    (HIJOS_POR_ID[actual] || []).forEach((hijoId) => {
      if (!set.has(hijoId) && BY_ID[hijoId]) {
        set.add(hijoId);
        queue.push(hijoId);
      }
    });
  }
  return set;
}

const MODOS_COMPARACION = [
  { id: "corto", label: "Camino más corto", descripcion: "Sangre, matrimonios y amantes" },
  { id: "sangre", label: "Solo sangre", descripcion: "Únicamente relaciones padre/madre-hijo" },
  { id: "matrimonio", label: "Sangre + matrimonios", descripcion: "Excluye las relaciones de amantes" },
  { id: "rutas", label: "Rutas relevantes", descripcion: "Hasta seis caminos mínimos alternativos" },
];

const TIPOS_GRAFO_POR_MODO = {
  corto: new Set(["sangre", "matrimonio", "amante"]),
  sangre: new Set(["sangre"]),
  matrimonio: new Set(["sangre", "matrimonio"]),
  rutas: new Set(["sangre", "matrimonio", "amante"]),
};

function buildGraph(people) {
  const idsConocidos = new Set(people.map((persona) => persona.id));
  const adj = Object.fromEntries(people.map((persona) => [persona.id, new Map()]));
  const addPair = (a, b, tipo) => {
    if (!a || !b || a === b || !idsConocidos.has(a) || !idsConocidos.has(b)) return;
    const registrar = (origen, destino) => {
      const tipos = adj[origen].get(destino) || new Set();
      tipos.add(tipo);
      adj[origen].set(destino, tipos);
    };
    registrar(a, b);
    registrar(b, a);
  };

  people.forEach((persona) => {
    addPair(persona.id, persona.padre, "sangre");
    addPair(persona.id, persona.madre, "sangre");
    listaConyuges(persona).forEach((id) => addPair(persona.id, id, "matrimonio"));
    listaAmantes(persona).forEach((id) => addPair(persona.id, id, "amante"));
  });

  return Object.fromEntries(
    Object.entries(adj).map(([id, vecinos]) => [
      id,
      [...vecinos.entries()].map(([vecinoId, tipos]) => ({ id: vecinoId, tipos: [...tipos] })),
    ])
  );
}

function tipoRelacionEntre(origenId, destinoId) {
  const origen = BY_ID[origenId];
  const destino = BY_ID[destinoId];
  if (!origen || !destino) return "relación";
  if (origen.padre === destinoId) return "padre";
  if (origen.madre === destinoId) return "madre";
  if (destino.padre === origenId || destino.madre === origenId) return "hijo/a";
  if (listaConyuges(origen).includes(destinoId) || listaConyuges(destino).includes(origenId)) return "cónyuge";
  if (listaAmantes(origen).includes(destinoId) || listaAmantes(destino).includes(origenId)) return "amante";
  return "familia";
}

function vecinosPermitidos(graph, id, tiposPermitidos) {
  return (graph[id] || []).filter((vecino) =>
    vecino.tipos.some((tipo) => tiposPermitidos.has(tipo))
  );
}

function bfsPath(graph, start, end, tiposPermitidos) {
  if (!start || !end) return null;
  if (start === end) return [start];
  const visited = new Set([start]);
  const prev = {};
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const vecino of vecinosPermitidos(graph, cur, tiposPermitidos)) {
      const nb = vecino.id;
      if (visited.has(nb)) continue;
      visited.add(nb);
      prev[nb] = cur;
      if (nb === end) {
        const path = [nb];
        let actual = nb;
        while (actual !== start) {
          actual = prev[actual];
          path.unshift(actual);
        }
        return path;
      }
      queue.push(nb);
    }
  }
  return null;
}

function allShortestPaths(graph, start, end, tiposPermitidos, maxPaths = 6) {
  if (!start || !end) return [];
  if (start === end) return [[start]];

  const distance = { [start]: 0 };
  const predecessors = {};
  const queue = [start];
  let targetDistance = Infinity;

  while (queue.length) {
    const current = queue.shift();
    const currentDistance = distance[current];
    if (currentDistance >= targetDistance) continue;

    for (const vecino of vecinosPermitidos(graph, current, tiposPermitidos)) {
      const next = vecino.id;
      const nextDistance = currentDistance + 1;
      if (distance[next] === undefined) {
        distance[next] = nextDistance;
        predecessors[next] = [current];
        if (next === end) targetDistance = nextDistance;
        queue.push(next);
      } else if (distance[next] === nextDistance) {
        (predecessors[next] ||= []).push(current);
      }
    }
  }

  if (distance[end] === undefined) return [];
  const paths = [];
  const currentPath = [end];
  const build = (node) => {
    if (paths.length >= maxPaths) return;
    if (node === start) {
      paths.push([...currentPath].reverse());
      return;
    }
    const prevs = (predecessors[node] || []).slice().sort((a, b) =>
      (BY_ID[a]?.nombre || a).localeCompare(BY_ID[b]?.nombre || b, "es")
    );
    for (const prev of prevs) {
      currentPath.push(prev);
      build(prev);
      currentPath.pop();
      if (paths.length >= maxPaths) break;
    }
  };
  build(end);
  return paths;
}

function rutasDeComparacion(graph, start, end, modo) {
  const tipos = TIPOS_GRAFO_POR_MODO[modo] || TIPOS_GRAFO_POR_MODO.corto;
  if (modo === "rutas") return allShortestPaths(graph, start, end, tipos, 6);
  const path = bfsPath(graph, start, end, tipos);
  return path ? [path] : [];
}

function computeParentGroups(people, gen) {
  const parentGroups = {};
  people.forEach((p) => {
    if (!p.padre && !p.madre) return;
    const parentIds = [p.padre, p.madre].filter((id) => id && gen[id] !== undefined);
    if (!parentIds.length) return;

    // La clave base usa el conjunto EXACTO de progenitores documentados.
    // Medio hermanos no comparten nunca el carril familiar. Los hermanos
    // completos sí pueden compartirlo aunque su ficha caiga en otra generación.
    const familyBaseKey = parentIds.length === 2
      ? parentIds.slice().sort().join("|")
      : `${parentIds[0]}|progenitor-unico|${p.id}`;
    const key = `${familyBaseKey}@${gen[p.id]}`;
    if (!parentGroups[key]) parentGroups[key] = { familyBaseKey, parentIds, childIds: [] };
    parentGroups[key].childIds.push(p.id);
  });
  const groupsByRow = {};
  Object.values(parentGroups).forEach((g) => {
    const r = Math.max(...g.parentIds.map((id) => gen[id]));
    if (!groupsByRow[r]) groupsByRow[r] = [];
    groupsByRow[r].push(g);
  });
  return groupsByRow;
}

const siglo = (y) => Number.isFinite(y) ? Math.ceil(y / 100) : null;
const nRomano = { 12:"XII",13:"XIII",14:"XIV",15:"XV",16:"XVI",17:"XVII",18:"XVIII",19:"XIX",20:"XX" };

function anioInicioPersona(persona) {
  const candidatos = [
    persona?.nac,
    ...listaReinados(persona).map((r) => r.desde),
    persona?.muer,
  ].filter(Number.isFinite);
  return candidatos.length ? Math.min(...candidatos) : null;
}

function anioFinPersona(persona) {
  const candidatos = [
    persona?.muer,
    ...listaReinados(persona).map((r) => r.hasta),
    persona?.nac,
  ].filter(Number.isFinite);
  return candidatos.length ? Math.max(...candidatos) : null;
}

function formatoFechas(persona) {
  const inicio = Number.isFinite(persona?.nac)
    ? `${persona.nacAprox ? "c. " : ""}${persona.nac}`
    : "?";
  const fin = Number.isFinite(persona?.muer)
    ? `${persona.muerAprox ? "c. " : ""}${persona.muer}`
    : "?";
  return `${inicio} – ${fin}`;
}

function sobrenombreDePersona(persona) {
  if (!persona) return "";
  if (typeof persona.sobrenombre === "string" && persona.sobrenombre.trim()) return persona.sobrenombre.trim();
  const nombre = String(persona.nombre || "").trim();
  const cita = nombre.match(/[“\"]([^”\"]+)[”\"]/);
  if (cita) return cita[1].trim();
  const parentesis = nombre.match(/\(([^()]+)\)\s*$/);
  if (parentesis && /^(el|la|los|las)\s/i.test(parentesis[1].trim())) return parentesis[1].trim();
  return "";
}

function nombrePrincipal(persona) {
  if (!persona) return "";
  let nombre = String(persona.nombre || "").trim();
  nombre = nombre.replace(/\s*[“\"][^”\"]+[”\"]\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const parentesis = nombre.match(/\(([^()]+)\)\s*$/);
  if (parentesis && /^(el|la|los|las)\s/i.test(parentesis[1].trim())) {
    nombre = nombre.slice(0, parentesis.index).trim();
  }
  return nombre || String(persona.nombre || "").trim();
}

const ANIOS_DATOS = PERSONAS.flatMap((persona) => [
  persona.nac,
  persona.muer,
  ...listaReinados(persona).flatMap((r) => [r.desde, r.hasta]),
]).filter(Number.isFinite);
const TL_MIN = Math.floor((Math.min(...ANIOS_DATOS) - 1) / 25) * 25;
const TL_MAX = Math.ceil((Math.max(...ANIOS_DATOS) + 1) / 25) * 25;
const pct = (y) => Number.isFinite(y) ? Math.max(0, Math.min(100, ((y - TL_MIN) / (TL_MAX - TL_MIN)) * 100)) : null;
const inicioEvento = (evento) => Number.isFinite(evento?.desde) ? evento.desde : evento?.anio;
const finEvento = (evento) => Number.isFinite(evento?.hasta) ? evento.hasta : inicioEvento(evento);
const etiquetaFechaEvento = (evento) => Number.isFinite(evento?.desde) && Number.isFinite(evento?.hasta)
  ? `${evento.desde}–${evento.hasta}`
  : String(evento?.anio ?? "");

function Chip({ label, active, onClick, color, small }) {
  return (
    <button type="button" onClick={onClick} className={`chip${small ? " chip-sm" : ""}`}
      style={{ borderColor: color, background: active ? color : "transparent", color: active ? "#F6F1E4" : "#3A342A" }}>
      {label}
    </button>
  );
}

const PersonBox = React.memo(function PersonBox({
  p, cls, accent, style, setRef, onEnter, onLeave, onClick,
  hasDescendants = false, descendantsCollapsed = false, onToggleDescendants,
}) {
  const roleText = `${p.titulo} · ${(p.reinos || []).join(" · ")}`;
  return (
    <div ref={setRef} className={`${cls}${hasDescendants ? " has-descendants" : ""}`} style={{ borderLeft: `6px solid ${accent}`, ...style }}
      role="button" tabIndex={0}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick?.(event); } }}>
      {hasDescendants && (
        <button
          type="button"
          className={`desc-toggle${descendantsCollapsed ? " is-collapsed" : ""}`}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onToggleDescendants?.(); }}
          aria-label={`${descendantsCollapsed ? "Abrir" : "Cerrar"} descendencia de ${p.nombre}`}
          title={`${descendantsCollapsed ? "Abrir" : "Cerrar"} descendencia`}
        >
          {descendantsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        </button>
      )}
      <div className="name" title={p.nombre}>{p.nombre}</div>
      <div className="role" title={roleText}>{roleText}</div>
    </div>
  );
});


function ListaRelaciones({ etiqueta, ids, tipo = "familia", onSelect }) {
  const unicos = [...new Set((ids || []).filter(Boolean))];
  if (!unicos.length) return null;
  return (
    <div className="bio-relation-row">
      <div className="bio-relation-label">{etiqueta}</div>
      <div className="bio-relation-list">
        {unicos.map((id) => {
          const persona = BY_ID[id];
          return (
            <button
              type="button"
              key={id}
              className={`bio-relation-link ${tipo === "amantes" ? "is-lover" : ""}`}
              disabled={!persona}
              onClick={() => persona && onSelect(id)}
              title={persona ? `Ir a ${persona.nombre}` : `La ficha ${id} todavía no está cargada`}
            >
              {persona?.nombre || `[${id}] sin ficha`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function calcularEstadisticas(personas) {
  const lista = (personas || []).filter(Boolean);
  const ids = new Set(lista.map((persona) => persona.id));
  const paresUnicos = (getRelaciones) => {
    const pares = new Set();
    lista.forEach((persona) => {
      getRelaciones(persona).forEach((otroId) => {
        if (!ids.has(otroId)) return;
        pares.add([persona.id, otroId].sort().join("|"));
      });
    });
    return pares.size;
  };
  const contar = (valores) => Object.entries(valores.reduce((acc, valor) => {
    if (valor) acc[valor] = (acc[valor] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
  const dinastias = contar(lista.map((persona) => persona.dinastia));
  const territorios = contar(lista.flatMap((persona) => persona.reinos || []));
  const gobernantes = lista.filter((persona) => listaReinados(persona).some(reinadoEsEfectivo)).length;
  const reinados = lista.flatMap((persona) => listaReinados(persona)
    .filter((reinado) => reinadoEsEfectivo(reinado) && Number.isFinite(reinado.desde) && Number.isFinite(reinado.hasta))
    .map((reinado) => ({ persona, reinado, duracion: reinado.hasta - reinado.desde })));
  const reinadoMasLargo = reinados.sort((a, b) => b.duracion - a.duracion)[0] || null;
  const descendencia = lista.map((persona) => ({
    persona,
    total: (HIJOS_POR_ID[persona.id] || []).filter((id) => ids.has(id)).length,
  })).sort((a, b) => b.total - a.total)[0] || null;
  return {
    personas: lista.length,
    dinastias: dinastias.length,
    territorios: territorios.length,
    matrimonios: paresUnicos(listaConyuges),
    amantes: paresUnicos(listaAmantes),
    gobernantes,
    topDinastias: dinastias.slice(0, 8),
    topTerritorios: territorios.slice(0, 8),
    reinadoMasLargo,
    descendencia,
  };
}

function ModalProyecto({ seccion, onClose, persona, personasVista = PERSONAS, onStartHistoria }) {
  const [alcanceEstadisticas, setAlcanceEstadisticas] = useState("base");
  if (!seccion) return null;
  const correos = CORREOS_CORRECCIONES.filter(Boolean);
  const correoPrincipal = correos[0] || "";
  const urlActual = typeof window !== "undefined" ? window.location.href : "";
  const asunto = persona ? `Corrección: ${persona.nombre}` : "Corrección para El Árbol de Europa";
  const cuerpo = [
    "Hola, he encontrado un posible error en El Árbol de Europa.",
    "",
    persona ? `Persona: ${persona.nombre}` : "Persona o sección:",
    persona ? `ID: ${persona.id}` : "ID (si procede):",
    urlActual ? `URL: ${urlActual}` : "",
    "",
    "Tipo de error: fecha / parentesco / reinado / territorio / otro",
    "",
    "Descripción:",
  ].filter(Boolean).join("\n");
  const mailto = correoPrincipal
    ? `mailto:${correoPrincipal}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    : "";

  const titulo = {
    acerca: "Acerca del proyecto",
    agradecimientos: "Agradecimientos",
    fuentes: "Fuentes y metodología",
    licencias: "Licencias",
    reportar: "Reportar un error",
    estadisticas: "Estadísticas",
    historias: "Historias",
  }[seccion] || "Información del proyecto";
  const estadisticas = calcularEstadisticas(alcanceEstadisticas === "vista" ? personasVista : PERSONAS);

  return (
    <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="project-modal-head">
          <div>
            <div className="project-modal-kicker">El Árbol de Europa</div>
            <h2>{titulo}</h2>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose} aria-label="Cerrar"><X size={17} /></button>
        </div>

        <div className="project-modal-body">
          {seccion === "acerca" && (
            <>
              <p className="project-lead">El Árbol de Europa es un proyecto interactivo de genealogía histórica que busca visualizar parentescos, dinastías, reinados y conexiones políticas de la Europa medieval y moderna en una misma red navegable.</p>
              <div className="project-stat-grid">
                <div><strong>{PERSONAS.length}</strong><span>personas en la base</span></div>
                <div><strong>1200–1800</strong><span>periodo principal de trabajo</span></div>
                <div><strong>En desarrollo</strong><span>la base sigue ampliándose y corrigiéndose</span></div>
              </div>
              <h3>Qué intenta hacer</h3>
              <p>La aplicación combina genealogía, cronología y cartografía para que una misma persona pueda estudiarse dentro de su familia, su época y los territorios con los que estuvo vinculada. La ausencia de una relación o de un personaje no implica que históricamente no existiera: puede significar simplemente que todavía no se ha incorporado a la base.</p>
            </>
          )}

          {seccion === "agradecimientos" && (
            <>
              <div className="project-section-icon"><Heart size={17} /></div>
              <h3>CORRECTORES</h3>
              {CORRECTORES.length ? (
                <ul className="project-name-list">{CORRECTORES.map((nombre) => <li key={nombre}>{nombre}</li>)}</ul>
              ) : (
                <p className="project-muted">Este espacio queda preparado para acreditar a quienes detecten errores, aporten documentación o ayuden a mejorar la base. Añade sus nombres en la constante <code>CORRECTORES</code> de App.jsx.</p>
              )}
              <h3>Cartografía</h3>
              <p>Gracias a <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a>, cuya base cartográfica se ha adaptado para representar territorios históricos dentro del proyecto.</p>
              <h3>Correcciones y aportaciones</h3>
              {correos.length ? (
                <p>Si encuentras un fallo, puedes escribir a {correos.map((correo, index) => <React.Fragment key={correo}>{index ? ", " : ""}<a href={`mailto:${correo}`}>{correo}</a></React.Fragment>)}.</p>
              ) : (
                <p className="project-muted">Configura <code>VITE_CONTACT_EMAIL</code> en las variables de entorno de Vercel para mostrar aquí el correo público del proyecto.</p>
              )}
            </>
          )}

          {seccion === "fuentes" && (
            <>
              <div className="project-section-icon"><BookOpen size={17} /></div>
              <p className="project-lead">La bibliografía del proyecto se organiza por repertorios generales y, cuando una relación o fecha es discutida, por comprobaciones específicas.</p>
              <h3>Fuentes de consulta principales</h3>
              <ul className="project-source-list">
                <li><a href="https://fmg.ac/Projects/MedLands/index.htm" target="_blank" rel="noreferrer">Foundation for Medieval Genealogy · MedLands <ExternalLink size={12} /></a><span>Reconstrucciones genealógicas y referencias documentales, especialmente útiles para la Edad Media.</span></li>
                <li><a href="https://en.wikipedia.org/" target="_blank" rel="noreferrer">Wikipedia <ExternalLink size={12} /></a><span>Consulta rápida de cronologías, títulos, enlaces dinásticos y bibliografía secundaria, contrastada cuando el dato es relevante o dudoso.</span></li>
                <li><a href="https://historia-hispanica.rah.es/" target="_blank" rel="noreferrer">Historia Hispánica · Real Academia de la Historia <ExternalLink size={12} /></a><span>Apoyo biográfico para personajes y linajes del ámbito hispánico.</span></li>
                <li><a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a><span>Base cartográfica sobre la que se ha construido la representación territorial interactiva.</span></li>
              </ul>
              <h3>Criterios de trabajo</h3>
              <ul className="project-method-list">
                <li>Las fechas se almacenan normalmente a nivel de año; cuando una fuente ofrece una fecha aproximada, la interfaz todavía no distingue visualmente entre fecha exacta y aproximada.</li>
                <li>Se priorizan personajes que conectan ramas, ejercen un gobierno, fundan una línea relevante o tienen descendencia históricamente útil para la red.</li>
                <li>Los territorios del mapa son una representación histórica simplificada y dependen de los límites disponibles en la base cartográfica.</li>
                <li>La ausencia de un progenitor, matrimonio o descendiente significa “no registrado en esta base”, no “inexistente”.</li>
                <li>Las correcciones documentadas tienen prioridad sobre la mera coherencia visual del árbol.</li>
              </ul>
            </>
          )}

          {seccion === "licencias" && (
            <>
              <div className="project-section-icon"><Scale size={17} /></div>
              <h3>Contenido original del proyecto</h3>
              <p>Salvo indicación expresa en sentido contrario, el código, el diseño, los textos y la estructura original de la base de datos de El Árbol de Europa se mantienen con todos los derechos reservados.</p>
              <div className="project-license-note">Los materiales de terceros conservan sus propias licencias. La cartografía derivada de MapChart se rige por su atribución específica y no extiende automáticamente esa licencia al resto del proyecto.</div>
              <h3>Cartografía de MapChart</h3>
              <p>La base cartográfica utilizada en el mapa procede de <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a> y ha sido modificada y adaptada para este proyecto.</p>
              <p>El material cartográfico de MapChart se publica bajo <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) <ExternalLink size={12} /></a>. La atribución y la indicación de las modificaciones se mantienen aquí y en el pie de la aplicación.</p>
              <div className="project-license-note">Esta licencia se refiere a la cartografía derivada de MapChart. No supone por sí sola que el código, los textos o la base genealógica completa del proyecto se publiquen bajo la misma licencia.</div>
            </>
          )}

          {seccion === "estadisticas" && (
            <>
              <p className="project-lead">Una lectura cuantitativa de la base genealógica. Puedes comparar el conjunto completo con las personas que permanecen visibles tras aplicar filtros.</p>
              <div className="stats-scope-toggle" role="group" aria-label="Ámbito de las estadísticas">
                <button type="button" className={alcanceEstadisticas === "base" ? "active" : ""} onClick={() => setAlcanceEstadisticas("base")}>Base completa</button>
                <button type="button" className={alcanceEstadisticas === "vista" ? "active" : ""} onClick={() => setAlcanceEstadisticas("vista")}>Vista actual · {personasVista.length}</button>
              </div>
              <div className="stats-summary-grid">
                <div><strong>{estadisticas.personas}</strong><span>personas</span></div>
                <div><strong>{estadisticas.dinastias}</strong><span>dinastías</span></div>
                <div><strong>{estadisticas.territorios}</strong><span>territorios</span></div>
                <div><strong>{estadisticas.matrimonios}</strong><span>matrimonios registrados</span></div>
                <div><strong>{estadisticas.amantes}</strong><span>relaciones de amantes</span></div>
                <div><strong>{estadisticas.gobernantes}</strong><span>personas con reinado efectivo</span></div>
              </div>
              <div className="stats-columns">
                <div>
                  <h3>Dinastías más representadas</h3>
                  <ol className="stats-ranking">{estadisticas.topDinastias.map(([nombre, total]) => <li key={nombre}><span>{nombre}</span><strong>{total}</strong></li>)}</ol>
                </div>
                <div>
                  <h3>Territorios más representados</h3>
                  <ol className="stats-ranking">{estadisticas.topTerritorios.map(([nombre, total]) => <li key={nombre}><span>{nombre}</span><strong>{total}</strong></li>)}</ol>
                </div>
              </div>
              <div className="stats-curiosities">
                {estadisticas.reinadoMasLargo && (
                  <div><span>Reinado efectivo más largo registrado</span><strong>{estadisticas.reinadoMasLargo.persona.nombre}</strong><small>{estadisticas.reinadoMasLargo.reinado.territorio} · {estadisticas.reinadoMasLargo.reinado.desde}–{estadisticas.reinadoMasLargo.reinado.hasta} · {estadisticas.reinadoMasLargo.duracion} años</small></div>
                )}
                {estadisticas.descendencia?.total > 0 && (
                  <div><span>Más hijos registrados en este conjunto</span><strong>{estadisticas.descendencia.persona.nombre}</strong><small>{estadisticas.descendencia.total} hijos/as presentes en el ámbito seleccionado</small></div>
                )}
              </div>
            </>
          )}

          {seccion === "historias" && (
            <>
              <p className="project-lead">Recorridos guiados que utilizan el árbol, el mapa, las biografías y la cronología de la propia aplicación. Puedes abandonar el recorrido en cualquier momento y volver a explorar libremente.</p>
              <div className="stories-grid">
                {HISTORIAS.map((historia) => (
                  <article key={historia.id} className={`story-catalog-card${historia.disponible ? " is-available" : " is-coming"}`}>
                    <div className="story-catalog-topline">
                      <span>{historia.disponible ? "Recorrido disponible" : "Próximamente"}</span>
                      {historia.disponible && historia.pasos && <b>{historia.pasos.length} pasos</b>}
                    </div>
                    <h3>{historia.titulo}</h3>
                    <p>{historia.subtitulo}</p>
                    {historia.disponible ? (
                      <button type="button" className="story-start-btn" onClick={() => onStartHistoria?.(historia.id)}>Comenzar recorrido <ArrowRight size={13} /></button>
                    ) : (
                      <button type="button" className="story-start-btn" disabled>Próximamente</button>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}

          {seccion === "reportar" && (
            <>
              <div className="project-section-icon"><Flag size={17} /></div>
              <p className="project-lead">Las correcciones son especialmente útiles si incluyen la persona afectada, el dato que parece incorrecto y, cuando sea posible, una fuente.</p>
              {persona && (
                <div className="project-report-context">
                  <span>Ficha seleccionada</span>
                  <strong>{persona.nombre}</strong>
                  <code>{persona.id}</code>
                </div>
              )}
              <div className="project-report-template">
                <strong>Información útil al informar de un fallo</strong>
                <span>• Persona o ID de la ficha</span>
                <span>• Tipo de error: fecha, parentesco, reinado, territorio u otro</span>
                <span>• Explicación breve</span>
                <span>• Fuente o enlace, si lo tienes</span>
              </div>
              {correoPrincipal ? (
                <a className="project-primary-action" href={mailto}><Mail size={14} /> Preparar correo de corrección</a>
              ) : (
                <div className="project-contact-placeholder"><Mail size={15} /><span>Configura <code>VITE_CONTACT_EMAIL</code> en Vercel. El botón de correo se activará automáticamente.</span></div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function Collapsible({ title, count, children, defaultOpen = true, headExtra, persistentHeadExtra, overflowVisible = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="panel" style={{ marginBottom: 18, overflow: overflowVisible ? "visible" : "hidden" }}>
      <div className="panel-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1, minWidth: 0 }} onClick={() => setOpen(!open)}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="panel-title">{title}</span>
          {count != null && <span className="panel-count">{count}</span>}
        </div>
        {persistentHeadExtra}
        {open && headExtra}
      </div>
      {open && <div className="panel-body">{children}</div>}
    </div>
  );
}

export default function ArbolGenealogico() {
  const scrollRef = useRef(null);
  const nodeRefs = useRef({});
  const tlScrollRef = useRef(null);
  const tlBarRefs = useRef({});
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    return localeDesdePath(window.location.pathname);
  });
  const [query, setQuery] = useState("");
  const [territorios, setTerritorios] = useState([]);
  const [dinastias, setDinastias] = useState([]);
  const [dinastiasExpandidas, setDinastiasExpandidas] = useState([]);
  const [territoriosExpandidos, setTerritoriosExpandidos] = useState([]);
  const [titulos, setTitulos] = useState([]);
  const [siglos, setSiglos] = useState([]);
  const [relaciones, setRelaciones] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [seleccion, setSeleccion] = useState(null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [zoom, setZoom] = useState(0.8);
  const [mode, setMode] = useState("view");
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [modoComparacion, setModoComparacion] = useState("corto");
  const [compareMenuOpen, setCompareMenuOpen] = useState(false);
  const [compareRouteIndex, setCompareRouteIndex] = useState(0);
  const [aisladoId, setAisladoId] = useState(null);
  const [anioGlobal, setAnioGlobal] = useState(null);
  const [anioInput, setAnioInput] = useState("");
  const [reproduciendoHistoria, setReproduciendoHistoria] = useState(false);
  const [velocidadHistoria, setVelocidadHistoria] = useState(5);
  const [shareStatus, setShareStatus] = useState("");
  const [collapsedIds, setCollapsedIds] = useState([]);
  const [vistasActivas, setVistasActivas] = useState({ arbol: true, mapa: true });
  const [portadaVisible, setPortadaVisible] = useState(false);
  const [infoProyecto, setInfoProyecto] = useState(null);
  const [timelineScaleIndex, setTimelineScaleIndex] = useState(1);
  const [timelineMode, setTimelineMode] = useState("personas");
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(null);
  const [favoritos, setFavoritos] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const guardados = JSON.parse(window.localStorage.getItem(FAVORITOS_STORAGE_KEY) || "[]");
      return Array.isArray(guardados) ? guardados.filter((id) => BY_ID[id]) : [];
    } catch {
      return [];
    }
  });
  const [favoritosOpen, setFavoritosOpen] = useState(false);
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [historiaActivaId, setHistoriaActivaId] = useState(null);
  const [historiaPasoIndex, setHistoriaPasoIndex] = useState(0);
  const compareMenuRef = useRef(null);
  const favoritosMenuRef = useRef(null);
  const historiaSnapshotRef = useRef(null);
  const shareStatusTimerRef = useRef(null);
  const urlStateLoadedRef = useRef(false);
  const dragState = useRef(null);

  const gen = useMemo(() => computeGenerations(PERSONAS), []);
  const rows = useMemo(() => buildRows(PERSONAS, gen), [gen]);
  const graph = useMemo(() => buildGraph(PERSONAS), []);
  const favoritosSet = useMemo(() => new Set(favoritos), [favoritos]);
  const timelinePxPerYear = TIMELINE_SCALES[timelineScaleIndex];
  const timelineTrackWidth = Math.max(1180, Math.round((TL_MAX - TL_MIN) * timelinePxPerYear));
  const timelineContentWidth = TIMELINE_FIXED_COLUMN + timelineTrackWidth;
  const timelineTickStep = timelinePxPerYear >= 6 ? 10 : timelinePxPerYear >= 4 ? 20 : 25;
  const timelineTicks = useMemo(() => {
    const primero = Math.ceil(TL_MIN / timelineTickStep) * timelineTickStep;
    const valores = [];
    for (let valor = primero; valor <= TL_MAX; valor += timelineTickStep) valores.push(valor);
    return valores;
  }, [timelineTickStep]);
  const eventosOrdenados = useMemo(() => EVENTOS_HISTORICOS.slice().sort((a, b) => inicioEvento(a) - inicioEvento(b) || a.titulo.localeCompare(b.titulo, "es")), []);
  // En el modo "Ambos" los eventos se distribuyen en carriles dinámicos.
  // El algoritmo reserva el ancho visual real de cada etiqueta (y, para los
  // periodos, al menos la duración cronológica), de modo que nunca se monten
  // unos textos sobre otros aunque haya muchos hitos concentrados en pocos años.
  const timelineCombinedEvents = useMemo(() => {
    const laneGap = 7;
    const laneHeight = 21;
    const laneEnds = [];
    const items = eventosOrdenados.map((evento) => {
      const inicio = inicioEvento(evento);
      const fin = finEvento(evento);
      const esPeriodo = Number.isFinite(evento.desde) && Number.isFinite(evento.hasta) && evento.hasta > evento.desde;
      const leftPx = Math.max(0, ((inicio - TL_MIN) / (TL_MAX - TL_MIN)) * timelineTrackWidth);
      const durationPx = esPeriodo
        ? Math.max(5, ((fin - inicio) / (TL_MAX - TL_MIN)) * timelineTrackWidth)
        : 0;
      const labelWidth = Math.min(150, Math.max(76, 18 + evento.titulo.length * 4.3));
      const available = Math.max(44, timelineTrackWidth - leftPx);
      const visualWidth = Math.min(available, Math.max(labelWidth, durationPx));
      let lane = laneEnds.findIndex((endPx) => endPx + laneGap <= leftPx);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = leftPx + visualWidth;
      return { evento, inicio, fin, esPeriodo, leftPx, durationPx, visualWidth, lane };
    });
    return {
      items,
      laneHeight,
      laneCount: Math.max(1, laneEnds.length),
      height: Math.max(58, laneEnds.length * laneHeight + 10),
    };
  }, [eventosOrdenados, timelineTrackWidth]);
  const eventoSeleccionado = eventosOrdenados.find((evento) => evento.id === eventoSeleccionadoId) || null;
  const historiaActiva = HISTORIAS.find((historia) => historia.id === historiaActivaId) || null;
  const historiaPasoActual = historiaActiva?.pasos?.[historiaPasoIndex] || null;
  const historiaPersonasSet = useMemo(() => new Set(historiaPasoActual?.personas || (historiaPasoActual?.persona ? [historiaPasoActual.persona] : [])), [historiaPasoActual]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const isEnglish = locale === "en";
    document.documentElement.lang = isEnglish ? "en" : "es";

    const personaNombre = seleccion ? (nombrePrincipal(seleccion) || seleccion.nombre) : "";
    const dinastiaUnica = !personaNombre && !historiaActiva && dinastias.length === 1 ? dinastias[0] : "";
    const territorioUnico = !personaNombre && !historiaActiva && !dinastiaUnica && territorios.length === 1 ? territorios[0] : "";

    const pageTitle = isEnglish
      ? "The Tree of Europe | Interactive historical and genealogical atlas"
      : personaNombre
        ? t("share.personTitle", { name: personaNombre })
        : historiaActiva?.titulo
          ? `${historiaActiva.titulo} — ${SITE.name}`
          : dinastiaUnica
            ? `${dinastiaUnica} — ${SITE.name}`
            : territorioUnico
              ? `${territorioUnico} — ${SITE.name}`
              : t("meta.defaultTitle");

    const description = isEnglish
      ? "Explore the families, dynasties, reigns and political connections that shaped Europe between 1200 and 1800."
      : personaNombre
        ? `Explora a ${personaNombre}: parentescos, cronología, reinados y territorios en ${SITE.name}.`
        : historiaActiva?.descripcion
          || (dinastiaUnica ? `Explora la dinastía ${dinastiaUnica} en ${SITE.name}.` : "")
          || (territorioUnico ? `Explora las personas, reinados y conexiones históricas de ${territorioUnico} en ${SITE.name}.` : "")
          || t("meta.defaultDescription");

    const canonicalBase = SITE.publicUrl || window.location.origin;
    let canonicalPath = isEnglish ? "/en/" : "/es/";
    if (!isEnglish) {
      canonicalPath = seleccion
        ? rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"))
        : historiaActiva
          ? rutaEntidadLocalizada("es", "historia", slugPublico(historiaActiva.titulo))
          : dinastiaUnica
            ? rutaEntidadLocalizada("es", "dinastia", slugPublico(dinastiaUnica))
            : territorioUnico
              ? rutaEntidadLocalizada("es", "territorio", slugPublico(territorioUnico))
              : "/es/";
    }
    const canonicalUrl = new URL(canonicalPath, canonicalBase).toString();

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', { name: "description" }, description);
    setMetaContent('meta[property="og:site_name"]', { property: "og:site_name" }, isEnglish ? "The Tree of Europe" : SITE.name);
    setMetaContent('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
    setMetaContent('meta[property="og:type"]', { property: "og:type" }, "website");
    setMetaContent('meta[property="og:locale"]', { property: "og:locale" }, isEnglish ? "en_GB" : "es_ES");
    setMetaContent('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMetaContent('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    ensureCanonical(canonicalUrl);

    const esPath = seleccion
      ? rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"))
      : "/es/";
    const enPersonSlug = seleccion ? slugPersonaPorLocale(seleccion, "en") : null;
    const alternates = [
      { hreflang: "es", href: new URL(esPath, canonicalBase).toString() },
      { hreflang: "x-default", href: new URL(esPath, canonicalBase).toString() },
    ];
    if (isEnglish || (!seleccion && !historiaActiva && !dinastiaUnica && !territorioUnico)) {
      alternates.push({ hreflang: "en", href: new URL("/en/", canonicalBase).toString() });
    } else if (enPersonSlug) {
      alternates.push({ hreflang: "en", href: new URL(rutaEntidadLocalizada("en", "persona", enPersonSlug), canonicalBase).toString() });
    }
    setHreflangAlternates(alternates);
  }, [locale, seleccion, historiaActiva, dinastias, territorios]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const normalizarRuta = () => {
      const { pathname, search, hash } = window.location;
      const prefijo = pathname.match(/^\/(es|en)(?=\/|$)/);
      if (prefijo) {
        setLocale(prefijo[1]);
        return;
      }

      // Compatibilidad con los enlaces antiguos: /persona/..., /historia/...
      // pasan a su equivalente /es/... sin recargar la SPA.
      const legacy = rutaPublicaDesdePath(pathname);
      let nuevaRuta = "/es/";
      if (legacy?.tipo && legacy?.slug) {
        nuevaRuta = rutaEntidadLocalizada("es", legacy.tipo, legacy.slug);
      } else if (pathname && pathname !== "/") {
        nuevaRuta = `/es${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
      }
      window.history.replaceState(window.history.state, "", `${nuevaRuta}${search}${hash}`);
      setLocale("es");
    };

    normalizarRuta();
    window.addEventListener("popstate", normalizarRuta);
    return () => window.removeEventListener("popstate", normalizarRuta);
  }, []);

  useEffect(() => {
    if (!compareMenuOpen) return undefined;
    const cerrarFuera = (event) => {
      if (!compareMenuRef.current?.contains(event.target)) setCompareMenuOpen(false);
    };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [compareMenuOpen]);

  useEffect(() => {
    if (!favoritosOpen) return undefined;
    const cerrarFuera = (event) => {
      if (!favoritosMenuRef.current?.contains(event.target)) setFavoritosOpen(false);
    };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [favoritosOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(favoritos));
    } catch {
      // El almacenamiento local puede estar bloqueado por el navegador.
    }
    if (!favoritos.length && soloFavoritos) setSoloFavoritos(false);
  }, [favoritos, soloFavoritos]);

  useEffect(() => () => {
    if (shareStatusTimerRef.current) window.clearTimeout(shareStatusTimerRef.current);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const rutaActual = rutaPublicaDesdePath(window.location.pathname);
    const esEnlaceDirecto = Boolean(params.get("persona") || rutaActual?.tipo);
    if (rutaActual?.locale === "en") { setPortadaVisible(false); return; }
    const yaVisitada = window.localStorage.getItem(PORTADA_STORAGE_KEY) === "1";
    setPortadaVisible(!esEnlaceDirecto && !yaVisitada);
  }, []);

  useEffect(() => {
    const bloquear = portadaVisible || Boolean(infoProyecto);
    if (!bloquear || typeof document === "undefined") return undefined;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const cerrarConEscape = (event) => {
      if (event.key !== "Escape") return;
      if (infoProyecto) setInfoProyecto(null);
      else if (portadaVisible) {
        window.localStorage.setItem(PORTADA_STORAGE_KEY, "1");
        setPortadaVisible(false);
      }
    };
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [portadaVisible, infoProyecto]);

  const opciones = useMemo(() => {
    const alfabetico = (a, b) => String(a).localeCompare(String(b), "es", { sensitivity: "base" });
    const uniq = (arr) => [...new Set(arr)];

    const dinastiasEnDatos = new Set(PERSONAS.map((persona) => persona.dinastia).filter(Boolean));
    const conteoDinastias = PERSONAS.reduce((acc, persona) => {
      acc[persona.dinastia] = (acc[persona.dinastia] || 0) + 1;
      return acc;
    }, {});

    const principalesConfiguradas = DINASTIAS_DESTACADAS.filter((principal) => {
      const miembros = GRUPOS_DINASTICOS[principal] || [principal];
      return miembros.some((dinastia) => dinastiasEnDatos.has(dinastia));
    });

    const cubiertasPorGrupos = new Set(
      principalesConfiguradas.flatMap((principal) => GRUPOS_DINASTICOS[principal] || [principal])
    );

    const casasFrecuentes = [...dinastiasEnDatos]
      .filter((dinastia) => !["Familias menores", "Desconocida"].includes(dinastia) && !cubiertasPorGrupos.has(dinastia) && (conteoDinastias[dinastia] || 0) >= 5)
      .sort(alfabetico);

    const dinastiasPrincipales = uniq([...principalesConfiguradas, ...casasFrecuentes]);
    const representadas = new Set(
      dinastiasPrincipales.flatMap((principal) => GRUPOS_DINASTICOS[principal] || [principal])
    );
    const otrasDinastias = [...dinastiasEnDatos].filter((dinastia) => !representadas.has(dinastia)).sort(alfabetico);

    const ramasPorPrincipal = Object.fromEntries(
      dinastiasPrincipales.map((principal) => [
        principal,
        (GRUPOS_DINASTICOS[principal] || [])
          .filter((rama) => rama !== principal && dinastiasEnDatos.has(rama))
          .sort(alfabetico),
      ])
    );
    ramasPorPrincipal[OTRAS_DINASTIAS] = otrasDinastias;

    const territoriosEnDatos = uniq(PERSONAS.flatMap((persona) => persona.reinos || [])).sort(alfabetico);
    const territorioTieneDatos = (principal) => {
      const pendientes = [principal];
      const visitados = new Set();
      while (pendientes.length) {
        const actual = pendientes.shift();
        if (visitados.has(actual)) continue;
        visitados.add(actual);
        if (territoriosEnDatos.includes(actual)) return true;
        (TERRITORIOS_SUB[actual] || []).forEach((hijo) => pendientes.push(hijo));
      }
      return false;
    };
    const territoriosPadreOrdenados = TERRITORIOS_DESTACADOS.filter(territorioTieneDatos);
    const territoriosPadreAdicionales = Object.keys(TERRITORIOS_SUB)
      .filter((principal) => !territoriosPadreOrdenados.includes(principal) && territorioTieneDatos(principal))
      .sort(alfabetico);
    const todosLosSubterritorios = new Set(Object.values(TERRITORIOS_SUB).flat());
    const territoriosIndependientes = territoriosEnDatos
      .filter((territorio) => !todosLosSubterritorios.has(territorio) && !territoriosPadreOrdenados.includes(territorio))
      .sort(alfabetico);
    const territoriosPrincipales = uniq([
      ...territoriosPadreOrdenados,
      ...territoriosPadreAdicionales,
      ...territoriosIndependientes,
    ]);
    const subsPorTerritorio = Object.fromEntries(
      Object.entries(TERRITORIOS_SUB).map(([principal, hijos]) => [
        principal,
        hijos.filter((hijo) => territorioTieneDatos(hijo)).sort(alfabetico),
      ])
    );

    const siglosDisponibles = uniq(PERSONAS.flatMap(siglosDePersona)).sort((a, b) => a - b);
    const hayPersonasSinFecha = PERSONAS.some(fechasIncompletas);

    return {
      territorios: territoriosPrincipales,
      subsPorTerritorio,
      dinastias: [...dinastiasPrincipales, ...(otrasDinastias.length ? [OTRAS_DINASTIAS] : [])],
      ramasPorPrincipal,
      otrasDinastias: new Set(otrasDinastias),
      titulos: CATEGORIAS_TITULO.filter((categoria) => PERSONAS.some((persona) => categoria.test(normalizaTexto(persona.titulo)))),
      siglos: siglosDisponibles,
      hayPersonasSinFecha,
      relaciones: FILTROS_RELACION,
    };
  }, []);

  const personaBio = hovered ? BY_ID[hovered] : seleccion;

  const toggle = (setter, arr, v) => setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const aisladoSet = useMemo(() => {
    if (mode !== "aislar" || !aisladoId) return null;
    return new Set([...ancestorsOf(aisladoId), ...descendantsOf(aisladoId)]);
  }, [mode, aisladoId]);

  const collapsedSet = useMemo(() => new Set(collapsedIds), [collapsedIds]);
  const hiddenByCollapse = useMemo(() => {
    const ocultos = new Set();
    collapsedIds.forEach((rootId) => {
      const descendientes = descendantsOf(rootId);
      descendientes.delete(rootId);
      descendientes.forEach((id) => ocultos.add(id));

      // Los cónyuges y amantes de una persona ocultada forman parte visual de
      // esa rama, pero no propagamos el cierre hacia sus familias de origen.
      const antepasadosRaiz = ancestorsOf(rootId);
      descendientes.forEach((id) => {
        listaParejas(BY_ID[id]).forEach((partnerId) => {
          if (partnerId !== rootId && !antepasadosRaiz.has(partnerId)) ocultos.add(partnerId);
        });
      });
    });
    return ocultos;
  }, [collapsedIds]);

  const toggleDescendants = useCallback((id) => {
    setCollapsedIds((actuales) =>
      actuales.includes(id) ? actuales.filter((actual) => actual !== id) : [...actuales, id]
    );
  }, []);

  const ajustarAnio = useCallback((valor) => {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return null;
    return Math.max(TL_MIN, Math.min(TL_MAX, Math.round(numero)));
  }, []);

  const actualizarAnioDesdeRango = useCallback((valor) => {
    const ajustado = ajustarAnio(valor);
    if (!Number.isFinite(ajustado)) return;
    setReproduciendoHistoria(false);
    setAnioGlobal(ajustado);
    setAnioInput(String(ajustado));
  }, [ajustarAnio]);

  const confirmarAnioEscrito = useCallback(() => {
    setReproduciendoHistoria(false);
    const limpio = anioInput.trim();
    if (!limpio) {
      setAnioGlobal(null);
      setAnioInput("");
      return;
    }
    const ajustado = ajustarAnio(limpio);
    if (!Number.isFinite(ajustado)) {
      setAnioInput(Number.isFinite(anioGlobal) ? String(anioGlobal) : "");
      return;
    }
    setAnioGlobal(ajustado);
    setAnioInput(String(ajustado));
  }, [ajustarAnio, anioGlobal, anioInput]);

  const restablecerAnio = useCallback(() => {
    setReproduciendoHistoria(false);
    setAnioGlobal(null);
    setAnioInput("");
  }, []);

  const moverAnioHistoria = useCallback((delta) => {
    setReproduciendoHistoria(false);
    setAnioGlobal((actual) => {
      const base = Number.isFinite(actual)
        ? actual
        : (delta >= 0 ? TL_MIN - delta : TL_MAX - delta);
      const siguiente = Math.max(TL_MIN, Math.min(TL_MAX, base + delta));
      setAnioInput(String(siguiente));
      return siguiente;
    });
  }, []);

  const alternarReproduccionHistoria = useCallback(() => {
    setReproduciendoHistoria((actual) => {
      if (!actual && (!Number.isFinite(anioGlobal) || anioGlobal >= TL_MAX)) {
        setAnioGlobal(TL_MIN);
        setAnioInput(String(TL_MIN));
      }
      return !actual;
    });
  }, [anioGlobal]);

  useEffect(() => {
    if (!reproduciendoHistoria) return undefined;
    const timer = window.setInterval(() => {
      setAnioGlobal((actual) => {
        const base = Number.isFinite(actual) ? actual : TL_MIN;
        const siguiente = Math.min(TL_MAX, base + velocidadHistoria);
        setAnioInput(String(siguiente));
        if (siguiente >= TL_MAX) {
          window.setTimeout(() => setReproduciendoHistoria(false), 0);
        }
        return siguiente;
      });
    }, 650);
    return () => window.clearInterval(timer);
  }, [reproduciendoHistoria, velocidadHistoria]);

  const mostrarArbol = vistasActivas.arbol;
  const mostrarMapa = vistasActivas.mapa;
  const vistaPrincipal = mostrarArbol && mostrarMapa ? "ambos" : (mostrarArbol ? "arbol" : "mapa");

  const alternarVista = useCallback((vista) => {
    setVistasActivas((actuales) => {
      const otraVista = vista === "arbol" ? "mapa" : "arbol";
      // La zona central nunca queda vacía: si solo hay una vista activa,
      // pulsarla de nuevo la mantiene y obliga a activar la otra primero.
      if (actuales[vista] && !actuales[otraVista]) return actuales;
      return { ...actuales, [vista]: !actuales[vista] };
    });
  }, []);

  const personasVivasEnAnio = useMemo(() =>
    Number.isFinite(anioGlobal) ? PERSONAS.filter((persona) => estaVivaEn(persona, anioGlobal)) : [],
  [anioGlobal]);
  const gobernantesActivosEnAnio = useMemo(() =>
    Number.isFinite(anioGlobal)
      ? PERSONAS.filter((persona) => reinadosActivos(persona, anioGlobal, { soloEfectivos: true }).length > 0)
      : [],
  [anioGlobal]);

  // Los filtros distintos se combinan con AND. Dentro de un mismo grupo
  // (varios territorios, dinastías, categorías, siglos o relaciones) se usa
  // OR, que suele ser el comportamiento más útil al explorar una genealogía.
  const matches = (persona) => {
    if (!persona) return false;
    if (hiddenByCollapse.has(persona.id)) return false;
    if (aisladoSet && !aisladoSet.has(persona.id)) return false;
    if (soloFavoritos && !favoritosSet.has(persona.id)) return false;

    if (territorios.length) {
      const coincideTerritorio = (persona.reinos || []).some((territorio) =>
        territorios.some((filtro) => territorioCoincideConFiltro(territorio, filtro))
      );
      if (!coincideTerritorio) return false;
    }

    if (dinastias.length) {
      const coincideDinastia = dinastias.some((filtro) => {
        if (filtro === persona.dinastia) return true;
        if (filtro === OTRAS_DINASTIAS) return opciones.otrasDinastias.has(persona.dinastia);
        return (GRUPOS_DINASTICOS[filtro] || []).includes(persona.dinastia);
      });
      if (!coincideDinastia) return false;
    }

    if (titulos.length) {
      const categorias = categoriasDeTitulo(persona);
      if (!titulos.some((categoria) => categorias.includes(categoria))) return false;
    }

    if (siglos.length) {
      const siglosPersona = siglosDePersona(persona);
      const coincidePeriodo = siglos.some((filtro) =>
        filtro === SIN_FECHA ? fechasIncompletas(persona) : siglosPersona.includes(filtro)
      );
      if (!coincidePeriodo) return false;
    }

    if (relaciones.length && !relaciones.some((filtro) => cumpleFiltroRelacion(persona, filtro))) return false;
    return true;
  };

  const visiblePeople = PERSONAS.filter(matches);
  const visibleIds = visiblePeople.map((persona) => persona.id);
  const visibleSignature = visibleIds.join("|");
  const visibleRows = useMemo(() => {
    const visible = new Set(visibleIds);
    return rows.map((row) =>
      row.flatMap((unit) => {
        const visibleIdsEnUnidad = unit.filter((id) => visible.has(id));
        return splitPartnerComponents(visibleIdsEnUnidad, BY_ID);
      })
    );
    // La firma contiene exactamente los IDs visibles y mantiene el layout
    // estable cuando solo cambia el texto de búsqueda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, visibleSignature]);
  const treeLayout = useMemo(
    () => computeTreeLayout(visibleRows, BY_ID, HIJOS_POR_ID),
    [visibleRows]
  );
  const positions = treeLayout.positions;
  const canvasSize = { w: treeLayout.width, h: treeLayout.height };

  // Coincidencias del buscador: solo entre las personas que ya son visibles
  // según los filtros de chips (si una persona está oculta por un filtro,
  // no tiene sentido "encontrarla" con el buscador).
  const queryTrim = normalizaTexto(query);
  const searchMatchIds = useMemo(() => {
    if (!queryTrim) return [];
    return visiblePeople.filter((persona) => {
      const textoBuscable = normalizaTexto([
        persona.nombre,
        nombrePrincipal(persona),
        sobrenombreDePersona(persona),
        persona.titulo,
        persona.dinastia,
        ...(persona.reinos || []),
      ].join(" "));
      return textoBuscable.includes(queryTrim);
    }).map((persona) => persona.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTrim, visibleSignature]);
  const searchMatchSet = useMemo(() => new Set(searchMatchIds), [searchMatchIds]);
  const searchSignature = searchMatchIds.join("|");
  const searchCurrentId = searchMatchIds.length ? searchMatchIds[((currentSearchIndex % searchMatchIds.length) + searchMatchIds.length) % searchMatchIds.length] : null;

  // Al cambiar la búsqueda o sus resultados, saltamos a la primera coincidencia y centramos
  // el árbol y la línea temporal sobre ella.
  useEffect(() => {
    setCurrentSearchIndex(0);
    if (searchMatchIds.length) {
      const t = setTimeout(() => {
        centerOn(searchMatchIds[0]);
        centerOnTimeline(searchMatchIds[0]);
      }, 30);
      return () => clearTimeout(t);
    }
    // `searchSignature` también cambia cuando un filtro altera las coincidencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTrim, searchSignature]);

  const irACoincidencia = (dir) => {
    if (!searchMatchIds.length) return;
    setCurrentSearchIndex((i) => {
      const next = ((i + dir) % searchMatchIds.length + searchMatchIds.length) % searchMatchIds.length;
      centerOn(searchMatchIds[next]);
      centerOnTimeline(searchMatchIds[next]);
      return next;
    });
  };

  const hayFiltros = Boolean(query || territorios.length || dinastias.length || titulos.length || siglos.length || relaciones.length || soloFavoritos);
  const limpiar = () => { setQuery(""); setTerritorios([]); setDinastias([]); setTitulos([]); setSiglos([]); setRelaciones([]); setSoloFavoritos(false); };

  const lineage = hovered ? ancestorsOf(hovered) : new Set();

  const comparePaths = useMemo(
    () => (origen && destino ? rutasDeComparacion(graph, origen, destino, modoComparacion) : []),
    [graph, origen, destino, modoComparacion]
  );
  useEffect(() => {
    setCompareRouteIndex(0);
  }, [origen, destino, modoComparacion]);
  const comparePath = comparePaths.length
    ? comparePaths[Math.min(compareRouteIndex, comparePaths.length - 1)]
    : null;
  const pathEdges = useMemo(() => {
    const s = new Set();
    if (!comparePath) return s;
    for (let i = 0; i < comparePath.length - 1; i++) {
      s.add(comparePath[i] + "|" + comparePath[i + 1]);
      s.add(comparePath[i + 1] + "|" + comparePath[i]);
    }
    return s;
  }, [comparePath]);

  const groupsByRow = useMemo(() => computeParentGroups(PERSONAS, gen), [gen]);

  const routing = useMemo(() => routeFamilyConnectors({
    groupsByRow,
    positions,
    pairContacts: treeLayout.pairContacts,
    gen,
    rows: visibleRows,
    rowBands: treeLayout.rowBands,
    canvasWidth: treeLayout.width,
  }), [groupsByRow, positions, treeLayout.pairContacts, gen, visibleRows, treeLayout.rowBands, treeLayout.width]);

  const relacionFocoId = hovered || seleccion?.id || null;
  const amantesFoco = new Set(relacionFocoId ? listaAmantes(BY_ID[relacionFocoId]) : []);

  const styleForFamilyLine = ({ parentIds, childIds, allChildIds = childIds, childId = null }) => {
    const relevantChildren = childId ? [childId] : childIds;
    const isPath = relevantChildren.some((cid) => parentIds.some((pid) => pathEdges.has(`${pid}|${cid}`)));
    const isImmediate = Boolean(
      relacionFocoId
      && (parentIds.includes(relacionFocoId) || allChildIds.includes(relacionFocoId) || relevantChildren.includes(relacionFocoId))
    );
    const isLineage = relevantChildren.some((cid) =>
      lineage.has(cid) && parentIds.some((pid) => lineage.has(pid))
    );

    if (isPath) return { stroke: PATH_COLOR, strokeWidth: 2.6 };
    if (isImmediate) return { stroke: "#7A2E2E", strokeWidth: 2.05 };
    if (isLineage) return { stroke: "#A9724F", strokeWidth: 1.65 };
    return { stroke: "#B9AF98", strokeWidth: 1.05 };
  };

  const connectorLayerKey = [visibleSignature, hovered || "", seleccion?.id || "", comparePath?.join("|") || "", collapsedIds.join("|")].join("__");

  const connectors = routing.families.map((family) => {
    const sharedStyle = styleForFamilyLine(family);
    return (
      <React.Fragment key={`family-${family.key}`}>
        {family.trunkD && (
          <path
            className="family-connector family-connector-trunk"
            d={family.trunkD}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...sharedStyle}
          />
        )}
        {(family.busDs || []).map((busD, index) => (
          <path
            key={`family-${family.key}-bus-${index}`}
            className="family-connector family-connector-bus"
            d={busD}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...sharedStyle}
          />
        ))}
        {family.branches.map((branch) => {
          const branchStyle = styleForFamilyLine({ ...family, childId: branch.childId });
          return (
            <path
              key={`family-${family.key}-${branch.childId}`}
              className="family-connector family-connector-branch"
              d={branch.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...branchStyle}
            />
          );
        })}
      </React.Fragment>
    );
  });

  const scrollBy = (dx, dy) => scrollRef.current?.scrollBy({ left: dx, top: dy, behavior: "smooth" });
  const onPointerDown = (e) => { dragState.current = { startX: e.clientX, startY: e.clientY, scrollLeft: scrollRef.current.scrollLeft, scrollTop: scrollRef.current.scrollTop }; };
  const onPointerMove = (e) => {
    if (!dragState.current) return;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - (e.clientX - dragState.current.startX);
    scrollRef.current.scrollTop = dragState.current.scrollTop - (e.clientY - dragState.current.startY);
  };
  const endDrag = () => (dragState.current = null);

  const centerOn = (id) => {
    const el = nodeRefs.current[id], scrollEl = scrollRef.current;
    if (!el || !scrollEl) return;
    const er = el.getBoundingClientRect(), sr = scrollEl.getBoundingClientRect();
    scrollEl.scrollBy({
      left: (er.left + er.width / 2) - (sr.left + sr.width / 2),
      top: (er.top + er.height / 2) - (sr.top + sr.height / 2),
      behavior: "smooth",
    });
  };

  // El zoom se ancla SIEMPRE al centro visual actual del viewport. No importa
  // qué persona esté seleccionada, buscada o bajo el cursor: el punto que está
  // justo en el centro de la pantalla antes del zoom debe seguir allí después.
  const pendingZoomCenterRef = useRef(null);

  const cambiarZoomArbol = (objetivo) => {
    const scrollEl = scrollRef.current;
    const zoomNuevo = Math.max(0.4, Math.min(1.4, Number(objetivo.toFixed?.(2) ?? objetivo)));
    if (!Number.isFinite(zoomNuevo) || zoomNuevo === zoom) return;

    if (scrollEl) {
      pendingZoomCenterRef.current = {
        x: (scrollEl.scrollLeft + scrollEl.clientWidth / 2) / Math.max(zoom, 0.001),
        y: (scrollEl.scrollTop + scrollEl.clientHeight / 2) / Math.max(zoom, 0.001),
      };
    }
    setZoom(zoomNuevo);
  };

  useLayoutEffect(() => {
    const center = pendingZoomCenterRef.current;
    const scrollEl = scrollRef.current;
    if (!center || !scrollEl) return;

    const targetLeft = center.x * zoom - scrollEl.clientWidth / 2;
    const targetTop = center.y * zoom - scrollEl.clientHeight / 2;
    const maxLeft = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const maxTop = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);

    scrollEl.scrollLeft = Math.max(0, Math.min(maxLeft, targetLeft));
    scrollEl.scrollTop = Math.max(0, Math.min(maxTop, targetTop));
    pendingZoomCenterRef.current = null;
  }, [zoom]);

  // Centra la barra correspondiente de la línea temporal (si está montada,
  // es decir, si el panel "Línea temporal" está abierto).
  const centerOnTimeline = (id) => {
    const el = tlBarRefs.current[id], scrollEl = tlScrollRef.current;
    if (!el || !scrollEl) return;
    const er = el.getBoundingClientRect(), sr = scrollEl.getBoundingClientRect();
    scrollEl.scrollBy({
      left: (er.left + er.width / 2) - (sr.left + sr.width / 2),
      top: (er.top + er.height / 2) - (sr.top + sr.height / 2),
      behavior: "smooth",
    });
  };

  const seleccionarPersonaPorId = (id) => {
    const persona = BY_ID[id];
    if (!persona) return;
    setHovered(null);
    setSeleccion(persona);
    requestAnimationFrame(() => {
      centerOn(id);
      centerOnTimeline(id);
    });
  };

  const centerTimelineOnYear = (anio) => {
    const scrollEl = tlScrollRef.current;
    if (!scrollEl || !Number.isFinite(anio)) return;
    const axis = scrollEl.querySelector(".tl-axis");
    if (!axis) return;
    const ratio = Math.max(0, Math.min(1, (anio - TL_MIN) / (TL_MAX - TL_MIN)));
    const destinoX = axis.offsetLeft + ratio * axis.clientWidth - scrollEl.clientWidth / 2;
    scrollEl.scrollTo({ left: Math.max(0, destinoX), behavior: "smooth" });
  };

  const alternarFavorito = (id) => {
    if (!BY_ID[id]) return;
    setFavoritos((actuales) => actuales.includes(id) ? actuales.filter((valor) => valor !== id) : [...actuales, id]);
  };

  const seleccionarEvento = (evento) => {
    if (!evento) return;
    const anio = inicioEvento(evento);
    setEventoSeleccionadoId(evento.id);
    setReproduciendoHistoria(false);
    if (Number.isFinite(anio)) {
      setAnioGlobal(anio);
      setAnioInput(String(anio));
    }
    const personaPrincipal = (evento.personas || []).find((id) => BY_ID[id]);
    if (personaPrincipal) {
      setSeleccion(BY_ID[personaPrincipal]);
      setHovered(null);
    } else {
      setSeleccion(null);
      setHovered(null);
    }
    requestAnimationFrame(() => {
      if (personaPrincipal) centerOn(personaPrincipal);
      centerTimelineOnYear(anio);
    });
  };

  const aplicarPasoHistoria = (historia, index) => {
    const paso = historia?.pasos?.[index];
    if (!paso) return;
    setHistoriaPasoIndex(index);
    setReproduciendoHistoria(false);
    setTimelineMode("ambos");
    setAnioGlobal(paso.anio);
    setAnioInput(String(paso.anio));
    setEventoSeleccionadoId(paso.eventoId || null);
    const personaId = paso.persona || (paso.personas || []).find((id) => BY_ID[id]);
    if (personaId && BY_ID[personaId]) {
      setSeleccion(BY_ID[personaId]);
      setHovered(null);
    }
    requestAnimationFrame(() => {
      if (personaId && BY_ID[personaId]) centerOn(personaId);
      centerTimelineOnYear(paso.anio);
    });
  };

  const iniciarHistoria = (historiaId) => {
    const historia = HISTORIAS.find((item) => item.id === historiaId && item.disponible);
    if (!historia?.pasos?.length) return;
    if (!historiaSnapshotRef.current) {
      historiaSnapshotRef.current = {
        query, territorios, dinastias, titulos, siglos, relaciones, soloFavoritos, anioGlobal,
        vistasActivas, seleccionId: seleccion?.id || null, timelineMode, eventoSeleccionadoId,
        mode, origen, destino, aisladoId, collapsedIds, compareRouteIndex,
      };
    }
    setQuery("");
    setTerritorios([]);
    setDinastias([]);
    setTitulos([]);
    setSiglos([]);
    setRelaciones([]);
    setSoloFavoritos(false);
    setMode("view");
    setAisladoId(null);
    setCollapsedIds([]);
    setVistasActivas({ arbol: true, mapa: true });
    setHistoriaActivaId(historia.id);
    setInfoProyecto(null);
    setPortadaVisible(false);
    aplicarPasoHistoria(historia, 0);
  };

  const cambiarPasoHistoria = (delta) => {
    if (!historiaActiva?.pasos?.length) return;
    const siguiente = Math.max(0, Math.min(historiaActiva.pasos.length - 1, historiaPasoIndex + delta));
    aplicarPasoHistoria(historiaActiva, siguiente);
  };

  const salirHistoria = () => {
    const anterior = historiaSnapshotRef.current;
    setHistoriaActivaId(null);
    setHistoriaPasoIndex(0);
    setEventoSeleccionadoId(null);
    if (!anterior) return;
    setQuery(anterior.query);
    setTerritorios(anterior.territorios);
    setDinastias(anterior.dinastias);
    setTitulos(anterior.titulos);
    setSiglos(anterior.siglos);
    setRelaciones(anterior.relaciones);
    setSoloFavoritos(anterior.soloFavoritos);
    setAnioGlobal(anterior.anioGlobal);
    setAnioInput(Number.isFinite(anterior.anioGlobal) ? String(anterior.anioGlobal) : "");
    setVistasActivas(anterior.vistasActivas);
    setTimelineMode(anterior.timelineMode);
    setEventoSeleccionadoId(anterior.eventoSeleccionadoId || null);
    setMode(anterior.mode || "view");
    setOrigen(anterior.origen || null);
    setDestino(anterior.destino || null);
    setAisladoId(anterior.aisladoId || null);
    setCollapsedIds(anterior.collapsedIds || []);
    setCompareRouteIndex(anterior.compareRouteIndex || 0);
    setSeleccion(anterior.seleccionId ? BY_ID[anterior.seleccionId] || null : null);
    historiaSnapshotRef.current = null;
  };

  const mostrarEstadoCompartir = useCallback((mensaje) => {
    setShareStatus(mensaje);
    if (shareStatusTimerRef.current) window.clearTimeout(shareStatusTimerRef.current);
    shareStatusTimerRef.current = window.setTimeout(() => setShareStatus(""), 2600);
  }, []);

  const construirEnlaceCompartido = useCallback(() => {
    if (!seleccion || typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.pathname = rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"));
    url.search = "";
    url.hash = "";
    if (Number.isFinite(anioGlobal)) url.searchParams.set("anio", String(anioGlobal));
    url.searchParams.set("vista", vistaPrincipal);
    if (query.trim()) url.searchParams.set("q", query.trim());
    territorios.forEach((valor) => url.searchParams.append("territorio", valor));
    dinastias.forEach((valor) => url.searchParams.append("dinastia", valor));
    titulos.forEach((valor) => url.searchParams.append("funcion", valor));
    siglos.forEach((valor) => url.searchParams.append("siglo", String(valor)));
    relaciones.forEach((valor) => url.searchParams.append("relacion", valor));
    return url.toString();
  }, [seleccion, anioGlobal, vistaPrincipal, query, territorios, dinastias, titulos, siglos, relaciones]);

  const compartirPersona = useCallback(async () => {
    const enlace = construirEnlaceCompartido();
    if (!enlace || !seleccion) return;
    const payload = {
      title: t("share.personTitle", { name: nombrePrincipal(seleccion) || seleccion.nombre }),
      text: t("share.personText", { name: nombrePrincipal(seleccion) || seleccion.nombre }),
      url: enlace,
    };
    try {
      window.history.replaceState({}, "", enlace);
      if (navigator.share) {
        await navigator.share(payload);
        mostrarEstadoCompartir("Enlace compartido");
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(enlace);
        mostrarEstadoCompartir("Enlace copiado");
        return;
      }
      window.prompt("Copia este enlace:", enlace);
      mostrarEstadoCompartir("Enlace preparado");
    } catch (error) {
      if (error?.name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText?.(enlace);
        mostrarEstadoCompartir("Enlace copiado");
      } catch {
        window.prompt("Copia este enlace:", enlace);
      }
    }
  }, [construirEnlaceCompartido, seleccion, mostrarEstadoCompartir]);

  useEffect(() => {
    if (urlStateLoadedRef.current || typeof window === "undefined") return;
    urlStateLoadedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const rutaInicial = rutaPublicaDesdePath(window.location.pathname);
    if (rutaInicial?.locale === "en") return;

    const todosTerritorios = new Set([
      ...opciones.territorios,
      ...Object.values(opciones.subsPorTerritorio).flat(),
    ]);
    const todasDinastias = new Set([
      ...opciones.dinastias,
      ...Object.values(opciones.ramasPorPrincipal).flat(),
    ]);
    const funcionesValidas = new Set(opciones.titulos.map((item) => item.id));
    const relacionesValidas = new Set(FILTROS_RELACION.map((item) => item.id));

    const q = params.get("q");
    if (q) setQuery(q);
    setTerritorios(params.getAll("territorio").filter((valor) => todosTerritorios.has(valor)));
    setDinastias(params.getAll("dinastia").filter((valor) => todasDinastias.has(valor)));
    setTitulos(params.getAll("funcion").filter((valor) => funcionesValidas.has(valor)));
    setSiglos(params.getAll("siglo").map((valor) => valor === SIN_FECHA ? SIN_FECHA : Number(valor)).filter((valor) =>
      valor === SIN_FECHA || opciones.siglos.includes(valor)
    ));
    setRelaciones(params.getAll("relacion").filter((valor) => relacionesValidas.has(valor)));

    const rutaPublica = rutaPublicaDesdePath(window.location.pathname);
    if (rutaPublica?.tipo === "territorio") {
      const valor = valorPorSlug(rutaPublica.slug, [...todosTerritorios]);
      if (valor) setTerritorios([valor]);
    } else if (rutaPublica?.tipo === "dinastia") {
      const valor = valorPorSlug(rutaPublica.slug, [...todasDinastias]);
      if (valor) setDinastias([valor]);
    } else if (rutaPublica?.tipo === "historia") {
      const historia = HISTORIAS.find((item) => slugPublico(item.titulo) === rutaPublica.slug || slugPublico(item.id) === rutaPublica.slug);
      if (historia?.disponible && historia?.pasos?.length) {
        window.setTimeout(() => iniciarHistoria(historia.id), 80);
      } else if (historia) {
        setInfoProyecto("historias");
      }
    }

    const vista = params.get("vista");
    if (vista === "arbol") setVistasActivas({ arbol: true, mapa: false });
    else if (vista === "mapa") setVistasActivas({ arbol: false, mapa: true });
    else if (vista === "ambos") setVistasActivas({ arbol: true, mapa: true });

    const anioParam = params.get("anio");
    const año = anioParam === null ? null : ajustarAnio(anioParam);
    if (Number.isFinite(año)) {
      setAnioGlobal(año);
      setAnioInput(String(año));
    }

    const personaId = params.get("persona") || personaIdDesdeRuta(window.location.pathname);
    if (personaId && BY_ID[personaId]) {
      setSeleccion(BY_ID[personaId]);
      window.setTimeout(() => {
        centerOn(personaId);
        centerOnTimeline(personaId);
      }, 160);
    }
  }, [opciones, ajustarAnio]);

  const handleBoxClick = useCallback((p) => {
    if (mode === "compare") {
      if (!origen) { setOrigen(p.id); setDestino(null); }
      else if (!destino && p.id !== origen) { setDestino(p.id); }
      else { setOrigen(p.id); setDestino(null); }
    } else if (mode === "aislar") {
      setAisladoId(p.id);
    } else {
      setSeleccion(p);
      centerOn(p.id);
    }
  }, [mode, origen, destino]);
  
  const getBoxHandlers = (id) => {
    const p = BY_ID[id];
    return {
      setRef: (el) => {
        if (el) {
          nodeRefs.current[id] = el;
        } else {
          delete nodeRefs.current[id];
        }
      },
      onEnter: () => {
        setHovered(id);
      },
      onLeave: () => {
        setHovered(null);
      },
      onClick: () => {
        if (typeof handleBoxClick === 'function') {
          handleBoxClick(p);
        } else {
          setSeleccion(p);
        }
      }
    };
  };

  // Centraliza el cálculo de clases y eventos de cada ficha del árbol.
  const renderPersonBox = (id, boxLayout) => {
    const p = BY_ID[id];
    let cls = "box";
    if (boxLayout?.mini) cls += " box-mini";
    if (hovered === id) cls += " hovered";
    else if (lineage.has(id)) cls += " lineage";
    if (comparePath && comparePath.includes(id)) cls += " path-hl";
    if (mode === "compare" && (id === origen || id === destino)) cls += " pick";
    if (searchMatchSet.has(id)) cls += id === searchCurrentId ? " search-current" : " search-match";
    if (amantesFoco.has(id)) cls += " lover-related";
    if (historiaPersonasSet.has(id)) cls += " story-related";
    if (Number.isFinite(anioGlobal)) {
      if (!estaVivaEn(p, anioGlobal)) cls += " year-inactive";
      if (reinadosActivos(p, anioGlobal, { soloEfectivos: true }).length) cls += " year-ruling";
    }
    const h = getBoxHandlers(id);
    return (
      <PersonBox
        key={id}
        p={p}
        cls={cls}
        accent={ACCENTS[p.dinastia] || ACCENTS[getCategoriaDinastía(p.dinastia)] || "#71717A"}
        style={boxLayout ? {
          position: "absolute",
          left: boxLayout.x,
          top: boxLayout.y,
          width: boxLayout.w,
          height: boxLayout.h,
        } : undefined}
        setRef={h.setRef}
        onEnter={h.onEnter}
        onLeave={h.onLeave}
        onClick={h.onClick}
        hasDescendants={(HIJOS_POR_ID[id] || []).length > 0}
        descendantsCollapsed={collapsedSet.has(id)}
        onToggleDescendants={() => toggleDescendants(id)}
      />
    );
  };
  
  const miniW = 180, miniH = 110;
  const miniScaleX = canvasSize.w ? miniW / canvasSize.w : 1;
  const miniScaleY = canvasSize.h ? miniH / canvasSize.h : 1;
  const onMinimapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / miniScaleX;
    const relY = (e.clientY - rect.top) / miniScaleY;
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.scrollTo({ left: relX * zoom - scrollEl.clientWidth / 2, top: relY * zoom - scrollEl.clientHeight / 2, behavior: "smooth" });
  };

  const filtrosActivosResumen = useMemo(() => {
    const lista = [];
    if (queryTrim) lista.push({ key: "query", label: `Búsqueda: “${query}”` });
    territorios.forEach((t) => lista.push({ key: `territorio-${t}`, label: `Territorio: ${t}` }));
    dinastias.forEach((d) => lista.push({ key: `dinastia-${d}`, label: `Dinastía: ${d}` }));
    titulos.forEach((id) => {
      const categoria = opciones.titulos.find((item) => item.id === id);
      lista.push({ key: `titulo-${id}`, label: categoria ? `Función: ${categoria.label}` : `Función: ${id}` });
    });
    siglos.forEach((valor) => {
      const label = valor === SIN_FECHA ? "Fechas incompletas" : `Periodo: s. ${nRomano[valor] || valor}`;
      lista.push({ key: `siglo-${valor}`, label });
    });
    relaciones.forEach((id) => {
      const filtro = FILTROS_RELACION.find((item) => item.id === id);
      lista.push({ key: `rel-${id}`, label: filtro ? `Relación: ${filtro.label}` : `Relación: ${id}` });
    });
    if (soloFavoritos) lista.push({ key: "solo-favoritos", label: "Solo favoritos" });
    return lista;
  }, [queryTrim, query, territorios, dinastias, titulos, siglos, relaciones, soloFavoritos, opciones.titulos]);

  const cambiarIdioma = useCallback((siguiente) => {
    if (typeof window === "undefined" || !["es", "en"].includes(siguiente) || siguiente === locale) return;
    const rutaActual = rutaPublicaDesdePath(window.location.pathname);
    let destino = siguiente === "en" ? "/en/" : "/es/";

    // Solo conservamos una ficha individual al pasar a EN cuando exista una
    // traducción explícita (nombreEn). Si no, vamos a la portada inglesa.
    if (rutaActual?.tipo === "persona") {
      const personaId = personaIdDesdeRuta(window.location.pathname);
      const persona = personaId ? BY_ID[personaId] : null;
      const slugDestino = slugPersonaPorLocale(persona, siguiente);
      if (persona && slugDestino) destino = rutaEntidadLocalizada(siguiente, "persona", slugDestino);
    }

    window.location.assign(destino);
  }, [locale]);

  const selectorIdioma = (
    <div
      aria-label="Idioma / Language"
      style={{
        position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
        display: "flex", alignItems: "center", gap: 5, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 10, color: "#9A8E75",
      }}
    >
      <button type="button" onClick={() => cambiarIdioma("es")} aria-current={locale === "es" ? "page" : undefined}
        style={{ border: 0, background: "transparent", padding: "2px 3px", cursor: "pointer", font: "inherit", fontWeight: locale === "es" ? 800 : 600, color: locale === "es" ? "#7A2E2E" : "#8A7F65" }}>ES</button>
      <span aria-hidden="true">|</span>
      <button type="button" onClick={() => cambiarIdioma("en")} aria-current={locale === "en" ? "page" : undefined}
        style={{ border: 0, background: "transparent", padding: "2px 3px", cursor: "pointer", font: "inherit", fontWeight: locale === "en" ? 800 : 600, color: locale === "en" ? "#7A2E2E" : "#8A7F65" }}>EN</button>
    </div>
  );

  const entrarEnProyecto = useCallback(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(PORTADA_STORAGE_KEY, "1");
    setPortadaVisible(false);
  }, []);

  if (locale === "en") {
    return (
      <div className="wrap">
        <div className="header" style={{ position: "relative" }}>
          <div style={{ textAlign: "center" }}>
            <h1>The Tree of Europe</h1>
            <div className="sub">Genealogy · Dynasties · Reigns · Territories · 1200–1800</div>
          </div>
          {selectorIdioma}
        </div>

        <main style={{ maxWidth: 760, margin: "70px auto", textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#8A7F65" }}>English edition</div>
          <h2 style={{ margin: "12px 0", fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 500, lineHeight: 1.05, color: "#2C2620" }}>The Tree of Europe</h2>
          <p style={{ margin: "0 auto", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#6B6350" }}>
            An interactive historical and genealogical atlas for exploring the families, dynasties, reigns and political connections that shaped Europe.
          </p>
          <p style={{ margin: "18px auto 28px", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 13, lineHeight: 1.6, color: "#8A7F65" }}>
            The English edition is being prepared progressively. The complete interactive application is currently available in Spanish.
          </p>
          <button type="button" onClick={() => cambiarIdioma("es")}
            style={{ border: "1px solid #7A2E2E", borderRadius: 4, background: "#7A2E2E", color: "#F8F3E6", padding: "10px 16px", cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 12, fontWeight: 700 }}>
            Explore the Spanish version
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="header" style={{ position: "relative" }}>
        <div style={{ textAlign: "center" }}>
          <h1>{t("brand.name")}</h1>
          <div className="sub">{t("brand.scope")}</div>
        </div>
        {selectorIdioma}
      </div>
      <div className="workspace-topbar">
        <section className="workspace-topbar-section workspace-toolbar-search">
          <div className="toolbar-label">Búsqueda</div>
          <div className="search-box toolbar-search-box">
            <Search size={13} color="#8A7F65" />
            <input
              placeholder="Buscar nombre, título, dinastía o territorio…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") irACoincidencia(event.shiftKey ? -1 : 1);
              }}
            />
            {queryTrim && (
              <div className="toolbar-search-nav">
                <span className="toolbar-search-count">
                  {searchMatchIds.length ? `${currentSearchIndex + 1} / ${searchMatchIds.length}` : "0 / 0"}
                </span>
                <button type="button" className="nav-btn search-nav-btn" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(-1)}>
                  <ChevronRight size={10} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(1)}>
                  <ChevronRight size={10} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="workspace-topbar-section workspace-toolbar-year">
          <div className="toolbar-label">Año global</div>
          <div className="global-year-control global-year-control-inline" aria-label="Selector global de año">
            <input
              className={`global-year-range${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
              type="range"
              min={TL_MIN}
              max={TL_MAX}
              step="1"
              value={Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))}
              onChange={(event) => actualizarAnioDesdeRango(event.target.value)}
              aria-label="Seleccionar año"
            />
            <div className="global-year-entry-row">
              <input
                className="global-year-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={anioInput}
                placeholder="Año"
                onChange={(event) => {
                  const valor = event.target.value;
                  setReproduciendoHistoria(false);
                  if (/^\d*$/.test(valor)) setAnioInput(valor);
                }}
                onBlur={confirmarAnioEscrito}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirmarAnioEscrito();
                    event.currentTarget.blur();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setAnioInput(Number.isFinite(anioGlobal) ? String(anioGlobal) : "");
                  }
                }}
                aria-label="Año global exacto"
                title={`Escribe un año entre ${TL_MIN} y ${TL_MAX} y pulsa Enter`}
              />
              <button
                type="button"
                className="global-year-reset"
                onClick={restablecerAnio}
                title="Mostrar todos los años"
              >
                Todos los años
              </button>
            </div>
            <div className="history-playback-controls" aria-label="Reproducción automática de la historia">
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(-1)}
                title="Retroceder un año"
                aria-label="Retroceder un año"
              >
                <SkipBack size={12} />
              </button>
              <button
                type="button"
                className={`history-playback-btn history-playback-main${reproduciendoHistoria ? " active" : ""}`}
                onClick={alternarReproduccionHistoria}
                title={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir historia"}
                aria-label={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir historia"}
              >
                {reproduciendoHistoria ? <Pause size={12} /> : <Play size={12} />}
                <span>{reproduciendoHistoria ? "Pausar" : "Reproducir"}</span>
              </button>
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(1)}
                title="Avanzar un año"
                aria-label="Avanzar un año"
              >
                <SkipForward size={12} />
              </button>
              <label className="history-speed-control">
                <span>Velocidad</span>
                <select
                  value={velocidadHistoria}
                  onChange={(event) => setVelocidadHistoria(Number(event.target.value))}
                  aria-label="Velocidad de reproducción"
                >
                  <option value={1}>1 año/paso</option>
                  <option value={5}>5 años/paso</option>
                  <option value={10}>10 años/paso</option>
                </select>
              </label>
            </div>
            <div className="global-year-summary">
              {Number.isFinite(anioGlobal)
                ? `${personasVivasEnAnio.length} personas vivas · ${gobernantesActivosEnAnio.length} gobernando`
                : "Todos los años · mueve el control o escribe una fecha"}
            </div>
          </div>
        </section>

        <section className="workspace-topbar-section workspace-toolbar-filters">
          <div className="toolbar-label">Filtros activos</div>
          <div className="toolbar-tag-list">
            {filtrosActivosResumen.length ? (
              filtrosActivosResumen.map((item) => (
                <span key={item.key} className="toolbar-tag">{item.label}</span>
              ))
            ) : (
              <span className="toolbar-empty">Sin filtros activos</span>
            )}
          </div>
          {hayFiltros && (
            <button type="button" className="clear-btn toolbar-clear-btn" onClick={limpiar}>
              Limpiar todo
            </button>
          )}
        </section>

        <div className="workspace-topbar-secondary">
          <section className="workspace-topbar-section workspace-toolbar-view">
            <div className="toolbar-label">Zona principal</div>
            <div className="segmented-control view-toggle-control" aria-label="Vistas visibles">
              <button
                type="button"
                className={`segment-btn${mostrarArbol ? " active" : ""}`}
                aria-pressed={mostrarArbol}
                onClick={() => alternarVista("arbol")}
              >
                Árbol
              </button>
              <button
                type="button"
                className={`segment-btn${mostrarMapa ? " active" : ""}`}
                aria-pressed={mostrarMapa}
                onClick={() => alternarVista("mapa")}
              >
                Mapa
              </button>
            </div>
          </section>

          <section className="workspace-topbar-section workspace-toolbar-actions">
            <div className="toolbar-label">Interacción</div>
            <div className="nav-controls topbar-mode-controls">
              <div className="compare-split-control" ref={compareMenuRef}>
                <button
                  type="button"
                  className={`nav-btn nav-btn-wide compare-main-btn ${mode === "compare" ? "active" : ""}`}
                  onClick={() => {
                    const entrar = mode !== "compare";
                    setMode(entrar ? "compare" : "view");
                    if (entrar) { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }
                    setCompareMenuOpen(false);
                  }}
                >
                  <GitCompare size={12} /> Comparar parentesco
                </button>
                <button
                  type="button"
                  className={`nav-btn compare-menu-btn ${mode === "compare" ? "active" : ""}`}
                  onClick={() => setCompareMenuOpen((actual) => !actual)}
                  aria-haspopup="menu"
                  aria-expanded={compareMenuOpen}
                  title="Elegir tipo de comparación"
                >
                  <ChevronDown size={11} />
                </button>
                {compareMenuOpen && (
                  <div className="compare-mode-menu" role="menu">
                    {MODOS_COMPARACION.map((opcion) => (
                      <button
                        type="button"
                        key={opcion.id}
                        role="menuitemradio"
                        aria-checked={modoComparacion === opcion.id}
                        className={`compare-mode-option${modoComparacion === opcion.id ? " active" : ""}`}
                        onClick={() => {
                          if (mode !== "compare") { setOrigen(null); setDestino(null); }
                          setModoComparacion(opcion.id);
                          setMode("compare");
                          setCompareRouteIndex(0);
                          setCompareMenuOpen(false);
                        }}
                      >
                        <strong>{opcion.label}</strong>
                        <span>{opcion.descripcion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className={`nav-btn nav-btn-wide ${mode === "aislar" ? "active" : ""}`}
                onClick={() => { setMode(mode === "aislar" ? "view" : "aislar"); setAisladoId(null); }}
              >
                <Focus size={12} /> Aislar persona
              </button>
              <button type="button" className={`nav-btn nav-btn-wide${historiaActiva ? " active" : ""}`} onClick={() => setInfoProyecto("historias")}>
                <BookOpen size={12} /> Historias
              </button>
              <div className="favorites-control" ref={favoritosMenuRef}>
                <button type="button" className={`nav-btn nav-btn-wide${favoritosOpen || soloFavoritos ? " active" : ""}`} onClick={() => setFavoritosOpen((actual) => !actual)} aria-haspopup="menu" aria-expanded={favoritosOpen}>
                  <span className="favorite-star-symbol" aria-hidden="true">★</span> Favoritos {favoritos.length ? `(${favoritos.length})` : ""}
                </button>
                {favoritosOpen && (
                  <div className="favorites-menu" role="menu">
                    <div className="favorites-menu-head"><strong>Mis favoritos</strong><span>{favoritos.length}</span></div>
                    <div className="favorites-menu-list">
                      {favoritos.length ? favoritos.map((id) => (
                        <div key={id} className="favorite-menu-row">
                          <button type="button" onClick={() => { seleccionarPersonaPorId(id); setFavoritosOpen(false); }}>{BY_ID[id]?.nombre || id}</button>
                          <button type="button" className="favorite-remove" onClick={() => alternarFavorito(id)} title="Quitar de favoritos" aria-label={`Quitar ${BY_ID[id]?.nombre || id} de favoritos`}>×</button>
                        </div>
                      )) : <div className="favorites-empty">Marca una ficha con ★ para guardarla aquí.</div>}
                    </div>
                    <label className={`favorites-filter-toggle${favoritos.length ? "" : " is-disabled"}`}>
                      <input type="checkbox" checked={soloFavoritos} disabled={!favoritos.length} onChange={(event) => setSoloFavoritos(event.target.checked)} />
                      <span>Mostrar solo favoritos</span>
                    </label>
                  </div>
                )}
              </div>
              <div className="share-control-wrap">
                <button
                  type="button"
                  className="nav-btn nav-btn-wide share-person-btn"
                  disabled={!seleccion}
                  onClick={compartirPersona}
                  title={seleccion ? `Compartir ${seleccion.nombre}` : "Selecciona una persona para compartirla"}
                  aria-label={seleccion ? `Compartir ${seleccion.nombre}` : "Selecciona una persona para compartirla"}
                >
                  <Share2 size={12} /> Compartir persona
                </button>
                {shareStatus && <span className="share-status" role="status">{shareStatus}</span>}
              </div>
            </div>
          </section>
        </div>
      </div>

      {mode === "compare" && (
        <div className="compare-bar workspace-mode-bar">
          <span className="compare-mode-label">
            {MODOS_COMPARACION.find((opcion) => opcion.id === modoComparacion)?.label || "Comparación"}
          </span>
          <span>Origen: <b>{origen ? BY_ID[origen]?.nombre : "haz clic en una persona"}</b></span>
          <span>Destino: <b>{destino ? BY_ID[destino]?.nombre : "luego en otra"}</b></span>
          {comparePath && (
            <span className="compare-path" style={{ marginLeft: "auto" }}>
              {comparePath.map((id, index) => (
                <React.Fragment key={`${id}-${index}`}>
                  {index > 0 && <span className="compare-edge"> —{tipoRelacionEntre(comparePath[index - 1], id)}→ </span>}
                  <span>{BY_ID[id]?.nombre || id}</span>
                </React.Fragment>
              ))}
            </span>
          )}
          {comparePaths.length > 1 && (
            <div className="compare-route-switcher" aria-label="Cambiar ruta de parentesco">
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual - 1 + comparePaths.length) % comparePaths.length)}
                aria-label="Ruta anterior"
              >
                <ArrowLeft size={11} />
              </button>
              <span>{Math.min(compareRouteIndex, comparePaths.length - 1) + 1} / {comparePaths.length}</span>
              <button
                type="button"
                onClick={() => setCompareRouteIndex((actual) => (actual + 1) % comparePaths.length)}
                aria-label="Ruta siguiente"
              >
                <ArrowRight size={11} />
              </button>
            </div>
          )}
          {origen && destino && !comparePath && (
            <span style={{ marginLeft: "auto" }}>No hay un camino documentado con este criterio.</span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => { setOrigen(null); setDestino(null); setCompareRouteIndex(0); }}>reiniciar</button>
        </div>
      )}

      {mode === "aislar" && (
        <div className="compare-bar workspace-mode-bar">
          <span>Aislando a: <b>{aisladoId ? BY_ID[aisladoId]?.nombre : "haz clic en una persona"}</b></span>
          {aisladoSet && (
            <span style={{ marginLeft: "auto" }}>
              Mostrando {aisladoSet.size} persona{aisladoSet.size === 1 ? "" : "s"} (ascendencia y descendencia de {BY_ID[aisladoId]?.nombre})
            </span>
          )}
          <button className="clear-btn" style={{ marginTop: 0 }} onClick={() => setAisladoId(null)}>reiniciar</button>
        </div>
      )}

      <div className="workspace-grid">
        <aside className="workspace-sidebar">
          <section className="panel workspace-fixed-panel workspace-filter-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title">Filtros</span>
              <span className="panel-count">
                {hayFiltros ? `${visiblePeople.length} / ${PERSONAS.length} visibles` : `${PERSONAS.length} personas`}
              </span>
            </div>
            <div className="panel-body workspace-panel-scroll workspace-filter-scroll">
              <div className="filters-row filters-row-vertical filters-always-open">
                <section className="filter-static-section">
                  <div className="filter-title">Territorios</div>
                  <div className="filter-group filter-group-dinastias">
                    {opciones.territorios.map((territorio) => {
                      const hijos = opciones.subsPorTerritorio[territorio] || [];
                      const tieneHijos = hijos.length > 0;
                      const expandido = territoriosExpandidos.includes(territorio);
                      const colorPadre = REINO_COLOR[territorio] || REINO_COLOR_DEFAULT;
                      return (
                        <div key={territorio} className="dinastia-block">
                          <span className="dinastia-chip-row">
                            <Chip label={territorio} active={territorios.includes(territorio)} color={colorPadre} onClick={() => toggle(setTerritorios, territorios, territorio)} />
                            {tieneHijos && (
                              <button
                                type="button"
                                className="dinastia-expand-btn"
                                onClick={() => toggle(setTerritoriosExpandidos, territoriosExpandidos, territorio)}
                                title={expandido ? "Ocultar sub-territorios" : `Ver sub-territorios de ${territorio}`}
                                aria-label={expandido ? `Ocultar sub-territorios de ${territorio}` : `Mostrar sub-territorios de ${territorio}`}
                              >
                                {expandido ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              </button>
                            )}
                          </span>
                          {tieneHijos && expandido && (
                            <div className="dinastia-ramas">
                              {hijos.map((hijo) => (
                                <Chip key={hijo} small label={hijo} active={territorios.includes(hijo)} color={REINO_COLOR[hijo] || colorPadre} onClick={() => toggle(setTerritorios, territorios, hijo)} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="filter-static-section">
                  <div className="filter-title">Dinastías</div>
                  <div className="filter-group filter-group-dinastias">
                    {opciones.dinastias.map((dinastia) => {
                      const ramas = opciones.ramasPorPrincipal[dinastia] || [];
                      const tieneRamas = ramas.length > 0;
                      const expandida = dinastiasExpandidas.includes(dinastia);
                      return (
                        <div key={dinastia} className="dinastia-block">
                          <span className="dinastia-chip-row">
                            <Chip label={dinastia} active={dinastias.includes(dinastia)} color={ACCENTS[dinastia] || "#71717A"} onClick={() => toggle(setDinastias, dinastias, dinastia)} />
                            {tieneRamas && (
                              <button
                                type="button"
                                className="dinastia-expand-btn"
                                onClick={() => toggle(setDinastiasExpandidas, dinastiasExpandidas, dinastia)}
                                title={expandida ? "Ocultar ramas menores" : `Ver ramas menores de ${dinastia}`}
                                aria-label={expandida ? `Ocultar ramas de ${dinastia}` : `Mostrar ramas de ${dinastia}`}
                              >
                                {expandida ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              </button>
                            )}
                          </span>
                          {tieneRamas && expandida && (
                            <div className="dinastia-ramas">
                              {ramas.map((rama) => (
                                <Chip key={rama} small label={rama} active={dinastias.includes(rama)} color={ACCENTS[rama] || ACCENTS[dinastia] || "#71717A"} onClick={() => toggle(setDinastias, dinastias, rama)} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="filter-static-section">
                  <div className="filter-title">Función histórica</div>
                  <div className="filter-group">
                    {opciones.titulos.map((categoria) => (
                      <Chip
                        key={categoria.id}
                        label={categoria.label}
                        active={titulos.includes(categoria.id)}
                        color="#8A6D3B"
                        onClick={() => toggle(setTitulos, titulos, categoria.id)}
                      />
                    ))}
                  </div>
                </section>

                <section className="filter-static-section">
                  <div className="filter-title">Periodo vital</div>
                  <div className="filter-group">
                    {opciones.siglos.map((valor) => (
                      <Chip key={valor} label={`s. ${nRomano[valor] || valor}`} active={siglos.includes(valor)} color="#3D4F63" onClick={() => toggle(setSiglos, siglos, valor)} />
                    ))}
                    {opciones.hayPersonasSinFecha && (
                      <Chip label="Fechas incompletas" active={siglos.includes(SIN_FECHA)} color="#6B6350" onClick={() => toggle(setSiglos, siglos, SIN_FECHA)} />
                    )}
                  </div>
                </section>

                <section className="filter-static-section">
                  <div className="filter-title">Relaciones y familia</div>
                  <div className="filter-group filter-group-relaciones">
                    {opciones.relaciones.map((filtro) => (
                      <Chip
                        key={filtro.id}
                        label={filtro.label}
                        active={relaciones.includes(filtro.id)}
                        color={filtro.id === "amantes" ? "#8E3D68" : "#5E6673"}
                        onClick={() => toggle(setRelaciones, relaciones, filtro.id)}
                      />
                    ))}
                  </div>
                </section>
              </div>

              <button
                className="clear-btn"
                onClick={limpiar}
                disabled={!hayFiltros}
                style={{ visibility: hayFiltros ? "visible" : "hidden" }}
              >
                Limpiar filtros
              </button>
            </div>
          </section>
        </aside>

        <main className={`workspace-main workspace-main-${vistaPrincipal}`}>
          {mostrarArbol && (
            <section className="workspace-stage workspace-tree-stage" aria-label="Árbol genealógico">
              <div className="tree-toolbar" aria-label="Controles del árbol">
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom - 0.1)} title="Alejar árbol" aria-label="Alejar árbol"><ZoomOut size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(0.8)} title="Restablecer árbol" aria-label="Restablecer árbol"><RotateCcw size={12} /></button>
                <button type="button" className="nav-btn" onClick={() => cambiarZoomArbol(zoom + 0.1)} title="Acercar árbol" aria-label="Acercar árbol"><ZoomIn size={13} /></button>
                <span className="tree-toolbar-separator" aria-hidden="true" />
                <button type="button" className="nav-btn" onClick={() => scrollBy(-200, 0)} title="Mover árbol a la izquierda" aria-label="Mover árbol a la izquierda"><ArrowLeft size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(0, -150)} title="Mover árbol hacia arriba" aria-label="Mover árbol hacia arriba"><ArrowUp size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(0, 150)} title="Mover árbol hacia abajo" aria-label="Mover árbol hacia abajo"><ArrowDown size={13} /></button>
                <button type="button" className="nav-btn" onClick={() => scrollBy(200, 0)} title="Mover árbol a la derecha" aria-label="Mover árbol a la derecha"><ArrowRight size={13} /></button>
              </div>

              {collapsedIds.length > 0 && (
                <div className="branch-collapse-bar branch-collapse-bar-floating">
                  <span>{collapsedIds.length} rama{collapsedIds.length === 1 ? "" : "s"} cerrada{collapsedIds.length === 1 ? "" : "s"} · {hiddenByCollapse.size} fichas ocultas</span>
                  <button type="button" onClick={() => setCollapsedIds([])}>Abrir todas</button>
                </div>
              )}

              <div className="tree-outer">
                <div className="minimap" onClick={onMinimapClick}>
                  {PERSONAS.map((persona) => {
                    const pos = positions[persona.id];
                    if (!pos) return null;
                    return (
                      <span
                        key={persona.id}
                        className="minimap-dot"
                        style={{
                          left: pos.x * miniScaleX,
                          top: pos.y * miniScaleY,
                          background: ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A",
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  className="tree-scroll"
                  ref={scrollRef}
                  onMouseDown={onPointerDown}
                  onMouseMove={onPointerMove}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  style={{ width: "100%" }}
                >
                  <div style={{ width: canvasSize.w * zoom, height: canvasSize.h * zoom, position: "relative" }}>
                    <div
                      className="tree-canvas"
                      style={{
                        width: canvasSize.w,
                        height: canvasSize.h,
                        transform: `scale(${zoom})`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <svg
                        key={connectorLayerKey}
                        className="svg-overlay"
                        width={canvasSize.w}
                        height={canvasSize.h}
                        viewBox={`0 0 ${canvasSize.w} ${canvasSize.h}`}
                        aria-hidden="true"
                      >
                        {connectors}
                      </svg>

                      {treeLayout.units.map((unit) => (
                        <div
                          className="unit"
                          key={unit.key}
                          style={{
                            left: unit.x,
                            top: unit.y,
                            width: unit.width,
                            height: unit.height,
                          }}
                        >
                          {unit.boxes.map((box) => renderPersonBox(box.id, box))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {mostrarMapa && (
            <section className="workspace-stage workspace-map-stage" aria-label="Mapa de territorios">
              <MapaEuropa
                seleccion={seleccion}
                anioGlobal={anioGlobal}
                onSelectTerritorio={(idRegion) => console.log("ID pulsado:", idRegion)}
              />
              <div className="territory-hint workspace-map-hint">
                {seleccion
                  ? (esGobernante(seleccion)
                      ? (Number.isFinite(anioGlobal)
                          ? (territoriosGobernadosEnAño(seleccion, anioGlobal).length
                              ? `En ${anioGlobal}, ${seleccion.nombre} gobernaba: ${territoriosGobernadosEnAño(seleccion, anioGlobal).join(", ")}.`
                              : `${seleccion.nombre} no gobernaba ningún territorio registrado en ${anioGlobal}.`)
                          : `Se destacan los territorios que gobernó ${seleccion.nombre}; elige un año para ver solo los vigentes entonces.`)
                      : `${seleccion.nombre} no ostentó un título de gobierno, así que no se ilumina ningún territorio en el mapa (puedes ver su vinculación territorial en la biografía).`)
                  : (Number.isFinite(anioGlobal)
                      ? `Año ${anioGlobal}: haz clic sobre una persona para ver qué territorios gobernaba entonces.`
                      : "Haz clic sobre una persona para ver los territorios que gobernó.")}
              </div>
            </section>
          )}
        </main>

        <aside className="workspace-inspector">
          <section className="panel workspace-fixed-panel workspace-bio-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title">Biografía</span>
              <span className="panel-count">{personaBio ? "1 personaje" : "ninguno"}</span>
            </div>
            <div className="panel-body workspace-panel-scroll workspace-bio-scroll">
              {personaBio ? (
                <div className="bio-panel">
                  <div className="bio-head">
                    <div>
                      <h3 className="bio-nombre">{nombrePrincipal(personaBio)}</h3>
                      {sobrenombreDePersona(personaBio) && <div className="bio-sobrenombre">«{sobrenombreDePersona(personaBio)}»</div>}
                      <span
                        className="badge"
                        style={{ background: ACCENTS[personaBio.dinastia] || ACCENTS[getCategoriaDinastía(personaBio.dinastia)] || "#71717A" }}
                      >
                        {personaBio.dinastia}
                      </span>
                    </div>
                    <div className="bio-head-actions">
                      <button
                        type="button"
                        className={`bio-favorite-btn${favoritosSet.has(personaBio.id) ? " active" : ""}`}
                        onClick={() => alternarFavorito(personaBio.id)}
                        title={favoritosSet.has(personaBio.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                        aria-label={favoritosSet.has(personaBio.id) ? `Quitar ${personaBio.nombre} de favoritos` : `Añadir ${personaBio.nombre} a favoritos`}
                      >★</button>
                      {!hovered && seleccion && (
                        <button type="button" className="close" aria-label="Cerrar biografía" onClick={() => setSeleccion(null)}><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  {personaBio.biografia && <p className="bio-texto">{personaBio.biografia}</p>}

                  <dl>
                    <dt>ID</dt><dd><code className="bio-id">{personaBio.id}</code></dd>
                    <dt>Territorio(s)</dt><dd>{(personaBio.reinos || []).join(", ") || "No indicado"}</dd>
                    {sobrenombreDePersona(personaBio) && <><dt>Sobrenombre</dt><dd>{sobrenombreDePersona(personaBio)}</dd></>}
                    <dt>Título</dt><dd>{personaBio.titulo}</dd>
                    <dt>Fechas</dt>
                    <dd>
                      {formatoFechas(personaBio)}
                      {siglosDePersona(personaBio).length > 0 && ` (s. ${siglosDePersona(personaBio).map((valor) => nRomano[valor] || valor).join("–")})`}
                    </dd>
                    {listaReinados(personaBio).map((reinado, index) => {
                      const tipo = etiquetaTipoReinado(reinado.tipo);
                      return (
                        <React.Fragment key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`}>
                          <dt>Reinado · {reinado.territorio}</dt>
                          <dd>{reinado.desde} – {reinado.hasta}{tipo ? ` (${tipo})` : ""}</dd>
                        </React.Fragment>
                      );
                    })}
                  </dl>

                  <div className="bio-relations">
                    <h4>Relaciones documentadas</h4>
                    <ListaRelaciones etiqueta="Padre" ids={personaBio.padre ? [personaBio.padre] : []} onSelect={seleccionarPersonaPorId} />
                    <ListaRelaciones etiqueta="Madre" ids={personaBio.madre ? [personaBio.madre] : []} onSelect={seleccionarPersonaPorId} />
                    <ListaRelaciones etiqueta={listaConyuges(personaBio).length > 1 ? "Cónyuges" : "Cónyuge"} ids={listaConyuges(personaBio)} onSelect={seleccionarPersonaPorId} />
                    <ListaRelaciones etiqueta={listaAmantes(personaBio).length > 1 ? "Amantes" : "Amante"} ids={listaAmantes(personaBio)} tipo="amantes" onSelect={seleccionarPersonaPorId} />
                    <ListaRelaciones etiqueta="Hijos/as" ids={HIJOS_POR_ID[personaBio.id] || []} onSelect={seleccionarPersonaPorId} />
                    {!personaBio.padre && !personaBio.madre && !listaConyuges(personaBio).length && !listaAmantes(personaBio).length && !(HIJOS_POR_ID[personaBio.id] || []).length && (
                      <div className="bio-relations-empty">No hay relaciones cargadas para esta persona.</div>
                    )}
                  </div>

                  {hovered && seleccion && hovered !== seleccion.id && (
                    <div className="bio-hint">Vista previa de {personaBio.nombre} — al quitar el ratón volverás a ver a {seleccion.nombre}.</div>
                  )}
                </div>
              ) : (
                <div className="bio-empty">Pasa el ratón por encima de un personaje, o haz clic para dejarlo fijo, y su biografía aparecerá aquí.</div>
              )}
            </div>
          </section>
        </aside>

        <section className="workspace-bottom">
          <section className="panel timeline-panel">
            <div className="panel-head panel-head-static timeline-panel-head">
              <div className="timeline-title-group">
                <span className="panel-title">Línea temporal</span>
                <span className="panel-count">
                  {timelineMode === "eventos" ? `${eventosOrdenados.length} eventos` : `${visiblePeople.length} personas${timelineMode === "ambos" ? ` · ${eventosOrdenados.length} eventos` : ""}`}
                </span>
              </div>
              <div className="timeline-head-tools">
                <div className="timeline-mode-toggle" role="group" aria-label="Contenido de la línea temporal">
                  <button type="button" className={timelineMode === "personas" ? "active" : ""} onClick={() => setTimelineMode("personas")}>Personas</button>
                  <button type="button" className={timelineMode === "eventos" ? "active" : ""} onClick={() => setTimelineMode("eventos")}>Eventos</button>
                  <button type="button" className={timelineMode === "ambos" ? "active" : ""} onClick={() => setTimelineMode("ambos")}>Ambos</button>
                </div>
                <div className="timeline-zoom-controls" aria-label="Escala temporal">
                  <button type="button" disabled={timelineScaleIndex === 0} onClick={() => setTimelineScaleIndex((valor) => Math.max(0, valor - 1))} title="Reducir escala temporal"><ZoomOut size={12} /></button>
                  <span aria-hidden="true" className="timeline-zoom-divider" />
                  <button type="button" disabled={timelineScaleIndex === TIMELINE_SCALES.length - 1} onClick={() => setTimelineScaleIndex((valor) => Math.min(TIMELINE_SCALES.length - 1, valor + 1))} title="Ampliar escala temporal"><ZoomIn size={12} /></button>
                </div>
              </div>
            </div>
            <div className="panel-body timeline-panel-body">
              {eventoSeleccionado && (
                <div className="timeline-event-detail">
                  <div>
                    <span>{etiquetaFechaEvento(eventoSeleccionado)} · {eventoSeleccionado.categoria}</span>
                    <strong>{eventoSeleccionado.titulo}</strong>
                    <p>{eventoSeleccionado.descripcion}</p>
                    {!!eventoSeleccionado.personas?.length && (
                      <div className="timeline-event-people">
                        {eventoSeleccionado.personas.filter((id) => BY_ID[id]).map((id) => (
                          <button type="button" key={id} onClick={() => seleccionarPersonaPorId(id)}>{BY_ID[id].nombre}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="button" className="timeline-event-close" onClick={() => setEventoSeleccionadoId(null)} aria-label="Cerrar detalle del evento"><X size={13} /></button>
                </div>
              )}
              <div className="timeline-resizable">
                <div className="tl-scroll-container" ref={tlScrollRef}>
                  <div className="tl-content" style={{ minWidth: timelineContentWidth, width: timelineContentWidth }}>
                    <div className="tl-header">
                      <div className="tl-corner">{timelineMode === "eventos" ? "Acontecimiento" : "Personaje"}</div>
                      <div className="tl-axis">
                        {timelineTicks.map((valor) => (
                          <span key={valor} className="tl-tick" style={{ left: `${pct(valor)}%` }}>{valor}</span>
                        ))}
                        {Number.isFinite(anioGlobal) && (
                          <span className="tl-year-cursor tl-year-cursor-axis" style={{ left: `${pct(anioGlobal)}%` }}><span>{anioGlobal}</span></span>
                        )}
                      </div>
                    </div>

                    {timelineMode === "ambos" && (
                      <div className="tl-events-band" style={{ minHeight: timelineCombinedEvents.height }}>
                        <div className="tl-events-band-label" style={{ minHeight: timelineCombinedEvents.height }}>Eventos</div>
                        <div className="tl-events-band-track" style={{ minHeight: timelineCombinedEvents.height }}>
                          {timelineCombinedEvents.items.map(({ evento, esPeriodo, leftPx, durationPx, visualWidth, lane }) => (
                            <button
                              type="button"
                              key={evento.id}
                              className={`tl-event-marker cat-${evento.categoria}${eventoSeleccionadoId === evento.id ? " active" : ""}${esPeriodo ? " is-range" : " is-point"}`}
                              style={{
                                left: leftPx,
                                width: visualWidth,
                                top: 5 + lane * timelineCombinedEvents.laneHeight,
                              }}
                              onClick={() => seleccionarEvento(evento)}
                              title={`${etiquetaFechaEvento(evento)} · ${evento.titulo}`}
                            >
                              <span className="tl-event-marker-title">{evento.titulo}</span>
                              {esPeriodo && (
                                <span
                                  className="tl-event-marker-duration"
                                  style={{ width: Math.min(durationPx, visualWidth) }}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          ))}
                          {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                        </div>
                      </div>
                    )}

                    {timelineMode === "eventos" ? (
                      <div className="tl-list tl-event-list">
                        {eventosOrdenados.map((evento) => {
                          const inicio = inicioEvento(evento);
                          const fin = finEvento(evento);
                          const esPeriodo = Number.isFinite(evento.desde) && Number.isFinite(evento.hasta) && evento.hasta > evento.desde;
                          const activoEnAnio = Number.isFinite(anioGlobal) && anioGlobal >= inicio && anioGlobal <= fin;
                          return (
                            <div key={evento.id} className={`tl-row tl-event-row${eventoSeleccionadoId === evento.id ? " selected" : ""}${activoEnAnio ? " year-active" : ""}`} onClick={() => seleccionarEvento(evento)} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); seleccionarEvento(evento); } }}>
                              <div className="tl-sticky-col">
                                <div className="name">{evento.titulo}</div>
                                <div className="meta">{etiquetaFechaEvento(evento)} · {evento.categoria}</div>
                              </div>
                              <div className="tl-track tl-event-track">
                                <span
                                  className={`tl-event-bar cat-${evento.categoria}${esPeriodo ? " is-range" : " is-point"}`}
                                  style={{ left: `${pct(inicio)}%`, width: esPeriodo ? `${Math.max((pct(fin) ?? 0) - (pct(inicio) ?? 0), 0.6)}%` : undefined }}
                                />
                                {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="tl-list">
                        {visiblePeople
                          .slice()
                          .sort((a, b) => (anioInicioPersona(a) ?? Infinity) - (anioInicioPersona(b) ?? Infinity) || a.nombre.localeCompare(b.nombre, "es"))
                          .map((persona) => {
                            const inicio = anioInicioPersona(persona);
                            const fin = anioFinPersona(persona);
                            const tieneFecha = Number.isFinite(inicio) && Number.isFinite(fin);
                            const reinadosPersona = listaReinados(persona);
                            const trackHeight = Math.max(12, 12 + Math.max(0, reinadosPersona.length - 1) * 4);
                            const estadoAnio = Number.isFinite(anioGlobal) ? (estaVivaEn(persona, anioGlobal) ? " year-active" : " year-inactive") : "";
                            return (
                              <div
                                key={persona.id}
                                className={`tl-row ${hovered === persona.id ? "hovered" : ""}${estadoAnio}${historiaPersonasSet.has(persona.id) ? " story-related" : ""}`}
                                onMouseEnter={() => setHovered(persona.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setSeleccion(persona)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSeleccion(persona); } }}
                              >
                                <div className="tl-sticky-col">
                                  <div className="name">{persona.nombre}</div>
                                  <div className="meta">{persona.titulo} · {(persona.reinos || []).join(" · ")} · {persona.dinastia}</div>
                                </div>
                                <div className="tl-track" style={{ height: trackHeight }} ref={(element) => { if (element) tlBarRefs.current[persona.id] = element; else delete tlBarRefs.current[persona.id]; }}>
                                  {tieneFecha ? (
                                    <div className="tl-bar" style={{ left: `${pct(inicio)}%`, width: `${Math.max((pct(fin) ?? 0) - (pct(inicio) ?? 0), 0.35)}%`, backgroundColor: ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A" }} title={`${formatoFechas(persona)} (vida)`} />
                                  ) : <span className="tl-unknown">Fechas no precisadas</span>}
                                  {Number.isFinite(anioGlobal) && <span className="tl-year-cursor" style={{ left: `${pct(anioGlobal)}%` }} aria-hidden="true" />}
                                  {reinadosPersona.map((reinado, index) => {
                                    const tipo = etiquetaTipoReinado(reinado.tipo);
                                    const efectivo = reinadoEsEfectivo(reinado);
                                    return (
                                      <div key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`} className={`tl-bar-reinado${efectivo ? "" : " is-non-effective"}`} style={{ left: `${pct(reinado.desde)}%`, width: `${Math.max((pct(reinado.hasta) ?? 0) - (pct(reinado.desde) ?? 0), 0.35)}%`, top: 2 + index * 4, backgroundColor: REINO_COLOR[reinado.territorio] || ACCENTS[persona.dinastia] || ACCENTS[getCategoriaDinastía(persona.dinastia)] || "#71717A" }} title={`${reinado.territorio}: ${reinado.desde}–${reinado.hasta}${tipo ? ` (${tipo})` : ""}`} />
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>

      <footer className="project-footer">
        <div className="project-footer-links" aria-label="Información del proyecto">
          <button type="button" onClick={() => setInfoProyecto("acerca")}><Info size={12} /> Acerca del proyecto</button>
          <button type="button" onClick={() => setInfoProyecto("historias")}><BookOpen size={12} /> Historias</button>
          <button type="button" onClick={() => setInfoProyecto("estadisticas")}>Estadísticas</button>
          <button type="button" onClick={() => setInfoProyecto("fuentes")}><BookOpen size={12} /> Fuentes y metodología</button>
          <button type="button" onClick={() => setInfoProyecto("agradecimientos")}><Heart size={12} /> Agradecimientos</button>
          <button type="button" onClick={() => setInfoProyecto("licencias")}><Scale size={12} /> Licencias</button>
          <button type="button" onClick={() => setInfoProyecto("reportar")}><Flag size={12} /> Reportar un error</button>
          <button type="button" onClick={() => setPortadaVisible(true)}>Portada</button>
        </div>
        <div className="project-footer-credit">
          Cartografía base: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a>
          <span aria-hidden="true">·</span>
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
          <span aria-hidden="true">·</span>
          adaptada y modificada para El Árbol de Europa
        </div>
        <div className="project-footer-rights">
          © 2026 El Árbol de Europa · Código, diseño, textos y estructura original de la base de datos: todos los derechos reservados · Materiales de terceros y cartografía derivada: ver Licencias
        </div>
      </footer>

      {portadaVisible && (
        <div className="welcome-cover" role="dialog" aria-modal="true" aria-label="Bienvenida a El Árbol de Europa">
          <div className="welcome-card">
            <Crown size={28} className="welcome-crown" />
            <div className="welcome-eyebrow">Genealogía histórica interactiva</div>
            <h2>El Árbol de Europa</h2>
            <p>Explora dinastías, parentescos, reinados y territorios de la Europa medieval y moderna en una única red navegable.</p>
            <div className="welcome-stats">
              <span><strong>{PERSONAS.length}</strong> personas</span>
              <span><strong>1200–1800</strong> periodo principal</span>
            </div>
            <div className="welcome-actions">
              <button type="button" className="welcome-enter" onClick={entrarEnProyecto}>Explorar el árbol <ArrowRight size={15} /></button>
              <button type="button" className="welcome-history" onClick={() => setInfoProyecto("historias")}><BookOpen size={14} /> Historias guiadas</button>
            </div>
            <div className="welcome-links">
              <button type="button" onClick={() => setInfoProyecto("acerca")}>Acerca del proyecto</button>
              <button type="button" onClick={() => setInfoProyecto("estadisticas")}>Estadísticas</button>
              <button type="button" onClick={() => setInfoProyecto("fuentes")}>Fuentes y metodología</button>
              <button type="button" onClick={() => setInfoProyecto("agradecimientos")}>Agradecimientos</button>
            </div>
            <div className="welcome-map-credit">Cartografía base: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></div>
          </div>
        </div>
      )}

      {historiaActiva && historiaPasoActual && (
        <aside className="story-guide" aria-live="polite">
          <div className="story-guide-head">
            <div>
              <span>Historia · paso {historiaPasoIndex + 1} de {historiaActiva.pasos.length}</span>
              <strong>{historiaActiva.titulo}</strong>
            </div>
            <button type="button" onClick={salirHistoria} aria-label="Salir del recorrido"><X size={14} /></button>
          </div>
          <div className="story-guide-year">{historiaPasoActual.anio}</div>
          <h3>{historiaPasoActual.titulo}</h3>
          <p>{historiaPasoActual.texto}</p>
          {!!historiaPasoActual.personas?.length && (
            <div className="story-guide-people">
              {historiaPasoActual.personas.filter((id) => BY_ID[id]).map((id) => <button type="button" key={id} onClick={() => seleccionarPersonaPorId(id)}>{BY_ID[id].nombre}</button>)}
            </div>
          )}
          <div className="story-guide-actions">
            <button type="button" disabled={historiaPasoIndex === 0} onClick={() => cambiarPasoHistoria(-1)}><ArrowLeft size={13} /> Anterior</button>
            <button type="button" className="story-return-btn" onClick={() => aplicarPasoHistoria(historiaActiva, historiaPasoIndex)}>Volver al paso</button>
            {historiaPasoIndex < historiaActiva.pasos.length - 1 ? (
              <button type="button" className="story-next-btn" onClick={() => cambiarPasoHistoria(1)}>Continuar <ArrowRight size={13} /></button>
            ) : (
              <button type="button" className="story-next-btn" onClick={salirHistoria}>Terminar</button>
            )}
          </div>
        </aside>
      )}

      <ModalProyecto seccion={infoProyecto} onClose={() => setInfoProyecto(null)} persona={seleccion} personasVista={visiblePeople} onStartHistoria={iniciarHistoria} />
    </div>
  );
}


