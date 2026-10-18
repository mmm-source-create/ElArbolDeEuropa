// Shared dated routes; each review retains its own explicit scopes.
export function regionalReviewRoutes(review) {
  const routes = new Map();
  const scopes = new WeakMap();
  const phases = new Map(review.assignments.map(phase => [phase.name, phase]));
  const personalScopes = new Map();
  for (const scope of review.authorityScopes || []) {
    const key = scope.personId+'\u0000'+scope.territory;
    if (!personalScopes.has(key)) personalScopes.set(key, []);
    personalScopes.get(key).push(scope);
  }
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
    const selected = (personalScopes.get(personId+'\u0000'+territory) || [])
      .find(scope => scope.from <= year && year <= scope.through);
    if (!selected) return null;
    if (!scopes.has(selected)) scopes.set(selected, {ids: selected.ids,
      coverageIds: review.coverageIds || null,
      ...(selected.disputedIds ? {disputedIds: selected.disputedIds} : {}), source: review.sources[selected.sourceKeys[0]],
      additionalSources: selected.sourceKeys.slice(1).map(key => review.sources[key]), note: selected.note});
    return scopes.get(selected);
  }

  function politicalKeys(name, year) {
    const phase = phases.get(name);
    return phase && phase.from <= year && year <= phase.through ? phase.governmentTerritories : [];
  }
  return {identities: Object.freeze(Object.fromEntries(review.assignments.map(phase => [phase.name, phase.identity]))), jurisdictions, scope, politicalKeys};
}
