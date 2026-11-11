import {SITE_NAME, DEFAULT_SITE_URL} from '../app/siteConfig.js';
import {ProjectSupportLink} from './ProjectSupport.jsx';
import {Star} from 'lucide-react';

export default function SiteFooter({compact=false,onOpenStats,onReport,locale='es'}) {
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const explore=en?[['Home','/en/'],['People','/en/people'],['Dynasties','/en/dynasties'],['Territories','/en/territories'],['Stories','/en/stories'],['Challenge','/en/challenge']]:[['Inicio','/es/'],['Personas','/es/personas'],['Dinastías','/es/dinastias'],['Territorios','/es/territorios'],['Historias','/es/historias'],['Desafío','/es/desafio']];
  const project=en?[['About the project','/en/about'],['Sources and methodology','/en/methodology'],['Acknowledgements','/en/acknowledgements'],['Licences','/en/licences'],['Privacy','/en/privacy']]:[['Acerca del proyecto','/es/proyecto'],['Fuentes y metodología','/es/fuentes'],['Agradecimientos','/es/agradecimientos'],['Licencias','/es/licencias'],['Privacidad','/es/privacidad']];
  return <footer className={`site-footer${compact?' is-compact':''}`}>
    <div className="site-footer-inner">
      <div className="site-footer-group"><strong>{tr('Explorar','Explore')}</strong><div className="site-footer-links">{explore.map(([label,path])=><a key={path} href={path}>{label}</a>)}{onOpenStats?<button type="button" onClick={onOpenStats}>{tr('Estadísticas','Statistics')}</button>:<a href={`/${locale}/?atlas=1&panel=estadisticas`}>{tr('Estadísticas','Statistics')}</a>}</div></div>
      <div className="site-footer-group"><strong>{tr('Proyecto','Project')}</strong><div className="site-footer-links">{project.map(([label,path])=><a key={path} href={path}>{label}</a>)}{onReport?<button type="button" onClick={onReport}>{tr('Reportar un error','Report an error')}</button>:<a href={`/${locale}/?atlas=1&panel=reportar`}>{tr('Reportar un error','Report an error')}</a>}</div></div>
    </div>
    <div className="site-footer-actions"><ProjectSupportLink locale={locale}/><a className="preferred-source-link" href={`https://www.google.com/preferences/source?q=${encodeURIComponent(DEFAULT_SITE_URL)}`} target="_blank" rel="noopener noreferrer"><Star size={15} aria-hidden="true"/>{tr('Añadir como fuente preferida en Google','Add as a preferred source on Google')}</a></div>
    <div className="site-footer-meta"><span>© 2026 {en?'The Tree of Europe':SITE_NAME} · {tr('Código, diseño, textos y estructura original de la base de datos: todos los derechos reservados.','Original code, design, text and database structure: all rights reserved.')}</span><span>{tr('Cartografía','Maps')}: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span></div>
  </footer>;
}
