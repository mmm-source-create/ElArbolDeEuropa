import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Flame, ListChecks, RotateCcw, X } from "lucide-react";
import { crearPartida, crearPreguntaRacha } from "./desafioEngine.jsx";
import "./desafio.css";

const STORAGE_KEY = "arbol-europa-desafio-v1";
const RECENT_KEY = "arbol-europa-desafio-recientes-v1";
const ESTADISTICAS_INICIALES = Object.freeze({
  partidas: 0,
  aciertos: 0,
  mejorPuntuacion: 0,
  racha: 0,
  rachasJugadas: 0,
  mejorRachaDuelo: 0,
});

function leerEstadisticas() {
  if (typeof window === "undefined") return { ...ESTADISTICAS_INICIALES };
  try {
    const guardado = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return {
      partidas: Number.isFinite(guardado?.partidas) ? guardado.partidas : 0,
      aciertos: Number.isFinite(guardado?.aciertos) ? guardado.aciertos : 0,
      mejorPuntuacion: Number.isFinite(guardado?.mejorPuntuacion) ? guardado.mejorPuntuacion : 0,
      racha: Number.isFinite(guardado?.racha) ? guardado.racha : 0,
      rachasJugadas: Number.isFinite(guardado?.rachasJugadas) ? guardado.rachasJugadas : 0,
      mejorRachaDuelo: Number.isFinite(guardado?.mejorRachaDuelo) ? guardado.mejorRachaDuelo : 0,
    };
  } catch {
    return { ...ESTADISTICAS_INICIALES };
  }
}

function guardarEstadisticas(valor) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valor)); } catch { /* localStorage puede estar bloqueado */ }
}

function leerRecientes() {
  if (typeof window === "undefined") return [];
  try {
    const guardado = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(guardado) ? guardado.filter((firma) => typeof firma === "string").slice(-100) : [];
  } catch {
    return [];
  }
}

function guardarRecientes(firmas) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(firmas.slice(-100))); } catch { /* localStorage puede estar bloqueado */ }
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
  const [modo, setModo] = useState(null);
  const [error, setError] = useState("");

  // Partida clásica.
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [rachaActual, setRachaActual] = useState(0);
  const [terminada, setTerminada] = useState(false);
  const [recordClasico, setRecordClasico] = useState(false);

  // Modo Racha.
  const [preguntaRacha, setPreguntaRacha] = useState(null);
  const [campeonRacha, setCampeonRacha] = useState(null);
  const [rachaDuelo, setRachaDuelo] = useState(0);
  const [seleccionRacha, setSeleccionRacha] = useState(null);
  const [rachaTerminada, setRachaTerminada] = useState(false);
  const [firmasRacha, setFirmasRacha] = useState([]);

  const pregunta = preguntas[indice] || null;
  const respondida = seleccion !== null;
  const acierto = respondida && seleccion === pregunta?.correctaId;

  const actualizarEstadisticas = (cambios) => {
    const siguientes = { ...estadisticas, ...cambios };
    setEstadisticas(siguientes);
    guardarEstadisticas(siguientes);
    return siguientes;
  };

  const abrirAtlas = (personaId) => {
    const slug = slugs[personaId];
    if (!personaId || !slug || typeof window === "undefined") return;
    const url = new URL(`/es/persona/${encodeURIComponent(slug)}`, window.location.origin);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  const volverAModos = () => {
    setModo(null);
    setError("");
    setPreguntas([]);
    setTerminada(false);
    setPreguntaRacha(null);
    setRachaTerminada(false);
    setSeleccionRacha(null);
  };

  const iniciarClasico = () => {
    try {
      const recientes = leerRecientes();
      const nuevas = crearPartida(personas, 10, { evitarFirmas: recientes });
      guardarRecientes([...recientes, ...nuevas.map((item) => item.firma).filter(Boolean)]);
      setModo("clasico");
      setPreguntas(nuevas);
      setIndice(0);
      setSeleccion(null);
      setPuntuacion(0);
      setRachaActual(0);
      setTerminada(false);
      setRecordClasico(false);
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

    actualizarEstadisticas({
      aciertos: estadisticas.aciertos + (esCorrecta ? 1 : 0),
      racha: Math.max(estadisticas.racha, siguienteRacha),
    });
  };

  const siguiente = () => {
    if (!respondida) return;
    if (indice < preguntas.length - 1) {
      setIndice((actual) => actual + 1);
      setSeleccion(null);
      return;
    }
    const nuevoRecord = puntuacion > estadisticas.mejorPuntuacion;
    actualizarEstadisticas({
      partidas: estadisticas.partidas + 1,
      mejorPuntuacion: Math.max(estadisticas.mejorPuntuacion, puntuacion),
    });
    setRecordClasico(nuevoRecord);
    setTerminada(true);
  };

  const iniciarRacha = () => {
    try {
      const nueva = crearPreguntaRacha(personas);
      setModo("racha");
      setPreguntaRacha(nueva);
      setCampeonRacha(null);
      setRachaDuelo(0);
      setSeleccionRacha(null);
      setRachaTerminada(false);
      setFirmasRacha([nueva.firma]);
      setError("");
    } catch (err) {
      console.error("[Desafío · Racha] No se pudo iniciar:", err);
      setError("No se ha podido iniciar el modo Racha con los datos actuales.");
    }
  };

  const responderRacha = (opcionId) => {
    if (!preguntaRacha || seleccionRacha !== null || rachaTerminada) return;
    const esCorrecta = opcionId === preguntaRacha.correctaId;
    if (!esCorrecta) {
      setSeleccionRacha(opcionId);
      setRachaTerminada(true);
      actualizarEstadisticas({
        rachasJugadas: estadisticas.rachasJugadas + 1,
        mejorRachaDuelo: Math.max(estadisticas.mejorRachaDuelo, rachaDuelo),
      });
      return;
    }

    const siguienteRacha = rachaDuelo + 1;
    const nuevoCampeon = preguntaRacha.siguienteCampeonId;
    const nuevasEstadisticas = actualizarEstadisticas({
      aciertos: estadisticas.aciertos + 1,
      mejorRachaDuelo: Math.max(estadisticas.mejorRachaDuelo, siguienteRacha),
    });

    try {
      const nueva = crearPreguntaRacha(personas, nuevoCampeon, { evitarFirmas: firmasRacha.slice(-120) });
      setCampeonRacha(nuevoCampeon);
      setRachaDuelo(siguienteRacha);
      setPreguntaRacha(nueva);
      setFirmasRacha((actuales) => [...actuales, nueva.firma].slice(-160));
      setSeleccionRacha(null);
    } catch (err) {
      console.error("[Desafío · Racha] No se pudo generar el siguiente duelo:", err);
      setRachaDuelo(siguienteRacha);
      setRachaTerminada(true);
      setSeleccionRacha(preguntaRacha.correctaId);
      setEstadisticas(nuevasEstadisticas);
      setError("La racha terminó porque no se pudo generar otro duelo sin repetir los anteriores.");
    }
  };

  if (!modo) {
    return (
      <div className="desafio-shell desafio-intro">
        <div className="desafio-kicker">V1.2 · juego local</div>
        <h3>Elige cómo quieres poner a prueba el atlas</h3>
        <p>Dos modos construidos a partir de la propia base genealógica. Sin cuentas, sin límite de tiempo y con estadísticas guardadas únicamente en este navegador.</p>

        <div className="desafio-mode-grid">
          <button type="button" className="desafio-mode-card" onClick={iniciarClasico}>
            <span className="desafio-mode-icon"><ListChecks size={20} /></span>
            <strong>Partida clásica</strong>
            <span>10 preguntas · 4 opciones</span>
            <small>Dinastías, parentescos, gobiernos, matrimonios, descendencia, sucesiones, sobrenombres y pistas.</small>
          </button>
          <button type="button" className="desafio-mode-card is-streak" onClick={iniciarRacha}>
            <span className="desafio-mode-icon"><Flame size={20} /></span>
            <strong>Racha</strong>
            <span>1 pregunta · 2 opciones · sin final</span>
            <small>La respuesta correcta continúa en el siguiente duelo. Cada acierto suma uno; un fallo termina la partida.</small>
          </button>
        </div>

        <div className="desafio-stats-grid desafio-stats-grid-wide" aria-label="Estadísticas del desafío">
          <TarjetaEstadistica valor={estadisticas.partidas} etiqueta="partidas clásicas" />
          <TarjetaEstadistica valor={estadisticas.aciertos} etiqueta="aciertos totales" />
          <TarjetaEstadistica valor={`${estadisticas.mejorPuntuacion}/10`} etiqueta="mejor clásica" />
          <TarjetaEstadistica valor={estadisticas.racha} etiqueta="racha clásica" />
          <TarjetaEstadistica valor={estadisticas.mejorRachaDuelo} etiqueta="récord Racha" />
        </div>
        {error && <div className="desafio-error" role="alert">{error}</div>}
        <p className="desafio-fineprint">La partida clásica evita, siempre que la base lo permite, las preguntas vistas recientemente.</p>
      </div>
    );
  }

  if (modo === "racha") {
    if (!preguntaRacha) return null;
    const opcionCorrecta = preguntaRacha.opciones.find((opcion) => opcion.id === preguntaRacha.correctaId);
    const opcionElegida = preguntaRacha.opciones.find((opcion) => opcion.id === seleccionRacha);

    if (rachaTerminada) {
      return (
        <div className="desafio-shell desafio-final desafio-racha-final">
          <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
          <div className="desafio-kicker">Racha terminada</div>
          <div className="desafio-score desafio-score-streak"><Flame size={28} /><strong>{rachaDuelo}</strong></div>
          <h3>{rachaDuelo >= 10 ? "Una cadena formidable" : rachaDuelo >= 5 ? "Buena racha" : "La siguiente llegará más lejos"}</h3>
          {seleccionRacha !== preguntaRacha.correctaId && (
            <div className="desafio-racha-answer">
              <span><b>Elegiste:</b> {opcionElegida?.label || "—"}</span>
              <span><b>Era:</b> {opcionCorrecta?.label || "—"}</span>
              <p>{preguntaRacha.explicacion}</p>
            </div>
          )}
          {preguntaRacha.atlasPersonId && byId[preguntaRacha.atlasPersonId] && (
            <button type="button" className="desafio-secondary" onClick={() => abrirAtlas(preguntaRacha.atlasPersonId)}>Ver respuesta en el atlas <ExternalLink size={13} /></button>
          )}
          <div className="desafio-final-actions">
            <button type="button" className="desafio-primary" onClick={iniciarRacha}><RotateCcw size={14} /> Nueva racha</button>
            <button type="button" className="desafio-secondary" onClick={volverAModos}>Cambiar de modo</button>
          </div>
        </div>
      );
    }

    return (
      <div className="desafio-shell desafio-racha-shell">
        <div className="desafio-progress-row desafio-racha-head">
          <div>
            <span className="desafio-kicker">Racha · el ganador continúa</span>
            <strong>Elige una de las dos opciones</strong>
          </div>
          <div className="desafio-streak-live"><Flame size={15} /> {rachaDuelo}</div>
        </div>

        <div className="desafio-question-card desafio-racha-card">
          <h3>{preguntaRacha.pregunta}</h3>
          <div className="desafio-options desafio-options-two">
            {preguntaRacha.opciones.map((opcion) => (
              <button
                type="button"
                key={opcion.id}
                className={`desafio-option desafio-option-duel${campeonRacha === opcion.id ? " is-champion" : ""}`}
                onClick={() => responderRacha(opcion.id)}
              >
                <span>{opcion.label}</span>
                {campeonRacha === opcion.id && <small>continúa</small>}
              </button>
            ))}
          </div>
        </div>
        <div className="desafio-racha-rule">Si aciertas, la respuesta correcta permanece como una de las dos opciones de la siguiente pregunta. Si fallas, pierdes la racha.</div>
        <button type="button" className="desafio-back desafio-back-bottom" onClick={volverAModos}><ArrowLeft size={13} /> Salir de Racha</button>
      </div>
    );
  }

  if (terminada) {
    return (
      <div className="desafio-shell desafio-final">
        <button type="button" className="desafio-back" onClick={volverAModos}><ArrowLeft size={13} /> Modos</button>
        <div className="desafio-kicker">Partida terminada</div>
        <div className="desafio-score"><strong>{puntuacion}</strong><span>/ 10</span></div>
        <h3>{puntuacion >= 8 ? "Gran recorrido" : puntuacion >= 5 ? "Buen recorrido" : "Todavía queda atlas por explorar"}</h3>
        {recordClasico && <div className="desafio-record"><Check size={14} /> Nueva mejor puntuación</div>}
        <div className="desafio-stats-grid">
          <TarjetaEstadistica valor={estadisticas.partidas} etiqueta="partidas" />
          <TarjetaEstadistica valor={estadisticas.aciertos} etiqueta="aciertos totales" />
          <TarjetaEstadistica valor={`${estadisticas.mejorPuntuacion}/10`} etiqueta="mejor puntuación" />
          <TarjetaEstadistica valor={estadisticas.racha} etiqueta="mejor racha" />
        </div>
        <div className="desafio-final-actions">
          <button type="button" className="desafio-primary" onClick={iniciarClasico}><RotateCcw size={14} /> Jugar otra vez</button>
          <button type="button" className="desafio-secondary" onClick={volverAModos}>Cambiar de modo</button>
        </div>
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
              <button type="button" className="desafio-secondary" onClick={() => abrirAtlas(pregunta.atlasPersonId)}>Ver en el atlas <ExternalLink size={13} /></button>
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
