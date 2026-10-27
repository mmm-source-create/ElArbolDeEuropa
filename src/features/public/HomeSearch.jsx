import {useEffect, useId, useRef, useState} from 'react';
import {ArrowRight, Search, X} from 'lucide-react';
import {loadJsonAsset} from '../../utils/loadAsset.js';
import SITE_META from '../../generated/siteMeta.json';
import {homeSearchResults} from './homeSearch.js';
import './home-search.css';

const COPY = {
  es: {label:'Buscar en el Atlas',placeholder:'Personas, dinastías, territorios o historias…',hint:'Busca por nombre o por una de sus variantes.',loading:'Buscando…',error:'No se pudo cargar el buscador.',retry:'Reintentar',empty:'Sin coincidencias. Prueba otro nombre o variante.',clear:'Borrar búsqueda',results:'Resultados de búsqueda',types:{person:'Persona',dynasty:'Dinastía',territory:'Territorio',story:'Historia'}},
  en: {label:'Search the Atlas',placeholder:'People, dynasties, territories or stories…',hint:'Search by name or an alternative spelling.',loading:'Searching…',error:'Search could not load.',retry:'Try again',empty:'No matches. Try another name or spelling.',clear:'Clear search',results:'Search results',types:{person:'Person',dynasty:'Dynasty',territory:'Territory',story:'Story'}},
};
export default function HomeSearch({locale = 'es'}) {
  const language = locale === 'en' ? 'en' : 'es', copy = COPY[language], id = useId(), input = useRef(null);
  const [query,setQuery] = useState(''), [index,setIndex] = useState(null), [status,setStatus] = useState('idle'), [retry,setRetry] = useState(0);
  const active = query.trim().length >= 2, url = `/catalogos/search-${language}.json?v=${encodeURIComponent(SITE_META.buildVersion)}`;
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setStatus('loading');
    loadJsonAsset(url).then(data => {if (!cancelled) {setIndex(data.items);setStatus('ready');}}).catch(() => {if (!cancelled) setStatus('error');});
    return () => {cancelled = true;};
  },[active,url,retry]);
  const results = status === 'ready' ? homeSearchResults(index || [],query) : [];
  return <section className="home-search" aria-label={copy.label}>
    <form action={language === 'en' ? '/en/people' : '/es/personas'} method="get" role="search" onSubmit={event => {if (results.length) {event.preventDefault();window.location.assign(results[0].path);} else if (status === 'loading') event.preventDefault();}}>
      <label htmlFor={id}>{copy.label}</label>
      <div className="home-search-field"><Search size={20} aria-hidden="true"/><input ref={input} id={id} type="search" name="q" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => {if (event.key === 'Escape') setQuery('');}} placeholder={copy.placeholder} aria-describedby={`${id}-hint`} autoComplete="off"/>{query && <button type="button" onClick={() => {setQuery('');input.current?.focus();}} aria-label={copy.clear}><X size={18} aria-hidden="true"/></button>}</div>
      <p id={`${id}-hint`} className="home-search-hint">{copy.hint}</p>
    </form>
    {active && <div className="home-search-results" aria-busy={status === 'loading'}>
      <p role="status">{status === 'error' ? copy.error : status !== 'ready' ? copy.loading : results.length ? `${copy.results} · ${results.length}` : copy.empty}</p>
      {status === 'error' && <button className="public-secondary" type="button" onClick={() => setRetry(value => value + 1)}>{copy.retry}</button>}
      {!!results.length && <ul aria-label={copy.results}>{results.map(item => <li key={item.path}><a href={item.path}><span><small>{copy.types[item.type]}</small><strong>{item.name}</strong>{item.context && <span>{item.context}</span>}</span><ArrowRight size={16} aria-hidden="true"/></a></li>)}</ul>}
    </div>}
  </section>;
}
