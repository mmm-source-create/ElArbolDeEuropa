import {SITE_NAME} from "../app/siteConfig.js";
import {ProjectSupportLink} from './ProjectSupport.jsx';

export default function SiteFooter({ compact = false, onOpenStats, onReport, locale = "es" }) {
  if (locale === "en") return <footer className="site-footer"><div className="site-footer-inner"><div className="site-footer-group"><strong>Explore</strong><div className="site-footer-links"><a href="/en/">Home</a><a href="/en/people">People</a><a href="/en/dynasties">Dynasties</a><a href="/en/territories">Territories</a><a href="/en/stories">Stories</a><a href="/en/challenge">Challenge</a>{onOpenStats?<button type="button" onClick={onOpenStats}>Statistics</button>:<a href="/en/?atlas=1&panel=estadisticas">Statistics</a>}</div></div><div className="site-footer-group"><strong>Project</strong><div className="site-footer-links"><a href="/en/about">About the project</a><a href="/en/methodology">Sources and methodology</a><a href="/en/acknowledgements">Acknowledgements</a><a href="/en/licences">Licences</a><a href="/en/privacy">Privacy</a>{onReport?<button type="button" onClick={onReport}>Report an error</button>:<a href="/en/?atlas=1&panel=reportar">Report an error</a>}</div><div className="site-footer-support"><ProjectSupportLink locale="en" /></div></div></div><div className="site-footer-meta"><span>© 2026 The Tree of Europe · Original code, design, text and database structure: all rights reserved.</span><span>Maps: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span></div></footer>;
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
            <a href="/es/desafio">Desafío</a>
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
            <a href="/es/privacidad">Privacidad</a>
            {onReport ? <button type="button" onClick={onReport}>Reportar un error</button> : <a href="/es/?atlas=1&panel=reportar">Reportar un error</a>}
          </div>
          <div className="site-footer-support"><ProjectSupportLink locale={locale} /></div>
        </div>
      </div>
      <div className="site-footer-meta">
        <span>© 2026 {SITE_NAME} · Código, diseño, textos y estructura original de la base de datos: todos los derechos reservados.</span>
        <span>Cartografía: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span>
      </div>
    </footer>
  );
}
