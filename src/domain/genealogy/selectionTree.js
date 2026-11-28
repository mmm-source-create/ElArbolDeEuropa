// 6.3.2 · Filas propias para las selecciones del árbol.
// 6.3.3 · El mismo cálculo sirve para el árbol completo precalculado.
// Las filas se calculan con las personas visibles:
//   - un matrimonio comparte siempre fila: la pareja (con todas sus parejas)
//     forma un bloque que se mueve entero;
//   - un hijo va siempre por debajo de sus padres y, si nada lo impide, justo
//     una fila por debajo;
//   - los hermanos completos comparten fila cuando el matrimonio lo permite;
//   - cada fila corresponde aproximadamente a una generación de ~28 años: quien
//     encabeza una línea sin padres registrados se coloca en la fila de su
//     fecha, no arriba del todo, y no deja una línea vertical de decenas de filas.
// Solo si una pareja es imposible en la misma fila (un dato que la haría
// antepasada de sí misma) se une entre filas con una línea discontinua.
import {listaParejas, mediana} from './relations.js';
import {buildRows, computeTreeLayout} from './treeLayout.js';
import {alignPapalGenerations} from './papalSuccession.js';
import {dynastyColumns} from './dynastyColumns.js';

const SIBLING_SPLIT = 8;

// Año de referencia para la fila: el nacimiento; si falta, uno aproximado a
// partir del primer gobierno o de la muerte.
export function referenceYear(person) {
  if (Number.isFinite(person?.nac)) return {year: person.nac, approximate: Boolean(person.nacAprox)};
  const starts = (person?.gobiernos || []).map(g => g.desde).filter(Number.isFinite);
  if (starts.length) return {year: Math.min(...starts) - 25, approximate: true};
  if (Number.isFinite(person?.muer)) return {year: person.muer - 55, approximate: true};
  return null;
}
const EXTRA_SPAN = 3;
const CHRONOLOGY = 1;

export function selectionGenerations(people, byId) {
  const ids = people.map(person => person.id);
  const known = new Set(ids);
  const person = id => byId[id] || people.find(p => p.id === id);
  const parents = new Map(ids.map(id => [id, [person(id)?.padre, person(id)?.madre].filter(parentId => parentId && parentId !== id && known.has(parentId))]));
  const children = new Map(ids.map(id => [id, []]));
  ids.forEach(id => parents.get(id).forEach(parentId => children.get(parentId).push(id)));
  const partners = new Map(ids.map(id => [id, new Set()]));
  people.forEach(p => listaParejas(p).forEach(partnerId => {
    if (!known.has(partnerId) || partnerId === p.id) return;
    partners.get(p.id).add(partnerId);
    partners.get(partnerId).add(p.id);
  }));

  // Bloques de pareja. Un bloque que contendría a un antepasado y a su
  // descendiente es imposible: sus miembros quedan sueltos.
  const blockOf = new Map();
  const buildBlocks = (separate) => {
    blockOf.clear();
    const blocks = [];
    ids.forEach(id => {
      if (blockOf.has(id)) return;
      const members = [id];
      blockOf.set(id, blocks.length);
      if (!separate.has(id)) for (let k = 0; k < members.length; k += 1) partners.get(members[k]).forEach(other => {
        if (!blockOf.has(other) && !separate.has(other)) { blockOf.set(other, blocks.length); members.push(other); }
      });
      blocks.push(members);
    });
    return blocks;
  };
  let separate = new Set();
  let blocks, order, blockParents, blockChildren;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    blocks = buildBlocks(separate);
    blockParents = blocks.map(() => new Set());
    blockChildren = blocks.map(() => new Set());
    blocks.forEach((members, b) => members.forEach(id => parents.get(id).forEach(parentId => {
      const pb = blockOf.get(parentId);
      if (pb !== b) { blockParents[b].add(pb); blockChildren[pb].add(b); }
    })));
    const pending = blockParents.map(set => set.size);
    order = blocks.map((_, b) => b).filter(b => !pending[b]);
    for (let k = 0; k < order.length; k += 1) blockChildren[order[k]].forEach(c => { pending[c] -= 1; if (!pending[c]) order.push(c); });
    if (order.length === blocks.length) break;
    const placed = new Set(order);
    const stuck = blocks.flatMap((members, b) => placed.has(b) || members.length < 2 ? [] : members);
    if (!stuck.length) break;
    stuck.forEach(id => separate.add(id));
  }
  const ordered = new Set(order);
  blocks.forEach((_, b) => { if (!ordered.has(b)) order.push(b); });
  const acyclic = b => ordered.has(b);

  const blockGen = blocks.map(() => 0);
  order.forEach(b => { if (acyclic(b)) blockParents[b].forEach(pb => { blockGen[b] = Math.max(blockGen[b], blockGen[pb] + 1); }); });
  const gen = new Proxy({}, {get: (_, id) => blockGen[blockOf.get(id)]});

  // Ritmo generacional y fila esperada por fecha de nacimiento.
  const gaps = [];
  ids.forEach(id => parents.get(id).forEach(parentId => {
    const gap = person(id).nac - person(parentId).nac;
    if (Number.isFinite(gap) && gap >= 14 && gap <= 65) gaps.push(gap);
  }));
  const span = Math.max(22, Math.min(35, mediana(gaps) || 28));
  const dated = ids.filter(id => Number.isFinite(person(id)?.nac) && !person(id).nacAprox);
  const originOf = () => mediana(dated.map(id => person(id).nac - gen[id] * span));
  let origin = originOf();
  const reference = new Map(ids.map(id => [id, referenceYear(person(id))]));
  const expected = id => Number.isFinite(origin) && reference.get(id) ? (reference.get(id).year - origin) / span : null;

  const siblingGroups = new Map();
  ids.forEach(id => {
    const own = parents.get(id);
    if (!own.length) return;
    const key = own.slice().sort().join('|');
    if (!siblingGroups.has(key)) siblingGroups.set(key, []);
    siblingGroups.get(key).push(id);
  });
  const groupsOf = new Map(ids.map(id => [id, []]));
  siblingGroups.forEach((members, key) => { if (members.length > 1) members.forEach(id => groupsOf.get(id).push(key)); });
  const groupCost = key => {
    const members = siblingGroups.get(key);
    const counts = new Map();
    members.forEach(id => counts.set(gen[id], (counts.get(gen[id]) || 0) + 1));
    return SIBLING_SPLIT * (members.length - Math.max(...counts.values()));
  };
  const localCost = changedBlocks => {
    let total = 0;
    const groups = new Set();
    const edges = new Set();
    changedBlocks.forEach(b => blocks[b].forEach(id => {
      groupsOf.get(id).forEach(key => groups.add(key));
      parents.get(id).forEach(parentId => edges.add(`${parentId}>${id}`));
      children.get(id).forEach(childId => edges.add(`${id}>${childId}`));
      const e = expected(id);
      if (e !== null) total += CHRONOLOGY * Math.abs(gen[id] - e) * (reference.get(id).approximate ? 0.5 : 1);
    }));
    groups.forEach(key => { total += groupCost(key); });
    edges.forEach(edge => {
      const [a, b] = edge.split('>');
      if (acyclic(blockOf.get(a)) && acyclic(blockOf.get(b))) total += EXTRA_SPAN * Math.max(0, gen[b] - gen[a] - 1);
    });
    return total;
  };

  // Mueve un bloque; sus descendientes bajan lo justo. Devuelve lo cambiado.
  const apply = (b, target) => {
    const previous = new Map([[b, blockGen[b]]]);
    blockGen[b] = target;
    const queue = [b];
    while (queue.length) {
      const current = queue.shift();
      blockChildren[current].forEach(c => {
        if (!acyclic(c) || blockGen[c] > blockGen[current]) return;
        if (!previous.has(c)) previous.set(c, blockGen[c]);
        blockGen[c] = blockGen[current] + 1;
        queue.push(c);
      });
    }
    return previous;
  };

  const optimise = rounds => {
    for (let round = 0; round < rounds; round += 1) {
      let improved = false;
      order.forEach(b => {
        if (!acyclic(b)) return;
        const floor = Math.max(-Infinity, ...[...blockParents[b]].map(pb => blockGen[pb] + 1));
        const candidates = new Set();
        blocks[b].forEach(id => {
          groupsOf.get(id).forEach(key => siblingGroups.get(key).forEach(other => candidates.add(gen[other])));
          const e = expected(id);
          if (e !== null) candidates.add(Math.round(e));
        });
        // Justo encima de cada hijo: los demás hijos bajan con él si compensa.
        blockChildren[b].forEach(c => candidates.add(blockGen[c] - 1));
        if (Number.isFinite(floor)) candidates.add(floor);
        candidates.delete(blockGen[b]);
        [...candidates].filter(target => !(target < floor)).sort((x, y) => x - y).forEach(target => {
          if (target === blockGen[b]) return;
          const trial = apply(b, target);
          const scope = new Set(trial.keys());
          const newCost = localCost(scope);
          trial.forEach((value, changed) => { blockGen[changed] = value; });
          if (newCost < localCost(scope) - 1e-9) { apply(b, target); improved = true; }
        });
      });
      // Un grupo de hermanos se mueve entero: uno a uno nunca compensa.
      siblingGroups.forEach(members => {
        if (members.length < 2) return;
        const memberBlocks = [...new Set(members.map(id => blockOf.get(id)))].filter(acyclic);
        new Set(members.map(id => gen[id])).forEach(target => {
          if (memberBlocks.every(b => blockGen[b] === target)) return;
          const floorOk = memberBlocks.every(b => [...blockParents[b]].every(pb => blockGen[pb] + 1 <= target));
          if (!floorOk) return;
          const before = new Map();
          memberBlocks.forEach(b => apply(b, target).forEach((value, changed) => { if (!before.has(changed)) before.set(changed, value); }));
          const scope = new Set(before.keys());
          const newCost = localCost(scope);
          const after = new Map([...scope].map(b => [b, blockGen[b]]));
          before.forEach((value, changed) => { blockGen[changed] = value; });
          if (newCost < localCost(scope) - 1e-9) { after.forEach((value, changed) => { blockGen[changed] = value; }); improved = true; }
        });
      });
      if (!improved) break;
    }
  };
  const rounds = Math.max(3, Math.min(16, Math.ceil(30000 / Math.max(1, ids.length))));
  optimise(rounds);
  origin = originOf();
  optimise(2);

  // Una cabeza de línea sin fecha baja hasta justo encima de su hijo más alto:
  // de abajo arriba, para que una cadena entera de antepasados sin fecha baje.
  // Solo se mueve una línea sin ninguna fecha por encima: si un antepasado
  // tiene fecha, el hueco se quedaría igual, solo cambiaría de sitio.
  const undated = b => blocks[b].every(id => !reference.get(id));
  const undatedLine = new Map();
  order.forEach(b => undatedLine.set(b, undated(b) && [...blockParents[b]].every(pb => undatedLine.get(pb))));
  order.slice().reverse().forEach(b => {
    if (!acyclic(b) || !undatedLine.get(b) || !blockChildren[b].size) return;
    const target = Math.min(...[...blockChildren[b]].map(c => blockGen[c])) - 1;
    if (target > blockGen[b]) blockGen[b] = target;
  });

  const result = Object.fromEntries(ids.map(id => [id, gen[id]]));
  alignComponentsByChronology(people, result, parents, partners);
  const min = Math.min(...Object.values(result));
  if (Number.isFinite(min) && min) ids.forEach(id => { result[id] -= min; });
  return result;
}

// Grupos sin parentesco visible entre sí: cada uno se desplaza en bloque a la
// fila de sus coetáneos. Dentro de un grupo solo manda la genealogía.
function alignComponentsByChronology(people, gen, parents, partners) {
  const byId = Object.fromEntries(people.map(person => [person.id, person]));
  const spans = [];
  people.forEach(person => parents.get(person.id).forEach(parentId => {
    const gap = person.nac - byId[parentId].nac;
    if (Number.isFinite(gap) && gap >= 14 && gap <= 65) spans.push(gap / Math.max(1, gen[person.id] - gen[parentId]));
  }));
  const span = Math.max(20, Math.min(35, mediana(spans) || 28));

  const neighbours = id => [...parents.get(id), ...partners.get(id)];
  const adjacency = new Map(people.map(person => [person.id, new Set()]));
  people.forEach(person => neighbours(person.id).forEach(other => {
    adjacency.get(person.id).add(other);
    adjacency.get(other).add(person.id);
  }));
  const seen = new Set();
  const components = [];
  people.forEach(person => {
    if (seen.has(person.id)) return;
    const component = [];
    const queue = [person.id];
    seen.add(person.id);
    while (queue.length) {
      const current = queue.shift();
      component.push(current);
      adjacency.get(current).forEach(other => { if (!seen.has(other)) { seen.add(other); queue.push(other); } });
    }
    components.push(component);
  });
  if (components.length < 2) return;
  components.sort((a, b) => b.length - a.length);
  const origin = component => {
    const exact = component.filter(id => Number.isFinite(byId[id].nac) && !byId[id].nacAprox);
    if (exact.length) return mediana(exact.map(id => byId[id].nac - gen[id] * span));
    const approximate = component.filter(id => referenceYear(byId[id]));
    return mediana(approximate.map(id => referenceYear(byId[id]).year - gen[id] * span));
  };
  const reference = origin(components[0]);
  if (!Number.isFinite(reference)) return;
  components.slice(1).forEach(component => {
    const own = origin(component);
    if (!Number.isFinite(own)) return;
    const shift = Math.round((own - reference) / span);
    if (shift) component.forEach(id => { gen[id] += shift; });
  });
}

// Parejas visibles que quedan en filas distintas: se dibujan con una unión
// entre filas.
export function crossRowPartners(people, gen) {
  const known = new Set(people.map(person => person.id));
  const pairs = [];
  const seen = new Set();
  people.forEach(person => listaParejas(person).forEach(partnerId => {
    if (!known.has(partnerId) || gen[partnerId] === gen[person.id]) return;
    const key = person.id < partnerId ? `${person.id}|${partnerId}` : `${partnerId}|${person.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    const [upper, lower] = gen[person.id] < gen[partnerId] ? [person.id, partnerId] : [partnerId, person.id];
    pairs.push({key, upper, lower});
  }));
  return pairs;
}

// Hasta este tamaño la selección se ordena con sus propias filas; por encima
// (casi el árbol completo) hereda el orden precalculado de la base.
export const SELECTION_TREE_LIMIT = 1500;
const SELECTION_SWAP_LIMIT = 250;

export function layoutSelection(people, byId, childrenById, {swapLimit = SELECTION_SWAP_LIMIT} = {}) {
  const gen = selectionGenerations(people, byId);
  alignPapalGenerations(people, gen, listaParejas);
  const columnOf = dynastyColumns(people, gen);
  const rows = buildRows(people, gen, {crossPartners: true, isolatedLast: true, swapLimit, columnOf});
  const layout = computeTreeLayout(rows, byId, childrenById, {columnOf});
  return {gen, rows, columns: Object.fromEntries(columnOf), layout: {...layout, crossPartners: crossRowPartners(people, gen)}};
}
