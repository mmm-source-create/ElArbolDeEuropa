import React from "react";
import {Check, X, ArrowRight, ExternalLink} from "lucide-react";
import {IMAGENES_PERSONAS} from "../imagenesPersonas.js";
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

export function PreguntaOpciones({
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

export function PreguntaOrden({ pregunta, byId, orden, respondida, onPick }) {
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

export function Explicacion({correcta, pregunta, onContinue, onAtlas, puedeAtlas}) {
  return <div className={`desafio-fast-feedback${correcta ? ' is-correct' : ' is-wrong'}`} role="status">
    <div className="desafio-fast-feedback-head">{correcta ? <Check size={16}/> : <X size={16}/>}<strong>{correcta ? 'Correcto' : 'No esta vez'}</strong></div>
    <div className="desafio-fast-feedback-detail">
      <p>{pregunta.explicacion}</p>
      {!!pregunta.fuentes?.length && <details className="desafio-sources"><summary>Fuentes de esta explicación</summary><ul>{pregunta.fuentes.map(url=><li key={url}><a href={url} target="_blank" rel="noreferrer">{new URL(url).hostname.replace(/^www\./,'')} <ExternalLink size={11}/></a></li>)}</ul></details>}
      <div>
        {pregunta.territorio && <a className="desafio-secondary" href={pregunta.atlasUrl} target="_blank" rel="noreferrer">Sucesión de {pregunta.territorio} <ExternalLink size={13}/></a>}
        {puedeAtlas && <button type="button" className="desafio-secondary" onClick={onAtlas}>Ver en el Atlas <ExternalLink size={13}/></button>}
        <button type="button" className="desafio-primary" onClick={onContinue}>Continuar <ArrowRight size={13}/></button>
      </div>
    </div>
  </div>;
}
