// Independent medieval anchors supplement the accepted modern survey.
export function applyMedievalBalkans(data, review) {
  const names = new Set(review.territories.map(layer => layer.name));
  data.additionalTerritories = data.additionalTerritories.filter(layer => !names.has(layer.name));
  data.additionalTerritories.push(...structuredClone(review.territories));
  const layers = new Map([...data.territories, ...data.additionalTerritories].map(layer => [layer.name, layer]));
  for (const evidence of review.baseEvidence) {
    const layer = layers.get(evidence.name);
    if (!layer) throw new Error(`Unknown base evidence: ${evidence.name}`);
    Object.assign(layer, structuredClone(evidence));
  }
  for (const extension of review.temporalExtensions) {
    const layer = layers.get(extension.name);
    if (!layer) throw new Error(`Unknown medieval layer: ${extension.name}`);
    const retained = (layer.temporalExtensions || []).filter(entry => JSON.stringify(entry) !== JSON.stringify(extension));
    for (const period of extension.periods) {
      if (period.from < data.from || period.through >= 1400 || period.from > period.through
          || !extension.versions.some(version => version.from === period.from)
          || retained.some(entry => entry.periods.some(other => period.from <= other.through && other.from <= period.through)))
        throw new Error(`Invalid independent medieval period: ${extension.name}`);
    }
    layer.temporalExtensions = [...retained, structuredClone(extension)];
  }
  for (const layer of [...review.temporalExtensions, ...review.territories]) {
    if (!layer.sources?.length || layer.sources.some(source => !source.url?.startsWith('https://') || !source.locator)
        || !layer.note || !layer.versions.length)
      throw new Error(`Missing medieval evidence: ${layer.name}`);
  }
  data.medievalBalkanReview = {reviewedAt: review.reviewedAt, limitations: review.limitations,
    series: review.temporalExtensions.map(layer => layer.name), layerNames: [...names]};
  return data;
}
