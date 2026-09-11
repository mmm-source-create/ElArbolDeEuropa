import {HISTORIA_DINASTIAS} from "./src/content/dinastias/index.js";
import { sourcesForPerson } from "./src/content/sources.js";
import { TERRITORIOS, componentesDe } from "./src/data/territorios.js";
import fs from "node:fs/promises";
import path from "node:path";
import { aliasesDePersona, biografiaPublicaPersona, contenidoEditorialPersona, resumenCortoPersona, slugBasePersona, slugPublico, tieneContenidoEditorial } from "./src/utils/personPresentation.js";

const ROOT = process.cwd();
const PERSONAS_FILE = path.join(ROOT, "src", "personas.jsx");
const HISTORIAS_FILE = path.join(ROOT, "src", "historiaData.jsx");
const OUTPUT_DIR = path.join(ROOT, "src", "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "treeBase.json");
const META_FILE = path.join(OUTPUT_DIR, "siteMeta.json");

async function importJsxData(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(source, "utf8").toString("base64")}`;
  return import(moduleUrl);
}

const [{ PERSONAS }, { HISTORIAS }] = await Promise.all([
  importJsxData(PERSONAS_FILE),
  importJsxData(HISTORIAS_FILE),
]);
if (!Array.isArray(PERSONAS)) throw new Error("No se ha podido cargar PERSONAS.");
if (!Array.isArray(HISTORIAS)) throw new Error("No se ha podido cargar HISTORIAS.");


const BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p]));

const CONYUGES_INVERSOS = PERSONAS.reduce((acc, persona) => {
  const declarados = [persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || [])].filter(Boolean);
  declarados.forEach((id) => {
    if (!BY_ID[id]) return;
    (acc[id] ||= new Set()).add(persona.id);
  });
  return acc;
}, {});

const HIJOS_POR_ID = PERSONAS.reduce((acc, persona) => {
  [persona.padre, persona.madre].filter(Boolean).forEach((progenitorId) => {
    (acc[progenitorId] ||= []).push(persona.id);
  });
  return acc;
}, {});

// Normaliza las relaciones sin alterar el formato de la base de datos.
// `conyuge` se conserva para una sola unión y `conyuges` para varias.
function listaConyuges(persona) {
  if (!persona) return [];
  return [...new Set([
    persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || []),
    ...[...(CONYUGES_INVERSOS[persona.id] || [])],
  ].filter(Boolean))];
}

function listaAmantes(persona) {
  return [...new Set((persona?.amantes || []).filter(Boolean))];
}

function listaParejas(persona) {
  return [...new Set([...listaConyuges(persona), ...listaAmantes(persona)].filter(Boolean))];
}

function clavePareja(a, b) {
  return [a, b].filter(Boolean).sort().join("|");
}

function mediana(valores) {
  if (!valores.length) return null;
  const ordenados = valores.slice().sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[mitad]
    : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}

const TREE_BOX_W = 190;

const TREE_BOX_H = 70;

const TREE_MINI_MIN_H = 28;

const TREE_UNIT_GAP = 112;

const TREE_ROW_GAP = 190;

const TREE_PAD_X = 92;

const TREE_PAD_TOP = 38;

const TREE_PAD_BOTTOM = 64;

const TREE_ROW_STEP = TREE_BOX_H + TREE_ROW_GAP;

const TREE_COLUMN_STEP = 14;

const TREE_PARTNER_EXIT_BASE = 14;

const TREE_PARTNER_EXIT_STEP = 10;

function computeGenerations(people) {
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

function orderPartnerComponent(ids, adjacency, inputIndex) {
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

function orderPathIds(ids, adjacency, rank) {
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
function createPartnerUnitBlueprint(ids, byId) {
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

function buildRows(people, gen) {
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

function pavaNonDecreasing(targets, weights) {
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

function computeTreeLayout(rows, byId, childrenById) {
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

function reinadosLigero(persona) {
  if (Array.isArray(persona?.reinados)) return persona.reinados.map((r) => ({ ...r }));
  if (Array.isArray(persona?.reinado) && persona.reinado.length >= 2) {
    return [{ territorio: (persona.reinos || [])[0] || null, desde: persona.reinado[0], hasta: persona.reinado[1] }];
  }
  return [];
}

const PERSONA_SLUG_BASE_COUNT = PERSONAS.reduce((acc, persona) => {
  const base = slugBasePersona(persona, "es");
  acc[base] = (acc[base] || 0) + 1;
  return acc;
}, {});

const PERSONA_SLUG_POR_ID = Object.fromEntries(PERSONAS.map((persona) => {
  const base = slugBasePersona(persona, "es");
  const slug = PERSONA_SLUG_BASE_COUNT[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base;
  return [persona.id, slug];
}));

function referenciaPersona(id) {
  const persona = BY_ID[id];
  if (!persona) return null;
  return {
    id: persona.id,
    nombre: persona.nombre,
    slug: PERSONA_SLUG_POR_ID[persona.id],
    sobrenombre: persona.sobrenombre || "",
    aliases: aliasesDePersona(persona),
    documentacion: persona.documentacion || null,
    resumen: resumenCortoPersona(persona),
    dinastia: persona.dinastia || "",
    titulo: persona.titulo || "",
    nac: Number.isFinite(persona.nac) ? persona.nac : null,
    muer: Number.isFinite(persona.muer) ? persona.muer : null,
    nacAprox: Boolean(persona.nacAprox),
    muerAprox: Boolean(persona.muerAprox),
    reinos: Array.isArray(persona.reinos) ? persona.reinos : [],
  };
}

function relevanciaPublica(persona) {
  if (!persona) return 0;
  const titulo = String(persona.titulo || "").toLowerCase();
  let score = 0;
  if (/emperador|emperatriz/.test(titulo)) score += 16;
  else if (/rey|reina|soberan/.test(titulo)) score += 13;
  else if (/duque|duquesa|elector|regente|papa/.test(titulo)) score += 8;
  else if (/conde|condesa|marqu|príncipe|principe|princesa/.test(titulo)) score += 5;
  score += Math.min(10, reinadosLigero(persona).length * 2);
  score += Math.min(8, (HIJOS_POR_ID[persona.id] || []).length);
  if (tieneContenidoEditorial(persona)) {
    const editorial = contenidoEditorialPersona(persona);
    const longitud = String(editorial.biografia || editorial.resumen || "").length;
    score += Math.min(5, Math.max(1, Math.ceil(longitud / 220)));
  }
  if (persona.sobrenombre) score += 1;
  return score;
}

const HISTORIAS_DISPONIBLES = HISTORIAS.filter((historia) => historia?.disponible && Array.isArray(historia.pasos) && historia.pasos.length);
const HISTORIAS_POR_PERSONA = {};
HISTORIAS_DISPONIBLES.forEach((historia) => {
  const ids = new Set();
  historia.pasos.forEach((paso) => {
    if (paso?.persona) ids.add(paso.persona);
    (paso?.personas || []).forEach((id) => ids.add(id));
  });
  ids.forEach((id) => {
    if (!BY_ID[id]) return;
    (HISTORIAS_POR_PERSONA[id] ||= []).push({
      id: historia.id,
      titulo: historia.titulo,
      subtitulo: historia.subtitulo || historia.descripcion || "",
      slug: slugPublico(historia.titulo),
    });
  });
});

function familiaDirectaIds(persona) {
  return new Set([
    persona?.id,
    persona?.padre,
    persona?.madre,
    ...listaConyuges(persona),
    ...listaAmantes(persona),
    ...(HIJOS_POR_ID[persona?.id] || []),
  ].filter(Boolean));
}

function centroCronologico(persona) {
  if (Number.isFinite(persona?.nac) && Number.isFinite(persona?.muer)) return (persona.nac + persona.muer) / 2;
  if (Number.isFinite(persona?.nac)) return persona.nac + 30;
  if (Number.isFinite(persona?.muer)) return persona.muer - 30;
  return null;
}

function solapanVida(a, b) {
  const aIni = Number.isFinite(a?.nac) ? a.nac : Number.isFinite(a?.muer) ? a.muer - 60 : null;
  const aFin = Number.isFinite(a?.muer) ? a.muer : Number.isFinite(a?.nac) ? a.nac + 65 : null;
  const bIni = Number.isFinite(b?.nac) ? b.nac : Number.isFinite(b?.muer) ? b.muer - 60 : null;
  const bFin = Number.isFinite(b?.muer) ? b.muer : Number.isFinite(b?.nac) ? b.nac + 65 : null;
  if (![aIni, aFin, bIni, bFin].every(Number.isFinite)) return false;
  return aIni <= bFin && bIni <= aFin;
}

function territoriosCompartidos(a, b) {
  const set = new Set(a?.reinos || []);
  return (b?.reinos || []).filter((r) => set.has(r)).length;
}

function relacionadosDinastia(persona, limite = 6) {
  if (!persona?.dinastia) return [];
  const excluir = familiaDirectaIds(persona);
  const centro = centroCronologico(persona);
  return PERSONAS
    .filter((p) => p?.id && p.dinastia === persona.dinastia && !excluir.has(p.id))
    .map((p) => ({
      persona: p,
      distancia: Number.isFinite(centro) && Number.isFinite(centroCronologico(p)) ? Math.abs(centroCronologico(p) - centro) : 999,
      relevancia: relevanciaPublica(p),
    }))
    .sort((a, b) => a.distancia - b.distancia || b.relevancia - a.relevancia || a.persona.nombre.localeCompare(b.persona.nombre, "es"))
    .slice(0, limite)
    .map(({ persona: p }) => referenciaPersona(p.id));
}

function contemporaneos(persona, limite = 6) {
  const excluir = familiaDirectaIds(persona);
  const centro = centroCronologico(persona);
  return PERSONAS
    .filter((p) => p?.id && !excluir.has(p.id) && solapanVida(persona, p))
    .map((p) => ({
      persona: p,
      compartidos: territoriosCompartidos(persona, p),
      distancia: Number.isFinite(centro) && Number.isFinite(centroCronologico(p)) ? Math.abs(centroCronologico(p) - centro) : 999,
      relevancia: relevanciaPublica(p),
    }))
    .sort((a, b) => b.compartidos - a.compartidos || b.relevancia - a.relevancia || a.distancia - b.distancia || a.persona.nombre.localeCompare(b.persona.nombre, "es"))
    .slice(0, limite)
    .map(({ persona: p }) => referenciaPersona(p.id));
}

function catalogoPersonas() {
  return PERSONAS
    .map((p) => referenciaPersona(p.id))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

function catalogoAgrupado(valores, selector) {
  return [...new Set(valores.filter(Boolean))]
    .map((nombre) => {
      const miembros = PERSONAS.filter((p) => selector(p, nombre));
      const destacados = miembros
        .slice()
        .sort((a, b) => relevanciaPublica(b) - relevanciaPublica(a) || (a.nac ?? 9999) - (b.nac ?? 9999) || a.nombre.localeCompare(b.nombre, "es"))
        .slice(0, 6)
        .map((p) => referenciaPersona(p.id));
      return { nombre, slug: slugPublico(nombre), total: miembros.length, miembros: destacados };
    })
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
}

async function generarPortadasPersona() {
  const personaDir = path.join(ROOT, "public", "personas-meta");
  await fs.rm(personaDir, { recursive: true, force: true });
  await fs.mkdir(personaDir, { recursive: true });
  await fs.writeFile(path.join(personaDir, "index.json"), JSON.stringify(PERSONA_SLUG_POR_ID), "utf8");

  await Promise.all(PERSONAS.map(async (persona) => {
    const padres = [persona.padre, persona.madre].filter(Boolean).map(referenciaPersona).filter(Boolean);
    const conyuges = listaConyuges(persona).map(referenciaPersona).filter(Boolean);
    const hijos = (HIJOS_POR_ID[persona.id] || []).map(referenciaPersona).filter(Boolean);
    const meta = {
      id: persona.id,
      slug: PERSONA_SLUG_POR_ID[persona.id],
      nombre: persona.nombre,
      sobrenombre: persona.sobrenombre || "",
      aliases: aliasesDePersona(persona),
      resumen: resumenCortoPersona(persona),
      dinastia: persona.dinastia || "",
      titulo: persona.titulo || "",
      nac: Number.isFinite(persona.nac) ? persona.nac : null,
      muer: Number.isFinite(persona.muer) ? persona.muer : null,
      documentacion: persona.documentacion || null,
      nacAprox: Boolean(persona.nacAprox),
      muerAprox: Boolean(persona.muerAprox),
      reinos: Array.isArray(persona.reinos) ? persona.reinos : [],
      reinados: reinadosLigero(persona),
      biografia: biografiaPublicaPersona(persona),
      fuentes: sourcesForPerson(persona.id),
      padres,
      conyuges,
      hijos,
      relacionadosDinastia: relacionadosDinastia(persona),
      contemporaneos: contemporaneos(persona),
      historias: HISTORIAS_POR_PERSONA[persona.id] || [],
    };
    await fs.writeFile(path.join(personaDir, `${meta.slug}.json`), JSON.stringify(meta), "utf8");
  }));
}

async function generarCatalogosPublicos() {
  const catalogoDir = path.join(ROOT, "public", "catalogos");
  await fs.rm(catalogoDir, { recursive: true, force: true });
  await fs.mkdir(catalogoDir, { recursive: true });

  const personas = catalogoPersonas();
  const dinastias = catalogoAgrupado(PERSONAS.map((p) => p.dinastia), (p, nombre) => p.dinastia === nombre).map(d=>({...d,editorial:Boolean(HISTORIA_DINASTIAS[d.nombre]),resumen:HISTORIA_DINASTIAS[d.nombre]?.resumen||""}));
  const territoriosValores = Object.keys(TERRITORIOS);
  const territorios = catalogoAgrupado(territoriosValores, (p, nombre) => (p.reinos || []).some(t => [nombre, ...componentesDe(nombre)].includes(t)));
  const historias = HISTORIAS.map((historia) => ({
    id: historia.id,
    titulo: historia.titulo,
    subtitulo: historia.subtitulo || "",
    descripcion: historia.descripcion || "",
    slug: slugPublico(historia.titulo),
    disponible: Boolean(historia.disponible && Array.isArray(historia.pasos) && historia.pasos.length),
    pasos: Array.isArray(historia.pasos) ? historia.pasos.length : 0,
  }));

  const destacadosIds = ["FED2HOH", "EDUARDO3ING", "ISAB1CAST", "CARLOS5", "LUIS14FRA", "CATHERINE2RUS"];
  const personasDestacadas = destacadosIds.map(referenciaPersona).filter(Boolean);
  if (personasDestacadas.length < 6) {
    const existentes = new Set(personasDestacadas.map((p) => p.id));
    PERSONAS.slice().sort((a, b) => relevanciaPublica(b) - relevanciaPublica(a)).forEach((p) => {
      if (personasDestacadas.length >= 6 || existentes.has(p.id)) return;
      existentes.add(p.id);
      personasDestacadas.push(referenciaPersona(p.id));
    });
  }

  const home = {
    stats: {
      personas: PERSONAS.length,
      dinastias: dinastias.length,
      territorios: territorios.length,
      historias: historias.filter((h) => h.disponible).length,
    },
    personasDestacadas,
    dinastiasDestacadas: dinastias.slice(0, 6),
    territoriosDestacados: territorios.slice(0, 6),
    historiasDestacadas: historias.filter((h) => h.disponible).slice(0, 6),
  };

  await Promise.all([
    fs.writeFile(path.join(catalogoDir, "personas.json"), JSON.stringify({ items: personas }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "dinastias.json"), JSON.stringify({ items: dinastias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "territorios.json"), JSON.stringify({ items: territorios }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "historias.json"), JSON.stringify({ items: historias }), "utf8"),
    fs.writeFile(path.join(catalogoDir, "home.json"), JSON.stringify(home), "utf8"),
    fs.writeFile(path.join(ROOT, "src", "generated", "home.json"), JSON.stringify(home), "utf8"),
  ]);

  return { dinastias: dinastias.length, territorios: territorios.length, historias: historias.filter((h) => h.disponible).length };
}

const gen = computeGenerations(PERSONAS);
const rows = buildRows(PERSONAS, gen);
const layout = computeTreeLayout(rows, BY_ID, HIJOS_POR_ID);

await fs.mkdir(OUTPUT_DIR, { recursive: true });
const catalogStats = await generarCatalogosPublicos();
await fs.writeFile(OUTPUT_FILE, JSON.stringify({ gen, rows, layout }), "utf8");
await fs.writeFile(META_FILE, JSON.stringify({
  personCount: PERSONAS.length,
  dynastyCount: catalogStats.dinastias,
  territoryCount: catalogStats.territorios,
  storyCount: catalogStats.historias,
  buildVersion: Date.now(),
}), "utf8");
await generarPortadasPersona();

console.log(`treeBase.json generado: ${PERSONAS.length} personas, ${rows.length} generaciones, canvas ${Math.round(layout.width)}x${Math.round(layout.height)}`);
console.log(`Portadas ligeras generadas: ${PERSONAS.length} fichas + índice en public/personas-meta/`);
console.log(`Catálogos públicos generados: ${catalogStats.dinastias} dinastías · ${catalogStats.territorios} territorios · ${catalogStats.historias} historias disponibles`);
