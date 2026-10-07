import React, {useEffect, useRef, useState} from 'react';
import useReducedMotion from './useReducedMotion.js';
import './motion.css';

export default function Odometer({value, locale = 'es'}) {
  const node = useRef(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!node.current || typeof IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {setVisible(true); observer.disconnect();}
    }, {threshold: .3});
    observer.observe(node.current);
    return () => observer.disconnect();
  }, [value]);
  if (!Number.isFinite(value)) return <span>{value ?? '—'}</span>;
  const formatted = new Intl.NumberFormat(locale).format(value);
  return <span ref={node} className={`ui-odometer${visible && !reduced ? ' is-animated' : ''}`}>
    <span className="ui-sr-only">{formatted}</span>
    <span aria-hidden="true" className="ui-odometer-visual">{[...formatted].map((character, index) => /\d/.test(character)
      ? <span key={index} className="ui-odometer-digit"><span key={`${index}:${character}`} className="ui-odometer-reel" style={{'--digit': Number(character), '--delay': `${index * 45}ms`}}>{Array.from({length: 20}, (_, n) => <span key={n}>{n % 10}</span>)}</span></span>
      : <span key={index}>{character}</span>)}</span>
  </span>;
}
