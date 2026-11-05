import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, Share2} from 'lucide-react';
import {IMAGENES_PERSONAS} from '../../data/imagenesPersonas.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import ProgressMeter from '../../ui/ProgressMeter.jsx';
import {PreguntaOpciones, PreguntaOrden, Explicacion} from './Question.jsx';
import {challengeQuestion} from './challengeI18n.js';

export default function LearningSession({questions, mode, sharedUrl, warning, byId, onAnswer, onBack, onAtlas, locale='es'}) {
  const en=locale==='en', tr=(es,english)=>en?english:es;
  const [index,setIndex] = useState(0), [selection,setSelection] = useState(null), [order,setOrder] = useState([]);
  const [results,setResults] = useState([]), [shareStatus,setShareStatus] = useState('');
  const heading = useRef(null), shell = useRef(null), answerLock = useRef(false);
  const rawQuestion = questions[index], question=challengeQuestion(rawQuestion,locale), finished = index >= questions.length;
  const title = mode==='repaso' ? tr('Repasar errores','Review mistakes') : mode==='compartido' ? tr('Desafío compartido','Shared challenge') : tr('Resolver una sucesión','Solve a succession');
  useEffect(()=>{heading.current?.focus({preventScroll:true});shell.current?.scrollIntoView?.({block:'start',behavior:'instant'});},[index]);
  const url = sharedUrl ? new URL(sharedUrl, window.location.origin).href : '';
  async function copy() {
    try { await navigator.clipboard.writeText(url); setShareStatus(tr('Enlace copiado.','Link copied.')); }
    catch { setShareStatus(tr('Selecciona y copia el enlace del campo.','Select and copy the link from the field.')); }
  }
  function answer(value) {
    if (!question || answerLock.current) return;
    answerLock.current = true;
    const correct = question.formato==='orden' ? value.join('|')===question.ordenCorrecto.join('|') : value===question.correctaId;
    setSelection(value); setResults([...results,correct]); onAnswer(rawQuestion,correct);
  }
  function pick(id) {
    const next = order.includes(id) ? order.filter(x=>x!==id) : [...order,id];
    setOrder(next); if(next.length===question.ordenCorrecto.length) answer(next);
  }
  function next() { answerLock.current=false; setIndex(index+1); setSelection(null); setOrder([]); }
  return <section ref={shell} className="desafio-shell desafio-play">
    {!finished && <button type="button" className="desafio-back" onClick={onBack}><ArrowLeft size={13}/> {tr('Modos','Modes')}</button>}
    <div className="desafio-progress-row"><div><span className="desafio-kicker">{title}</span><strong>{finished?tr('Sesión completada','Session complete'):`${index+1} ${tr('de','of')} ${questions.length}`}</strong></div><span className="desafio-practice-label">{mode==='repaso'?tr('Sin vidas ni puntuación','No lives or score'):tr('A tu ritmo','At your own pace')}</span></div>
    {questions.length > 0 && <ProgressMeter className="desafio-session-progress" value={results.length} max={questions.length} label={tr('Preguntas respondidas','Questions answered')}/>}
    {finished ? <div className="desafio-question-card desafio-learning-end"><h2 ref={heading} tabIndex={-1}>{questions.length ? (mode==='repaso'?tr('Cada repaso cuenta','Every review helps'):tr('Ya conoces estas sucesiones','You know these successions')) : tr('Todavía no hay errores que repasar','There are no mistakes to review yet')}</h2>
      <p>{mode==='repaso' ? (questions.length?tr('Las preguntas acertadas salen del repaso. Las que aún cuestan quedan guardadas para otra sesión.','Correct answers leave the review set. Questions that remain difficult stay saved for another session.'):tr('Las preguntas que falles desde esta actualización aparecerán aquí. Tus récords anteriores se conservan.','Questions missed from this update onward will appear here. Your previous records are preserved.')) : `${results.filter(Boolean).length} ${tr('de','of')} ${questions.length} ${tr('respuestas correctas','correct answers')}.`}</p>
      {mode!=='repaso' && <p aria-label={tr('Resultado de la partida','Game result')}>{results.map(ok=>ok?'✓':'×').join(' · ')}</p>}
      <button type="button" className="desafio-primary" onClick={onBack}>{tr('Volver a los modos','Back to modes')}</button>
    </div> : <>
      <div className="desafio-question-card"><div className="desafio-question-topline"><span>{question.etiqueta||tr('Repaso','Review')}</span><small>{question.territorio||tr('Conexiones del Atlas','Atlas connections')}</small></div>
        <h2 ref={heading} tabIndex={-1}>{question.pregunta}</h2>
        {question.imagenId && IMAGENES_PERSONAS[question.imagenId]?.archivo && <img className="desafio-review-portrait" {...responsiveImage(IMAGENES_PERSONAS[question.imagenId].archivo, '160px')} alt={tr('Retrato histórico por identificar','Historical portrait to identify')}/>}
        {question.formato==='pistas' && <div className="desafio-clues">{question.pistas?.map((p,i)=><div key={i}><b>{i+1}</b><span>{p}</span></div>)}</div>}
        {question.formato==='orden' ? <PreguntaOrden pregunta={question} byId={byId} orden={order} respondida={selection!==null} onPick={pick} locale={locale}/> : <PreguntaOpciones pregunta={question} byId={question.imagenId?{}:byId} seleccion={selection} respondida={selection!==null} onSelect={answer} locale={locale}/>}
      </div>
      {selection!==null && <Explicacion correcta={results.at(-1)} pregunta={question} onContinue={next} puedeAtlas={!!byId[question.atlasPersonId]} onAtlas={()=>onAtlas(question.atlasPersonId)} locale={locale}/>}
    </>}
    {warning && <p className="desafio-fineprint" role="status">{warning}</p>}
    {url && <div className="desafio-share-panel"><strong>{tr('Mismas preguntas, mismo orden','Same questions, same order')}</strong><p>{tr('Envía este enlace para comparar aciertos. El enlace no incluye las respuestas.','Send this link to compare scores. The link does not include the answers.')}</p><div><input aria-label={tr('Enlace del desafío compartido','Shared challenge link')} value={url} readOnly onFocus={e=>e.target.select()}/><button type="button" className="desafio-secondary" onClick={copy}><Share2 size={13}/> {tr('Copiar enlace','Copy link')}</button></div><span role="status">{shareStatus}</span></div>}
  </section>;
}
