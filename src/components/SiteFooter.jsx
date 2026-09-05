import React from "react";

export default function SiteFooter({ compact = false, onOpenStats, onReport }) {
  return (
    <footer className={`site-footer${compact ? " is-compact" : ""}`}>
      <div className="site-footer-inner">
        <div className="site-footer-group">
          <strong>Explorar</strong>
          <div className="site-footer-links">
            <a href="/es/">Inicio</a>
            <a href="/es/personas">Personas</a>
            <a href="/es/dinastias">Dinastías</a>
            <a href="/es/territorios">Territorios</a>
            <a href="/es/historias">Historias</a>
            {onOpenStats ? <button type="button" onClick={onOpenStats}>Estadísticas</button> : <a href="/es/?atlas=1&panel=estadisticas">Estadísticas</a>}
          </div>
        </div>
        <div className="site-footer-group">
          <strong>Proyecto</strong>
          <div className="site-footer-links">
            <a href="/es/proyecto">Acerca del proyecto</a>
            <a href="/es/fuentes">Fuentes y metodología</a>
            <a href="/es/agradecimientos">Agradecimientos</a>
            <a href="/es/licencias">Licencias</a>
            {onReport ? <button type="button" onClick={onReport}>Reportar un error</button> : <a href="/es/?atlas=1&panel=reportar">Reportar un error</a>}
          </div>
        </div>
      </div>
      <div className="site-footer-meta">
        <span>© 2026 El Árbol de Europa · Código, diseño, textos y estructura original de la base de datos: todos los derechos reservados.</span>
        <span>Cartografía: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span>
      </div>
    </footer>
  );
}
