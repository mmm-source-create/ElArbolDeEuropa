import { BY_ID, clavePareja, listaParejas, mediana } from "./model.js";

export const TREE_BOX_W = 190;
export const TREE_BOX_H = 70;
export const TREE_MINI_MIN_H = 28;
export const TREE_UNIT_GAP = 112;
export const TREE_ROW_GAP = 190;
export const TREE_PAD_X = 92;
export const TREE_PAD_TOP = 38;
export const TREE_PAD_BOTTOM = 64;
export const TREE_ROW_STEP = TREE_BOX_H + TREE_ROW_GAP;
export const TREE_COLUMN_STEP = 14;
export const TREE_PARTNER_EXIT_BASE = 14;
export const TREE_PARTNER_EXIT_STEP = 10;

export function computeGenerations(people) {
  const knownIds = new Set(people.map((persona) => persona.id));
  const gen = Object.fromEntries(people.map((persona) => [persona.id, 0]));
  const maxPasses = Math.max(40, people.length + 5);

  const relaxConstraints = () => {
    let changed = true;
    let guard = 0;
    while (changed && guard < maxPasses) {
      changed = false;

      people.forEach((persona) => {
        let nextGen = gen[persona.id];
        [persona.padre, persona.madre].forEach((parentId) => {
          if (knownIds.has(parentId)) nextGen = Math.max(nextGen, gen[parentId] + 1);
        });
        if (nextGen !== gen[persona.id]) {
          gen[persona.id] = nextGen;
          changed = true;
        }
      });

      // Matrimonios y relaciones de amantes se representan en la misma fila.
      people.forEach((persona) => {
        listaParejas(persona).forEach((partnerId) => {
          if (!knownIds.has(partnerId)) return;
          const sharedGen = Math.max(gen[persona.id], gen[partnerId]);
          if (gen[persona.id] !== sharedGen) {
            gen[persona.id] = sharedGen;
            changed = true;
          }
          if (gen[partnerId] !== sharedGen) {
            gen[partnerId] = sharedGen;
            changed = true;
          }
        });
      });

      guard += 1;
    }
    return changed;
  };

  // Primero respetamos exclusivamente la genealogía conocida.
  let hitGuard = relaxConstraints();

  // Las personas sin padres registrados ya no se amontonan automáticamente
  // en la primera fila. Estimamos el ritmo generacional real de la propia
  // base (mediana de la diferencia padre/madre -> hijo) y situamos cada
  // componente de pareja sin ascendencia conocida cerca de sus coetáneos.
  // Esto solo eleva raíces desconectadas: nunca mueve a un hijo por encima de
  // sus progenitores ni separa cónyuges/amantes de su misma fila.
  const parentAgeGaps = [];
  people.forEach((persona) => {
    if (!Number.isFinite(persona.nac)) return;
    [persona.padre, persona.madre].forEach((parentId) => {
      const parent = BY_ID[parentId];
      if (!knownIds.has(parentId) || !Number.isFinite(parent?.nac)) return;
      const gap = persona.nac - parent.nac;
      if (gap >= 14 && gap <= 65) parentAgeGaps.push(gap);
    });
  });
  const generationSpan = Math.max(23, Math.min(35, mediana(parentAgeGaps) || 28));

  const originSamples = people
    .filter((persona) => Number.isFinite(persona.nac)
      && [persona.padre, persona.madre].some((parentId) => knownIds.has(parentId)))
    .map((persona) => persona.nac - gen[persona.id] * generationSpan);
  const datedYears = people.map((persona) => persona.nac).filter(Number.isFinite);
  const originYear = mediana(originSamples)
    ?? (datedYears.length ? Math.min(...datedYears) : 1200);

  const visited = new Set();
  people.forEach((persona) => {
    if (visited.has(persona.id)) return;
    const component = [];
    const queue = [persona.id];
    visited.add(persona.id);

    while (queue.length) {
      const currentId = queue.shift();
      component.push(currentId);
      listaParejas(BY_ID[currentId]).forEach((partnerId) => {
        if (!knownIds.has(partnerId) || visited.has(partnerId)) return;
        visited.add(partnerId);
        queue.push(partnerId);
      });
    }

    const hasKnownParent = component.some((id) => {
      const member = BY_ID[id];
      return [member?.padre, member?.madre].some((parentId) => knownIds.has(parentId));
    });
    if (hasKnownParent) return;

    const cohortYear = mediana(component.map((id) => BY_ID[id]?.nac).filter(Number.isFinite));
    if (!Number.isFinite(cohortYear)) return;
    const targetGeneration = Math.max(
      ...component.map((id) => gen[id]),
      Math.max(0, Math.round((cohortYear - originYear) / generationSpan))
    );
    component.forEach((id) => {
      gen[id] = targetGeneration;
    });
  });

  // Al elevar una raíz coetánea, toda su descendencia debe acompañarla.
  hitGuard = relaxConstraints() || hitGuard;

  // Evita filas vacías por encima de la primera cohorte visible.
  const minGeneration = Math.min(...Object.values(gen));
  if (Number.isFinite(minGeneration) && minGeneration > 0) {
    Object.keys(gen).forEach((id) => {
      gen[id] -= minGeneration;
    });
  }

  if (hitGuard) {
    console.warn("[Árbol] El cálculo de generaciones alcanzó el límite de seguridad; revisa posibles ciclos de filiación.");
  }
  return gen;
}

export function orderPartnerComponent(ids, adjacency, inputIndex) {
  if (ids.length <= 1) return ids.slice();

  const componentSet = new Set(ids);
  const edges = [];
  const degrees = Object.fromEntries(ids.map((id) => [id, 0]));
  ids.forEach((id) => {
    (adjacency[id] || []).forEach((otherId) => {
      if (!componentSet.has(otherId) || inputIndex[id] >= inputIndex[otherId]) return;
      edges.push([id, otherId]);
      degrees[id] += 1;
      degrees[otherId] += 1;
    });
  });

  const scoreOrder = (order) => {
    const pos = Object.fromEntries(order.map((id, index) => [id, index]));
    const center = (order.length - 1) / 2;
    let score = 0;

    edges.forEach(([a, b]) => {
      const distance = Math.abs(pos[a] - pos[b]);
      score += ((distance - 1) ** 2) * 1000 + distance * 12;
    });
    order.forEach((id) => {
      score += degrees[id] * Math.abs(pos[id] - center) * 4;
    });
    return score;
  };

  // En la base actual el componente mayor tiene seis personas. Probar todas
  // las permutaciones nos permite colocar el núcleo de cada unión en el centro
  // y reducir al mínimo la distancia entre parejas sin heurísticas frágiles.
  if (ids.length <= 7) {
    let best = null;
    let bestScore = Infinity;
    let bestTie = "";
    const used = new Set();
    const order = [];

    const visit = () => {
      if (order.length === ids.length) {
        const score = scoreOrder(order);
        const tie = order.map((id) => String(inputIndex[id]).padStart(5, "0")).join("|");
        if (score < bestScore || (score === bestScore && (!best || tie < bestTie))) {
          best = order.slice();
          bestScore = score;
          bestTie = tie;
        }
        return;
      }
      ids
        .slice()
        .sort((a, b) => (degrees[b] - degrees[a]) || (inputIndex[a] - inputIndex[b]))
        .forEach((id) => {
          if (used.has(id)) return;
          used.add(id);
          order.push(id);
          visit();
          order.pop();
          used.delete(id);
        });
    };
    visit();
    return best || ids.slice();
  }

  // Respaldo para futuras bases con componentes de pareja mucho mayores.
  const pending = new Set(ids);
  const start = ids.slice().sort((a, b) => (degrees[b] - degrees[a]) || (inputIndex[a] - inputIndex[b]))[0];
  const ordered = [start];
  pending.delete(start);
  while (pending.size) {
    const candidate = [...pending].sort((a, b) => {
      const aLinks = (adjacency[a] || []).filter((id) => ordered.includes(id)).length;
      const bLinks = (adjacency[b] || []).filter((id) => ordered.includes(id)).length;
      return bLinks - aLinks || degrees[b] - degrees[a] || inputIndex[a] - inputIndex[b];
    })[0];
    const leftCost = scoreOrder([candidate, ...ordered]);
    const rightCost = scoreOrder([...ordered, candidate]);
    if (leftCost < rightCost) ordered.unshift(candidate);
    else ordered.push(candidate);
    pending.delete(candidate);
  }
  return ordered;
}


// Cuando los filtros ocultan a una persona central, una unidad de pareja puede
// quedar partida en varios grupos. Los separamos para que dos ex-cónyuges que
// ya no tienen una persona visible en común no aparezcan pegados entre sí.
export function splitPartnerComponents(ids, byId) {
  if (ids.length <= 1) return ids.length ? [ids.slice()] : [];
  const idSet = new Set(ids);
  const rank = Object.fromEntries(ids.map((id, index) => [id, index]));

  // La relación de pareja se trata como un vínculo simétrico aunque solo una
  // de las dos fichas declare conyuge/amantes. Esto evita que una pareja real
  // se separe al aplicar filtros (p. ej. Caterina Sforza y Popolano).
  const adjacency = Object.fromEntries(ids.map((id) => [id, new Set()]));
  ids.forEach((id) => {
    listaParejas(byId[id]).forEach((partnerId) => {
      if (!idSet.has(partnerId)) return;
      adjacency[id].add(partnerId);
      adjacency[partnerId].add(id);
    });
  });

  const seen = new Set();
  const components = [];
  ids.forEach((startId) => {
    if (seen.has(startId)) return;
    const queue = [startId];
    const component = [];
    seen.add(startId);
    while (queue.length) {
      const current = queue.shift();
      component.push(current);
      adjacency[current].forEach((partnerId) => {
        if (seen.has(partnerId)) return;
        seen.add(partnerId);
        queue.push(partnerId);
      });
    }
    component.sort((a, b) => rank[a] - rank[b]);
    components.push(component);
  });
  return components;
}

export function orderPathIds(ids, adjacency, rank) {
  if (ids.length <= 1) return ids.slice();
  const idSet = new Set(ids);
  const degree = (id) => (adjacency[id] || []).filter((otherId) => idSet.has(otherId)).length;
  const endpoints = ids.filter((id) => degree(id) <= 1);
  const start = (endpoints.length ? endpoints : ids)
    .slice()
    .sort((a, b) => rank[a] - rank[b])[0];
  const ordered = [];
  const seen = new Set();
  let current = start;

  while (current && !seen.has(current)) {
    ordered.push(current);
    seen.add(current);
    const next = (adjacency[current] || [])
      .filter((otherId) => idSet.has(otherId) && !seen.has(otherId))
      .sort((a, b) => rank[a] - rank[b])[0];
    current = next;
  }

  ids
    .filter((id) => !seen.has(id))
    .sort((a, b) => rank[a] - rank[b])
    .forEach((id) => ordered.push(id));
  return ordered;
}

// Construye la geometría interna de una unidad de pareja sin dibujar líneas
// entre sus integrantes. Las cadenas de matrimonios sucesivos se mantienen
// como una sucesión de cajas normales en contacto. Cuando una persona reúne
// tres o más parejas, las parejas laterales vuelven al formato compacto de
// cajas pequeñas apiladas alrededor de la caja principal.
export function createPartnerUnitBlueprint(ids, byId) {
  const rank = Object.fromEntries(ids.map((id, index) => [id, index]));
  const idSet = new Set(ids);
  const adjacency = Object.fromEntries(ids.map((id) => [id, []]));

  ids.forEach((id) => {
    listaParejas(byId[id]).forEach((partnerId) => {
      if (!idSet.has(partnerId)) return;
      if (!adjacency[id].includes(partnerId)) adjacency[id].push(partnerId);
      if (!adjacency[partnerId].includes(id)) adjacency[partnerId].push(id);
    });
  });

  const degree = Object.fromEntries(ids.map((id) => [id, adjacency[id].length]));
  const maxDegree = Math.max(0, ...Object.values(degree));
  const addContact = (contacts, a, b, points) => {
    if (!a || !b || !(adjacency[a] || []).includes(b)) return;
    contacts[clavePareja(a, b)] = {
      parentIds: [a, b],
      points,
    };
  };

  const fullSequence = (order) => {
    const boxes = order.map((id, index) => ({
      id,
      x: index * TREE_BOX_W,
      y: 0,
      w: TREE_BOX_W,
      h: TREE_BOX_H,
      mini: false,
    }));
    const contacts = {};
    for (let index = 0; index < order.length - 1; index += 1) {
      const a = order[index];
      const b = order[index + 1];
      addContact(contacts, a, b, [[(index + 1) * TREE_BOX_W, TREE_BOX_H]]);
    }
    return {
      ids: order.slice(),
      boxes,
      contacts,
      width: Math.max(TREE_BOX_W, order.length * TREE_BOX_W),
      height: TREE_BOX_H,
    };
  };

  if (ids.length <= 1) return fullSequence(ids);

  // Una pareja simple o una verdadera cadena de matrimonios sucesivos puede
  // representarse íntegramente como una fila de cajas normales en contacto.
  if (maxDegree <= 2) {
    return fullSequence(orderPathIds(ids, adjacency, rank));
  }

  const coreIds = ids.filter((id) => degree[id] > 1);
  const coreSet = new Set(coreIds);
  const coreAdjacency = Object.fromEntries(coreIds.map((id) => [
    id,
    adjacency[id].filter((otherId) => coreSet.has(otherId)),
  ]));
  const coreOrder = orderPathIds(coreIds, coreAdjacency, rank);

  // Si en el futuro aparece una estructura de parejas mucho más compleja que
  // un eje central con parejas laterales, priorizamos no perder a nadie y la
  // mostramos como secuencia completa.
  const coreEdges = coreOrder.slice(0, -1).every((id, index) =>
    (coreAdjacency[id] || []).includes(coreOrder[index + 1])
  );
  if (!coreOrder.length || !coreEdges) {
    return fullSequence(orderPartnerComponent(ids, adjacency, rank));
  }

  const leavesFor = (coreId) => (adjacency[coreId] || [])
    .filter((otherId) => !coreSet.has(otherId))
    .sort((a, b) => rank[a] - rank[b]);

  let leftMiniIds = [];
  let rightMiniIds = [];
  const topLeavesByCore = {};
  let leftSpineLeaf = null;
  let rightSpineLeaf = null;

  if (coreOrder.length === 1) {
    const hub = coreOrder[0];
    const leaves = leavesFor(hub);
    const hubIndex = rank[hub];
    const before = leaves.filter((id) => rank[id] < hubIndex);
    const after = leaves.filter((id) => rank[id] > hubIndex);
    if (before.length && after.length) {
      leftMiniIds = before;
      rightMiniIds = after;
    } else {
      const split = Math.ceil(leaves.length / 2);
      leftMiniIds = leaves.slice(0, split);
      rightMiniIds = leaves.slice(split);
    }
  } else {
    const firstCore = coreOrder[0];
    const lastCore = coreOrder[coreOrder.length - 1];
    const firstLeaves = leavesFor(firstCore);
    const lastLeaves = leavesFor(lastCore);

    // Un único matrimonio anterior/posterior prolonga el eje como en la
    // referencia de matrimonios sucesivos. Dos o más parejas permanecen en
    // una columna compacta al lado de la persona correspondiente.
    if (firstLeaves.length === 1) leftSpineLeaf = firstLeaves[0];
    else leftMiniIds = firstLeaves;
    if (lastLeaves.length === 1) rightSpineLeaf = lastLeaves[0];
    else rightMiniIds = lastLeaves;

    coreOrder.slice(1, -1).forEach((coreId) => {
      const leaves = leavesFor(coreId);
      if (leaves.length) topLeavesByCore[coreId] = leaves;
    });
  }

  const fullOrder = [
    ...(leftSpineLeaf ? [leftSpineLeaf] : []),
    ...coreOrder,
    ...(rightSpineLeaf ? [rightSpineLeaf] : []),
  ];
  const topLeafCount = Object.values(topLeavesByCore).reduce((sum, leaves) => sum + leaves.length, 0);
  const topHeight = topLeafCount ? TREE_MINI_MIN_H : 0;
  const miniHeightFor = (count) => {
    if (!count) return 0;
    if (count === 1) return Math.floor(TREE_BOX_H / 2);
    return Math.max(TREE_MINI_MIN_H, Math.floor(TREE_BOX_H / count));
  };
  const leftMiniH = miniHeightFor(leftMiniIds.length);
  const rightMiniH = miniHeightFor(rightMiniIds.length);
  const leftStackH = leftMiniH * leftMiniIds.length;
  const rightStackH = rightMiniH * rightMiniIds.length;
  const contentHeight = Math.max(TREE_BOX_H, leftStackH, rightStackH);
  const coreY = topHeight + (contentHeight - TREE_BOX_H) / 2;
  const unitHeight = topHeight + contentHeight;
  const hasLeftColumn = leftMiniIds.length > 0;
  const hasRightColumn = rightMiniIds.length > 0;
  const fullStartX = hasLeftColumn ? TREE_BOX_W : 0;
  const rightColumnX = fullStartX + fullOrder.length * TREE_BOX_W;
  const unitWidth = rightColumnX + (hasRightColumn ? TREE_BOX_W : 0);
  const boxes = [];
  const contacts = {};
  const fullBoxById = {};

  fullOrder.forEach((id, index) => {
    const box = {
      id,
      x: fullStartX + index * TREE_BOX_W,
      y: coreY,
      w: TREE_BOX_W,
      h: TREE_BOX_H,
      mini: false,
    };
    boxes.push(box);
    fullBoxById[id] = box;
  });

  for (let index = 0; index < fullOrder.length - 1; index += 1) {
    const a = fullOrder[index];
    const b = fullOrder[index + 1];
    addContact(
      contacts,
      a,
      b,
      [[fullStartX + (index + 1) * TREE_BOX_W, coreY + TREE_BOX_H]]
    );
  }

  if (leftMiniIds.length) {
    const hubId = coreOrder[0];
    const hubBox = fullBoxById[hubId];
    const stackY = topHeight + (contentHeight - leftStackH) / 2;
    leftMiniIds.forEach((id, index) => {
      const y = stackY + index * leftMiniH;
      const box = { id, x: 0, y, w: TREE_BOX_W, h: leftMiniH, mini: true, side: "left", hubId };
      boxes.push(box);
      const contactY = y + leftMiniH;
      const exitX = -TREE_PARTNER_EXIT_BASE - index * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, id, hubId, [[hubBox.x, contactY], [exitX, contactY]]);
    });
  }

  if (rightMiniIds.length) {
    const hubId = coreOrder[coreOrder.length - 1];
    const hubBox = fullBoxById[hubId];
    const stackY = topHeight + (contentHeight - rightStackH) / 2;
    rightMiniIds.forEach((id, index) => {
      const y = stackY + index * rightMiniH;
      const box = { id, x: rightColumnX, y, w: TREE_BOX_W, h: rightMiniH, mini: true, side: "right", hubId };
      boxes.push(box);
      const contactY = y + rightMiniH;
      const exitX = unitWidth + TREE_PARTNER_EXIT_BASE + index * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, hubId, id, [[hubBox.x + hubBox.w, contactY], [exitX, contactY]]);
    });
  }

  let topLeftExit = 0;
  let topRightExit = 0;
  Object.entries(topLeavesByCore).forEach(([hubId, leaves]) => {
    const hubBox = fullBoxById[hubId];
    const miniW = TREE_BOX_W / leaves.length;
    leaves.forEach((id, index) => {
      const x = hubBox.x + index * miniW;
      const y = coreY - TREE_MINI_MIN_H;
      boxes.push({ id, x, y, w: miniW, h: TREE_MINI_MIN_H, mini: true, side: "top", hubId });
      const contactX = x + miniW / 2;
      const goLeft = contactX <= hubBox.x + hubBox.w / 2;
      const boundaryX = goLeft ? hubBox.x : hubBox.x + hubBox.w;
      const exitIndex = goLeft ? topLeftExit++ : topRightExit++;
      const exitX = goLeft
        ? -TREE_PARTNER_EXIT_BASE - exitIndex * TREE_PARTNER_EXIT_STEP
        : unitWidth + TREE_PARTNER_EXIT_BASE + exitIndex * TREE_PARTNER_EXIT_STEP;
      addContact(contacts, hubId, id, [[contactX, coreY], [boundaryX, coreY], [exitX, coreY]]);
    });
  });

  if (boxes.length !== ids.length) {
    return fullSequence(orderPartnerComponent(ids, adjacency, rank));
  }

  return {
    ids: ids.slice(),
    boxes,
    contacts,
    width: Math.max(TREE_BOX_W, unitWidth),
    height: Math.max(TREE_BOX_H, unitHeight),
  };
}

export function buildRows(people, gen) {
  const maxGen = Math.max(0, ...Object.values(gen));
  const rows = Array.from({ length: maxGen + 1 }, () => []);
  const inputIndex = Object.fromEntries(people.map((persona, index) => [persona.id, index]));
  const knownIds = new Set(people.map((persona) => persona.id));
  const partnerAdj = Object.fromEntries(people.map((persona) => [persona.id, []]));

  people.forEach((persona) => {
    listaParejas(persona).forEach((partnerId) => {
      if (!knownIds.has(partnerId) || gen[partnerId] !== gen[persona.id]) return;
      if (!partnerAdj[persona.id].includes(partnerId)) partnerAdj[persona.id].push(partnerId);
      if (!partnerAdj[partnerId].includes(persona.id)) partnerAdj[partnerId].push(persona.id);
    });
  });

  const used = new Set();
  people.forEach((persona) => {
    if (used.has(persona.id)) return;
    const component = [];
    const queue = [persona.id];
    used.add(persona.id);
    while (queue.length) {
      const current = queue.shift();
      component.push(current);
      (partnerAdj[current] || []).forEach((partnerId) => {
        if (!used.has(partnerId)) {
          used.add(partnerId);
          queue.push(partnerId);
        }
      });
    }
    rows[gen[persona.id]].push(orderPartnerComponent(component, partnerAdj, inputIndex));
  });

  const childrenOf = {};
  people.forEach((persona) => {
    [persona.padre, persona.madre].filter((id) => knownIds.has(id)).forEach((parentId) => {
      (childrenOf[parentId] ||= []).push(persona.id);
    });
  });

  const normalizedOrder = (rowsState) => rowsState.map((row) => {
    const order = new Map();
    const total = row.reduce((sum, unit) => sum + unit.length, 0) + Math.max(0, row.length - 1) * 0.58;
    let cursor = 0;
    row.forEach((unit) => {
      const center = total > 0 ? (cursor + unit.length / 2) / total : 0.5;
      unit.forEach((id) => order.set(id, center));
      cursor += unit.length + 0.58;
    });
    return order;
  });

  const sortRow = (row, refFn) => row
    .map((unit, originalIndex) => {
      const refs = unit.flatMap((id) => refFn(id)).filter(Number.isFinite);
      return {
        unit,
        originalIndex,
        key: refs.length ? mediana(refs) : originalIndex,
      };
    })
    .sort((a, b) => a.key - b.key || a.originalIndex - b.originalIndex)
    .map(({ unit }) => unit);

  const scoreRows = (rowsState) => {
    const order = normalizedOrder(rowsState);
    const edgesByLayer = {};
    let distanceScore = 0;
    const siblingGroups = {};

    people.forEach((child) => {
      const childOrder = order[gen[child.id]]?.get(child.id);
      if (!Number.isFinite(childOrder)) return;
      const familyKey = [child.padre, child.madre].filter((id) => knownIds.has(id)).sort().join("|") || child.id;
      (siblingGroups[`${familyKey}@${gen[child.id]}`] ||= []).push(childOrder);

      [child.padre, child.madre].forEach((parentId) => {
        if (!knownIds.has(parentId)) return;
        const parentOrder = order[gen[parentId]]?.get(parentId);
        if (!Number.isFinite(parentOrder)) return;
        const layerKey = `${gen[parentId]}>${gen[child.id]}`;
        (edgesByLayer[layerKey] ||= []).push({
          source: parentOrder,
          target: childOrder,
          familyKey,
        });
        distanceScore += Math.abs(parentOrder - childOrder);
      });
    });

    let crossings = 0;
    Object.values(edgesByLayer).forEach((edges) => {
      for (let i = 0; i < edges.length; i += 1) {
        for (let j = i + 1; j < edges.length; j += 1) {
          if (edges[i].familyKey === edges[j].familyKey) continue;
          if ((edges[i].source - edges[j].source) * (edges[i].target - edges[j].target) < 0) crossings += 1;
        }
      }
    });

    let siblingSpread = 0;
    Object.values(siblingGroups).forEach((values) => {
      if (values.length > 1) siblingSpread += Math.max(...values) - Math.min(...values);
    });

    return crossings * 100000 + siblingSpread * 700 + distanceScore * 100;
  };

  let current = rows.map((row) => row.map((unit) => unit.slice()));
  let best = current.map((row) => row.map((unit) => unit.slice()));
  let bestScore = scoreRows(best);

  for (let pass = 0; pass < 12; pass += 1) {
    let order = normalizedOrder(current);
    if (pass % 2 === 0) {
      for (let rowIndex = 1; rowIndex <= maxGen; rowIndex += 1) {
        current[rowIndex] = sortRow(current[rowIndex], (id) => {
          const persona = BY_ID[id];
          if (!persona) return [];
          return [persona.padre, persona.madre]
            .map((parentId) => order[gen[parentId]]?.get(parentId))
            .filter(Number.isFinite);
        });
        order = normalizedOrder(current);
      }
    } else {
      for (let rowIndex = maxGen - 1; rowIndex >= 0; rowIndex -= 1) {
        current[rowIndex] = sortRow(current[rowIndex], (id) =>
          (childrenOf[id] || [])
            .map((childId) => order[gen[childId]]?.get(childId))
            .filter(Number.isFinite)
        );
        order = normalizedOrder(current);
      }
    }

    const score = scoreRows(current);
    if (score < bestScore) {
      bestScore = score;
      best = current.map((row) => row.map((unit) => unit.slice()));
    }
  }

  // Última pasada local: un intercambio adyacente solo se conserva si
  // reduce cruces, distancia entre generaciones o dispersión de hermanos.
  current = best.map((row) => row.map((unit) => unit.slice()));
  for (let round = 0; round < 2; round += 1) {
    for (let rowIndex = 0; rowIndex < current.length; rowIndex += 1) {
      for (let index = 0; index < current[rowIndex].length - 1; index += 1) {
        const before = scoreRows(current);
        [current[rowIndex][index], current[rowIndex][index + 1]] = [current[rowIndex][index + 1], current[rowIndex][index]];
        const after = scoreRows(current);
        if (after < before) {
          if (after < bestScore) {
            bestScore = after;
            best = current.map((row) => row.map((unit) => unit.slice()));
          }
        } else {
          [current[rowIndex][index], current[rowIndex][index + 1]] = [current[rowIndex][index + 1], current[rowIndex][index]];
        }
      }
    }
  }

  return best;
}

export function pavaNonDecreasing(targets, weights) {
  const blocks = targets.map((value, index) => ({
    start: index,
    end: index,
    weight: weights[index],
    value,
  }));

  for (let index = 0; index < blocks.length - 1;) {
    if (blocks[index].value <= blocks[index + 1].value) {
      index += 1;
      continue;
    }
    const left = blocks[index];
    const right = blocks[index + 1];
    const weight = left.weight + right.weight;
    blocks.splice(index, 2, {
      start: left.start,
      end: right.end,
      weight,
      value: (left.value * left.weight + right.value * right.weight) / weight,
    });
    if (index > 0) index -= 1;
  }

  const result = Array(targets.length);
  blocks.forEach((block) => {
    for (let index = block.start; index <= block.end; index += 1) result[index] = block.value;
  });
  return result;
}

export function computeTreeLayout(rows, byId, childrenById) {
  const rowUnits = rows.map((row, rowIndex) => {
    const blueprints = row.map((ids) => createPartnerUnitBlueprint(ids, byId));
    const totalWidth = blueprints.reduce((sum, unit) => sum + unit.width, 0)
      + Math.max(0, blueprints.length - 1) * TREE_UNIT_GAP;
    let cursor = -totalWidth / 2;
    return blueprints.map((blueprint, unitIndex) => {
      const unit = {
        ...blueprint,
        key: `${rowIndex}-${unitIndex}-${blueprint.ids.join("-")}`,
        row: rowIndex,
        x: cursor,
      };
      cursor += unit.width + TREE_UNIT_GAP;
      return unit;
    });
  });

  const rebuildUnitByPerson = () => {
    const map = {};
    rowUnits.forEach((row) => row.forEach((unit) => unit.ids.forEach((id) => { map[id] = unit; })));
    return map;
  };

  const repositionRow = (rowIndex, direction) => {
    const row = rowUnits[rowIndex];
    if (!row.length) return;
    const unitByPerson = rebuildUnitByPerson();
    const offsets = [];
    let offset = 0;
    row.forEach((unit, index) => {
      offsets[index] = offset;
      offset += unit.width + TREE_UNIT_GAP;
    });

    const targets = [];
    const weights = [];
    row.forEach((unit, index) => {
      const references = [];
      unit.ids.forEach((id) => {
        const persona = byId[id];
        if (!persona) return;
        const linkedIds = direction === "down"
          ? [persona.padre, persona.madre]
          : (childrenById[id] || []);
        linkedIds.forEach((linkedId) => {
          const linkedUnit = unitByPerson[linkedId];
          if (linkedUnit) references.push(linkedUnit.x + linkedUnit.width / 2);
        });
      });

      const currentCenter = unit.x + unit.width / 2;
      const targetCenter = references.length
        ? currentCenter * 0.18 + mediana(references) * 0.82
        : currentCenter;
      targets[index] = targetCenter - unit.width / 2 - offsets[index];
      weights[index] = references.length ? Math.min(6, references.length + 1) : 0.35;
    });

    const fitted = pavaNonDecreasing(targets, weights);
    row.forEach((unit, index) => {
      unit.x = fitted[index] + offsets[index];
    });
  };

  for (let pass = 0; pass < 10; pass += 1) {
    for (let rowIndex = 1; rowIndex < rowUnits.length; rowIndex += 1) repositionRow(rowIndex, "down");
    for (let rowIndex = rowUnits.length - 2; rowIndex >= 0; rowIndex -= 1) repositionRow(rowIndex, "up");
  }

  const allUnits = rowUnits.flat();
  const minX = allUnits.length ? Math.min(...allUnits.map((unit) => unit.x)) : 0;
  const shiftX = TREE_PAD_X - minX;
  allUnits.forEach((unit) => { unit.x += shiftX; });

  const rowHeights = rowUnits.map((row) => Math.max(TREE_BOX_H, ...row.map((unit) => unit.height)));
  const rowTops = [];
  let nextRowTop = TREE_PAD_TOP;
  rowHeights.forEach((height, rowIndex) => {
    rowTops[rowIndex] = nextRowTop;
    nextRowTop += height + TREE_ROW_GAP;
  });

  const positions = {};
  const pairContacts = {};
  allUnits.forEach((unit) => {
    const rowHeight = rowHeights[unit.row] || TREE_BOX_H;
    unit.y = rowTops[unit.row] + (rowHeight - unit.height) / 2;
    unit.boxes.forEach((box) => {
      positions[box.id] = {
        x: unit.x + box.x,
        y: unit.y + box.y,
        w: box.w,
        h: box.h,
        row: unit.row,
        unitKey: unit.key,
        mini: box.mini,
        side: box.side,
        hubId: box.hubId,
      };
    });
    Object.entries(unit.contacts || {}).forEach(([pairKey, contact]) => {
      pairContacts[pairKey] = {
        ...contact,
        unitKey: unit.key,
        points: contact.points.map(([x, y]) => [unit.x + x, unit.y + y]),
      };
    });
  });

  const maxX = allUnits.length ? Math.max(...allUnits.map((unit) => unit.x + unit.width)) : 0;
  const width = Math.max(1200, maxX + TREE_PAD_X);
  const height = Math.max(
    700,
    (rowTops[rowTops.length - 1] ?? TREE_PAD_TOP)
      + (rowHeights[rowHeights.length - 1] ?? TREE_BOX_H)
      + TREE_PAD_BOTTOM
  );

  const rowBands = rows.map((_, rowIndex) => {
    const top = rowTops[rowIndex] ?? (TREE_PAD_TOP + rowIndex * TREE_ROW_STEP);
    return [top, top + (rowHeights[rowIndex] || TREE_BOX_H)];
  });

  return {
    positions,
    pairContacts,
    units: allUnits,
    rowUnits,
    rowBands,
    rowHeights,
    width,
    height,
  };
}

export function mergeIntervals(intervals, margin = 0) {
  const sorted = intervals
    .map(([start, end]) => [Math.min(start, end), Math.max(start, end)])
    .sort((a, b) => a[0] - b[0]);
  const merged = [];
  sorted.forEach(([start, end]) => {
    const last = merged[merged.length - 1];
    if (last && start <= last[1] + margin) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
  });
  return merged;
}

export function assignIntervalLanes(requests, margin = 10) {
  if (!requests.length) return { assignment: {}, count: 0 };
  const lanes = [];
  requests
    .slice()
    .sort((a, b) => a.x1 - b.x1 || a.x2 - b.x2)
    .forEach((request) => {
      let bestLane = -1;
      let bestEnd = -Infinity;
      lanes.forEach((lane, index) => {
        if (lane.end + margin <= request.x1 && lane.end > bestEnd) {
          bestLane = index;
          bestEnd = lane.end;
        }
      });
      if (bestLane < 0) {
        lanes.push({ end: request.x2, requests: [request] });
      } else {
        lanes[bestLane].requests.push(request);
        lanes[bestLane].end = Math.max(lanes[bestLane].end, request.x2);
      }
    });

  const orderedLanes = lanes
    .map((lane) => ({
      ...lane,
      preference: lane.requests.reduce((sum, request) => sum + (request.preference ?? 0.5), 0) / lane.requests.length,
    }))
    .sort((a, b) => a.preference - b.preference);

  const assignment = {};
  orderedLanes.forEach((lane, laneIndex) => {
    lane.requests.forEach((request) => { assignment[request.id] = laneIndex; });
  });
  return { assignment, count: orderedLanes.length };
}

export function computeColumnCandidates(rowsData, positions, canvasWidth, rowStart, rowEnd) {
  const occupied = [];
  rowsData.forEach((row, rowIndex) => {
    if (rowIndex < rowStart || rowIndex > rowEnd) return;
    row.flat().forEach((id) => {
      const pos = positions[id];
      if (pos) occupied.push([pos.x - 8, pos.x + pos.w + 8]);
    });
  });

  const merged = mergeIntervals(occupied, 2);
  const gaps = [];
  let cursor = 8;
  merged.forEach(([start, end]) => {
    if (start > cursor) gaps.push([cursor, start]);
    cursor = Math.max(cursor, end);
  });
  if (cursor < canvasWidth - 8) gaps.push([cursor, canvasWidth - 8]);
  if (!gaps.length) gaps.push([8, canvasWidth - 8]);

  const candidates = [];
  gaps.forEach(([start, end]) => {
    const low = start + 8;
    const high = end - 8;
    if (high < low) {
      candidates.push((start + end) / 2);
      return;
    }
    const count = Math.max(1, Math.floor((high - low) / TREE_COLUMN_STEP) + 1);
    const usedWidth = (count - 1) * TREE_COLUMN_STEP;
    const first = (low + high - usedWidth) / 2;
    for (let index = 0; index < count; index += 1) candidates.push(first + index * TREE_COLUMN_STEP);
  });
  return [...new Set(candidates.map((value) => Math.round(value * 10) / 10))];
}

export function claimColumn(candidates, targetX, claims, yStart, yEnd, familyKey) {
  const lo = Math.min(yStart, yEnd);
  const hi = Math.max(yStart, yEnd);
  const sorted = candidates.slice().sort((a, b) => Math.abs(a - targetX) - Math.abs(b - targetX));

  // Una columna visual pertenece a UNA sola familia. La única excepción son
  // los grupos del mismo familyKey: hermanos completos que han quedado en
  // generaciones distintas y, por tanto, deben prolongar el mismo tronco.
  // Aunque dos familias no se solapen verticalmente, reutilizar exactamente la
  // misma X hace que parezcan una línea continua y visualmente las "emparenta".
  const conflictsFor = (x) => {
    let conflicts = 0;
    claims.forEach((claim) => {
      if (claim.familyKey === familyKey) return;
      const sameVisualColumn = Math.abs(x - claim.x) < TREE_COLUMN_STEP * 0.82;
      if (!sameVisualColumn) return;
      const overlapsVertically = lo < claim.yEnd + 8 && hi > claim.yStart - 8;
      conflicts += overlapsVertically ? 1000 : 100;
    });
    return conflicts;
  };

  let selected = sorted.find((x) => conflictsFor(x) === 0);
  if (!Number.isFinite(selected)) {
    selected = sorted
      .map((x) => ({ x, conflicts: conflictsFor(x), distance: Math.abs(x - targetX) }))
      .sort((a, b) => a.conflicts - b.conflicts || a.distance - b.distance)[0]?.x;
  }
  if (!Number.isFinite(selected)) selected = targetX;
  claims.push({ x: selected, yStart: lo, yEnd: hi, familyKey });
  return selected;
}

export function dedupePts(points) {
  if (!points.length) return [];
  const result = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const [x, y] = points[index];
    const [previousX, previousY] = result[result.length - 1];
    if (Math.abs(x - previousX) > 0.5 || Math.abs(y - previousY) > 0.5) result.push(points[index]);
  }
  return result;
}

export function dist(x0, y0, x1, y1) {
  return Math.hypot(x1 - x0, y1 - y0);
}

export function pointToward(x1, y1, x2, y2, distance) {
  const length = dist(x1, y1, x2, y2) || 1;
  const factor = Math.min(distance, length / 2) / length;
  return [x1 + (x2 - x1) * factor, y1 + (y2 - y1) * factor];
}

export function roundedPath(rawPoints, radius = 8) {
  const points = dedupePts(rawPoints);
  if (!points.length) return "";
  if (points.length < 3) return `M ${points.map((point) => point.join(" ")).join(" L ")}`;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index - 1];
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const before = pointToward(x1, y1, x0, y0, radius);
    const after = pointToward(x1, y1, x2, y2, radius);
    d += ` L ${before[0]} ${before[1]} Q ${x1} ${y1} ${after[0]} ${after[1]}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${last[0]} ${last[1]}`;
}

export function routeFamilyConnectors({ groupsByRow, positions, pairContacts, gen, rows, rowBands, canvasWidth }) {
  if (!Object.keys(positions).length) return { families: [], diagnostics: {} };

  // Mantener la geometría V17: cada fila de hijos conserva su barra y sus
  // curvas propias. Lo único que se comparte entre hermanos completos que
  // han caído en generaciones visuales distintas es la salida desde los
  // mismos progenitores (carril superior + canal vertical).
  const visibleGroups = Object.values(groupsByRow).flatMap((groups) => groups).map((group) => {
    const parentIds = group.parentIds.filter((id) => positions[id]);
    const childIds = group.childIds.filter((id) => positions[id]);
    if (!parentIds.length || !childIds.length) return null;
    const parentRow = Math.max(...parentIds.map((id) => gen[id]));
    const childRow = gen[childIds[0]];
    if (!Number.isFinite(childRow) || childRow <= parentRow) return null;
    const childXs = childIds.map((id) => positions[id].x + positions[id].w / 2).sort((a, b) => a - b);
    const familyBaseKey = group.familyBaseKey || group.parentIds.slice().sort().join("|");
    return {
      ...group,
      parentIds,
      childIds,
      parentRow,
      childRow,
      childXs,
      childCenter: (childXs[0] + childXs[childXs.length - 1]) / 2,
      familyBaseKey,
      familyKey: `${familyBaseKey}@${childRow}`,
    };
  }).filter(Boolean);

  const groupsByFamily = {};
  visibleGroups.forEach((group) => {
    (groupsByFamily[group.familyBaseKey] ||= []).push(group);
  });

  const verticalClaims = [];
  Object.values(groupsByFamily).forEach((familyGroups) => {
    const first = familyGroups[0];
    const parentCenters = first.parentIds.map((id) => positions[id].x + positions[id].w / 2);
    const pair = first.parentIds.length === 2 ? clavePareja(first.parentIds[0], first.parentIds[1]) : null;
    const contact = pair ? pairContacts?.[pair] : null;
    const fallbackAnchor = {
      x: parentCenters.reduce((sum, value) => sum + value, 0) / parentCenters.length,
      y: Math.max(...first.parentIds.map((id) => positions[id].y + positions[id].h)),
    };
    const anchorPoints = contact?.points?.length
      ? contact.points.map(([x, y]) => [x, y])
      : [[fallbackAnchor.x, fallbackAnchor.y]];
    const [anchorX, anchorY] = anchorPoints[anchorPoints.length - 1];

    familyGroups.forEach((group) => {
      group.anchorPoints = anchorPoints;
      group.anchor = { x: anchorX, y: anchorY };
    });

    const nonDirect = familyGroups.filter((group) => group.childRow > group.parentRow + 1);
    if (!nonDirect.length) return;

    // Un solo canal para todos los hermanos completos, calculado hasta el hijo
    // visualmente más profundo. No se usa el centro de los hijos para elegirlo:
    // su referencia es exclusivamente el anclaje real de los progenitores.
    const deepestChildRow = Math.max(...nonDirect.map((group) => group.childRow));
    const deepestGroup = nonDirect.find((group) => group.childRow === deepestChildRow) || nonDirect[nonDirect.length - 1];
    const candidates = computeColumnCandidates(rows, positions, canvasWidth, first.parentRow + 1, deepestChildRow - 1);
    const sharedTrunkX = claimColumn(
      candidates,
      anchorX,
      verticalClaims,
      rowBands[first.parentRow]?.[1] ?? anchorY,
      rowBands[deepestChildRow]?.[0] ?? positions[nonDirect[nonDirect.length - 1].childIds[0]].y,
      first.familyBaseKey
    );
    nonDirect.forEach((group) => {
      group.trunkX = sharedTrunkX;
      group.sharedTrunkOwner = group === deepestGroup;
    });
  });

  const horizontalRequestsByGap = {};
  Object.values(groupsByFamily).forEach((familyGroups) => {
    const first = familyGroups[0];
    const parentRequestId = `${first.familyBaseKey}:parent-shared`;
    const directGroups = familyGroups.filter((group) => group.childRow === group.parentRow + 1);
    const nonDirectGroups = familyGroups.filter((group) => group.childRow > group.parentRow + 1);

    // Reservar UN solo carril inmediatamente bajo los progenitores para todos
    // los hermanos completos, aunque terminen dibujados varias filas más abajo.
    const parentXs = [first.anchor.x];
    directGroups.forEach((group) => parentXs.push(group.childXs[0], group.childXs[group.childXs.length - 1]));
    nonDirectGroups.forEach((group) => parentXs.push(group.trunkX));
    (horizontalRequestsByGap[first.parentRow] ||= []).push({
      id: parentRequestId,
      x1: Math.min(...parentXs),
      x2: Math.max(...parentXs),
      preference: directGroups.length ? 0.5 : 0,
    });

    familyGroups.forEach((group) => {
      group.startRequestId = parentRequestId;
      if (group.childRow === group.parentRow + 1) {
        group.endRequestId = parentRequestId;
        return;
      }
      const endId = `${group.familyKey}:end`;
      (horizontalRequestsByGap[group.childRow - 1] ||= []).push({
        id: endId,
        x1: Math.min(group.trunkX, group.childXs[0]),
        x2: Math.max(group.trunkX, group.childXs[group.childXs.length - 1]),
        preference: 1,
      });
      group.endRequestId = endId;
    });
  });

  const laneAssignmentsByGap = {};
  const laneCountsByGap = {};
  Object.entries(horizontalRequestsByGap).forEach(([gapKey, requests]) => {
    const gap = Number(gapKey);
    const result = assignIntervalLanes(requests, 12);
    laneAssignmentsByGap[gap] = result.assignment;
    laneCountsByGap[gap] = result.count;
  });

  const laneY = (gap, requestId) => {
    const rowBottom = rowBands[gap]?.[1] ?? (TREE_PAD_TOP + gap * TREE_ROW_STEP + TREE_BOX_H);
    const nextTop = rowBands[gap + 1]?.[0] ?? (rowBottom + TREE_ROW_GAP);
    let top = rowBottom + 18;
    let bottom = nextTop - 22;
    if (bottom <= top) {
      top = rowBottom + 12;
      bottom = nextTop - 12;
    }
    const count = Math.max(1, laneCountsByGap[gap] || 1);
    const lane = laneAssignmentsByGap[gap]?.[requestId] ?? 0;
    return top + ((lane + 1) * (bottom - top)) / (count + 1);
  };

  const allChildrenByFamily = {};
  Object.entries(groupsByFamily).forEach(([familyKey, groups]) => {
    allChildrenByFamily[familyKey] = [...new Set(groups.flatMap((group) => group.childIds))];
  });

  const families = visibleGroups.map((group) => {
    const startY = laneY(group.parentRow, group.startRequestId);
    const endY = laneY(group.childRow - 1, group.endRequestId);
    const childMin = group.childXs[0];
    const childMax = group.childXs[group.childXs.length - 1];
    const direct = group.childRow === group.parentRow + 1;
    const busOriginX = direct ? group.anchor.x : group.trunkX;
    const busY = direct ? startY : endY;

    // Geometría V17, con una única corrección direccional: los extremos se
    // curvan HACIA el origen real de su barra. Así nunca hacen primero un giro
    // en sentido contrario para después corregirlo.
    const branchSpecs = group.childIds.map((childId) => {
      const childPos = positions[childId];
      const childX = childPos.x + childPos.w / 2;
      const isOnlyChild = group.childIds.length === 1;
      const isLeftEnd = Math.abs(childX - childMin) < 0.75;
      const isRightEnd = Math.abs(childX - childMax) < 0.75;
      let startX = childX;

      if ((isOnlyChild || isLeftEnd || isRightEnd) && Math.abs(busOriginX - childX) > 1) {
        startX = childX + Math.sign(busOriginX - childX) * Math.min(20, Math.abs(busOriginX - childX));
      }
      return { childId, childPos, childX, startX };
    });

    const branchStartMin = Math.min(...branchSpecs.map((branch) => branch.startX));
    const branchStartMax = Math.max(...branchSpecs.map((branch) => branch.startX));
    const busMin = Math.min(busOriginX, branchStartMin);
    const busMax = Math.max(busOriginX, branchStartMax);
    const [anchorTailX] = group.anchorPoints[group.anchorPoints.length - 1];

    const BUS_ENTRY_RADIUS = 11;
    const hasLeftArm = busMin < busOriginX - 0.5;
    const hasRightArm = busMax > busOriginX + 0.5;
    const hasBusArm = hasLeftArm || hasRightArm;
    const trunkEndY = hasBusArm ? busY - BUS_ENTRY_RADIUS : busY;

    const trunkPoints = direct
      ? [...group.anchorPoints, [anchorTailX, trunkEndY], [busOriginX, trunkEndY]]
      : [...group.anchorPoints, [anchorTailX, startY], [group.trunkX, startY], [group.trunkX, trunkEndY]];

    const busDs = [];
    if (hasLeftArm) {
      busDs.push(roundedPath([
        [busOriginX, trunkEndY],
        [busOriginX, busY],
        [busMin, busY],
      ], BUS_ENTRY_RADIUS));
    }
    if (hasRightArm) {
      busDs.push(roundedPath([
        [busOriginX, trunkEndY],
        [busOriginX, busY],
        [busMax, busY],
      ], BUS_ENTRY_RADIUS));
    }

    return {
      key: group.familyKey,
      familyBaseKey: group.familyBaseKey,
      parentIds: group.parentIds,
      childIds: group.childIds,
      allChildIds: allChildrenByFamily[group.familyBaseKey] || group.childIds,
      trunkD: direct || group.sharedTrunkOwner ? roundedPath(trunkPoints, 11) : "",
      busDs,
      branches: branchSpecs.map(({ childId, childPos, childX, startX }) => {
        const points = Math.abs(startX - childX) > 0.5
          ? [[startX, busY], [childX, busY], [childX, childPos.y]]
          : [[childX, busY], [childX, childPos.y]];
        return {
          childId,
          d: roundedPath(points, 10),
        };
      }),
    };
  });

  return {
    families,
    diagnostics: {
      familyGroups: families.length,
      sharedSiblingBuses: families.filter((family) => family.childIds.length > 1).length,
      sharedMultiRowFamilies: Object.values(groupsByFamily).filter((groups) => groups.length > 1).length,
      verticalColumns: verticalClaims.length,
      maxHorizontalLanes: Math.max(0, ...Object.values(laneCountsByGap)),
    },
  };
}

