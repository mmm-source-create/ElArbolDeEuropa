// Only explicitly reviewed series replace the initial 1400–1650 survey.
export function applyContinuityReview(data, review) {
  const newNames = new Set(review.territories.map(entry => entry.name));
  data.additionalTerritories = data.additionalTerritories.filter(entry => !newNames.has(entry.name));
  data.additionalTerritories.push(...structuredClone(review.territories));
  const entries = new Map([...data.territories, ...data.additionalTerritories].map(entry => [entry.name, entry]));
  for (const replacement of review.replacements) {
    const entry = entries.get(replacement.name);
    if (!entry) throw new Error(`Unknown continuity series: ${replacement.name}`);
    Object.assign(entry, structuredClone(replacement));
    delete entry.active;
    delete entry.periods;
    delete entry.temporalExtensions;
  }
  data.continuityReview = {reviewedAt: review.reviewedAt,
    series: review.replacements.map(entry => entry.name),
    layerNames: [...newNames], limitations: review.limitations};
  return data;
}
