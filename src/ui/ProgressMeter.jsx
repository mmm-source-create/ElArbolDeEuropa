import React from 'react';
import './motion.css';

export default function ProgressMeter({value, max, label, id, className = ''}) {
  const total = Number.isFinite(max) && max > 0 ? max : 1;
  const completed = Math.max(0, Math.min(total, Number.isFinite(value) ? value : 0));
  return <div className={`ui-progress ${className}`} role="progressbar" id={id} aria-label={label}
    aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed}>
    <span className="ui-progress-fill" style={{transform: `scaleX(${completed / total})`}}/>
  </div>;
}
