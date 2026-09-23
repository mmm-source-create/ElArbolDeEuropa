import React,{useEffect,useRef,useState} from 'react';
import {Settings2,X} from 'lucide-react';
import {applyPreferences,clearLocalData,DEFAULT_PREFERENCES,readPreferences,savePreferences} from './preferences.js';
import './settings.css';

const COPY={
  es:{button:'Configuración',title:'Ajustes de visualización',hint:'Se guardan solo en este navegador.',theme:'Apariencia',themeOptions:[['system','Navegador'],['light','Claro'],['dark','Oscuro']],text:'Tamaño de texto',textOptions:[['normal','Normal'],['large','Grande'],['larger','Muy grande']],motion:'Animaciones',motionOptions:[['system','Según el sistema'],['reduce','Reducir']],data:'Datos guardados',favorites:'Borrar favoritos',progress:'Borrar progreso',confirm:'Confirmar borrado',cancel:'Cancelar',close:'Cerrar configuración',privacy:'Privacidad',done:'Datos borrados en este navegador.'},
  en:{button:'Settings',title:'Display settings',hint:'Saved only in this browser.',theme:'Appearance',themeOptions:[['system','Browser'],['light','Light'],['dark','Dark']],text:'Text size',textOptions:[['normal','Normal'],['large','Large'],['larger','Very large']],motion:'Animation',motionOptions:[['system','Follow system'],['reduce','Reduce']],data:'Saved data',favorites:'Clear favourites',progress:'Clear progress',confirm:'Confirm deletion',cancel:'Cancel',close:'Close settings',privacy:'Privacy',done:'Data cleared in this browser.'},
};

export default function SettingsPanel({locale='es',prerendered=false}) {
  const copy=COPY[locale==='en'?'en':'es'];
  const [open,setOpen]=useState(false),[preferences,setPreferences]=useState(DEFAULT_PREFERENCES),[pending,setPending]=useState(null),[message,setMessage]=useState('');
  const panelRef=useRef(null),triggerRef=useRef(null);
  useEffect(()=>{
    let storage;try{storage=window.localStorage;}catch{return;}
    setPreferences(readPreferences(storage));
    const media=window.matchMedia?.('(prefers-color-scheme: dark)');
    const sync=()=>applyPreferences(readPreferences(storage));
    media?.addEventListener?.('change',sync);
    return ()=>media?.removeEventListener?.('change',sync);
  },[prerendered]);
  useEffect(()=>{
    if(!open)return;
    const onKey=event=>{if(event.key==='Escape'){setOpen(false);setPending(null);triggerRef.current?.focus();}};
    const onPointer=event=>{if(!panelRef.current?.contains(event.target)&&!triggerRef.current?.contains(event.target))setOpen(false);};
    document.addEventListener('keydown',onKey);document.addEventListener('pointerdown',onPointer);
    panelRef.current?.querySelector('select')?.focus();
    return ()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('pointerdown',onPointer);};
  },[open]);
  const update=(key,value)=>{
    const next={...preferences,[key]:value};setPreferences(next);applyPreferences(next);
    try{savePreferences(window.localStorage,next);}catch{/* Storage may be unavailable. */}
  };
  const clear=()=>{
    try{clearLocalData(window.localStorage,pending);}catch{/* Storage may be unavailable. */}
    setPending(null);setMessage(copy.done);
    window.setTimeout(()=>window.location.reload(),350);
  };
  const select=(label,key,options)=><label className="settings-field"><span>{label}</span><select value={preferences[key]} onChange={event=>update(key,event.target.value)}>{options.map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>;
  return <div className="settings-anchor">
    <button ref={triggerRef} type="button" className="settings-trigger" aria-label={copy.button} title={copy.button} aria-expanded={open} aria-controls="eade-settings-panel" onClick={()=>{setOpen(value=>!value);setPending(null);}}><Settings2 size={16} aria-hidden="true"/></button>
    {open&&<section ref={panelRef} id="eade-settings-panel" className="settings-panel" aria-label={copy.title}>
      <div className="settings-heading"><div><h2>{copy.title}</h2><p>{copy.hint}</p></div><button type="button" aria-label={copy.close} onClick={()=>{setOpen(false);triggerRef.current?.focus();}}><X size={15}/></button></div>
      {select(copy.theme,'theme',copy.themeOptions)}
      {select(copy.text,'textSize',copy.textOptions)}
      {select(copy.motion,'motion',copy.motionOptions)}
      <div className="settings-data"><strong>{copy.data}</strong><div><button type="button" onClick={()=>{setPending('favorites');setMessage('');}}>{copy.favorites}</button><button type="button" onClick={()=>{setPending('progress');setMessage('');}}>{copy.progress}</button></div>{pending&&<p><span>{pending==='favorites'?copy.favorites:copy.progress}?</span><button type="button" onClick={clear}>{copy.confirm}</button><button type="button" onClick={()=>setPending(null)}>{copy.cancel}</button></p>}{message&&<p role="status">{message}</p>}</div>
      <a className="settings-privacy" href={locale==='en'?'/en/privacy':'/es/privacidad'}>{copy.privacy}</a>
    </section>}
  </div>;
}
