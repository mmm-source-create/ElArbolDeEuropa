const TIPOS_REINADO_NO_EFECTIVOS = new Set(["titular", "pretensión", "pretension"]);
const DINASTIAS_GENERICAS = new Set(["", "Sin casa identificada", "Desconocida", "Familias menores"]);

function barajar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function unico(lista) {
  return [...new Set(lista.filter(Boolean))];
}

function elegir(lista) {
  return lista[Math.floor(Math.random() * lista.length)] ?? null;
}

function reinadosEfectivos(persona) {
  if (!Array.isArray(persona?.reinados)) return [];
  return persona.reinados.filter((reinado) => {
    if (!reinado || typeof reinado.territorio !== "string") return false;
    if (!Number.isFinite(reinado.desde) || !Number.isFinite(reinado.hasta)) return false;
    if (reinado.efectivo === false) return false;
    return !TIPOS_REINADO_NO_EFECTIVOS.has(String(reinado.tipo || "").toLowerCase());
  });
}

function categoriaTitulo(persona) {
  const titulo = String(persona?.titulo || "").toLowerCase();
  if (/rey|reina|emperador|emperatriz|soberan/.test(titulo)) return "corona";
  if (/duque|duquesa|archiduque|gran duque/.test(titulo)) return "ducal";
  if (/conde|condesa|marqués|marquesa|landgrave|elector/.test(titulo)) return "nobleza";
  if (/papa/.test(titulo)) return "papado";
  if (/señor|señora|gobernante|regente/.test(titulo)) return "gobierno";
  return "otros";
}

function comparteTerritorio(a, b) {
  const aTerritorios = new Set([...(a?.reinos || []), ...reinadosEfectivos(a).map((r) => r.territorio)]);
  return [...new Set([...(b?.reinos || []), ...reinadosEfectivos(b).map((r) => r.territorio)])]
    .some((territorio) => aTerritorios.has(territorio));
}

function distanciaHistorica(a, b) {
  const anioA = Number.isFinite(a?.nac) ? a.nac : Number.isFinite(a?.muer) ? a.muer - 35 : null;
  const anioB = Number.isFinite(b?.nac) ? b.nac : Number.isFinite(b?.muer) ? b.muer - 35 : null;
  if (!Number.isFinite(anioA) || !Number.isFinite(anioB)) return 180;
  return Math.abs(anioA - anioB);
}

function candidatosPlausibles(persona, personas, excluidos = new Set()) {
  return personas
    .filter((candidato) => candidato?.id && candidato.id !== persona?.id && !excluidos.has(candidato.id))
    .map((candidato) => {
      let puntuacion = distanciaHistorica(persona, candidato);
      if (compartirCasa(persona, candidato)) puntuacion -= 35;
      if (comparteTerritorio(persona, candidato)) puntuacion -= 28;
      if (categoriaTitulo(persona) === categoriaTitulo(candidato)) puntuacion -= 18;
      return { candidato, puntuacion };
    })
    .sort((a, b) => a.puntuacion - b.puntuacion || String(a.candidato.nombre).localeCompare(String(b.candidato.nombre), "es"))
    .map(({ candidato }) => candidato);
}

function compartirCasa(a, b) {
  return a?.dinastia && b?.dinastia && a.dinastia === b.dinastia;
}

function cuatroOpcionesPersonas(correcta, sujeto, personas, excluidos = new Set()) {
  const prohibidos = new Set([correcta.id, sujeto?.id, ...excluidos]);
  const candidatos = candidatosPlausibles(correcta, personas, prohibidos);
  const distractores = [];
  for (const candidato of candidatos) {
    if (distractores.length >= 3) break;
    distractores.push(candidato);
  }
  if (distractores.length < 3) return null;
  return barajar([correcta, ...distractores]).map((persona) => ({ id: persona.id, label: persona.nombre }));
}

function construirIndice(personas) {
  const byId = Object.fromEntries(personas.filter((p) => p?.id).map((p) => [p.id, p]));
  const conyugesInversos = {};
  personas.forEach((persona) => {
    const conyuges = [persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || [])].filter(Boolean);
    conyuges.forEach((id) => {
      if (!byId[id]) return;
      (conyugesInversos[id] ||= new Set()).add(persona.id);
    });
  });
  return { byId, conyugesInversos };
}

function conyugesDe(persona, indice) {
  if (!persona) return [];
  return unico([
    persona.conyuge,
    persona.conyuge2,
    ...(persona.conyuges || []),
    ...[...(indice.conyugesInversos[persona.id] || [])],
  ]).filter((id) => indice.byId[id]);
}

function explicacionPersona(persona) {
  const datos = [];
  if (persona?.dinastia && !DINASTIAS_GENERICAS.has(persona.dinastia)) datos.push(`Casa ${persona.dinastia}`);
  if (Number.isFinite(persona?.nac) || Number.isFinite(persona?.muer)) {
    datos.push(`${Number.isFinite(persona?.nac) ? persona.nac : "?"}–${Number.isFinite(persona?.muer) ? persona.muer : "?"}`);
  }
  const gobiernos = unico(reinadosEfectivos(persona).map((r) => r.territorio));
  if (gobiernos.length) datos.push(`gobierno efectivo: ${gobiernos.slice(0, 3).join(", ")}`);
  return datos.join(" · ");
}

function preguntaDinastia(personas) {
  const candidatos = personas.filter((p) => p?.id && p?.nombre && p?.dinastia && !DINASTIAS_GENERICAS.has(p.dinastia) && Number.isFinite(p.nac));
  const sujeto = elegir(candidatos);
  if (!sujeto) return null;

  const casas = [];
  for (const candidato of candidatosPlausibles(sujeto, personas)) {
    const casa = candidato.dinastia;
    if (!casa || DINASTIAS_GENERICAS.has(casa) || casa === sujeto.dinastia || casas.includes(casa)) continue;
    casas.push(casa);
    if (casas.length === 3) break;
  }
  if (casas.length < 3) return null;

  const correctaId = `dinastia:${sujeto.dinastia}`;
  const opciones = barajar([sujeto.dinastia, ...casas]).map((casa) => ({ id: `dinastia:${casa}`, label: casa }));
  return {
    tipo: "dinastia",
    etiqueta: "Dinastías",
    pregunta: `¿A qué dinastía pertenece ${sujeto.nombre}?`,
    opciones,
    correctaId,
    explicacion: `${sujeto.nombre} figura en la base como miembro de la casa ${sujeto.dinastia}.`,
    atlasPersonId: sujeto.id,
  };
}

function preguntaParentesco(personas, indice) {
  const relaciones = [];
  personas.forEach((persona) => {
    if (!persona?.id || !persona?.nombre) return;
    if (persona.padre && indice.byId[persona.padre]) relaciones.push({ sujeto: persona, correcta: indice.byId[persona.padre], tipo: "padre", etiqueta: "padre" });
    if (persona.madre && indice.byId[persona.madre]) relaciones.push({ sujeto: persona, correcta: indice.byId[persona.madre], tipo: "madre", etiqueta: "madre" });
    conyugesDe(persona, indice).forEach((id) => relaciones.push({ sujeto: persona, correcta: indice.byId[id], tipo: "conyuge", etiqueta: "cónyuge" }));
  });
  const relacion = elegir(relaciones);
  if (!relacion) return null;
  const otrasRelaciones = new Set([
    relacion.sujeto.padre,
    relacion.sujeto.madre,
    ...conyugesDe(relacion.sujeto, indice),
  ].filter(Boolean));
  otrasRelaciones.delete(relacion.correcta.id);
  const opciones = cuatroOpcionesPersonas(relacion.correcta, relacion.sujeto, personas, otrasRelaciones);
  if (!opciones) return null;
  return {
    tipo: "parentesco",
    etiqueta: "Parentescos",
    pregunta: `¿Quién figura como ${relacion.etiqueta} de ${relacion.sujeto.nombre}?`,
    opciones,
    correctaId: relacion.correcta.id,
    explicacion: `${relacion.correcta.nombre} está registrado/a como ${relacion.etiqueta} de ${relacion.sujeto.nombre}.`,
    atlasPersonId: relacion.sujeto.id,
  };
}

function preguntaTerritorio(personas) {
  const gobernantes = personas.filter((p) => reinadosEfectivos(p).length && p?.nombre);
  const sujeto = elegir(gobernantes);
  if (!sujeto) return null;
  const propios = unico(reinadosEfectivos(sujeto).map((r) => r.territorio));
  const correcta = elegir(propios);
  if (!correcta) return null;

  const territorios = [];
  for (const candidato of candidatosPlausibles(sujeto, gobernantes)) {
    for (const territorio of reinadosEfectivos(candidato).map((r) => r.territorio)) {
      if (!territorio || propios.includes(territorio) || territorios.includes(territorio)) continue;
      territorios.push(territorio);
      if (territorios.length === 3) break;
    }
    if (territorios.length === 3) break;
  }
  if (territorios.length < 3) return null;

  const opciones = barajar([correcta, ...territorios]).map((territorio) => ({ id: `territorio:${territorio}`, label: territorio }));
  return {
    tipo: "territorio",
    etiqueta: "Gobierno",
    pregunta: `¿Cuál de estos territorios consta como gobernado efectivamente por ${sujeto.nombre}?`,
    opciones,
    correctaId: `territorio:${correcta}`,
    explicacion: `${sujeto.nombre} tiene un reinado efectivo registrado en ${correcta}. Los vínculos de procedencia o matrimonio no cuentan aquí como gobierno.`,
    atlasPersonId: sujeto.id,
  };
}

function preguntaSobra(personas) {
  const porDinastia = new Map();
  personas.forEach((persona) => {
    if (!persona?.id || !persona?.nombre || !persona?.dinastia || DINASTIAS_GENERICAS.has(persona.dinastia)) return;
    (porDinastia.get(persona.dinastia) || porDinastia.set(persona.dinastia, []).get(persona.dinastia)).push(persona);
  });
  const casas = [...porDinastia.entries()].filter(([, miembros]) => miembros.length >= 3);
  const [dinastia, miembros] = elegir(casas) || [];
  if (!dinastia) return null;

  const centro = elegir(miembros.filter((p) => Number.isFinite(p.nac))) || elegir(miembros);
  if (!centro) return null;
  const tres = [centro];
  for (const miembro of candidatosPlausibles(centro, miembros)) {
    if (miembro.dinastia !== dinastia || tres.some((p) => p.id === miembro.id)) continue;
    tres.push(miembro);
    if (tres.length === 3) break;
  }
  if (tres.length < 3) return null;

  const outsider = candidatosPlausibles(centro, personas, new Set(tres.map((p) => p.id)))
    .find((p) => p.dinastia && p.dinastia !== dinastia && !DINASTIAS_GENERICAS.has(p.dinastia));
  if (!outsider) return null;
  const opciones = barajar([...tres, outsider]).map((p) => ({ id: p.id, label: p.nombre }));
  return {
    tipo: "sobra",
    etiqueta: "Quién sobra",
    pregunta: `Tres de estos personajes pertenecen a la casa ${dinastia}. ¿Quién sobra?`,
    opciones,
    correctaId: outsider.id,
    explicacion: `${outsider.nombre} pertenece a ${outsider.dinastia}; los otros tres personajes pertenecen a ${dinastia}.`,
    atlasPersonId: outsider.id,
  };
}

function preguntaCronologia(personas) {
  const fechados = personas.filter((p) => p?.id && p?.nombre && Number.isFinite(p.nac));
  const centro = elegir(fechados);
  if (!centro) return null;
  const candidatos = [centro, ...candidatosPlausibles(centro, fechados)].filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
  const elegidos = [];
  for (const persona of candidatos) {
    if (elegidos.some((p) => p.nac === persona.nac)) continue;
    if (Math.abs(persona.nac - centro.nac) > 140 && elegidos.length < 3) continue;
    elegidos.push(persona);
    if (elegidos.length === 4) break;
  }
  if (elegidos.length < 4) return null;

  const correcta = elegidos.slice().sort((a, b) => a.nac - b.nac);
  const firma = (orden) => orden.map((p) => p.id).join("|");
  const ordenes = [correcta];
  let guard = 0;
  while (ordenes.length < 4 && guard < 40) {
    guard += 1;
    const propuesta = barajar(correcta);
    if (firma(propuesta) === firma(correcta) || ordenes.some((orden) => firma(orden) === firma(propuesta))) continue;
    ordenes.push(propuesta);
  }
  if (ordenes.length < 4) return null;

  const correctaId = `orden:${firma(correcta)}`;
  const opciones = barajar(ordenes).map((orden) => ({
    id: `orden:${firma(orden)}`,
    label: orden.map((p) => p.nombre).join(" → "),
  }));
  return {
    tipo: "cronologia",
    etiqueta: "Cronología",
    pregunta: "¿Qué secuencia los ordena correctamente por nacimiento, del más antiguo al más reciente?",
    opciones,
    correctaId,
    explicacion: correcta.map((p) => `${p.nombre} (${p.nac})`).join(" → "),
    atlasPersonId: correcta[0].id,
  };
}

function preguntaPistas(personas) {
  const candidatos = personas.filter((p) => {
    const gobiernos = reinadosEfectivos(p);
    return p?.id && p?.nombre && Number.isFinite(p.nac) && p.dinastia && !DINASTIAS_GENERICAS.has(p.dinastia) && p.titulo && gobiernos.length;
  });
  const sujeto = elegir(candidatos);
  if (!sujeto) return null;
  const opciones = cuatroOpcionesPersonas(sujeto, null, personas);
  if (!opciones) return null;
  const gobiernos = unico(reinadosEfectivos(sujeto).map((r) => r.territorio));
  const pistas = [
    `Nació en ${sujeto.nac}`,
    `Casa ${sujeto.dinastia}`,
    `Título: ${sujeto.titulo}`,
    `Gobernó ${elegir(gobiernos)}`,
  ];
  return {
    tipo: "pistas",
    etiqueta: "¿Quién es?",
    pregunta: `¿Quién corresponde a estas pistas? · ${pistas.join(" · ")}`,
    opciones,
    correctaId: sujeto.id,
    explicacion: `${sujeto.nombre}. ${explicacionPersona(sujeto)}.`,
    atlasPersonId: sujeto.id,
  };
}

const GENERADORES = {
  dinastia: (personas) => preguntaDinastia(personas),
  parentesco: (personas, indice) => preguntaParentesco(personas, indice),
  territorio: (personas) => preguntaTerritorio(personas),
  sobra: (personas) => preguntaSobra(personas),
  cronologia: (personas) => preguntaCronologia(personas),
  pistas: (personas) => preguntaPistas(personas),
};

function firmaPregunta(pregunta) {
  return `${pregunta.tipo}|${pregunta.pregunta}|${pregunta.correctaId}`;
}

export function crearPartida(personas, cantidad = 10) {
  const base = Array.isArray(personas) ? personas.filter((p) => p?.id && p?.nombre) : [];
  const indice = construirIndice(base);
  const plan = ["dinastia", "parentesco", "territorio", "sobra", "cronologia", "pistas", "dinastia", "parentesco", "territorio", "pistas"];
  const preguntas = [];
  const usadas = new Set();

  const intentar = (tipo) => {
    const generador = GENERADORES[tipo];
    for (let intento = 0; intento < 24; intento += 1) {
      const pregunta = generador?.(base, indice);
      if (!pregunta) continue;
      const firma = firmaPregunta(pregunta);
      if (usadas.has(firma)) continue;
      usadas.add(firma);
      preguntas.push({ ...pregunta, id: `q-${preguntas.length + 1}-${Math.random().toString(36).slice(2, 8)}` });
      return true;
    }
    return false;
  };

  for (let i = 0; i < cantidad; i += 1) {
    if (intentar(plan[i % plan.length])) continue;
    const alternativas = barajar(Object.keys(GENERADORES));
    if (!alternativas.some((tipo) => intentar(tipo))) break;
  }

  if (preguntas.length < cantidad) {
    throw new Error(`No se han podido generar ${cantidad} preguntas válidas con la base actual.`);
  }
  return preguntas.slice(0, cantidad);
}
