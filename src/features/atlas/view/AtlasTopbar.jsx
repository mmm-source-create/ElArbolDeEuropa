import {Search, ChevronRight, X, RotateCcw, SkipBack, Pause, Play, SkipForward} from 'lucide-react';
import {slugPublico} from '../../../domain/people/personLabels.js';
import {TL_MIN, TL_MAX} from '../timelineUtils.js';
import {translatedEquivalent} from '../../english/routes.js';
import {englishLabel} from '../../english/v6/atlasPresentation.js';

// Barra de trabajo: búsqueda, año, filtros activos y modos.
export default function AtlasTopbar({vm, searchOpen, searchResults, setSearchOpen}) {
  const {actualizarAnioDesdeRango, alternarReproduccionHistoria, anioGlobal, anioInput, atlasScene, confirmarAnioEscrito, currentSearchIndex, gobernantesActivosEnAnio, irACoincidencia, locale, modoTrabajo, moverAnioHistoria, personasVivasEnAnio, positions, query, queryTrim, reproduciendoHistoria, restablecerAnio, searchMatchIds, seleccionarEvento, seleccionarPersonaPorId, setAnioInput, setQuery, setReproduciendoHistoria} = vm;
  const en=locale==='en';
  const label=value=>en?englishLabel(value):value;
  const entityHref=(kind,name)=>{const esKind={dinastia:'dinastia',territorio:'territorio',historia:'historia'}[kind],path=`/es/${esKind}/${slugPublico(name)}`;return en?(translatedEquivalent(path,'en')||path):path;};
  return (
    <div className={`workspace-topbar${modoTrabajo ? " is-work-mode" : ""}`}>
        <section className="workspace-topbar-section workspace-toolbar-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setSearchOpen(false);}}>
          <div className="toolbar-label sk" style={{"--sk-index":0}}>{en?'Search':'Búsqueda'}</div>
          <div className="search-box toolbar-search-box sk" style={{"--sk-index":1}}>
            <Search size={13} aria-hidden="true" />
            <input
              id="atlas-person-search"
              placeholder={en?'Search people, houses, places, stories…':'Buscar personas, casas, lugares, historias…'}
              aria-label={en?'Search the entire Atlas':'Buscar en todo el Atlas'}
              aria-expanded={searchOpen && Boolean(queryTrim)}
              aria-controls="atlas-search-results"
              value={query}
              onFocus={()=>setSearchOpen(true)}
              onChange={(event) => {setQuery(event.target.value);setSearchOpen(true);}}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
                if (event.key === "Enter" && searchResults.people.length) {
                  event.preventDefault();
                  vm.growth.onSelect(searchResults.people[0].id);
                  setSearchOpen(false);
                }
              }}
            />
            {queryTrim && (
              <div className="toolbar-search-nav">
                <span className="toolbar-search-count">
                  {searchMatchIds.length ? `${Math.max(1, currentSearchIndex + 1)} / ${searchMatchIds.length} ${en?'people':'personas'}` : `0 ${en?'people':'personas'}`}
                </span>
                <button type="button" className="nav-btn search-nav-btn" aria-label={en?'Previous person in search':'Persona anterior de la búsqueda'} disabled={!searchMatchIds.length} onClick={() => irACoincidencia(-1)}>
                  <ChevronRight size={10} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label={en?'Next person in search':'Persona siguiente de la búsqueda'} disabled={!searchMatchIds.length} onClick={() => irACoincidencia(1)}>
                  <ChevronRight size={10} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label={en?'Clear search':'Borrar búsqueda'} title={en?'Clear search':'Borrar búsqueda'} onClick={() => { setQuery(''); setSearchOpen(false); }}><X size={12}/></button>
              </div>
            )}
          </div>
          {searchOpen && queryTrim && <div id="atlas-search-results" className="atlas-search-results" aria-label={en?'Results from the entire database':'Resultados de toda la base'}>
            <span role="status">{searchResults.total ? `${searchResults.total} ${en?'matches in the Atlas':'coincidencias en el Atlas'}` : en?'No matches':'No hay coincidencias'}</span>
            {searchResults.people.length > 0 && <section aria-label={en?'People':'Personas'}><strong>{en?'People':'Personas'}</strong>{searchResults.people.map(p=><button type="button" key={p.id} onClick={()=>{if(atlasScene === "europa")seleccionarPersonaPorId(p.id,{abrirAtlas:true});vm.growth.onSelect(p.id);setSearchOpen(false);}}><span>{p.nombre}</span><small>{positions[p.id]?(en?'View in tree':'Ver en el árbol'):(en?'View record and family':'Ver ficha y familia')}</small></button>)}</section>}
            {searchResults.dynasties.length > 0 && <section aria-label={en?'Dynasties':'Dinastías'}><strong>{en?'Dynasties':'Dinastías'}</strong>{searchResults.dynasties.map(name=><a key={name} href={entityHref('dinastia',name)}><span>{label(name)}</span><small>{en?'Open house':'Abrir casa'}</small></a>)}</section>}
            {searchResults.territories.length > 0 && <section aria-label={en?'Territories':'Territorios'}><strong>{en?'Territories':'Territorios'}</strong>{searchResults.territories.map(name=><a key={name} href={entityHref('territorio',name)}><span>{label(name)}</span><small>{en?'Open territory':'Abrir territorio'}</small></a>)}</section>}
            {searchResults.stories.length > 0 && <section aria-label={en?'Stories':'Historias'}><strong>{en?'Stories':'Historias'}</strong>{searchResults.stories.map(story=><a key={story.id} href={entityHref('historia',story.titulo)}><span>{label(story.titulo)}</span><small>{en?'Read story':'Leer historia'}</small></a>)}</section>}
            {searchResults.events.length > 0 && <section aria-label={en?'Events':'Acontecimientos'}><strong>{en?'Events':'Acontecimientos'}</strong>{searchResults.events.map(event=><button type="button" key={event.id} onClick={()=>{seleccionarEvento(event);setSearchOpen(false);}}><span>{label(event.titulo)}</span><small>{en?'Go to year':'Ir al año'} {event.anio ?? event.desde}</small></button>)}</section>}
          </div>}
        </section>

        <section className="workspace-topbar-section workspace-toolbar-year">
          <div className="global-year-heading-row">
            <div className="toolbar-label sk" style={{"--sk-index":0}}>{en?'Global year':'Año global'}</div>

            {Number.isFinite(anioGlobal) && (
              <span className="global-year-header-summary">
                {personasVivasEnAnio.length} {en?'alive':'vivas'} · {gobernantesActivosEnAnio.length} {en?'ruling':'gobernando'}
              </span>
            )}
          </div>
          <div className="global-year-control global-year-control-inline" aria-label={en?'Global year selector':'Selector global de año'}>
            {/* V5.20 · El año se lee dentro del tirador del control. */}
            <div className={`global-year-slider${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
              style={{"--p": ((Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))) - TL_MIN) / (TL_MAX - TL_MIN)}}>
              <input
                className={`global-year-range${Number.isFinite(anioGlobal) ? "" : " is-idle"}`}
                type="range"
                min={TL_MIN}
                max={TL_MAX}
                step="1"
                value={Number.isFinite(anioGlobal) ? anioGlobal : Math.max(TL_MIN, Math.min(TL_MAX, 1500))}
                onChange={(event) => actualizarAnioDesdeRango(event.target.value)}
                aria-label={en?'Select year':'Seleccionar año'}
                aria-valuetext={Number.isFinite(anioGlobal) ? String(anioGlobal) : en?'All years':"Todos los años"}
              />
              <span className="global-year-thumb" aria-hidden="true">{Number.isFinite(anioGlobal) ? anioGlobal : en?'All':"Todos"}</span>
            </div>
            <div className="global-year-entry-row">
              <input
                className="global-year-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={anioInput}
                placeholder={en?'Year':'Año'}
                onChange={(event) => {
                  const valor = event.target.value;
                  setReproduciendoHistoria(false);
                  if (/^\d*$/.test(valor)) setAnioInput(valor);
                }}
                onBlur={confirmarAnioEscrito}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirmarAnioEscrito();
                    event.currentTarget.blur();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setAnioInput(Number.isFinite(anioGlobal) ? String(anioGlobal) : "");
                  }
                }}
                aria-label={en?'Exact global year':'Año global exacto'}
                title={en?`Enter a year from ${TL_MIN} to ${TL_MAX} and press Enter`:`Escribe un año entre ${TL_MIN} y ${TL_MAX} y pulsa Enter`}
              />
              <button
                type="button"
                className="global-year-reset"
                disabled={atlasScene === "europa"}
                onClick={restablecerAnio}
                title={en?'Show all years':'Mostrar todos los años'}
                aria-label={en?'Show all years':'Mostrar todos los años'}
              >
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="history-playback-controls" aria-label={en?'Automatic story playback':'Reproducción automática de la historia'}>
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(-1)}
                title={en?'Go back one year':'Retroceder un año'}
                aria-label={en?'Go back one year':'Retroceder un año'}
              >
                <SkipBack size={12} />
              </button>
              <button
                type="button"
                className={`history-playback-btn history-playback-main${reproduciendoHistoria ? " active" : ""}`}
                onClick={alternarReproduccionHistoria}
                title={reproduciendoHistoria ? (en?'Pause playback':"Pausar reproducción") : (en?'Play: 1 year every 0.5 seconds':"Reproducir: 1 año cada 0,5 segundos")}
                aria-label={reproduciendoHistoria ? (en?'Pause playback':"Pausar reproducción") : (en?'Play story':"Reproducir historia")}
              >
                {reproduciendoHistoria ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(1)}
                title={en?'Go forward one year':'Avanzar un año'}
                aria-label={en?'Go forward one year':'Avanzar un año'}
              >
                <SkipForward size={12} />
              </button>
            </div>
          </div>
        </section>

      </div>
  );
}
