// Surface reviews replace only explicitly researched periods, never the full
// chronology merely because a polygon shares a city name with a title.
export function applyRegionalExtents(data, review) {
  const names = new Set(review.territories.map(entry => entry.name));
  data.additionalTerritories = data.additionalTerritories.filter(entry => !names.has(entry.name));
  data.additionalTerritories.push(...structuredClone(review.territories));
  const byName = new Map([...data.territories, ...data.additionalTerritories].map(entry => [entry.name, entry]));
  for (const replacement of review.replacements) {
    const entry = byName.get(replacement.name);
    if (!entry) throw new Error(`Unknown regional surface: ${replacement.name}`);
    for (const period of replacement.periods) {
      if (!replacement.versions.some(version => version.from === period.from))
        throw new Error(`Missing regional anchor: ${entry.name} ${period.from}`);
    }
    const remaining = (entry.temporalExtensions || []).flatMap(extension => {
      const periods = extension.periods.filter(period => !replacement.periods.some(p => p.from <= period.from && period.through <= p.through));
      return periods.length ? [{...extension, periods}] : [];
    });
    entry.temporalExtensions = [...remaining, structuredClone(replacement)];
  }
  const key = item => [item.territory, item.id, item.action, item.from, item.through].join('|');
  data.overrides = [...new Map([
    ...data.overrides.filter(item => item.supplement !== 'regional-extent'),
    ...review.overrides.map(item => ({...item, supplement: 'regional-extent'})),
  ].map(item => [key(item), item])).values()];
  data.regionalExtentReview = {reviewedAt: review.reviewedAt,
    series: review.replacements.length, layerNames: [...names], limitations: review.limitations};
  return data;
}
