import React from 'react';
import { X } from 'lucide-react';
import './atlas-guide.css';

const copy = {
  es: {
    title: 'Ayuda del Atlas', close: 'Cerrar guía', previous: 'Anterior', next: 'Siguiente', finish: 'Terminar',
    tabs: ['Primeros pasos', 'Controles', 'Leer fichas'],
    steps: [
      { title: 'Elige una persona', body: 'La búsqueda abre su biografía y señala su ficha en el árbol.', action: 'Mostrar a Carlos V' },
      { title: 'Recorre su familia', body: 'Explora sus relaciones cercanas. La flecha del botón cambia el alcance.', action: 'Explorar su familia' },
      { title: 'Sitúala en el tiempo', body: 'Al elegir un año, el árbol y los gobiernos muestran ese momento.', action: 'Ir al año 1500' },
    ],
    controls: [['Moverse', 'Arrastra el árbol o usa las flechas del teclado cuando el lienzo tenga el foco.'], ['Ampliar', 'Usa + y − en el árbol.'], ['Abrir una ficha', 'Haz clic o pulsa Enter sobre una tarjeta. Tab recorre los controles.']],
    terms: [
      ['Regencia', 'Gobierno en nombre de quien ostenta el título.'],
      ['Pretensión', 'Reclamación de un título; no acredita gobierno efectivo.'],
      ['Gobierno efectivo', 'Ejercicio documentado del poder.'],
      ['Fechas y relaciones', 'Pueden ser aproximadas o estar pendientes de documentación.'],
    ],
  },
  en: {
    title: 'Atlas help', close: 'Close guide', previous: 'Back', next: 'Next', finish: 'Finish',
    tabs: ['Getting started', 'Controls', 'Reading records'],
    steps: [
      { title: 'Choose a person', body: 'Search opens the biography and highlights the card in the tree.', action: 'Show Charles V' },
      { title: 'Explore the family', body: 'See close relatives. The arrow beside the button changes the scope.', action: 'Explore his family' },
      { title: 'Place them in time', body: 'Choosing a year shows the tree and rulers at that moment.', action: 'Go to 1500' },
    ],
    controls: [['Move', 'Drag the tree or focus it and use the arrow keys.'], ['Zoom', 'Use + and − in the tree.'], ['Open a record', 'Click a card or press Enter. Tab moves through the controls.']],
    terms: [
      ['Regency', 'Rule exercised on behalf of a titleholder.'],
      ['Claim', 'A claim to a title does not establish effective rule.'],
      ['Effective rule', 'Documented exercise of power.'],
      ['Dates and relationships', 'These may be approximate or awaiting documentation.'],
    ],
  },
};

export default function AtlasGuide({ locale, onClose, onSelect, onFocus, onYear }) {
  const [section, setSection] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const titleRef = React.useRef(null);
  React.useEffect(() => { titleRef.current?.focus(); }, []);
  const c = copy[locale === 'en' ? 'en' : 'es'];
  const actions = [onSelect, onFocus, onYear];
  const advance = () => step === 2 ? onClose() : setStep(step + 1);

  return <aside className="atlas-guide" role="region" aria-labelledby="atlas-guide-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}>
    <div className="atlas-guide-heading"><h2 id="atlas-guide-title" tabIndex={-1} ref={titleRef}>{c.title}</h2><button type="button" className="atlas-guide-close" onClick={onClose} aria-label={c.close}><X size={16} /></button></div>
    <div className="atlas-guide-tabs" role="tablist" aria-label={c.title}>
      {c.tabs.map((label, index) => <button key={label} type="button" role="tab" aria-selected={section === index} onClick={() => setSection(index)}>{label}</button>)}
    </div>
    {section === 0 && <div className="atlas-guide-content" role="tabpanel">
      <div className="atlas-guide-step-heading"><span>{step + 1} / {c.steps.length}</span><h3>{c.steps[step].title}</h3></div>
      <p>{c.steps[step].body}</p>
      <button type="button" className="atlas-guide-action" onClick={() => { actions[step](); advance(); }}>{c.steps[step].action}</button>
      <div className="atlas-guide-navigation"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>{c.previous}</button><div className="atlas-guide-dots" aria-label={`${step + 1} / ${c.steps.length}`}>{c.steps.map((_, index) => <span key={index} className={step === index ? 'is-current' : ''} />)}</div><button type="button" onClick={advance}>{step === 2 ? c.finish : c.next}</button></div>
    </div>}
    {section === 1 && <div className="atlas-guide-content" role="tabpanel"><dl>{c.controls.map(([term, definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></div>}
    {section === 2 && <div className="atlas-guide-content" role="tabpanel"><dl>{c.terms.map(([term, definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></div>}
  </aside>;
}
