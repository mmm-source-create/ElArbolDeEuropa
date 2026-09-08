import React, { useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, ExternalLink, Flag, Heart, Mail, Scale, X } from "lucide-react";
import { PERSONAS } from "../personas.jsx";
import { HISTORIAS } from "../historiaData.jsx";
import { listaReinados, reinadoEsEfectivo } from "../Territorios.jsx";
import { CORRECTORES, CORREOS_CORRECCIONES, HIJOS_POR_ID, listaAmantes, listaConyuges, rutaEntidadLocalizada, slugPublico } from "./model.js";

export function Chip({ label, active, onClick, color, small = false }) {
  return (
    <button type="button" onClick={onClick} className={`chip${small ? " chip-sm" : ""}`}
      style={{ borderColor: color, background: active ? color : "transparent", color: active ? "#F6F1E4" : "#3A342A" }}>
      {label}
    </button>
  );
}

export const PersonBox = React.memo(function PersonBox({
  p, cls, accent, style, setRef, onEnter, onLeave, onClick,
  hasDescendants = false, descendantsCollapsed = false, onToggleDescendants,
}) {
  const roleText = `${p.titulo} · ${(p.reinos || []).join(" · ")}`;
  return (
    <div ref={setRef} className={`${cls}${hasDescendants ? " has-descendants" : ""}`} style={{ borderLeft: `6px solid ${accent}`, ...style }}
      role="button" tabIndex={0}
      onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick?.(event); } }}>
      {hasDescendants && (
        <button
          type="button"
          className={`desc-toggle${descendantsCollapsed ? " is-collapsed" : ""}`}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); onToggleDescendants?.(); }}
          aria-label={`${descendantsCollapsed ? "Abrir" : "Cerrar"} descendencia de ${p.nombre}`}
          title={`${descendantsCollapsed ? "Abrir" : "Cerrar"} descendencia`}
        >
          {descendantsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        </button>
      )}
      <div className="name" title={p.nombre}>{p.nombre}</div>
      <div className="role" title={roleText}>{roleText}</div>
    </div>
  );
});



export function calcularEstadisticas(personas) {
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
  const territorios = contar(lista.flatMap((persona) => persona.reinos || []));
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

export function ModalProyecto({ seccion, onClose, persona, personasVista = PERSONAS, onStartHistoria }) {
  const [alcanceEstadisticas, setAlcanceEstadisticas] = useState("base");
  if (!seccion) return null;
  const correos = CORREOS_CORRECCIONES.filter(Boolean);
  const correoPrincipal = correos[0] || "";
  const urlActual = typeof window !== "undefined" ? window.location.href : "";
  const asunto = persona ? `Corrección: ${persona.nombre}` : "Corrección para El Árbol de Europa";
  const cuerpo = [
    "Hola, he encontrado un posible error en El Árbol de Europa.",
    "",
    persona ? `Persona: ${persona.nombre}` : "Persona o sección:",
    persona ? `ID: ${persona.id}` : "ID (si procede):",
    urlActual ? `URL: ${urlActual}` : "",
    "",
    "Tipo de error: fecha / parentesco / reinado / territorio / otro",
    "",
    "Descripción:",
  ].filter(Boolean).join("\n");
  const mailto = correoPrincipal
    ? `mailto:${correoPrincipal}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    : "";

  const titulo = {
    acerca: "Acerca del proyecto",
    agradecimientos: "Agradecimientos",
    fuentes: "Fuentes y metodología",
    licencias: "Licencias",
    reportar: "Reportar un error",
    estadisticas: "Estadísticas",
    historias: "Historias",
  }[seccion] || "Información del proyecto";
  const estadisticas = calcularEstadisticas(alcanceEstadisticas === "vista" ? personasVista : PERSONAS);

  return (
    <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="project-modal-head">
          <div>
            <div className="project-modal-kicker">El Árbol de Europa</div>
            <h2>{titulo}</h2>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose} aria-label="Cerrar"><X size={17} /></button>
        </div>

        <div className="project-modal-body">
          {seccion === "acerca" && (
            <>
              <p className="project-lead">El Árbol de Europa es un proyecto interactivo de genealogía histórica que busca visualizar parentescos, dinastías, reinados y conexiones políticas de la Europa medieval y moderna en una misma red navegable.</p>
              <div className="project-stat-grid">
                <div><strong>{PERSONAS.length}</strong><span>personas en la base</span></div>
                <div><strong>1200–1800</strong><span>periodo principal de trabajo</span></div>
                <div><strong>En desarrollo</strong><span>la base sigue ampliándose y corrigiéndose</span></div>
              </div>
              <h3>Qué intenta hacer</h3>
              <p>La aplicación combina genealogía, cronología y cartografía para que una misma persona pueda estudiarse dentro de su familia, su época y los territorios con los que estuvo vinculada. La ausencia de una relación o de un personaje no implica que históricamente no existiera: puede significar simplemente que todavía no se ha incorporado a la base.</p>
            </>
          )}

          {seccion === "agradecimientos" && (
            <>
              <div className="project-section-icon"><Heart size={17} /></div>
              <h3>CORRECTORES</h3>
              {CORRECTORES.length ? (
                <ul className="project-name-list">{CORRECTORES.map((nombre) => <li key={nombre}>{nombre}</li>)}</ul>
              ) : (
                <p className="project-muted">Este espacio queda preparado para acreditar a quienes detecten errores, aporten documentación o ayuden a mejorar la base. Añade sus nombres en la constante <code>CORRECTORES</code> de App.jsx.</p>
              )}
              <h3>Cartografía</h3>
              <p>Gracias a <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a>, cuya base cartográfica se ha adaptado para representar territorios históricos dentro del proyecto.</p>
              <h3>Correcciones y aportaciones</h3>
              {correos.length ? (
                <p>Si encuentras un fallo, puedes escribir a {correos.map((correo, index) => <React.Fragment key={correo}>{index ? ", " : ""}<a href={`mailto:${correo}`}>{correo}</a></React.Fragment>)}.</p>
              ) : (
                <p className="project-muted">Configura <code>VITE_CONTACT_EMAIL</code> en las variables de entorno de Vercel para mostrar aquí el correo público del proyecto.</p>
              )}
            </>
          )}

          {seccion === "fuentes" && (
            <>
              <div className="project-section-icon"><BookOpen size={17} /></div>
              <p className="project-lead">El Árbol de Europa se construye como una base de síntesis: combina repertorios genealógicos, biografías académicas, archivos, instituciones culturales y páginas oficiales de casas reinantes. Cuando una filiación, una fecha o un reinado es discutido, se contrasta el dato con varias referencias antes de incorporarlo.</p>

              <h3>Repertorios principales</h3>
              <ul className="project-source-list">
                <li><a href="https://fmg.ac/Projects/MedLands/index.htm" target="_blank" rel="noreferrer">Foundation for Medieval Genealogy · MedLands <ExternalLink size={12} /></a><span>Reconstrucciones genealógicas y referencias documentales, especialmente útiles para la Edad Media y las ramas dinásticas complejas.</span></li>
                <li><a href="https://www.deutsche-biographie.de/" target="_blank" rel="noreferrer">Deutsche Biographie <ExternalLink size={12} /></a><span>Biografías y datos de referencia para personajes y casas del ámbito germánico, centroeuropeo y báltico.</span></li>
                <li><a href="https://www.treccani.it/" target="_blank" rel="noreferrer">Treccani <ExternalLink size={12} /></a><span>Apoyo biográfico y contextual para casas italianas, especialmente Médici, Saboya y figuras políticas o culturales del Renacimiento.</span></li>
                <li><a href="https://www.britannica.com/" target="_blank" rel="noreferrer">Encyclopaedia Britannica <ExternalLink size={12} /></a><span>Consulta biográfica e histórica de contraste, útil sobre todo para grandes figuras europeas y marcos dinásticos generales.</span></li>
                <li><a href="https://en.wikipedia.org/" target="_blank" rel="noreferrer">Wikipedia <ExternalLink size={12} /></a><span>Herramienta auxiliar de localización, cronología y orientación bibliográfica. Los datos sensibles o dudosos se contrastan siempre que es posible con fuentes más especializadas.</span></li>
              </ul>

              <h3>Archivos e instituciones</h3>
              <ul className="project-source-list">
                <li><a href="https://historia-hispanica.rah.es/" target="_blank" rel="noreferrer">Historia Hispánica · Real Academia de la Historia <ExternalLink size={12} /></a><span>Apoyo biográfico para personajes y linajes del ámbito hispánico.</span></li>
                <li><a href="https://pares.mcu.es/" target="_blank" rel="noreferrer">PARES · Portal de Archivos Españoles <ExternalLink size={12} /></a><span>Documentación archivística y descripciones de fondos, muy útil para confirmar filiaciones, cargos y cronologías.</span></li>
                <li><a href="https://bibliotecadigital.rah.es/" target="_blank" rel="noreferrer">Biblioteca Digital · Real Academia de la Historia <ExternalLink size={12} /></a><span>Genealogías, nobiliarios y repertorios históricos digitalizados empleados en comprobaciones concretas.</span></li>
                <li><a href="https://www.kungahuset.se/english/the-monarchy-of-sweden" target="_blank" rel="noreferrer">Kungahuset · Casa Real de Suecia <ExternalLink size={12} /></a><span>Secuencias dinásticas y contexto institucional de la monarquía sueca.</span></li>
                <li><a href="https://www.kongehuset.dk/en" target="_blank" rel="noreferrer">Kongehuset · Casa Real de Dinamarca <ExternalLink size={12} /></a><span>Sucesión y marco histórico de la línea danesa, especialmente para Oldemburgo y ramas conectadas.</span></li>
                <li><a href="https://www.royal-house.nl/" target="_blank" rel="noreferrer">Royal House of the Netherlands <ExternalLink size={12} /></a><span>Información institucional sobre Orange-Nassau y la continuidad dinástica neerlandesa.</span></li>
                <li><a href="https://burg-hohenzollern.com/en/" target="_blank" rel="noreferrer">Burg Hohenzollern <ExternalLink size={12} /></a><span>Historia de la casa de Hohenzollern y apoyo para la evolución de Brandeburgo y Prusia.</span></li>
                <li><a href="https://www.museotorino.it/" target="_blank" rel="noreferrer">MuseoTorino <ExternalLink size={12} /></a><span>Material útil para comprobar sucesiones y genealogías ligadas a la casa de Saboya.</span></li>
              </ul>

              <h3>Fuentes para historias y comprobaciones específicas</h3>
              <ul className="project-source-list">
                <li><a href="https://plato.stanford.edu/" target="_blank" rel="noreferrer">Stanford Encyclopedia of Philosophy <ExternalLink size={12} /></a><span>Especialmente útil para contextualizar autores y obras políticas o filosóficas, como Maquiavelo.</span></li>
                <li><a href="https://www.louvre.fr/en" target="_blank" rel="noreferrer">Musée du Louvre <ExternalLink size={12} /></a><span>Apoyo institucional para episodios concretos de historia cultural y artística, como la trayectoria de la Gioconda.</span></li>
                <li><a href="https://polishhistory.pl/" target="_blank" rel="noreferrer">Polish History <ExternalLink size={12} /></a><span>Contexto histórico para la monarquía electiva, la Unión de Lublin y la República de las Dos Naciones.</span></li>
              </ul>

              <h3>Cartografía</h3>
              <ul className="project-source-list">
                <li><a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a><span>Base cartográfica sobre la que se ha construido la representación territorial interactiva.</span></li>
              </ul>

              <h3>Criterios de trabajo</h3>
              <ul className="project-method-list">
                <li>Las fechas se almacenan normalmente a nivel de año; cuando una fuente ofrece una fecha aproximada, la interfaz todavía no distingue visualmente entre fecha exacta y aproximada.</li>
                <li>Se priorizan personajes que conectan ramas, ejercen un gobierno, fundan una línea relevante o tienen descendencia históricamente útil para la red.</li>
                <li>Wikipedia se utiliza como apoyo auxiliar, no como referencia única para datos genealógicos controvertidos.</li>
                <li>Cuando una filiación es discutida, se evita presentarla como segura si no existe base suficiente para hacerlo.</li>
                <li>Los territorios del mapa son una representación histórica simplificada y dependen de los límites disponibles en la base cartográfica.</li>
                <li>La ausencia de un progenitor, matrimonio o descendiente significa “no registrado en esta base”, no “inexistente”.</li>
                <li>Las correcciones documentadas tienen prioridad sobre la mera coherencia visual del árbol.</li>
                <li>La presencia de una fuente en esta lista no implica que cada ficha dependa de una sola obra: la base es de síntesis y cruza referencias de distinta naturaleza.</li>
              </ul>
            </>
          )}

          {seccion === "licencias" && (
            <>
              <div className="project-section-icon"><Scale size={17} /></div>
              <h3>Contenido original del proyecto</h3>
              <p>Salvo indicación expresa en sentido contrario, el código, el diseño, los textos y la estructura original de la base de datos de El Árbol de Europa se mantienen con todos los derechos reservados.</p>
              <div className="project-license-note">Los materiales de terceros conservan sus propias licencias. La cartografía derivada de MapChart se rige por su atribución específica y no extiende automáticamente esa licencia al resto del proyecto.</div>
              <h3>Cartografía de MapChart</h3>
              <p>La base cartográfica utilizada en el mapa procede de <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart <ExternalLink size={12} /></a> y ha sido modificada y adaptada para este proyecto.</p>
              <p>El material cartográfico de MapChart se publica bajo <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) <ExternalLink size={12} /></a>. La atribución y la indicación de las modificaciones se mantienen aquí y en el pie de la aplicación.</p>
              <div className="project-license-note">Esta licencia se refiere a la cartografía derivada de MapChart. No supone por sí sola que el código, los textos o la base genealógica completa del proyecto se publiquen bajo la misma licencia.</div>
            </>
          )}

          {seccion === "estadisticas" && (
            <>
              <p className="project-lead">Una lectura cuantitativa de la base genealógica. Puedes comparar el conjunto completo con las personas que permanecen visibles tras aplicar filtros.</p>
              <div className="stats-scope-toggle" role="group" aria-label="Ámbito de las estadísticas">
                <button type="button" className={alcanceEstadisticas === "base" ? "active" : ""} onClick={() => setAlcanceEstadisticas("base")}>Base completa</button>
                <button type="button" className={alcanceEstadisticas === "vista" ? "active" : ""} onClick={() => setAlcanceEstadisticas("vista")}>Vista actual · {personasVista.length}</button>
              </div>
              <div className="stats-summary-grid">
                <div><strong>{estadisticas.personas}</strong><span>personas</span></div>
                <div><strong>{estadisticas.dinastias}</strong><span>dinastías</span></div>
                <div><strong>{estadisticas.territorios}</strong><span>territorios</span></div>
                <div><strong>{estadisticas.matrimonios}</strong><span>matrimonios registrados</span></div>
                <div><strong>{estadisticas.amantes}</strong><span>relaciones de amantes</span></div>
                <div><strong>{estadisticas.gobernantes}</strong><span>personas con gobierno efectivo</span></div>
              </div>
              <div className="stats-columns">
                <div>
                  <h3>Dinastías más representadas</h3>
                  <ol className="stats-ranking">{estadisticas.topDinastias.map(([nombre, total]) => <li key={nombre}><span>{nombre}</span><strong>{total}</strong></li>)}</ol>
                </div>
                <div>
                  <h3>Territorios más representados</h3>
                  <ol className="stats-ranking">{estadisticas.topTerritorios.map(([nombre, total]) => <li key={nombre}><span>{nombre}</span><strong>{total}</strong></li>)}</ol>
                </div>
              </div>
              <div className="stats-curiosities">
                {estadisticas.reinadoMasLargo && (
                  <div><span>Gobierno efectivo más largo registrado</span><strong>{estadisticas.reinadoMasLargo.persona.nombre}</strong><small>{estadisticas.reinadoMasLargo.reinado.territorio} · {estadisticas.reinadoMasLargo.reinado.desde}–{estadisticas.reinadoMasLargo.reinado.hasta} · {estadisticas.reinadoMasLargo.duracion} años</small></div>
                )}
                {estadisticas.descendencia?.total > 0 && (
                  <div><span>Más hijos registrados en este conjunto</span><strong>{estadisticas.descendencia.persona.nombre}</strong><small>{estadisticas.descendencia.total} hijos/as presentes en el ámbito seleccionado</small></div>
                )}
              </div>
            </>
          )}

          {seccion === "historias" && (
            <>
              <p className="project-lead">Recorridos guiados que utilizan el árbol, el mapa, las biografías y la cronología de la propia aplicación. Puedes abandonar el recorrido en cualquier momento y volver a explorar libremente.</p>
              <div className="stories-grid">
                {HISTORIAS.map((historia) => (
                  <article key={historia.id} className={`story-catalog-card${historia.disponible ? " is-available" : " is-coming"}`}>
                    <div className="story-catalog-topline">
                      <span>{historia.disponible ? "Recorrido disponible" : "Próximamente"}</span>
                      {historia.disponible && historia.pasos && <b>{historia.pasos.length} pasos</b>}
                    </div>
                    <h3>{historia.titulo}</h3>
                    <p>{historia.subtitulo}</p>
                    {historia.disponible ? (
                      <a className="story-start-btn" href={rutaEntidadLocalizada("es", "historia", slugPublico(historia.titulo))} onClick={(event) => { event.preventDefault(); onStartHistoria?.(historia.id); }}>Comenzar recorrido <ArrowRight size={13} /></a>
                    ) : (
                      <button type="button" className="story-start-btn" disabled>Próximamente</button>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}

          {seccion === "reportar" && (
            <>
              <div className="project-section-icon"><Flag size={17} /></div>
              <p className="project-lead">Las correcciones son especialmente útiles si incluyen la persona afectada, el dato que parece incorrecto y, cuando sea posible, una fuente.</p>
              {persona && (
                <div className="project-report-context">
                  <span>Ficha seleccionada</span>
                  <strong>{persona.nombre}</strong>
                  <code>{persona.id}</code>
                </div>
              )}
              <div className="project-report-template">
                <strong>Información útil al informar de un fallo</strong>
                <span>• Persona o ID de la ficha</span>
                <span>• Tipo de error: fecha, parentesco, reinado, territorio u otro</span>
                <span>• Explicación breve</span>
                <span>• Fuente o enlace, si lo tienes</span>
              </div>
              {correoPrincipal ? (
                <a className="project-primary-action" href={mailto}><Mail size={14} /> Preparar correo de corrección</a>
              ) : (
                <div className="project-contact-placeholder"><Mail size={15} /><span>Configura <code>VITE_CONTACT_EMAIL</code> en Vercel. El botón de correo se activará automáticamente.</span></div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export function Collapsible({ title, count, children, defaultOpen = true, headExtra, persistentHeadExtra, overflowVisible = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="panel" style={{ marginBottom: 18, overflow: overflowVisible ? "visible" : "hidden" }}>
      <div className="panel-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1, minWidth: 0 }} onClick={() => setOpen(!open)}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span className="panel-title">{title}</span>
          {count != null && <span className="panel-count">{count}</span>}
        </div>
        {persistentHeadExtra}
        {open && headExtra}
      </div>
      {open && <div className="panel-body">{children}</div>}
    </div>
  );
}

