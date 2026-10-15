import {frenchCrownEntries} from './frenchCrownRelations.js';
import {tributaryEntriesFor} from './tributaryRelations.js';
import {gobiernosDe, intervalosDisputadosDe} from './personAccessors.js';
import {idsDeGobiernoEnAño, colorTerritorioEnMapa} from '../Territorios.jsx';
import {authorityColor} from './mapColors.js';
import {gobiernoEfectivo} from './territorios.js';
import {personClaims} from '../evidence/claims.js';
import {mapLocationsForGovernment, pilotBurgundianGovernmentsFor,
  pilotDisputedHungarianClaimsFor, pilotLocationsFor, reviewedMapLayers,
  pilotJurisdictionsFor, reviewedLayerEvidence, reviewedLayerActive, reviewedLayerLocations, reviewedAuthorityConditions} from './locationMapPilot.js';
import {authorityExtensionFor, REVOLT_SOURCE} from './atlasAuthorityExtensions.js';
import {authorityMapScope} from './authorityMapScopes.js';
import {cerdanyaBorderCorrection, southernPyreneesCorrection} from './mapBorderCorrections.js';
import {chronologyReferenceJurisdictionsFor} from './atlasChronologyRoutes.js';

export const AUTHORITY_LABELS = Object.freeze({
  sovereign: 'Autoridad territorial', delegated: 'Gobierno delegado',
  titular: 'Título o pretensión sin control acreditado', disputed: 'Control disputado u ocupación',
  apanage:'Apanage de la Corona francesa',feudal:'Feudo de la Corona francesa',
  collective: 'Autoridad colectiva', tributary: 'Estado tributario · gobierno propio',
  mixed: 'Celda con varias jurisdicciones',
  regional: 'Jurisdicción territorial documentada', physical: 'Sin autoridad política documentada',
});

const governmentClaims = new WeakMap();
function claimsFor(person) {
  if (!governmentClaims.has(person)) governmentClaims.set(person,
    new Map(personClaims(person).filter(c => c.field === 'Gobierno').map(c => [c.value, c])));
  return governmentClaims.get(person);
}

export function authorityKind(government, year = null) {
  if (['titular', 'pretensión'].includes(government?.condicion) || government?.efectivo === false) return 'titular';
  const disputes = intervalosDisputadosDe(government);
  if (disputes.some(period => period.desde <= year && year <= period.hasta)) return 'disputed';
  if (['rival', 'disputado', 'ocupación'].includes(government?.condicion)) return 'disputed';
  if (['regencia', 'gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return 'delegated';
  return 'sovereign';
}

// Painting, inspection and continuity audits consume these same dated entries.
// A title can be inspected without acquiring a territorial fill.
export function mapAuthoritiesForPerson(person, year, mapData = null, {includeClaims = false, includeDependencies = false} = {}) {
  if (!person || !Number.isInteger(year)) return [];
  const claims = claimsFor(person);
  const entries = [];
  for (const government of gobiernosDe(person)) {
    if (government.desde > year || government.hasta < year) continue;
    const effective = gobiernoEfectivo(government);
    if (!effective && !includeClaims) continue;
    const legacyIds = idsDeGobiernoEnAño(government, year, person.id);
    let ids = mapData
      ? mapLocationsForGovernment(mapData, government, year, person.id, legacyIds) : legacyIds;
    if (mapData && !effective && !ids.length) {
      // A title's geographic reference is visible only in the claims section.
      const names=chronologyReferenceJurisdictionsFor(government.territorio);
      ids=[...new Set(reviewedMapLayers(mapData).filter(layer=>names.includes(layer.name))
        .flatMap(layer=>[...(layer.versions || [])].reverse().find(v=>v.from<=year&&v.ids.length)?.ids || []))];
    }
    const scope = mapData && authorityMapScope(person.id, government.territorio, year);
    const datedLayers = mapData ? pilotJurisdictionsFor(government.territorio, year, person.id)
      .map(name => reviewedMapLayers(mapData).find(layer => layer.name === name))
      .filter(layer => layer && reviewedLayerActive(mapData, layer, year)
        && reviewedLayerLocations(mapData, layer, year, person.id).some(id => ids.includes(id)))
      : [];
    const layerEvidence = datedLayers.map(layer => reviewedLayerEvidence(layer, year));
    const mapScopes = datedLayers.map(layer => ({ids: reviewedLayerLocations(mapData, layer, year, person.id).filter(id => ids.includes(id)), ...reviewedLayerEvidence(layer, year)}));
    if (scope) mapScopes.push({ids: scope.ids || ids, note: scope.note, sources: [scope.source, ...(scope.additionalSources || [])].filter(Boolean)});
    const extension = mapData && authorityExtensionFor(government.territorio, year, person.id);
    const border = mapData && cerdanyaBorderCorrection(government.territorio, year);
    const southernBorder = mapData && southernPyreneesCorrection(government.territorio, year);
    if (border?.occupation && effective && ids.includes(border.id)) {
      ids = ids.filter(id => id !== border.id);
      entries.push({person, government, claim: claims.get(government) || null,
        territory: 'Ocupación francesa de Puigcerdà', kind: 'disputed', paint: true,
        ids: [border.id], mapSources: [border.source], mapNote: border.note});
    }
    const revolt = person.id === 'FEL2ESP' && effective
      && (['Holanda','Zelanda'].includes(government.territorio) && year >= 1572
        || ['Flandes','Brabante'].includes(government.territorio) && year >= 1576);
    const regional = mapData ? reviewedAuthorityConditions(mapData,government.territorio,year,person.id) : new Map();
    const contested = ids.filter(id=>['control disputado','ocupación'].includes(regional.get(id)?.condition));
    const mixed = ids.filter(id => regional.get(id)?.condition === 'composición geográfica');
    const innerColor=year<1619&&government.territorio==='Austria'&&government.ambito?.includes('Austria Interior');
    const baseEntry = {...(innerColor?{color:colorTerritorioEnMapa(person,'Austria Interior',year)}:{}),person, government, claim: claims.get(government) || null,
      territory: government.territorio, kind: revolt ? 'disputed' : authorityKind(government, year),
      paint: effective, ids, mapScopes, mapSources: [...layerEvidence.flatMap(evidence => evidence.sources), ...(scope ? [scope.source, ...(scope.additionalSources || []), ...(scope.evidenceGroups || []).map(group => group.source)].filter(Boolean) : []), ...(extension ? [extension.source] : []), ...(revolt ? [REVOLT_SOURCE] : []), ...(border?.action === 'add' && !border.occupation ? [border.source] : []), ...(southernBorder?.action === 'add' ? [southernBorder.source] : [])],
      mapNote: revolt ? 'Soberanía y control disputados durante la revuelta. La trama no afirma posesión uniforme de toda la provincia.' : [...new Set([scope?.note, extension?.note, ...layerEvidence.map(evidence => evidence.note), border?.action === 'add' ? border.note : null, southernBorder?.action === 'add' ? southernBorder.note : null].filter(Boolean))].join(' ') || null};
    if (contested.length || mixed.length) {
      entries.push({...baseEntry,ids:ids.filter(id=>!contested.includes(id) && !mixed.includes(id))});
      for (const [cells, kind] of [[contested, 'disputed'], [mixed, 'mixed']]) if (cells.length)
        entries.push({...baseEntry,ids:cells,kind: kind === 'mixed' && baseEntry.kind === 'delegated' ? 'delegated' : kind,
          mapNote:[...new Set(cells.map(id=>regional.get(id).note).filter(Boolean))].join(' '),
          mapSources:[...baseEntry.mapSources,...cells.flatMap(id=>regional.get(id).sources)]});
    } else entries.push(baseEntry);
  }
  if (!mapData) return entries;

  for (const supplement of pilotBurgundianGovernmentsFor(mapData, person.id, year)) {
    // Tournai/Tournaisis are one jurisdiction in this cell. A canonical,
    // sourced seigneurial mandate supersedes the old laboratory supplement.
    if (supplement.territory === 'Tournaisis' && entries.some(e => e.territory === 'Tournai' && e.paint)) continue;
    const existing = entries.find(e => e.territory === supplement.territory && e.paint);
    if (existing) {
      existing.ids = [...new Set([...existing.ids, ...supplement.ids])];
      continue;
    }
    const sources = [...new Map((mapData.burgundy.overrides || [])
      .filter(o => o.territory === supplement.territory && o.from <= year && year <= o.through && o.source)
      .map(o => [o.source, {title: 'Fuente de la atribución cartográfica', url: o.source, locator: o.reason}])).values()];
    entries.push({person, government: {territorio: supplement.territory, desde: supplement.from,
      hasta: supplement.through, titulo: 'Señorío territorial', condicion: supplement.condition},
      territory: supplement.territory, kind: 'sovereign', paint: true, ids: supplement.ids,
      cartographicSupplement: true, claim: {certainty: 'inferred', sources,
        note: 'Atribución regional del ensayo documentado; no equivale a una frontera exacta.'}});
  }
  for (const disputed of pilotDisputedHungarianClaimsFor(mapData, person.id, year)) {
    const government = gobiernosDe(person).find(g => g.territorio === 'Hungría'
      && g.desde <= year && year <= g.hasta);
    if (!government) continue;
    // Only the reviewed eastern core is painted, never the whole claimed kingdom.
    for (let index=entries.length-1;index>=0;index--) if (entries[index].government===government) entries.splice(index,1);
    entries.push({person, government, claim: claims.get(government) || null,
      territory: disputed.territory, kind: 'disputed', paint: true,
      color: disputed.color, ids: disputed.ids});
  }
  // The Swedish military occupation precedes its legally distinct 1648 fief.
  if (gobiernosDe(person).some(g => g.territorio === 'Suecia' && gobiernoEfectivo(g)
      && g.desde <= year && year <= g.hasta) && year >= 1630 && year <= 1647) {
    const occupation = pilotLocationsFor(mapData, 'Pomerania', year).filter(id =>
      pilotLocationsFor(mapData, 'Suecia', year).includes(id));
    if (occupation.length) {
      for (const entry of entries) entry.ids = entry.ids.filter(id => !occupation.includes(id));
      const government = {territorio: 'Pomerania bajo ocupación sueca', desde: 1630,
        hasta: 1647, titulo: 'Ocupación militar', condicion: 'ocupación'};
      entries.push({person, government, territory: government.territorio, kind: 'disputed', paint: true,
        ids: occupation, claim: null});
    }
  }
  return [...entries,...frenchCrownEntries(person,year,mapData,entries), ...(includeDependencies ? tributaryEntriesFor(person, year, mapData, entries) : [])].filter(entry => entry.ids.length);
}

// A lifetime view is a temporal union, not a projection of one reference year.
// Yield between years so selection and year controls can cancel the work.
const lifetimeMaps = new WeakMap(), legacyLifetimeKey = {};
const nextMapTask = () => new Promise(resolve => {
  const channel = new MessageChannel();
  channel.port1.onmessage = () => { channel.port1.close(); channel.port2.close(); resolve(); };
  channel.port2.postMessage(null);
});
export async function mapAuthoritiesAcrossLife(person, mapData = null, {includeDependencies=false, signal} = {}) {
  const abort = () => { if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError'); };
  abort();
  if (!person) return [];
  const dataKey = mapData || legacyLifetimeKey;
  if (!lifetimeMaps.has(dataKey)) lifetimeMaps.set(dataKey, new WeakMap());
  const people = lifetimeMaps.get(dataKey);
  if (!people.has(person)) people.set(person, new Map());
  const cache = people.get(person);
  if (cache.has(includeDependencies)) return cache.get(includeDependencies);
  const governments = gobiernosDe(person).filter(g => gobiernoEfectivo(g)
    && Number.isInteger(g.desde) && Number.isInteger(g.hasta) && g.desde <= g.hasta);
  if (!governments.length) return [];
  const from = Math.min(...governments.map(g => g.desde)), through = Math.max(...governments.map(g => g.hasta));
  const territories = new Map();
  for (let year=from; year<=through; year++) {
    await nextMapTask();
    abort();
    for (const entry of mapAuthoritiesForPerson(person, year, mapData, {includeDependencies})) {
      if (!entry.paint || !entry.ids.length) continue;
      const key = entry.territory+'\u0000'+(entry.colorTerritory || '');
      if (!territories.has(key)) territories.set(key, {entry, cells:new Map()});
      const territory = territories.get(key);
      territory.entry = {...entry, color:authorityColor(entry,
        colorTerritorioEnMapa(person, entry.colorTerritory || entry.territory, year))};
      for (const id of entry.ids) {
        if (!territory.cells.has(id)) territory.cells.set(id, new Set());
        territory.cells.get(id).add(entry.kind);
      }
    }
  }
  abort();
  const result = [];
  for (const {entry, cells} of territories.values()) {
    const kinds = new Map();
    for (const [id, conditions] of cells) {
      const kind = conditions.size > 1 ? 'mixed' : [...conditions][0];
      if (!kinds.has(kind)) kinds.set(kind, []);
      kinds.get(kind).push(id);
    }
    for (const [kind, ids] of kinds) result.push({...entry, kind, ids,
      lifetimeUnion:true, mapNote:'Superficies de distintas etapas de esta vida; no necesariamente simultáneas. El color sigue la última agrupación registrada del título. Elige un año para consultar sus ámbitos y fuentes por fecha.'});
  }
  cache.set(includeDependencies, result);
  return result;
}
