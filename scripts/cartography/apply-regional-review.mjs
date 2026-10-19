// A regional review takes precedence only inside its explicit geographic scope.
// Earlier surveys remain available outside it; a later conquest is never used
// to fill an earlier gap. Each phase retains its own dates and source passages.
export function applyRegionalReview(data, review, key, corridor) {
  const scope = review.scope;
  if (review.schema !== 1 || !Number.isInteger(scope.from) || !Number.isInteger(scope.through)
      || scope.from < data.from || scope.through > data.through || scope.from > scope.through
      || new Set(scope.ids).size !== scope.ids.length) throw new Error('Invalid regional scope');
  const names = new Set();
  const cells = new Set(scope.ids);
  const precedence = review.precedenceIds || scope.ids;
  if (new Set(precedence).size !== precedence.length || precedence.some(id => !cells.has(id)))
    throw new Error('Invalid regional precedence');
  for (const scope of review.authorityScopes || []) {
    if (!scope.personId || !scope.territory || !scope.note
      || !Number.isInteger(scope.from) || !Number.isInteger(scope.through)
      || scope.from < review.scope.from || scope.through > review.scope.through || scope.from > scope.through
      || (scope.disputedIds || []).some(id => !scope.ids.includes(id))
      || !scope.ids.length || new Set(scope.ids).size !== scope.ids.length || !scope.sourceKeys.length
      || scope.sourceKeys.some(key => !review.sources[key]?.url?.startsWith('https://') || !review.sources[key]?.locator))
      throw new Error(`Invalid regional authority scope: ${scope.personId}`);
  }
  const layers = review.assignments.map(phase => {
    if (names.has(phase.name)) throw new Error(`Duplicate regional phase: ${phase.name}`);
    names.add(phase.name);
    if (!Number.isInteger(phase.from) || !Number.isInteger(phase.through)
        || phase.from < scope.from || phase.through > scope.through || phase.from > phase.through
        || !phase.ids.length || phase.ids.some(id => !cells.has(id))
        || new Set(phase.ids).size !== phase.ids.length || !phase.note || !phase.identity
        || !phase.sourceKeys.length || !Array.isArray(phase.governmentTerritories))
      throw new Error(`Invalid regional phase: ${phase.name}`);
    const sources = phase.sourceKeys.map(key => {
      const source = review.sources[key];
      if (!source?.url?.startsWith('https://') || !source.locator || !source.title)
        throw new Error(`Missing regional evidence: ${phase.name}, ${key}`);
      return structuredClone(source);
    });
    return {name: phase.name, corridor, color: '#86715d',
      coverage: {from: phase.from, through: phase.through},
      versions: [{from: phase.from, ids: [...phase.ids], oldIds: [], borderline: [], event: phase.note}],
      note: phase.note, sources, precision: phase.precision, limitedCore: phase.limitedCore ?? review.limitedCore ?? true,
      ...(phase.scopeLabel ? {scopeLabel: phase.scopeLabel} : {}),
      ...(phase.authorityCondition ? {authorityCondition: phase.authorityCondition} : {})};
  });
  // A precedence cell suppresses earlier surveys. It must provide a complete
  // replacement, including one-year transitions, rather than silently erase it.
  for (const id of precedence) {
    const intervals = review.assignments.filter(phase => phase.ids.includes(id))
      .map(phase => [phase.from, phase.through]).sort((a, b) => a[0] - b[0]);
    let next = scope.from;
    for (const [from, through] of intervals) {
      if (from > next) throw new Error(`Regional replacement gap: ${id}/${next}`);
      next = Math.max(next, through + 1);
    }
    if (next <= scope.through) throw new Error(`Regional replacement gap: ${id}/${next}`);
  }
  if (review.precedenceByAssignment && precedence.length)
    throw new Error('Dated assignment precedence must not also replace a full-period footprint');
  const previousNames = new Set(data[key]?.layerNames || []);
  data.additionalTerritories = data.additionalTerritories
    .filter(layer => !previousNames.has(layer.name) && !names.has(layer.name));
  data.additionalTerritories.push(...layers);
  data[key] = {reviewedAt: review.reviewedAt, scope: structuredClone(scope),
    ...(review.precedenceIds ? {precedenceIds: [...review.precedenceIds]} : {}),
    ...(review.precedenceByAssignment ? {datedScopes:review.assignments.map(phase =>
      ({from:phase.from,through:phase.through,ids:[...phase.ids]}))} : {}),
    layerNames: [...names], limitations: [...review.limitations]};
  return data;
}
