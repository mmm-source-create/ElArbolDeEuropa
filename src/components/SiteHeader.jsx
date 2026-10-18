import { useEffect, useState } from "react";

import {translatedEquivalent} from '../features/english/routes.js';
import {SCREEN_NOTICE_KEY} from "../features/public/screenNotice.js";
import {SITE_NAME, SITE_NAME_EN} from "../app/siteConfig.js";
import SettingsPanel from '../features/settings/SettingsPanel.jsx';

function noticeWasDismissed() {
  try { return typeof window !== "undefined" && window.sessionStorage.getItem(SCREEN_NOTICE_KEY) === "1"; }
  catch { return false; }
}

export default function SiteHeader({
  variant = "public",
  locale = "es",
  onLanguageChange,
  pathname,
  prerendered = false,
}) {
  const [noticeDismissed, setNoticeDismissed] = useState(() => prerendered ? false : noticeWasDismissed());
  useEffect(() => { if (prerendered) setNoticeDismissed(noticeWasDismissed()); }, [prerendered]);
  const dismissNotice = () => {
    setNoticeDismissed(true);
    try { window.sessionStorage.setItem(SCREEN_NOTICE_KEY, "1"); } catch { /* Navigation works without storage. */ }
  };
  const isAtlas = variant === "atlas";
  const path = pathname || (typeof window === "undefined" ? "/es/" : window.location.pathname);
  const active = locale === "en" ? (/\/story(?:\/|$)|\/stories/.test(path) ? "historias" : /\/person(?:\/|$)|\/people/.test(path) ? "personas" : null) : isAtlas ? "atlas" : /\/persona(?:s|\/|$)/.test(path) ? "personas" : /\/dinastia(?:s|\/|$)/.test(path) ? "dinastias" : /\/territorio(?:s|\/|$)/.test(path) ? "territorios" : /\/historia(?:s|\/|$)/.test(path) ? "historias" : /\/desafio/.test(path) ? "desafio" : null;
  const equivalent = translatedEquivalent(path, locale === "en" ? "es" : "en");
  const links = locale === "en" ? [["atlas", "Atlas", "/es/?atlas=1&continuar=1", true], ["personas", "People", "/en/people"], ["dinastias", "Dynasties", "/es/dinastias", true], ["territorios", "Territories", "/es/territorios", true], ["historias", "Stories", "/en/stories"], ["desafio", "Challenge", "/es/desafio", true]] : [["atlas", "Atlas", "/es/?atlas=1&continuar=1"], ["personas", "Personas", "/es/personas"], ["dinastias", "Dinastías", "/es/dinastias"], ["territorios", "Territorios", "/es/territorios"], ["historias", "Historias", "/es/historias"], ["desafio", "Desafío", "/es/desafio"]];
  // One control on every page: the atlas switches language in place, the public
  // pages link to the equivalent page (or the other edition's home).
  const languageOption = (code) => {
    const label = code.toUpperCase();
    if (locale === code) return <span key={code} className="site-language-option active" aria-current="page">{label}</span>;
    if (onLanguageChange) return <button key={code} type="button" className="site-language-option" onClick={() => onLanguageChange(code)}>{label}</button>;
    const title = code === "en" ? (equivalent ? "Leer esta página en inglés" : "Sin traducción de esta página; abrir portada inglesa") : (equivalent ? "Read this page in Spanish" : "Open the Spanish home page");
    return <a key={code} className="site-language-option" href={equivalent || `/${code}/`} hrefLang={code} lang={code} title={title}>{label}</a>;
  };
  const languageControl = <div className="site-language" role="group" aria-label="Idioma / Language">{["es", "en"].map(languageOption)}</div>;

  return (
    <header className="site-header">
      <a className="site-brand" href={locale === "en" ? "/en/" : "/es/"} aria-label={locale === "en" ? `${SITE_NAME_EN} — home` : `${SITE_NAME} — inicio`}>
        {isAtlas ? <span className={isAtlas ? 'sk dim atlas-logo-holder' : undefined}><img className="site-brand-logo" src="/brand/logo-28.webp" srcSet="/brand/logo-28.webp 1x, /brand/logo-56.webp 2x, /brand/logo-84.webp 3x" width="28" height="28" alt="" aria-hidden="true" /></span> : <img className="site-brand-logo" src="/brand/logo-28.webp" srcSet="/brand/logo-28.webp 1x, /brand/logo-56.webp 2x, /brand/logo-84.webp 3x" width="28" height="28" alt="" aria-hidden="true" />}
        <span className="site-brand-copy">
          <strong className={isAtlas ? 'sk' : undefined}>{locale === "en" ? SITE_NAME_EN : SITE_NAME}</strong>
          <small>{locale === "en" ? "Historical and genealogical atlas" : "Atlas genealógico e histórico"}</small>
        </span>
      </a>

      <nav className="site-nav" aria-label={locale === "en" ? "Main navigation" : "Navegación principal"}>
        {links.map(([id, label, href, spanishOnly]) => <a key={id} href={href} aria-current={active === id ? "page" : undefined} title={spanishOnly ? "This section is currently available in Spanish" : undefined} onClick={isAtlas && id === "atlas" ? event => event.preventDefault() : undefined}>{label}{spanishOnly && <span className="site-nav-language" aria-label="Spanish only">ES</span>}</a>)}
      </nav>

      {languageControl}
      <SettingsPanel locale={locale} prerendered={prerendered}/>
      {!isAtlas && !noticeDismissed && <aside className="site-screen-notice" aria-label={locale === "en" ? "Viewing recommendation" : "Recomendación de visualización"}>
        <p>{locale === "en" ? "For a more comfortable view of the tree, map and timeline, we recommend using a larger screen." : "Para explorar el árbol, el mapa y la cronología con más comodidad, recomendamos usar una pantalla grande."}</p>
        <button type="button" onClick={dismissNotice} aria-label={locale === "en" ? "Dismiss recommendation" : "Cerrar aviso"}><span aria-hidden="true">×</span></button>
      </aside>}
    </header>
  );
}
