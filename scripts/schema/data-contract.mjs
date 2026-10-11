// V5 source contract. This validates data; it never repairs or normalizes it.
import {canonicalJson, digest} from './canonical.mjs';
export const GOVERNMENT_CONDITIONS = ['efectivo', 'rama', 'corregente', 'rival', 'jure uxoris', 'titular', 'disputado', 'pretensión', 'regencia', 'ocupación', 'gobierno delegado'];
export const GOVERNMENT_CLASSES = ['ducado', 'señorío', 'condado', 'reinado', 'margraviato', 'imperio', 'gran_ducado', 'gobierno', 'pontificado', 'archiducado', 'regencia', 'principado', 'vizcondado', 'marquesado', 'landgraviato', 'electorado', 'voivodato', 'estatuderato', 'despotado', 'gran_principado', 'zarato', 'sultanato', 'banato', 'emirato'];
export const TERRITORY_CLASSES = [...GOVERNMENT_CLASSES, 'reino', 'grupo_historico', 'territorio_compuesto', 'republica', 'ciudad', 'grupo_geografico', 'burgraviato', 'estado_pontificio', 'corona_compuesta', 'union_compuesta'];

const optional = rule => ({...rule, optional: true});
const nullable = rule => ({...rule, nullable: true});
const text = {type: 'string'};
const prose = {type: 'string', allowEmpty: true};
const year = {type: 'integer'};
const boolean = {type: 'boolean'};
const array = items => ({type: 'array', items});
const object = properties => ({type: 'object', properties});
const enumeration = values => ({type: 'string', values});
const fields = (names, rule) => Object.fromEntries(names.map(name => [name, optional(rule)]));
const years = object({desde: year, hasta: year});
const mapPeriod = object({from: year, through: year});
const source = object({title: optional(text), label: optional(text), url: text, locator: text, key: optional(text)});
const version = object({from: year, ids: array(text), oldIds: optional(array(text)), borderline: optional(array(text)), event: optional(text), sourceKeys: optional(array(text))});
const documentedDate = object({
  tipo: enumeration(['aproximada', 'intervalo', 'antes', 'despues']), nota: text,
  ...fields(['valor', 'desde', 'hasta'], year),
});

export const GOVERNMENT_SCHEMA = object({
  territorio: text, desde: year, hasta: year, titulo: text,
  clase: enumeration(GOVERNMENT_CLASSES), condicion: enumeration(GOVERNMENT_CONDITIONS),
  nota: optional(prose), ambito: optional(text), soberano: optional(text),
  controlDisputado: optional(array(years)),
});
export const PERSON_SCHEMA = object({
  id: text, nombre: text, titulo: text, reinos: array(text),
  ...fields(['sobrenombre', 'dinastia', 'padre', 'madre', 'slug'], text),
  ...fields(['nac', 'muer'], year),
  ...fields(['nacAprox', 'muerAprox', 'identidadDesconocida'], boolean),
  ...fields(['conyuges', 'amantes', 'aliases'], array(text)),
  gobiernos: optional(array(GOVERNMENT_SCHEMA)),
  documentacion: optional(object({
    notas: optional(array(object({campo: text, estado: enumeration(['variantes', 'aclaracion', 'discutida']), texto: text}))),
    fechas: optional(object({nac: optional(documentedDate), muer: optional(documentedDate)})),
  })),
});
export const TERRITORY_SCHEMA = object({
  clase: enumeration(TERRITORY_CLASSES),
  naturaleza: enumeration(['entidad', 'agrupacion', 'compuesta']), componentes: array(text),
  ...fields(['nota'], text), ...fields(['desde', 'hasta'], year),
  titulosDeGobierno: optional(array(text)),
  etapas: optional(array(object({clase: enumeration(TERRITORY_CLASSES), desde: nullable(year), hasta: optional(year), nota: optional(text)}))),
  pertenencias: optional(array(object({territorio: text, desde: year, hasta: optional(year), nota: optional(text)}))),
});
const extension = object({
  name: text, periods: array(mapPeriod), precision: text, limitedCore: boolean,
  versions: array(version), note: text, sources: array(source),
  corridor: optional(text), coverage: optional(text),
});
export const MAP_LAYER_SCHEMA = object({
  name: text, corridor: text, color: text, versions: array(version),
  note: optional(nullable(text)),
  active: optional(nullable(object({from: optional(year), through: optional(year), reason: optional(text), source: optional(text)}))),
  coverage: optional(mapPeriod), sources: optional(array(source)),
  precision: optional(text), limitedCore: optional(boolean),
  limitedCorePeriods: optional(array(mapPeriod)), periods: optional(array(mapPeriod)),
  supersedes: optional(array(text)), borderlineIds: optional(array(text)),
  temporalExtensions: optional(array(extension)),
  authorityCondition: optional(enumeration(['control disputado', 'ocupación', 'gobierno delegado', 'autonomía tributaria'])),
});

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const own = (value, key) => Object.hasOwn(value, key);

export function validateShape(value, schema, path = '$') {
  const issues = [];
  const add = (code, message) => issues.push({code, path, message});
  if (value === undefined && schema.optional || value === null && schema.nullable) return issues;
  if (schema.anyOf) {
    if (!schema.anyOf.some(rule => validateShape(value, rule, path).length === 0)) add('SHAPE', 'Forma no admitida');
    return issues;
  }
  const valid = schema.type === 'integer' ? Number.isSafeInteger(value)
    : schema.type === 'array' ? Array.isArray(value)
    : schema.type === 'object' ? isObject(value)
    : typeof value === schema.type;
  if (!valid) {add('TYPE', `Se esperaba ${schema.type}`); return issues;}
  if (schema.type === 'string' && !schema.allowEmpty && !value.trim()) add('EMPTY', 'Texto vacío');
  if (schema.values && !schema.values.includes(value)) add('ENUM', `Valor no reconocido: ${value}`);
  if (schema.type === 'object') {
    for (const key of Object.keys(value)) if (!own(schema.properties, key)) issues.push({code: 'UNKNOWN_FIELD', path: `${path}.${key}`, message: 'Campo sin contrato'});
    for (const [key, rule] of Object.entries(schema.properties)) issues.push(...validateShape(value[key], rule, `${path}.${key}`));
  }
  if (schema.type === 'array') value.forEach((item, index) => issues.push(...validateShape(item, schema.items, `${path}[${index}]`)));
  return issues;
}

export const governmentKey = (personId, government) => `person:${personId}:government:${[government.territorio, government.desde, government.hasta, government.titulo].join(':')}`;

// The ledger records formats, not accepted historical facts. Removal is welcome.
export function legacyFormats(people) {
  const groups = {spouses: {}, disputedIntervals: {}, uncertainParents: {}};
  for (const person of people) {
    if (!isObject(person)) continue;
    const spouses = Object.fromEntries(['conyuge', 'conyuge2'].filter(key => own(person, key)).map(key => [key, person[key]]));
    if (Object.keys(spouses).length) groups.spouses[person.id] = spouses;
    const uncertainty = Object.fromEntries(['madreAprox', 'padreAprox'].filter(key => own(person, key)).map(key => [key, person[key]]));
    if (Object.keys(uncertainty).length) groups.uncertainParents[person.id] = uncertainty;
    for (const government of Array.isArray(person.gobiernos) ? person.gobiernos : []) if (isObject(government?.controlDisputado)) {
      groups.disputedIntervals[governmentKey(person.id, government)] = government.controlDisputado;
    }
  }
  return groups;
}

export function legacyMapFormats(mapData) {
  return Object.fromEntries([...(mapData.territories || []), ...(mapData.additionalTerritories || [])]
    .filter(layer => layer.versions.some((entry, index) => index > 0 && entry.from <= layer.versions[index - 1].from))
    .map(layer => [layer.name, {starts: layer.versions.map(entry => entry.from), versionsSha256: digest(layer.versions)}]));
}

export function legacyMapEvidence(mapData) {
  return Object.fromEntries([...(mapData.territories || []), ...(mapData.additionalTerritories || [])]
    .filter(layer => !layer.sources?.length).map(layer => [layer.name, {layerSha256: digest(layer)}]));
}

export function validateContracts({people, territories, mapData, locationIds, legacy, claimReviews = {}}) {
  const issues = [];
  const add = (code, path, message) => issues.push({code, path, message});
  const interval = (entry, from, through, path) => {
    if (Number.isSafeInteger(entry[from]) && Number.isSafeInteger(entry[through]) && entry[from] > entry[through]) add('REVERSED_INTERVAL', path, 'Intervalo invertido');
  };
  const uniqueStrings = (items, path) => {
    if (Array.isArray(items) && new Set(items).size !== items.length) add('DUPLICATE', path, 'Referencias repetidas');
  };
  const ids = new Set(people.map(person => person?.id));
  if (!Number.isSafeInteger(mapData.from) || !Number.isSafeInteger(mapData.through)
      || mapData.from > 1200 || mapData.through < 1800) add('MAP_RANGE', 'map', 'El mapa debe cubrir 1200–1800 con límites enteros');
  if (ids.size !== people.length) add('DUPLICATE_ID', 'people', 'Identificadores repetidos');
  for (const person of people) {
    const path = `person:${person?.id}`;
    const shapeIssues = validateShape(person, PERSON_SCHEMA, path);
    issues.push(...shapeIssues);
    if (shapeIssues.length) continue;
    interval(person, 'nac', 'muer', path);
    for (const field of ['padre', 'madre']) if (person[field] === person.id)
      add('SELF_RELATIONSHIP', `${path}.${field}`, 'Una persona no puede ser su propio progenitor');
    for (const field of ['conyuges', 'amantes']) if (person[field]?.includes(person.id))
      add('SELF_RELATIONSHIP', `${path}.${field}`, 'Una relación no puede apuntar a la misma persona');
    // Unknown name and unknown chronology are independent. A recorded year for
    // an unnamed person needs evidence on that date, not on a nearby relative.
    if (person.identidadDesconocida) for (const [field, suffix] of [['nac', 'birth'], ['muer', 'death']]) {
      if (!own(person, field)) continue;
      const review = claimReviews[`person:${person.id}:${suffix}`];
      const located = review?.sources?.some(source => {
        try {return (source.title || source.label)?.trim() && source.locator?.trim()
          && ['https:', 'http:'].includes(new URL(source.url).protocol);}
        catch {return false;}
      });
      if (!located || !review.note?.trim() || !['documented', 'approximate', 'disputed', 'inferred'].includes(review.certainty)) {
        add('UNKNOWN_IDENTITY_DATE', `${path}.${field}`, 'Una persona sin nombre identificado necesita justificación y fuente localizada de esta fecha');
      }
    }
    for (const field of ['padre', 'madre']) if (person[field] && !ids.has(person[field])) add('MISSING_PERSON', `${path}.${field}`, `Persona inexistente: ${person[field]}`);
    for (const field of ['conyuges', 'amantes']) if (Array.isArray(person[field])) for (const id of person[field]) if (!ids.has(id)) add('MISSING_PERSON', `${path}.${field}`, `Persona inexistente: ${id}`);
    for (const field of ['reinos', 'conyuges', 'amantes', 'aliases']) uniqueStrings(person[field], `${path}.${field}`);
    for (const territory of person.reinos || []) if (!own(territories, territory)) add('MISSING_TERRITORY', `${path}.reinos`, `Entidad inexistente: ${territory}`);
    const governmentIds = new Set();
    for (const government of person.gobiernos || []) {
      const key = governmentKey(person.id, government);
      if (governmentIds.has(key)) add('DUPLICATE_GOVERNMENT', key, 'Dos mandatos comparten la misma identidad de evidencia');
      governmentIds.add(key);
      interval(government, 'desde', 'hasta', key);
      if (!own(territories, government.territorio)) add('MISSING_TERRITORY', key, `Entidad inexistente: ${government.territorio}`);
      if (!person.reinos?.includes(government.territorio)) add('GOVERNMENT_ASSOCIATION', key, 'El gobierno no figura entre los territorios asociados');
      if (government.soberano && !ids.has(government.soberano)) add('MISSING_PERSON', `${key}.soberano`, 'Soberano inexistente');
      if (government.soberano === person.id) add('SELF_SOVEREIGN', `${key}.soberano`, 'Un mandato delegado no puede referirse a sí mismo como soberano');
      for (const period of government.controlDisputado || []) {
        interval(period, 'desde', 'hasta', `${key}.controlDisputado`);
        if (period.desde < government.desde || period.hasta > government.hasta) add('DISPUTE_OUTSIDE_GOVERNMENT', key, 'La disputa excede el mandato');
      }
    }
    for (const [field, date] of Object.entries(person.documentacion?.fechas || {})) {
      interval(date, 'desde', 'hasta', `${path}.documentacion.fechas.${field}`);
      const required = {aproximada: ['valor'], intervalo: ['desde', 'hasta'], antes: ['hasta'], despues: ['desde']}[date.tipo] || [];
      for (const key of required) if (!Number.isSafeInteger(date[key])) add('DATE_BOUND', `${path}.documentacion.fechas.${field}.${key}`, 'Falta el límite documental');
    }
  }
  for (const [name, territory] of Object.entries(territories)) {
    const path = `territory:${name}`;
    const shapeIssues = validateShape(territory, TERRITORY_SCHEMA, path);
    issues.push(...shapeIssues);
    if (shapeIssues.length) continue;
    interval(territory, 'desde', 'hasta', path);
    for (const child of territory.componentes || []) if (!own(territories, child)) add('MISSING_TERRITORY', path, `Componente inexistente: ${child}`);
    for (const [index, stage] of (territory.etapas || []).entries()) {
      interval(stage, 'desde', 'hasta', `${path}.etapas`);
      if (stage.desde === null && index !== 0) add('UNBOUNDED_STAGE', `${path}.etapas[${index}]`, 'Solo la etapa inicial puede carecer de inicio conocido');
    }
    for (const relation of territory.pertenencias || []) {
      interval(relation, 'desde', 'hasta', `${path}.pertenencias`);
      if (!own(territories, relation.territorio)) add('MISSING_TERRITORY', path, `Pertenencia inexistente: ${relation.territorio}`);
    }
  }
  const layers = [...(mapData.territories || []), ...(mapData.additionalTerritories || [])];
  const names = new Set(layers.map(layer => layer.name));
  if (names.size !== layers.length) add('DUPLICATE_LAYER', 'map', 'Nombres de capa repetidos');
  const checkSources = (sources, path) => {
    for (const citation of sources || []) {
      if (!citation.title && !citation.label) add('SOURCE_TITLE', path, 'Fuente sin título');
      try {if (!['https:', 'http:'].includes(new URL(citation.url).protocol)) throw new Error();}
      catch {add('SOURCE_URL', path, 'URL bibliográfica no válida');}
    }
  };
  const checkVersions = (versions, path, sources, acceptedOrder = false) => {
    let previous = -Infinity;
    for (const entry of versions || []) {
      if (entry.from <= previous && !acceptedOrder) add('VERSION_ORDER', path, 'Versiones sin orden cronológico estricto');
      previous = entry.from;
      uniqueStrings(entry.ids, `${path}:${entry.from}.ids`);
      for (const id of entry.ids || []) if (!locationIds.has(id)) add('MISSING_LOCATION', `${path}:${entry.from}`, `ID ausente del SVG: ${id}`);
      for (const key of entry.sourceKeys || []) if (!sources?.some(source => source.key === key)) add('MISSING_SOURCE_KEY', path, `Fuente inexistente: ${key}`);
    }
  };
  for (const layer of layers) {
    const path = `layer:${layer.name}`;
    const shapeIssues = validateShape(layer, MAP_LAYER_SCHEMA, path);
    issues.push(...shapeIssues);
    if (shapeIssues.length) continue;
    for (const field of ['coverage', 'active']) if (layer[field]) interval(layer[field], 'from', 'through', `${path}.${field}`);
    for (const field of ['periods', 'limitedCorePeriods']) for (const period of layer[field] || []) interval(period, 'from', 'through', `${path}.${field}`);
    checkSources(layer.sources, path);
    if (!layer.sources?.length && legacy?.groups?.mapEvidence?.entries?.[layer.name]?.layerSha256 !== digest(layer)) {
      add('MAP_EVIDENCE', path, 'Una capa nueva o modificada necesita fuentes territoriales con pasaje');
    }
    const recordedOrder = legacy?.groups?.mapVersionOrder?.entries?.[layer.name];
    checkVersions(layer.versions, path, layer.sources, recordedOrder?.versionsSha256 === digest(layer.versions));
    for (const target of layer.supersedes || []) if (!names.has(target)) add('MISSING_LAYER', path, `Capa sustituida inexistente: ${target}`);
    for (const extension of layer.temporalExtensions || []) {
      for (const period of extension.periods) interval(period, 'from', 'through', `${path}.extension`);
      checkSources(extension.sources, `${path}.extension`);
      if (!extension.sources.length) add('MAP_EVIDENCE', `${path}.extension`, 'Una extensión temporal necesita fuentes territoriales con pasaje');
      checkVersions(extension.versions, `${path}.extension`, extension.sources);
    }
  }
  if (legacy) for (const [group, entries] of Object.entries(legacyFormats(people))) for (const [key, value] of Object.entries(entries)) {
    const accepted = legacy.groups?.[group]?.entries?.[key];
    if (canonicalJson(value) !== canonicalJson(accepted)) add('NEW_LEGACY_FORMAT', `${group}:${key}`, 'Nuevo uso o modificación de un formato heredado; migrar al formato canónico');
  }
  return issues;
}
