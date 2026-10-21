import {ORANGE_NASSAU} from '../../cartography/mapColors.js';
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

export const ACCENTS = {
  "Přemysl":"#6b56a5","Árpád":"#d47e4c","Piast":"#b772a6","Habsburgo":"#c14c4c",
  "Anjou":"#474a8e","Paleólogo":"#9B3E6E","Wittelsbach":"#517b9d","Hohenstaufen":"#946B3D",
  "Luxemburgo":"#175180","Jagellón":"#2c6748","Familias menores":"#71717A","Capeto":"#1f1a99",
  "Borgoña":"#8C5A2B","Barcelona":"#A13D3D","Brabante":"#3D7A5C","Visconti":"#6B7280","Borgoña-Portugal":"#B08628",
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
  "Hohenzollern":"#303C59","Nassau":ORANGE_NASSAU,"Welf":"#A65C43","Oldemburgo":"#486D75",
  "Romanov":"#6F527A","Holstein-Gottorp":"#47727A","Hannover":"#6B5C91",
  "Mecklemburgo":"#4F8075","Hesse":"#6E7B45","Ascania":"#8D7A45","Estridsen":"#8FB9C9",
  "Nemanjić":"#76504A","Branković":"#8A6656","Lazarević":"#6E5E79",
  "Asen":"#7E6542","Terter":"#8B704A","Shishman":"#6E5B4D",
  "Basarab":"#6C5E85","Bogdan-Mușat":"#7B6D45","Kotromanić":"#57705F","Nazarí":"#4F7C68",
  "Württemberg":"#8A684C","Grifo":"#557486","Zähringen-Baden":"#7B5968","Jülich":"#756489",

  // Suecia: una familia visual de azules claros, manteniendo cada casa distinguible.
  "Vasa":"#8EC5E8","Bjälbo":"#A8D8EE","Erik":"#B4DDF0","Sverker":"#91BED6",
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
