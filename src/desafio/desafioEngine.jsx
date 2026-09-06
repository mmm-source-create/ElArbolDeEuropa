const TIPOS_REINADO_NO_EFECTIVOS = new Set(["titular", "pretensión", "pretension"]);
const DINASTIAS_GENERICAS = new Set(["", "Sin casa identificada", "Desconocida", "Familias menores"]);
const PALABRAS_VACIAS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "casa", "dinastia", "dinastía"]);

function unico(lista) {
  return [...new Set((lista || []).filter(Boolean))];
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
  const tokens = tokensSignificativos(respuesta);
  return tokens.length > 0 && tokens.some((token) => textoNorm.includes(` ${token} `));
}

function hashTexto(texto) {
  let h = 2166136261;
  const raw = String(texto || "");
  for (let i = 0; i < raw.length; i += 1) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function crearRngSemilla(texto) {
  let state = hashTexto(texto) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barajar(lista, rng = Math.random) {
  const copia = (lista || []).slice();
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function elegir(lista, rng = Math.random) {
  if (!lista?.length) return null;
  return lista[Math.floor(rng() * lista.length)] ?? null;
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

function construirIndice(personas) {
  const byId = Object.fromEntries((personas || []).filter((p) => p?.id).map((p) => [p.id, p]));
  const hijosPorId = {};
  const conyugesInversos = {};
  const sexo = {};

  const marcarSexo = (id, valor) => {
    if (!id || !byId[id] || !valor) return;
    if (!sexo[id]) sexo[id] = valor;
  };

  (personas || []).forEach((persona) => {
    if (!persona?.id) return;
    marcarSexo(persona.id, sexoPorTitulo(persona));
    if (persona.padre && byId[persona.padre]) {
      marcarSexo(persona.padre, "M");
      (hijosPorId[persona.padre] ||= new Set()).add(persona.id);
    }
    if (persona.madre && byId[persona.madre]) {
      marcarSexo(persona.madre, "F");
      (hijosPorId[persona.madre] ||= new Set()).add(persona.id);
    }
    const parejas = [persona.conyuge, persona.conyuge2, ...(persona.conyuges || [])].filter(Boolean);
    parejas.forEach((id) => {
      if (byId[id]) (conyugesInversos[id] ||= new Set()).add(persona.id);
    });
  });

  return { byId, hijosPorId, conyugesInversos, sexo };
}

function conyugesDe(persona, indice) {
  if (!persona?.id) return [];
  return unico([
    persona.conyuge,
    persona.conyuge2,
    ...(persona.conyuges || []),
    ...[...(indice.conyugesInversos[persona.id] || [])],
  ]).filter((id) => indice.byId[id]);
}

function anioReferencia(persona) {
  if (Number.isFinite(persona?.nac)) return persona.nac;
  const primero = reinadosEfectivos(persona).slice().sort((a, b) => a.desde - b.desde)[0];
  if (primero) return primero.desde - 25;
  if (Number.isFinite(persona?.muer)) return persona.muer - 40;
  return null;
}

function distanciaHistorica(a, b) {
  const aa = anioReferencia(a);
  const bb = anioReferencia(b);
  if (!Number.isFinite(aa) || !Number.isFinite(bb)) return 180;
  return Math.abs(aa - bb);
}

function comparteTerritorio(a, b) {
  const ta = new Set([...(a?.reinos || []), ...reinadosEfectivos(a).map((r) => r.territorio)]);
  return unico([...(b?.reinos || []), ...reinadosEfectivos(b).map((r) => r.territorio)])
    .some((territorio) => ta.has(territorio));
}

function relevancia(persona) {
  let score = 0;
  const categoria = categoriaTitulo(persona);
  const reinados = reinadosEfectivos(persona);
  if (categoria === "corona") score += 6;
  else if (categoria === "papado") score += 5;
  else if (categoria === "ducal") score += 3;
  else if (categoria === "gobierno") score += 2;
  else if (categoria === "nobleza") score += 1;
  score += Math.min(4, reinados.length * 2);
  if (persona?.biografia) score += 2;
  if (persona?.padre || persona?.madre) score += 1;
  if (persona?.conyuge || persona?.conyuges?.length) score += 1;
  return score;
}

function candidatosPlausibles(persona, personas, indice, excluidos = new Set(), { sexo = null } = {}) {
  return (personas || [])
    .filter((candidato) => {
      if (!candidato?.id || candidato.id === persona?.id || excluidos.has(candidato.id)) return false;
      if (sexo && indice.sexo[candidato.id] && indice.sexo[candidato.id] !== sexo) return false;
      return true;
    })
    .map((candidato) => {
      let score = distanciaHistorica(persona, candidato);
      if (persona?.dinastia && candidato.dinastia === persona.dinastia) score -= 34;
      if (comparteTerritorio(persona, candidato)) score -= 24;
      if (categoriaTitulo(persona) === categoriaTitulo(candidato)) score -= 16;
      score -= Math.min(10, relevancia(candidato));
      return { candidato, score };
    })
    .sort((a, b) => a.score - b.score || String(a.candidato.nombre).localeCompare(String(b.candidato.nombre), "es"))
    .map((item) => item.candidato);
}

function opcionesPersonas(correcta, sujeto, personas, indice, cantidad, rng, { excluidos = new Set(), sexo = null } = {}) {
  const prohibidos = new Set([correcta?.id, sujeto?.id, ...excluidos].filter(Boolean));
  const candidatos = candidatosPlausibles(correcta, personas, indice, prohibidos, { sexo });
  const cercanos = candidatos.filter((p) => distanciaHistorica(correcta, p) <= 125);
  const ordenados = [...cercanos, ...candidatos.filter((p) => !cercanos.includes(p))];
  const distractores = [];
  for (const candidato of ordenados) {
    if (distractores.some((p) => normalizarTexto(p.nombre) === normalizarTexto(candidato.nombre))) continue;
    distractores.push(candidato);
    if (distractores.length === cantidad - 1) break;
  }
  if (distractores.length !== cantidad - 1) return null;
  return barajar([correcta, ...distractores], rng).map((p) => ({ id: p.id, label: p.nombre }));
}

function firmaPregunta(pregunta) {
  const solucion = pregunta.formato === "orden"
    ? (pregunta.ordenCorrecto || []).join("|")
    : pregunta.correctaId || "";
  return `${pregunta.tipo}|${pregunta.pregunta}|${solucion}`;
}

function completarPregunta(pregunta, dificultad, rng) {
  if (!pregunta) return null;
  const final = {
    dificultad,
    formato: "opciones",
    etiqueta: "Desafío",
    ...pregunta,
  };
  final.firma = firmaPregunta(final);
  final.id = `q-${hashTexto(`${final.firma}|${rng()}`).toString(36)}`;
  return final;
}

function validarPregunta(pregunta) {
  if (!pregunta?.pregunta || !pregunta?.tipo || !pregunta?.formato) return false;
  if (pregunta.formato === "orden") {
    return Array.isArray(pregunta.opciones)
      && pregunta.opciones.length === 3
      && Array.isArray(pregunta.ordenCorrecto)
      && pregunta.ordenCorrecto.length === 3
      && new Set(pregunta.opciones.map((o) => o.id)).size === 3
      && new Set(pregunta.ordenCorrecto).size === 3;
  }
  if (!Array.isArray(pregunta.opciones) || pregunta.opciones.length < 2 || pregunta.opciones.length > 4) return false;
  if (!pregunta.correctaId || !pregunta.opciones.some((o) => o.id === pregunta.correctaId)) return false;
  if (new Set(pregunta.opciones.map((o) => o.id)).size !== pregunta.opciones.length) return false;
  if (new Set(pregunta.opciones.map((o) => normalizarTexto(o.label))).size !== pregunta.opciones.length) return false;
  return true;
}

function generarDuelo(personas, indice, dificultad, rng) {
  const minDiff = dificultad <= 1 ? 30 : dificultad === 2 ? 18 : 8;
  const elegibles = personas.filter((p) =>
    p?.id && p?.nombre && relevancia(p) >= (dificultad <= 1 ? 5 : 3)
    && (Number.isFinite(p.nac) || Number.isFinite(p.muer) || reinadosEfectivos(p).length)
  );
  const a = elegir(elegibles, rng);
  if (!a) return null;
  const candidatos = barajar(candidatosPlausibles(a, elegibles, indice, new Set([a.id])).slice(0, 120), rng);

  for (const b of candidatos) {
    const comparaciones = [];
    if (Number.isFinite(a.nac) && Number.isFinite(b.nac) && !a.nacAprox && !b.nacAprox && Math.abs(a.nac - b.nac) >= minDiff) {
      comparaciones.push({
        pregunta: "¿Quién nació antes?",
        correcta: a.nac < b.nac ? a : b,
        explicacion: `${a.nombre} nació en ${a.nac}; ${b.nombre}, en ${b.nac}.`,
        hint: `La diferencia entre ambos nacimientos es de ${Math.abs(a.nac - b.nac)} años.`,
      });
    }
    if (Number.isFinite(a.muer) && Number.isFinite(b.muer) && !a.muerAprox && !b.muerAprox && Math.abs(a.muer - b.muer) >= minDiff) {
      comparaciones.push({
        pregunta: "¿Quién murió más tarde?",
        correcta: a.muer > b.muer ? a : b,
        explicacion: `${a.nombre} murió en ${a.muer}; ${b.nombre}, en ${b.muer}.`,
        hint: `Sus fechas de muerte están separadas por ${Math.abs(a.muer - b.muer)} años.`,
      });
    }
    const ra = reinadosEfectivos(a).slice().sort((x, y) => x.desde - y.desde)[0];
    const rb = reinadosEfectivos(b).slice().sort((x, y) => x.desde - y.desde)[0];
    if (ra && rb && Math.abs(ra.desde - rb.desde) >= minDiff) {
      comparaciones.push({
        pregunta: "¿Quién comenzó antes su primer gobierno efectivo registrado?",
        correcta: ra.desde < rb.desde ? a : b,
        explicacion: `${a.nombre} comenzó en ${ra.desde} (${ra.territorio}); ${b.nombre}, en ${rb.desde} (${rb.territorio}).`,
        hint: `Uno de los dos comenzó a gobernar ${Math.abs(ra.desde - rb.desde)} años antes.`,
      });
    }
    const c = elegir(comparaciones, rng);
    if (!c) continue;
    return completarPregunta({
      tipo: "duelo",
      formato: "opciones",
      etiqueta: "Duelo cronológico",
      pregunta: c.pregunta,
      opciones: barajar([a, b], rng).map((p) => ({ id: p.id, label: p.nombre })),
      correctaId: c.correcta.id,
      explicacion: c.explicacion,
      hint: c.hint,
      atlasPersonId: c.correcta.id,
    }, dificultad, rng);
  }
  return null;
}

function construirRelaciones(personas, indice, incluirPareja = true) {
  const relaciones = [];
  personas.forEach((persona) => {
    if (!persona?.id || !persona?.nombre) return;
    if (persona.padre && indice.byId[persona.padre]) {
      relaciones.push({ sujeto: persona, correcta: indice.byId[persona.padre], etiqueta: "padre", sexo: "M" });
    }
    if (persona.madre && indice.byId[persona.madre]) {
      relaciones.push({ sujeto: persona, correcta: indice.byId[persona.madre], etiqueta: "madre", sexo: "F" });
    }
    if (incluirPareja) {
      conyugesDe(persona, indice).forEach((id) => {
        const correcta = indice.byId[id];
        if (correcta) relaciones.push({ sujeto: persona, correcta, etiqueta: "cónyuge", sexo: indice.sexo[id] || null });
      });
    }
  });
  return relaciones;
}

function generarParentesco(personas, indice, dificultad, rng) {
  const cantidad = dificultad <= 1 ? 2 : 3;
  const relaciones = barajar(construirRelaciones(personas, indice, dificultad >= 2)
    .filter((r) => relevancia(r.sujeto) >= (dificultad <= 1 ? 4 : 1)), rng);
  for (const relacion of relaciones) {
    const excluidos = new Set([
      relacion.sujeto.padre,
      relacion.sujeto.madre,
      ...conyugesDe(relacion.sujeto, indice),
    ].filter(Boolean));
    excluidos.delete(relacion.correcta.id);
    const opciones = opcionesPersonas(relacion.correcta, relacion.sujeto, personas, indice, cantidad, rng, {
      excluidos,
      sexo: relacion.sexo,
    });
    if (!opciones) continue;
    return completarPregunta({
      tipo: "parentesco",
      etiqueta: "Familia",
      pregunta: `¿Quién figura como ${relacion.etiqueta} de ${relacion.sujeto.nombre}?`,
      opciones,
      correctaId: relacion.correcta.id,
      explicacion: `${relacion.correcta.nombre} figura en la base como ${relacion.etiqueta} de ${relacion.sujeto.nombre}.`,
      hint: relacion.sujeto.dinastia ? `${relacion.sujeto.nombre} pertenece a la casa ${relacion.sujeto.dinastia}.` : "Busca una relación familiar directa.",
      atlasPersonId: relacion.sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

function generarDinastia(personas, indice, dificultad, rng) {
  const cantidad = dificultad <= 1 ? 2 : 3;
  const sujetos = barajar(personas.filter((p) =>
    p?.id && p?.nombre && p?.dinastia && !DINASTIAS_GENERICAS.has(p.dinastia)
    && !textoContieneRespuesta(p.nombre, p.dinastia)
    && relevancia(p) >= (dificultad <= 1 ? 4 : 1)
  ), rng);
  for (const sujeto of sujetos) {
    const casas = [];
    for (const candidato of candidatosPlausibles(sujeto, personas, indice, new Set([sujeto.id]))) {
      const casa = candidato.dinastia;
      if (!casa || DINASTIAS_GENERICAS.has(casa) || casa === sujeto.dinastia || casas.includes(casa)) continue;
      if (textoContieneRespuesta(candidato.nombre, casa)) continue;
      casas.push(casa);
      if (casas.length === cantidad - 1) break;
    }
    if (casas.length !== cantidad - 1) continue;
    const opciones = barajar([sujeto.dinastia, ...casas], rng).map((casa) => ({ id: `dinastia:${casa}`, label: casa }));
    return completarPregunta({
      tipo: "dinastia",
      etiqueta: "Dinastías",
      pregunta: `¿A qué dinastía pertenece ${sujeto.nombre}?`,
      opciones,
      correctaId: `dinastia:${sujeto.dinastia}`,
      explicacion: `${sujeto.nombre} figura en la base como miembro de la casa ${sujeto.dinastia}.`,
      hint: Number.isFinite(sujeto.nac) ? `Nació en ${sujeto.nac}.` : "La respuesta está en su ficha genealógica.",
      atlasPersonId: sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

function generarTerritorio(personas, indice, dificultad, rng) {
  const cantidad = dificultad <= 1 ? 2 : 3;
  const sujetos = barajar(personas.filter((p) => p?.id && p?.nombre && reinadosEfectivos(p).length && relevancia(p) >= (dificultad <= 1 ? 4 : 1)), rng);
  for (const sujeto of sujetos) {
    const propios = unico(reinadosEfectivos(sujeto).map((r) => r.territorio))
      .filter((t) => !textoContieneRespuesta(sujeto.nombre, t));
    const correcta = elegir(propios, rng);
    if (!correcta) continue;
    const territorios = [];
    for (const candidato of candidatosPlausibles(sujeto, personas, indice, new Set([sujeto.id]))) {
      for (const territorio of reinadosEfectivos(candidato).map((r) => r.territorio)) {
        if (!territorio || propios.includes(territorio) || territorios.includes(territorio)) continue;
        territorios.push(territorio);
        if (territorios.length === cantidad - 1) break;
      }
      if (territorios.length === cantidad - 1) break;
    }
    if (territorios.length !== cantidad - 1) continue;
    return completarPregunta({
      tipo: "territorio",
      etiqueta: "Gobierno",
      pregunta: `¿Cuál de estos territorios gobernó efectivamente ${sujeto.nombre}?`,
      opciones: barajar([correcta, ...territorios], rng).map((t) => ({ id: `territorio:${t}`, label: t })),
      correctaId: `territorio:${correcta}`,
      explicacion: `${sujeto.nombre} tiene gobierno efectivo registrado en ${correcta}: ${reinadosEfectivos(sujeto).filter((r) => r.territorio === correcta).map((r) => `${r.desde}–${r.hasta}`).join(", ")}.`,
      hint: sujeto.dinastia ? `Casa ${sujeto.dinastia}.` : "Piensa en sus gobiernos efectivos, no en vínculos matrimoniales.",
      atlasPersonId: sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

function generarSobra(personas, indice, dificultad, rng) {
  const porDinastia = new Map();
  personas.forEach((p) => {
    if (!p?.id || !p?.nombre || !p?.dinastia || DINASTIAS_GENERICAS.has(p.dinastia)) return;
    if (textoContieneRespuesta(p.nombre, p.dinastia)) return;
    if (!porDinastia.has(p.dinastia)) porDinastia.set(p.dinastia, []);
    porDinastia.get(p.dinastia).push(p);
  });
  const casas = barajar([...porDinastia.entries()].filter(([, miembros]) => miembros.length >= 2), rng);
  for (const [dinastia, miembros] of casas) {
    const centro = elegir(miembros.filter((p) => relevancia(p) >= 2), rng) || elegir(miembros, rng);
    if (!centro) continue;
    const mismo = candidatosPlausibles(centro, miembros, indice, new Set([centro.id]))
      .find((p) => p.dinastia === dinastia && !textoContieneRespuesta(p.nombre, dinastia));
    if (!mismo) continue;
    const outsider = candidatosPlausibles(centro, personas, indice, new Set([centro.id, mismo.id]))
      .find((p) => p.dinastia && p.dinastia !== dinastia && !DINASTIAS_GENERICAS.has(p.dinastia) && !textoContieneRespuesta(p.nombre, dinastia));
    if (!outsider) continue;
    const opciones = barajar([centro, mismo, outsider], rng).map((p) => ({ id: p.id, label: p.nombre }));
    return completarPregunta({
      tipo: "sobra",
      etiqueta: "¿Quién sobra?",
      pregunta: `Dos de estos personajes pertenecen a la casa ${dinastia}. ¿Quién sobra?`,
      opciones,
      correctaId: outsider.id,
      explicacion: `${outsider.nombre} pertenece a ${outsider.dinastia}; los otros dos personajes pertenecen a ${dinastia}.`,
      hint: Number.isFinite(centro.nac) ? `Los tres personajes están situados cerca de la época de ${centro.nac}.` : "Busca la casa dinástica que comparten dos de ellos.",
      atlasPersonId: outsider.id,
    }, dificultad, rng);
  }
  return null;
}

function generarOrden(personas, indice, dificultad, rng) {
  const candidatos = barajar(personas.filter((p) =>
    p?.id && p?.nombre && Number.isFinite(p.nac) && !p.nacAprox && relevancia(p) >= (dificultad <= 2 ? 4 : 2)
  ), rng);
  const primero = elegir(candidatos, rng);
  if (!primero) return null;
  const cercanos = candidatosPlausibles(primero, candidatos, indice, new Set([primero.id]))
    .filter((p) => Number.isFinite(p.nac) && !p.nacAprox);
  for (let i = 0; i < cercanos.length - 1; i += 1) {
    const trio = [primero, cercanos[i], cercanos[i + 1]];
    const ordenado = trio.slice().sort((a, b) => a.nac - b.nac);
    const fechas = ordenado.map((p) => p.nac);
    if (new Set(fechas).size !== 3) continue;
    if (fechas[2] - fechas[0] < (dificultad >= 4 ? 8 : 15)) continue;
    return completarPregunta({
      tipo: "orden",
      formato: "orden",
      etiqueta: "Cronología",
      pregunta: "Ordénalos del más antiguo al más reciente.",
      opciones: barajar(trio, rng).map((p) => ({ id: p.id, label: p.nombre })),
      ordenCorrecto: ordenado.map((p) => p.id),
      explicacion: ordenado.map((p) => `${p.nombre} (${p.nac})`).join(" → "),
      hint: `El primero de los tres nació en ${fechas[0]}.`,
      atlasPersonId: ordenado[0].id,
    }, dificultad, rng);
  }
  return null;
}

function generarPistas(personas, indice, dificultad, rng) {
  const sujetos = barajar(personas.filter((p) => {
    const gobiernos = reinadosEfectivos(p);
    return p?.id && p?.nombre && Number.isFinite(p.nac)
      && p.dinastia && !DINASTIAS_GENERICAS.has(p.dinastia)
      && p.titulo && gobiernos.length
      && relevancia(p) >= 4
      && !textoContieneRespuesta(p.nombre, p.dinastia);
  }), rng);

  for (const sujeto of sujetos) {
    const cantidad = dificultad <= 2 ? 2 : 3;
    const opciones = opcionesPersonas(sujeto, null, personas, indice, cantidad, rng, { sexo: indice.sexo[sujeto.id] || null });
    if (!opciones) continue;
    const gobiernos = unico(reinadosEfectivos(sujeto).map((r) => r.territorio))
      .filter((t) => !textoContieneRespuesta(sujeto.nombre, t));
    const pistas = [
      `Nací en ${sujeto.nac}.`,
      sujeto.dinastia ? `Pertenecí a la casa ${sujeto.dinastia}.` : null,
      sujeto.titulo ? `Mi título registrado es ${sujeto.titulo}.` : null,
      gobiernos[0] ? `Goberné ${gobiernos[0]}.` : null,
      sujeto.padre && indice.byId[sujeto.padre] ? `Mi padre fue ${indice.byId[sujeto.padre].nombre}.` : null,
      sujeto.madre && indice.byId[sujeto.madre] ? `Mi madre fue ${indice.byId[sujeto.madre].nombre}.` : null,
    ].filter((p) => p && !textoContieneRespuesta(p, sujeto.nombre));
    if (pistas.length < 3) continue;
    return completarPregunta({
      tipo: "pistas",
      formato: "pistas",
      etiqueta: "¿Quién soy?",
      pregunta: "Descubre al personaje con el menor número de pistas posible.",
      opciones,
      correctaId: sujeto.id,
      pistas,
      explicacion: `${sujeto.nombre}. ${[sujeto.titulo, sujeto.dinastia, gobiernos[0]].filter(Boolean).join(" · ")}.`,
      hint: pistas[Math.min(1, pistas.length - 1)],
      atlasPersonId: sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

function sucesionesDirectas(personas) {
  const porTerritorio = new Map();
  personas.forEach((persona) => {
    reinadosEfectivos(persona).forEach((reinado) => {
      if (!porTerritorio.has(reinado.territorio)) porTerritorio.set(reinado.territorio, []);
      porTerritorio.get(reinado.territorio).push({ persona, reinado });
    });
  });
  const pares = [];
  porTerritorio.forEach((entradas, territorio) => {
    const ordenadas = entradas.slice().sort((a, b) => a.reinado.desde - b.reinado.desde || a.reinado.hasta - b.reinado.hasta);
    for (let i = 0; i < ordenadas.length - 1; i += 1) {
      const a = ordenadas[i];
      const b = ordenadas[i + 1];
      if (a.persona.id === b.persona.id) continue;
      const hueco = b.reinado.desde - a.reinado.hasta;
      if (hueco < -2 || hueco > 12) continue;
      pares.push({ territorio, anterior: a, siguiente: b });
    }
  });
  return pares;
}

function generarSucesor(personas, indice, dificultad, rng) {
  const cantidad = 3;
  const pares = barajar(sucesionesDirectas(personas), rng);
  for (const par of pares) {
    const preguntarSucesor = rng() < 0.5;
    const sujeto = preguntarSucesor ? par.anterior.persona : par.siguiente.persona;
    const correcta = preguntarSucesor ? par.siguiente.persona : par.anterior.persona;
    if (relevancia(sujeto) < 2 || relevancia(correcta) < 2) continue;
    const gobernantes = personas.filter((p) => reinadosEfectivos(p).some((r) => r.territorio === par.territorio));
    let opciones = opcionesPersonas(correcta, sujeto, gobernantes, indice, cantidad, rng);
    if (!opciones) opciones = opcionesPersonas(correcta, sujeto, personas, indice, cantidad, rng);
    if (!opciones) continue;
    return completarPregunta({
      tipo: "sucesor",
      etiqueta: "Sucesiones",
      pregunta: preguntarSucesor
        ? `¿Quién sucedió a ${sujeto.nombre} en el gobierno de ${par.territorio}?`
        : `¿Quién precedió a ${sujeto.nombre} en el gobierno de ${par.territorio}?`,
      opciones,
      correctaId: correcta.id,
      explicacion: `${par.anterior.persona.nombre} gobernó ${par.territorio} hasta ${par.anterior.reinado.hasta}; ${par.siguiente.persona.nombre} comenzó en ${par.siguiente.reinado.desde}.`,
      hint: `La respuesta pertenece a la sucesión de ${par.territorio}.`,
      atlasPersonId: sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

function generarPareja(personas, indice, dificultad, rng) {
  const sujetos = barajar(personas.filter((p) => p?.id && p?.nombre && conyugesDe(p, indice).length && relevancia(p) >= 2), rng);
  for (const sujeto of sujetos) {
    const correctaId = elegir(conyugesDe(sujeto, indice), rng);
    const correcta = indice.byId[correctaId];
    if (!correcta) continue;
    const cantidad = dificultad <= 2 ? 2 : 3;
    const opciones = opcionesPersonas(correcta, sujeto, personas, indice, cantidad, rng, {
      sexo: indice.sexo[correcta.id] || null,
      excluidos: new Set(conyugesDe(sujeto, indice).filter((id) => id !== correcta.id)),
    });
    if (!opciones) continue;
    return completarPregunta({
      tipo: "pareja",
      etiqueta: "Matrimonios",
      pregunta: `¿Quién figura como cónyuge de ${sujeto.nombre}?`,
      opciones,
      correctaId: correcta.id,
      explicacion: `${sujeto.nombre} y ${correcta.nombre} figuran como cónyuges en la base genealógica.`,
      hint: sujeto.dinastia ? `${sujeto.nombre} pertenece a ${sujeto.dinastia}.` : "Busca una unión documentada.",
      atlasPersonId: sujeto.id,
    }, dificultad, rng);
  }
  return null;
}

const GENERADORES = {
  duelo: generarDuelo,
  parentesco: generarParentesco,
  dinastia: generarDinastia,
  territorio: generarTerritorio,
  sobra: generarSobra,
  orden: generarOrden,
  pistas: generarPistas,
  sucesor: generarSucesor,
  pareja: generarPareja,
};

function poolPorDificultad(dificultad) {
  if (dificultad <= 1) return ["duelo", "duelo", "parentesco", "parentesco", "dinastia", "territorio"];
  if (dificultad === 2) return ["duelo", "parentesco", "dinastia", "territorio", "sobra", "pareja", "pistas"];
  if (dificultad === 3) return ["parentesco", "territorio", "sobra", "orden", "pistas", "sucesor", "pareja", "duelo"];
  return ["sobra", "orden", "pistas", "sucesor", "pareja", "territorio", "parentesco", "duelo"];
}

function crearPreguntaConRng(personas, {
  dificultad = 1,
  evitarFirmas = [],
  formatoAnterior = null,
  preferirTipo = null,
  rng = Math.random,
} = {}) {
  const base = Array.isArray(personas) ? personas.filter((p) => p?.id && p?.nombre) : [];
  const indice = construirIndice(base);
  const recientes = new Set(Array.isArray(evitarFirmas) ? evitarFirmas : []);
  const pool = poolPorDificultad(dificultad);
  let tipos = preferirTipo
    ? [preferirTipo, ...barajar(pool.filter((tipo) => tipo !== preferirTipo), rng)]
    : barajar(pool, rng);
  if (!preferirTipo && formatoAnterior && tipos.length > 1) {
    tipos.sort((a, b) => (a === formatoAnterior ? 1 : 0) - (b === formatoAnterior ? 1 : 0));
  }

  for (let intento = 0; intento < 120; intento += 1) {
    const tipo = tipos[intento % tipos.length];
    const pregunta = GENERADORES[tipo]?.(base, indice, dificultad, rng);
    if (!validarPregunta(pregunta)) continue;
    if (recientes.has(pregunta.firma)) continue;
    return pregunta;
  }
  throw new Error("No se ha podido generar una pregunta nueva con la dificultad actual.");
}

export function crearPreguntaCamino(personas, opciones = {}) {
  return crearPreguntaConRng(personas, { ...opciones, rng: Math.random });
}

export function crearPartida(personas, cantidad = 10, { evitarFirmas = [] } = {}) {
  const preguntas = [];
  const firmas = [...evitarFirmas];
  let anterior = null;
  for (let i = 0; i < cantidad; i += 1) {
    const dificultad = i < 3 ? 1 : i < 7 ? 2 : i < 9 ? 3 : 4;
    const pregunta = crearPreguntaCamino(personas, {
      dificultad,
      evitarFirmas: firmas,
      formatoAnterior: anterior,
    });
    preguntas.push(pregunta);
    firmas.push(pregunta.firma);
    anterior = pregunta.tipo;
  }
  return preguntas;
}

function comparacionesRacha(a, b) {
  const comparaciones = [];
  if (Number.isFinite(a?.nac) && Number.isFinite(b?.nac) && !a.nacAprox && !b.nacAprox && Math.abs(a.nac - b.nac) >= 7) {
    const correcta = a.nac < b.nac ? a : b;
    comparaciones.push({ id: "nacimiento", pregunta: "¿Quién nació antes?", correcta, explicacion: `${a.nombre} nació en ${a.nac}; ${b.nombre}, en ${b.nac}.` });
  }
  if (Number.isFinite(a?.muer) && Number.isFinite(b?.muer) && !a.muerAprox && !b.muerAprox && Math.abs(a.muer - b.muer) >= 7) {
    const correcta = a.muer > b.muer ? a : b;
    comparaciones.push({ id: "muerte", pregunta: "¿Quién murió más tarde?", correcta, explicacion: `${a.nombre} murió en ${a.muer}; ${b.nombre}, en ${b.muer}.` });
  }
  const ra = reinadosEfectivos(a).slice().sort((x, y) => x.desde - y.desde)[0];
  const rb = reinadosEfectivos(b).slice().sort((x, y) => x.desde - y.desde)[0];
  if (ra && rb && Math.abs(ra.desde - rb.desde) >= 7) {
    const correcta = ra.desde < rb.desde ? a : b;
    comparaciones.push({
      id: "primer-gobierno",
      pregunta: "¿Quién comenzó antes su primer gobierno efectivo registrado?",
      correcta,
      explicacion: `${a.nombre} comenzó en ${ra.desde} (${ra.territorio}); ${b.nombre}, en ${rb.desde} (${rb.territorio}).`,
    });
  }
  const la = reinadosEfectivos(a).map((r) => r.hasta - r.desde + 1);
  const lb = reinadosEfectivos(b).map((r) => r.hasta - r.desde + 1);
  if (la.length && lb.length) {
    const maxA = Math.max(...la);
    const maxB = Math.max(...lb);
    if (Math.abs(maxA - maxB) >= 5) {
      const correcta = maxA > maxB ? a : b;
      comparaciones.push({
        id: "reinado-largo",
        pregunta: "¿Quién tuvo el reinado efectivo más largo en un solo territorio?",
        correcta,
        explicacion: `${a.nombre}: ${maxA} años; ${b.nombre}: ${maxB} años, según los reinados registrados.`,
      });
    }
  }
  return comparaciones;
}

export function crearPreguntaRacha(personas, campeonId = null, { evitarFirmas = [] } = {}) {
  const rng = Math.random;
  const base = Array.isArray(personas) ? personas.filter((p) => p?.id && p?.nombre) : [];
  const indice = construirIndice(base);
  const recientes = new Set(Array.isArray(evitarFirmas) ? evitarFirmas : []);
  const elegibles = base.filter((p) => relevancia(p) >= 4 && (Number.isFinite(p.nac) || Number.isFinite(p.muer) || reinadosEfectivos(p).length));
  if (elegibles.length < 2) throw new Error("No hay suficientes personajes para el modo Racha.");

  const campeon = indice.byId[campeonId] || elegir(elegibles, rng);
  const rivales = barajar(candidatosPlausibles(campeon, elegibles, indice, new Set([campeon.id])).slice(0, 140), rng);
  for (const rival of rivales) {
    const comparaciones = barajar(comparacionesRacha(campeon, rival), rng);
    for (const comparacion of comparaciones) {
      const firma = `racha|${comparacion.id}|${[campeon.id, rival.id].sort().join("|")}`;
      if (recientes.has(firma)) continue;
      return {
        id: `racha-${hashTexto(`${firma}|${rng()}`).toString(36)}`,
        firma,
        tipo: "racha",
        formato: "opciones",
        etiqueta: "Racha",
        dificultad: 2,
        pregunta: comparacion.pregunta,
        opciones: barajar([campeon, rival], rng).map((p) => ({ id: p.id, label: p.nombre })),
        correctaId: comparacion.correcta.id,
        explicacion: comparacion.explicacion,
        atlasPersonId: comparacion.correcta.id,
        siguienteCampeonId: comparacion.correcta.id,
      };
    }
  }
  throw new Error("No se ha podido generar el siguiente duelo sin repetir preguntas.");
}

export function crearDesafioDiario(personas, fechaClave) {
  const rng = crearRngSemilla(`EADE-DIARIO-${fechaClave}`);
  const plan = barajar([
    { tipo: "duelo", dificultad: 1 },
    { tipo: "parentesco", dificultad: 1 },
    { tipo: "dinastia", dificultad: 2 },
    { tipo: "sobra", dificultad: 2 },
    { tipo: "orden", dificultad: 3 },
  ], rng);
  const preguntas = [];
  const firmas = [];
  for (const paso of plan) {
    const pregunta = crearPreguntaConRng(personas, {
      dificultad: paso.dificultad,
      preferirTipo: paso.tipo,
      evitarFirmas: firmas,
      formatoAnterior: preguntas.at(-1)?.tipo || null,
      rng,
    });
    preguntas.push(pregunta);
    firmas.push(pregunta.firma);
  }
  return preguntas;
}

export function describirDificultad(nivel) {
  if (nivel <= 1) return "Fácil";
  if (nivel === 2) return "Intermedio";
  if (nivel === 3) return "Difícil";
  return "Experto";
}
