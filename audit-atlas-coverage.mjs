// Run with: node --import ./tests/jsx-loader.mjs audit-atlas-coverage.mjs
// Territories, governments and locations are deliberately counted separately.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PERSONAS} from './src/personas.jsx';
import {TERRITORIOS, gobiernoEfectivo} from './src/data/territorios.js';
import {mapAuthoritiesForPerson} from './src/data/mapAuthorities.js';
import {atlasLocationIds} from './src/data/locationMapAudit.js';
import {pilotJurisdictionsFor, reviewedMapLayers} from './src/data/locationMapPilot.js';

const IMPERIAL_OFFICES = new Set(['Alemania', 'Sacro Imperio']);
// These published layers expressly represent city cores, branches or the Pale.
// Other layers also have regional precision; their coverage is not called exact.
const LIMITED_CORES = new Set(['Brandeburgo', 'Sajonia', 'Württemberg', 'Hesse',
  'Hesse-Kassel', 'Hesse-Darmstadt', 'Irlanda', 'Herzegovina', 'Morea', 'Lorena', 'Baden', 'Brunswick', 'Chipre']);
const sortNames = (a, b) => a.localeCompare(b, 'es');

function intervalsFromYears(years) {
  const result = [];
  for (const year of [...new Set(years)].sort((a, b) => a - b)) {
    if (result.at(-1)?.through === year - 1) result.at(-1).through = year;
    else result.push({from: year, through: year});
  }
  return result;
}

function governmentRecord(person, government, from, through) {
  return {personId: person.id, personName: person.nombre,
    government: {territory: government.territorio, title: government.titulo,
      from: government.desde, through: government.hasta, class: government.clase,
      condition: government.condicion, scope: government.ambito},
    auditFrom: Math.max(from, government.desde),
    auditThrough: Math.min(through, government.hasta)};
}

export function auditAtlasCoverage(personas, data, locationIds, catalogue = TERRITORIOS) {
  const from = data.from, through = data.through;
  const layers = reviewedMapLayers(data);
  const governmentRows = personas.flatMap(person => (person.gobiernos || [])
    .map(government => ({person, government})));
  const names = [...new Set([...Object.keys(catalogue),
    ...personas.flatMap(person => person.reinos || []),
    ...governmentRows.map(row => row.government.territorio)])].sort(sortNames);
  const authorityCache = new Map();
  const entriesFor = (person, year) => {
    const key = `${person.id}:${year}`;
    if (!authorityCache.has(key)) authorityCache.set(key,
      mapAuthoritiesForPerson(person, year, data).filter(entry => entry.paint !== false));
    return authorityCache.get(key);
  };
  const rows = names.map(territory => {
    const allGovernments = governmentRows.filter(row => row.government.territorio === territory);
    const effectiveAllTime = allGovernments.filter(row => gobiernoEfectivo(row.government));
    const effectiveInScope = effectiveAllTime.filter(row => row.government.desde <= through
      && row.government.hasta >= from);
    const nonpaintingInScope = allGovernments.filter(row => !gobiernoEfectivo(row.government)
      && row.government.desde <= through && row.government.hasta >= from);
    const mappedIds = new Set(), yearsWithGovernment = new Set(), yearsWithGeometry = new Set();
    const layerNames = new Set();
    const mandates = effectiveInScope.map(({person, government}) => {
      const mappedYears = [], missingYears = [], mandateIds = new Set();
      for (let year = Math.max(from, government.desde);
        year <= Math.min(through, government.hasta); year++) {
        yearsWithGovernment.add(year);
        for (const name of pilotJurisdictionsFor(territory, year, person.id)) {
          if (layers.some(layer => layer.name === name)) layerNames.add(name);
        }
        const ids = entriesFor(person, year).filter(entry => entry.government === government)
          .flatMap(entry => entry.ids).filter(id => locationIds.has(id));
        for (const id of ids) {mappedIds.add(id); mandateIds.add(id);}
        if (ids.length) {mappedYears.push(year); yearsWithGeometry.add(year);}
        else missingYears.push(year);
      }
      return {...governmentRecord(person, government, from, through),
        yearsWithGeometry: mappedYears.length, yearsWithoutGeometry: missingYears.length,
        locations: mandateIds.size, missingGeometryIntervals: intervalsFromYears(missingYears)};
    });
    const missingYears = [...yearsWithGovernment].filter(year => !yearsWithGeometry.has(year));
    let status = 'no_effective_government';
    if (catalogue[territory]?.naturaleza === 'agrupacion') status = 'grouping';
    else if (IMPERIAL_OFFICES.has(territory) && effectiveInScope.length) status = 'imperial_legal_frame';
    else if (effectiveInScope.length) status = mappedIds.size ? 'represented' : 'unrepresented_effective';
    else if (nonpaintingInScope.length) status = 'title_only_in_scope';
    else if (effectiveAllTime.length) status = 'governments_outside_period';
    const hasMandateGeometryGaps = status === 'represented'
      && mandates.some(mandate => mandate.yearsWithoutGeometry);
    const hasEntireTerritoryYearGaps = status === 'represented' && missingYears.length > 0;
    const limitedCore = status === 'represented' && LIMITED_CORES.has(territory);
    return {territory, status,
      counts: {effectiveMandatesAllTime: effectiveAllTime.length,
        effectiveMandatesInScope: effectiveInScope.length,
        nonpaintingMandatesInScope: nonpaintingInScope.length,
        locations: mappedIds.size, yearsWithGovernment: yearsWithGovernment.size,
        yearsWithGeometry: yearsWithGeometry.size,
        yearsWithoutGeometry: missingYears.length,
        mandatesWithSomeMissingGeometry: mandates.filter(mandate => mandate.yearsWithoutGeometry).length,
        mandatesEntirelyWithoutGeometry: mandates.filter(mandate => !mandate.yearsWithGeometry).length},
      hasMandateGeometryGaps, hasEntireTerritoryYearGaps, limitedCore,
      missingGeometryIntervals: intervalsFromYears(missingYears),
      layers: [...layerNames].sort(sortNames).map(name => {
        const layer = layers.find(item => item.name === name);
        return {name, note: layer.note};
      }),
      governments: mandates,
      nonpaintingGovernments: nonpaintingInScope.map(row =>
        governmentRecord(row.person, row.government, from, through)),
      outsidePeriodGovernments: effectiveAllTime.filter(row => row.government.desde > through
        || row.government.hasta < from).map(row => ({personId: row.person.id,
        personName: row.person.nombre, title: row.government.titulo,
        from: row.government.desde, through: row.government.hasta,
        condition: row.government.condicion}))};
  });
  const unrepresentedEntities = rows.filter(row => row.status === 'unrepresented_effective');
  const partialMandates = rows.filter(row => row.hasMandateGeometryGaps);
  const partialYears = rows.filter(row => row.hasEntireTerritoryYearGaps);
  const limitedCores = rows.filter(row => row.limitedCore);
  const partiallyRepresented = rows.filter(row => row.hasMandateGeometryGaps || row.limitedCore);
  const imperialLegalFrame = rows.filter(row => row.status === 'imperial_legal_frame');
  const outsidePeriod = rows.filter(row => row.status === 'governments_outside_period');
  const titlesOnly = rows.filter(row => row.status === 'title_only_in_scope');
  const nonpaintingTitles = rows.filter(row => row.nonpaintingGovernments.length);
  return {
    scope: {from, through, catalogueTerritories: Object.keys(catalogue).length,
      svgLocations: locationIds.size},
    method: `Se comprueba cada año de cada mandato marcado efectivo dentro de ${from}–${through} mediante la misma autoridad y correspondencia que usa el mapa. Una entidad se considera representada si al menos un mandato tiene alguna location SVG válida; esto no acredita el contorno completo. Los rangos sin geometría no se interpretan automáticamente como errores históricos.`,
    counts: {unrepresentedEntities: unrepresentedEntities.length,
      representedEntities: rows.filter(row => row.status === 'represented').length,
      partialMandateGeometry: partialMandates.length,
      partialEntireTerritoryYears: partialYears.length,
      explicitLimitedCores: limitedCores.length,
      partiallyRepresentedUnique: partiallyRepresented.length,
      imperialLegalFrameExclusions: imperialLegalFrame.length,
      governmentsOnlyOutsidePeriod: outsidePeriod.length,
      titlesOnlyInsidePeriod: titlesOnly.length,
      territoriesWithSomeNonpaintingTitle: nonpaintingTitles.length,
      nonpaintingMandatesInsidePeriod: nonpaintingTitles.reduce((n, row) => n + row.nonpaintingGovernments.length, 0)},
    unrepresentedEntities, partiallyRepresented,
    exclusions: {imperialLegalFrame, outsidePeriod, titlesOnly},
    nonpaintingTitles: nonpaintingTitles.map(row => ({territory: row.territory,
      nonpaintingMandatesInScope: row.counts.nonpaintingMandatesInScope,
      governments: row.nonpaintingGovernments})),
    limitations: [
      'Los grupos parcialmenteRepresented, los mandatos sin geometría y los núcleos limitados pueden solaparse. No se suman sus conteos.',
      'Un mandato sin relleno puede tener un contemporáneo que sí pinte algunas celdas. Se conservan el hueco del mandato y el hueco de toda la entidad por separado.',
      'La ausencia de correspondencia no significa que el SVG carezca de una celda utilizable. Una celda con el nombre de una ciudad requiere revisión visual, cronológica y documental antes de representar todo el señorío.',
      'La auditoría previa withoutGeometry mezcla gobiernos de todos los siglos con un mapa de 1400–1650 y oculta cobertura parcial si algún mandato se pinta una vez.',
      'La continuidad por capas espera autoridad solo en las fechas activas de la geometría. Así puede omitir gobiernos anteriores a la primera capa: Baviera antes de 1505 y Croacia antes de 1527 son ejemplos que debe revisar este inventario por mandato.',
      'Este inventario de mandatos no certifica autoridades para entidades que solo aparecen en reinos[] o en el catálogo, sin gobierno registrado. Tampoco inventaría todos los territorios históricos que aún no existen en la base.',
      'Cero etiquetas geométricas inexistentes solo confirma que las correspondencias ya escritas apuntan a rutas válidas; no demuestra que toda la tierra visible ni toda la historia estén representadas.',
      'Alemania y Sacro Imperio se excluyen de los pendientes de relleno: el cargo imperial utiliza un marco jurídico, que no equivale a dominio territorial personal sobre los estados imperiales.',
      'Los títulos no efectivos permanecen inspeccionables sin adquirir color. Jerusalén y Armenia cilicia solo tienen mandatos titulares dentro del período del mapa.',
      'Las locations fuera del alcance vinculado contienen también rutas del SVG mundial. No son un conteo de territorios del Atlas pendientes.',
    ],
  };
}

export function summarizeContinuityLayers(continuity) {
  if (!continuity) return null;
  const names = [...new Set(continuity.authorityGaps.flatMap(gap => gap.jurisdictions))].sort(sortNames);
  return {source: 'audit-map-continuity-report.json → locations',
    units: 'Capas cartográficas y locations; no entidades únicas del catálogo del Atlas.',
    counts: {layersWithAuthorityGaps: names.length,
      locationIntervalsWithoutAuthority: continuity.authorityGaps.length,
      uniqueLocationsWithAuthorityGaps: new Set(continuity.authorityGaps.map(gap => gap.regionId)).size,
      locationYearsWithoutAuthority: continuity.authorityGaps.reduce((n, gap) => n + gap.through - gap.from + 1, 0),
      groupedReviewTasks: continuity.reviewTasks.length},
    layers: names.map(name => ({name, intervals: continuity.reviewTasks
      .filter(task => task.jurisdictions.includes(name))
      .map(task => ({from: task.from, through: task.through, locations: task.regions.length,
        sharedWith: task.jurisdictions.filter(jurisdiction => jurisdiction !== name)}))})),
    note: 'El conjunto de capas con huecos puede solaparse con entidades representadas parcialmente. No se suma al número de entidades sin relleno. Los intervalos de relevo, regencia, ocupación y gobierno colectivo requieren interpretación histórica.'};
}

async function main() {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const readJson = async file => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));
  const data = await readJson('prototypes/euv-locations/corridor-locations.json');
  data.burgundy = await readJson('prototypes/euv-locations/burgundian-locations.json');
  const svg = await fs.readFile(path.join(root, 'prototypes/euv-locations/euv-locations-crop.svg'), 'utf8');
  const report = auditAtlasCoverage(PERSONAS, data, atlasLocationIds(svg));
  try {
    const continuity = await readJson('audit-map-continuity-report.json');
    report.continuityLayers = summarizeContinuityLayers(continuity.locations);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    report.continuityLayers = null;
  }
  await fs.writeFile(path.join(root, 'audit-atlas-coverage-report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`Atlas ${data.from}–${data.through}: ${report.counts.unrepresentedEntities} entidades efectivas sin relleno · ${report.counts.partialMandateGeometry} con mandatos parcialmente sin geometría · ${report.counts.explicitLimitedCores} núcleos limitados.`);
  console.log(`Exclusiones: ${report.counts.imperialLegalFrameExclusions} cargos imperiales · ${report.counts.governmentsOnlyOutsidePeriod} fuera del período · ${report.counts.titlesOnlyInsidePeriod} solo titulares.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
