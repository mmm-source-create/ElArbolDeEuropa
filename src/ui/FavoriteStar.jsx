import {useEffect, useRef, useState} from 'react';
import useReducedMotion from './useReducedMotion.js';
import './motion.css';

const PARTICLES = 8;
const STAR = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z';

// Saving a person is a small commitment: the star springs, fills and sheds a
// ring of particles. Removing it only settles back, so the reward stays rare.
export default function FavoriteStar({active, onToggle, name, className = ''}) {
  const reduced = useReducedMotion();
  const [burst, setBurst] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const toggle = () => {
    if (!active && !reduced) {
      clearTimeout(timer.current);
      setBurst(Date.now());
      timer.current = setTimeout(() => setBurst(null), 650);
    }
    onToggle();
  };
  const label = active ? `Quitar ${name} de favoritos` : `Añadir ${name} a favoritos`;
  return <button type="button" className={`ui-favorite-star${active ? ' is-active' : ''}${burst ? ' is-popping' : ''} ${className}`}
    onClick={toggle} aria-pressed={active} aria-label={label} title={active ? 'Quitar de favoritos' : 'Añadir a favoritos'}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAR}/></svg>
    {burst && <span key={burst} className="ui-favorite-burst" aria-hidden="true">
      {Array.from({length: PARTICLES}, (_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLES - Math.PI / 2;
        const distance = i % 2 ? 15 : 21;
        return <i key={i} style={{'--tx': `${Math.cos(angle) * distance}px`, '--ty': `${Math.sin(angle) * distance}px`}}/>;
      })}
    </span>}
  </button>;
}
