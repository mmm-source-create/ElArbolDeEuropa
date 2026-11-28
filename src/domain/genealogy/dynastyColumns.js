// 6.3.3 · Columnas por dinastía.
// Las personas de una misma casa se agrupan en una franja vertical del árbol,
// de modo que en el minimapa se ve qué casa ocupa cada zona. Un matrimonio va a
// la columna del marido: su descendencia continúa su casa. Las casas con más
// vínculos entre sí quedan contiguas.
import {PAPAL_RANK, PAPAL_COLUMN} from './papalSuccession.js';
import {listaParejas} from './relations.js';
import {isNamedDynasty} from '../../data/dynastyNames.js';
import {getCategoriaDinastía} from './dynasties.js';

const FEMALE = /\b(reina|princesa|duquesa|condesa|infanta|emperatriz|archiduquesa|marquesa|señora|abadesa|landgravina|electora|margravina|zarina|sultana|dama|baronesa|vizcondesa|gran duquesa|santa|monja|priora|dogaresa|amante|favorita|esposa|hija|madre|consorte femenina)\b/i;
const MALE = /\b(rey|príncipe|duque|conde|infante|emperador|archiduque|marqués|señor|abad|landgrave|elector|margrave|zar|sultán|barón|vizconde|gran duque|papa|cardenal|obispo|arzobispo|dux|dogo|condestable|caballero|hijo|padre)\b/i;

export function inferSex(people) {
  const sex = new Map();
  people.forEach(person => {
    if (person.padre) sex.set(person.padre, 'm');
    if (person.madre) sex.set(person.madre, 'f');
  });
  people.forEach(person => {
    if (sex.has(person.id)) return;
    const title = person.titulo || '';
    if (FEMALE.test(title) && !MALE.test(title)) sex.set(person.id, 'f');
    else if (MALE.test(title) && !FEMALE.test(title)) sex.set(person.id, 'm');
  });
  // La pareja de una persona de sexo conocido.
  for (let pass = 0; pass < 2; pass += 1) people.forEach(person => {
    if (sex.has(person.id)) return;
    const known = listaParejas(person).map(id => sex.get(id)).filter(Boolean);
    if (known.length) sex.set(person.id, known[0] === 'm' ? 'f' : 'm');
  });
  return sex;
}

// Devuelve, para cada persona visible, el índice de la columna de su unidad
// (ella y sus parejas en la misma fila), o null si no tiene casa ni parientes
// con casa.
export function dynastyColumns(people, gen) {
  const known = new Set(people.map(person => person.id));
  const byId = new Map(people.map(person => [person.id, person]));
  const sex = inferSex(people);
  const children = new Map(people.map(person => [person.id, []]));
  people.forEach(person => [person.padre, person.madre].forEach(parentId => { if (known.has(parentId)) children.get(parentId).push(person.id); }));

  // Unidades: componentes de pareja en la misma fila.
  const unitOf = new Map();
  const units = [];
  people.forEach(person => {
    if (unitOf.has(person.id)) return;
    const members = [person.id];
    unitOf.set(person.id, units.length);
    for (let k = 0; k < members.length; k += 1) listaParejas(byId.get(members[k])).forEach(other => {
      if (known.has(other) && !unitOf.has(other) && gen[other] === gen[members[k]]) { unitOf.set(other, units.length); members.push(other); }
    });
    units.push(members);
  });

  const named = id => isNamedDynasty(byId.get(id)?.dinastia) ? byId.get(id).dinastia : null;
  const visibleChildren = id => children.get(id).length;
  const anchorDynasty = members => {
    if (members.some(id => PAPAL_RANK.has(id))) return PAPAL_COLUMN;
    const men = members.filter(id => sex.get(id) === 'm' && named(id));
    const pool = men.length ? men : members.filter(named);
    if (!pool.length) return null;
    return named(pool.slice().sort((a, b) => visibleChildren(b) - visibleChildren(a))[0]);
  };
  const unitDynasty = units.map(anchorDynasty);

  // Sin casa: hereda la de la unidad de sus padres; si no, la de sus hijos.
  const parentUnits = u => [...new Set(units[u].flatMap(id => [byId.get(id).padre, byId.get(id).madre]).filter(id => known.has(id)).map(id => unitOf.get(id)))];
  const childUnits = u => [...new Set(units[u].flatMap(id => children.get(id)).map(id => unitOf.get(id)))];
  const byGen = units.map((members, u) => u).sort((a, b) => gen[units[a][0]] - gen[units[b][0]]);
  byGen.forEach(u => { if (!unitDynasty[u]) unitDynasty[u] = parentUnits(u).map(p => unitDynasty[p]).find(d => d && d !== PAPAL_COLUMN) || null; });
  byGen.slice().reverse().forEach(u => { if (!unitDynasty[u]) unitDynasty[u] = childUnits(u).map(c => unitDynasty[c]).find(d => d && d !== PAPAL_COLUMN) || null; });

  // Orden de las columnas: cadena voraz por vínculos padre–hijo, primero entre
  // casas principales (las ramas comparten color en el minimapa) y después
  // entre las ramas de cada una.
  const pairs = [];
  units.forEach((members, u) => parentUnits(u).forEach(p => {
    const a = unitDynasty[u], b = unitDynasty[p];
    if (a && b && a !== b) pairs.push([a, b]);
  }));
  const size = new Map();
  unitDynasty.forEach((dynasty, u) => { if (dynasty) size.set(dynasty, (size.get(dynasty) || 0) + units[u].length); });
  const category = d => getCategoriaDinastía(d);
  const categorySize = new Map();
  size.forEach((n, d) => categorySize.set(category(d), (categorySize.get(category(d)) || 0) + n));
  const categoryOrder = chainOrder([...categorySize.keys()], categorySize, pairs.map(([a, b]) => [category(a), category(b)]));
  const chain = categoryOrder.flatMap(c => {
    const members = [...size.keys()].filter(d => category(d) === c);
    return chainOrder(members, size, pairs.filter(([a, b]) => category(a) === c && category(b) === c));
  });
  const ordered = [...chain.filter(d => d !== PAPAL_COLUMN), ...(chain.includes(PAPAL_COLUMN) ? [PAPAL_COLUMN] : [])];
  const column = new Map(ordered.map((dynasty, index) => [dynasty, index]));
  return new Map(people.map(person => {
    const dynasty = unitDynasty[unitOf.get(person.id)];
    return [person.id, dynasty ? column.get(dynasty) : null];
  }));
}

// Cadena voraz: empieza por el elemento mayor y añade por cualquiera de los
// dos extremos el más unido a ese extremo. Lo inconexo sigue por tamaño.
function chainOrder(items, size, pairs) {
  const weight = new Map();
  pairs.forEach(([a, b]) => {
    if (a === b) return;
    const key = a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
    weight.set(key, (weight.get(key) || 0) + 1);
  });
  const w = (a, b) => weight.get(a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`) || 0;
  const remaining = new Set(items);
  const bySize = items.slice().sort((a, b) => size.get(b) - size.get(a) || String(a).localeCompare(String(b)));
  const chain = [];
  while (remaining.size) {
    const start = bySize.find(d => remaining.has(d));
    const piece = [start];
    remaining.delete(start);
    for (;;) {
      let best = null, bestScore = 0, side = 'right';
      remaining.forEach(d => {
        const left = w(d, piece[0]), right = w(d, piece[piece.length - 1]);
        const score = Math.max(left, right);
        if (score > bestScore || score === bestScore && score > 0 && size.get(d) > size.get(best)) { best = d; bestScore = score; side = right >= left ? 'right' : 'left'; }
      });
      if (!best) break;
      if (side === 'right') piece.push(best); else piece.unshift(best);
      remaining.delete(best);
    }
    chain.push(...piece);
  }
  return chain;
}
