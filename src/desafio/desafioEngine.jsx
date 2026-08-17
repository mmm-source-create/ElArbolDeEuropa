const TIPOS_REINADO_NO_EFECTIVOS = new Set(["titular", "pretensión", "pretension"]);
const DINASTIAS_GENERICAS = new Set(["", "Sin casa identificada", "Desconocida", "Familias menores"]);
const PALABRAS_VACIAS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "casa", "dinastia", "dinastía"]);

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

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokensSignificativos(valor) {
  return normalizarTexto(valor)
    .split(" ")
    .filter((token) => token.length >= 4 && !PALABRAS_VACIAS.has(token));
}

function textoContieneRespuesta(texto, respuesta) {
  const textoNorm = ` ${normalizarTexto(texto)} `;
  const respuestaNorm = normalizarTexto(respuesta);
  if (!respuestaNorm || respuestaNorm.length < 3) return false;
  if (textoNorm.includes(` ${respuestaNorm} `)) return true;
  if (respuestaNorm.length < 4) return false;
  const tokens = tokensSignificativos(respuesta);
  return tokens.length > 0 && tokens.some((token) => textoNorm.includes(` ${token} `));
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
  if (/\b(rey|reina|emperador|emperatriz|soberano|soberana)\b/.test(titulo)) return "corona";
  if (/\b(duque|duquesa|archiduque|archiduquesa|gran duque|gran duquesa)\b/.test(titulo)) return "ducal";
  if (/\b(conde|condesa|marqués|marquesa|landgrave|elector|electora)\b/.test(titulo)) return "nobleza";
  if (/\bpapa\b/.test(titulo)) return "papado";
  if (/\b(señor|señora|gobernante|regente)\b/.test(titulo)) return "gobierno";
  return "otros";
}

function sexoPorTitulo(persona) {
  const titulo = normalizarTexto(persona?.titulo);
  if (!titulo) return null;
  if (/\b(reina|emperatriz|duquesa|archiduquesa|condesa|marquesa|senora|soberana|princesa|infanta|electora)\b/.test(titulo)) return "F";
  if (/\b(papa|rey|emperador|duque|archiduque|conde|marques|senor|soberano|principe|infante|elector)\b/.test(titulo)) return "M";
  return null;
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

function compartirCasa(a, b) {
  return a?.dinastia && b?.dinastia && a.dinastia === b.dinastia;
}

function candidatosPlausibles(persona, personas, excluidos = new Set(), { sexo = null, indice = null } = {}) {
  return personas
    .filter((candidato) => {
      if (!candidato?.id || candidato.id === persona?.id || excluidos.has(candidato.id)) return false;
      if (sexo && indice?.sexo?.[candidato.id] !== sexo) return false;
      return true;
    })
    .map((candidato) => {
      let puntuacion = distanciaHistorica(persona, candidato);
      if (compartirCasa(persona, candidato)) puntuacion -= 35;
      if (comparteTerritorio(persona, candidato)) puntuacion -= 28;
      if (categoriaTitulo(persona) === categoriaTitulo(candidato)) puntuacion -= 18;
      if (sexo && indice?.sexo?.[candidato.id] === sexo) puntuacion -= 6;
      return { candidato, puntuacion };
    })
    .sort((a, b) => a.puntuacion - b.puntuacion || String(a.candidato.nombre).localeCompare(String(b.candidato.nombre), "es"))
    .map(({ candidato }) => candidato);
}

function seleccionarDistractoresPersonas(correcta, sujeto, personas, indice, {
  excluidos = new Set(),
  sexo = null,
  maxDistanciaPreferida = 110,
} = {}) {
  const prohibidos = new Set([correcta.id, sujeto?.id, ...excluidos]);
  const candidatos = candidatosPlausibles(correcta, personas, prohibidos, { sexo, indice });
  const cercanos = candidatos.filter((p) => distanciaHistorica(correcta, p) <= maxDistanciaPreferida);
  const ordenados = [...cercanos, ...candidatos.filter((p) => !cercanos.includes(p))];
  const distractores = [];
  for (const candidato of ordenados) {
    if (distractores.some((p) => normalizarTexto(p.nombre) === normalizarTexto(candidato.nombre))) continue;
    distractores.push(candidato);
    if (distractores.length === 3) break;
  }
  return distractores.length === 3 ? distractores : null;
}

function cuatroOpcionesPersonas(correcta, sujeto, personas, indice, opciones = {}) {
  const distractores = seleccionarDistractoresPersonas(correcta, sujeto, personas, indice, opciones);
  if (!distractores) return null;
  return barajar([correcta, ...distractores]).map((persona) => ({ id: persona.id, label: persona.nombre }));
}

function construirIndice(personas) {
  const byId = Object.fromEntries(personas.filter((p) => p?.id).map((p) => [p.id, p]));
  const conyugesInversos = {};
  const sexo = {};

  const marcarSexo = (id, valor) => {
    if (!id || !byId[id] || !valor) return false;
    if (sexo[id] && sexo[id] !== valor) return false;
    if (sexo[id] === valor) return false;
    sexo[id] = valor;
    return true;
  };

  personas.forEach((persona) => {
    if (!persona?.id) return;
    if (persona.padre) marcarSexo(persona.padre, "M");
    if (persona.madre) marcarSexo(persona.madre, "F");
    marcarSexo(persona.id, sexoPorTitulo(persona));

    const conyuges = [persona?.conyuge, persona?.conyuge2, ...(persona?.conyuges || [])].filter(Boolean);
    conyuges.forEach((id) => {
      if (!byId[id]) return;
      (conyugesInversos[id] ||= new Set()).add(persona.id);
    });
  });

  const conyugesIds = (persona) => unico([
    persona?.conyuge,
    persona?.conyuge2,
    ...(persona?.conyuges || []),
    ...[...(conyugesInversos[persona?.id] || [])],
  ]).filter((id) => byId[id]);

  // Propagación prudente: en la base genealógica actual las uniones registradas
  // son heterosexuales. Solo se usa para filtrar distractores, nunca para mostrar
  // un dato biográfico nuevo en la interfaz.
  for (let vuelta = 0; vuelta < 6; vuelta += 1) {
    let cambio = false;
    personas.forEach((persona) => {
      if (!persona?.id) return;
      const sexoPersona = sexo[persona.id];
      conyugesIds(persona).forEach((conyugeId) => {
        if (sexoPersona === "M") cambio = marcarSexo(conyugeId, "F") || cambio;
        else if (sexoPersona === "F") cambio = marcarSexo(conyugeId, "M") || cambio;
        else if (sexo[conyugeId] === "M") cambio = marcarSexo(persona.id, "F") || cambio;
        else if (sexo[conyugeId] === "F") cambio = marcarSexo(persona.id, "M") || cambio;
      });
    });
    if (!cambio) break;
  }

  return { byId, conyugesInversos, sexo };
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

function preguntaDinastia(personas, indice) {
  const candidatos = personas.filter((p) => {
    if (!p?.id || !p?.nombre || !p?.dinastia || DINASTIAS_GENERICAS.has(p.dinastia) || !Number.isFinite(p.nac)) return false;
    return !textoContieneRespuesta(p.nombre, p.dinastia);
  });
  const sujeto = elegir(candidatos);
  if (!sujeto) return null;

  const casas = [];
  for (const candidato of candidatosPlausibles(sujeto, personas, new Set(), { sexo: indice.sexo[sujeto.id] || null, indice })) {
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
    if (persona.padre && indice.byId[persona.padre]) {
      relaciones.push({ sujeto: persona, correcta: indice.byId[persona.padre], tipo: "padre", etiqueta: "padre", sexo: "M" });
    }
    if (persona.madre && indice.byId[persona.madre]) {
      relaciones.push({ sujeto: persona, correcta: indice.byId[persona.madre], tipo: "madre", etiqueta: "madre", sexo: "F" });
    }
    const sexoSujeto = indice.sexo[persona.id];
    conyugesDe(persona, indice).forEach((id) => {
      const correcta = indice.byId[id];
      const sexoCorrecta = indice.sexo[id];
      const sexoEsperado = sexoSujeto === "M" ? "F" : sexoSujeto === "F" ? "M" : sexoCorrecta || null;
      if (!sexoEsperado || sexoCorrecta !== sexoEsperado) return;
      relaciones.push({ sujeto: persona, correcta, tipo: "conyuge", etiqueta: "cónyuge", sexo: sexoEsperado });
    });
  });

  const relacion = elegir(relaciones);
  if (!relacion) return null;
  const otrasRelaciones = new Set([
    relacion.sujeto.padre,
    relacion.sujeto.madre,
    ...conyugesDe(relacion.sujeto, indice),
  ].filter(Boolean));
  otrasRelaciones.delete(relacion.correcta.id);

  const opciones = cuatroOpcionesPersonas(relacion.correcta, relacion.sujeto, personas, indice, {
    excluidos: otrasRelaciones,
    sexo: relacion.sexo,
    maxDistanciaPreferida: 90,
  });
  if (!opciones) return null;
  return {
    tipo: "parentesco",
    etiqueta: "Parentescos",
    pregunta: `¿Quién figura como ${relacion.etiqueta} de ${relacion.sujeto.nombre}?`,
    opciones,
    correctaId: relacion.correcta.id,
    explicacion: `${relacion.correcta.nombre} está registrado/a como ${relacion.etiqueta} de ${relacion.sujeto.nombre}.`,
    atlasPersonId: relacion.sujeto.id,
    meta: { sexoOpciones: relacion.sexo },
  };
}

function preguntaTerritorio(personas, indice) {
  const gobernantes = personas.filter((p) => reinadosEfectivos(p).length && p?.nombre);
  const sujetos = barajar(gobernantes);
  for (const sujeto of sujetos) {
    const propios = unico(reinadosEfectivos(sujeto).map((r) => r.territorio));
    const candidatasCorrectas = propios.filter((territorio) => !textoContieneRespuesta(sujeto.nombre, territorio));
    const correcta = elegir(candidatasCorrectas);
    if (!correcta) continue;

    const territorios = [];
    for (const candidato of candidatosPlausibles(sujeto, gobernantes, new Set(), { sexo: indice.sexo[sujeto.id] || null, indice })) {
      for (const territorio of reinadosEfectivos(candidato).map((r) => r.territorio)) {
        if (!territorio || propios.includes(territorio) || territorios.includes(territorio)) continue;
        territorios.push(territorio);
        if (territorios.length === 3) break;
      }
      if (territorios.length === 3) break;
    }
    if (territorios.length < 3) continue;

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
  return null;
}

function preguntaSobra(personas, indice) {
  const porDinastia = new Map();
  personas.forEach((persona) => {
    if (!persona?.id || !persona?.nombre || !persona?.dinastia || DINASTIAS_GENERICAS.has(persona.dinastia)) return;
    if (textoContieneRespuesta(persona.nombre, persona.dinastia)) return;
    if (!porDinastia.has(persona.dinastia)) porDinastia.set(persona.dinastia, []);
    porDinastia.get(persona.dinastia).push(persona);
  });

  const casas = barajar([...porDinastia.entries()].filter(([, miembros]) => miembros.length >= 3));
  for (const [dinastia, miembros] of casas) {
    const centro = elegir(miembros.filter((p) => Number.isFinite(p.nac))) || elegir(miembros);
    if (!centro) continue;
    const tres = [centro];
    for (const miembro of candidatosPlausibles(centro, miembros, new Set(), { indice })) {
      if (miembro.dinastia !== dinastia || tres.some((p) => p.id === miembro.id)) continue;
      if (textoContieneRespuesta(miembro.nombre, dinastia)) continue;
      tres.push(miembro);
      if (tres.length === 3) break;
    }
    if (tres.length < 3) continue;

    const outsider = candidatosPlausibles(centro, personas, new Set(tres.map((p) => p.id)), { indice })
      .find((p) => p.dinastia
        && p.dinastia !== dinastia
        && !DINASTIAS_GENERICAS.has(p.dinastia)
        && !textoContieneRespuesta(p.nombre, dinastia));
    if (!outsider) continue;

    const opciones = barajar([...tres, outsider]).map((p) => ({ id: p.id, label: p.nombre }));
    return {
      tipo: "sobra",
      etiqueta: "Quién sobra",
      pregunta: `Tres de estos personajes pertenecen a la casa ${dinastia}. ¿Quién sobra?`,
      opciones,
      correctaId: outsider.id,
      explicacion: `${outsider.nombre} pertenece a ${outsider.dinastia}; los otros tres personajes pertenecen a ${dinastia}.`,
      atlasPersonId: outsider.id,
      meta: { dinastiaObjetivo: dinastia },
    };
  }
  return null;
}

function ventanasSucesion(personas) {
  const porTerritorio = new Map();
  personas.forEach((persona) => {
    const porPersona = new Map();
    reinadosEfectivos(persona).forEach((reinado) => {
      const existente = porPersona.get(reinado.territorio);
      if (!existente || reinado.desde < existente.desde) porPersona.set(reinado.territorio, reinado);
    });
    porPersona.forEach((reinado, territorio) => {
      if (!porTerritorio.has(territorio)) porTerritorio.set(territorio, []);
      porTerritorio.get(territorio).push({ persona, desde: reinado.desde });
    });
  });

  const ventanas = [];
  porTerritorio.forEach((entradas, territorio) => {
    const ordenadas = entradas
      .filter(({ persona }) => categoriaTitulo(persona) !== "otros")
      .sort((a, b) => a.desde - b.desde || String(a.persona.nombre).localeCompare(String(b.persona.nombre), "es"));

    for (let i = 0; i <= ordenadas.length - 3; i += 1) {
      const trio = ordenadas.slice(i, i + 3);
      const inicios = trio.map((x) => x.desde);
      if (new Set(inicios).size !== 3) continue;
      if (inicios[2] - inicios[0] > 180) continue;
      if (new Set(trio.map((x) => normalizarTexto(x.persona.nombre))).size !== 3) continue;
      ventanas.push({ territorio, trio });
    }
  });
  return ventanas;
}

function preguntaSucesion(personas) {
  const ventana = elegir(ventanasSucesion(personas));
  if (!ventana) return null;
  const correcta = ventana.trio.slice().sort((a, b) => a.desde - b.desde);
  const firma = (orden) => orden.map((x) => x.persona.id).join("|");
  const ordenes = [correcta];
  let guard = 0;
  while (ordenes.length < 4 && guard < 40) {
    guard += 1;
    const propuesta = barajar(correcta);
    if (ordenes.some((orden) => firma(orden) === firma(propuesta))) continue;
    ordenes.push(propuesta);
  }
  if (ordenes.length < 4) return null;

  const correctaId = `orden:${firma(correcta)}`;
  const opciones = barajar(ordenes).map((orden) => ({
    id: `orden:${firma(orden)}`,
    label: orden.map((x) => x.persona.nombre).join(" → "),
  }));

  return {
    tipo: "sucesion",
    etiqueta: "Sucesión",
    pregunta: `¿Qué secuencia ordena correctamente a estos gobernantes de ${ventana.territorio} por el inicio de su gobierno?`,
    opciones,
    correctaId,
    explicacion: correcta.map((x) => `${x.persona.nombre} (${x.desde})`).join(" → "),
    atlasPersonId: correcta[0].persona.id,
  };
}

function preguntaPistas(personas, indice) {
  const candidatos = barajar(personas.filter((p) => {
    const gobiernos = reinadosEfectivos(p);
    if (!p?.id || !p?.nombre || !Number.isFinite(p.nac) || !p.dinastia || DINASTIAS_GENERICAS.has(p.dinastia) || !p.titulo || !gobiernos.length) return false;
    // Si el nombre ya contiene la casa («Beatriz de Borgoña»), la pista dinástica
    // convertiría la pregunta en un regalo. Esos casos se reservan para otros tipos.
    return !textoContieneRespuesta(p.nombre, p.dinastia);
  }));

  for (const sujeto of candidatos) {
    const gobiernos = unico(reinadosEfectivos(sujeto).map((r) => r.territorio))
      .filter((territorio) => !textoContieneRespuesta(sujeto.nombre, territorio));
    const gobiernoPista = elegir(gobiernos);
    if (!gobiernoPista) continue;

    const sexo = indice.sexo[sujeto.id] || null;
    const opciones = cuatroOpcionesPersonas(sujeto, null, personas, indice, { sexo, maxDistanciaPreferida: 90 });
    if (!opciones) continue;
    const pistas = [
      `Nació en ${sujeto.nac}`,
      `Casa ${sujeto.dinastia}`,
      `Título: ${sujeto.titulo}`,
      `Gobernó ${gobiernoPista}`,
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
  return null;
}

function preguntaSobrenombre(personas, indice) {
  const candidatos = personas.filter((p) => p?.id && p?.nombre && typeof p.sobrenombre === "string" && p.sobrenombre.trim()
    && !textoContieneRespuesta(p.nombre, p.sobrenombre));
  const sujeto = elegir(candidatos);
  if (!sujeto) return null;
  const correcta = sujeto.sobrenombre.trim();

  const sexo = indice.sexo[sujeto.id] || null;
  const plausibles = candidatosPlausibles(sujeto, candidatos, new Set(), { sexo, indice });
  const apodos = [];
  for (const candidato of plausibles) {
    const apodo = String(candidato.sobrenombre || "").trim();
    if (!apodo || normalizarTexto(apodo) === normalizarTexto(correcta)) continue;
    if (apodos.some((x) => normalizarTexto(x) === normalizarTexto(apodo))) continue;
    apodos.push(apodo);
    if (apodos.length === 3) break;
  }
  if (apodos.length < 3) {
    for (const candidato of barajar(candidatos)) {
      const apodo = String(candidato.sobrenombre || "").trim();
      if (!apodo || normalizarTexto(apodo) === normalizarTexto(correcta)) continue;
      if (apodos.some((x) => normalizarTexto(x) === normalizarTexto(apodo))) continue;
      apodos.push(apodo);
      if (apodos.length === 3) break;
    }
  }
  if (apodos.length < 3) return null;

  const opciones = barajar([correcta, ...apodos]).map((apodo) => ({ id: `sobrenombre:${normalizarTexto(apodo)}`, label: apodo }));
  return {
    tipo: "sobrenombre",
    etiqueta: "Sobrenombres",
    pregunta: `¿Con qué sobrenombre o apelativo figura ${sujeto.nombre} en la base?`,
    opciones,
    correctaId: `sobrenombre:${normalizarTexto(correcta)}`,
    explicacion: `${sujeto.nombre} figura con el sobrenombre «${correcta}».`,
    atlasPersonId: sujeto.id,
  };
}

const GENERADORES = {
  dinastia: (personas, indice) => preguntaDinastia(personas, indice),
  parentesco: (personas, indice) => preguntaParentesco(personas, indice),
  territorio: (personas, indice) => preguntaTerritorio(personas, indice),
  sobra: (personas, indice) => preguntaSobra(personas, indice),
  sucesion: (personas) => preguntaSucesion(personas),
  pistas: (personas, indice) => preguntaPistas(personas, indice),
  sobrenombre: (personas, indice) => preguntaSobrenombre(personas, indice),
};

function validarPregunta(pregunta, indice) {
  if (!pregunta || !pregunta.pregunta || !Array.isArray(pregunta.opciones) || pregunta.opciones.length !== 4) return false;
  const ids = pregunta.opciones.map((opcion) => opcion.id);
  const labels = pregunta.opciones.map((opcion) => normalizarTexto(opcion.label));
  if (new Set(ids).size !== 4 || new Set(labels).size !== 4) return false;
  const correcta = pregunta.opciones.find((opcion) => opcion.id === pregunta.correctaId);
  if (!correcta) return false;

  // Regla anti-spoiler: la opción correcta no puede estar escrita en el enunciado.
  // Para respuestas breves (dinastías, territorios, sobrenombres) también se
  // comparan sus palabras significativas; en secuencias no, porque los nombres
  // pueden contener legítimamente el territorio citado en la pregunta.
  const preguntaNorm = ` ${normalizarTexto(pregunta.pregunta)} `;
  const correctaNorm = normalizarTexto(correcta.label);
  if (correctaNorm.length >= 3 && preguntaNorm.includes(` ${correctaNorm} `)) return false;
  if (["dinastia", "territorio", "sobrenombre"].includes(pregunta.tipo)
      && textoContieneRespuesta(pregunta.pregunta, correcta.label)) return false;

  if (pregunta.tipo === "sobra" && pregunta.meta?.dinastiaObjetivo) {
    if (pregunta.opciones.some((opcion) => textoContieneRespuesta(opcion.label, pregunta.meta.dinastiaObjetivo))) return false;
  }

  if (pregunta.tipo === "parentesco" && pregunta.meta?.sexoOpciones) {
    const sexoEsperado = pregunta.meta.sexoOpciones;
    if (pregunta.opciones.some((opcion) => indice.sexo[opcion.id] !== sexoEsperado)) return false;
  }

  return true;
}

function firmaPregunta(pregunta) {
  return `${pregunta.tipo}|${pregunta.pregunta}|${pregunta.correctaId}`;
}

export function crearPartida(personas, cantidad = 10) {
  const base = Array.isArray(personas) ? personas.filter((p) => p?.id && p?.nombre) : [];
  const indice = construirIndice(base);

  // V1.1: equilibrio fijo para que cada partida tenga variedad y ninguna categoría
  // dependa del azar para aparecer.
  const planBase = [
    "pistas", "parentesco", "territorio", "dinastia", "sobrenombre",
    "pistas", "parentesco", "territorio", "sobra", "sucesion",
  ];
  const plan = cantidad === 10 ? planBase : Array.from({ length: cantidad }, (_, i) => planBase[i % planBase.length]);
  const preguntas = [];
  const usadas = new Set();

  const intentar = (tipo) => {
    const generador = GENERADORES[tipo];
    for (let intento = 0; intento < 80; intento += 1) {
      const pregunta = generador?.(base, indice);
      if (!pregunta || !validarPregunta(pregunta, indice)) continue;
      const firma = firmaPregunta(pregunta);
      if (usadas.has(firma)) continue;
      usadas.add(firma);
      preguntas.push({ ...pregunta, id: `q-${preguntas.length + 1}-${Math.random().toString(36).slice(2, 8)}` });
      return true;
    }
    return false;
  };

  for (let i = 0; i < cantidad; i += 1) {
    if (intentar(plan[i])) continue;
    const alternativas = barajar(Object.keys(GENERADORES));
    if (!alternativas.some((tipo) => intentar(tipo))) break;
  }

  if (preguntas.length < cantidad) {
    throw new Error(`No se han podido generar ${cantidad} preguntas válidas con la base actual.`);
  }
  return preguntas.slice(0, cantidad);
}
