import {isNamedDynasty} from '../../../data/dynastyNames.js';
import {governmentSummary} from '../../../domain/government/governmentPresentation.js';
import {gobiernosDe, territoriosDe} from '../../../domain/genealogy/personAccessors.js';
import DocumentationNotes from '../../../components/DocumentationNotes.jsx';
import {responsiveImage} from '../../../utils/responsiveImage.js';
import React from 'react';
import {ChevronDown, ChevronRight, ArrowLeft, ArrowRight, X, ExternalLink} from 'lucide-react';
import {listaReinados} from '../../../domain/government/reigns.js';
import {PERSONAS} from '../../../data/personas.js';
import {IMAGENES_PERSONAS} from '../../../data/imagenesPersonas.js';
import {HISTORIAS} from '../../../data/historias.js';
import BioRelations from '../BioRelations.jsx';
import BioDiscovery from '../BioDiscovery.jsx';
import FavoriteStar from '../../../ui/FavoriteStar.jsx';
import {resumenCortoPersona, etiquetaClaseGobierno} from '../../../domain/people/personPresentation.js';
import {ACCENTS, etiquetaTipoReinado, normalizaTexto} from '../atlasModel.js';
import {getCategoriaDinastía} from '../../../domain/genealogy/dynasties.js';
import {BY_ID, listaConyuges, listaAmantes, HIJOS_POR_ID, siglosDePersona} from '../../../domain/genealogy/relations.js';
import {rutaEntidadLocalizada, slugPersonaPorLocale} from '../atlasRoutes.js';
import {slugPublico} from '../../../domain/people/personLabels.js';
import {nombrePrincipal, sobrenombreDePersona, formatoFechas, nRomano} from '../timelineUtils.js';
import EvidencePanel from '../../../components/EvidencePanel.jsx';
import SegmentedControl from '../../../ui/SegmentedControl.jsx';

const BIO_OPTIONS = ['resumen','familia','coronas','historias','fuentes'].map((value,index)=>({value,label:['Resumen','Familia','Coronas','Historias','Fuentes'][index],controls:`bio-section-${value}`}));

const AtlasCrowns = React.lazy(() => import('../AtlasCrowns.jsx'));

function BioSection({ title, open, onToggle, children }) {
  return (
    <section className={`bio-collapsible${open ? " is-open" : " is-collapsed"}`}>
      <button type="button" className="bio-collapsible-toggle" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && <div className="bio-collapsible-content">{children}</div>}
    </section>
  );
}

const DOGES_IN_ORDER = PERSONAS.flatMap(persona => gobiernosDe(persona)
  .filter(gobierno => gobierno.territorio === 'Venecia' && gobierno.titulo === 'Dogo' && gobierno.condicion === 'efectivo')
  .map(gobierno => ({ persona, gobierno })))
  .sort((a, b) => a.gobierno.desde - b.gobierno.desde || a.gobierno.hasta - b.gobierno.hasta);

function VenetianOfficeSequence({ persona, onSelect }) {
  const index = DOGES_IN_ORDER.findIndex(item => item.persona.id === persona.id);
  if (index < 0) return null;
  const current = DOGES_IN_ORDER[index];
  return (
    <div className="bio-office-sequence" aria-label="Sucesión documentada del dogado veneciano">
      <strong>Dogado de Venecia</strong>
      <p>Magistratura electiva de la República; el cargo no se heredaba ni convertía sus territorios en patrimonio familiar.</p>
      <div className="bio-office-sequence-links">
        {index > 0 && <button type="button" onClick={() => onSelect(DOGES_IN_ORDER[index - 1].persona.id)}>← {DOGES_IN_ORDER[index - 1].persona.nombre}</button>}
        <span>{current.gobierno.desde}–{current.gobierno.hasta}</span>
        {index < DOGES_IN_ORDER.length - 1 && <button type="button" onClick={() => onSelect(DOGES_IN_ORDER[index + 1].persona.id)}>{DOGES_IN_ORDER[index + 1].persona.nombre} →</button>}
      </div>
    </div>
  );
}

// Inspector biográfico de la persona seleccionada.
export default function AtlasBiographyPanel({vm, bioMobileOpen, bioScrollRef, bioSection, personaAnteriorId, personaSiguienteId, scrollToBioSection, setBioMobileOpen, updateBioSectionOnScroll}) {
  const {actualizarAnioDesdeRango, alternarFavorito, alternarSeccionBio, anioGlobal, bioSectionsOpen, cerrarSeleccion, favoritosSet, historiaActiva, hovered, iniciarHistoria, navegarHistorialPersona, personHistory, personaBio, seleccion, seleccionarPersonaPorId, setCompareMenuOpen, setFocoAlcance, setFocoId, setInfoProyecto, setMode} = vm;
  return (
    <aside className={`workspace-inspector${personaBio ? ' has-person' : ''}${bioMobileOpen ? ' mobile-open' : ' mobile-collapsed'}`}>
          {personaBio && <button type="button" className="bio-mobile-toggle" aria-expanded={bioMobileOpen} aria-controls="atlas-biography-panel" onClick={()=>setBioMobileOpen(open=>!open)}>{bioMobileOpen ? 'Ocultar ficha' : `Ver ficha de ${personaBio.nombre}`} <ChevronDown size={15}/></button>}
          <section id="atlas-biography-panel" className="panel workspace-fixed-panel workspace-bio-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>Biografía</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>{personaBio ? "1 personaje" : "ninguno"}</span>
            </div>
            {personaBio && <nav className="bio-tabs" aria-label={`Apartados de ${personaBio.nombre}`}>
              <SegmentedControl current="location" label="Apartados de la biografía" options={BIO_OPTIONS} value={bioSection} onChange={scrollToBioSection}/>
            </nav>}
            <div className="panel-body workspace-panel-scroll workspace-bio-scroll" ref={bioScrollRef} onScroll={updateBioSectionOnScroll}>
              {personaBio ? (
                <div className="bio-panel">
                  {seleccion && personHistory.ids.length > 0 && (
                    <div className="bio-history-nav" aria-label="Historial de personas consultadas">
                      <button
                        type="button"
                        disabled={!personaAnteriorId}
                        onClick={() => navegarHistorialPersona(-1)}
                        title={personaAnteriorId ? `Volver a ${BY_ID[personaAnteriorId]?.nombre || "la persona anterior"}` : "No hay una persona anterior"}
                        aria-label="Persona anterior"
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <span className="bio-history-position">
                        {personHistory.index >= 0 ? `${personHistory.index + 1} / ${personHistory.ids.length}` : "—"}
                      </span>
                      <button
                        type="button"
                        disabled={!personaSiguienteId}
                        onClick={() => navegarHistorialPersona(1)}
                        title={personaSiguienteId ? `Avanzar a ${BY_ID[personaSiguienteId]?.nombre || "la persona siguiente"}` : "No hay una persona siguiente"}
                        aria-label="Persona siguiente"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                  <div className="bio-head">
                    <div>
                      <h3 className="bio-nombre sk" style={{"--sk-index":2}}>{nombrePrincipal(personaBio)}</h3>
                      {sobrenombreDePersona(personaBio) && <div className="bio-sobrenombre">«{sobrenombreDePersona(personaBio)}»</div>}
                      <span
                        className="badge"
                        style={{ background: ACCENTS[personaBio.dinastia] || ACCENTS[getCategoriaDinastía(personaBio.dinastia)] || "#71717A" }}
                      >
                        {personaBio.dinastia}
                      </span>
                    </div>
                    <div className="bio-head-actions">
                      <FavoriteStar className="bio-favorite-btn" active={favoritosSet.has(personaBio.id)} onToggle={() => alternarFavorito(personaBio.id)} name={personaBio.nombre}/>
                      {!hovered && seleccion && (
                        <button type="button" className="close" aria-label="Cerrar biografía" onClick={cerrarSeleccion}><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  <section id="bio-section-resumen" data-bio-section="resumen" className="bio-scroll-section" aria-labelledby="bio-heading-resumen" tabIndex={-1}>
                    <h4 id="bio-heading-resumen" className="bio-section-heading">Resumen</h4>

                  {IMAGENES_PERSONAS[personaBio.id] && (() => {
                    const imagen = IMAGENES_PERSONAS[personaBio.id];
                    const objectPosition = imagen.encuadre || imagen.posicion || "50% 20%";
                    const zoom = Number.isFinite(imagen.zoom) && imagen.zoom > 0 ? imagen.zoom : 1;
                    return (
                      <figure className="bio-portrait-card">
                        <div className="bio-portrait-frame">
                          <img
                            className="bio-portrait-image"
                            {...responsiveImage(imagen.archivo, "300px")}
                            alt={imagen.alt || `Retrato de ${personaBio.nombre}`}
                            loading="lazy"
                            decoding="async"
                            style={{
                              objectPosition,
                              transform: `scale(${zoom})`,
                              transformOrigin: objectPosition,
                            }}
                          />
                        </div>
                        <figcaption className="bio-portrait-caption">
                          <strong>{imagen.tipo}</strong>
                          <span>{imagen.obra}</span>
                          <span>{imagen.autor}{imagen.fecha ? ` · ${imagen.fecha}` : ""}</span>
                          {imagen.institucion && <span>{imagen.institucion}</span>}
                          <span className="bio-portrait-rights">
                            {imagen.derechos}
                            {imagen.fuenteUrl && (
                              <>
                                {" · "}
                                <a href={imagen.fuenteUrl} target="_blank" rel="noreferrer">Fuente</a>
                              </>
                            )}
                            {imagen.derechosUrl && (
                              <>
                                {" · "}
                                <a href={imagen.derechosUrl} target="_blank" rel="noreferrer">Derechos</a>
                              </>
                            )}
                          </span>
                        </figcaption>
                      </figure>
                    );
                  })()}

                  {resumenCortoPersona(personaBio) && <p className="bio-texto">{resumenCortoPersona(personaBio)}</p>}
                  <a
                    className="bio-full-profile-link"
                    href={rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(personaBio, "es"))}
                    title={`Abrir la ficha pública completa de ${personaBio.nombre}`}
                  >
                    Leer ficha completa <ExternalLink size={11} />
                  </a>

                  {isNamedDynasty(personaBio.dinastia) && <a className="bio-full-profile-link" href={`/es/dinastia/${slugPublico(personaBio.dinastia)}`}>Explorar la casa de {personaBio.dinastia} <ExternalLink size={11}/></a>}
                  </section>

                  <section id="bio-section-familia" data-bio-section="familia" className="bio-scroll-section" aria-labelledby="bio-heading-familia" tabIndex={-1}>
                    <h4 id="bio-heading-familia" className="bio-section-heading">Familia</h4>
                  {seleccion?.id === personaBio.id && !historiaActiva && (
                    <div className="bio-family-actions" aria-label="Ampliar la familia en el árbol">
                      {vm.growth.ids !== null && (vm.growth.additions.family.length > 0 || vm.growth.additions.ancestors.length > 0 || vm.growth.additions.descendants.length > 0) && (
                        <>
                          <span>Ampliar ramas de {personaBio.nombre}</span>
                          <div>
                            {vm.growth.additions.family.length > 0 && <button type="button" className="family-add-button" onClick={() => vm.growth.onExpand('family')}>Familia cercana <small>+{vm.growth.additions.family.length}</small></button>}
                            {vm.growth.additions.ancestors.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('ancestors')}>Antepasados <small>+{vm.growth.additions.ancestors.length}</small></button>}
                            {vm.growth.additions.descendants.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('descendants')}>Descendientes <small>+{vm.growth.additions.descendants.length}</small></button>}
                          </div>
                        </>
                      )}
                      <button type="button" className="bio-focus-link" onClick={() => { setFocoId(personaBio.id); setFocoAlcance('cercana'); setMode('foco'); setCompareMenuOpen(false); }}>Ver solo esta rama</button>
                    </div>
                  )}

                  <BioSection
                    title="Relaciones documentadas"
                    open={bioSectionsOpen.relaciones}
                    onToggle={() => alternarSeccionBio("relaciones")}
                  >
                    <div className="bio-relations bio-relations-collapsible">
                      <BioRelations etiqueta="Padre" ids={personaBio.padre ? [personaBio.padre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta="Madre" ids={personaBio.madre ? [personaBio.madre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta={listaConyuges(personaBio).length > 1 ? "Cónyuges" : "Cónyuge"} ids={listaConyuges(personaBio)} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta={listaAmantes(personaBio).length > 1 ? "Amantes" : "Amante"} ids={listaAmantes(personaBio)} tipo="amantes" byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      <BioRelations etiqueta="Hijos/as" ids={HIJOS_POR_ID[personaBio.id] || []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(BY_ID[id], "es"))} onSelect={seleccionarPersonaPorId} />
                      {!personaBio.padre && !personaBio.madre && !listaConyuges(personaBio).length && !listaAmantes(personaBio).length && !(HIJOS_POR_ID[personaBio.id] || []).length && (
                        <div className="bio-relations-empty">No hay relaciones cargadas para esta persona.</div>
                      )}
                    </div>
                  </BioSection>
                  </section>

                  <section id="bio-section-coronas" data-bio-section="coronas" className="bio-scroll-section" aria-labelledby="bio-heading-coronas" tabIndex={-1}>
                    <h4 id="bio-heading-coronas" className="bio-section-heading">Coronas</h4>
                  <VenetianOfficeSequence persona={personaBio} onSelect={seleccionarPersonaPorId}/>
                  <React.Suspense fallback={null}><AtlasCrowns key={personaBio.id} persona={personaBio} anio={anioGlobal} onYearChange={actualizarAnioDesdeRango}/></React.Suspense>
                  <BioSection
                    title="Datos y reinados"
                    open={bioSectionsOpen.datos}
                    onToggle={() => alternarSeccionBio("datos")}
                  >
                    <dl>
                      <dt>ID</dt><dd><code className="bio-id">{personaBio.id}</code></dd>
                      <dt>Territorio(s)</dt><dd>{(governmentSummary(personaBio, anioGlobal).length ? governmentSummary(personaBio, anioGlobal) : territoriosDe(personaBio)).join(", ") || "No indicado"}</dd>
                      {sobrenombreDePersona(personaBio) && <><dt>Sobrenombre</dt><dd>{sobrenombreDePersona(personaBio)}</dd></>}
                      {!!personaBio.aliases?.length && <><dt>Otros nombres</dt><dd>{personaBio.aliases.join(", ")}</dd></>}
                      <dt>Título</dt><dd>{personaBio.titulo}</dd>
                      <dt>Fechas</dt>
                      <dd>
                        {formatoFechas(personaBio)}
                        {siglosDePersona(personaBio).length > 0 && ` (s. ${siglosDePersona(personaBio).map((valor) => nRomano[valor] || valor).join("–")})`}
                      </dd>
                      {listaReinados(personaBio).map((reinado, index) => {
                        const tipo = etiquetaTipoReinado(reinado.condicion);
                        return (
                          <React.Fragment key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`}>
                            <dt>{reinado.titulo} · {reinado.territorio} · {etiquetaClaseGobierno(personaBio, reinado)}</dt>
                            <dd>{reinado.desde} – {reinado.hasta}{tipo ? ` (${tipo})` : ""}</dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </BioSection>
                  </section>

                  <section id="bio-section-historias" data-bio-section="historias" className="bio-scroll-section" aria-labelledby="bio-heading-historias" tabIndex={-1}>
                    <h4 id="bio-heading-historias" className="bio-section-heading">Historias</h4>
                    <BioDiscovery
                      persona={personaBio}
                      personas={PERSONAS}
                      hijosPorId={HIJOS_POR_ID}
                      historias={HISTORIAS}
                      getSpouses={listaConyuges}
                      getLovers={listaAmantes}
                      getReigns={listaReinados}
                      normalizeText={normalizaTexto}
                      hrefPersona={(persona) => rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(persona, "es"))}
                      hrefHistoria={(historia) => rutaEntidadLocalizada("es", "historia", slugPublico(historia.titulo))}
                      onSelect={seleccionarPersonaPorId}
                      onStartHistoria={iniciarHistoria}
                    />
                    <a className="bio-full-profile-link" href="/es/historias">Ver todas las historias <ExternalLink size={11}/></a>
                  </section>

                  <section id="bio-section-fuentes" data-bio-section="fuentes" className="bio-scroll-section bio-source-tab" aria-labelledby="bio-heading-fuentes" tabIndex={-1}>
                    <h4 id="bio-heading-fuentes" className="bio-section-heading">Fuentes</h4>
                    <DocumentationNotes persona={personaBio}/>
                    <EvidencePanel person={personaBio} personNameById={id=>BY_ID[id]?.nombre} compact />
                    <p>Las fechas y relaciones incompletas se indican en la ficha. Consulta el método y la bibliografía general para interpretar los datos.</p>
                    <a className="bio-full-profile-link" href="/es/fuentes">Fuentes y metodología <ExternalLink size={11}/></a>
                    <button type="button" onClick={()=>setInfoProyecto('reportar')}>Sugerir una corrección documentada</button>
                  </section>

                  {hovered && seleccion && hovered !== seleccion.id && (
                    <div className="bio-hint">Vista previa de {personaBio.nombre} — al quitar el ratón volverás a ver a {seleccion.nombre}.</div>
                  )}
                </div>
              ) : (
                <div className="bio-empty">Pasa el ratón por encima de un personaje, o haz clic para dejarlo fijo, y su biografía aparecerá aquí.</div>
              )}
            </div>
          </section>
        </aside>
  );
}
