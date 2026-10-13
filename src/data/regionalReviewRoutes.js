// Shared dated routes; each review retains its own explicit scopes.
export function regionalReviewRoutes(review) {
  const routes = new Map();
  for (const phase of review.assignments) for (const territory of phase.governmentTerritories) {
    if (!routes.has(territory)) routes.set(territory, []);
    routes.get(territory).push(phase);
  }

  function jurisdictions(names, territory, year, personId) {
    return [...new Set([...names, ...(routes.get(territory) || [])
      .filter(phase => phase.from <= year && year <= phase.through
        && (!phase.authorityPeople || personId == null || phase.authorityPeople.includes(personId)))
      .map(phase => phase.name)])];
  }

  function scope(personId, territory, year) {
    const selected = (review.authorityScopes || []).find(scope => scope.personId === personId
      && scope.territory === territory && scope.from <= year && year <= scope.through);
    if (!selected) return null;
    return {ids: selected.ids, ...(selected.disputedIds ? {disputedIds: selected.disputedIds} : {}), source: review.sources[selected.sourceKeys[0]],
      additionalSources: selected.sourceKeys.slice(1).map(key => review.sources[key]), note: selected.note};
  }

  return {identities: Object.freeze(Object.fromEntries(review.assignments.map(phase => [phase.name, phase.identity]))), jurisdictions, scope};
}
