import React, {useEffect, useId, useRef, useState} from 'react';
import {Plus} from 'lucide-react';
import './motion.css';

export default function ActionDial({actions, label = 'Acciones rápidas', className = ''}) {
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector('.ui-action-dial-list button:not(:disabled)')?.focus();
    const outside = event => {if (!root.current?.contains(event.target)) setOpen(false);};
    const escape = event => {if (event.key === 'Escape') {setOpen(false); trigger.current?.focus();}};
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape);};
  }, [open]);
  const activate = action => {setOpen(false); trigger.current?.focus(); action.onClick();};
  return <div ref={root} onBlur={event => {if (event.relatedTarget && !root.current?.contains(event.relatedTarget)) setOpen(false);}} className={`ui-action-dial ${className}${open ? ' is-open' : ''}`}>
    <div id={id} className="ui-action-dial-list" hidden={!open} role="group" aria-label={label}>
      {actions.map(({id: key, label: text, Icon, disabled, ...action}, index) => <button key={key} type="button" disabled={disabled} style={{'--order': index}} onClick={() => activate(action)}><span>{text}</span><Icon size={17} aria-hidden="true"/></button>)}
    </div>
    <button ref={trigger} type="button" className="ui-action-dial-trigger" aria-label={open ? `Cerrar ${label.toLowerCase()}` : label} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}><Plus size={22} aria-hidden="true"/></button>
  </div>;
}
