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
import {englishLabel,englishProfileFor} from '../../english/v6/atlasPresentation.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../../english/profilePortraits.js';
import {translatedEquivalent} from '../../english/routes.js';

const bioOptions = en => ['resumen','familia','coronas','historias','fuentes'].map((value,index)=>({value,label:(en?['Summary','Family','Crowns','Stories','Sources']:['Resumen','Familia','Coronas','Historias','Fuentes'])[index],controls:`bio-section-${value}`}));

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

function VenetianOfficeSequence({ persona, onSelect, locale='es' }) {
  const en=locale==='en';
  const index = DOGES_IN_ORDER.findIndex(item => item.persona.id === persona.id);
  if (index < 0) return null;
  const current = DOGES_IN_ORDER[index];
  return (
    <div className="bio-office-sequence" aria-label={en?'Documented succession of the Venetian doges':'Sucesión documentada del dogado veneciano'}>
      <strong>{en?'Doge of Venice':'Dogado de Venecia'}</strong>
      <p>{en?'An elective office of the Republic; it was not inherited and did not turn its territories into family property.':'Magistratura electiva de la República; el cargo no se heredaba ni convertía sus territorios en patrimonio familiar.'}</p>
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
  const {actualizarAnioDesdeRango, alternarFavorito, alternarSeccionBio, anioGlobal, bioSectionsOpen, cerrarSeleccion, favoritosSet, historiaActiva, hovered, iniciarHistoria, locale, navegarHistorialPersona, personHistory, personaBio, seleccion, seleccionarPersonaPorId, setCompareMenuOpen, setFocoAlcance, setFocoId, setInfoProyecto, setMode} = vm;
  const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value;
  const portrait=personaBio ? (en ? {...IMAGENES_PERSONAS[personaBio.id],...ENGLISH_PROFILE_PORTRAITS[personaBio.id]} : IMAGENES_PERSONAS[personaBio.id]) : null;
  const biographySummary=personaBio ? (en ? englishProfileFor(personaBio.id)?.summary || resumenCortoPersona(personaBio) : resumenCortoPersona(personaBio)) : '';
  return (
    <aside className={`workspace-inspector${personaBio ? ' has-person' : ''}${bioMobileOpen ? ' mobile-open' : ' mobile-collapsed'}`}>
          {personaBio && <button type="button" className="bio-mobile-toggle" aria-expanded={bioMobileOpen} aria-controls="atlas-biography-panel" onClick={()=>setBioMobileOpen(open=>!open)}>{bioMobileOpen ? tr('Ocultar ficha','Hide profile') : `${tr('Ver ficha de','View profile of')} ${personaBio.nombre}`} <ChevronDown size={15}/></button>}
          <section id="atlas-biography-panel" className="panel workspace-fixed-panel workspace-bio-panel">
            <div className="panel-head panel-head-static">
              <span className="panel-title sk" style={{"--sk-index":3}}>{tr('Biografía','Biography')}</span>
              <span className="panel-count sk" style={{"--sk-index":4}}>{personaBio ? tr('1 personaje','1 person') : tr('ninguno','none')}</span>
            </div>
            {personaBio && <nav className="bio-tabs" aria-label={`${tr('Apartados de','Sections for')} ${personaBio.nombre}`}>
              <SegmentedControl current="location" label={tr('Apartados de la biografía','Biography sections')} options={bioOptions(en)} value={bioSection} onChange={scrollToBioSection}/>
            </nav>}
            <div className="panel-body workspace-panel-scroll workspace-bio-scroll" ref={bioScrollRef} onScroll={updateBioSectionOnScroll}>
              {personaBio ? (
                <div className="bio-panel">
                  {seleccion && personHistory.ids.length > 0 && (
                    <div className="bio-history-nav" aria-label={tr('Historial de personas consultadas','Viewed people history')}>
                      <button
                        type="button"
                        disabled={!personaAnteriorId}
                        onClick={() => navegarHistorialPersona(-1)}
                        title={personaAnteriorId ? `${tr('Volver a','Back to')} ${BY_ID[personaAnteriorId]?.nombre || tr('la persona anterior','the previous person')}` : tr('No hay una persona anterior','There is no previous person')}
                        aria-label={tr('Persona anterior','Previous person')}
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
                        title={personaSiguienteId ? `${tr('Avanzar a','Forward to')} ${BY_ID[personaSiguienteId]?.nombre || tr('la persona siguiente','the next person')}` : tr('No hay una persona siguiente','There is no next person')}
                        aria-label={tr('Persona siguiente','Next person')}
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
                        {term(personaBio.dinastia)}
                      </span>
                    </div>
                    <div className="bio-head-actions">
                      <FavoriteStar className="bio-favorite-btn" active={favoritosSet.has(personaBio.id)} onToggle={() => alternarFavorito(personaBio.id)} name={personaBio.nombre}/>
                      {!hovered && seleccion && (
                        <button type="button" className="close" aria-label={tr('Cerrar biografía','Close biography')} onClick={cerrarSeleccion}><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  <section id="bio-section-resumen" data-bio-section="resumen" className="bio-scroll-section" aria-labelledby="bio-heading-resumen" tabIndex={-1}>
                    <h4 id="bio-heading-resumen" className="bio-section-heading">{tr('Resumen','Summary')}</h4>

                  {portrait && (() => {
                    const imagen = portrait;
                    const objectPosition = imagen.encuadre || imagen.posicion || "50% 20%";
                    const zoom = Number.isFinite(imagen.zoom) && imagen.zoom > 0 ? imagen.zoom : 1;
                    return (
                      <figure className="bio-portrait-card">
                        <div className="bio-portrait-frame">
                          <img
                            className="bio-portrait-image"
                            {...responsiveImage(imagen.archivo, "300px")}
                            alt={imagen.alt || `${tr('Retrato de','Portrait of')} ${personaBio.nombre}`}
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
                                <a href={imagen.fuenteUrl} target="_blank" rel="noreferrer">{tr('Fuente','Source')}</a>
                              </>
                            )}
                            {imagen.derechosUrl && (
                              <>
                                {" · "}
                                <a href={imagen.derechosUrl} target="_blank" rel="noreferrer">{tr('Derechos','Rights')}</a>
                              </>
                            )}
                          </span>
                        </figcaption>
                      </figure>
                    );
                  })()}

                  {biographySummary && <p className="bio-texto">{biographySummary}</p>}
                  <a
                    className="bio-full-profile-link"
                    href={rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(personaBio, locale))}
                    title={`${tr('Abrir la ficha pública completa de','Open the complete public profile of')} ${personaBio.nombre}`}
                  >
                    {tr('Leer ficha completa','Read full profile')} <ExternalLink size={11} />
                  </a>

                  {isNamedDynasty(personaBio.dinastia) && <a className="bio-full-profile-link" href={en?(translatedEquivalent(`/es/dinastia/${slugPublico(personaBio.dinastia)}`,'en')||`/es/dinastia/${slugPublico(personaBio.dinastia)}`):rutaEntidadLocalizada('es','dinastia',slugPublico(personaBio.dinastia))}>{tr('Explorar la casa de','Explore House')} {term(personaBio.dinastia)} <ExternalLink size={11}/></a>}
                  </section>

                  <section id="bio-section-familia" data-bio-section="familia" className="bio-scroll-section" aria-labelledby="bio-heading-familia" tabIndex={-1}>
                    <h4 id="bio-heading-familia" className="bio-section-heading">{tr('Familia','Family')}</h4>
                  {seleccion?.id === personaBio.id && !historiaActiva && (
                    <div className="bio-family-actions" aria-label={tr('Ampliar la familia en el árbol','Expand the family in the tree')}>
                      {vm.growth.ids !== null && (vm.growth.additions.family.length > 0 || vm.growth.additions.ancestors.length > 0 || vm.growth.additions.descendants.length > 0) && (
                        <>
                          <span>{tr('Ampliar ramas de','Expand branches of')} {personaBio.nombre}</span>
                          <div>
                            {vm.growth.additions.family.length > 0 && <button type="button" className="family-add-button" onClick={() => vm.growth.onExpand('family')}>{tr('Familia cercana','Close family')} <small>+{vm.growth.additions.family.length}</small></button>}
                            {vm.growth.additions.ancestors.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('ancestors')}>{tr('Antepasados','Ancestors')} <small>+{vm.growth.additions.ancestors.length}</small></button>}
                            {vm.growth.additions.descendants.length > 0 && <button type="button" onClick={() => vm.growth.onExpand('descendants')}>{tr('Descendientes','Descendants')} <small>+{vm.growth.additions.descendants.length}</small></button>}
                          </div>
                        </>
                      )}
                      <button type="button" className="bio-focus-link" onClick={() => { setFocoId(personaBio.id); setFocoAlcance('cercana'); setMode('foco'); setCompareMenuOpen(false); }}>{tr('Ver solo esta rama','Show only this branch')}</button>
                    </div>
                  )}

                  <BioSection
                    title={tr('Relaciones documentadas','Documented relationships')}
                    open={bioSectionsOpen.relaciones}
                    onToggle={() => alternarSeccionBio("relaciones")}
                  >
                    <div className="bio-relations bio-relations-collapsible">
                      <BioRelations etiqueta={tr('Padre','Father')} ids={personaBio.padre ? [personaBio.padre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(BY_ID[id], locale))} onSelect={seleccionarPersonaPorId} locale={locale} />
                      <BioRelations etiqueta={tr('Madre','Mother')} ids={personaBio.madre ? [personaBio.madre] : []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(BY_ID[id], locale))} onSelect={seleccionarPersonaPorId} locale={locale} />
                      <BioRelations etiqueta={listaConyuges(personaBio).length > 1 ? tr('Cónyuges','Spouses') : tr('Cónyuge','Spouse')} ids={listaConyuges(personaBio)} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(BY_ID[id], locale))} onSelect={seleccionarPersonaPorId} locale={locale} />
                      <BioRelations etiqueta={listaAmantes(personaBio).length > 1 ? tr('Amantes','Lovers') : tr('Amante','Lover')} ids={listaAmantes(personaBio)} tipo="amantes" byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(BY_ID[id], locale))} onSelect={seleccionarPersonaPorId} locale={locale} />
                      <BioRelations etiqueta={tr('Hijos/as','Children')} ids={HIJOS_POR_ID[personaBio.id] || []} byId={BY_ID} hrefForId={(id) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(BY_ID[id], locale))} onSelect={seleccionarPersonaPorId} locale={locale} />
                      {!personaBio.padre && !personaBio.madre && !listaConyuges(personaBio).length && !listaAmantes(personaBio).length && !(HIJOS_POR_ID[personaBio.id] || []).length && (
                        <div className="bio-relations-empty">{tr('No hay relaciones cargadas para esta persona.','No relationships are recorded for this person.')}</div>
                      )}
                    </div>
                  </BioSection>
                  </section>

                  <section id="bio-section-coronas" data-bio-section="coronas" className="bio-scroll-section" aria-labelledby="bio-heading-coronas" tabIndex={-1}>
                    <h4 id="bio-heading-coronas" className="bio-section-heading">{tr('Coronas','Crowns')}</h4>
                  <VenetianOfficeSequence persona={personaBio} onSelect={seleccionarPersonaPorId} locale={locale}/>
                  <React.Suspense fallback={null}><AtlasCrowns key={personaBio.id} persona={personaBio} anio={anioGlobal} onYearChange={actualizarAnioDesdeRango} locale={locale}/></React.Suspense>
                  <BioSection
                    title={tr('Datos y reinados','Data and reigns')}
                    open={bioSectionsOpen.datos}
                    onToggle={() => alternarSeccionBio("datos")}
                  >
                    <dl>
                      <dt>ID</dt><dd><code className="bio-id">{personaBio.id}</code></dd>
                      <dt>{tr('Territorio(s)','Territory or territories')}</dt><dd>{(governmentSummary(personaBio, anioGlobal).length ? governmentSummary(personaBio, anioGlobal) : territoriosDe(personaBio)).map(term).join(", ") || tr('No indicado','Not specified')}</dd>
                      {sobrenombreDePersona(personaBio) && <><dt>{tr('Sobrenombre','Nickname')}</dt><dd>{sobrenombreDePersona(personaBio)}</dd></>}
                      {!!personaBio.aliases?.length && <><dt>{tr('Otros nombres','Other names')}</dt><dd>{personaBio.aliases.join(", ")}</dd></>}
                      <dt>{tr('Título','Title')}</dt><dd>{term(personaBio.titulo)}</dd>
                      <dt>{tr('Fechas','Dates')}</dt>
                      <dd>
                        {formatoFechas(personaBio)}
                        {siglosDePersona(personaBio).length > 0 && ` (s. ${siglosDePersona(personaBio).map((valor) => nRomano[valor] || valor).join("–")})`}
                      </dd>
                      {listaReinados(personaBio).map((reinado, index) => {
                        const tipo = etiquetaTipoReinado(reinado.condicion);
                        return (
                          <React.Fragment key={`${reinado.territorio}-${reinado.desde}-${reinado.hasta}-${index}`}>
                            <dt>{term(reinado.titulo)} · {term(reinado.territorio)} · {term(etiquetaClaseGobierno(personaBio, reinado))}</dt>
                            <dd>{reinado.desde} – {reinado.hasta}{tipo ? ` (${term(tipo)})` : ""}</dd>
                          </React.Fragment>
                        );
                      })}
                    </dl>
                  </BioSection>
                  </section>

                  <section id="bio-section-historias" data-bio-section="historias" className="bio-scroll-section" aria-labelledby="bio-heading-historias" tabIndex={-1}>
                    <h4 id="bio-heading-historias" className="bio-section-heading">{tr('Historias','Stories')}</h4>
                    <BioDiscovery
                      persona={personaBio}
                      personas={PERSONAS}
                      hijosPorId={HIJOS_POR_ID}
                      historias={HISTORIAS}
                      getSpouses={listaConyuges}
                      getLovers={listaAmantes}
                      getReigns={listaReinados}
                      normalizeText={normalizaTexto}
                      hrefPersona={(persona) => rutaEntidadLocalizada(locale, "persona", slugPersonaPorLocale(persona, locale))}
                      hrefHistoria={(historia) => en?(translatedEquivalent(`/es/historia/${slugPublico(historia.titulo)}`,'en')||`/es/historia/${slugPublico(historia.titulo)}`):rutaEntidadLocalizada('es', "historia", slugPublico(historia.titulo))}
                      onSelect={seleccionarPersonaPorId}
                      onStartHistoria={iniciarHistoria}
                      locale={locale}
                    />
                    <a className="bio-full-profile-link" href={en?'/en/stories':'/es/historias'}>{tr('Ver todas las historias','View all stories')} <ExternalLink size={11}/></a>
                  </section>

                  <section id="bio-section-fuentes" data-bio-section="fuentes" className="bio-scroll-section bio-source-tab" aria-labelledby="bio-heading-fuentes" tabIndex={-1}>
                    <h4 id="bio-heading-fuentes" className="bio-section-heading">{tr('Fuentes','Sources')}</h4>
                    <DocumentationNotes persona={personaBio} locale={locale}/>
                    <EvidencePanel person={personaBio} personNameById={id=>BY_ID[id]?.nombre} compact locale={locale}/>
                    <p>{tr('Las fechas y relaciones incompletas se indican en la ficha. Consulta el método y la bibliografía general para interpretar los datos.','Incomplete dates and relationships are identified in the profile. Consult the methodology and general bibliography when interpreting the data.')}</p>
                    <a className="bio-full-profile-link" href={en?'/en/methodology':'/es/fuentes'}>{tr('Fuentes y metodología','Sources and methodology')} <ExternalLink size={11}/></a>
                    <button type="button" onClick={()=>setInfoProyecto('reportar')}>{tr('Sugerir una corrección documentada','Suggest a documented correction')}</button>
                  </section>

                  {hovered && seleccion && hovered !== seleccion.id && (
                    <div className="bio-hint">{tr('Vista previa de','Preview of')} {personaBio.nombre} — {tr('al quitar el ratón volverás a ver a','move the pointer away to return to')} {seleccion.nombre}.</div>
                  )}
                </div>
              ) : (
                <div className="bio-empty">{tr('Pasa el ratón por encima de un personaje, o haz clic para dejarlo fijo, y su biografía aparecerá aquí.','Hover over a person, or select them to keep the profile open, and their biography will appear here.')}</div>
              )}
            </div>
          </section>
        </aside>
  );
}
