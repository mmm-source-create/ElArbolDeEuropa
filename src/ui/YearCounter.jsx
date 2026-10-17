import React from 'react';
import './motion.css';

// Number Counter: the year re-mounts on every change so each step bumps and
// settles. The live value is announced by the year input itself.
export default function YearCounter({year, idleLabel = 'Todos los años'}) {
  const idle = !Number.isFinite(year);
  return <span className={`ui-year-counter${idle ? ' is-idle' : ''}`} aria-hidden="true">
    <b key={idle ? 'idle' : year}>{idle ? idleLabel : year}</b>
  </span>;
}
