import React,{useEffect,useMemo,useState} from 'react';
import {Landmark,Search} from 'lucide-react';
import {Breadcrumbs,PublicLayout,useJson,usePublicMeta} from './publicShared.jsx';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import {SITE_NAME,SITE_NAME_EN} from '../../app/siteConfig.js';
import {loadJsonAsset} from '../../utils/loadAsset.js';
import {groupByLetter} from './peopleIndex.js';
import {TERRITORY_CLASSES,TERRITORY_NATURES,TERRITORY_REGIONS,filterTerritories,territoryDirectory,territoryExcerpt,territoryFacets,territoryFeaturedOrder,territoryLabel,territoryOrder,territoryPath} from './territoryCatalog.js';
import './territoryCatalog.css';

export function TerritoryCard({item,locale='es'}) {
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const intervals=item.intervalos||[];
  const period=intervals.length?`${intervals[0][0]}–${intervals.at(-1)[1]}`:null;
  return <article className="territory-catalog-card">
    <span className="territory-catalog-nature">{territoryLabel(TERRITORY_NATURES,item.naturaleza,locale)}</span>
    <h3><a href={territoryPath(item)}>{item.nombre}</a></h3>
    <p className="territory-catalog-type">{territoryLabel(TERRITORY_CLASSES,item.clase,locale)}</p>
    {item.resumen&&<p className="territory-catalog-summary">{territoryExcerpt(item.resumen)}</p>}
    <dl className="territory-catalog-facts">
      <div><dt>{tr('Región','Region')}</dt><dd>{item.regiones.map(region=>territoryLabel(TERRITORY_REGIONS,region,locale)).join(' · ')}</dd></div>
      {period&&<div><dt>{item.naturaleza==='entidad'?tr('Gobiernos registrados','Recorded governments'):tr('Mandatos del conjunto y sus componentes','Governments of the group and its components')}</dt><dd>{period}{intervals.length>1?tr(' · con intervalos sin registros',' · gaps in the records'):''}</dd></div>}
      <div><dt>{tr('Personas vinculadas','Related people')}</dt><dd>{item.total}{item.gobernantes>0&&tr(` · ${item.gobernantes} con mandatos vinculados`,` · ${item.gobernantes} with linked governments`)}</dd></div>
    </dl>
    <a className="territory-catalog-action" href={territoryPath(item)}>{tr('Explorar territorio','Explore territory')}</a>
  </article>;
}

export default function TerritoryCatalog({locale='es',initialData=null,embedded=false}) {
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const path=en?'/en/territories':'/es/territorios',title=tr('Territorios','Territories');
  const description=tr('Explora entidades históricas, uniones y agrupaciones por región, tipo y gobiernos registrados.','Explore historical entities, unions and groupings by region, type and recorded governments.');
  usePublicMeta({title:`${title} — ${en?SITE_NAME_EN:SITE_NAME}`,description,path});
  const {data,loading,error}=useJson(en?'/catalogos/territories-en.json':'/catalogos/territorios.json',initialData);
  const [complete,setComplete]=useState(null),[loadError,setLoadError]=useState(false),[retry,setRetry]=useState(0);
  const [filters,setFilters]=useState({query:'',region:'',nature:'',type:'',year:'',history:false});
  const [view,setView]=useState('regions'),[limit,setLimit]=useState(60);
  useEffect(()=>{setFilters(current=>({...current,query:new URLSearchParams(window.location.search).get('q')||''}));},[]);
  useEffect(()=>{
    if(!data?.partial?.full)return;
    let cancelled=false;setLoadError(false);
    loadJsonAsset(data.partial.full).then(full=>{if(!Array.isArray(full?.items))throw Error('Invalid catalogue');if(!cancelled)setComplete(full.items);}).catch(()=>{if(!cancelled)setLoadError(true);});
    return ()=>{cancelled=true;};
  },[data?.partial?.full,retry]);
  useEffect(()=>{setLimit(60);},[filters,view]);
  const partial=Boolean(data?.partial&&!complete),items=complete||data?.items||[];
  const facets=useMemo(()=>data?.territoryFacets||territoryFacets(items),[data,items]);
  const directory=useMemo(()=>data?.directory||territoryDirectory(items,locale),[data,items,locale]);
  const groups=useMemo(()=>groupByLetter(directory),[directory]);
  const filtered=useMemo(()=>territoryOrder(filterTerritories(items,filters),locale),[items,filters,locale]);
  const active=Object.values(filters).some(Boolean);
  const regional=view==='regions'&&!active;
  const count=partial&&!active?data.partial.total:filtered.length;
  const update=(key,value)=>setFilters(current=>({...current,[key]:value}));
  const reset=()=>setFilters({query:'',region:'',nature:'',type:'',year:'',history:false});
  const Wrapper=embedded?React.Fragment:PublicLayout;
  return <Wrapper {...(embedded?{}:{pathname:path,prerendered:Boolean(initialData)})}>
    <main className="public-main public-catalog territory-catalog">
      <Breadcrumbs locale={locale} items={[{label:tr('Inicio','Home'),href:en?'/en':'/es'},{label:title}]}/>
      <header className="public-page-title"><div className="public-page-icon"><Landmark size={22}/></div><span>{tr('Geografía e historia política','Geography and political history')}</span><h1>{title}</h1><p>{description}</p></header>
      {loading&&<ReadingSkeleton kind="catalog-list" list="entities" locale={locale}/>}
      {error&&<p role="alert">{tr('No se ha podido cargar el catálogo.','The catalogue could not load.')}</p>}
      {data&&<>
        {/* 6.3.5: search and regions first, as in the people and dynasty indexes; the other filters stay folded. */}
        <section className="territory-catalog-controls" aria-label={tr('Buscar y filtrar territorios','Search and filter territories')}>
          <label className="public-search"><Search size={16}/><input value={filters.query} onChange={e=>update('query',e.target.value)} placeholder={tr('Buscar nombre, variante o persona…','Search a name, variant or person…')} aria-label={tr('Buscar territorios','Search territories')}/></label>
          <div className="people-facets">
            <div className="people-facets-head">
              <a className="territory-catalog-az" href="#territory-directory" onClick={()=>{const directory=document.getElementById('territory-directory');if(directory)directory.open=true;}}>{tr('Índice completo A–Z','Complete A–Z index')}</a>
              {active&&<button type="button" className="people-facets-clear" onClick={reset}>{tr('Quitar filtros','Clear filters')}</button>}
            </div>
            <div className="people-facet"><span>{tr('Región','Region')}</span><div>
              <button type="button" aria-pressed={!filters.region} onClick={()=>update('region','')}>{tr('Todas','All')}</button>
              {Object.keys(TERRITORY_REGIONS).filter(key=>facets.regiones[key]).map(key=><button key={key} type="button" aria-pressed={filters.region===key} onClick={()=>update('region',filters.region===key?'':key)}>{territoryLabel(TERRITORY_REGIONS,key,locale)}<small>{facets.regiones[key]}</small></button>)}
            </div></div>
            <details className="territory-catalog-more" open={Boolean(filters.nature||filters.type||filters.year||filters.history)||undefined}>
              <summary>{tr('Más filtros','More filters')}{[filters.nature,filters.type,filters.year,filters.history].filter(Boolean).length?<small> · {[filters.nature,filters.type,filters.year,filters.history].filter(Boolean).length}</small>:null}</summary>
              <div className="people-facet"><span>{tr('Naturaleza','Entity kind')}</span><div>
                {Object.keys(TERRITORY_NATURES).filter(key=>facets.naturalezas[key]).map(key=><button key={key} type="button" aria-pressed={filters.nature===key} onClick={()=>update('nature',filters.nature===key?'':key)}>{territoryLabel(TERRITORY_NATURES,key,locale)}</button>)}
              </div></div>
              <div className="people-facet"><span>{tr('Tipo','Type')}</span><div>
                <select className="territory-catalog-select" value={filters.type} onChange={e=>update('type',e.target.value)} aria-label={tr('Tipo de territorio','Territory type')}><option value="">{tr('Todos los tipos','All types')}</option>{Object.keys(facets.clases).sort((a,b)=>territoryLabel(TERRITORY_CLASSES,a,locale).localeCompare(territoryLabel(TERRITORY_CLASSES,b,locale),locale)).map(key=><option key={key} value={key}>{territoryLabel(TERRITORY_CLASSES,key,locale)}</option>)}</select>
              </div></div>
              <div className="people-facet"><span>{tr('Gobierno','Government')}</span><div className="territory-catalog-year">
                <input type="number" inputMode="numeric" step="1" value={filters.year} onChange={e=>update('year',e.target.value)} placeholder={tr('Año','Year')} aria-label={tr('Con gobierno registrado en el año','With a government recorded in the year')} aria-describedby="territory-year-help"/>
                <small id="territory-year-help">{tr('Territorios con algún mandato registrado ese año.','Territories with a government recorded in that year.')}</small>
              </div></div>
              <div className="people-facet"><span>{tr('Historia','History')}</span><div>
                <button type="button" aria-pressed={filters.history} onClick={()=>update('history',!filters.history)}>{tr('Con historia desarrollada','With a developed history')}</button>
              </div></div>
            </details>
          </div>
        </section>
        <div className="territory-catalog-results-head"><p role="status">{count} {count===1?tr('territorio','territory'):tr('territorios','territories')}{partial&&active?tr(' · resultados iniciales',' · initial results'):''}</p>{active?<span className="territory-catalog-order-hint">A–Z</span>:<div className="people-order territory-catalog-view" role="group" aria-label={tr('Presentación','View')}>{[['regions',tr('Por regiones','By region')],['alphabetical','A–Z']].map(([key,label])=><button key={key} type="button" aria-pressed={view===key} onClick={()=>setView(key)}>{label}</button>)}</div>}</div>
        {partial&&<p className="territory-catalog-load" role="status">{loadError?<>{tr('No se ha podido cargar la lista ampliada. El índice A–Z contiene todas las fichas.','The extended list could not load. The A–Z index contains every record.')} <button type="button" onClick={()=>setRetry(n=>n+1)}>{tr('Reintentar','Retry')}</button></>:tr('Cargando el resto del catálogo… El índice A–Z ya está disponible.','Loading the rest of the catalogue… The A–Z index is already available.')}</p>}
        {regional?<div className="territory-catalog-sections">{Object.keys(TERRITORY_REGIONS).map(region=>{
          const members=territoryFeaturedOrder(filtered.filter(item=>item.regiones.includes(region)),locale,region);if(!members.length)return null;
          return <section className="territory-catalog-region" key={region}><div className="territory-catalog-region-head"><h2>{territoryLabel(TERRITORY_REGIONS,region,locale)}</h2><button type="button" onClick={()=>update('region',region)}>{tr('Ver todos','View all')} ({facets.regiones[region]})</button></div><div className="territory-catalog-grid">{members.slice(0,6).map(item=><TerritoryCard key={item.key||item.slug} item={item} locale={locale}/>)}</div></section>;
        })}</div>:<><div className="territory-catalog-grid">{filtered.slice(0,limit).map(item=><TerritoryCard key={item.key||item.slug} item={item} locale={locale}/>)}</div>{filtered.length>limit&&<button className="public-secondary territory-catalog-more" type="button" onClick={()=>setLimit(n=>n+60)}>{tr('Ver más territorios','Show more territories')} ({filtered.length-limit})</button>}{!filtered.length&&<p className="territory-catalog-empty">{tr('Ningún territorio coincide con estos filtros.','No territories match these filters.')}{active&&<> <button type="button" onClick={reset}>{tr('Quitar filtros','Clear filters')}</button></>}</p>}</>}
        <details id="territory-directory" className="territory-catalog-directory" onToggle={e=>{if(e.currentTarget.open&&window.location.hash==='#territory-directory')e.currentTarget.scrollIntoView({block:'start'});}}><summary>{tr('Índice completo de territorios A–Z','Complete A–Z territory index')} <span>({directory.length})</span></summary><p>{tr('Todos los territorios, con enlace directo a su ficha.','Every territory, with a direct link to its record.')}</p><nav className="people-index-letters" aria-label={tr('Letras del índice','Index letters')}>{groups.map(([letter])=><a key={letter} href={`#territory-letter-${letter}`}>{letter}</a>)}</nav>{groups.map(([letter,entries])=><section key={letter} id={`territory-letter-${letter}`} className="people-index-group"><h2>{letter}</h2><ul>{entries.map(item=><li key={item.p}><a href={item.p}>{item.n}</a></li>)}</ul></section>)}</details>
      </>}
    </main>
  </Wrapper>;
}
