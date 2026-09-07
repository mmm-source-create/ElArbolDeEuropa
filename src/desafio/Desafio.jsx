import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ExternalLink,
  Flame,
  Heart,
  Lightbulb,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  Shuffle,
  Sparkles,
  Swords,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { IMAGENES_PERSONAS } from "../imagenesPersonas.js";
import { normalizarBusquedaPublica, slugPublico } from "../utils/personPresentation.js";
import {
  crearDesafioDiario,
  crearPreguntaCamino,
  crearPreguntaRacha,
  describirDificultad,
} from "./desafioEngine.jsx";
import "./desafio.css";

const STORAGE_KEY = "arbol-europa-desafio-v2";
const LEGACY_STORAGE_KEY = "arbol-europa-desafio-v1";
const RECENT_KEY = "arbol-europa-desafio-recientes-v2";
const DAILY_KEY = "arbol-europa-desafio-diario-v2";

const ESTADISTICAS_INICIALES = Object.freeze({
  totalPreguntas: 0,
  totalAciertos: 0,
  precisionPreguntas: 0,
  precisionAciertos: 0,
  caminoPartidas: 0,
  mejorCamino: 0,
  mejorCombo: 0,
  mejorPuntos: 0,
  rachasJugadas: 0,
  mejorRachaDuelo: 0,
  retratosJugados: 0,
  mejorRachaRetratos: 0,
  diariosJugados: 0,
  diariosPerfectos: 0,
  mejorDiario: 0,
});

function leerJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function guardarJson(key, value) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* almacenamiento bloqueado */ }
}

function leerEstadisticas() {
  const v2 = leerJson(STORAGE_KEY, null);
  if (v2 && typeof v2 === "object") {
    const siguientes = Object.fromEntries(Object.keys(ESTADISTICAS_INICIALES).map((key) => [
      key,
      Number.isFinite(v2[key]) ? v2[key] : ESTADISTICAS_INICIALES[key],
    ]));

    // V2.3: las primeras versiones migraron los aciertos históricos de V1,
    // pero no podían reconstruir el número de preguntas antiguas. Eso hacía
    // posible ver una precisión superior al 100 %. Si aún no existen los
    // contadores de precisión independientes, reconstruimos solo la parte V2
    // restando los aciertos heredados cuando el almacenamiento V1 sigue vivo.
    const precisionYaMigrada = Number.isFinite(v2.precisionPreguntas) && Number.isFinite(v2.precisionAciertos);
    if (!precisionYaMigrada) {
      const legacy = leerJson(LEGACY_STORAGE_KEY, null);
      const legacyAciertos = Number.isFinite(legacy?.aciertos) ? legacy.aciertos : null;
      const preguntasV2 = Number.isFinite(v2.totalPreguntas) ? Math.max(0, v2.totalPreguntas) : 0;
      const aciertosTotales = Number.isFinite(v2.totalAciertos) ? Math.max(0, v2.totalAciertos) : 0;
      let aciertosV2 = 0;
      if (legacyAciertos !== null && aciertosTotales >= legacyAciertos) {
        aciertosV2 = aciertosTotales - legacyAciertos;
      } else if (aciertosTotales <= preguntasV2) {
        aciertosV2 = aciertosTotales;
      }
      siguientes.precisionPreguntas = preguntasV2;
      siguientes.precisionAciertos = Math.min(preguntasV2, Math.max(0, aciertosV2));
    }
    return siguientes;
  }

  const legacy = leerJson(LEGACY_STORAGE_KEY, null);
  if (!legacy || typeof legacy !== "object") return { ...ESTADISTICAS_INICIALES };
  return {
    ...ESTADISTICAS_INICIALES,
    totalAciertos: Number.isFinite(legacy.aciertos) ? legacy.aciertos : 0,
    caminoPartidas: Number.isFinite(legacy.partidas) ? legacy.partidas : 0,
    mejorCamino: Number.isFinite(legacy.mejorPuntuacion) ? legacy.mejorPuntuacion : 0,
    mejorCombo: Number.isFinite(legacy.racha) ? legacy.racha : 0,
    rachasJugadas: Number.isFinite(legacy.rachasJugadas) ? legacy.rachasJugadas : 0,
    mejorRachaDuelo: Number.isFinite(legacy.mejorRachaDuelo) ? legacy.mejorRachaDuelo : 0,
  };
}

function leerRecientes() {
  const value = leerJson(RECENT_KEY, []);
  return Array.isArray(value) ? value.filter((item) => typeof item === "string").slice(-180) : [];
}

function guardarRecientes(value) {
  guardarJson(RECENT_KEY, (value || []).slice(-180));
}


function construirSlugs(personas) {
  const counts = personas.reduce((acc, persona) => {
    const base = slugPublico(persona.slug || persona.nombre);
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});
  return Object.fromEntries(personas.map((persona) => {
    const base = slugPublico(persona.slug || persona.nombre);
    return [persona.id, counts[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base];
  }));
}

function normalizarBusqueda(valor) {
  return normalizarBusquedaPublica(valor);
}

function relevanciaRetrato(persona) {
  const titulo = normalizarBusqueda(persona?.titulo);
  let puntos = 0;
  if (/emperador|emperatriz|rey|reina|papa|sultan|zar|principe|duque/.test(titulo)) puntos += 8;
  puntos += Math.min(12, (persona?.reinados?.length || 0) * 3);
  puntos += Math.min(5, persona?.reinos?.length || 0);
  if (persona?.biografia) puntos += 3;
  if (persona?.sobrenombre) puntos += 2;
  if (persona?.padre || persona?.madre) puntos += 1;
  return puntos;
}

function elegirPersonaRetrato(pool, usados = [], racha = 0) {
  if (!pool?.length) return null;
  const usadosSet = new Set(usados);
  let disponibles = pool.filter((persona) => !usadosSet.has(persona.id));
  if (!disponibles.length) disponibles = pool.slice();
  disponibles.sort((a, b) => relevanciaRetrato(b) - relevanciaRetrato(a) || String(a.nombre).localeCompare(String(b.nombre), "es"));
  const fraccion = racha < 4 ? .35 : racha < 9 ? .6 : racha < 15 ? .8 : 1;
  const limite = Math.min(disponibles.length, Math.max(8, Math.ceil(disponibles.length * fraccion)));
  const candidatas = disponibles.slice(0, limite);
  return candidatas[Math.floor(Math.random() * candidatas.length)] || disponibles[0] || null;
}

function sugerenciasPorNombre(personas, consulta, limite = 7) {
  const q = normalizarBusqueda(consulta);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);
  return personas
    .map((persona) => {
      const nombreOriginal = String(persona.nombre || "");
      const nombre = normalizarBusqueda(nombreOriginal);
      const aliases = (Array.isArray(persona.aliases) ? persona.aliases : []).map(normalizarBusqueda).filter(Boolean);
      const variantes = [nombre, ...aliases].filter(Boolean);
      const alias = normalizarBusqueda([persona.nombre, ...(persona.aliases || []), persona.sobrenombre].filter(Boolean).join(" "));
      let score = Number.POSITIVE_INFINITY;
      if (variantes.some((variante) => variante === q)) score = 0;
      else if (variantes.some((variante) => variante.startsWith(`${q} `))) score = 1;
      else if (tokens.length > 1 && tokens.every((token) => alias.includes(token))) score = 2;
      else if (variantes.some((variante) => variante.includes(q))) score = 3;
      else if (alias.includes(q)) score = 4;
      else if (tokens.every((token) => alias.split(" ").some((parte) => parte.startsWith(token)))) score = 5;
      return { persona, score };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score || String(a.persona.nombre).localeCompare(String(b.persona.nombre), "es"))
    .slice(0, limite)
    .map((item) => item.persona);
}

function multiplicador(combo) {
  if (combo >= 9) return 4;
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  return 1;
}

function nivelCamino(ronda, combo, ultimos) {
  let nivel = ronda <= 3 ? 1 : ronda <= 7 ? 2 : ronda <= 12 ? 3 : 4;
  const recientes = (ultimos || []).slice(-4);
  const fallos = recientes.filter((x) => x === false).length;
  if (combo >= 5) nivel += 1;
  if (fallos >= 2) nivel -= 1;
  return Math.max(1, Math.min(4, nivel));
}

function nivelCronista(totalAciertos) {
  const nivel = Math.max(1, Math.floor(Math.sqrt(Math.max(0, totalAciertos) / 6)) + 1);
  const titulo = nivel >= 13 ? "Maestro del Atlas"
    : nivel >= 9 ? "Consejero"
      : nivel >= 6 ? "Genealogista"
        : nivel >= 3 ? "Cronista"
          : "Aprendiz";
  return { nivel, titulo };
}

function fechaDiaria() {
  return new Date().toISOString().slice(0, 10);
}

function TarjetaEstadistica({ valor, etiqueta }) {
  return <div className="desafio-stat"><strong>{valor}</strong><span>{etiqueta}</span></div>;
}

function RetratoOpcion({ persona }) {
  const imagen = persona ? IMAGENES_PERSONAS[persona.id] : null;
  if (!imagen) return <span className="desafio-option-monogram">{persona?.nombre?.slice(0, 1) || "?"}</span>;
  return (
    <span className="desafio-option-portrait">
      <img
        src={imagen.archivo}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ objectPosition: imagen.encuadre || imagen.posicion || "50% 20%" }}
      />
    </span>
  );
}

function Corazones({ vidas }) {
  return (
    <span className="desafio-lives" aria-label={`${vidas} vidas`}>
      {[0, 1, 2].map((i) => <Heart key={i} size={15} className={i < vidas ? "is-live" : "is-lost"} fill={i < vidas ? "currentColor" : "none"} />)}
    </span>
  );
}

function PreguntaOpciones({
  pregunta,
  byId,
  seleccion,
  respondida,
  hidden = [],
  onSelect,
  campeonId = null,
  className = "",
}) {
  const ocultas = new Set(hidden);
  return (
    <div className={`desafio-options desafio-options-${pregunta.opciones.length}${className ? ` ${className}` : ""}`}>
      {pregunta.opciones.filter((opcion) => !ocultas.has(opcion.id)).map((opcion) => {
        const persona = byId[opcion.id] || null;
        const correcta = opcion.id === pregunta.correctaId;
        const elegida = opcion.id === seleccion;
        const clase = respondida
          ? correcta ? " is-correct" : elegida ? " is-wrong" : " is-muted"
          : "";
        return (
          <button
            type="button"
            key={opcion.id}
            className={`desafio-option${persona ? " has-person" : ""}${campeonId === opcion.id ? " is-champion" : ""}${clase}`}
            disabled={respondida}
            onClick={() => onSelect(opcion.id)}
          >
            {persona && <RetratoOpcion persona={persona} />}
            <span className="desafio-option-copy">
              <strong>{opcion.label}</strong>
              {persona && <small>{[persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || "Personaje histórico"}</small>}
              {campeonId === opcion.id && <em>continúa</em>}
            </span>
            {respondida && correcta && <Check size={16} aria-hidden="true" />}
            {respondida && elegida && !correcta && <X size={16} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}

function PreguntaOrden({ pregunta, byId, orden, respondida, onPick }) {
  return (
    <div className="desafio-order-grid">
      {pregunta.opciones.map((opcion) => {
        const persona = byId[opcion.id] || null;
        const posicion = orden.indexOf(opcion.id);
        return (
          <button
            type="button"
            key={opcion.id}
            className={`desafio-order-card${posicion >= 0 ? " is-picked" : ""}`}
            disabled={respondida}
            onClick={() => onPick(opcion.id)}
          >
            {persona && <RetratoOpcion persona={persona} />}
            <span><strong>{opcion.label}</strong>{persona && <small>{persona.titulo || persona.dinastia || "Personaje histórico"}</small>}</span>
            {posicion >= 0 && <b>{posicion + 1}</b>}
          </button>
        );
      })}
    </div>
  );
}

function ExplicacionCompacta({ correcta, explicacion, expandida, onExpand, onContinue, onAtlas, puedeAtlas }) {
  return (
    <div className={`desafio-fast-feedback${correcta ? " is-correct" : " is-wrong"}`} aria-live="polite">
      <div className="desafio-fast-feedback-head">
        {correcta ? <Check size={16} /> : <X size={16} />}
        <strong>{correcta ? "Correcto" : "No esta vez"}</strong>
        {!expandida && <button type="button" onClick={onExpand}>Ver por qué</button>}
      </div>
      {expandida && (
        <div className="desafio-fast-feedback-detail">
          <p>{explicacion}</p>
          <div>
            {puedeAtlas && <button type="button" className="desafio-secondary" onClick={onAtlas}>Ver en el atlas <ExternalLink size={13} /></button>}
            <button type="button" className="desafio-primary" onClick={onContinue}>Continuar <ArrowRight size={13} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Desafio({ personas = [] }) {
  const byId = useMemo(() => Object.fromEntries(personas.map((p) => [p.id, p])), [personas]);
  const slugs = useMemo(() => construirSlugs(personas), [personas]);
  const personasConRetrato = useMemo(() => personas.filter((persona) => Boolean(IMAGENES_PERSONAS[persona.id]?.archivo)), [personas]);
  const [estadisticas, setEstadisticas] = useState(leerEstadisticas);
  const [modo, setModo] = useState(null);
  const [error, setError] = useState("");
  const feedbackTimerRef = useRef(null);
  const rachaTimersRef = useRef([]);
  const retratoInputRef = useRef(null);

  const progreso = nivelCronista(estadisticas.totalAciertos);
  const fechaHoy = fechaDiaria();
  const diarios = leerJson(DAILY_KEY, {});
  const resultadoHoy = diarios?.[fechaHoy] || null;

  const actualizarEstadisticas = useCallback((mutador) => {
    setEstadisticas((actual) => {
      const siguiente = typeof mutador === "function" ? mutador(actual) : { ...actual, ...mutador };
      guardarJson(STORAGE_KEY, siguiente);
      return siguiente;
    });
  }, []);

  const limpiarFeedback = useCallback(() => {
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = null;
  }, []);

  const limpiarRachaTimers = useCallback(() => {
    rachaTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    rachaTimersRef.current = [];
  }, []);

  useEffect(() => () => {
    limpiarFeedback();
    limpiarRachaTimers();
  }, [limpiarFeedback, limpiarRachaTimers]);

  const abrirAtlas = (personaId) => {
    const slug = slugs[personaId];
    if (!personaId || !slug || typeof window === "undefined") return;
    window.open(`/es/persona/${encodeURIComponent(slug)}`, "_blank", "noopener,noreferrer");
  };

  const registrarPregunta = (acierto) => {
    actualizarEstadisticas((actual) => ({
      ...actual,
      totalPreguntas: actual.totalPreguntas + 1,
      totalAciertos: actual.totalAciertos + (acierto ? 1 : 0),
      precisionPreguntas: actual.precisionPreguntas + 1,
      precisionAciertos: actual.precisionAciertos + (acierto ? 1 : 0),
    }));
  };

  // ---------------------------------------------------------------------------
  // EL CAMINO
  // ---------------------------------------------------------------------------
  const [camino, setCamino] = useState(null);
  const [caminoTerminado, setCaminoTerminado] = useState(false);

  const nuevaPreguntaCamino = (estado, { reemplazo = false } = {}) => {
    const dificultad = nivelCamino(estado.ronda, estado.combo, estado.resultados);
    const recientes = [...leerRecientes(), ...estado.firmas];
    const pregunta = crearPreguntaCamino(personas, {
      dificultad,
      evitarFirmas: recientes,
      formatoAnterior: estado.formatoAnterior,
    });
    const firmas = [...estado.firmas, pregunta.firma].slice(-140);
    guardarRecientes([...leerRecientes(), pregunta.firma]);
    return {
      ...estado,
      pregunta,
      firmas,
      formatoAnterior: pregunta.tipo,
      seleccion: null,
      orden: [],
      respondida: false,
      aciertoActual: null,
      feedbackExpandido: false,
      hidden: [],
      hintVisible: false,
      pistasVisibles: pregunta.formato === "pistas" ? 1 : 0,
      pistasExtra: 0,
      ...(reemplazo ? {} : {}),
    };
  };

  const iniciarCamino = () => {
    limpiarFeedback();
    try {
      let estado = {
        ronda: 1,
        vidas: 3,
        puntos: 0,
        aciertos: 0,
        combo: 0,
        mejorCombo: 0,
        resultados: [],
        firmas: [],
        formatoAnterior: null,
        pregunta: null,
        seleccion: null,
        orden: [],
        respondida: false,
        aciertoActual: null,
        feedbackExpandido: false,
        hidden: [],
        hintVisible: false,
        pistasVisibles: 0,
        pistasExtra: 0,
        comodines: { fifty: true, hint: true, swap: true },
        descubiertos: [],
      };
      estado = nuevaPreguntaCamino(estado);
      setCamino(estado);
      setCaminoTerminado(false);
      setModo("camino");
      setError("");
    } catch (err) {
      console.error("[Desafío V2 · Camino] No se pudo iniciar:", err);
      setError("No se ha podido preparar El Camino con los datos actuales.");
    }
  };

  const finalizarCamino = (estado) => {
    limpiarFeedback();
    setCamino(estado);
    setCaminoTerminado(true);
    actualizarEstadisticas((actual) => ({
      ...actual,
      caminoPartidas: actual.caminoPartidas + 1,
      mejorCamino: Math.max(actual.mejorCamino, estado.ronda),
      mejorCombo: Math.max(actual.mejorCombo, estado.mejorCombo),
      mejorPuntos: Math.max(actual.mejorPuntos, estado.puntos),
    }));
  };

  const avanzarCamino = (estado) => {
    limpiarFeedback();
    try {
      const base = { ...estado, ronda: estado.ronda + 1 };
      setCamino(nuevaPreguntaCamino(base));
    } catch (err) {
      console.error("[Desafío V2 · Camino] No se pudo generar la siguiente:", err);
      finalizarCamino(estado);
      setError("El recorrido terminó porque no se pudo generar otra pregunta sin repetir las anteriores.");
    }
  };

  const programarSiguienteCamino = (estado) => {
    limpiarFeedback();
    feedbackTimerRef.current = window.setTimeout(() => {
      if (estado.vidas <= 0) finalizarCamino(estado);
      else avanzarCamino(estado);
    }, 1450);
  };

  const cerrarRespuestaCamino = (acierto, seleccionValue) => {
    if (!camino || camino.respondida || caminoTerminado) return;
    const siguienteCombo = acierto ? camino.combo + 1 : 0;
    const mult = multiplicador(siguienteCombo);
    const penalizacionPistas = camino.pregunta.formato === "pistas"
      ? Math.max(0.55, 1 - Math.max(0, camino.pistasExtra) * 0.15)
      : 1;
    const ganados = acierto ? Math.round(100 * camino.pregunta.dificultad * mult * penalizacionPistas) : 0;
    const vidas = acierto ? camino.vidas : Math.max(0, camino.vidas - 1);
    const descubiertoId = !acierto ? (camino.pregunta.atlasPersonId || camino.pregunta.correctaId) : null;
    const descubiertos = descubiertoId && byId[descubiertoId]
      ? [...new Set([...camino.descubiertos, descubiertoId])].slice(-5)
      : camino.descubiertos;

    const siguiente = {
      ...camino,
      seleccion: seleccionValue,
      respondida: true,
      aciertoActual: acierto,
      vidas,
      puntos: camino.puntos + ganados,
      aciertos: camino.aciertos + (acierto ? 1 : 0),
      combo: siguienteCombo,
      mejorCombo: Math.max(camino.mejorCombo, siguienteCombo),
      resultados: [...camino.resultados, acierto],
      descubiertos,
    };
    setCamino(siguiente);
    registrarPregunta(acierto);
    actualizarEstadisticas((actual) => ({ ...actual, mejorCombo: Math.max(actual.mejorCombo, siguienteCombo) }));
    programarSiguienteCamino(siguiente);
  };

  const responderCamino = (opcionId) => {
    if (!camino?.pregunta || camino.respondida) return;
    cerrarRespuestaCamino(opcionId === camino.pregunta.correctaId, opcionId);
  };

  const elegirOrdenCamino = (opcionId) => {
    if (!camino?.pregunta || camino.respondida) return;
    let orden = camino.orden.includes(opcionId)
      ? camino.orden.filter((id) => id !== opcionId)
      : [...camino.orden, opcionId];
    if (orden.length > 3) orden = orden.slice(-3);
    if (orden.length < 3) {
      setCamino({ ...camino, orden });
      return;
    }
    const acierto = orden.join("|") === camino.pregunta.ordenCorrecto.join("|");
    cerrarRespuestaCamino(acierto, orden);
  };

  const expandirFeedbackCamino = () => {
    limpiarFeedback();
    setCamino((actual) => actual ? { ...actual, feedbackExpandido: true } : actual);
  };

  const continuarCamino = () => {
    if (!camino?.respondida) return;
    if (camino.vidas <= 0) finalizarCamino(camino);
    else avanzarCamino(camino);
  };

  const usarFifty = () => {
    if (!camino?.pregunta || camino.respondida || !camino.comodines.fifty) return;
    if (camino.pregunta.formato === "orden" || camino.pregunta.opciones.length <= 2) return;
    const incorrectas = camino.pregunta.opciones.filter((o) => o.id !== camino.pregunta.correctaId);
    const ocultar = incorrectas.slice(0, Math.max(1, camino.pregunta.opciones.length - 2)).map((o) => o.id);
    setCamino({ ...camino, hidden: ocultar, comodines: { ...camino.comodines, fifty: false } });
  };

  const usarPista = () => {
    if (!camino?.pregunta || camino.respondida || !camino.comodines.hint) return;
    const pistasVisibles = camino.pregunta.formato === "pistas"
      ? Math.min(camino.pregunta.pistas.length, camino.pistasVisibles + 1)
      : camino.pistasVisibles;
    setCamino({
      ...camino,
      hintVisible: true,
      pistasVisibles,
      comodines: { ...camino.comodines, hint: false },
    });
  };

  const otraPista = () => {
    if (!camino?.pregunta || camino.respondida || camino.pregunta.formato !== "pistas") return;
    if (camino.pistasVisibles >= camino.pregunta.pistas.length) return;
    setCamino({
      ...camino,
      pistasVisibles: camino.pistasVisibles + 1,
      pistasExtra: camino.pistasExtra + 1,
    });
  };

  const cambiarPregunta = () => {
    if (!camino?.pregunta || camino.respondida || !camino.comodines.swap) return;
    try {
      const base = {
        ...camino,
        firmas: [...camino.firmas, camino.pregunta.firma],
        comodines: { ...camino.comodines, swap: false },
      };
      const reemplazada = nuevaPreguntaCamino(base, { reemplazo: true });
      reemplazada.comodines = { ...camino.comodines, swap: false };
      setCamino(reemplazada);
    } catch (err) {
      console.error("[Desafío V2] No se pudo cambiar la pregunta:", err);
      setError("No se ha podido cambiar esta pregunta.");
    }
  };

  // ---------------------------------------------------------------------------
  // RACHA
  // ---------------------------------------------------------------------------
  const [preguntaRacha, setPreguntaRacha] = useState(null);
  const [campeonRacha, setCampeonRacha] = useState(null);
  const [rachaDuelo, setRachaDuelo] = useState(0);
  const [seleccionRacha, setSeleccionRacha] = useState(null);
  const [rachaTerminada, setRachaTerminada] = useState(false);
  const [firmasRacha, setFirmasRacha] = useState([]);
  const [transicionRacha, setTransicionRacha] = useState(null);

  const iniciarRacha = () => {
    limpiarRachaTimers();
    try {
      const pregunta = crearPreguntaRacha(personas);
      setPreguntaRacha(pregunta);
      setCampeonRacha(null);
      setRachaDuelo(0);
      setSeleccionRacha(null);
      setRachaTerminada(false);
      setFirmasRacha([pregunta.firma]);
      setTransicionRacha(null);
      setModo("racha");
      setError("");
    } catch (err) {
      console.error("[Desafío V2 · Racha] No se pudo iniciar:", err);
      setError("No se ha podido iniciar Racha con los datos actuales.");
    }
  };

  const programarRacha = (callback, ms) => {
    const timer = window.setTimeout(callback, ms);
    rachaTimersRef.current.push(timer);
  };

  const responderRacha = (opcionId) => {
    if (!preguntaRacha || seleccionRacha !== null || rachaTerminada || transicionRacha) return;
    const ordenadas = campeonRacha
      ? [preguntaRacha.opciones.find((o) => o.id === campeonRacha), ...preguntaRacha.opciones.filter((o) => o.id !== campeonRacha)].filter(Boolean)
      : preguntaRacha.opciones;
    const indiceElegido = ordenadas.findIndex((o) => o.id === opcionId);
    const correcta = opcionId === preguntaRacha.correctaId;

    registrarPregunta(correcta);
    if (!correcta) {
      setSeleccionRacha(opcionId);
      setRachaTerminada(true);
      actualizarEstadisticas((actual) => ({
        ...actual,
        rachasJugadas: actual.rachasJugadas + 1,
        mejorRachaDuelo: Math.max(actual.mejorRachaDuelo, rachaDuelo),
      }));
      return;
    }

    const nuevaRacha = rachaDuelo + 1;
    const nuevoCampeon = preguntaRacha.siguienteCampeonId;
    let nueva;
    try {
      nueva = crearPreguntaRacha(personas, nuevoCampeon, { evitarFirmas: firmasRacha.slice(-120) });
    } catch (err) {
      setSeleccionRacha(opcionId);
      setRachaDuelo(nuevaRacha);
      setRachaTerminada(true);
      actualizarEstadisticas((actual) => ({
        ...actual,
        rachasJugadas: actual.rachasJugadas + 1,
        mejorRachaDuelo: Math.max(actual.mejorRachaDuelo, nuevaRacha),
      }));
      return;
    }

    actualizarEstadisticas((actual) => ({ ...actual, mejorRachaDuelo: Math.max(actual.mejorRachaDuelo, nuevaRacha) }));
    const tipo = indiceElegido === 1 ? "gana-derecha" : "gana-izquierda";
    setSeleccionRacha(opcionId);
    setTransicionRacha({ tipo, fase: "confirmar" });

    programarRacha(() => {
      setTransicionRacha({ tipo, fase: "mover" });
      programarRacha(() => {
        setCampeonRacha(nuevoCampeon);
        setRachaDuelo(nuevaRacha);
        setPreguntaRacha(nueva);
        setFirmasRacha((actual) => [...actual, nueva.firma].slice(-140));
        setSeleccionRacha(null);
        setTransicionRacha(null);
      }, 430);
    }, 360);
  };

  // ---------------------------------------------------------------------------
  // RETRATOS · RACHA DE IDENTIFICACION
  // ---------------------------------------------------------------------------
  const [personaRetrato, setPersonaRetrato] = useState(null);
  const [consultaRetrato, setConsultaRetrato] = useState("");
  const [seleccionRetratoId, setSeleccionRetratoId] = useState(null);
  const [rachaRetratos, setRachaRetratos] = useState(0);
  const [retratosTerminada, setRetratosTerminada] = useState(false);
  const [usadosRetratos, setUsadosRetratos] = useState([]);

  const sugerenciasRetrato = useMemo(
    () => modo === "retratos" && !retratosTerminada ? sugerenciasPorNombre(personas, consultaRetrato, 7) : [],
    [modo, retratosTerminada, personas, consultaRetrato]
  );

  const enfocarRetrato = () => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => retratoInputRef.current?.focus());
  };

  const iniciarRetratos = () => {
    limpiarFeedback();
    if (personasConRetrato.length < 4) {
      setError("No hay suficientes retratos configurados para abrir este modo.");
      return;
    }
    try {
      setRachaRetratos(0);
      setUsadosRetratos([]);
      setModo("retratos");
      setError("");
      const persona = elegirPersonaRetrato(personasConRetrato, [], 0);
      if (!persona) throw new Error("No se pudo elegir un retrato.");
      setPersonaRetrato(persona);
      setConsultaRetrato("");
      setSeleccionRetratoId(null);
      setRetratosTerminada(false);
      setUsadosRetratos([persona.id]);
      enfocarRetrato();
    } catch (err) {
      console.error("[Desafío V2 · Retratos] No se pudo iniciar:", err);
      setError("No se ha podido iniciar la racha de Retratos.");
    }
  };

  const responderRetrato = (personaId) => {
    if (!personaRetrato || seleccionRetratoId || retratosTerminada) return;
    const acierto = personaId === personaRetrato.id;
    setSeleccionRetratoId(personaId);
    registrarPregunta(acierto);

    if (!acierto) {
      setRetratosTerminada(true);
      actualizarEstadisticas((actual) => ({
        ...actual,
        retratosJugados: actual.retratosJugados + 1,
        mejorRachaRetratos: Math.max(actual.mejorRachaRetratos, rachaRetratos),
      }));
      return;
    }

    const nuevaRacha = rachaRetratos + 1;
    setRachaRetratos(nuevaRacha);
    actualizarEstadisticas((actual) => ({
      ...actual,
      mejorRachaRetratos: Math.max(actual.mejorRachaRetratos, nuevaRacha),
    }));
    limpiarFeedback();
    feedbackTimerRef.current = window.setTimeout(() => {
      try {
        const siguiente = elegirPersonaRetrato(personasConRetrato, usadosRetratos, nuevaRacha);
        if (!siguiente) throw new Error("No hay siguiente retrato.");
        setPersonaRetrato(siguiente);
        setConsultaRetrato("");
        setSeleccionRetratoId(null);
        setUsadosRetratos((actuales) => [...new Set([...actuales, siguiente.id])].slice(-Math.max(40, personasConRetrato.length)));
        enfocarRetrato();
      } catch (err) {
        console.error("[Desafío V2 · Retratos] No se pudo continuar:", err);
        setRetratosTerminada(true);
        actualizarEstadisticas((actual) => ({
          ...actual,
          retratosJugados: actual.retratosJugados + 1,
          mejorRachaRetratos: Math.max(actual.mejorRachaRetratos, nuevaRacha),
        }));
      }
    }, 720);
  };

  // ---------------------------------------------------------------------------
  // DESAFIO DIARIO
  // ---------------------------------------------------------------------------
  const [daily, setDaily] = useState(null);
  const [shareStatus, setShareStatus] = useState("");

  const iniciarDiario = () => {
    limpiarFeedback();
    const guardado = leerJson(DAILY_KEY, {})?.[fechaHoy];
    if (guardado) {
      setDaily({ terminado: true, guardado, preguntas: [], indice: 0, seleccion: null, orden: [], resultados: guardado.resultados || [] });
      setModo("diario");
      return;
    }
    try {
      const preguntas = crearDesafioDiario(personas, fechaHoy);
      setDaily({ terminado: false, guardado: null, preguntas, indice: 0, seleccion: null, orden: [], resultados: [], aciertoActual: null });
      setModo("diario");
      setError("");
    } catch (err) {
      console.error("[Desafío V2 · Diario] No se pudo preparar:", err);
      setError("No se ha podido preparar el desafío diario.");
    }
  };

  const finalizarDiario = (resultados) => {
    const score = resultados.filter(Boolean).length;
    const registro = { fecha: fechaHoy, score, resultados };
    const todos = leerJson(DAILY_KEY, {});
    guardarJson(DAILY_KEY, { ...todos, [fechaHoy]: registro });
    setDaily((actual) => ({ ...actual, terminado: true, guardado: registro, resultados }));
    actualizarEstadisticas((actual) => ({
      ...actual,
      diariosJugados: actual.diariosJugados + 1,
      diariosPerfectos: actual.diariosPerfectos + (score === 5 ? 1 : 0),
      mejorDiario: Math.max(actual.mejorDiario, score),
    }));
  };

  const avanzarDiario = (estado) => {
    const siguienteIndice = estado.indice + 1;
    if (siguienteIndice >= estado.preguntas.length) {
      finalizarDiario(estado.resultados);
      return;
    }
    setDaily({ ...estado, indice: siguienteIndice, seleccion: null, orden: [], aciertoActual: null });
  };

  const registrarRespuestaDiaria = (acierto, seleccionValue) => {
    if (!daily || daily.seleccion !== null || daily.terminado) return;
    const resultados = [...daily.resultados, acierto];
    const estado = { ...daily, seleccion: seleccionValue, orden: Array.isArray(seleccionValue) ? seleccionValue : daily.orden, aciertoActual: acierto, resultados };
    setDaily(estado);
    registrarPregunta(acierto);
    limpiarFeedback();
    feedbackTimerRef.current = window.setTimeout(() => avanzarDiario(estado), 1050);
  };

  const responderDiario = (opcionId) => {
    const pregunta = daily?.preguntas?.[daily.indice];
    if (!pregunta || daily.seleccion !== null) return;
    registrarRespuestaDiaria(opcionId === pregunta.correctaId, opcionId);
  };

  const elegirOrdenDiario = (opcionId) => {
    const pregunta = daily?.preguntas?.[daily.indice];
    if (!pregunta || daily.seleccion !== null) return;
    const orden = daily.orden.includes(opcionId)
      ? daily.orden.filter((id) => id !== opcionId)
      : [...daily.orden, opcionId];
    if (orden.length < 3) {
      setDaily({ ...daily, orden });
      return;
    }
    const acierto = orden.join("|") === pregunta.ordenCorrecto.join("|");
    setDaily({ ...daily, orden });
    registrarRespuestaDiaria(acierto, orden);
  };

  const compartirDiario = async () => {
    const registro = daily?.guardado || resultadoHoy;
    if (!registro) return;
    const cuadrados = (registro.resultados || []).map((ok) => ok ? "🟩" : "🟥").join("");
    const texto = `El Árbol de Europa · Desafío diario\n${fechaHoy}\n\n${cuadrados}\n${registro.score}/5\n🌳 treeofeurope.eu/es/desafio`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "El Árbol de Europa · Desafío diario", text: texto });
        setShareStatus("Resultado compartido");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(texto);
        setShareStatus("Resultado copiado");
      } else {
        window.prompt("Copia tu resultado:", texto);
      }
    } catch (err) {
      if (err?.name !== "AbortError") setShareStatus("No se pudo compartir");
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const volverAModos = () => {
    limpiarFeedback();
    limpiarRachaTimers();
    setModo(null);
    setError("");
    setCamino(null);
    setCaminoTerminado(false);
    setPreguntaRacha(null);
    setRachaTerminada(false);
    setPersonaRetrato(null);
    setConsultaRetrato("");
    setSeleccionRetratoId(null);
    setRachaRetratos(0);
    setRetratosTerminada(false);
    setUsadosRetratos([]);
    setDaily(null);
  };

  // ---------------------------------------------------------------------------
  // MENU
  // ---------------------------------------------------------------------------
  if (!modo) {
    const precision = estadisticas.precisionPreguntas
      ? Math.round((estadisticas.precisionAciertos / estadisticas.precisionPreguntas) * 100)
      : 0;
    return (
      <section className="desafio-shell desafio-hub">
        <div className="desafio-hub-kicker"><Swords size={14} /> Desafío V2</div>
        <h1>¿Hasta dónde puedes llegar?</h1>
        <p className="desafio-intro">Empieza fácil, aprende mientras juegas y deja que el atlas vaya subiendo el nivel. No hace falta saberlo todo para disfrutar.</p>

        <div className="desafio-level-card">
          <span>Nivel de cronista</span>
          <strong>{progreso.nivel}</strong>
          <div><b>{progreso.titulo}</b><small>{estadisticas.totalAciertos} respuestas correctas acumuladas</small></div>
        </div>

        <div className="desafio-mode-grid desafio-mode-grid-v2">
          <button type="button" className="desafio-mode-card is-path" onClick={iniciarCamino}>
            <span className="desafio-mode-icon"><Sparkles size={21} /></span>
            <em>Modo principal</em>
            <strong>El Camino</strong>
            <span>3 vidas · dificultad progresiva · partida abierta</span>
            <small>Empiezas con duelos sencillos. Si encadenas aciertos, aparecen genealogía, sucesiones, cronología y acertijos.</small>
          </button>

          <button type="button" className="desafio-mode-card is-streak" onClick={iniciarRacha}>
            <span className="desafio-mode-icon"><Flame size={21} /></span>
            <em>Récord personal</em>
            <strong>Racha</strong>
            <span>2 opciones · el ganador continúa</span>
            <small>Un duelo tras otro. Cada respuesta correcta se queda en pantalla; el primer fallo termina la cadena.</small>
          </button>

          <button type="button" className="desafio-mode-card is-portrait" onClick={iniciarRetratos}>
            <span className="desafio-mode-icon"><Search size={21} /></span>
            <em>Reconocimiento visual</em>
            <strong>Retratos</strong>
            <span>Escribe · elige sugerencia · encadena aciertos</span>
            <small>Observa un retrato y empieza a escribir el nombre. Las coincidencias aparecen debajo: no hace falta introducirlo exactamente.</small>
          </button>

          <button type="button" className="desafio-mode-card is-daily" onClick={iniciarDiario}>
            <span className="desafio-mode-icon"><CalendarDays size={21} /></span>
            <em>{resultadoHoy ? "Completado hoy" : "Una vez al día"}</em>
            <strong>Desafío diario</strong>
            <span>{resultadoHoy ? `${resultadoHoy.score}/5 hoy` : "5 preguntas · iguales para todos"}</span>
            <small>{resultadoHoy ? "Tu resultado de hoy está guardado. Vuelve mañana para un nuevo desafío." : "Una combinación diaria fija que puedes compartir sin revelar las respuestas."}</small>
          </button>
        </div>

        <div className="desafio-stats-grid desafio-stats-grid-wide" aria-label="Estadísticas del desafío">
          <TarjetaEstadistica valor={estadisticas.mejorCamino} etiqueta="mejor Camino" />
          <TarjetaEstadistica valor={estadisticas.mejorRachaDuelo} etiqueta="récord Racha" />
          <TarjetaEstadistica valor={estadisticas.mejorRachaRetratos} etiqueta="récord Retratos" />
          <TarjetaEstadistica valor={`${estadisticas.mejorDiario}/5`} etiqueta="mejor diario" />
          <TarjetaEstadistica valor={`${precision}%`} etiqueta="precisión total" />
          <TarjetaEstadistica valor={estadisticas.totalAciertos} etiqueta="aciertos" />
        </div>
        {error && <div className="desafio-error" role="alert">{error}</div>}
        <p className="desafio-fineprint">Tus récords se guardan únicamente en este navegador. El juego evita, cuando puede, repetir preguntas vistas recientemente.</p>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // CAMINO
  // ---------------------------------------------------------------------------
  if (modo === "camino" && camino) {
    if (caminoTerminado) {
      const precision = camino.ronda ? Math.round((camino.aciertos / camino.ronda) * 100) : 0;
      const nuevoRecord = camino.ronda >= estadisticas.mejorCamino;
      return (
        <section className="desafio-shell desafio-final">
          <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
          <div className="desafio-kicker">El Camino · recorrido terminado</div>
          <div className="desafio-score"><strong>{camino.ronda}</strong><span> preguntas</span></div>
          <h2>{camino.ronda >= 20 ? "Has cruzado media Europa" : camino.ronda >= 10 ? "Un gran recorrido" : "Ya conoces un poco más del atlas"}</h2>
          {nuevoRecord && <div className="desafio-record"><Trophy size={14} /> Mejor recorrido personal</div>}

          <div className="desafio-stats-grid">
            <TarjetaEstadistica valor={camino.aciertos} etiqueta="aciertos" />
            <TarjetaEstadistica valor={`${precision}%`} etiqueta="precisión" />
            <TarjetaEstadistica valor={camino.mejorCombo} etiqueta="mejor combo" />
            <TarjetaEstadistica valor={camino.puntos.toLocaleString("es-ES")} etiqueta="puntos" />
          </div>

          {!!camino.descubiertos.length && (
            <div className="desafio-discovered">
              <span>Hoy has descubierto</span>
              <div>{camino.descubiertos.slice(0, 3).map((id) => (
                <button type="button" key={id} onClick={() => abrirAtlas(id)}>
                  {byId[id]?.nombre || id} <ExternalLink size={11} />
                </button>
              ))}</div>
            </div>
          )}

          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarCamino}><RotateCcw size={14} /> Otro Camino</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>Cambiar de modo</button>
          </div>
        </section>
      );
    }

    const pregunta = camino.pregunta;
    const mult = multiplicador(camino.combo);
    return (
      <section className="desafio-shell desafio-play">
        <div className="desafio-progress-row desafio-camino-head">
          <div>
            <span className="desafio-kicker">El Camino · ronda {camino.ronda}</span>
            <strong>{describirDificultad(pregunta.dificultad)}</strong>
          </div>
          <div className="desafio-camino-status">
            <Corazones vidas={camino.vidas} />
            <span className={`desafio-combo${camino.combo >= 3 ? " is-hot" : ""}`}><Zap size={14} /> {camino.combo}{mult > 1 ? ` · x${mult}` : ""}</span>
            <b>{camino.puntos.toLocaleString("es-ES")} pts</b>
          </div>
        </div>

        <div className="desafio-question-card">
          <div className="desafio-question-topline"><span>{pregunta.etiqueta}</span><small>★{"★".repeat(Math.max(0, pregunta.dificultad - 1))}</small></div>
          <h2>{pregunta.pregunta}</h2>

          {pregunta.formato === "pistas" && (
            <div className="desafio-clues">
              {pregunta.pistas.slice(0, camino.pistasVisibles).map((pista, index) => <div key={`${pista}-${index}`}><b>{index + 1}</b><span>{pista}</span></div>)}
              {!camino.respondida && camino.pistasVisibles < pregunta.pistas.length && (
                <button type="button" onClick={otraPista}><Lightbulb size={13} /> Otra pista <small>−15% puntos</small></button>
              )}
            </div>
          )}

          {camino.hintVisible && pregunta.formato !== "pistas" && <div className="desafio-hint"><Lightbulb size={14} /><span>{pregunta.hint || "Fíjate en la cronología y las relaciones de la ficha."}</span></div>}

          {pregunta.formato === "orden" ? (
            <PreguntaOrden pregunta={pregunta} byId={byId} orden={camino.orden} respondida={camino.respondida} onPick={elegirOrdenCamino} />
          ) : (
            <PreguntaOpciones
              pregunta={pregunta}
              byId={byId}
              seleccion={Array.isArray(camino.seleccion) ? null : camino.seleccion}
              respondida={camino.respondida}
              hidden={camino.hidden}
              onSelect={responderCamino}
            />
          )}

          {!camino.respondida && (
            <div className="desafio-lifelines">
              <button type="button" disabled={!camino.comodines.fifty || pregunta.formato === "orden" || pregunta.opciones.length <= 2} onClick={usarFifty}><span>50/50</span><small>Elimina una opción</small></button>
              <button type="button" disabled={!camino.comodines.hint} onClick={usarPista}><Lightbulb size={14} /><small>Pista</small></button>
              <button type="button" disabled={!camino.comodines.swap} onClick={cambiarPregunta}><Shuffle size={14} /><small>Cambio</small></button>
            </div>
          )}
        </div>

        {camino.respondida && (
          <ExplicacionCompacta
            correcta={camino.aciertoActual}
            explicacion={pregunta.explicacion}
            expandida={camino.feedbackExpandido}
            onExpand={expandirFeedbackCamino}
            onContinue={continuarCamino}
            puedeAtlas={Boolean(pregunta.atlasPersonId && byId[pregunta.atlasPersonId])}
            onAtlas={() => abrirAtlas(pregunta.atlasPersonId)}
          />
        )}

        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> Salir del Camino</button>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // RACHA
  // ---------------------------------------------------------------------------
  if (modo === "racha" && preguntaRacha) {
    const correcta = preguntaRacha.opciones.find((o) => o.id === preguntaRacha.correctaId);
    const elegida = preguntaRacha.opciones.find((o) => o.id === seleccionRacha);
    const opcionesOrdenadas = campeonRacha
      ? [preguntaRacha.opciones.find((o) => o.id === campeonRacha), ...preguntaRacha.opciones.filter((o) => o.id !== campeonRacha)].filter(Boolean)
      : preguntaRacha.opciones;
    const preguntaVisible = { ...preguntaRacha, opciones: opcionesOrdenadas };

    if (rachaTerminada) {
      return (
        <section className="desafio-shell desafio-final">
          <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
          <div className="desafio-kicker">Racha terminada</div>
          <div className="desafio-score desafio-score-streak"><Flame size={30} /><strong>{rachaDuelo}</strong></div>
          <h2>{rachaDuelo >= 15 ? "Una cadena histórica" : rachaDuelo >= 7 ? "Buena racha" : "La siguiente puede llegar más lejos"}</h2>
          {seleccionRacha !== preguntaRacha.correctaId && (
            <div className="desafio-racha-answer">
              <span><b>Elegiste:</b> {elegida?.label || "—"}</span>
              <span><b>Era:</b> {correcta?.label || "—"}</span>
              <p>{preguntaRacha.explicacion}</p>
            </div>
          )}
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarRacha}><RotateCcw size={14} /> Nueva racha</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>Cambiar de modo</button>
          </div>
        </section>
      );
    }

    return (
      <section className="desafio-shell desafio-play desafio-racha-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">Racha · el ganador continúa</span><strong>Elige una de las dos opciones</strong></div>
          <div className="desafio-streak-live"><Flame size={16} /> {rachaDuelo}</div>
        </div>
        <div className="desafio-question-card desafio-racha-card">
          <div className="desafio-question-topline"><span>Duelo rápido</span><small>1 fallo = fin</small></div>
          <h2>{preguntaRacha.pregunta}</h2>
          <div className={`desafio-racha-motion${transicionRacha ? ` racha-${transicionRacha.tipo} fase-${transicionRacha.fase}` : ""}`}>
            <PreguntaOpciones
              pregunta={preguntaVisible}
              byId={byId}
              seleccion={seleccionRacha}
              respondida={seleccionRacha !== null}
              onSelect={responderRacha}
              campeonId={campeonRacha}
            />
          </div>
        </div>
        <div className="desafio-racha-rule">La respuesta correcta se queda para el siguiente duelo. Si fallas, la racha termina.</div>
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> Salir de Racha</button>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // RETRATOS
  // ---------------------------------------------------------------------------
  if (modo === "retratos" && personaRetrato) {
    const imagen = IMAGENES_PERSONAS[personaRetrato.id];
    const elegida = seleccionRetratoId ? byId[seleccionRetratoId] : null;

    if (retratosTerminada) {
      return (
        <section className="desafio-shell desafio-final desafio-portrait-final">
          <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
          <div className="desafio-kicker">Retratos · racha terminada</div>
          <div className="desafio-score desafio-score-streak"><Search size={30} /><strong>{rachaRetratos}</strong></div>
          <h2>{rachaRetratos >= 12 ? "Ojo de retratista" : rachaRetratos >= 5 ? "Buena memoria visual" : "La siguiente mirada llegará más lejos"}</h2>
          <div className="desafio-portrait-result">
            {imagen?.archivo && (
              <span className="desafio-portrait-result-image">
                <img src={imagen.archivo} alt={`Retrato de ${personaRetrato.nombre}`} style={{ objectPosition: imagen.encuadre || imagen.posicion || "50% 20%" }} />
              </span>
            )}
            <div>
              <span><b>Elegiste:</b> {elegida?.nombre || "—"}</span>
              <span><b>Era:</b> {personaRetrato.nombre}</span>
              <small>{[personaRetrato.titulo, personaRetrato.dinastia].filter(Boolean).join(" · ")}</small>
            </div>
          </div>
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarRetratos}><RotateCcw size={14} /> Nueva racha de retratos</button>
            <button type="button" className="desafio-secondary" onClick={() => abrirAtlas(personaRetrato.id)}>Ver en el atlas <ExternalLink size={13} /></button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>Cambiar de modo</button>
          </div>
        </section>
      );
    }

    return (
      <section className="desafio-shell desafio-play desafio-portrait-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">Retratos · identifica al personaje</span><strong>Empieza a escribir su nombre</strong></div>
          <div className="desafio-streak-live"><Flame size={16} /> {rachaRetratos}</div>
        </div>

        <div className="desafio-question-card desafio-portrait-card">
          <div className="desafio-question-topline"><span>Racha visual</span><small>1 fallo = fin</small></div>
          <h2>¿Quién aparece en este retrato?</h2>
          <div className="desafio-portrait-stage">
            {imagen?.archivo ? (
              <img
                src={imagen.archivo}
                alt="Retrato histórico por identificar"
                draggable="false"
                style={{
                  objectPosition: imagen.encuadre || imagen.posicion || "50% 20%",
                  transform: Number.isFinite(imagen.zoom) && imagen.zoom > 1 ? `scale(${imagen.zoom})` : undefined,
                }}
              />
            ) : <span>?</span>}
          </div>

          <div className="desafio-name-entry">
            <label htmlFor="desafio-retrato-nombre">Nombre del personaje</label>
            <div className="desafio-name-input">
              <Search size={16} />
              <input
                ref={retratoInputRef}
                id="desafio-retrato-nombre"
                type="text"
                value={consultaRetrato}
                disabled={Boolean(seleccionRetratoId)}
                autoComplete="off"
                spellCheck="false"
                placeholder="Ej. Carlos V, Catalina de Médici…"
                onChange={(event) => setConsultaRetrato(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && sugerenciasRetrato[0]) {
                    event.preventDefault();
                    responderRetrato(sugerenciasRetrato[0].id);
                  }
                }}
              />
            </div>
            <small>Escribe solo una parte. Elige una de las coincidencias; no necesitas poner el nombre exacto.</small>

            {!!consultaRetrato.trim() && !seleccionRetratoId && (
              <div className="desafio-name-suggestions" role="listbox" aria-label="Sugerencias de nombres">
                {sugerenciasRetrato.length ? sugerenciasRetrato.map((persona) => (
                  <button type="button" key={persona.id} role="option" onClick={() => responderRetrato(persona.id)}>
                    <strong>{persona.nombre}</strong>
                    <span>{[persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || "Personaje histórico"}</span>
                  </button>
                )) : <div className="desafio-name-empty">No encuentro coincidencias. Prueba con otra parte del nombre.</div>}
              </div>
            )}

            {seleccionRetratoId === personaRetrato.id && (
              <div className="desafio-portrait-correct"><Check size={15} /><strong>Correcto</strong><span>{personaRetrato.nombre}</span></div>
            )}
          </div>
        </div>
        <div className="desafio-racha-rule">Cada acierto trae un nuevo retrato. La dificultad visual aumenta poco a poco y el primer fallo cierra la racha.</div>
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> Salir de Retratos</button>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // DIARIO
  // ---------------------------------------------------------------------------
  if (modo === "diario" && daily) {
    if (daily.terminado) {
      const registro = daily.guardado || resultadoHoy;
      const score = registro?.score ?? 0;
      return (
        <section className="desafio-shell desafio-final desafio-daily-final">
          <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
          <div className="desafio-kicker">Desafío diario · {fechaHoy}</div>
          <div className="desafio-daily-blocks" aria-label={`${score} de 5`}>
            {(registro?.resultados || []).map((ok, index) => <span key={index} className={ok ? "is-good" : "is-bad"} />)}
          </div>
          <div className="desafio-score"><strong>{score}</strong><span>/ 5</span></div>
          <h2>{score === 5 ? "Pleno histórico" : score >= 3 ? "Buen día en el atlas" : "Mañana hay otra oportunidad"}</h2>
          <p className="desafio-intro">El resultado queda guardado en este navegador. El próximo desafío cambia al comenzar un nuevo día.</p>
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={compartirDiario}><Share2 size={14} /> Compartir resultado</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>Volver a modos</button>
          </div>
          {shareStatus && <div className="desafio-share-status">{shareStatus}</div>}
        </section>
      );
    }

    const pregunta = daily.preguntas[daily.indice];
    const respondida = daily.seleccion !== null;
    return (
      <section className="desafio-shell desafio-play desafio-daily-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">Desafío diario · {fechaHoy}</span><strong>Pregunta {daily.indice + 1} de 5</strong></div>
          <div className="desafio-daily-mini">{daily.resultados.map((ok, i) => <span key={i} className={ok ? "is-good" : "is-bad"} />)}</div>
        </div>
        <div className="desafio-progress"><span style={{ width: `${((daily.indice + (respondida ? 1 : 0)) / 5) * 100}%` }} /></div>
        <div className="desafio-question-card">
          <div className="desafio-question-topline"><span>{pregunta.etiqueta}</span><small>Igual para todos hoy</small></div>
          <h2>{pregunta.pregunta}</h2>
          {pregunta.formato === "orden" ? (
            <PreguntaOrden pregunta={pregunta} byId={byId} orden={daily.orden} respondida={respondida} onPick={elegirOrdenDiario} />
          ) : (
            <PreguntaOpciones pregunta={pregunta} byId={byId} seleccion={daily.seleccion} respondida={respondida} onSelect={responderDiario} />
          )}
        </div>
        {respondida && (
          <div className={`desafio-fast-feedback is-flash${daily.aciertoActual ? " is-correct" : " is-wrong"}`}>
            {daily.aciertoActual ? <Check size={15} /> : <X size={15} />}
            <strong>{daily.aciertoActual ? "Correcto" : "Incorrecto"}</strong>
            <span>{pregunta.explicacion}</span>
          </div>
        )}
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> Salir</button>
      </section>
    );
  }

  return (
    <section className="desafio-shell">
      <div className="desafio-error" role="alert">No se ha podido abrir este modo.</div>
      <button type="button" className="desafio-secondary" onClick={volverAModos}><RefreshCw size={13} /> Volver</button>
    </section>
  );
}
