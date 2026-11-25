import {territoryCatalogMetadata} from './territory-catalog.mjs';
import {HISTORIA_TERRITORIOS} from '../../src/content/territorios/index.js';
import {conyugesDe, gobiernosDe, territoriosDe} from '../../src/domain/genealogy/personAccessors.js';
import {ACCESOS_CORONAS} from '../../src/content/coronas/index.js';
import {RELEVOS} from '../../src/content/sucesiones/index.js';
import {accesosDe} from '../../src/domain/government/crowns.js';
import {HISTORIA_DINASTIAS} from "../../src/content/dinastias/index.js";
import {dynastyOrderCounts} from '../../src/domain/genealogy/dynastyOrder.js';
import {isNamedDynasty,dynastyAliasesFor} from '../../src/data/dynastyNames.js';
import { sourcesForPerson } from "../../src/content/sources.js";
import { TERRITORIOS, componentesDe } from "../../src/data/territorios.js";
import fs from "node:fs/promises";
import path from "node:path";
import { biografiaExtensaPersona } from "../../src/content/biografias-extensas.js";
import { IMAGENES_PERSONAS } from "../../src/data/imagenesPersonas.js";
import { IMAGE_VARIANTS } from "../../src/data/imageVariants.js";
import { responsiveImage } from "../../src/utils/responsiveImage.js";
import { personClaims } from "../../src/evidence/claims.js";
import { crownTimelineData } from "../../src/domain/government/crownTimelineModel.js";
import { regionResolver } from "../../src/domain/filters/filterRegions.js";
import { aliasesDePersona, biografiaPublicaPersona, contenidoEditorialPersona, resumenCortoPersona, slugBasePersona, slugPublico, tieneContenidoEditorial } from "../../src/domain/people/personPresentation.js";

import { PERSONAS } from "../../src/data/personas.js";
import { HISTORIAS } from "../../src/data/historias.js";
import { BY_ID, CONYUGES_INVERSOS, HIJOS_POR_ID, listaConyuges, listaAmantes, listaParejas, clavePareja, mediana } from "../../src/domain/genealogy/relations.js";
import { layoutSelection } from "../../src/domain/genealogy/selectionTree.js";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "src", "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "treeBase.json");
const META_FILE = path.join(OUTPUT_DIR, "siteMeta.json");

// 6.3.3: el árbol completo usa el mismo cálculo que las selecciones del Atlas
// (src/domain/genealogy/selectionTree.js): matrimonios siempre en la misma fila,
// cabezas de línea en la fila de su época y columnas por dinastía.

const PERSONA_SLUG_BASE_COUNT = PERSONAS.reduce((acc, persona) => {
  const base = slugBasePersona(persona, "es");
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});

const PERSONA_SLUG_POR_ID = Object.fromEntries(PERSONAS.map((persona) => {
  const base = slugBasePersona(persona, "es");
  const slug = PERSONA_SLUG_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));

function referenciaPersona(id) {
  const persona = BY_ID[id];
  if (!persona) return null;
  return {
    id: persona.id,
    nombre: persona.nombre,
    slug: PERSONA_SLUG_POR_ID[persona.id],
    sobrenombre: persona.sobrenombre || "",
    aliases: aliasesDePersona(persona),
    documentacion: persona.documentacion || null,
    ...(persona.identidadDesconocida ? {identidadDesconocida: true} : {}),
    resumen: resumenCortoPersona(persona),
    dinastia: persona.dinastia || "",
    titulo: persona.titulo || "",
    nac: Number.isFinite(persona.nac) ? persona.nac : null,
    muer: Number.isFinite(persona.muer) ? persona.muer : null,
    nacAprox: Boolean(persona.nacAprox),
    muerAprox: Boolean(persona.muerAprox),
    reinos: territoriosDe(persona),
  };
}

function relevanciaPublica(persona) {
  if (!persona) return 0;
  const titulo = String(persona.titulo || "").toLowerCase();
  let score = 0;
  if (/emperador|emperatriz/.test(titulo)) score += 16;
  else if (/rey|reina|soberan/.test(titulo)) score += 13;
  else if (/duque|duquesa|elector|regente|papa/.test(titulo)) score += 8;
  else if (/conde|condesa|marqu|príncipe|principe|princesa/.test(titulo)) score += 5;
  score += Math.min(10, gobiernosDe(persona).length * 2);
  score += Math.min(8, (HIJOS_POR_ID[persona.id] || []).length);
  if (tieneContenidoEditorial(persona)) {
    const editorial = contenidoEditorialPersona(persona);
    const longitud = String(editorial.biografia || editorial.resumen || "").length;
    score += Math.min(5, Math.max(1, Math.ceil(longitud / 220)));
  }
  if (persona.sobrenombre) score += 1;
  return score;
}

const HISTORIAS_DISPONIBLES = HISTORIAS.filter((historia) => historia?.disponible && Array.isArray(historia.pasos) && historia.pasos.length);
const HISTORIAS_POR_PERSONA = {};
HISTORIAS_DISPONIBLES.forEach((historia) => {
  const ids = new Set();
  historia.pasos.forEach((paso) => {
    if (paso?.persona) ids.add(paso.persona);
    (paso?.personas || []).forEach((id) => ids.add(id));
  });
  ids.forEach((id) => {
    if (!BY_ID[id]) return;
    (HISTORIAS_POR_PERSONA[id] ||= []).push({
      id: historia.id,
      titulo: historia.titulo,
    colecciones: historia.colecciones,
    revisionPendiente: Boolean(historia.revisionPendiente),
      subtitulo: historia.subtitulo || historia.descripcion || "",
      slug: slugPublico(historia.titulo),
    });
  });
});

function familiaDirectaIds(persona) {
  return new Set([
    persona?.id,
    persona?.padre,
    persona?.madre,
    ...listaConyuges(persona),
    ...listaAmantes(persona),
    ...(HIJOS_POR_ID[persona?.id] || []),
  ].filter(Boolean));
}

function centroCronologico(persona) {
  if (Number.isFinite(persona?.nac) && Number.isFinite(persona?.muer)) return (persona.nac + persona.muer) / 2;
  if (Number.isFinite(persona?.nac)) return persona.nac + 30;
  if (Number.isFinite(persona?.muer)) return persona.muer - 30;
  return null;
}

function solapanVida(a, b) {
  const aIni = Number.isFinite(a?.nac) ? a.nac : Number.isFinite(a?.muer) ? a.muer - 60 : null;
  const aFin = Number.isFinite(a?.muer) ? a.muer : Number.isFinite(a?.nac) ? a.nac + 65 : null;
  const bIni = Number.isFinite(b?.nac) ? b.nac : Number.isFinite(b?.muer) ? b.muer - 60 : null;
  const bFin = Number.isFinite(b?.muer) ? b.muer : Number.isFinite(b?.nac) ? b.nac + 65 : null;
  if (![aIni, aFin, bIni, bFin].every(Number.isFinite)) return false;
  return aIni <= bFin && bIni <= aFin;
}

function territoriosCompartidos(a, b) {
  const set = new Set(territoriosDe(a));
  return territoriosDe(b).filter((r) => set.has(r)).length;
}

function relacionadosDinastia(persona, limite = 6) {
  if (!isNamedDynasty(persona?.dinastia)) return [];
  const excluir = familiaDirectaIds(persona);
  const centro = centroCronologico(persona);
  return PERSONAS
    .filter((p) => p?.id && p.dinastia === persona.dinastia && !excluir.has(p.id))
    .map((p) => ({
      persona: p,
      distancia: Number.isFinite(centro) && Number.isFinite(centroCronologico(p)) ? Math.abs(centroCronologico(p) - centro) : 999,
      relevancia: relevanciaPublica(p),
    }))
    .sort((a, b) => a.distancia - b.distancia || b.relevancia - a.relevancia || a.persona.nombre.localeCompare(b.persona.nombre, "es"))
    .slice(0, limite)
    .map(({ persona: p }) => referenciaPersona(p.id));
}

function contemporaneos(persona, limite = 6) {
  const excluir = familiaDirectaIds(persona);
  const centro = centroCronologico(persona);
  return PERSONAS
    .filter((p) => p?.id && !excluir.has(p.id) && solapanVida(persona, p))
    .map((p) => ({
      persona: p,
      compartidos: territoriosCompartidos(persona, p),
      distancia: Number.isFinite(centro) && Number.isFinite(centroCronologico(p)) ? Math.abs(centroCronologico(p) - centro) : 999,
      relevancia: relevanciaPublica(p),
    }))
    .sort((a, b) => b.compartidos - a.compartidos || b.relevancia - a.relevancia || a.distancia - b.distancia || a.persona.nombre.localeCompare(b.persona.nombre, "es"))
    .slice(0, limite)
    .map(({ persona: p }) => referenciaPersona(p.id));
}

// V5.23 · El índice de Personas se ordena por relevancia y se filtra por siglo,
// papel y región. Papel y región siguen las mismas reglas que los filtros del Atlas.
const ROLE_RULES = [
  ["monarquia", "Monarcas", /(^|\s|\/)(emperador|emperatriz|rey|reina|soberano|soberana|zar|sultan|califa|emir)(\s|$|\/)/],
  ["papado", "Papas y clero", /(^|\s|\/)(papa|cardenal|arzobispo|obispo|abad|abadesa|santo|santa)(\s|$|\/)/],
  ["consortes", "Consortes", /consorte/],
  ["principes", "Príncipes e infantes", /(principe|princesa|infante|infanta|pretendiente|delfin)/],
  ["nobleza", "Alta nobleza y señoríos", /(gran duque|archiduque|duque|duquesa|elector|conde|condesa|marques|senor|senora|landgrave|margrave|despota|ban)/],
  ["gobierno", "Gobierno y milicia", /(gobernador|gobernadora|virrey|regente|dogo|general|valido|almirante|condestable|condotiero|estatuder|canciller)/],
  ["cultura", "Cultura y pensamiento", /(teologo|poeta|artista|pintor|escultor|arquitecto|ingeniero|humanista|mecenas|escritor|filosofo|reformador|cientifico|astronomo)/],
];
const normalizarTitulo = (titulo) => String(titulo || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function papelPersona(persona) {
  const titulo = normalizarTitulo(persona.titulo);
  return ROLE_RULES.find(([, , test]) => test.test(titulo))?.[1] || "Otras figuras";
}
const { personRegion } = regionResolver(componentesDe);
function sigloPersona(persona) {
  const year = Number.isFinite(persona.nac) ? persona.nac : Number.isFinite(persona.muer) ? persona.muer - 30 : null;
  return year === null ? null : Math.floor((year - 1) / 100) + 1;
}
function catalogoPersonas() {
  return PERSONAS
    .map((p) => ({
      ...referenciaPersona(p.id),
      relevancia: relevanciaPublica(p) + (IMAGENES_PERSONAS[p.id] ? 8 : 0) + (biografiaExtensaPersona(p) ? 8 : 0),
      papel: papelPersona(p),
      region: personRegion(territoriosDe(p)),
      siglo: sigloPersona(p),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

function catalogoAgrupado(valores, selector) {
  return [...new Set(valores.filter(Boolean))]
    .map((nombre) => {
      const miembros = PERSONAS.filter((p) => selector(p, nombre));
      const destacados = miembros
        .slice()
        .sort((a, b) => relevanciaPublica(b) - relevanciaPublica(a) || (a.nac ?? 9999) - (b.nac ?? 9999) || a.nombre.localeCompare(b.nombre, "es"))
        .slice(0, 6)
        .map((p) => referenciaPersona(p.id));
      return { nombre, slug: slugPublico(nombre), total: miembros.length, miembros: destacados };
    })
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

// 6.3.2: la ficha lleva resueltos su retrato, las miniaturas de las personas
// enlazadas, sus afirmaciones y las etapas de sus coronas. Al hidratarla, el
// navegador no carga la base de personas, las imágenes ni la evidencia.
const PORTRAIT_SIZES = "(max-width: 680px) 280px, 320px";
function miniatura(id) {
  const image = IMAGENES_PERSONAS[id];
  if (!image?.archivo) return null;
  const {sizes, ...responsive} = responsiveImage(image.archivo);
  return {...responsive, position: image.encuadre || image.posicion || "50% 20%"};
}
const conMiniatura = (ref) => ref && ({...ref, thumb: miniatura(ref.id)});
function retratoFicha(id) {
  const image = IMAGENES_PERSONAS[id];
  return image?.archivo ? {...image, responsive: responsiveImage(image.archivo, PORTRAIT_SIZES)} : null;
}

async function generarPortadasPersona() {
  const personaDir = path.join(ROOT, "public", "personas-meta");
  await fs.rm(personaDir, { recursive: true, force: true });
  await fs.mkdir(personaDir, { recursive: true });
  await fs.writeFile(path.join(personaDir, "index.json"), JSON.stringify(PERSONA_SLUG_POR_ID), "utf8");

  await Promise.all(PERSONAS.map(async (persona) => {
    const conyugesIds = conyugesDe(persona);
    const padres = [persona.padre, persona.madre].filter(Boolean).map(referenciaPersona).filter(Boolean);
    const conyuges = listaConyuges(persona).map(referenciaPersona).filter(Boolean);
    const hijos = (HIJOS_POR_ID[persona.id] || []).map(referenciaPersona).filter(Boolean);
    const meta = {
      id: persona.id,
      slug: PERSONA_SLUG_POR_ID[persona.id],
      nombre: persona.nombre,
      sobrenombre: persona.sobrenombre || "",
      aliases: aliasesDePersona(persona),
      resumen: resumenCortoPersona(persona),
      dinastia: persona.dinastia || "",
      titulo: persona.titulo || "",
      nac: Number.isFinite(persona.nac) ? persona.nac : null,
      muer: Number.isFinite(persona.muer) ? persona.muer : null,
      documentacion: persona.documentacion || null,
      ...(persona.identidadDesconocida ? {identidadDesconocida: true} : {}),
      nacAprox: Boolean(persona.nacAprox),
      muerAprox: Boolean(persona.muerAprox),
      padre: persona.padre || null,
      madre: persona.madre || null,
      conyugesIds,
      evidenceNames: Object.fromEntries([...new Set([
        persona.padre, persona.madre, ...conyugesIds,
        ...RELEVOS.filter(item => item.sucesor?.persona === persona.id).flatMap(item => [item.predecesor?.persona, item.sucesor?.persona]),
      ].filter(Boolean))].map(id => [id, BY_ID[id]?.nombre]).filter(([, name]) => name)),
      reinos: territoriosDe(persona),
      gobiernos: gobiernosDe(persona).map((gobierno) => ({ ...gobierno })),
      accesosCoronas: accesosDe(persona,ACCESOS_CORONAS,RELEVOS),
      biografia: biografiaPublicaPersona(persona),
      ...(biografiaExtensaPersona(persona) ? {biografiaExtensa: biografiaExtensaPersona(persona)} : {}),
      fuentes: sourcesForPerson(persona.id),
      padres: padres.map(conMiniatura),
      conyuges: conyuges.map(conMiniatura),
      hijos: hijos.map(conMiniatura),
      relacionadosDinastia: relacionadosDinastia(persona).map(conMiniatura),
      contemporaneos: contemporaneos(persona).map(conMiniatura),
      retrato: retratoFicha(persona.id),
      historias: HISTORIAS_POR_PERSONA[persona.id] || [],
      // 6.2.0: the widest published portrait, for the Person structured data.
      ...(IMAGE_VARIANTS[IMAGENES_PERSONAS[persona.id]?.archivo]?.variants.at(-1)?.src ? {imagen: IMAGE_VARIANTS[IMAGENES_PERSONAS[persona.id].archivo].variants.at(-1).src} : {}),
    };
    // Calculadas sobre la propia ficha, como antes las calculaba el navegador.
    meta.claims = personClaims(meta);
    meta.crownTimeline = crownTimelineData(meta, meta.accesosCoronas);
    await fs.writeFile(path.join(personaDir, `${meta.slug}.json`), JSON.stringify(meta), "utf8");
  }));
}

async function generarCatalogosPublicos() {
  const catalogoDir = path.join(ROOT, "public", "catalogos");
  await fs.rm(catalogoDir, { recursive: true, force: true });
  await fs.mkdir(catalogoDir, { recursive: true });

  const personas = catalogoPersonas();
  const dynastyOrder = dynastyOrderCounts(PERSONAS);
  const dinastias = catalogoAgrupado(PERSONAS.map((p) => p.dinastia).filter(isNamedDynasty), (p, nombre) => p.dinastia === nombre).map(d=>({...d,aliases:dynastyAliasesFor(d.nombre),editorial:Boolean(HISTORIA_DINASTIAS[d.nombre]),resumen:HISTORIA_DINASTIAS[d.nombre]?.resumen||""}))
    .sort((a,b)=>(dynastyOrder.get(b.nombre)||0)-(dynastyOrder.get(a.nombre)||0)||a.nombre.localeCompare(b.nombre,'es'));
  const territoriosValores = Object.keys(TERRITORIOS);
  const territorios = catalogoAgrupado(territoriosValores, (p, nombre) => territoriosDe(p).some(t => [nombre, ...componentesDe(nombre)].includes(t))).map(item=>{
    const names=[item.nombre,...componentesDe(item.nombre)];
    const people=PERSONAS.filter(p=>territoriosDe(p).some(t=>names.includes(t)));
    return {...item,...territoryCatalogMetadata(item.nombre,TERRITORIOS[item.nombre],HISTORIA_TERRITORIOS[item.nombre]||{},people,names)};
  });
  const historias = HISTORIAS.map((historia) => ({
    id: historia.id,
    titulo: historia.titulo,
    colecciones: historia.colecciones,
    revisionPendiente: Boolean(historia.revisionPendiente),
    subtitulo: historia.subtitulo || "",
    descripcion: historia.descripcion || "",
    slug: slugPublico(historia.titulo),
    disponible: Boolean(historia.disponible && Array.isArray(historia.pasos) && historia.pasos.length),
    pasos: Array.isArray(historia.pasos) ? historia.pasos.length : 0,
    // Lectura a ~180 palabras por minuto más medio minuto por capítulo para mapa y fichas.
    minutos: Array.isArray(historia.pasos) && historia.pasos.length
      ? Math.max(2, Math.round(historia.pasos.map(paso => [paso.titulo, paso.texto].filter(Boolean).join(" ")).join(" ").split(/\s+/).filter(Boolean).length / 180 + historia.pasos.length * 0.5))
      : 0,
  }));

  // Puertas de distintas épocas con imágenes y créditos ya disponibles en el Atlas.
  // V5.23 · Veinte puertas en orden cronológico, todas con retrato.
  const destacadosIds = ["FED2HOH", "JUANAARCO", "LORENZOMEDICI", "ISAB1CAST", "LEONARDODAVINCI", "CARLOS5", "ENRIQ8ING", "SULEIMAN1OSM", "FEL2ESP", "ISABEL1ING", "MARIAESTUARDO", "ENRIQ4FRA", "GUSTAV2ADOLFO", "LUIS14FRA", "JUAN3SOBIESKI", "PETER1RUS", "MARIATERESAHAB", "FRED2PRUSSIA", "CATHERINE2RUS", "MARIAANTONIETA"];
  const personasDestacadas = destacadosIds.filter(id => IMAGENES_PERSONAS[id]).map(referenciaPersona).filter(Boolean);
  if (personasDestacadas.length < 6) {
    const existentes = new Set(personasDestacadas.map((p) => p.id));
    PERSONAS.slice().sort((a, b) => relevanciaPublica(b) - relevanciaPublica(a)).forEach((p) => {
      if (personasDestacadas.length >= 6 || existentes.has(p.id)) return;
      existentes.add(p.id);
      personasDestacadas.push(referenciaPersona(p.id));
    });
  }

  const home = {
    stats: {
      personas: PERSONAS.length,
      dinastias: dinastias.length,
      territorios: territorios.length,
      historias: historias.filter((h) => h.disponible).length,
    },
    personasDestacadas,
    dinastiasDestacadas: dinastias.slice(0, 6),
    territoriosDestacados: territorios.slice(0, 6),
    historiasDestacadas: historias.filter((h) => h.disponible).slice(0, 6),
  };

  await Promise.all([
    // Person cards and catalogue search do not use the biography summary.
    // The complete summary remains on each person's record and the home cards.
    fs.writeFile(path.join(catalogoDir, "personas.json"), JSON.stringify({ items: personas.map(({resumen, ...card}) => card) }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "dinastias.json"), JSON.stringify({ items: dinastias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "territorios.json"), JSON.stringify({ items: territorios }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "historias.json"), JSON.stringify({ items: historias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "home.json"), JSON.stringify(home), "utf8"),
    fs.writeFile(path.join(ROOT, "src", "generated", "home.json"), JSON.stringify(home), "utf8"),
  ]);

  return { dinastias: dinastias.length, territorios: territorios.length, historias: historias.filter((h) => h.disponible).length };
}

// Sin límite para la pasada de intercambios: se calcula una vez, al generar.
const {gen, rows, columns, layout} = layoutSelection(PERSONAS, BY_ID, HIJOS_POR_ID, {swapLimit: Infinity});

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const catalogStats = await generarCatalogosPublicos();
await fs.writeFile(OUTPUT_FILE, JSON.stringify({ gen, rows, columns, layout }), "utf8");
await fs.writeFile(META_FILE, JSON.stringify({
  personCount: PERSONAS.length,
  dynastyCount: catalogStats.dinastias,
  territoryCount: catalogStats.territorios,
  storyCount: catalogStats.historias,
  buildVersion: Date.now(),
}), "utf8");
await generarPortadasPersona();

console.log(`treeBase.json generado: ${PERSONAS.length} personas, ${rows.length} generaciones, canvas ${Math.round(layout.width)}x${Math.round(layout.height)}`);
console.log(`Portadas ligeras generadas: ${PERSONAS.length} fichas + índice en public/personas-meta/`);
console.log(`Catálogos públicos generados: ${catalogStats.dinastias} dinastías · ${catalogStats.territorios} territorios · ${catalogStats.historias} historias disponibles`);
