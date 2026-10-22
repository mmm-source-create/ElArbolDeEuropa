import React from 'react';
import {Check, ChevronDown, ChevronUp, X} from 'lucide-react';
import {ATLAS_TUTORIAL, TUTORIAL_STORAGE_KEY, tutorialProgress} from '../../content/atlasTutorial.js';
import {MAP_READING_GUIDE} from '../../content/mapReadingGuide.js';
import ProgressMeter from '../../ui/ProgressMeter.jsx';
import './atlas-guide.css';

function readProgress() {
  try { return tutorialProgress(JSON.parse(window.localStorage.getItem(TUTORIAL_STORAGE_KEY))); }
  catch { return tutorialProgress(null); }
}

export default function AtlasGuide({locale, onClose, onAction, selectedId, selectedInTree, canExpand, exampleReady, hasFilters, onClearFilters, ready = true}) {
  const en = locale === 'en';
  const c = ATLAS_TUTORIAL[en ? 'en' : 'es'];
  const [section, setSection] = React.useState(0);
  const [courseId, setCourseId] = React.useState(null);
  const [progress, setProgress] = React.useState(readProgress);
  const [collapsed, setCollapsed] = React.useState(false);
  const headingRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const course = c.courses.find(item => item.id === courseId);
  const stepIndex = course ? Math.max(0, course.steps.findIndex(item => item.id === progress.courses[course.id]?.step)) : 0;
  const step = course?.steps[stepIndex];
  React.useEffect(() => {
    try { window.localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(progress)); } catch { /* También funciona sin almacenamiento. */ }
  }, [progress]);
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    headingRef.current?.focus({preventScroll:true});
  }, [section, courseId, step?.id]);

  const goToStep = index => setProgress(previous => ({...previous,courses:{...previous.courses,[course.id]:{step:course.steps[index].id,complete:false}}}));
  const start = item => {
    if (!progress.courses[item.id] || progress.courses[item.id].complete) {
      setProgress(previous => ({...previous,courses:{...previous.courses,[item.id]:{step:item.steps[0].id,complete:false}}}));
    }
    setCourseId(item.id);
  };
  const next = () => {
    if (stepIndex < course.steps.length - 1) { goToStep(stepIndex + 1); return; }
    setProgress(previous => ({...previous,courses:{...previous.courses,[course.id]:{step:step.id,complete:true}}}));
    setCourseId(null);
  };
  const needsPerson = ['family','year'].includes(step?.action) && (selectedId !== (step.person || 'CARLOS5') || !exampleReady);
  const familyVisible = ready && step?.action === 'family' && !needsPerson && !canExpand;
  const cannotCenter = step?.action === 'center' && !selectedInTree;
  const actionLabel = needsPerson ? (en ? 'First show Charles V' : 'Primero mostrar a Carlos V') : step?.label;
  const chooseSection = index => { setSection(index); setCourseId(null); };
  const practise = () => {
    const action = needsPerson ? {...step,action:'select',person:step.person || 'CARLOS5'} : step;
    if (['search','sources','relative'].includes(action.action)) setCollapsed(true);
    onAction(action);
  };

  return <aside className={`atlas-guide${collapsed ? ' is-collapsed' : ''}`} role="region" aria-labelledby="atlas-guide-title" onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
  }}>
    <div className="atlas-guide-heading">
      <h2 id="atlas-guide-title" tabIndex={-1} ref={!course && section === 0 ? headingRef : undefined}>{c.title}</h2>
      <div className="atlas-guide-window-actions">
        <button type="button" className="atlas-guide-close" aria-label={collapsed ? c.expand : c.collapse} aria-expanded={!collapsed} aria-controls="atlas-guide-body" onClick={() => setCollapsed(value => !value)}>{collapsed ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</button>
        <button type="button" className="atlas-guide-close" onClick={onClose} aria-label={c.close}><X size={16}/></button>
      </div>
    </div>
    {collapsed && <p className="atlas-guide-collapsed-label">{course ? `${course.title} · ${stepIndex + 1}/${course.steps.length}` : c.sections[section]}</p>}
    <div id="atlas-guide-body" hidden={collapsed} ref={bodyRef}>
      <nav className="atlas-guide-tabs" aria-label={en ? 'Help sections' : 'Apartados de ayuda'}>
        {c.sections.map((label,index) => <button key={label} type="button" aria-pressed={section === index} onClick={() => chooseSection(index)}>{label}</button>)}
      </nav>
      {section === 0 && !course && <div className="atlas-guide-content">
        <p>{c.intro}</p>
        <ol className="atlas-guide-courses">{c.courses.map((item,index) => {
          const saved = progress.courses[item.id];
          return <li key={item.id}>
            <div className="atlas-guide-course-heading"><span>{String(index + 1).padStart(2,'0')}</span><h3>{item.title}</h3>{saved?.complete && <span className="atlas-guide-complete"><Check size={14}/>{c.completed}</span>}</div>
            <p>{item.description} <small>{item.steps.length} {en ? 'steps' : 'pasos'}</small></p>
            <button type="button" className="atlas-guide-action" onClick={() => start(item)}>{saved?.complete ? c.restart : saved ? c.resume : c.start}<span className="ui-sr-only"> · {item.title}</span></button>
          </li>;
        })}</ol>
        <p className="atlas-guide-note">{c.saved}</p>
      </div>}
      {section === 0 && course && <div className="atlas-guide-content">
        <button type="button" className="atlas-guide-back" onClick={() => setCourseId(null)}>← {c.index}</button>
        <p className="atlas-guide-course-name">{course.title}</p>
        <ProgressMeter className="atlas-guide-progress" value={stepIndex + 1} max={course.steps.length} label={en ? 'Walkthrough progress' : 'Avance del recorrido'}/>
        <div className="atlas-guide-step-heading"><span>{stepIndex + 1} / {course.steps.length}</span><h3 ref={headingRef} tabIndex={-1}>{step.title}</h3></div>
        <p>{step.body}</p>
        {hasFilters && <div className="atlas-guide-context"><p>{en ? 'Active filters may hide people in this example.' : 'Hay filtros activos que pueden ocultar personas del ejemplo.'}</p><button type="button" disabled={!ready} onClick={onClearFilters}>{en ? 'Remove example filters' : 'Retirar filtros del ejemplo'}</button></div>}
        <div role="status" className="atlas-guide-status">
          {!ready && <p>{c.ready}</p>}
          {needsPerson && <p>{en ? 'This example starts with Charles V in the Atlas.' : 'Este ejemplo parte de Carlos V en la vista del Atlas.'}</p>}
          {familyVisible && <p>{en ? 'His close family is already in the tree. You can continue or explore another generation.' : 'Su familia cercana ya está en el árbol. Puedes continuar o seguir otra generación.'}</p>}
          {cannotCenter && <p>{en ? 'The selected person is not in the tree yet. Add their family in the Family walkthrough.' : 'La persona seleccionada aún no está en el árbol. Añade su familia con el recorrido de familia.'}</p>}
        </div>
        {!familyVisible && <button type="button" className="atlas-guide-action" disabled={!ready || cannotCenter} onClick={practise}>{actionLabel}</button>}
        <p className="atlas-guide-result"><strong>{en ? 'What to look for' : 'Qué debes observar'}</strong>{step.result}</p>
        <div className="atlas-guide-navigation"><button type="button" disabled={stepIndex === 0} onClick={() => goToStep(stepIndex - 1)}>{c.previous}</button><button type="button" onClick={next}>{stepIndex === course.steps.length - 1 ? c.finish : c.next} →</button></div>
        <p className="atlas-guide-note">{c.practice}</p>
      </div>}
      {section === 1 && <div className="atlas-guide-content atlas-guide-reading">
        <h3 tabIndex={-1} ref={headingRef}>{c.sections[1]}</h3>
        <nav aria-label={en ? 'Reading index' : 'Índice de lectura'}>{c.reading.map(item => <a href={`#atlas-help-${item.id}`} key={item.id}>{item.title}</a>)}<a href="#atlas-help-mapas">{en ? 'Read the maps' : MAP_READING_GUIDE.title}</a></nav>
        {c.reading.map(item => <section key={item.id} id={`atlas-help-${item.id}`}><h4>{item.title}</h4>{item.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
        <section id="atlas-help-mapas"><h4>{en ? 'Read the maps' : MAP_READING_GUIDE.title}</h4>{!en && MAP_READING_GUIDE.paragraphs.map(text => <p key={text}>{text}</p>)}<a href="/es/metodologia#como-leer-el-mapa">{en ? 'Full map criteria and examples (Spanish)' : 'Criterios completos, ejemplos y fuentes del mapa'} →</a></section>
      </div>}
      {section === 2 && <div className="atlas-guide-content"><h3 tabIndex={-1} ref={headingRef}>{c.sections[2]}</h3><dl>{c.controls.map(([term,definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></div>}
    </div>
  </aside>;
}
