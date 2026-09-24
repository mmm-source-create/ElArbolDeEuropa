import { computeTreeLayout, routeFamilyConnectors, splitPartnerComponents } from '../explorer/treeLayout.js';
import { computeParentGroups } from '../explorer/relationshipGraph.js';

export const LAB_SIZES = [14, 100, 500, 2337];
const SEED = 'CARLOS5';

export function relatedIds(people, count) {
  if (count >= people.length) return people.map(person => person.id);
  const byId = Object.fromEntries(people.map(person => [person.id, person]));
  const neighbors = Object.fromEntries(people.map(person => [person.id, new Set()]));
  for (const person of people) {
    for (const id of [person.padre, person.madre, person.conyuge, person.conyuge2, ...(person.conyuges || [])]) {
      if (id && byId[id]) { neighbors[person.id].add(id); neighbors[id].add(person.id); }
    }
  }
  const queue = [SEED], seen = new Set(queue);
  for (let index = 0; index < queue.length && queue.length < count; index++) {
    for (const id of neighbors[queue[index]] || []) {
      if (!seen.has(id)) { seen.add(id); queue.push(id); if (queue.length === count) break; }
    }
  }
  for (const person of people) {
    if (queue.length === count) break;
    if (!seen.has(person.id)) queue.push(person.id);
  }
  return queue;
}

export function buildScene(base, people, selectedIds, childrenById) {
  const byId = Object.fromEntries(people.map(person => [person.id, person]));
  const selected = new Set(selectedIds);
  const subset = selectedIds.map(id => byId[id]).filter(Boolean);
  const rows = base.rows.map(row => row.flatMap(unit => {
    const ids = unit.filter(id => selected.has(id));
    return ids.length ? splitPartnerComponents(ids, byId) : [];
  }));
  const positionStart = performance.now();
  const layout = selectedIds.length === people.length ? base.layout : computeTreeLayout(rows, byId, childrenById);
  const positionMs = performance.now() - positionStart;
  const connectionStart = performance.now();
  const routing = routeFamilyConnectors({
    groupsByRow: computeParentGroups(subset, base.gen), positions: layout.positions,
    pairContacts: layout.pairContacts, gen: base.gen, rows, rowBands: layout.rowBands,
    canvasWidth: layout.width,
  });
  const connectionMs = performance.now() - connectionStart;
  const boxes = selectedIds.flatMap(id => {
    const rect = layout.positions[id];
    return rect ? [{ ...rect, id, person: byId[id] }] : [];
  });
  const paths = routing.families.flatMap(family => [family.trunkD, ...family.busDs, ...family.branches.map(branch => branch.d)].filter(Boolean));
  return { boxes, paths, width: layout.width, height: layout.height, positionMs, connectionMs };
}

export function visibleBoxes(boxes, camera, width, height) {
  const right = camera.x + width / camera.zoom;
  const bottom = camera.y + height / camera.zoom;
  return boxes.filter(box => box.x < right && box.x + box.w > camera.x && box.y < bottom && box.y + box.h > camera.y);
}

export function hitTest(boxes, x, y) {
  for (let i = boxes.length - 1; i >= 0; i--) {
    const box = boxes[i];
    if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) return box;
  }
  return null;
}

export function screenToWorld(clientX, clientY, rect, camera) {
  return {
    x: camera.x + (clientX - rect.left) / camera.zoom,
    y: camera.y + (clientY - rect.top) / camera.zoom,
  };
}
