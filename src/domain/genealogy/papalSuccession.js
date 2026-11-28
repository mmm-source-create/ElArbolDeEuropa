// Institutional order, independent of birth dates, families and territorial control.
// Vatican: https://www.vatican.va/content/vatican/en/holy-father.html (176–251).
export const PAPAL_SUCCESSION = Object.freeze(`
PAPA_INOCENCIO3 PAPA_HONORIO3 PAPA_GREGORIO9 PAPA_CELESTINO4
PAPA_INOCENCIO4 PAPA_ALEJANDRO4 PAPA_URBANO4 PAPA_CLEMENTE4 GREG10
PAPA_INOCENCIO5 PAPA_ADRIANO5 PAPA_JUAN21 PAPA_NICOLAS3 PAPA_MARTIN4
PAPA_HONORIO4 PAPA_NICOLAS4 PAPA_CELESTINO5 PAPA_BONIFACIO8 PAPA_BENEDICTO11
PAPA_CLEMENTE5 PAPA_JUAN22 PAPA_BENEDICTO12 PAPA_CLEMENTE6 PAPA_INOCENCIO6
PAPA_URBANO5 PAPA_GREGORIO11 PAPA_URBANO6 PAPA_BONIFACIO9 PAPA_INOCENCIO7
PAPA_GREGORIO12 PAPA_MARTIN5 PAPA_EUGENIO4 PAPA_NICOLAS5 ALFONSOBORJA
PAPA_PIO2 PAPA_PAULO2 PAPA_SIXTO4 PAPA_INOCENCIO8 RODRIGOBORJA PAPA_PIO3
PAPA_JULIO2 PAPA_LEON10 PAPA_ADRIANO6 PAPA_CLEMENTE7 PAPA_PAULO3 PAPA_JULIO3
PAPA_MARCELO2 PAPA_PAULO4 PAPA_PIO4 PAPA_PIO5 PAPA_GREGORIO13 PAPA_SIXTO5
PAPA_URBANO7 PAPA_GREGORIO14 PAPA_INOCENCIO9 PAPA_CLEMENTE8 PAPA_LEON11
PAPA_PAULO5 PAPA_GREGORIO15 PAPA_URBANO8 PAPA_INOCENCIO10 PAPA_ALEJANDRO7
PAPA_CLEMENTE9 PAPA_CLEMENTE10 PAPA_INOCENCIO11 PAPA_ALEJANDRO8 PAPA_INOCENCIO12
PAPA_CLEMENTE11 PAPA_INOCENCIO13 PAPA_BENEDICTO13 PAPA_CLEMENTE12 PAPA_BENEDICTO14
PAPA_CLEMENTE13 PAPA_CLEMENTE14 PAPA_PIO6 PAPA_PIO7`.trim().split(/\s+/));
export const PAPAL_RANK = new Map(PAPAL_SUCCESSION.map((id, index) => [id, index]));
export const PAPAL_COLUMN = '\u0000papal-succession';

// Retain each existing couple component and every parent/child constraint.
// A succession may stay in one logical generation: its cards stack inside it.
export function alignPapalGenerations(people, gen, partners) {
  const unitOf = new Map(), units = [];
  const byId = new Map(people.map(p => [p.id, p]));
  for (const person of people) {
    if (unitOf.has(person.id)) continue;
    const members = [person.id], index = units.length;
    unitOf.set(person.id, index);
    for (let i = 0; i < members.length; i++) for (const id of partners(byId.get(members[i]))) {
      if (byId.has(id) && !unitOf.has(id) && gen[id] === gen[members[i]]) {
        unitOf.set(id, index); members.push(id);
      }
    }
    units.push(members);
  }
  const levels = units.map(ids => Math.max(...ids.map(id => gen[id])));
  const edges = people.flatMap(p => [p.padre, p.madre].filter(id => unitOf.has(id))
    .map(id => [unitOf.get(id), unitOf.get(p.id), 1]));
  const visible = PAPAL_SUCCESSION.filter(id => unitOf.has(id));
  visible.slice(1).forEach((id, i) => edges.push([unitOf.get(visible[i]), unitOf.get(id), 0]));
  // Bounded relaxation also protects custom selections from cyclic data.
  for (let pass = 0; pass <= units.length; pass++) {
    let changed = false;
    for (const [a, b, gap] of edges) if (levels[b] < levels[a] + gap) {
      levels[b] = levels[a] + gap; changed = true;
    }
    if (!changed) {
      units.forEach((ids, i) => ids.forEach(id => { gen[id] = levels[i]; }));
      return;
    }
  }
  // Keep the valid genealogical layout if incompatible institutional constraints occur.
}

export function stackPapalBlueprints(blueprints, gap) {
  const papal = blueprints.filter(unit => unit.ids.some(id => PAPAL_RANK.has(id)));
  if (!papal.length) return blueprints;
  const rank = unit => Math.min(...unit.ids.filter(id => PAPAL_RANK.has(id)).map(id => PAPAL_RANK.get(id)));
  papal.sort((a, b) => rank(a) - rank(b));
  const anchor = unit => { const box = unit.boxes.find(b => PAPAL_RANK.has(b.id)); return box.x + box.w / 2; };
  const left = Math.max(...papal.map(anchor)), right = Math.max(...papal.map(u => u.width - anchor(u)));
  const merged = {ids: [], boxes: [], contacts: {}, width: left + right, height: 0, papalAnchor: left};
  for (const unit of papal) {
    const dx = left - anchor(unit), dy = merged.height;
    merged.ids.push(...unit.ids);
    merged.boxes.push(...unit.boxes.map(box => ({...box, x: box.x + dx, y: box.y + dy})));
    for (const [key, contact] of Object.entries(unit.contacts || {})) merged.contacts[key] = {
      ...contact, points: contact.points.map(([x, y]) => [x + dx, y + dy]),
    };
    merged.height += unit.height + gap;
  }
  merged.height -= gap;
  return [...blueprints.filter(unit => !papal.includes(unit)), merged];
}

export function papalSuccessionPaths(positions) {
  return PAPAL_SUCCESSION.slice(1).flatMap((to, i) => {
    const from = PAPAL_SUCCESSION[i], a = positions[from], b = positions[to];
    if (!a || !b) return [];
    return [{from, to, d: `M ${a.x + a.w / 2} ${a.y + a.h} L ${b.x + b.w / 2} ${b.y}`}];
  });
}
