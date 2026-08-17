import React, { useMemo, useState } from "react";
import { ArrowRight, Check, ExternalLink, RotateCcw, X } from "lucide-react";
import { crearPartida } from "./desafioEngine.jsx";
import "./desafio.css";

const STORAGE_KEY = "arbol-europa-desafio-v1";
const ESTADISTICAS_INICIALES = Object.freeze({ partidas: 0, aciertos: 0, mejorPuntuacion: 0, racha: 0 });

function leerEstadisticas() {
  if (typeof window === "undefined") return { ...ESTADISTICAS_INICIALES };
  try {
    const guardado = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return {
      partidas: Number.isFinite(guardado?.partidas) ? guardado.partidas : 0,
      aciertos: Number.isFinite(guardado?.aciertos) ? guardado.aciertos : 0,
      mejorPuntuacion: Number.isFinite(guardado?.mejorPuntuacion) ? guardado.mejorPuntuacion : 0,
      racha: Number.isFinite(guardado?.racha) ? guardado.racha : 0,
    };
  } catch {
    return { ...ESTADISTICAS_INICIALES };
  }
}

function guardarEstadisticas(valor) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valor)); } catch { /* localStorage puede estar bloqueado */ }
}

function slugPublico(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "persona";
}

function construirSlugs(personas) {
  const counts = personas.reduce((acc, persona) => {
    const base = slugPublico(persona.nombre);
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});
  return Object.fromEntries(personas.map((persona) => {
    const base = slugPublico(persona.nombre);
    return [persona.id, counts[base] > 1 ? `${base}-${slugPublico(persona.id)}` : base];
  }));
}

function TarjetaEstadistica({ valor, etiqueta }) {
  return <div className="desafio-stat"><strong>{valor}</strong><span>{etiqueta}</span></div>;
}

export default function Desafio({ personas = [] }) {
  const byId = useMemo(() => Object.fromEntries(personas.map((p) => [p.id, p])), [personas]);
  const slugs = useMemo(() => construirSlugs(personas), [personas]);
  const [estadisticas, setEstadisticas] = useState(leerEstadisticas);
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [rachaActual, setRachaActual] = useState(0);
  const [terminada, setTerminada] = useState(false);
  const [error, setError] = useState("");

  const pregunta = preguntas[indice] || null;
  const respondida = seleccion !== null;
  const acierto = respondida && seleccion === pregunta?.correctaId;

  const iniciar = () => {
    try {
      const nuevas = crearPartida(personas, 10);
      setPreguntas(nuevas);
      setIndice(0);
      setSeleccion(null);
      setPuntuacion(0);
      setRachaActual(0);
      setTerminada(false);
      setError("");
    } catch (err) {
      console.error("[Desafío] No se pudo crear la partida:", err);
      setError("No se ha podido generar una partida válida con los datos actuales.");
    }
  };

  const responder = (opcionId) => {
    if (!pregunta || respondida) return;
    const esCorrecta = opcionId === pregunta.correctaId;
    setSeleccion(opcionId);
    const siguienteRacha = esCorrecta ? rachaActual + 1 : 0;
    setRachaActual(siguienteRacha);
    if (esCorrecta) setPuntuacion((actual) => actual + 1);

    const siguientes = {
      ...estadisticas,
      aciertos: estadisticas.aciertos + (esCorrecta ? 1 : 0),
      racha: Math.max(estadisticas.racha, siguienteRacha),
    };
    setEstadisticas(siguientes);
    guardarEstadisticas(siguientes);
  };

  const siguiente = () => {
    if (!respondida) return;
    if (indice < preguntas.length - 1) {
      setIndice((actual) => actual + 1);
      setSeleccion(null);
      return;
    }
    const finalScore = puntuacion + (acierto ? 0 : 0);
    const siguientes = {
      ...estadisticas,
      partidas: estadisticas.partidas + 1,
      mejorPuntuacion: Math.max(estadisticas.mejorPuntuacion, finalScore),
    };
    setEstadisticas(siguientes);
    guardarEstadisticas(siguientes);
    setTerminada(true);
  };

  const abrirAtlas = () => {
    const personaId = pregunta?.atlasPersonId;
    const slug = slugs[personaId];
    if (!personaId || !slug || typeof window === "undefined") return;
    const url = new URL(`/es/persona/${encodeURIComponent(slug)}`, window.location.origin);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  if (!preguntas.length && !terminada) {
    return (
      <div className="desafio-shell desafio-intro">
        <div className="desafio-kicker">V1.1 · juego local</div>
        <h3>Diez preguntas para recorrer la red de otra manera</h3>
        <p>Dinastías, parentescos, gobiernos efectivos, sucesiones, sobrenombres y pistas generadas a partir de la propia base de datos. Cuatro opciones por pregunta, sin límite de tiempo y sin cuentas.</p>
        <div className="desafio-stats-grid" aria-label="Estadísticas del desafío">
          <TarjetaEstadistica valor={estadisticas.partidas} etiqueta="partidas" />
          <TarjetaEstadistica valor={estadisticas.aciertos} etiqueta="aciertos" />
          <TarjetaEstadistica valor={`${estadisticas.mejorPuntuacion}/10`} etiqueta="mejor puntuación" />
          <TarjetaEstadistica valor={estadisticas.racha} etiqueta="mejor racha" />
        </div>
        {error && <div className="desafio-error" role="alert">{error}</div>}
        <button type="button" className="desafio-primary" onClick={iniciar}>Comenzar desafío <ArrowRight size={15} /></button>
        <p className="desafio-fineprint">Las estadísticas se guardan únicamente en este navegador.</p>
      </div>
    );
  }

  if (terminada) {
    const esRecord = puntuacion >= estadisticas.mejorPuntuacion && puntuacion > 0;
    return (
      <div className="desafio-shell desafio-final">
        <div className="desafio-kicker">Partida terminada</div>
        <div className="desafio-score"><strong>{puntuacion}</strong><span>/ 10</span></div>
        <h3>{puntuacion >= 8 ? "Gran recorrido" : puntuacion >= 5 ? "Buen recorrido" : "Todavía queda atlas por explorar"}</h3>
        {esRecord && <div className="desafio-record"><Check size={14} /> Mejor puntuación</div>}
        <div className="desafio-stats-grid">
          <TarjetaEstadistica valor={estadisticas.partidas} etiqueta="partidas" />
          <TarjetaEstadistica valor={estadisticas.aciertos} etiqueta="aciertos" />
          <TarjetaEstadistica valor={`${estadisticas.mejorPuntuacion}/10`} etiqueta="mejor puntuación" />
          <TarjetaEstadistica valor={estadisticas.racha} etiqueta="mejor racha" />
        </div>
        <button type="button" className="desafio-primary" onClick={iniciar}><RotateCcw size={14} /> Jugar otra vez</button>
      </div>
    );
  }

  return (
    <div className="desafio-shell">
      <div className="desafio-progress-row">
        <div>
          <span className="desafio-kicker">{pregunta.etiqueta}</span>
          <strong>Pregunta {indice + 1} de {preguntas.length}</strong>
        </div>
        <div className="desafio-live-score">{puntuacion} aciertos</div>
      </div>
      <div className="desafio-progress" aria-hidden="true"><span style={{ width: `${((indice + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }} /></div>

      <div className="desafio-question-card">
        <h3>{pregunta.pregunta}</h3>
        <div className="desafio-options">
          {pregunta.opciones.map((opcion) => {
            const esCorrecta = opcion.id === pregunta.correctaId;
            const esSeleccionada = opcion.id === seleccion;
            const clase = respondida
              ? esCorrecta ? " is-correct" : esSeleccionada ? " is-wrong" : " is-muted"
              : "";
            return (
              <button
                type="button"
                key={opcion.id}
                className={`desafio-option${clase}`}
                disabled={respondida}
                onClick={() => responder(opcion.id)}
              >
                <span>{opcion.label}</span>
                {respondida && esCorrecta && <Check size={15} aria-hidden="true" />}
                {respondida && esSeleccionada && !esCorrecta && <X size={15} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      {respondida && (
        <div className={`desafio-feedback ${acierto ? "is-correct" : "is-wrong"}`} aria-live="polite">
          <div className="desafio-feedback-title">{acierto ? <Check size={16} /> : <X size={16} />} <strong>{acierto ? "Correcto" : "No esta vez"}</strong></div>
          {!acierto && (
            <div className="desafio-feedback-answer">
              <span><b>Tu respuesta:</b> {pregunta.opciones.find((opcion) => opcion.id === seleccion)?.label || "—"}</span>
              <span><b>Respuesta correcta:</b> {pregunta.opciones.find((opcion) => opcion.id === pregunta.correctaId)?.label || "—"}</span>
            </div>
          )}
          <p>{pregunta.explicacion}</p>
          <div className="desafio-feedback-actions">
            {pregunta.atlasPersonId && byId[pregunta.atlasPersonId] && (
              <button type="button" className="desafio-secondary" onClick={abrirAtlas}>Ver en el atlas <ExternalLink size={13} /></button>
            )}
            <button type="button" className="desafio-primary" onClick={siguiente}>
              {indice < preguntas.length - 1 ? <>Siguiente <ArrowRight size={14} /></> : <>Ver resultado <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
