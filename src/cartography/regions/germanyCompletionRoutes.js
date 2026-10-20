import review from '../../../data/cartography/germany-completion-review.json' with {type:'json'};
import {PERSONAS} from '../../data/personas.js';
import {gobiernosDe} from '../../domain/genealogy/personAccessors.js';
import {authorityKind} from '../../domain/government/authorityKind.js';
import {regionalReviewRoutes} from './regionalReviewRoutes.js';
const routes = regionalReviewRoutes(review);
export const GERMANY_COMPLETION_IDENTITIES = routes.identities;
// A linked phase only fills cells the map left empty: it supplements, and
// never replaces, the approximate geometry a government already had.
export const isCompletionSupplement = name => Object.hasOwn(GERMANY_COMPLETION_IDENTITIES, name);

// The completion phases name their jurisdiction but no ruler. A documented
// mandate over that jurisdiction governs the filled cells. Identities named
// after their holder are linked to the holder's mandate, with dates where
// the name alone is not enough (Mark and Ravensberg before 1609 were Cleves').
const HOLDER_TERRITORIES = Object.freeze({
  'Pomerania de Brandeburgo':[{territory:'Brandeburgo'}],
  'Cottbus · adquisición brandeburguesa':[{territory:'Brandeburgo'}],
  'Alta Lusacia bajo Brandeburgo':[{territory:'Brandeburgo'}],
  'Baja Lusacia bajo Brandeburgo':[{territory:'Brandeburgo'}],
  Mark:[{territory:'Mark'},{territory:'Brandeburgo',from:1609}],
  Ravensberg:[{territory:'Ravensberg'},{territory:'Brandeburgo',from:1609}],
  'Prusia de la Orden':[{territory:'Prusia',through:1524}],
  'Alta Lusacia bajo Sajonia':[{territory:'Sajonia'}],
  'Baja Lusacia bajo Sajonia':[{territory:'Sajonia'}],
  'Pomerania sueca':[{territory:'Suecia'}],
  'Pomerania bajo ocupación sueca':[{territory:'Suecia'}],
  'Señorío sueco de Wismar':[{territory:'Suecia'}],
  'Ducados de Bremen-Verden':[{territory:'Suecia'}],
  'Administración danesa de Bremen-Verden':[{territory:'Dinamarca'}],
  'Señorío de Rostock bajo Dinamarca':[{territory:'Dinamarca'}],
  'Prusia Real':[{territory:'Polonia'}],
});
const phasesByTerritory = new Map();
for (const phase of review.assignments) if (!phase.governmentTerritories.length)
  for (const link of HOLDER_TERRITORIES[phase.identity] || [{territory:phase.identity}]) {
    if (!phasesByTerritory.has(link.territory)) phasesByTerritory.set(link.territory, []);
    phasesByTerritory.get(link.territory).push({phase, from:Math.max(phase.from, link.from ?? -Infinity),
      through:Math.min(phase.through, link.through ?? Infinity)});
  }

// Partitions and rival lines share a territory name: link only one sovereign
// line without a partial «ambito» (the outgoing and incoming holders of a
// succession year count as one line), never every duke of a divided duchy.
let holders = null;
function linkedHolders(territory, year) {
  if (!holders) {
    holders = new Map();
    for (const person of PERSONAS) for (const government of gobiernosDe(person)) {
      if (!phasesByTerritory.has(government.territorio)) continue;
      if (!holders.has(government.territorio)) holders.set(government.territorio, []);
      holders.get(government.territorio).push({personId:person.id, government});
    }
  }
  const active = (holders.get(territory) || []).filter(({government}) => government.desde <= year
    && year <= government.hasta && authorityKind(government, year) === 'sovereign'
    && government.condicion !== 'corregente' && !government.ambito);
  const incoming = new Set(active.filter(({government}) => government.desde === year).map(h => h.personId));
  const outgoing = new Set(active.filter(({government}) => government.hasta === year && government.desde < year).map(h => h.personId));
  const lines = new Set(active.map(h => h.personId).filter(id => !outgoing.has(id) || incoming.has(id)));
  if (lines.size > 1) return new Set();
  if (!lines.size) return outgoing.size === 1 ? outgoing : new Set();
  return new Set([...lines, ...(incoming.size ? outgoing : [])]);
}

export function germanyCompletionJurisdictions(names, territory, year, personId) {
  const routed = routes.jurisdictions(names, territory, year, personId);
  const linked = (phasesByTerritory.get(territory) || []).filter(link => link.from <= year && year <= link.through);
  if (linked.length && personId != null && linkedHolders(territory, year).has(personId))
    routed.push(...linked.map(link => link.phase.name));
  return [...new Set(routed)];
}
