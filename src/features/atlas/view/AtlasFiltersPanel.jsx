import {groupByRegion, territoryRegion} from '../../../domain/filters/atlasFilters.js';
import {ChevronDown, ChevronRight} from 'lucide-react';
import {REINO_COLOR, REINO_COLOR_DEFAULT} from '../../../cartography/kingdomMaps.js';
import {PERSONAS} from '../../../data/personas.js';
import {ACCENTS, SIN_FECHA} from '../atlasModel.js';
import {nRomano} from '../timelineUtils.js';
import {Chip} from '../ExplorerPrimitives.jsx';
import SegmentedControl from '../../../ui/SegmentedControl.jsx';
import {englishLabel} from '../../english/v6/atlasPresentation.js';

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

function TerritoryFilterNode({ name, options, selected, expanded, onToggleTerritory, onToggleExpanded, depth = 0, ancestors = [], locale='es' }) {
  if (ancestors.includes(name)) return null;
  const children = options[name] || [];
  const hasChildren = children.length > 0;
  const isExpanded = expanded.includes(name);
  const color = REINO_COLOR[name] || REINO_COLOR_DEFAULT;
  return (
    <div className={`dinastia-block territory-filter-node${depth ? ' is-nested' : ''}`}>
      <span className="dinastia-chip-row">
        <Chip label={locale==='en'?englishLabel(name):name} small={depth > 0} active={selected.includes(name)} color={color} onClick={() => onToggleTerritory(name)} />
        {hasChildren && <button type="button" className="dinastia-expand-btn"
          onClick={() => onToggleExpanded(name)} aria-expanded={isExpanded}
          aria-label={locale==='en'?`${isExpanded?'Hide':'Show'} territories of ${englishLabel(name)}`:`${isExpanded ? 'Ocultar' : 'Mostrar'} territorios de ${name}`}>
          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>}
      </span>
      {hasChildren && isExpanded && <div className="territory-filter-children">
        {children.map(child => <TerritoryFilterNode key={child} name={child} options={options}
          selected={selected} expanded={expanded} onToggleTerritory={onToggleTerritory}
          onToggleExpanded={onToggleExpanded} depth={depth + 1} ancestors={[...ancestors, name]} locale={locale} />)}
      </div>}
    </div>
  );
}

function DynastyFilterNode({name,options,selected,expanded,onToggle,onExpand,folder=false,path=[],locale='es'}) {
 if(path.includes(name))return null;
 const children=options[name]||[],open=expanded.includes(name);
 return <div className="dinastia-block"><span className="dinastia-chip-row"><Chip label={locale==='en'?englishLabel(name):name} small={path.length>0} active={selected.includes(name)} color={ACCENTS[name]||'#71717A'} onClick={()=>onToggle(name)}/>{children.length>0&&<button type="button" className="dinastia-expand-btn" aria-expanded={open} aria-label={locale==='en'?`${open?'Hide':'Show'} ${folder?'houses':'branches'} of ${englishLabel(name)}`:`${open?'Ocultar':'Mostrar'} ${folder?'casas':'ramas'} de ${name}`} onClick={()=>onExpand(name)}>{open?<ChevronDown size={11}/>:<ChevronRight size={11}/>}</button>}</span>{open&&<div className="territory-filter-children">{children.map(child=><DynastyFilterNode key={child} name={child} options={options} selected={selected} expanded={expanded} onToggle={onToggle} onExpand={onExpand} path={[...path,name]} locale={locale}/>)}</div>}</div>;
}

// Panel lateral de filtros.
export default function AtlasFiltersPanel({vm, filterCount, filtrosCompactosRestantes, filtrosCompactosVisibles, regionesDinasticas}) {
  const {alternarSeccionFiltro, anioGlobal, dinastias, dinastiasExpandidas, filterSectionsOpen, filtrosActivosCompactos, historiaActiva, limpiarSoloFiltros, locale, opciones, relaciones, setDinastias, setDinastiasExpandidas, setRelaciones, setSiglos, setSoloDocumentados, setTerritorialFilterMode, setTerritorios, setTerritoriosExpandidos, setTitulos, siglos, soloDocumentados, territorialFilterMode, territorios, territoriosExpandidos, titulos, toggle, visiblePeople} = vm;
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const territoryModes=en?TERRITORY_FILTER_MODES.map((option,index)=>({...option,label:['Associated','Ruling in the selected year'][index]})):TERRITORY_FILTER_MODES;
  return (
    <aside className="workspace-sidebar">
          <section className="panel workspace-fixed-panel workspace-filter-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>{tr('Filtros','Filters')}</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>
                {visiblePeople.length !== PERSONAS.length ? `${visiblePeople.length} / ${PERSONAS.length} ${tr('visibles','visible')}` : `${PERSONAS.length} ${tr('personas','people')}`}
              </span>
            </div>
            <div className={`filter-active-overview${filtrosActivosCompactos.length ? " has-active" : ""}`}>
              <span className="filter-active-overview-label">{tr('Filtros activos','Active filters')}</span>
              <span className="filter-active-overview-values">
                {filtrosCompactosVisibles.length ? filtrosCompactosVisibles.map(value=>en?englishLabel(value):value).join(" · ") : tr('Ninguno','None')}
                {filtrosCompactosRestantes > 0 ? ` · +${filtrosCompactosRestantes}` : ""}
              </span>
            </div>
            {filterCount > 0 && <button type="button" className="workspace-filter-clear" onClick={limpiarSoloFiltros}>
              {tr('Quitar','Remove')} {filterCount} {filterCount === 1 ? tr('filtro','filter') : tr('filtros','filters')}
            </button>}
            <div className="panel-body workspace-panel-scroll workspace-filter-scroll">
              <div className="atlas-scope"><strong>{vm.growth.ids===null?tr('Base completa','Complete database'):`${vm.growth.ids.length} ${tr('personas en tu selección','people in your selection')}`}</strong><span>{tr('Elige una persona y amplía su familia desde su ficha.','Choose a person and expand their family from the profile.')}</span><div>{!historiaActiva&&<>{vm.growth.ids!==null&&<button onClick={vm.growth.onFull}>{tr('Ver todas','View all')}</button>}<button onClick={vm.growth.onNew}>{tr('Nueva selección','New selection')}</button>{vm.growth.canUndo&&<button onClick={vm.growth.onUndo}>{tr('Deshacer','Undo')}</button>}</>}</div></div>
              <div className="filters-row filters-row-vertical filters-always-open">
                <FilterSection
                  title={tr('Territorios','Territories')}
                  open={filterSectionsOpen.territorios}
                  onToggle={() => alternarSeccionFiltro("territorios")}
                  activeCount={territorios.length}
                >
                  <SegmentedControl className="atlas-filter-mode" label={tr('Criterio del filtro territorial','Territory filter criterion')} value={territorialFilterMode} onChange={setTerritorialFilterMode} options={territoryModes}/>
                  {territorialFilterMode==='government'&&anioGlobal==null&&<p className="atlas-filter-explanation">{tr('Elige un año para ver solo quién gobernaba entonces.','Choose a year to see only who ruled then.')}</p>}
                  {groupByRegion(opciones.territorios, territoryRegion).map(({region, items}) => <div key={region} className="atlas-filter-region">
                    <h4 className="atlas-filter-heading">{en?englishLabel(region):region}<small>{items.length}</small></h4>
                    <div className="filter-group filter-group-dinastias">
                      {items.map((territorio) => <TerritoryFilterNode key={territorio}
                        name={territorio} options={opciones.subsPorTerritorio} selected={territorios}
                        expanded={territoriosExpandidos}
                        onToggleTerritory={(name) => toggle(setTerritorios, territorios, name)}
                        onToggleExpanded={(name) => toggle(setTerritoriosExpandidos, territoriosExpandidos, name)} locale={locale} />)}
                    </div>
                  </div>)}
                </FilterSection>

                <FilterSection
                  title={tr('Dinastías','Dynasties')}
                  open={filterSectionsOpen.dinastias}
                  onToggle={() => alternarSeccionFiltro("dinastias")}
                  activeCount={dinastias.length}
                >
                  {/* Las mismas regiones que en Territorios; las carpetas reúnen casas menores de cada región. */}
                  {groupByRegion([...opciones.dynastyFamilies, ...opciones.dynastyFolders], name => regionesDinasticas[name]).map(({region, items}) => <div key={region} className="atlas-filter-region">
                    <h4 className="atlas-filter-heading">{en?englishLabel(region):region}<small>{items.length}</small></h4>
                    <div className="filter-group filter-group-dinastias">{[...items.filter(n => !opciones.dynastyFolders.includes(n)), ...items.filter(n => opciones.dynastyFolders.includes(n))].map(name => <DynastyFilterNode key={name} name={name} options={opciones.ramasPorPrincipal} selected={dinastias} expanded={dinastiasExpandidas} onToggle={n=>toggle(setDinastias,dinastias,n)} onExpand={n=>toggle(setDinastiasExpandidas,dinastiasExpandidas,n)} folder={opciones.dynastyFolders.includes(name)} locale={locale}/>)}</div>
                  </div>)}
                </FilterSection>

                <FilterSection
                  title={tr('Función histórica','Historical role')}
                  open={filterSectionsOpen.titulos}
                  onToggle={() => alternarSeccionFiltro("titulos")}
                  activeCount={titulos.length}
                >
                  <div className="filter-group">
                    {opciones.titulos.map((categoria) => (
                      <Chip
                        key={categoria.id}
                        label={en?englishLabel(categoria.label):categoria.label}
                        active={titulos.includes(categoria.id)}
                        color="#8A6D3B"
                        onClick={() => toggle(setTitulos, titulos, categoria.id)}
                      />
                    ))}
                  </div>
                </FilterSection>

                <FilterSection
                  title={tr('Periodo vital','Lifetime period')}
                  open={filterSectionsOpen.siglos}
                  onToggle={() => alternarSeccionFiltro("siglos")}
                  activeCount={siglos.length}
                >
                  <div className="filter-group">
                    {opciones.siglos.map((valor) => (
                      <Chip key={valor} label={`${en?'c.':'s.'} ${nRomano[valor] || valor}`} active={siglos.includes(valor)} color="#3D4F63" onClick={() => toggle(setSiglos, siglos, valor)} />
                    ))}
                    {opciones.hayPersonasSinFecha && (
                      <Chip label={tr('Fechas incompletas','Incomplete dates')} active={siglos.includes(SIN_FECHA)} color="#6B6350" onClick={() => toggle(setSiglos, siglos, SIN_FECHA)} />
                    )}
                  </div>
                </FilterSection>

                <FilterSection
                  title={tr('Relaciones y familia','Relationships and family')}
                  open={filterSectionsOpen.relaciones}
                  onToggle={() => alternarSeccionFiltro("relaciones")}
                  activeCount={relaciones.length}
                >
                  <div className="filter-group filter-group-relaciones">
                    {opciones.relaciones.map((filtro) => (
                      <Chip
                        key={filtro.id}
                        label={en?englishLabel(filtro.label):filtro.label}
                        active={relaciones.includes(filtro.id)}
                        color={filtro.id === "amantes" ? "#8E3D68" : "#5E6673"}
                        onClick={() => toggle(setRelaciones, relaciones, filtro.id)}
                      />
                    ))}
                  </div>
                </FilterSection>
                <FilterSection
                  title={tr('Evidencia histórica','Historical evidence')}
                  open={filterSectionsOpen.evidencia}
                  onToggle={() => alternarSeccionFiltro("evidencia")}
                  activeCount={soloDocumentados ? 1 : 0}
                >
                  <label className="evidence-filter-toggle">
                    <input type="checkbox" checked={soloDocumentados} onChange={event => setSoloDocumentados(event.target.checked)} />
                    <span>{tr('Con al menos un dato documentado','With at least one documented fact')}</span>
                  </label>
                  <p className="evidence-filter-hint">{tr('La revisión es aún parcial. Cada persona visible tiene al menos una afirmación contrastada con una fuente concreta; otros datos de su ficha pueden seguir pendientes.','The review is still partial. Every visible person has at least one claim checked against a specific source; other profile data may still be pending.')}</p>
                </FilterSection>
              </div>

            </div>
          </section>
        </aside>
  );
}
