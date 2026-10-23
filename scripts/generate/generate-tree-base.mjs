import {conyugesDe, gobiernosDe, territoriosDe} from '../../src/domain/genealogy/personAccessors.js';
import {ACCESOS_CORONAS} from '../../src/content/coronas/index.js';
import {RELEVOS} from '../../src/content/sucesiones/index.js';
import {accesosDe} from '../../src/domain/government/crowns.js';
import {HISTORIA_DINASTIAS} from "../../src/content/dinastias/index.js";
import {dynastyAliasesFor} from '../../src/data/dynastyNames.js';
import { sourcesForPerson } from "../../src/content/sources.js";
import { TERRITORIOS, componentesDe } from "../../src/data/territorios.js";
import fs from "node:fs/promises";
import path from "node:path";
import { biografiaExtensaPersona } from "../../src/content/biografias-extensas.js";
import { IMAGENES_PERSONAS } from "../../src/data/imagenesPersonas.js";
import { ogPersonaImage, ogPortraitAvailable } from "../../src/features/public/ogImages.js";
import { regionResolver } from "../../src/domain/filters/filterRegions.js";
import { aliasesDePersona, biografiaPublicaPersona, contenidoEditorialPersona, resumenCortoPersona, slugBasePersona, slugPublico, tieneContenidoEditorial } from "../../src/domain/people/personPresentation.js";

import { PERSONAS } from "../../src/data/personas.js";
import { HISTORIAS } from "../../src/data/historias.js";
import { BY_ID, CONYUGES_INVERSOS, HIJOS_POR_ID, listaConyuges, listaAmantes, listaParejas, clavePareja, mediana } from "../../src/domain/genealogy/relations.js";
import { TREE_BOX_W, TREE_BOX_H, TREE_MINI_MIN_H, TREE_UNIT_GAP, TREE_ROW_GAP, TREE_PAD_X, TREE_PAD_TOP, TREE_PAD_BOTTOM, TREE_ROW_STEP, TREE_PARTNER_EXIT_BASE, TREE_PARTNER_EXIT_STEP, orderPartnerComponent, orderPathIds, createPartnerUnitBlueprint, buildRows, pavaNonDecreasing } from "../../src/domain/genealogy/treeLayout.js";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "src", "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "treeBase.json");
const META_FILE = path.join(OUTPUT_DIR, "siteMeta.json");

// Diseño de la base completa. El Atlas usa otra variante para selecciones
// parciales (src/domain/genealogy/treeLayout.js); conservar esta mantiene
// idéntico src/generated/treeBase.json.
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

// Construye la geometría interna de una unidad de pareja sin dibujar líneas
// entre sus integrantes. Las cadenas de matrimonios sucesivos se mantienen
// como una sucesión de cajas normales en contacto. Cuando una persona reúne
// tres o más parejas, las parejas laterales vuelven al formato compacto de
// cajas pequeñas apiladas alrededor de la caja principal.
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
    tema: historia.tema,
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
  if (!persona?.dinastia) return [];
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
      padres,
      conyuges,
      hijos,
      relacionadosDinastia: relacionadosDinastia(persona),
      contemporaneos: contemporaneos(persona),
      historias: HISTORIAS_POR_PERSONA[persona.id] || [],
      ...(ogPortraitAvailable(IMAGENES_PERSONAS[persona.id]) ? {ogImage: ogPersonaImage(PERSONA_SLUG_POR_ID[persona.id])} : {}),
    };
    await fs.writeFile(path.join(personaDir, `${meta.slug}.json`), JSON.stringify(meta), "utf8");
  }));
}

async function generarCatalogosPublicos() {
  const catalogoDir = path.join(ROOT, "public", "catalogos");
  await fs.rm(catalogoDir, { recursive: true, force: true });
  await fs.mkdir(catalogoDir, { recursive: true });

  const personas = catalogoPersonas();
  const dinastias = catalogoAgrupado(PERSONAS.map((p) => p.dinastia), (p, nombre) => p.dinastia === nombre).map(d=>({...d,aliases:dynastyAliasesFor(d.nombre),editorial:Boolean(HISTORIA_DINASTIAS[d.nombre]),resumen:HISTORIA_DINASTIAS[d.nombre]?.resumen||""}));
  const territoriosValores = Object.keys(TERRITORIOS);
  const territorios = catalogoAgrupado(territoriosValores, (p, nombre) => territoriosDe(p).some(t => [nombre, ...componentesDe(nombre)].includes(t)));
  const historias = HISTORIAS.map((historia) => ({
    id: historia.id,
    titulo: historia.titulo,
    tema: historia.tema,
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
    fs.writeFile(path.join(catalogoDir, "personas.json"), JSON.stringify({ items: personas }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "dinastias.json"), JSON.stringify({ items: dinastias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "territorios.json"), JSON.stringify({ items: territorios }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "historias.json"), JSON.stringify({ items: historias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "home.json"), JSON.stringify(home), "utf8"),
    fs.writeFile(path.join(ROOT, "src", "generated", "home.json"), JSON.stringify(home), "utf8"),
  ]);

  return { dinastias: dinastias.length, territorios: territorios.length, historias: historias.filter((h) => h.disponible).length };
}

const gen = computeGenerations(PERSONAS);
const rows = buildRows(PERSONAS, gen);
const layout = computeTreeLayout(rows, BY_ID, HIJOS_POR_ID);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const catalogStats = await generarCatalogosPublicos();
await fs.writeFile(OUTPUT_FILE, JSON.stringify({ gen, rows, layout }), "utf8");
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
