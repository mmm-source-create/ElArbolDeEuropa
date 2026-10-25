import {ArrowRight} from 'lucide-react';
export default function StoryRecommendations({items=[],locale='es'}) {
 if(!items.length)return null;
 const en=locale==='en';
 return <section className="story-next-reading" id="seguir-leyendo" aria-labelledby="story-next-title"><h2 id="story-next-title">{en?'Keep reading':'Para seguir leyendo'}</h2><div className="story-follow-list">{items.map(item=>{
  const content=<><span>{item.disponible?(en?'Related story':'Historia relacionada'):(en?'In preparation':'En preparación')}{en&&item.disponible&&!item.path.startsWith('/en/')?' · ES':''}</span><h3>{item.titulo}</h3><p>{item.subtitulo}</p>{item.disponible&&<b>{en?'Read story':'Leer historia'} <ArrowRight size={13}/></b>}</>;
  return item.disponible?<a key={item.id} className="story-follow-card" href={item.path}>{content}</a>:<article key={item.id} className="story-follow-card is-coming">{content}</article>;
 })}</div></section>;
}
