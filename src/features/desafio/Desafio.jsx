import {portraitSuggestions as sugerenciasPorNombre} from './portraitSearch.js';
import {gobiernosDe, territoriosDe} from '../../domain/genealogy/personAccessors.js';
import { lazy,Suspense,useCallback, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
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
  Zap,
} from "lucide-react";
import { IMAGENES_PERSONAS } from "../../data/imagenesPersonas.js";
import { IMAGE_VARIANTS } from "../../data/imageVariants.js";
import { responsiveImage } from "../../utils/responsiveImage.js";
import { normalizarBusquedaPublica, slugPublico, tieneContenidoEditorial } from "../../domain/people/personPresentation.js";
import {
  crearDesafioDiario,
  crearPreguntaCamino,
  crearPreguntaRacha,
  describirDificultad,
} from "./desafioEngine.js";
import {PreguntaOpciones, PreguntaOrden, Explicacion} from './Question.jsx';
import LearningSession from './LearningSession.jsx';
import Odometer from '../../ui/Odometer.jsx';
import SegmentedControl from '../../ui/SegmentedControl.jsx';
import './desafio-interactions.css';
import {successionBank, createChallenge, challengeUrl, readChallenge, readReview, reviewQuestions, updateReview, saveReview} from './learning.js';
import {resumenCortoPersona} from '../../domain/people/personPresentation.js';
import "./desafio.css";
import {challengeQuestion,challengeText} from './challengeI18n.js';

const Dinastle=lazy(()=>import('./Dinastle.jsx'));

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
  puntos += Math.min(12, (gobiernosDe(persona).length) * 3);
  puntos += Math.min(5, territoriosDe(persona).length);
  if (tieneContenidoEditorial(persona)) puntos += 3;
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

const HUB_TABS = [{value:'jugar',label:'Jugar'},{value:'aprender',label:'Aprender'}];

function TarjetaEstadistica({ valor, etiqueta }) {
  return <div className="desafio-stat"><strong><Odometer value={valor}/></strong><span>{etiqueta}</span></div>;
}

function Corazones({ vidas, locale='es' }) {
  return (
    <span className="desafio-lives" aria-label={`${vidas} ${locale==='en'?'lives':'vidas'}`}>
      {[0, 1, 2].map((i) => <Heart key={i} size={15} className={i < vidas ? "is-live" : "is-lost"} fill={i < vidas ? "currentColor" : "none"} />)}
    </span>
  );
}

export default function Desafio({ personas = [], locale = 'es' }) {
  const en=locale==='en';
  const tr=(es,english)=>en?english:es;
  const byId = useMemo(() => Object.fromEntries(personas.map((p) => [p.id, p])), [personas]);
  const slugs = useMemo(() => construirSlugs(personas), [personas]);
  const personasConRetrato = useMemo(() => personas.filter((persona) => Boolean(IMAGE_VARIANTS[IMAGENES_PERSONAS[persona.id]?.archivo])), [personas]);
  const [hubTab, setHubTab] = useState('jugar');
  const hubId = useId();
  const [estadisticas, setEstadisticas] = useState(leerEstadisticas);
  const bank = useMemo(() => successionBank(personas), [personas]);
  const [shared] = useState(() => readChallenge(typeof window==='undefined'?'':window.location.search, bank));
  const storage = () => { try { return window.localStorage; } catch { return null; } };
  const [review, setReview] = useState(() => readReview(storage(), byId, bank));
  const [reviewWarning, setReviewWarning] = useState('');
  const [lesson, setLesson] = useState(() => shared?.preguntas ? {questions:shared.preguntas, url:challengeUrl(bank,shared.seed)} : null);
  const [modo, setModo] = useState(shared?.preguntas ? 'compartido' : (typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('juego')==='dinastle'?'dinastle':null));
  const [error, setError] = useState(shared?.error || "");
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

  const abrirAtlas = (personaId) => {
    const slug = slugs[personaId];
    if (!personaId || !slug || typeof window === "undefined") return;
    window.open(`/${en?'en/person':'es/persona'}/${encodeURIComponent(slug)}?atlas=1`, "_blank", "noopener,noreferrer");
  };

  const remember = (question, correct) => {
    const next = updateReview(review, question, correct);
    setReview(next);
    if (!saveReview(storage(), next)) setReviewWarning(tr('El navegador no permite guardar el repaso. Podrás usarlo durante esta visita.','The browser cannot save the review. You can still use it during this visit.'));
  };
  const startLesson = mode => {
    const seed = Array.from(crypto.getRandomValues(new Uint32Array(2)), n=>n.toString(36)).join('-');
    const questions = mode==='repaso' ? reviewQuestions(review) : createChallenge(bank,seed);
    setLesson({questions, url:mode==='compartido'?challengeUrl(bank,seed):null});
    setModo(mode); setError('');
  };
  const registrarPregunta = (acierto, question) => {
    if (question) remember(question,acierto);
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

  const nuevaPreguntaCamino = (estado) => {
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
      hidden: [],
      hintVisible: false,
      pistasVisibles: pregunta.formato === "pistas" ? 1 : 0,
      pistasExtra: 0,
    };
  };

  const iniciarCamino = () => {
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
      setError(tr("No se ha podido preparar El Camino con los datos actuales.","The Path could not be prepared with the current data."));
    }
  };

  const finalizarCamino = (estado) => {
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
    try {
      const base = { ...estado, ronda: estado.ronda + 1 };
      setCamino(nuevaPreguntaCamino(base));
    } catch (err) {
      console.error("[Desafío V2 · Camino] No se pudo generar la siguiente:", err);
      finalizarCamino(estado);
      setError(tr("El recorrido terminó porque no se pudo generar otra pregunta sin repetir las anteriores.","The journey ended because another non-repeating question could not be generated."));
    }
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
    registrarPregunta(acierto, camino.pregunta);
    actualizarEstadisticas((actual) => ({ ...actual, mejorCombo: Math.max(actual.mejorCombo, siguienteCombo) }));
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
      const reemplazada = nuevaPreguntaCamino(base);
      reemplazada.comodines = { ...camino.comodines, swap: false };
      setCamino(reemplazada);
    } catch (err) {
      console.error("[Desafío V2] No se pudo cambiar la pregunta:", err);
      setError(tr("No se ha podido cambiar esta pregunta.","This question could not be changed."));
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

  const iniciarRacha = () => {
    try {
      const pregunta = crearPreguntaRacha(personas);
      setPreguntaRacha(pregunta);
      setCampeonRacha(null);
      setRachaDuelo(0);
      setSeleccionRacha(null);
      setRachaTerminada(false);
      setFirmasRacha([pregunta.firma]);
      setModo("racha");
      setError("");
    } catch (err) {
      console.error("[Desafío V2 · Racha] No se pudo iniciar:", err);
      setError(tr("No se ha podido iniciar Racha con los datos actuales.","Streak could not be started with the current data."));
    }
  };

  const responderRacha = (opcionId) => {
    if (!preguntaRacha || seleccionRacha !== null || rachaTerminada) return;
    const correcta = opcionId === preguntaRacha.correctaId;
    setSeleccionRacha(opcionId);
    registrarPregunta(correcta, preguntaRacha);
    if (correcta) {
      setRachaDuelo(rachaDuelo+1);
      actualizarEstadisticas(actual=>({...actual,mejorRachaDuelo:Math.max(actual.mejorRachaDuelo,rachaDuelo+1)}));
    }
  };
  const continuarRacha = () => {
    if (seleccionRacha===null) return;
    if (seleccionRacha===preguntaRacha.correctaId) {
      try {
        const next = crearPreguntaRacha(personas,preguntaRacha.siguienteCampeonId,{evitarFirmas:firmasRacha.slice(-120)});
        setCampeonRacha(preguntaRacha.siguienteCampeonId); setPreguntaRacha(next);
        setFirmasRacha([...firmasRacha,next.firma].slice(-140)); setSeleccionRacha(null); return;
      } catch { setError(tr('No quedan duelos disponibles para continuar esta racha.','No duels remain to continue this streak.')); }
    }
    setRachaTerminada(true);
    actualizarEstadisticas(actual=>({...actual,rachasJugadas:actual.rachasJugadas+1,mejorRachaDuelo:Math.max(actual.mejorRachaDuelo,rachaDuelo)}));
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
    if (personasConRetrato.length < 4) {
      setError(tr("No hay suficientes retratos configurados para abrir este modo.","There are not enough portraits to open this mode."));
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
      setError(tr("No se ha podido iniciar la racha de Retratos.","The Portrait streak could not be started."));
    }
  };

  const responderRetrato = (personaId) => {
    if (!personaRetrato || seleccionRetratoId || retratosTerminada) return;
    const acierto = personaId === personaRetrato.id;
    setSeleccionRetratoId(personaId);
    registrarPregunta(acierto, {
      firma:`retrato:${personaRetrato.id}`, pregunta:'¿Quién aparece en este retrato?', formato:'retrato', tipo:'retrato', etiqueta:'Retratos',
      correctaId:personaRetrato.id, atlasPersonId:personaRetrato.id, imagenId:personaRetrato.id,
      explicacion:`${personaRetrato.nombre}. ${resumenCortoPersona(personaRetrato)}`,
      opciones:[personaRetrato,...personasConRetrato.filter(p=>p.id!==personaRetrato.id).slice(0,3)].map(p=>({id:p.id,label:p.nombre})),
    });

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
  };
  const continuarRetrato = () => {
    try {
      const siguiente = elegirPersonaRetrato(personasConRetrato, usadosRetratos, rachaRetratos);
      if (!siguiente) throw new Error('No hay siguiente retrato.');
      setPersonaRetrato(siguiente); setConsultaRetrato(''); setSeleccionRetratoId(null);
      setUsadosRetratos([...new Set([...usadosRetratos,siguiente.id])]); enfocarRetrato();
    } catch { setRetratosTerminada(true); }
  };

  // ---------------------------------------------------------------------------
  // DESAFIO DIARIO
  // ---------------------------------------------------------------------------
  const [daily, setDaily] = useState(null);
  const [shareStatus, setShareStatus] = useState("");

  const iniciarDiario = () => {
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
      setError(tr("No se ha podido preparar el desafío diario.","The daily challenge could not be prepared."));
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
    registrarPregunta(acierto, daily.preguntas[daily.indice]);
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
        setShareStatus(tr("Resultado copiado","Result copied"));
      } else {
        window.prompt(tr("Copia tu resultado:","Copy your result:"), texto);
      }
    } catch (err) {
      if (err?.name !== "AbortError") setShareStatus(tr("No se pudo compartir","Could not share"));
    }
    window.setTimeout(() => setShareStatus(""), 2200);
  };

  const volverAModos = () => {
    setModo(null);
    const url = new URL(window.location.href);
    if(url.searchParams.has('juego')){url.searchParams.delete('juego');window.history.replaceState(null,'',url);}
    if(url.searchParams.has('reto')) { url.searchParams.delete('reto'); url.searchParams.delete('banco'); window.history.replaceState(null,'',url); }
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
  if(modo==='dinastle')return <Suspense fallback={<p role="status">{tr('Preparando Dinastle…','Preparing Dinastle…')}</p>}><Dinastle people={personas} onBack={volverAModos} locale={locale}/></Suspense>;
  if (lesson && ['repaso','sucesiones','compartido'].includes(modo)) return <LearningSession key={modo} mode={modo} questions={lesson.questions} sharedUrl={lesson.url} warning={reviewWarning} byId={byId} onBack={volverAModos} onAtlas={abrirAtlas} onAnswer={(question,correct)=>remember(question,correct)} locale={locale}/>;
  if (!modo) {
    const precision = estadisticas.precisionPreguntas
      ? Math.round((estadisticas.precisionAciertos / estadisticas.precisionPreguntas) * 100)
      : 0;
    return (
      <section className="desafio-shell desafio-hub">
        <div className="desafio-hub-kicker"><Swords size={14} /> {tr('Aprender con el Atlas','Learn with the Atlas')}</div>
        <h1>{tr('¿Hasta dónde puedes llegar?','How far can you go?')}</h1>
        <p className="desafio-intro">{tr('Empieza fácil, aprende mientras juegas y deja que el atlas vaya subiendo el nivel. No hace falta saberlo todo para disfrutar.','Start gently, learn as you play and let the Atlas raise the level. You do not need to know everything to enjoy it.')}</p>

        <div className="desafio-level-card">
          <span>{tr('Nivel de cronista','Chronicler level')}</span>
          <strong><Odometer value={progreso.nivel}/></strong>
          <div><b>{en?(['Apprentice','Chronicler','Genealogist','Counsellor','Master of the Atlas'][Math.min(4,progreso.nivel>=13?4:progreso.nivel>=9?3:progreso.nivel>=6?2:progreso.nivel>=3?1:0)]):progreso.titulo}</b><small>{estadisticas.totalAciertos} {tr('respuestas correctas acumuladas','correct answers in total')}</small></div>
        </div>

        <SegmentedControl id={hubId} tabs label={tr('Modos del desafío','Challenge modes')} options={en?[{value:'jugar',label:'Play'},{value:'aprender',label:'Learn'}]:HUB_TABS} value={hubTab} onChange={setHubTab}/>
        <div id={`${hubId}-panel-jugar`} role="tabpanel" aria-labelledby={`${hubId}-tab-jugar`} hidden={hubTab!=='jugar'} className="desafio-mode-grid desafio-mode-grid-v2">
          <button type="button" className="desafio-mode-card is-daily" onClick={()=>{setModo('dinastle');const url=new URL(window.location.href);url.searchParams.set('juego','dinastle');window.history.replaceState(null,'',url);}}><span className="desafio-mode-icon"><Search size={21}/></span><em>{tr('Un personaje al día','One person a day')}</em><strong>Dinastle</strong><span>{tr('8 intentos · pistas con cada propuesta','8 attempts · clues after every guess')}</span><small>{tr('Casa, territorios, función, época y vínculos. Descubre al personaje de hoy o juega una partida libre.','House, territories, role, period and relationships. Find today’s person or play a free game.')}</small></button>
          <button type="button" className="desafio-mode-card is-path" onClick={iniciarCamino}>
            <span className="desafio-mode-icon"><Sparkles size={21} /></span>
            <em>{tr('Modo principal','Main mode')}</em>
            <strong>{tr('El Camino','The Path')}</strong>
            <span>{tr('3 vidas · dificultad progresiva · partida abierta','3 lives · progressive difficulty · open game')}</span>
            <small>{tr('Empiezas con duelos sencillos. Si encadenas aciertos, aparecen genealogía, sucesiones, cronología y acertijos.','You begin with simple duels. Build a streak to unlock genealogy, successions, chronology and riddles.')}</small>
          </button>

          <button type="button" className="desafio-mode-card is-streak" onClick={iniciarRacha}>
            <span className="desafio-mode-icon"><Flame size={21} /></span>
            <em>{tr('Récord personal','Personal best')}</em>
            <strong>{tr('Racha','Streak')}</strong>
            <span>{tr('2 opciones · el ganador continúa','2 choices · the winner continues')}</span>
            <small>{tr('Un duelo tras otro. Cada respuesta correcta se queda en pantalla; el primer fallo termina la cadena.','One duel after another. Each correct answer remains on screen; the first mistake ends the chain.')}</small>
          </button>

          <button type="button" className="desafio-mode-card is-portrait" onClick={iniciarRetratos}>
            <span className="desafio-mode-icon"><Search size={21} /></span>
            <em>{tr('Reconocimiento visual','Visual recognition')}</em>
            <strong>{tr('Retratos','Portraits')}</strong>
            <span>{tr('Escribe · elige sugerencia · encadena aciertos','Type · choose a suggestion · build a streak')}</span>
            <small>{tr('Observa un retrato y empieza a escribir el nombre. Las coincidencias aparecen debajo: no hace falta introducirlo exactamente.','Study a portrait and start typing the name. Matches appear below; an exact spelling is not required.')}</small>
          </button>

          <button type="button" className="desafio-mode-card is-daily" onClick={iniciarDiario}>
            <span className="desafio-mode-icon"><CalendarDays size={21} /></span>
            <em>{resultadoHoy ? tr('Completado hoy','Completed today') : tr('Una vez al día','Once a day')}</em>
            <strong>{tr('Desafío diario','Daily challenge')}</strong>
            <span>{resultadoHoy ? `${resultadoHoy.score}/5 ${tr('hoy','today')}` : tr('5 preguntas · iguales para todos','5 questions · the same for everyone')}</span>
            <small>{resultadoHoy ? tr('Tu resultado de hoy está guardado. Vuelve mañana para un nuevo desafío.','Today’s result is saved. Come back tomorrow for a new challenge.') : tr('Una combinación diaria fija que puedes compartir sin revelar las respuestas.','A fixed daily set you can share without revealing the answers.')}</small>
          </button>
        </div>

        <div id={`${hubId}-panel-aprender`} role="tabpanel" aria-labelledby={`${hubId}-tab-aprender`} hidden={hubTab!=='aprender'} className="desafio-mode-grid desafio-learning-grid">
          <button type="button" className="desafio-mode-card" onClick={()=>startLesson('sucesiones')}><span className="desafio-mode-icon"><Swords size={21}/></span><em>{tr('Historia documentada','Documented history')}</em><strong>{tr('Resolver una sucesión','Solve a succession')}</strong><span>{tr('5 preguntas · personas y motivos','5 questions · people and reasons')}</span><small>{tr('Herencia, elección, regencia o conquista: descubre cómo cambió el gobierno y consulta su explicación.','Inheritance, election, regency or conquest: discover how government changed and read the explanation.')}</small></button>
          <button type="button" className="desafio-mode-card" onClick={()=>startLesson('repaso')}><span className="desafio-mode-icon"><RotateCcw size={21}/></span><em>{tr('Práctica sin presión','Pressure-free practice')}</em><strong>{tr('Repasar errores','Review mistakes')}</strong><span>{review.length} {tr('preguntas pendientes','questions pending')}</span><small>{tr('Vuelve a las preguntas que te han costado. Sin vidas, puntos ni cambios en tus récords.','Return to difficult questions, without lives, points or changes to your records.')}</small></button>
          <button type="button" className="desafio-mode-card" onClick={()=>startLesson('compartido')}><span className="desafio-mode-icon"><Share2 size={21}/></span><em>{tr('Para jugar con amigos','Play with friends')}</em><strong>{tr('Desafío compartido','Shared challenge')}</strong><span>{tr('Un enlace · la misma partida','One link · the same game')}</span><small>{tr('Comparte cinco preguntas de sucesiones en el mismo orden y compara los aciertos.','Share five succession questions in the same order and compare scores.')}</small></button>
        </div>
        {reviewWarning && <p className="desafio-fineprint" role="status">{reviewWarning}</p>}
        <div className="desafio-stats-grid desafio-stats-grid-wide" aria-label={tr('Estadísticas del desafío','Challenge statistics')}>
          <TarjetaEstadistica valor={estadisticas.mejorCamino} etiqueta={tr('mejor Camino','best Path')} />
          <TarjetaEstadistica valor={estadisticas.mejorRachaDuelo} etiqueta={tr('récord Racha','best Streak')} />
          <TarjetaEstadistica valor={estadisticas.mejorRachaRetratos} etiqueta={tr('récord Retratos','best Portraits')} />
          <TarjetaEstadistica valor={`${estadisticas.mejorDiario}/5`} etiqueta={tr('mejor diario','best daily')} />
          <TarjetaEstadistica valor={`${precision}%`} etiqueta={tr('precisión total','total accuracy')} />
          <TarjetaEstadistica valor={estadisticas.totalAciertos} etiqueta={tr('aciertos','correct')} />
        </div>
        {error && <div className="desafio-error" role="alert">{error}</div>}
        <p className="desafio-fineprint">{tr('Tus récords se guardan únicamente en este navegador. El juego evita, cuando puede, repetir preguntas vistas recientemente.','Your records are stored only in this browser. Whenever possible, the game avoids recently seen questions.')}</p>
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
          <div className="desafio-kicker">{tr('El Camino · recorrido terminado','The Path · journey complete')}</div>
          <div className="desafio-score"><strong>{camino.ronda}</strong><span> {tr('preguntas','questions')}</span></div>
          <h2>{camino.ronda >= 20 ? tr('Has cruzado media Europa','You crossed half of Europe') : camino.ronda >= 10 ? tr('Un gran recorrido','A great journey') : tr('Ya conoces un poco más del atlas','You know the Atlas a little better')}</h2>
          {nuevoRecord && <div className="desafio-record"><Trophy size={14} /> {tr('Mejor recorrido personal','Personal best')}</div>}

          <div className="desafio-stats-grid">
            <TarjetaEstadistica valor={camino.aciertos} etiqueta={tr('aciertos','correct')} />
            <TarjetaEstadistica valor={`${precision}%`} etiqueta={tr('precisión','accuracy')} />
            <TarjetaEstadistica valor={camino.mejorCombo} etiqueta={tr('mejor combo','best combo')} />
            <TarjetaEstadistica valor={camino.puntos.toLocaleString(en?'en-GB':'es-ES')} etiqueta={tr('puntos','points')} />
          </div>

          {!!camino.descubiertos.length && (
            <div className="desafio-discovered">
              <span>{tr('Hoy has descubierto','Today you discovered')}</span>
              <div>{camino.descubiertos.slice(0, 3).map((id) => (
                <button type="button" key={id} onClick={() => abrirAtlas(id)}>
                  {byId[id]?.nombre || id} <ExternalLink size={11} />
                </button>
              ))}</div>
            </div>
          )}

          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarCamino}><RotateCcw size={14} /> {tr('Otro Camino','Another Path')}</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>{tr('Cambiar de modo','Change mode')}</button>
          </div>
        </section>
      );
    }

    const pregunta = challengeQuestion(camino.pregunta,locale);
    const mult = multiplicador(camino.combo);
    return (
      <section className="desafio-shell desafio-play">
        <div className="desafio-progress-row desafio-camino-head">
          <div>
            <span className="desafio-kicker">{tr('El Camino','The Path')} · {tr('ronda','round')} {camino.ronda}</span>
            <strong>{challengeText(describirDificultad(pregunta.dificultad),locale)}</strong>
          </div>
          <div className="desafio-camino-status">
            <Corazones vidas={camino.vidas} locale={locale}/>
            <span className={`desafio-combo${camino.combo >= 3 ? " is-hot" : ""}`}><Zap size={14} /> {camino.combo}{mult > 1 ? ` · x${mult}` : ""}</span>
            <b>{camino.puntos.toLocaleString(en?'en-GB':'es-ES')} pts</b>
          </div>
        </div>

        <div className="desafio-question-card">
          <div className="desafio-question-topline"><span>{pregunta.etiqueta}</span><small>★{"★".repeat(Math.max(0, pregunta.dificultad - 1))}</small></div>
          <h2>{pregunta.pregunta}</h2>

          {pregunta.formato === "pistas" && (
            <div className="desafio-clues">
              {pregunta.pistas.slice(0, camino.pistasVisibles).map((pista, index) => <div key={`${pista}-${index}`}><b>{index + 1}</b><span>{pista}</span></div>)}
              {!camino.respondida && camino.pistasVisibles < pregunta.pistas.length && (
                <button type="button" onClick={otraPista}><Lightbulb size={13} /> {tr('Otra pista','Another clue')} <small>−15% {tr('puntos','points')}</small></button>
              )}
            </div>
          )}

          {camino.hintVisible && pregunta.formato !== "pistas" && <div className="desafio-hint"><Lightbulb size={14} /><span>{pregunta.hint || tr('Fíjate en la cronología y las relaciones de la ficha.','Look at the chronology and relationships in the profile.')}</span></div>}

          {pregunta.formato === "orden" ? (
            <PreguntaOrden pregunta={pregunta} byId={byId} orden={camino.orden} respondida={camino.respondida} onPick={elegirOrdenCamino} locale={locale} />
          ) : (
            <PreguntaOpciones
              pregunta={pregunta}
              byId={byId}
              seleccion={Array.isArray(camino.seleccion) ? null : camino.seleccion}
              respondida={camino.respondida}
              hidden={camino.hidden}
              onSelect={responderCamino}
              locale={locale}
            />
          )}

          {!camino.respondida && (
            <div className="desafio-lifelines">
              <button type="button" disabled={!camino.comodines.fifty || pregunta.formato === "orden" || pregunta.opciones.length <= 2} onClick={usarFifty}><span>50/50</span><small>{tr('Elimina una opción','Remove one option')}</small></button>
              <button type="button" disabled={!camino.comodines.hint} onClick={usarPista}><Lightbulb size={14} /><small>{tr('Pista','Hint')}</small></button>
              <button type="button" disabled={!camino.comodines.swap} onClick={cambiarPregunta}><Shuffle size={14} /><small>{tr('Cambio','Swap')}</small></button>
            </div>
          )}
        </div>

        {camino.respondida && (
          <Explicacion
            correcta={camino.aciertoActual}
            pregunta={pregunta}
            onContinue={continuarCamino}
            puedeAtlas={Boolean(pregunta.atlasPersonId && byId[pregunta.atlasPersonId])}
            onAtlas={() => abrirAtlas(pregunta.atlasPersonId)}
            locale={locale}
          />
        )}

        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> {tr('Salir del Camino','Leave the Path')}</button>
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
    const localizedRacha=challengeQuestion(preguntaRacha,locale);
    const preguntaVisible = { ...localizedRacha, opciones: opcionesOrdenadas.map(option=>localizedRacha.opciones.find(item=>item.id===option.id)||option) };

    if (rachaTerminada) {
      return (
        <section className="desafio-shell desafio-final">
          <div className="desafio-kicker">{tr('Racha terminada','Streak ended')}</div>
          <div className="desafio-score desafio-score-streak"><Flame size={30} /><strong>{rachaDuelo}</strong></div>
          <h2>{rachaDuelo >= 15 ? tr('Una cadena histórica','A historic run') : rachaDuelo >= 7 ? tr('Buena racha','Great streak') : tr('La siguiente puede llegar más lejos','The next one can go further')}</h2>
          {seleccionRacha !== preguntaRacha.correctaId && (
            <div className="desafio-racha-answer">
              <span><b>{tr('Elegiste:','You chose:')}</b> {preguntaVisible.opciones.find(item=>item.id===elegida?.id)?.label || "—"}</span>
              <span><b>{tr('Era:','Correct answer:')}</b> {preguntaVisible.opciones.find(item=>item.id===correcta?.id)?.label || "—"}</span>
              <p>{preguntaVisible.explicacion}</p>
            </div>
          )}
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarRacha}><RotateCcw size={14} /> {tr('Nueva racha','New streak')}</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>{tr('Cambiar de modo','Change mode')}</button>
          </div>
        </section>
      );
    }

    return (
      <section className="desafio-shell desafio-play desafio-racha-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">{tr('Racha · el ganador continúa','Streak · the winner stays')}</span><strong>{tr('Elige una de las dos opciones','Choose one of the two options')}</strong></div>
          <div className="desafio-streak-live"><Flame size={16} /> {rachaDuelo}</div>
        </div>
        <div className="desafio-question-card desafio-racha-card">
          <div className="desafio-question-topline"><span>{tr('Duelo rápido','Quick duel')}</span><small>{tr('1 fallo = fin','1 mistake = game over')}</small></div>
          <h2>{preguntaVisible.pregunta}</h2>
          <div className="desafio-racha-motion">
            <PreguntaOpciones
              pregunta={preguntaVisible}
              byId={byId}
              seleccion={seleccionRacha}
              respondida={seleccionRacha !== null}
              onSelect={responderRacha}
              campeonId={campeonRacha}
              locale={locale}
            />
          </div>
        </div>
        {seleccionRacha!==null && <Explicacion correcta={seleccionRacha===preguntaRacha.correctaId} pregunta={preguntaVisible} onContinue={continuarRacha} puedeAtlas={!!byId[preguntaRacha.atlasPersonId]} onAtlas={()=>abrirAtlas(preguntaRacha.atlasPersonId)} locale={locale}/>}
        <div className="desafio-racha-rule">{tr('La respuesta correcta se queda para el siguiente duelo. Si fallas, la racha termina.','The correct answer stays for the next duel. One mistake ends the streak.')}</div>
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> {tr('Salir de Racha','Leave Streak')}</button>
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
          <div className="desafio-kicker">{tr('Retratos · racha terminada','Portraits · streak ended')}</div>
          <div className="desafio-score desafio-score-streak"><Search size={30} /><strong>{rachaRetratos}</strong></div>
          <h2>{rachaRetratos >= 12 ? tr('Ojo de retratista','Portrait expert') : rachaRetratos >= 5 ? tr('Buena memoria visual','Great visual memory') : tr('La siguiente mirada llegará más lejos','The next look can go further')}</h2>
          <div className="desafio-portrait-result">
            {imagen?.archivo && (
              <span className="desafio-portrait-result-image">
                <img {...responsiveImage(imagen.archivo, '96px')} alt={`${tr('Retrato de','Portrait of')} ${personaRetrato.nombre}`} style={{ objectPosition: imagen.encuadre || imagen.posicion || "50% 20%" }} />
              </span>
            )}
            <div>
              <span><b>{tr('Elegiste:','You chose:')}</b> {elegida?.nombre || "—"}</span>
              <span><b>{tr('Era:','Correct answer:')}</b> {personaRetrato.nombre}</span>
              <small>{[personaRetrato.titulo, personaRetrato.dinastia].filter(Boolean).join(" · ")}</small>
            </div>
          </div>
          <p className="desafio-intro">{resumenCortoPersona(personaRetrato)}</p>
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarRetratos}><RotateCcw size={14} /> {tr('Nueva racha de retratos','New portrait streak')}</button>
            <button type="button" className="desafio-secondary" onClick={() => abrirAtlas(personaRetrato.id)}>{tr('Ver en el atlas','View in the Atlas')} <ExternalLink size={13} /></button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>{tr('Cambiar de modo','Change mode')}</button>
          </div>
        </section>
      );
    }

    return (
      <section className="desafio-shell desafio-play desafio-portrait-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">{tr('Retratos · identifica al personaje','Portraits · identify the person')}</span><strong>{tr('Empieza a escribir su nombre','Start typing their name')}</strong></div>
          <div className="desafio-streak-live"><Flame size={16} /> {rachaRetratos}</div>
        </div>

        <div className="desafio-question-card desafio-portrait-card">
          <div className="desafio-question-topline"><span>{tr('Racha visual','Visual streak')}</span><small>{tr('1 fallo = fin','1 mistake = game over')}</small></div>
          <h2>{tr('¿Quién aparece en este retrato?','Who appears in this portrait?')}</h2>
          <div className="desafio-portrait-stage">
            {imagen?.archivo ? (
              <img
                {...responsiveImage(imagen.archivo, '(max-width: 600px) 80vw, 310px')}
                alt={tr('Retrato histórico por identificar','Historical portrait to identify')}
                draggable="false"
                style={{
                  objectPosition: imagen.encuadre || imagen.posicion || "50% 20%",
                  transform: Number.isFinite(imagen.zoom) && imagen.zoom > 1 ? `scale(${imagen.zoom})` : undefined,
                }}
              />
            ) : <span>?</span>}
          </div>

          <div className="desafio-name-entry">
            <label htmlFor="desafio-retrato-nombre">{tr('Nombre del personaje','Person’s name')}</label>
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
                placeholder={tr('Ej. Carlos V, Catalina de Médici…','E.g. Charles V, Catherine de’ Medici…')}
                onChange={(event) => setConsultaRetrato(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && sugerenciasRetrato[0]) {
                    event.preventDefault();
                    responderRetrato(sugerenciasRetrato[0].id);
                  }
                }}
              />
            </div>
            <small>{tr('Escribe solo una parte. Elige una de las coincidencias; no necesitas poner el nombre exacto.','Type only part of the name and choose a match; exact spelling is not required.')}</small>

            {!!consultaRetrato.trim() && !seleccionRetratoId && (
              <div className="desafio-name-suggestions" role="listbox" aria-label={tr('Sugerencias de nombres','Name suggestions')}>
                {sugerenciasRetrato.length ? sugerenciasRetrato.map((persona) => (
                  <button type="button" key={persona.id} role="option" onClick={() => responderRetrato(persona.id)}>
                    <strong>{persona.nombre}</strong>
                    <span>{[persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || tr('Personaje histórico','Historical person')}</span>
                  </button>
                )) : <div className="desafio-name-empty">{tr('No encuentro coincidencias. Prueba con otra parte del nombre.','No matches found. Try another part of the name.')}</div>}
              </div>
            )}


          </div>
        </div>
        {seleccionRetratoId===personaRetrato.id && <Explicacion correcta pregunta={{explicacion:`${personaRetrato.nombre}. ${resumenCortoPersona(personaRetrato)}`}} onContinue={continuarRetrato} puedeAtlas onAtlas={()=>abrirAtlas(personaRetrato.id)} locale={locale}/>}
        <div className="desafio-racha-rule">{tr('Cada acierto trae un nuevo retrato. La dificultad visual aumenta poco a poco y el primer fallo cierra la racha.','Each correct answer reveals a new portrait. Visual difficulty rises gradually, and the first mistake ends the streak.')}</div>
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> {tr('Salir de Retratos','Leave Portraits')}</button>
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
          <div className="desafio-kicker">{tr('Desafío diario','Daily challenge')} · {fechaHoy}</div>
          <div className="desafio-daily-blocks" aria-label={`${score} ${tr('de','of')} 5`}>
            {(registro?.resultados || []).map((ok, index) => <span key={index} className={ok ? "is-good" : "is-bad"} />)}
          </div>
          <div className="desafio-score"><strong>{score}</strong><span>/ 5</span></div>
          <h2>{score === 5 ? tr('Pleno histórico','A perfect history score') : score >= 3 ? tr('Buen día en el atlas','A good day in the Atlas') : tr('Mañana hay otra oportunidad','Tomorrow is another chance')}</h2>
          <p className="desafio-intro">{tr('El resultado queda guardado en este navegador. El próximo desafío cambia al comenzar un nuevo día.','The result is saved in this browser. A new challenge begins on the next day.')}</p>
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={compartirDiario}><Share2 size={14} /> {tr('Compartir resultado','Share result')}</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>{tr('Volver a modos','Back to modes')}</button>
          </div>
          {shareStatus && <div className="desafio-share-status">{shareStatus}</div>}
        </section>
      );
    }

    const pregunta = challengeQuestion(daily.preguntas[daily.indice],locale);
    const respondida = daily.seleccion !== null;
    return (
      <section className="desafio-shell desafio-play desafio-daily-shell">
        <div className="desafio-progress-row">
          <div><span className="desafio-kicker">{tr('Desafío diario','Daily challenge')} · {fechaHoy}</span><strong>{tr('Pregunta','Question')} {daily.indice + 1} {tr('de','of')} 5</strong></div>
          <div className="desafio-daily-mini">{daily.resultados.map((ok, i) => <span key={i} className={ok ? "is-good" : "is-bad"} />)}</div>
        </div>
        <div className="desafio-progress"><span style={{ width: `${((daily.indice + (respondida ? 1 : 0)) / 5) * 100}%` }} /></div>
        <div className="desafio-question-card">
          <div className="desafio-question-topline"><span>{pregunta.etiqueta}</span><small>{tr('Igual para todos hoy','The same for everyone today')}</small></div>
          <h2>{pregunta.pregunta}</h2>
          {pregunta.formato === "orden" ? (
            <PreguntaOrden pregunta={pregunta} byId={byId} orden={daily.orden} respondida={respondida} onPick={elegirOrdenDiario} locale={locale} />
          ) : (
            <PreguntaOpciones pregunta={pregunta} byId={byId} seleccion={daily.seleccion} respondida={respondida} onSelect={responderDiario} locale={locale} />
          )}
        </div>
        {respondida && (
          <Explicacion correcta={daily.aciertoActual} pregunta={pregunta} onContinue={()=>avanzarDiario(daily)} puedeAtlas={!!byId[pregunta.atlasPersonId]} onAtlas={()=>abrirAtlas(pregunta.atlasPersonId)} locale={locale}/>
        )}
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> {tr('Salir','Leave')}</button>
      </section>
    );
  }

  return (
    <section className="desafio-shell">
      <div className="desafio-error" role="alert">{tr('No se ha podido abrir este modo.','This mode could not be opened.')}</div>
      <button type="button" className="desafio-secondary" onClick={volverAModos}><RefreshCw size={13} /> {tr('Volver','Back')}</button>
    </section>
  );
}
