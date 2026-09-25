import React from 'react';
import { X } from 'lucide-react';
import './atlas-guide.css';

const copy = {
  es: {
    title: 'Ayuda del Atlas', close: 'Cerrar guía', previous: 'Anterior', next: 'Siguiente', finish: 'Terminar',
    tabs: ['Primeros pasos', 'Controles', 'Leer fichas'],
    steps: [
      { title: 'Elige una persona', body: 'Busca un nombre para abrir su biografía. Vamos a probar con Carlos V.', action: 'Mostrar a Carlos V' },
      { title: 'Añade su familia', body: 'Un clic añade al árbol padres, hermanos, parejas e hijos. Puedes deshacerlo si quieres.', action: 'Añadir familia de Carlos V' },
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
      { title: 'Choose a person', body: 'Search for a name to open their biography. Try Charles V.', action: 'Show Charles V' },
      { title: 'Add their family', body: 'One click adds parents, siblings, partners and children to the tree. You can undo it.', action: "Add Charles V's family" },
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

export default function AtlasGuide({ locale, onClose, onSelect, onExpand, onYear, selectedId, canExpand }) {
  const [section, setSection] = React.useState(0);
  const [step, setStep] = React.useState(0);
  const titleRef = React.useRef(null);
  React.useEffect(() => { titleRef.current?.focus(); }, []);
  const c = copy[locale === 'en' ? 'en' : 'es'];
  const actions = [onSelect, onExpand, onYear];
  const advance = () => step === 2 ? onClose() : setStep(step + 1);
  const needsPerson = step === 1 && selectedId !== 'CARLOS5';
  const alreadyVisible = step === 1 && selectedId === 'CARLOS5' && !canExpand;
  const stepBody = needsPerson
    ? (locale === 'en' ? 'First show Charles V to explore his family.' : 'Primero muestra a Carlos V para recorrer su familia.')
    : alreadyVisible
      ? (locale === 'en' ? 'His close family is already in the tree. You can select someone else to expand a new branch.' : 'Su familia cercana ya está en el árbol. Puedes elegir a otra persona para ampliar una rama nueva.')
      : c.steps[step].body;
  const stepAction = needsPerson ? c.steps[0].action : alreadyVisible ? (locale === 'en' ? 'Continue' : 'Continuar') : c.steps[step].action;

  return <aside className="atlas-guide" role="region" aria-labelledby="atlas-guide-title" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}>
    <div className="atlas-guide-heading"><h2 id="atlas-guide-title" tabIndex={-1} ref={titleRef}>{c.title}</h2><button type="button" className="atlas-guide-close" onClick={onClose} aria-label={c.close}><X size={16} /></button></div>
    <div className="atlas-guide-tabs" role="tablist" aria-label={c.title}>
      {c.tabs.map((label, index) => <button key={label} type="button" role="tab" aria-selected={section === index} onClick={() => setSection(index)}>{label}</button>)}
    </div>
    {section === 0 && <div className="atlas-guide-content" role="tabpanel">
      <div className="atlas-guide-step-heading"><span>{step + 1} / {c.steps.length}</span><h3>{c.steps[step].title}</h3></div>
      <p>{stepBody}</p>
      <button type="button" className="atlas-guide-action" onClick={() => { if (needsPerson) { onSelect(); return; } if (!alreadyVisible) actions[step](); advance(); }}>{stepAction}</button>
      <div className="atlas-guide-navigation"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>{c.previous}</button><div className="atlas-guide-dots" aria-label={`${step + 1} / ${c.steps.length}`}>{c.steps.map((_, index) => <span key={index} className={step === index ? 'is-current' : ''} />)}</div><button type="button" onClick={advance}>{step === 2 ? c.finish : c.next}</button></div>
    </div>}
    {section === 1 && <div className="atlas-guide-content" role="tabpanel"><dl>{c.controls.map(([term, definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></div>}
    {section === 2 && <div className="atlas-guide-content" role="tabpanel"><dl>{c.terms.map(([term, definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></div>}
  </aside>;
}
