import React from "react";

export default function SiteHeader({
  variant = "public",
  locale = "es",
  onLanguageChange,
}) {
  const isAtlas = variant === "atlas";
  const path = typeof window === "undefined" ? "/es/" : window.location.pathname;
  const active = isAtlas ? "atlas" : /\/persona(?:s|\/|$)/.test(path) ? "personas" : /\/dinastia(?:s|\/|$)/.test(path) ? "dinastias" : /\/territorio(?:s|\/|$)/.test(path) ? "territorios" : /\/historia(?:s|\/|$)/.test(path) ? "historias" : /\/desafio/.test(path) ? "desafio" : null;
  const links = [["atlas", "Atlas", "/es/?atlas=1&continuar=1"], ["personas", "Personas", "/es/personas"], ["dinastias", "Dinastías", "/es/dinastias"], ["territorios", "Territorios", "/es/territorios"], ["historias", "Historias", "/es/historias"], ["desafio", "Desafío", "/es/desafio"]];
  const languageControl = onLanguageChange ? (
    <div className="site-language" aria-label="Idioma / Language">
      <button type="button" className={locale === "es" ? "active" : ""} aria-current={locale === "es" ? "page" : undefined} onClick={() => onLanguageChange("es")}>ES</button>
      <span aria-hidden="true">|</span>
      <button type="button" className={locale === "en" ? "active" : ""} aria-current={locale === "en" ? "page" : undefined} onClick={() => onLanguageChange("en")}>EN</button>
    </div>
  ) : (
    <div className="site-language" aria-label="Idioma / Language">
      {locale === "en" ? <><a href="/es/">ES</a><span aria-hidden="true">|</span><span className="active">EN</span></> : <><span className="active">ES</span><span aria-hidden="true">|</span><a href="/en/">EN</a></>}
    </div>
  );

  return (
    <header className="site-header">
      <a className="site-brand" href="/es/" aria-label="El Árbol de Europa — inicio">
        <img className="site-brand-logo" src="/brand/logo-28.webp" srcSet="/brand/logo-28.webp 1x, /brand/logo-56.webp 2x, /brand/logo-84.webp 3x" width="28" height="28" alt="" aria-hidden="true" />
        <span className="site-brand-copy">
          <strong>{locale === "en" ? "The Tree of Europe" : "El Árbol de Europa"}</strong>
          <small>{locale === "en" ? "Historical and genealogical atlas" : "Atlas genealógico e histórico"}</small>
        </span>
      </a>

      <nav className="site-nav" aria-label="Navegación principal">
        {links.map(([id, label, href]) => <a key={id} href={href} aria-current={active === id ? "page" : undefined} onClick={isAtlas && id === "atlas" ? event => event.preventDefault() : undefined}>{label}</a>)}
      </nav>

      {languageControl}
    </header>
  );
}
