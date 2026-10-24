import {listaConyuges, listaAmantes, HIJOS_POR_ID} from '../../domain/genealogy/relations.js';
import {SITE} from '../../app/i18n.js';
import {normalizarBusquedaPublica} from '../../domain/people/personPresentation.js';

export const SIN_FECHA = "sin-fecha";

export function normalizaTexto(valor) {
  return normalizarBusquedaPublica(valor);
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

export {ACCENTS} from '../../domain/genealogy/dynastyColors.js';

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
export const TIMELINE_SCALES = [1.6, 3.2, 4.8, 6.4, 9.6, 14];
export const TIMELINE_FIXED_COLUMN = 0;

export function categoriasDeTitulo(persona) {
  const titulo = normalizaTexto(persona?.titulo);
  return CATEGORIAS_TITULO.filter((categoria) => categoria.test(titulo)).map((categoria) => categoria.id);
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
