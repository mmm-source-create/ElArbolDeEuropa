// Years shown next to people who share a display name with someone else.
const span = person => {
  const birth = Number.isInteger(person.nac) ? `${person.nacAprox ? 'c. ' : ''}${person.nac}` : '';
  const death = Number.isInteger(person.muer) ? `${person.muerAprox ? 'c. ' : ''}${person.muer}` : '';
  return birth && death ? `${birth}–${death}` : death ? `† ${death}` : birth ? `n. ${birth}` : '';
};
export function homonymYears(people, englishName = () => null) {
  const groups = new Map();
  const add = (key, id) => { if (!key) return; groups.set(key, [...(groups.get(key) || []), id]); };
  for (const person of people) { add(`es:${person.nombre}`, person.id); add(`en:${englishName(person.id)}`, person.id); }
  const ids = new Set([...groups.values()].filter(group => group.length > 1).flat());
  const byId = new Map(people.map(person => [person.id, person]));
  return Object.fromEntries([...ids].sort().map(id => [id, span(byId.get(id))]).filter(([, value]) => value));
}
