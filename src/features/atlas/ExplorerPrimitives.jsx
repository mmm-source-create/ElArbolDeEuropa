import StoryCollectionTags from '../stories/StoryCollectionTags.jsx';
import {governmentSummary} from '../../domain/government/governmentPresentation.js';
import {territoriosDe} from '../../domain/genealogy/personAccessors.js';
import { SOURCE_GROUPS, SOURCE_METHOD } from "../../content/sources.js";
import React, { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, ExternalLink, Flag, Heart, Mail, Scale, X } from "lucide-react";
import { PERSONAS } from "../../data/personas.js";
import { HISTORIAS } from "../../data/historias.js";
import StoryCollectionBrowser from "../stories/StoryCollectionBrowser.jsx";
import { listaReinados, reinadoEsEfectivo } from "../../domain/government/reigns.js";
import { CORRECTORES, CORREOS_CORRECCIONES } from "./atlasModel.js";
import { HIJOS_POR_ID, listaAmantes, listaConyuges } from "../../domain/genealogy/relations.js";
import { rutaEntidadLocalizada } from "./atlasRoutes.js";
import { slugPublico } from "../../domain/people/personLabels.js";
import {englishLabel} from '../english/v6/atlasPresentation.js';
import {ENGLISH_STORIES} from '../english/storyContent.js';
import englishStoriesRuntime from '../../generated/englishStoriesRuntime.json' with {type:'json'};

export function Chip({ label, active, onClick, color, small = false }) {
  const red = parseInt(color?.slice(1, 3) || '5c', 16);
  const green = parseInt(color?.slice(3, 5) || '53', 16);
  const blue = parseInt(color?.slice(5, 7) || '46', 16);
  const lightInk = (0.2126 * red + 0.7152 * green + 0.0722 * blue) < 150;
  return (
    <button type="button" onClick={onClick} className={`chip${small ? " chip-sm" : ""}`}
      style={{ borderColor: color, background: active ? color : "transparent", color: active ? (lightInk ? "#fff9ee" : "#25211d") : "var(--eade-ink, #3A342A)" }}>
      <span className="sk" style={{"--sk-index":4}}>{label}</span>
    </button>
  );
}

export const PersonBox = React.memo(function PersonBox({
  p, cls, accent, style, setRef, onEnter, onLeave, onClick,
  hasDescendants = false, descendantsCollapsed = false, onToggleDescendants, showDates = false, year = null, locale = 'es',
}) {
  const en = locale === 'en';
  const term = value => en ? englishLabel(value) : value;
  const groups=governmentSummary(p,year);
  const roleText = `${term(p.titulo)} · ${(groups.length ? groups : territoriosDe(p)).map(term).join(" · ")}`;
  const navigateCard = (event) => {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key];
    if (!direction) return;
    const root = event.currentTarget.closest('.tree-scroll');
    if (!root) return;
    const current = event.currentTarget.getBoundingClientRect();
    const cx = current.left + current.width / 2;
    const cy = current.top + current.height / 2;
    const candidates = [...root.querySelectorAll('.box-main')].filter(card => card !== event.currentTarget).map(card => {
      const rect = card.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - cx;
      const dy = rect.top + rect.height / 2 - cy;
      const along = dx * direction[0] + dy * direction[1];
      const across = Math.abs(dx * direction[1] - dy * direction[0]);
      return { card, along, score: along + across * 2 };
    }).filter(candidate => candidate.along > 3).sort((a, b) => a.score - b.score);
    if (!candidates.length) return;
    event.preventDefault();
    event.stopPropagation();
    candidates[0].card.focus();
    candidates[0].card.click();
  };
  return (
    <div ref={setRef} className={`${cls}${hasDescendants ? " has-descendants" : ""}`} style={{ borderLeft: `6px solid ${accent}`, ...style }}
      onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button type="button" className="box-main" data-person-id={p.id} onClick={onClick} onKeyDown={navigateCard} aria-label={`${p.nombre} · ${roleText}`} aria-pressed={cls.includes('selected')}>
        <span className="name" title={p.nombre}>{p.nombre}</span>
        <span className="role" title={roleText}>{roleText}</span>
        {showDates && <span className="box-dates">{Number.isFinite(p.nac) ? p.nac : '?'}–{Number.isFinite(p.muer) ? p.muer : '?'}</span>}
      </button>
      {hasDescendants && (
        <button
          type="button"
          className={`desc-toggle${descendantsCollapsed ? " is-collapsed" : ""}`}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onToggleDescendants?.(); }}
          aria-label={`${descendantsCollapsed ? (en ? "Show" : "Abrir") : (en ? "Hide" : "Cerrar")} ${en ? "descendants of" : "descendencia de"} ${p.nombre}`}
          title={`${descendantsCollapsed ? (en ? "Show" : "Abrir") : (en ? "Hide" : "Cerrar")} ${en ? "descendants" : "descendencia"}`}
        >
          {descendantsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        </button>
      )}
    </div>
  );
});



function calcularEstadisticas(personas) {
  const lista = (personas || []).filter(Boolean);
  const ids = new Set(lista.map((persona) => persona.id));
  const paresUnicos = (getRelaciones) => {
    const pares = new Set();
    lista.forEach((persona) => {
      getRelaciones(persona).forEach((otroId) => {
        if (!ids.has(otroId)) return;
        pares.add([persona.id, otroId].sort().join("|"));
      });
    });
    return pares.size;
  };
  const contar = (valores) => Object.entries(valores.reduce((acc, valor) => {
    if (valor) acc[valor] = (acc[valor] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
  const dinastias = contar(lista.map((persona) => persona.dinastia));
  const territorios = contar(lista.flatMap((persona) => territoriosDe(persona)));
  const gobernantes = lista.filter((persona) => listaReinados(persona).some(reinadoEsEfectivo)).length;
  const reinados = lista.flatMap((persona) => listaReinados(persona)
    .filter((reinado) => reinadoEsEfectivo(reinado) && Number.isFinite(reinado.desde) && Number.isFinite(reinado.hasta))
    .map((reinado) => ({ persona, reinado, duracion: reinado.hasta - reinado.desde })));
  const reinadoMasLargo = reinados.sort((a, b) => b.duracion - a.duracion)[0] || null;
  const descendencia = lista.map((persona) => ({
    persona,
    total: (HIJOS_POR_ID[persona.id] || []).filter((id) => ids.has(id)).length,
  })).sort((a, b) => b.total - a.total)[0] || null;
  return {
    personas: lista.length,
    dinastias: dinastias.length,
    territorios: territorios.length,
    matrimonios: paresUnicos(listaConyuges),
    amantes: paresUnicos(listaAmantes),
    gobernantes,
    topDinastias: dinastias.slice(0, 8),
    topTerritorios: territorios.slice(0, 8),
    reinadoMasLargo,
    descendencia,
  };
}

export function ModalProyecto({ seccion, onClose, persona, personasVista = PERSONAS, onStartHistoria, locale='es' }) {
  const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value;
  const storyCopy=story=>en?(englishStoriesRuntime.stories[story.id]?.content||ENGLISH_STORIES[story.id]||{}):{};
  const [alcanceEstadisticas, setAlcanceEstadisticas] = useState("base");
  if (!seccion) return null;
  const correos = CORREOS_CORRECCIONES.filter(Boolean);
  const correoPrincipal = correos[0] || "";
  const urlActual = typeof window !== "undefined" ? window.location.href : "";
  const asunto = persona ? tr(`Corrección: ${persona.nombre}`,`Correction: ${persona.nombre}`) : tr("Corrección para El Árbol de Europa","Correction for The Tree of Europe");
  const cuerpo = [
    tr("Hola, he encontrado un posible error en El Árbol de Europa.","Hello, I have found a possible error in The Tree of Europe."),
    "",
    persona ? `${tr('Persona','Person')}: ${persona.nombre}` : tr("Persona o sección:","Person or section:"),
    persona ? `ID: ${persona.id}` : tr("ID (si procede):","ID (if applicable):"),
    urlActual ? `URL: ${urlActual}` : "",
    "",
    tr("Tipo de error: fecha / parentesco / reinado / territorio / otro","Type of error: date / relationship / reign / territory / other"),
    "",
    tr("Descripción:","Description:"),
  ].filter(Boolean).join("\n");
  const mailto = correoPrincipal
    ? `mailto:${correoPrincipal}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    : "";

  const titulo = (en?{
    acerca:"About the project",agradecimientos:"Acknowledgements",fuentes:"Sources and methodology",licencias:"Licences",reportar:"Report an error",estadisticas:"Statistics",historias:"Stories",
  }:{
    acerca: "Acerca del proyecto",
    agradecimientos: "Agradecimientos",
    fuentes: "Fuentes y metodología",
    licencias: "Licencias",
    reportar: "Reportar un error",
    estadisticas: "Estadísticas",
    historias: "Historias",
  })[seccion] || tr("Información del proyecto","Project information");
  const estadisticas = calcularEstadisticas(alcanceEstadisticas === "vista" ? personasVista : PERSONAS);

  return (
    <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="project-modal-head">
          <div>
            <div className="project-modal-kicker">{tr('El Árbol de Europa','The Tree of Europe')}</div>
            <h2>{titulo}</h2>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose} aria-label={tr('Cerrar','Close')}><X size={17} /></button>
        </div>

        <div className="project-modal-body">
          {seccion === "acerca" && (
            <>
              <p className="project-lead">{tr('El Árbol de Europa es un proyecto interactivo de genealogía histórica que busca visualizar parentescos, dinastías, reinados y conexiones políticas de la Europa medieval y moderna en una misma red navegable.','The Tree of Europe is an interactive historical genealogy project that brings family relationships, dynasties, reigns and political connections across medieval and early modern Europe into one navigable network.')}</p>
              <div className="project-stat-grid">
                <div><strong>{PERSONAS.length}</strong><span>{tr('personas en la base','people in the database')}</span></div>
                <div><strong>1200–1800</strong><span>{tr('periodo principal de trabajo','main period covered')}</span></div>
                <div><strong>{tr('En desarrollo','In development')}</strong><span>{tr('la base sigue ampliándose y corrigiéndose','the database continues to expand and improve')}</span></div>
              </div>
              <h3>{tr('Qué intenta hacer','What the project sets out to do')}</h3>
              <p>{tr('La aplicación combina genealogía, cronología y cartografía para que una misma persona pueda estudiarse dentro de su familia, su época y los territorios con los que estuvo vinculada. La ausencia de una relación o de un personaje no implica que históricamente no existiera: puede significar simplemente que todavía no se ha incorporado a la base.','The application combines genealogy, chronology and cartography so that each person can be studied within their family, period and associated territories. A missing relationship or person does not mean they did not exist historically; it may simply mean they have not yet been added to the database.')}</p>
            </>
          )}

          {seccion === "agradecimientos" && (
            <>
              <div className="project-section-icon"><Heart size={17} /></div>
              <h3>{tr('CORRECTORES','CONTRIBUTORS AND REVIEWERS')}</h3>
              {CORRECTORES.length ? (
                <ul className="project-name-list">{CORRECTORES.map((nombre) => <li key={nombre}>{nombre}</li>)}</ul>
              ) : (
                <p className="project-muted">{tr('Este espacio queda preparado para acreditar a quienes detecten errores, aporten documentación o ayuden a mejorar la base. Añade sus nombres en la constante','This space is reserved for crediting people who find errors, contribute sources or help improve the database. Add their names to the')} <code>CORRECTORES</code> {tr('de App.jsx.','constant in App.jsx.')}</p>
              )}
              <h3>{tr('Cartografía','Cartography')}</h3>
              <p>{tr('Gracias a','Thanks to')} <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a>, {tr('cuya base cartográfica se ha adaptado para representar territorios históricos dentro del proyecto.','whose map base has been adapted to represent historical territories in this project.')}</p>
              <h3>{tr('Heráldica','Heraldry')}</h3>
              <p>{tr('Gracias a','Thanks to')} <a href="https://heraldicon.org/" target="_blank" rel="noreferrer">Heraldicon <ExternalLink size={12} /></a>, {tr('la herramienta con la que Manuel Muriel Cagigal ha creado los escudos propios aportados al Atlas. Cada dibujo conserva su autoría y sus condiciones de uso en los créditos.','the tool Manuel Muriel Cagigal used to create the original coats of arms contributed to the Atlas. Each design retains its authorship and usage terms in the credits.')}</p>
              <h3>{tr('Correcciones y aportaciones','Corrections and contributions')}</h3>
              {correos.length ? (
                <p>{tr('Si encuentras un fallo, puedes escribir a','If you find an error, you can write to')} {correos.map((correo, index) => <React.Fragment key={correo}>{index ? ", " : ""}<a href={`mailto:${correo}`}>{correo}</a></React.Fragment>)}.</p>
              ) : (
                <p className="project-muted">{tr('Configura','Set')} <code>VITE_CONTACT_EMAIL</code> {tr('en las variables de entorno de Vercel para mostrar aquí el correo público del proyecto.','in the Vercel environment variables to display the public project email address here.')}</p>
              )}
            </>
          )}

          {seccion === "fuentes" && (
            <>
              <div className="project-section-icon"><BookOpen size={17} /></div>
              <p className="project-lead">{tr('El Árbol de Europa se construye como una base de síntesis: combina repertorios genealógicos, biografías académicas, archivos, instituciones culturales y páginas oficiales de casas reinantes. Cuando una filiación, una fecha o un reinado es discutido, se contrasta el dato con varias referencias antes de incorporarlo.','The Tree of Europe is built as a synthesis database, combining genealogical reference works, academic biographies, archives, cultural institutions and official pages of reigning houses. When a relationship, date or reign is disputed, it is checked against several references before being included.')}</p>

              {SOURCE_GROUPS.map(group => <React.Fragment key={group.title}>
                <h3>{term(group.title)}</h3>
                <ul className="project-source-list">{group.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{term(source.titulo)} <ExternalLink size={12} /></a>{source.nota && <span>{term(source.nota)}</span>}</li>)}</ul>
              </React.Fragment>)}
              <h3>{tr('Criterios de trabajo','Working principles')}</h3>
              <ul className="project-method-list">{SOURCE_METHOD.map(text => <li key={text}>{term(text)}</li>)}</ul>
            </>
          )}

          {seccion === "licencias" && (
            <>
              <div className="project-section-icon"><Scale size={17} /></div>
              <h3>{tr('Contenido original del proyecto','Original project content')}</h3>
              <p>{tr('Salvo indicación expresa en sentido contrario, el código, el diseño, los textos y la estructura original de la base de datos de El Árbol de Europa se mantienen con todos los derechos reservados.','Unless expressly stated otherwise, the code, design, text and original database structure of The Tree of Europe remain all rights reserved.')}</p>
              <div className="project-license-note">{tr('Los materiales de terceros conservan sus propias licencias. La cartografía derivada de MapChart se rige por su atribución específica y no extiende automáticamente esa licencia al resto del proyecto.','Third-party materials retain their own licences. Cartography derived from MapChart is governed by its specific attribution terms, which do not automatically extend to the rest of the project.')}</div>
              <h3>{tr('Cartografía de MapChart','MapChart cartography')}</h3>
              <p>{tr('La base cartográfica utilizada en el mapa procede de','The map base used in the application comes from')} <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a> {tr('y ha sido modificada y adaptada para este proyecto.','and has been modified and adapted for this project.')}</p>
              <p>{tr('El material cartográfico de MapChart se publica bajo','MapChart cartographic material is published under')} <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) <ExternalLink size={12} /></a>. {tr('La atribución y la indicación de las modificaciones se mantienen aquí y en el pie de la aplicación.','Attribution and notice of modifications are provided here and in the application footer.')}</p>
              <div className="project-license-note">{tr('Esta licencia se refiere a la cartografía derivada de MapChart. No supone por sí sola que el código, los textos o la base genealógica completa del proyecto se publiquen bajo la misma licencia.','This licence applies to cartography derived from MapChart. It does not by itself mean that the code, text or complete genealogical database is released under the same licence.')}</div>
            </>
          )}

          {seccion === "estadisticas" && (
            <>
              <p className="project-lead">{tr('Una lectura cuantitativa de la base genealógica. Puedes comparar el conjunto completo con las personas que permanecen visibles tras aplicar filtros.','A quantitative view of the genealogical database. Compare the complete collection with the people still visible after applying filters.')}</p>
              <div className="stats-scope-toggle" role="group" aria-label={tr('Ámbito de las estadísticas','Statistics scope')}>
                <button type="button" className={alcanceEstadisticas === "base" ? "active" : ""} onClick={() => setAlcanceEstadisticas("base")}>{tr('Base completa','Complete database')}</button>
                <button type="button" className={alcanceEstadisticas === "vista" ? "active" : ""} onClick={() => setAlcanceEstadisticas("vista")}>{tr('Vista actual','Current view')} · {personasVista.length}</button>
              </div>
              <div className="stats-summary-grid">
                <div><strong>{estadisticas.personas}</strong><span>{tr('personas','people')}</span></div>
                <div><strong>{estadisticas.dinastias}</strong><span>{tr('dinastías','dynasties')}</span></div>
                <div><strong>{estadisticas.territorios}</strong><span>{tr('territorios','territories')}</span></div>
                <div><strong>{estadisticas.matrimonios}</strong><span>{tr('matrimonios registrados','recorded marriages')}</span></div>
                <div><strong>{estadisticas.amantes}</strong><span>{tr('relaciones de amantes','lover relationships')}</span></div>
                <div><strong>{estadisticas.gobernantes}</strong><span>{tr('personas con gobierno efectivo','people with effective government')}</span></div>
              </div>
              <div className="stats-columns">
                <div>
                  <h3>{tr('Dinastías más representadas','Most represented dynasties')}</h3>
                  <ol className="stats-ranking">{estadisticas.topDinastias.map(([nombre, total]) => <li key={nombre}><span>{term(nombre)}</span><strong>{total}</strong></li>)}</ol>
                </div>
                <div>
                  <h3>{tr('Territorios más representados','Most represented territories')}</h3>
                  <ol className="stats-ranking">{estadisticas.topTerritorios.map(([nombre, total]) => <li key={nombre}><span>{term(nombre)}</span><strong>{total}</strong></li>)}</ol>
                </div>
              </div>
              <div className="stats-curiosities">
                {estadisticas.reinadoMasLargo && (
                  <div><span>{tr('Gobierno efectivo más largo registrado','Longest recorded effective government')}</span><strong>{estadisticas.reinadoMasLargo.persona.nombre}</strong><small>{term(estadisticas.reinadoMasLargo.reinado.territorio)} · {estadisticas.reinadoMasLargo.reinado.desde}–{estadisticas.reinadoMasLargo.reinado.hasta} · {estadisticas.reinadoMasLargo.duracion} {tr('años','years')}</small></div>
                )}
                {estadisticas.descendencia?.total > 0 && (
                  <div><span>{tr('Más hijos registrados en este conjunto','Most recorded children in this set')}</span><strong>{estadisticas.descendencia.persona.nombre}</strong><small>{estadisticas.descendencia.total} {tr('hijos/as presentes en el ámbito seleccionado','children present in the selected scope')}</small></div>
                )}
              </div>
            </>
          )}

          {seccion === "historias" && (
            <>
              <p className="project-lead">{tr('Recorridos guiados que utilizan el árbol, el mapa, las biografías y la cronología de la propia aplicación. Puedes abandonar el recorrido en cualquier momento y volver a explorar libremente.','Guided journeys through the application’s tree, map, biographies and timeline. You can leave a journey at any time and return to free exploration.')}</p>
              <StoryCollectionBrowser items={HISTORIAS} locale={locale} renderStories={stories => <div className="stories-grid">
                {stories.map((historia) => {
                  const copy=storyCopy(historia),storyTitle=copy.titulo||copy.title||historia.titulo,storySubtitle=copy.subtitulo||copy.subtitle||historia.subtitulo;
                  return (
                  <article key={historia.id} className={`story-catalog-card${historia.disponible ? " is-available" : " is-coming"}`}>
                    <div className="story-catalog-topline">
                      <span>{historia.disponible ? tr('Recorrido disponible','Journey available') : tr('Próximamente','Coming soon')}</span>
                      {historia.disponible && historia.pasos && <b>{historia.pasos.length} {tr('pasos','steps')}</b>}
                    </div>
                    <StoryCollectionTags story={historia} locale={locale}/><h3>{storyTitle}</h3>{historia.revisionPendiente && <strong className="story-review-note">{tr('Pendiente de revisión','Review pending')}</strong>}
                    <p>{storySubtitle}</p>
                    {historia.disponible ? (
                      <a className="story-start-btn" href={rutaEntidadLocalizada(locale, "historia", slugPublico(storyTitle))} onClick={(event) => { event.preventDefault(); onStartHistoria?.(historia.id); }}>{tr('Comenzar recorrido','Start journey')} <ArrowRight size={13} /></a>
                    ) : (
                      <button type="button" className="story-start-btn" disabled>{tr('Próximamente','Coming soon')}</button>
                    )}
                  </article>
                );})}
              </div>}/>
            </>
          )}

          {seccion === "reportar" && (
            <>
              <div className="project-section-icon"><Flag size={17} /></div>
              <p className="project-lead">{tr('Las correcciones son especialmente útiles si incluyen la persona afectada, el dato que parece incorrecto y, cuando sea posible, una fuente.','Corrections are especially useful when they include the person concerned, the data that appears incorrect and, where possible, a source.')}</p>
              {persona && (
                <div className="project-report-context">
                  <span>{tr('Ficha seleccionada','Selected profile')}</span>
                  <strong>{persona.nombre}</strong>
                  <code>{persona.id}</code>
                </div>
              )}
              <div className="project-report-template">
                <strong>{tr('Información útil al informar de un fallo','Useful information when reporting an error')}</strong>
                <span>• {tr('Persona o ID de la ficha','Person or profile ID')}</span>
                <span>• {tr('Tipo de error: fecha, parentesco, reinado, territorio u otro','Type of error: date, relationship, reign, territory or other')}</span>
                <span>• {tr('Explicación breve','Brief explanation')}</span>
                <span>• {tr('Fuente o enlace, si lo tienes','Source or link, if available')}</span>
              </div>
              {correoPrincipal ? (
                <a className="project-primary-action" href={mailto}><Mail size={14} /> {tr('Preparar correo de corrección','Prepare correction email')}</a>
              ) : (
                <div className="project-contact-placeholder"><Mail size={15} /><span>{tr('Configura','Set')} <code>VITE_CONTACT_EMAIL</code> {tr('en Vercel. El botón de correo se activará automáticamente.','in Vercel. The email button will activate automatically.')}</span></div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
