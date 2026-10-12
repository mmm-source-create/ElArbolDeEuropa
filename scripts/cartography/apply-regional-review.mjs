// A regional review takes precedence only inside its explicit geographic scope.
// Earlier surveys remain available outside it; a later conquest is never used
// to fill an earlier gap. Each phase retains its own dates and source passages.
export function applyRegionalReview(data, review, key, corridor) {
  const scope = review.scope;
  if (review.schema !== 1 || scope.from !== 1200 || scope.through !== 1800
      || new Set(scope.ids).size !== scope.ids.length) throw new Error('Invalid regional scope');
  const names = new Set();
  const cells = new Set(scope.ids);
  for (const scope of review.authorityScopes || []) {
    if (!scope.personId || !scope.territory || !scope.note
      || !Number.isInteger(scope.from) || !Number.isInteger(scope.through)
      || scope.from < review.scope.from || scope.through > review.scope.through || scope.from > scope.through
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
        || !phase.sourceKeys.length) throw new Error(`Invalid regional phase: ${phase.name}`);
    const sources = phase.sourceKeys.map(key => {
      const source = review.sources[key];
      if (!source?.url?.startsWith('https://') || !source.locator || !source.title)
        throw new Error(`Missing regional evidence: ${phase.name}, ${key}`);
      return structuredClone(source);
    });
    return {name: phase.name, corridor, color: '#86715d',
      coverage: {from: phase.from, through: phase.through},
      versions: [{from: phase.from, ids: [...phase.ids], oldIds: [], borderline: [], event: phase.note}],
      note: phase.note, sources, precision: phase.precision, limitedCore: true,
      ...(phase.authorityCondition ? {authorityCondition: phase.authorityCondition} : {})};
  });
  const previousNames = new Set(data[key]?.layerNames || []);
  data.additionalTerritories = data.additionalTerritories
    .filter(layer => !previousNames.has(layer.name) && !names.has(layer.name));
  data.additionalTerritories.push(...layers);
  data[key] = {reviewedAt: review.reviewedAt, scope: structuredClone(scope),
    layerNames: [...names], limitations: [...review.limitations]};
  return data;
}
