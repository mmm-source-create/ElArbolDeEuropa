// 6.3.2 · Filas propias para las selecciones del árbol.
// Una selección (una familia, una dinastía, unos grados de parentesco) ya no
// hereda las filas cronológicas del árbol completo. Sus filas se recalculan con
// las personas visibles:
//   - un hijo va siempre por debajo de sus padres y, si nada lo impide, justo
//     una fila por debajo;
//   - los hermanos completos comparten fila;
//   - la pareja comparte fila cuando no rompe lo anterior; si no, se une entre
//     filas (Manuel I de Portugal con María de Aragón y con Leonor, hermana de
//     Carlos V, que están en generaciones distintas);
//   - la cronología solo coloca los grupos sin parentesco visible entre sí.
import {listaParejas, mediana} from './relations.js';
import {buildRows, computeTreeLayout} from './treeLayout.js';

const SIBLING_SPLIT = 8;
const PARTNER_SPLIT = 5;
const EXTRA_SPAN = 3;

export function selectionGenerations(people, byId) {
  const ids = people.map(person => person.id);
  const known = new Set(ids);
  const parents = new Map(ids.map(id => [id, [byId[id]?.padre, byId[id]?.madre].filter(parentId => parentId && parentId !== id && known.has(parentId))]));
  const children = new Map(ids.map(id => [id, []]));
  ids.forEach(id => parents.get(id).forEach(parentId => children.get(parentId).push(id)));
  const partners = new Map(ids.map(id => [id, new Set()]));
  people.forEach(person => listaParejas(person).forEach(partnerId => {
    if (!known.has(partnerId) || partnerId === person.id) return;
    partners.get(person.id).add(partnerId);
    partners.get(partnerId).add(person.id);
  }));

  // Orden topológico por filiación; un ciclo (dato erróneo) no bloquea nada.
  const pending = new Map(ids.map(id => [id, parents.get(id).length]));
  const order = ids.filter(id => !pending.get(id));
  for (let index = 0; index < order.length; index += 1) {
    children.get(order[index]).forEach(childId => {
      pending.set(childId, pending.get(childId) - 1);
      if (!pending.get(childId)) order.push(childId);
    });
  }
  const ordered = new Set(order);
  ids.forEach(id => { if (!ordered.has(id)) order.push(id); });
  const acyclic = id => ordered.has(id);

  const gen = Object.fromEntries(ids.map(id => [id, 0]));
  order.forEach(id => {
    if (!acyclic(id)) return;
    parents.get(id).forEach(parentId => { gen[id] = Math.max(gen[id], gen[parentId] + 1); });
  });

  // Los términos del coste que toca cada persona.
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
  const localCost = changed => {
    let total = 0;
    const groups = new Set();
    const edges = new Set();
    changed.forEach(id => {
      groupsOf.get(id).forEach(key => groups.add(key));
      partners.get(id).forEach(partnerId => edges.add(id < partnerId ? `p:${id}:${partnerId}` : `p:${partnerId}:${id}`));
      parents.get(id).forEach(parentId => edges.add(`c:${parentId}:${id}`));
      children.get(id).forEach(childId => edges.add(`c:${id}:${childId}`));
    });
    groups.forEach(key => { total += groupCost(key); });
    edges.forEach(edge => {
      const [kind, a, b] = edge.split(':');
      if (kind === 'p') total += PARTNER_SPLIT * Math.abs(gen[a] - gen[b]);
      else if (acyclic(a) && acyclic(b)) total += EXTRA_SPAN * Math.max(0, gen[b] - gen[a] - 1);
    });
    return total;
  };

  // Mueve a una persona de fila: los descendientes bajan lo justo para seguir
  // por debajo de sus padres. Devuelve los cambios para poder deshacerlos.
  const apply = (id, target) => {
    const previous = new Map([[id, gen[id]]]);
    gen[id] = target;
    const queue = [id];
    while (queue.length) {
      const current = queue.shift();
      children.get(current).forEach(childId => {
        if (!acyclic(childId) || gen[childId] > gen[current]) return;
        if (!previous.has(childId)) previous.set(childId, gen[childId]);
        gen[childId] = gen[current] + 1;
        queue.push(childId);
      });
    }
    return previous;
  };
  const affected = previous => {
    const set = new Set(previous.keys());
    previous.forEach((_, id) => partners.get(id).forEach(partnerId => set.add(partnerId)));
    return set;
  };

  const limit = Math.max(4, Math.min(24, Math.ceil(40000 / Math.max(1, ids.length))));
  for (let round = 0; round < limit; round += 1) {
    let improved = false;
    order.forEach(id => {
      if (!acyclic(id)) return;
      const floor = Math.max(0, ...parents.get(id).map(parentId => gen[parentId] + 1));
      const candidates = new Set();
      partners.get(id).forEach(partnerId => candidates.add(gen[partnerId]));
      groupsOf.get(id).forEach(key => siblingGroups.get(key).forEach(siblingId => candidates.add(gen[siblingId])));
      if (children.get(id).length) candidates.add(Math.min(...children.get(id).map(childId => gen[childId])) - 1);
      candidates.add(floor);
      candidates.delete(gen[id]);
      [...candidates].filter(target => target >= floor).sort((a, b) => a - b).forEach(target => {
        if (target === gen[id]) return;
        const trial = apply(id, target);
        const scope = affected(trial);
        const newCost = localCost(scope);
        trial.forEach((value, changedId) => { gen[changedId] = value; });
        if (newCost < localCost(scope)) {
          apply(id, target);
          improved = true;
        }
      });
    });
    if (!improved) break;
  }

  alignComponentsByChronology(people, gen, parents, partners);
  const min = Math.min(...Object.values(gen));
  if (Number.isFinite(min) && min) ids.forEach(id => { gen[id] -= min; });
  return gen;
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
    const dated = exact.length ? exact : component.filter(id => Number.isFinite(byId[id].nac));
    return mediana(dated.map(id => byId[id].nac - gen[id] * span));
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

export function layoutSelection(people, byId, childrenById) {
  const gen = selectionGenerations(people, byId);
  const rows = buildRows(people, gen, {crossPartners: true, isolatedLast: true, swapLimit: SELECTION_SWAP_LIMIT});
  const layout = computeTreeLayout(rows, byId, childrenById);
  return {gen, rows, layout: {...layout, crossPartners: crossRowPartners(people, gen)}};
}
