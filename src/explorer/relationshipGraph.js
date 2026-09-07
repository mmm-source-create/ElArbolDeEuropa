import { BY_ID, HIJOS_POR_ID, listaAmantes, listaConyuges } from "./model.js";

export function ancestorsOf(id) {
  const set = new Set(BY_ID[id] ? [id] : []);
  const climb = (pid) => {
    if (!pid || set.has(pid) || !BY_ID[pid]) return;
    set.add(pid);
    const persona = BY_ID[pid];
    climb(persona.padre);
    climb(persona.madre);
  };
  const start = BY_ID[id];
  if (start) { climb(start.padre); climb(start.madre); }
  return set;
}

export function descendantsOf(id) {
  const set = new Set(BY_ID[id] ? [id] : []);
  const queue = BY_ID[id] ? [id] : [];
  while (queue.length) {
    const actual = queue.shift();
    (HIJOS_POR_ID[actual] || []).forEach((hijoId) => {
      if (!set.has(hijoId) && BY_ID[hijoId]) {
        set.add(hijoId);
        queue.push(hijoId);
      }
    });
  }
  return set;
}

export const MODOS_COMPARACION = [
  { id: "corto", label: "Camino más corto", descripcion: "Sangre, matrimonios y amantes" },
  { id: "sangre", label: "Solo sangre", descripcion: "Únicamente relaciones padre/madre-hijo" },
  { id: "matrimonio", label: "Sangre + matrimonios", descripcion: "Excluye las relaciones de amantes" },
  { id: "rutas", label: "Rutas relevantes", descripcion: "Hasta seis caminos mínimos alternativos" },
];

export const ALCANCES_FOCO = [
  { id: "cercana", label: "Familia cercana", descripcion: "Padres, hermanos, cónyuges e hijos" },
  { id: "ascendencia", label: "Ascendencia", descripcion: "Todos los antepasados registrados" },
  { id: "descendencia", label: "Descendencia", descripcion: "Todos los descendientes registrados" },
];

export function conjuntoFoco(id, alcance = "cercana") {
  const persona = BY_ID[id];
  if (!persona) return new Set();
  if (alcance === "ascendencia") return ancestorsOf(id);
  if (alcance === "descendencia") return descendantsOf(id);

  const cercanos = new Set([id]);
  [persona.padre, persona.madre].filter((parentId) => BY_ID[parentId]).forEach((parentId) => {
    cercanos.add(parentId);
    (HIJOS_POR_ID[parentId] || []).forEach((siblingId) => { if (BY_ID[siblingId]) cercanos.add(siblingId); });
  });
  listaConyuges(persona).forEach((partnerId) => { if (BY_ID[partnerId]) cercanos.add(partnerId); });
  (HIJOS_POR_ID[id] || []).forEach((childId) => { if (BY_ID[childId]) cercanos.add(childId); });
  return cercanos;
}

export const TIPOS_GRAFO_POR_MODO = {
  corto: new Set(["sangre", "matrimonio", "amante"]),
  sangre: new Set(["sangre"]),
  matrimonio: new Set(["sangre", "matrimonio"]),
  rutas: new Set(["sangre", "matrimonio", "amante"]),
};

export function buildGraph(people) {
  const idsConocidos = new Set(people.map((persona) => persona.id));
  const adj = Object.fromEntries(people.map((persona) => [persona.id, new Map()]));
  const addPair = (a, b, tipo) => {
    if (!a || !b || a === b || !idsConocidos.has(a) || !idsConocidos.has(b)) return;
    const registrar = (origen, destino) => {
      const tipos = adj[origen].get(destino) || new Set();
      tipos.add(tipo);
      adj[origen].set(destino, tipos);
    };
    registrar(a, b);
    registrar(b, a);
  };

  people.forEach((persona) => {
    addPair(persona.id, persona.padre, "sangre");
    addPair(persona.id, persona.madre, "sangre");
    listaConyuges(persona).forEach((id) => addPair(persona.id, id, "matrimonio"));
    listaAmantes(persona).forEach((id) => addPair(persona.id, id, "amante"));
  });

  return Object.fromEntries(
    Object.entries(adj).map(([id, vecinos]) => [
      id,
      [...vecinos.entries()].map(([vecinoId, tipos]) => ({ id: vecinoId, tipos: [...tipos] })),
    ])
  );
}

export function tipoRelacionEntre(origenId, destinoId) {
  const origen = BY_ID[origenId];
  const destino = BY_ID[destinoId];
  if (!origen || !destino) return "relación";
  if (origen.padre === destinoId) return "padre";
  if (origen.madre === destinoId) return "madre";
  if (destino.padre === origenId || destino.madre === origenId) return "hijo/a";
  if (listaConyuges(origen).includes(destinoId) || listaConyuges(destino).includes(origenId)) return "cónyuge";
  if (listaAmantes(origen).includes(destinoId) || listaAmantes(destino).includes(origenId)) return "amante";
  return "familia";
}

export function vecinosPermitidos(graph, id, tiposPermitidos) {
  return (graph[id] || []).filter((vecino) =>
    vecino.tipos.some((tipo) => tiposPermitidos.has(tipo))
  );
}

export function bfsPath(graph, start, end, tiposPermitidos) {
  if (!start || !end) return null;
  if (start === end) return [start];
  const visited = new Set([start]);
  const prev = {};
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const vecino of vecinosPermitidos(graph, cur, tiposPermitidos)) {
      const nb = vecino.id;
      if (visited.has(nb)) continue;
      visited.add(nb);
      prev[nb] = cur;
      if (nb === end) {
        const path = [nb];
        let actual = nb;
        while (actual !== start) {
          actual = prev[actual];
          path.unshift(actual);
        }
        return path;
      }
      queue.push(nb);
    }
  }
  return null;
}

export function allShortestPaths(graph, start, end, tiposPermitidos, maxPaths = 6) {
  if (!start || !end) return [];
  if (start === end) return [[start]];

  const distance = { [start]: 0 };
  const predecessors = {};
  const queue = [start];
  let targetDistance = Infinity;

  while (queue.length) {
    const current = queue.shift();
    const currentDistance = distance[current];
    if (currentDistance >= targetDistance) continue;

    for (const vecino of vecinosPermitidos(graph, current, tiposPermitidos)) {
      const next = vecino.id;
      const nextDistance = currentDistance + 1;
      if (distance[next] === undefined) {
        distance[next] = nextDistance;
        predecessors[next] = [current];
        if (next === end) targetDistance = nextDistance;
        queue.push(next);
      } else if (distance[next] === nextDistance) {
        (predecessors[next] ||= []).push(current);
      }
    }
  }

  if (distance[end] === undefined) return [];
  const paths = [];
  const currentPath = [end];
  const build = (node) => {
    if (paths.length >= maxPaths) return;
    if (node === start) {
      paths.push([...currentPath].reverse());
      return;
    }
    const prevs = (predecessors[node] || []).slice().sort((a, b) =>
      (BY_ID[a]?.nombre || a).localeCompare(BY_ID[b]?.nombre || b, "es")
    );
    for (const prev of prevs) {
      currentPath.push(prev);
      build(prev);
      currentPath.pop();
      if (paths.length >= maxPaths) break;
    }
  };
  build(end);
  return paths;
}

export function rutasDeComparacion(graph, start, end, modo) {
  const tipos = TIPOS_GRAFO_POR_MODO[modo] || TIPOS_GRAFO_POR_MODO.corto;
  if (modo === "rutas") return allShortestPaths(graph, start, end, tipos, 6);
  const path = bfsPath(graph, start, end, tipos);
  return path ? [path] : [];
}

export function computeParentGroups(people, gen) {
  const parentGroups = {};
  people.forEach((p) => {
    if (!p.padre && !p.madre) return;
    const parentIds = [p.padre, p.madre].filter((id) => id && gen[id] !== undefined);
    if (!parentIds.length) return;

    // La clave base usa el conjunto EXACTO de progenitores documentados.
    // Medio hermanos no comparten nunca el carril familiar. Los hermanos
    // completos sí pueden compartirlo aunque su ficha caiga en otra generación.
    const familyBaseKey = parentIds.length === 2
      ? parentIds.slice().sort().join("|")
      : `${parentIds[0]}|progenitor-unico|${p.id}`;
    const key = `${familyBaseKey}@${gen[p.id]}`;
    if (!parentGroups[key]) parentGroups[key] = { familyBaseKey, parentIds, childIds: [] };
    parentGroups[key].childIds.push(p.id);
  });
  const groupsByRow = {};
  Object.values(parentGroups).forEach((g) => {
    const r = Math.max(...g.parentIds.map((id) => gen[id]));
    if (!groupsByRow[r]) groupsByRow[r] = [];
    groupsByRow[r].push(g);
  });
  return groupsByRow;
}

