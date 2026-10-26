import {useEffect,useId,useRef,useState} from 'react';
import {chapterArtworks} from './storyArtworks.js';
import './story-artworks.css';

function Artwork({work,locale}) {
 const en=locale==='en',copy=work[locale]||work.es,dialog=useRef(null),trigger=useRef(null),heading=useId();
 const [opened,setOpened]=useState(false);
 useEffect(()=>{const node=dialog.current;if(opened&&!node.open)node.showModal();},[opened]);
 return <div className="story-artwork"><button ref={trigger} className="story-artwork-trigger" type="button" aria-haspopup="dialog" onClick={()=>setOpened(true)}>{en?'View artwork':'Ver obra'}</button>
  <dialog ref={dialog} className="story-artwork-dialog" aria-labelledby={heading} onKeyDown={event=>event.stopPropagation()} onClose={()=>{setOpened(false);trigger.current?.focus();}} onClick={e=>{if(e.target===e.currentTarget){const bounds=e.currentTarget.getBoundingClientRect();if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom)dialog.current.close();}}}>
   <form method="dialog" className="story-artwork-close"><button type="submit" autoFocus>{en?'Close':'Cerrar'}</button></form>
   {opened&&<figure><img src={`/obras/${work.id}.webp`} alt={copy.title} width={work.width} height={work.height}/><figcaption><h2 id={heading}>{copy.title}</h2><p>{work.artist} · {work.date} · {work.collection}</p><p>{copy.caption}</p><p><a href={work.source} target="_blank" rel="noreferrer">{en?'Source and image rights':'Fuente y derechos de la imagen'} ↗</a> · <a href="https://creativecommons.org/publicdomain/mark/1.0/" target="_blank" rel="noreferrer">{en?'Public domain':'Dominio público'}</a></p></figcaption></figure>}
  </dialog>
 </div>;
}
export default function StoryArtworks({storyId,chapter,locale='es'}){return chapterArtworks(storyId,chapter).map(work=><Artwork key={`${storyId}:${chapter}:${work.id}`} work={work} locale={locale}/>);}
