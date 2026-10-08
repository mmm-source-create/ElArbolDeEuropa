import {idsDeGobiernoEnAño} from '../Territorios.jsx';
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
  collective: 'Autoridad colectiva',
});

const governmentClaims = new WeakMap();
function claimsFor(person) {
  if (!governmentClaims.has(person)) governmentClaims.set(person,
    new Map(personClaims(person).filter(c => c.field === 'Gobierno').map(c => [c.value, c])));
  return governmentClaims.get(person);
}

export function authorityKind(government, year = null) {
  if (['titular', 'pretensión'].includes(government?.condicion) || government?.efectivo === false) return 'titular';
  const disputes = [].concat(government?.controlDisputado || []);
  if (disputes.some(period => period.desde <= year && year <= period.hasta)) return 'disputed';
  if (['rival', 'disputado', 'ocupación'].includes(government?.condicion)) return 'disputed';
  if (['regencia', 'gobierno delegado'].includes(government?.condicion)
      || /gobernador|regente|virrey/i.test(government?.titulo || '')) return 'delegated';
  return 'sovereign';
}

// Painting, inspection and continuity audits consume these same dated entries.
// A title can be inspected without acquiring a territorial fill.
export function mapAuthoritiesForPerson(person, year, mapData = null, {includeClaims = false} = {}) {
  if (!person || !Number.isInteger(year)) return [];
  const claims = claimsFor(person);
  const entries = [];
  for (const government of person.gobiernos || []) {
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
    if (mapData && government.territorio === 'Austria' && government.ambito?.includes('Austria Interior')) {
      ids = [...pilotLocationsFor(mapData, 'Austria Interior', year, person.id),
        ...(year >= 1619 ? pilotLocationsFor(mapData, 'Austria', year, person.id) : [])];
    }
    const scope = mapData && authorityMapScope(person.id, government.territorio, year);
    const layerEvidence = mapData ? pilotJurisdictionsFor(government.territorio, year, person.id)
      .map(name => reviewedMapLayers(mapData).find(layer => layer.name === name))
      .filter(layer => layer && reviewedLayerActive(mapData, layer, year)
        && reviewedLayerLocations(mapData, layer, year, person.id).some(id => ids.includes(id)))
      .map(layer => reviewedLayerEvidence(layer, year)) : [];
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
    const baseEntry = {person, government, claim: claims.get(government) || null,
      territory: government.territorio, kind: revolt ? 'disputed' : authorityKind(government, year),
      paint: effective, ids, mapSources: [...layerEvidence.flatMap(evidence => evidence.sources), ...(scope ? [scope.source, ...(scope.additionalSources || []), ...(scope.evidenceGroups || []).map(group => group.source)].filter(Boolean) : []), ...(extension ? [extension.source] : []), ...(revolt ? [REVOLT_SOURCE] : []), ...(border?.action === 'add' && !border.occupation ? [border.source] : []), ...(southernBorder?.action === 'add' ? [southernBorder.source] : [])],
      mapNote: revolt ? 'Soberanía y control disputados durante la revuelta. La trama no afirma posesión uniforme de toda la provincia.' : [...new Set([scope?.note, extension?.note, ...layerEvidence.map(evidence => evidence.note), border?.action === 'add' ? border.note : null, southernBorder?.action === 'add' ? southernBorder.note : null].filter(Boolean))].join(' ') || null};
    if (contested.length) {
      entries.push({...baseEntry,ids:ids.filter(id=>!contested.includes(id))});
      entries.push({...baseEntry,ids:contested,kind:'disputed',
        mapNote:[...new Set(contested.map(id=>regional.get(id).note).filter(Boolean))].join(' '),
        mapSources:[...baseEntry.mapSources,...contested.flatMap(id=>regional.get(id).sources)]});
    } else entries.push(baseEntry);
  }
  if (!mapData) return entries;

  for (const supplement of pilotBurgundianGovernmentsFor(mapData, person.id, year)) {
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
    const government = (person.gobiernos || []).find(g => g.territorio === 'Hungría'
      && g.desde <= year && year <= g.hasta);
    if (!government) continue;
    // Only the reviewed eastern core is painted, never the whole claimed kingdom.
    for (let index=entries.length-1;index>=0;index--) if (entries[index].government===government) entries.splice(index,1);
    entries.push({person, government, claim: claims.get(government) || null,
      territory: disputed.territory, kind: 'disputed', paint: true,
      color: disputed.color, ids: disputed.ids});
  }
  // The Swedish military occupation precedes its legally distinct 1648 fief.
  if ((person.gobiernos || []).some(g => g.territorio === 'Suecia' && gobiernoEfectivo(g)
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
  return entries.filter(entry => entry.ids.length);
}
