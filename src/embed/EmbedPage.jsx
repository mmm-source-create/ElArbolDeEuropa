import React,{useEffect,useState} from 'react';
import {loadJsonAsset} from '../utils/loadAsset.js';
import {treeSvg} from '../connections/treeExport.js';
import {documentaryLife} from '../utils/documentaryDates.js';
import './embed.css';
export function embedSelection(people) {
 const ids=new Set(people.map(p=>p.id)),edges=[],seen=new Set(),gen=Object.fromEntries(people.map(p=>[p.id,0]));
 const add=(from,to,type)=>{const key=[from,to].sort().join('|')+'|'+type;if(!seen.has(key)){edges.push({from,to,type});seen.add(key);}};
 for(const p of people){for(const parent of p.padres||[])if(ids.has(parent.id))add(parent.id,p.id,'sangre');for(const partner of p.conyuges||[])if(ids.has(partner.id))add(p.id,partner.id,'matrimonio');}
 for(let i=0;i<people.length;i++)for(const e of edges.filter(e=>e.type==='sangre'))gen[e.to]=Math.max(gen[e.to],gen[e.from]+1);
 return {people,edges,gen,title:'Selección del Árbol de Europa',terminals:[]};
}
export default function EmbedPage({personId}) {
 const [state,setState]=useState({loading:true}),[attempt,setAttempt]=useState(0),[preview,setPreview]=useState('');
 useEffect(()=>{
  let active=true;setState({loading:true});
  const ids=[...new Set(personId?[personId]:new URLSearchParams(window.location.search).getAll('persona'))];
  if(!ids.length||ids.length>12){setState({error:'Elige entre 1 y 12 personas.'});return;}
  loadJsonAsset('/personas-meta/index.json').then(async index=>{
   if(ids.some(id=>!Object.hasOwn(index,id)))throw Error('Hay personas que no están disponibles.');
   return Promise.all(ids.map(id=>loadJsonAsset(`/personas-meta/${index[id]}.json`)));
  }).then(people=>{if(active)setState({people});}).catch(()=>{if(active)setState({error:'No se pudo cargar la selección.'});});
  return()=>{active=false;};
 },[personId,attempt]);
 useEffect(()=>{
  if(!state.people||state.people.length<2)return;
  const scene=treeSvg(embedSelection(state.people)),url=URL.createObjectURL(new Blob([scene.svg],{type:'image/svg+xml'}));setPreview(url);return()=>URL.revokeObjectURL(url);
 },[state.people]);
 if(state.loading)return <main className="embed-card" aria-busy="true"><p role="status">Preparando ficha…</p></main>;
 if(state.error)return <main className="embed-card"><p role="alert">{state.error}</p><button onClick={()=>setAttempt(attempt+1)}>Reintentar</button></main>;
 const first=state.people[0],params=new URLSearchParams({atlas:'1'});state.people.forEach(p=>params.append('seleccion',p.id));
 return <main className="embed-card"><p className="embed-brand">El Árbol de Europa</p>{state.people.length===1?<article><h1>{first.nombre}</h1><p>{documentaryLife(first)}</p><p>{first.resumen||first.biografia}</p><a href={`/es/persona/${first.slug}`} target="_blank" rel="noreferrer">Consultar ficha y fuentes ↗</a></article>:<><h1>Una selección de {state.people.length} personas</h1>{preview&&<img src={preview} alt={`Árbol con ${state.people.map(p=>p.nombre).join(', ')}`}/>}<p>Solo se representan los vínculos registrados entre estas personas.</p></>}<p><a href={`/es/?${params}`} target="_blank" rel="noreferrer">Explorar en el Atlas ↗</a></p></main>;
}
