import React, { useEffect, useState } from "react";

import {translatedEquivalent} from '../english/routes.js';
import {SCREEN_NOTICE_KEY} from "../public/screenNotice.js";
import {SITE_NAME, SITE_NAME_EN} from "../siteConfig.js";
import SettingsPanel from '../settings/SettingsPanel.jsx';

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
  const languageControl = onLanguageChange ? (
    <div className="site-language" role="group" aria-label="Idioma / Language">
      <button type="button" className={locale === "es" ? "active" : ""} aria-current={locale === "es" ? "page" : undefined} onClick={() => onLanguageChange("es")}>ES</button>
      <span aria-hidden="true">|</span>
      <button type="button" className={locale === "en" ? "active" : ""} aria-current={locale === "en" ? "page" : undefined} onClick={() => onLanguageChange("en")}>EN</button>
    </div>
  ) : (
    <div className="site-language" role="group" aria-label="Idioma / Language">
      {locale === "en" ? <><a href={equivalent || "/es/"}>ES</a><span aria-hidden="true">|</span><span className="active">EN</span></> : <><span className="active">ES</span><span aria-hidden="true">|</span><a href={equivalent || "/en/"} title={equivalent ? "Leer esta página en inglés" : "Sin traducción de esta página; abrir portada inglesa"}>EN</a></>}
    </div>
  );

  return (
    <header className="site-header">
      <a className="site-brand" href={locale === "en" ? "/en/" : "/es/"} aria-label={locale === "en" ? `${SITE_NAME_EN} — home` : `${SITE_NAME} — inicio`}>
        <img className="site-brand-logo" src="/brand/logo-28.webp" srcSet="/brand/logo-28.webp 1x, /brand/logo-56.webp 2x, /brand/logo-84.webp 3x" width="28" height="28" alt="" aria-hidden="true" />
        <span className="site-brand-copy">
          <strong>{locale === "en" ? SITE_NAME_EN : SITE_NAME}</strong>
          <small>{locale === "en" ? "Historical and genealogical atlas" : "Atlas genealógico e histórico"}</small>
        </span>
      </a>

      <nav className="site-nav" aria-label={locale === "en" ? "Main navigation" : "Navegación principal"}>
        {links.map(([id, label, href, spanishOnly]) => <a key={id} href={href} aria-current={active === id ? "page" : undefined} title={spanishOnly ? "This section is currently available in Spanish" : undefined} onClick={isAtlas && id === "atlas" ? event => event.preventDefault() : undefined}>{label}{spanishOnly && <span className="site-nav-language" aria-label="Spanish only">ES</span>}</a>)}
      </nav>

      {languageControl}
      <SettingsPanel locale={locale} prerendered={prerendered}/>
      {!noticeDismissed && <aside className="site-screen-notice" aria-label={locale === "en" ? "Viewing recommendation" : "Recomendación de visualización"}>
        <p>{locale === "en" ? "For a more comfortable view of the tree, map and timeline, we recommend using a larger screen." : "Para explorar el árbol, el mapa y la cronología con más comodidad, recomendamos usar una pantalla grande."}</p>
        <button type="button" onClick={dismissNotice} aria-label={locale === "en" ? "Dismiss recommendation" : "Cerrar aviso"}><span aria-hidden="true">×</span></button>
      </aside>}
    </header>
  );
}
