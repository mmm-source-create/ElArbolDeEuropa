import React from 'react';
import { X } from 'lucide-react';
import './atlas-guide.css';

const copy = {
  es: {
    title: 'Primeros pasos en el Atlas', close: 'Cerrar guía', previous: 'Anterior', next: 'Siguiente', finish: 'Terminar',
    steps: [
      { title: '1 · Elige una persona', body: 'Busca un nombre o prueba con Carlos V. Su ficha aparece en la biografía y queda señalada en el árbol.', action: 'Mostrar a Carlos V' },
      { title: '2 · Recorre su familia', body: 'Explorar familia muestra las relaciones cercanas. Después puedes cambiar el alcance desde la flecha del botón.', action: 'Explorar su familia' },
      { title: '3 · Sitúala en el tiempo', body: 'El año global filtra las personas y los gobiernos visibles. Prueba 1500 y consulta «Europa en este año».', action: 'Ir al año 1500' },
    ],
    keyboard: 'Teclado: Tab recorre controles y fichas; Enter o Espacio activa una ficha. Enfoca el lienzo del árbol y usa las flechas para desplazarte. Los botones + y − cambian el zoom.',
    glossary: 'Para leer las fichas',
    terms: [
      ['Regencia', 'Gobierno ejercido en nombre de quien ostenta el título, por ejemplo durante una minoría de edad.'],
      ['Pretensión', 'Reclamación de un título; no implica que se gobernara el territorio.'],
      ['Gobierno efectivo', 'Ejercicio documentado del poder, distinto de poseer o reclamar un título.'],
      ['Fechas y relaciones', 'Algunas fechas son aproximadas. Una relación ausente puede indicar que aún no está documentada en el Atlas; no demuestra que no existiera.'],
    ],
  },
  en: {
    title: 'Getting started with the Atlas', close: 'Close guide', previous: 'Back', next: 'Next', finish: 'Finish',
    steps: [
      { title: '1 · Choose a person', body: 'Search for a name or try Charles V. His biography opens and his card is highlighted in the tree.', action: 'Show Charles V' },
      { title: '2 · Explore the family', body: 'Explore family shows close relatives. You can adjust the scope using the arrow beside the button.', action: 'Explore his family' },
      { title: '3 · Place them in time', body: 'The global year filters visible people and rulers. Try 1500 and open “Europe in this year”.', action: 'Go to 1500' },
    ],
    keyboard: 'Keyboard: Tab moves through controls and cards; Enter or Space opens a card. Focus the tree canvas and use arrow keys to pan. The + and − buttons adjust zoom.',
    glossary: 'Reading the records',
    terms: [
      ['Regency', 'Rule exercised on behalf of the titleholder, for example during childhood.'],
      ['Claim', 'A claim to a title; it does not mean that the territory was governed.'],
      ['Effective rule', 'Documented exercise of power, distinct from holding or claiming a title.'],
      ['Dates and relationships', 'Some dates are approximate. A missing relationship may simply be undocumented in this Atlas; it does not prove none existed.'],
    ],
  },
};

export default function AtlasGuide({ locale, onClose, onSelect, onFocus, onYear }) {
  const [step, setStep] = React.useState(0);
  const titleRef = React.useRef(null);
  React.useEffect(() => { titleRef.current?.focus(); }, []);
  const c = copy[locale === 'en' ? 'en' : 'es'];
  const actions = [onSelect, onFocus, onYear];
  return <aside className="atlas-guide" role="region" aria-labelledby="atlas-guide-title" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
    <div className="atlas-guide-heading"><div><span className="atlas-guide-eyebrow">{step + 1} / 3</span><h2 id="atlas-guide-title" tabIndex={-1} ref={titleRef}>{c.title}</h2></div><button type="button" className="atlas-guide-close" onClick={onClose} aria-label={c.close}><X size={17} /></button></div>
    <div className="atlas-guide-progress" aria-hidden="true"><span style={{ width: `${(step + 1) * 100 / 3}%` }} /></div>
    <div aria-live="polite"><h3>{c.steps[step].title}</h3><p>{c.steps[step].body}</p></div>
    <button type="button" className="atlas-guide-action" onClick={() => { actions[step](); if (step < 2) setStep(step + 1); }}>{c.steps[step].action}</button>
    <div className="atlas-guide-navigation"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>{c.previous}</button><button type="button" onClick={() => step === 2 ? onClose() : setStep(step + 1)}>{step === 2 ? c.finish : c.next}</button></div>
    <details><summary>{c.glossary}</summary><dl>{c.terms.map(([term, definition]) => <React.Fragment key={term}><dt>{term}</dt><dd>{definition}</dd></React.Fragment>)}</dl></details>
    <p className="atlas-guide-keyboard">{c.keyboard}</p>
  </aside>;
}
