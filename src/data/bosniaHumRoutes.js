import review from '../../prototypes/euv-locations/bosnia-hum-review.json' with {type: 'json'};

export const BOSNIA_HUM_IDENTITIES = Object.freeze(Object.fromEntries(
  review.assignments.map(phase => [phase.name, phase.identity])));
const routes = new Map();
for (const phase of review.assignments) for (const territory of phase.governmentTerritories) {
  if (!routes.has(territory)) routes.set(territory, []);
  routes.get(territory).push(phase);
}

export function bosniaHumJurisdictions(names, territory, year, personId) {
  return [...new Set([...names, ...(routes.get(territory) || [])
    .filter(phase => phase.from <= year && year <= phase.through
      && (!phase.authorityPeople || personId == null || phase.authorityPeople.includes(personId)))
    .map(phase => phase.name)])];
}

export function bosniaHumScope(personId, territory, year) {
  const scope = (review.authorityScopes || []).find(scope => scope.personId === personId
    && scope.territory === territory && scope.from <= year && year <= scope.through);
  if (!scope) return null;
  return {ids: scope.ids, source: review.sources[scope.sourceKeys[0]],
    additionalSources: scope.sourceKeys.slice(1).map(key => review.sources[key]), note: scope.note};
}
