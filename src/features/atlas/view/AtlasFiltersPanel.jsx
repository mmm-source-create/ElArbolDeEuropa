import {TERRITORIAL_FOLDER_LABELS, groupByRegion, territoryRegion} from '../../../domain/filters/atlasFilters.js';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {REINO_COLOR, REINO_COLOR_DEFAULT} from '../../../cartography/kingdomMaps.js';
import {PERSONAS} from '../../../data/personas.js';
import {ACCENTS, SIN_FECHA} from '../atlasModel.js';
import {nRomano} from '../timelineUtils.js';
import {Chip} from '../ExplorerPrimitives.jsx';
import SegmentedControl from '../../../ui/SegmentedControl.jsx';

const TERRITORY_FILTER_MODES=[{value:'associated',label:'Vinculados'},{value:'government',label:'Gobernaban en el año'}];

function FilterSection({ title, open, onToggle, activeCount = 0, children }) {
  return (
    <section className={`filter-static-section${open ? " is-open" : " is-collapsed"}`}>
      <button type="button" className="filter-section-toggle" onClick={onToggle} aria-expanded={open}>
        <span className="filter-section-title">{title}</span>
        <span className="filter-section-meta">
          {activeCount > 0 && <span className="filter-section-count">{activeCount}</span>}
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </span>
      </button>
      {open && <div className="filter-static-content">{children}</div>}
    </section>
  );
}

function TerritoryFilterNode({ name, options, selected, expanded, onToggleTerritory, onToggleExpanded, depth = 0, ancestors = [] }) {
  if (ancestors.includes(name)) return null;
  const children = options[name] || [];
  const hasChildren = children.length > 0;
  const isExpanded = expanded.includes(name);
  const color = REINO_COLOR[name] || REINO_COLOR_DEFAULT;
  return (
    <div className={`dinastia-block territory-filter-node${depth ? ' is-nested' : ''}`}>
      <span className="dinastia-chip-row">
        <Chip label={TERRITORIAL_FOLDER_LABELS.has(name)?`${name} · región`:name} small={depth > 0} active={selected.includes(name)} color={color} onClick={() => onToggleTerritory(name)} />
        {hasChildren && <button type="button" className="dinastia-expand-btn"
          onClick={() => onToggleExpanded(name)} aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Ocultar' : 'Mostrar'} territorios de ${name}`}>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>}
      </span>
      {hasChildren && isExpanded && <div className="territory-filter-children">
        {children.map(child => <TerritoryFilterNode key={child} name={child} options={options}
          selected={selected} expanded={expanded} onToggleTerritory={onToggleTerritory}
          onToggleExpanded={onToggleExpanded} depth={depth + 1} ancestors={[...ancestors, name]} />)}
      </div>}
    </div>
  );
}

function DynastyFilterNode({name,options,selected,expanded,onToggle,onExpand,folder=false,path=[]}) {
 if(path.includes(name))return null;
 const children=options[name]||[],open=expanded.includes(name);
 return <div className="dinastia-block"><span className="dinastia-chip-row"><Chip label={name} small={path.length>0} active={selected.includes(name)} color={ACCENTS[name]||'#71717A'} onClick={()=>onToggle(name)}/>{children.length>0&&<button type="button" className="dinastia-expand-btn" aria-expanded={open} aria-label={`${open?'Ocultar':'Mostrar'} ${folder?'casas':'ramas'} de ${name}`} onClick={()=>onExpand(name)}>{open?<ChevronDown size={11}/>:<ChevronRight size={11}/>}</button>}</span>{open&&<div className="territory-filter-children">{children.map(child=><DynastyFilterNode key={child} name={child} options={options} selected={selected} expanded={expanded} onToggle={onToggle} onExpand={onExpand} path={[...path,name]}/>)}</div>}</div>;
}

// Panel lateral de filtros.
export default function AtlasFiltersPanel({vm, filterCount, filtrosCompactosRestantes, filtrosCompactosVisibles, regionesDinasticas}) {
  const {alternarSeccionFiltro, anioGlobal, dinastias, dinastiasExpandidas, filterSectionsOpen, filtrosActivosCompactos, historiaActiva, limpiarSoloFiltros, opciones, relaciones, setDinastias, setDinastiasExpandidas, setRelaciones, setSiglos, setSoloDocumentados, setTerritorialFilterMode, setTerritorios, setTerritoriosExpandidos, setTitulos, siglos, soloDocumentados, territorialFilterMode, territorios, territoriosExpandidos, titulos, toggle, visiblePeople} = vm;
  return (
    <aside className="workspace-sidebar">
          <section className="panel workspace-fixed-panel workspace-filter-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>Filtros</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>
                {visiblePeople.length !== PERSONAS.length ? `${visiblePeople.length} / ${PERSONAS.length} visibles` : `${PERSONAS.length} personas`}
              </span>
            </div>
            <div className={`filter-active-overview${filtrosActivosCompactos.length ? " has-active" : ""}`}>
              <span className="filter-active-overview-label">Filtros activos</span>
              <span className="filter-active-overview-values">
                {filtrosCompactosVisibles.length ? filtrosCompactosVisibles.join(" · ") : "Ninguno"}
                {filtrosCompactosRestantes > 0 ? ` · +${filtrosCompactosRestantes}` : ""}
              </span>
            </div>
            {filterCount > 0 && <button type="button" className="workspace-filter-clear" onClick={limpiarSoloFiltros}>
              Quitar {filterCount} {filterCount === 1 ? 'filtro' : 'filtros'}
            </button>}
            <div className="panel-body workspace-panel-scroll workspace-filter-scroll">
              <div className="atlas-scope"><strong>{vm.growth.ids===null?'Base completa':`${vm.growth.ids.length} personas en tu selección`}</strong><span>Elige una persona y amplía su familia desde su ficha.</span><div>{!historiaActiva&&<>{vm.growth.ids!==null&&<button onClick={vm.growth.onFull}>Ver todas</button>}<button onClick={vm.growth.onNew}>Nueva selección</button>{vm.growth.canUndo&&<button onClick={vm.growth.onUndo}>Deshacer</button>}</>}</div></div>
              <div className="filters-row filters-row-vertical filters-always-open">
                <FilterSection
                  title="Territorios"
                  open={filterSectionsOpen.territorios}
                  onToggle={() => alternarSeccionFiltro("territorios")}
                  activeCount={territorios.length}
                >
                  <SegmentedControl className="atlas-filter-mode" label="Criterio del filtro territorial" value={territorialFilterMode} onChange={setTerritorialFilterMode} options={TERRITORY_FILTER_MODES}/>
                  {territorialFilterMode==='government'&&anioGlobal==null&&<p className="atlas-filter-explanation">Elige un año para ver solo quién gobernaba entonces.</p>}
                  {groupByRegion(opciones.territorios, territoryRegion).map(({region, items}) => <div key={region} className="atlas-filter-region">
                    <h4 className="atlas-filter-heading">{region}<small>{items.length}</small></h4>
                    <div className="filter-group filter-group-dinastias">
                      {items.map((territorio) => <TerritoryFilterNode key={territorio}
                        name={territorio} options={opciones.subsPorTerritorio} selected={territorios}
                        expanded={territoriosExpandidos}
                        onToggleTerritory={(name) => toggle(setTerritorios, territorios, name)}
                        onToggleExpanded={(name) => toggle(setTerritoriosExpandidos, territoriosExpandidos, name)} />)}
                    </div>
                  </div>)}
                </FilterSection>

                <FilterSection
                  title="Dinastías"
                  open={filterSectionsOpen.dinastias}
                  onToggle={() => alternarSeccionFiltro("dinastias")}
                  activeCount={dinastias.length}
                >
                  {/* Las mismas regiones que en Territorios; las carpetas reúnen casas menores de cada región. */}
                  {groupByRegion([...opciones.dynastyFamilies, ...opciones.dynastyFolders], name => regionesDinasticas[name]).map(({region, items}) => <div key={region} className="atlas-filter-region">
                    <h4 className="atlas-filter-heading">{region}<small>{items.length}</small></h4>
                    <div className="filter-group filter-group-dinastias">{[...items.filter(n => !opciones.dynastyFolders.includes(n)), ...items.filter(n => opciones.dynastyFolders.includes(n))].map(name => <DynastyFilterNode key={name} name={name} options={opciones.ramasPorPrincipal} selected={dinastias} expanded={dinastiasExpandidas} onToggle={n=>toggle(setDinastias,dinastias,n)} onExpand={n=>toggle(setDinastiasExpandidas,dinastiasExpandidas,n)} folder={opciones.dynastyFolders.includes(name)}/>)}</div>
                  </div>)}
                </FilterSection>

                <FilterSection
                  title="Función histórica"
                  open={filterSectionsOpen.titulos}
                  onToggle={() => alternarSeccionFiltro("titulos")}
                  activeCount={titulos.length}
                >
                  <div className="filter-group">
                    {opciones.titulos.map((categoria) => (
                      <Chip
                        key={categoria.id}
                        label={categoria.label}
                        active={titulos.includes(categoria.id)}
                        color="#8A6D3B"
                        onClick={() => toggle(setTitulos, titulos, categoria.id)}
                      />
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Periodo vital"
                  open={filterSectionsOpen.siglos}
                  onToggle={() => alternarSeccionFiltro("siglos")}
                  activeCount={siglos.length}
                >
                  <div className="filter-group">
                    {opciones.siglos.map((valor) => (
                      <Chip key={valor} label={`s. ${nRomano[valor] || valor}`} active={siglos.includes(valor)} color="#3D4F63" onClick={() => toggle(setSiglos, siglos, valor)} />
                    ))}
                    {opciones.hayPersonasSinFecha && (
                      <Chip label="Fechas incompletas" active={siglos.includes(SIN_FECHA)} color="#6B6350" onClick={() => toggle(setSiglos, siglos, SIN_FECHA)} />
                    )}
                  </div>
                </FilterSection>

                <FilterSection
                  title="Relaciones y familia"
                  open={filterSectionsOpen.relaciones}
                  onToggle={() => alternarSeccionFiltro("relaciones")}
                  activeCount={relaciones.length}
                >
                  <div className="filter-group filter-group-relaciones">
                    {opciones.relaciones.map((filtro) => (
                      <Chip
                        key={filtro.id}
                        label={filtro.label}
                        active={relaciones.includes(filtro.id)}
                        color={filtro.id === "amantes" ? "#8E3D68" : "#5E6673"}
                        onClick={() => toggle(setRelaciones, relaciones, filtro.id)}
                      />
                    ))}
                  </div>
                </FilterSection>
                <FilterSection
                  title="Evidencia histórica"
                  open={filterSectionsOpen.evidencia}
                  onToggle={() => alternarSeccionFiltro("evidencia")}
                  activeCount={soloDocumentados ? 1 : 0}
                >
                  <label className="evidence-filter-toggle">
                    <input type="checkbox" checked={soloDocumentados} onChange={event => setSoloDocumentados(event.target.checked)} />
                    <span>Con al menos un dato documentado</span>
                  </label>
                  <p className="evidence-filter-hint">La revisión es aún parcial. Cada persona visible tiene al menos una afirmación contrastada con una fuente concreta; otros datos de su ficha pueden seguir pendientes.</p>
                </FilterSection>
              </div>

            </div>
          </section>
        </aside>
  );
}
