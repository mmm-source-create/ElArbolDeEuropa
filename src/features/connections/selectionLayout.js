import {TREE_BOX_W,TREE_BOX_H,TREE_SELECTION_COLUMN,TREE_SELECTION_ROW} from '../../domain/genealogy/treeMetrics.js';
// Layout for small selections (Conectar, export). Generations are computed from
// the selected relations themselves: a child sits one row below a parent and
// partners share a row. The base tree's global generation numbers place
// contemporaries several levels apart, so they only break ties.
const GENERATION_YEARS = 30;

function relationDelta(edge, byId, gen) {
  if (edge.type !== 'sangre') return 0;
  const isParent = (parent, child) => byId[child]?.padre === parent || byId[child]?.madre === parent;
  if (isParent(edge.from, edge.to)) return 1;
  if (isParent(edge.to, edge.from)) return -1;
  const a = byId[edge.from]?.nac, b = byId[edge.to]?.nac;
  if (Number.isFinite(a) && Number.isFinite(b) && a !== b) return a < b ? 1 : -1;
  return (gen[edge.from] ?? 0) <= (gen[edge.to] ?? 0) ? 1 : -1;
}

function selectionGenerations(ids, gen = {}, byId = {}, edges = []) {
  const selected = new Set(ids), links = new Map(ids.map(id => [id, []]));
  for (const edge of edges) {
    if (!selected.has(edge.from) || !selected.has(edge.to) || edge.from === edge.to) continue;
    const delta = relationDelta(edge, byId, gen);
    links.get(edge.from).push([edge.to, delta]);
    links.get(edge.to).push([edge.from, -delta]);
  }
  // Breadth-first per connected group; a contradictory relation keeps the first level found.
  const level = new Map(), groups = [];
  for (const start of ids) {
    if (level.has(start)) continue;
    const group = [start];
    level.set(start, 0);
    for (let i = 0; i < group.length; i++)
      for (const [next, delta] of links.get(group[i])) if (!level.has(next)) { level.set(next, level.get(group[i]) + delta); group.push(next); }
    groups.push(group);
  }
  // Unconnected groups line up by the birth years of their members; without
  // dates they keep the base tree's order.
  const anchors = groups.map(group => {
    const min = Math.min(...group.map(id => level.get(id)));
    const years = group.map(id => Number.isFinite(byId[id]?.nac) ? byId[id].nac - (level.get(id) - min) * GENERATION_YEARS : null).filter(Number.isFinite);
    return {group, min, year: years.length ? years.reduce((a, b) => a + b, 0) / years.length : null,
      base: Math.min(...group.map(id => gen[id] ?? 0))};
  });
  const dated = anchors.filter(a => a.year !== null), earliest = dated.length ? Math.min(...dated.map(a => a.year)) : 0;
  const undated = [...new Set(anchors.filter(a => a.year === null).map(a => a.base))].sort((a, b) => a - b);
  const result = {};
  for (const anchor of anchors) {
    const offset = anchor.year !== null ? Math.round((anchor.year - earliest) / GENERATION_YEARS) : undated.indexOf(anchor.base);
    for (const id of anchor.group) result[id] = level.get(id) - anchor.min + offset;
  }
  // Compact empty generations.
  const used = [...new Set(Object.values(result))].sort((a, b) => a - b);
  for (const id of ids) result[id] = used.indexOf(result[id]);
  return {levels: result, links};
}

export function selectionLayout(ids, gen = {}, byId = {}, edges = []) {
  const {levels, links} = selectionGenerations(ids, gen, byId, edges);
  const birth = id => byId[id]?.nac ?? 9999;
  const byBirth = (a, b) => birth(a) - birth(b) || a.localeCompare(b);
  const rowCount = Math.max(0, ...Object.values(levels)) + 1;
  const rows = Array.from({length: rowCount}, (_, row) => ids.filter(id => levels[id] === row));
  // Barycentre ordering: each row follows the mean column of its relatives in
  // the neighbouring row (parents going down, children going up). Partners stay
  // side by side. Three sweeps settle the small trees used here.
  const column = new Map();
  const setColumns = row => row.forEach((id, i) => column.set(id, i - (row.length - 1) / 2));
  const mean = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  const relatives = (id, delta) => links.get(id).filter(([other, d]) => d === delta && column.has(other)).map(([other]) => column.get(other));
  const orderRow = (row, index, delta) => {
    const keys = new Map(row.map(id => [id, mean(relatives(id, delta))]));
    for (const id of row) if (keys.get(id) === null) {
      const partners = links.get(id).filter(([other, d]) => d === 0 && keys.get(other) != null).map(([other]) => keys.get(other));
      keys.set(id, mean(partners) ?? (column.has(id) ? column.get(id) : null));
    }
    const sorted = [...row].sort((a, b) => (keys.get(a) ?? Infinity) - (keys.get(b) ?? Infinity) || byBirth(a, b));
    const placed = new Set(), ordered = [];
    for (const id of sorted) {
      if (placed.has(id)) continue;
      const partners = links.get(id).filter(([other, d]) => d === 0 && levels[other] === index && !placed.has(other)).map(([other]) => other);
      // A partner with relatives further left goes first, so lines do not cross the couple.
      const group = [id, ...partners].sort((a, b) => (keys.get(a) ?? Infinity) - (keys.get(b) ?? Infinity) || byBirth(a, b));
      for (const member of group) { ordered.push(member); placed.add(member); }
    }
    return ordered;
  };
  rows.forEach((row, index) => { rows[index] = orderRow(row, index, -1); setColumns(rows[index]); });
  for (let sweep = 0; sweep < 3; sweep++) {
    for (let index = rows.length - 2; index >= 0; index--) { rows[index] = orderRow(rows[index], index, 1); setColumns(rows[index]); }
    for (let index = 1; index < rows.length; index++) { rows[index] = orderRow(rows[index], index, -1); setColumns(rows[index]); }
  }
  const width = Math.max(720, ...rows.map(r => r.length * TREE_SELECTION_COLUMN + 160)), positions = {}, units = [];
  rows.forEach((row, ri) => row.forEach((id, ci) => {
    const p = {x: 100 + (width - 200 - row.length * TREE_SELECTION_COLUMN) / 2 + ci * TREE_SELECTION_COLUMN, y: 100 + ri * TREE_SELECTION_ROW, w: TREE_BOX_W, h: TREE_BOX_H, row: ri};
    positions[id] = p;
    units.push({key: id, ids: [id], x: p.x, y: p.y, width: p.w, height: p.h, boxes: [{id, x: 0, y: 0, w: p.w, h: p.h}]});
  }));
  return {positions, units, width, height: Math.max(400, rows.length * TREE_SELECTION_ROW + 120), pairContacts: {}, rowBands: rows.map((_, i) => [100 + i * TREE_SELECTION_ROW, 100 + i * TREE_SELECTION_ROW + TREE_BOX_H])};
}
export function selectionEdges(graph,ids) {
 const selected=new Set(ids),edges=[];
 for(const from of [...selected].sort())for(const e of graph[from]||[])if(selected.has(e.id)&&from<e.id){
  const type=e.tipos.includes('sangre')?'sangre':e.tipos.includes('matrimonio')?'matrimonio':e.tipos.includes('amante')?'amante':null;
  if(type)edges.push({from,to:e.id,type});
 }
 return edges;
}
export function edgePath(edge, positions, index=0) {
 let a=positions[edge.from],b=positions[edge.to];if(!a||!b)return '';
 if(a.row>b.row)[a,b]=[b,a];
 const ax=a.x+a.w/2,bx=b.x+b.w/2;
 if(a.row===b.row){
  // Partners side by side join at mid-height; distant ones arc above the cards.
  const [left,right]=a.x<b.x?[a,b]:[b,a];
  if(right.x-(left.x+left.w)<=40)return `M ${left.x+left.w} ${left.y+left.h/2} H ${right.x}`;
  const y=a.y-14-(index%5)*7;
  return `M ${ax} ${a.y} V ${y} H ${bx} V ${b.y}`;
 }
 if(b.row-a.row>1){const x=20+(index%8)*7;return `M ${a.x} ${a.y+a.h/2} H ${x} V ${b.y+b.h/2} H ${b.x}`;}
 const y=(a.y+a.h+b.y)/2;
 return `M ${ax} ${a.y+a.h} V ${y} H ${bx} V ${b.y}`;
}
