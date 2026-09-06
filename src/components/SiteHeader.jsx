import React from "react";

export default function SiteHeader({
  variant = "public",
  locale = "es",
  onLanguageChange,
  contextLabel = "Atlas interactivo",
}) {
  const isAtlas = variant === "atlas";
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
    <header className={`site-header${isAtlas ? " is-atlas" : ""}`}>
      <a className="site-brand" href="/es/" aria-label="El Árbol de Europa — inicio">
        <img className="site-brand-logo" src="/EADE.png" alt="" aria-hidden="true" />
        <span className="site-brand-copy">
          <strong>{locale === "en" ? "The Tree of Europe" : "El Árbol de Europa"}</strong>
          <small>{locale === "en" ? "Historical and genealogical atlas" : "Atlas genealógico e histórico"}</small>
        </span>
      </a>

      {isAtlas ? (
        <div className="site-atlas-context" aria-label="Contexto del atlas">
          <a href="/es/">Inicio</a>
          <span aria-hidden="true">›</span>
          <span>Atlas</span>
          {contextLabel && contextLabel !== "Atlas interactivo" && <><span aria-hidden="true">›</span><strong title={contextLabel}>{contextLabel}</strong></>}
        </div>
      ) : (
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="/es/personas">Personas</a>
          <a href="/es/dinastias">Dinastías</a>
          <a href="/es/territorios">Territorios</a>
          <a href="/es/historias">Historias</a>
          <a href="/es/desafio">Desafío</a>
        </nav>
      )}

      {languageControl}
    </header>
  );
}
