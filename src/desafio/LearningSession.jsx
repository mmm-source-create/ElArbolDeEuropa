import React, {useEffect, useRef, useState} from 'react';
import {ArrowLeft, Share2} from 'lucide-react';
import {IMAGENES_PERSONAS} from '../imagenesPersonas.js';
import {PreguntaOpciones, PreguntaOrden, Explicacion} from './Question.jsx';

export default function LearningSession({questions, mode, sharedUrl, warning, byId, onAnswer, onBack, onAtlas}) {
  const [index,setIndex] = useState(0), [selection,setSelection] = useState(null), [order,setOrder] = useState([]);
  const [results,setResults] = useState([]), [shareStatus,setShareStatus] = useState('');
  const heading = useRef(null), answerLock = useRef(false);
  const question = questions[index], finished = index >= questions.length;
  const title = mode==='repaso' ? 'Repasar errores' : mode==='compartido' ? 'Desafío compartido' : 'Resolver una sucesión';
  useEffect(()=>{heading.current?.focus();},[index]);
  const url = sharedUrl ? new URL(sharedUrl, window.location.origin).href : '';
  async function copy() {
    try { await navigator.clipboard.writeText(url); setShareStatus('Enlace copiado.'); }
    catch { setShareStatus('Selecciona y copia el enlace del campo.'); }
  }
  function answer(value) {
    if (!question || answerLock.current) return;
    answerLock.current = true;
    const correct = question.formato==='orden' ? value.join('|')===question.ordenCorrecto.join('|') : value===question.correctaId;
    setSelection(value); setResults([...results,correct]); onAnswer(question,correct);
  }
  function pick(id) {
    const next = order.includes(id) ? order.filter(x=>x!==id) : [...order,id];
    setOrder(next); if(next.length===question.ordenCorrecto.length) answer(next);
  }
  function next() { answerLock.current=false; setIndex(index+1); setSelection(null); setOrder([]); }
  return <section className="desafio-shell desafio-play">
    <button type="button" className="desafio-back" onClick={onBack}><ArrowLeft size={13}/> Modos</button>
    <div className="desafio-progress-row"><div><span className="desafio-kicker">{title}</span><strong>{finished?'Sesión completada':`${index+1} de ${questions.length}`}</strong></div><span className="desafio-practice-label">{mode==='repaso'?'Sin vidas ni puntuación':'A tu ritmo'}</span></div>
    {finished ? <div className="desafio-question-card desafio-learning-end"><h2 ref={heading} tabIndex={-1}>{questions.length ? (mode==='repaso'?'Cada repaso cuenta':'Ya conoces estas sucesiones') : 'Todavía no hay errores que repasar'}</h2>
      <p>{mode==='repaso' ? (questions.length?'Las preguntas acertadas salen del repaso. Las que aún cuestan quedan guardadas para otra sesión.':'Las preguntas que falles desde esta actualización aparecerán aquí. Tus récords anteriores se conservan.') : `${results.filter(Boolean).length} de ${questions.length} respuestas correctas.`}</p>
      {mode!=='repaso' && <p aria-label="Resultado de la partida">{results.map(ok=>ok?'✓':'×').join(' · ')}</p>}
      <button type="button" className="desafio-primary" onClick={onBack}>Volver a los modos</button>
    </div> : <>
      <div className="desafio-question-card"><div className="desafio-question-topline"><span>{question.etiqueta||'Repaso'}</span><small>{question.territorio||'Conexiones del Atlas'}</small></div>
        <h2 ref={heading} tabIndex={-1}>{question.pregunta}</h2>
        {question.imagenId && IMAGENES_PERSONAS[question.imagenId]?.archivo && <img className="desafio-review-portrait" src={IMAGENES_PERSONAS[question.imagenId].archivo} alt="Retrato histórico por identificar"/>}
        {question.formato==='pistas' && <div className="desafio-clues">{question.pistas?.map((p,i)=><div key={i}><b>{i+1}</b><span>{p}</span></div>)}</div>}
        {question.formato==='orden' ? <PreguntaOrden pregunta={question} byId={byId} orden={order} respondida={selection!==null} onPick={pick}/> : <PreguntaOpciones pregunta={question} byId={question.imagenId?{}:byId} seleccion={selection} respondida={selection!==null} onSelect={answer}/>}
      </div>
      {selection!==null && <Explicacion correcta={results.at(-1)} pregunta={question} onContinue={next} puedeAtlas={!!byId[question.atlasPersonId]} onAtlas={()=>onAtlas(question.atlasPersonId)}/>}
    </>}
    {warning && <p className="desafio-fineprint" role="status">{warning}</p>}
    {url && <div className="desafio-share-panel"><strong>Mismas preguntas, mismo orden</strong><p>Envía este enlace para comparar aciertos. El enlace no incluye las respuestas.</p><div><input aria-label="Enlace del desafío compartido" value={url} readOnly onFocus={e=>e.target.select()}/><button type="button" className="desafio-secondary" onClick={copy}><Share2 size={13}/> Copiar enlace</button></div><span role="status">{shareStatus}</span></div>}
  </section>;
}
