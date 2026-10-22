import {Search, ChevronRight, X, RotateCcw, SkipBack, Pause, Play, SkipForward} from 'lucide-react';
import {rutaEntidadLocalizada} from '../atlasRoutes.js';
import {slugPublico} from '../../../domain/people/personLabels.js';
import {TL_MIN, TL_MAX} from '../timelineUtils.js';

// Barra de trabajo: búsqueda, año, filtros activos y modos.
export default function AtlasTopbar({vm, searchOpen, searchResults, setSearchOpen}) {
  const {actualizarAnioDesdeRango, alternarReproduccionHistoria, anioGlobal, anioInput, atlasScene, confirmarAnioEscrito, currentSearchIndex, gobernantesActivosEnAnio, irACoincidencia, modoTrabajo, moverAnioHistoria, personasVivasEnAnio, positions, query, queryTrim, reproduciendoHistoria, restablecerAnio, searchMatchIds, seleccionarEvento, seleccionarPersonaPorId, setAnioInput, setQuery, setReproduciendoHistoria} = vm;
  return (
    <div className={`workspace-topbar${modoTrabajo ? " is-work-mode" : ""}`}>
        <section className="workspace-topbar-section workspace-toolbar-search" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setSearchOpen(false);}}>
          <div className="toolbar-label sk" style={{"--sk-index":0}}>Búsqueda</div>
          <div className="search-box toolbar-search-box sk" style={{"--sk-index":1}}>
            <Search size={13} aria-hidden="true" />
            <input
              id="atlas-person-search"
              placeholder="Buscar personas, casas, lugares, historias…"
              aria-label="Buscar en todo el Atlas"
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
                  {searchMatchIds.length ? `${Math.max(1, currentSearchIndex + 1)} / ${searchMatchIds.length} personas` : "0 personas"}
                </span>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Persona anterior de la búsqueda" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(-1)}>
                  <ChevronRight size={10} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Persona siguiente de la búsqueda" disabled={!searchMatchIds.length} onClick={() => irACoincidencia(1)}>
                  <ChevronRight size={10} />
                </button>
                <button type="button" className="nav-btn search-nav-btn" aria-label="Borrar búsqueda" title="Borrar búsqueda" onClick={() => { setQuery(''); setSearchOpen(false); }}><X size={12}/></button>
              </div>
            )}
          </div>
          {searchOpen && queryTrim && <div id="atlas-search-results" className="atlas-search-results" aria-label="Resultados de toda la base">
            <span role="status">{searchResults.total ? `${searchResults.total} coincidencias en el Atlas` : 'No hay coincidencias'}</span>
            {searchResults.people.length > 0 && <section aria-label="Personas"><strong>Personas</strong>{searchResults.people.map(p=><button type="button" key={p.id} onClick={()=>{if(atlasScene === "europa")seleccionarPersonaPorId(p.id,{abrirAtlas:true});vm.growth.onSelect(p.id);setSearchOpen(false);}}><span>{p.nombre}</span><small>{positions[p.id]?'Ver en el árbol':'Ver ficha y familia'}</small></button>)}</section>}
            {searchResults.dynasties.length > 0 && <section aria-label="Dinastías"><strong>Dinastías</strong>{searchResults.dynasties.map(name=><a key={name} href={rutaEntidadLocalizada('es','dinastia',slugPublico(name))}><span>{name}</span><small>Abrir casa</small></a>)}</section>}
            {searchResults.territories.length > 0 && <section aria-label="Territorios"><strong>Territorios</strong>{searchResults.territories.map(name=><a key={name} href={rutaEntidadLocalizada('es','territorio',slugPublico(name))}><span>{name}</span><small>Abrir territorio</small></a>)}</section>}
            {searchResults.stories.length > 0 && <section aria-label="Historias"><strong>Historias</strong>{searchResults.stories.map(story=><a key={story.id} href={rutaEntidadLocalizada('es','historia',slugPublico(story.titulo))}><span>{story.titulo}</span><small>Leer historia</small></a>)}</section>}
            {searchResults.events.length > 0 && <section aria-label="Acontecimientos"><strong>Acontecimientos</strong>{searchResults.events.map(event=><button type="button" key={event.id} onClick={()=>{seleccionarEvento(event);setSearchOpen(false);}}><span>{event.titulo}</span><small>Ir al año {event.anio ?? event.desde}</small></button>)}</section>}
          </div>}
        </section>

        <section className="workspace-topbar-section workspace-toolbar-year">
          <div className="global-year-heading-row">
            <div className="toolbar-label sk" style={{"--sk-index":0}}>Año global</div>

            {Number.isFinite(anioGlobal) && (
              <span className="global-year-header-summary">
                {personasVivasEnAnio.length} vivas · {gobernantesActivosEnAnio.length} gobernando
              </span>
            )}
          </div>
          <div className="global-year-control global-year-control-inline" aria-label="Selector global de año">
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
                aria-label="Seleccionar año"
                aria-valuetext={Number.isFinite(anioGlobal) ? String(anioGlobal) : "Todos los años"}
              />
              <span className="global-year-thumb" aria-hidden="true">{Number.isFinite(anioGlobal) ? anioGlobal : "Todos"}</span>
            </div>
            <div className="global-year-entry-row">
              <input
                className="global-year-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={anioInput}
                placeholder="Año"
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
                aria-label="Año global exacto"
                title={`Escribe un año entre ${TL_MIN} y ${TL_MAX} y pulsa Enter`}
              />
              <button
                type="button"
                className="global-year-reset"
                disabled={atlasScene === "europa"}
                onClick={restablecerAnio}
                title="Mostrar todos los años"
                aria-label="Mostrar todos los años"
              >
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="history-playback-controls" aria-label="Reproducción automática de la historia">
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(-1)}
                title="Retroceder un año"
                aria-label="Retroceder un año"
              >
                <SkipBack size={12} />
              </button>
              <button
                type="button"
                className={`history-playback-btn history-playback-main${reproduciendoHistoria ? " active" : ""}`}
                onClick={alternarReproduccionHistoria}
                title={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir: 1 año cada 0,5 segundos"}
                aria-label={reproduciendoHistoria ? "Pausar reproducción" : "Reproducir historia"}
              >
                {reproduciendoHistoria ? <Pause size={12} /> : <Play size={12} />}
              </button>
              <button
                type="button"
                className="history-playback-btn"
                onClick={() => moverAnioHistoria(1)}
                title="Avanzar un año"
                aria-label="Avanzar un año"
              >
                <SkipForward size={12} />
              </button>
            </div>
          </div>
        </section>

      </div>
  );
}
