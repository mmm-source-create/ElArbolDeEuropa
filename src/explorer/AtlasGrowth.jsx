import React from 'react';
import {Search, ArrowRight} from 'lucide-react';
import './atlas-growth.css';

// First-visit guidance lives inside the empty tree, without adding a toolbar.
export default function AtlasGrowth({ids,onStart,onHelp}) {
 if (!Array.isArray(ids) || ids.length) return null;
 return <section className="atlas-start" aria-label="Comenzar una familia"><Search size={22} aria-hidden="true"/><h2>Una persona es un buen comienzo</h2><p>Busca arriba un nombre y pulsa «Añadir familia», o empieza con una de estas personas.</p><div>{[['ISAB1CAST','Isabel de Castilla'],['CARLOS5','Carlos V'],['LEONARDODAVINCI','Leonardo da Vinci']].map(([id,name])=><button type="button" className="nav-btn" key={id} onClick={()=>onStart(id)}>{name}<ArrowRight size={12}/></button>)}</div><button type="button" className="atlas-start-help" onClick={onHelp}>¿Primera visita? Ver guía de tres pasos</button></section>;
}
