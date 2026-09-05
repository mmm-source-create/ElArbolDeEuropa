import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Crown } from "lucide-react";
import SITE_META from "./generated/siteMeta.json";
import "./App.css";

const Explorer = lazy(() => import("./Explorer.jsx"));
const PORTADA_STORAGE_KEY = "arbol-europa-portada-v1";
const PUBLIC_SITE_URL = String(import.meta.env.VITE_SITE_URL || "https://www.treeofeurope.eu").replace(/\/+$/, "");

function localeDesdePath(pathname) {
  return /^\/en(?:\/|$)/.test(String(pathname || "")) ? "en" : "es";
}

function slugPersonaDesdePath(pathname) {
  const path = String(pathname || "/");
  const match = path.match(/^\/(?:es\/)?persona\/([^/]+)\/?$/);
  if (!match) return null;
  try { return decodeURIComponent(match[1]); } catch { return match[1]; }
}

function personaIdLegacyDesdeSearch(search) {
  const params = new URLSearchParams(search || "");
  return params.get("persona") || null;
}

function esRutaDirecta(pathname, search) {
  const path = String(pathname || "/");
  const params = new URLSearchParams(search || "");
  if (params.get("persona")) return true;
  if (/^\/(?:es\/)?(?:persona|dinastia|territorio|historia)\//.test(path)) return true;
  if (/^\/en\/(?:person|dynasty|territory|story)\//.test(path)) return true;
  return !["/", "/es", "/es/", "/en", "/en/"].includes(path);
}

function normalizaRutaLigera() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;
  if (pathname === "/") {
    window.history.replaceState(window.history.state, "", `/es/${search}${hash}`);
    return;
  }
  if (/^\/(es|en)(?:\/|$)/.test(pathname)) return;
  if (/^\/(persona|dinastia|territorio|historia)(?:\/|$)/.test(pathname)) {
    window.history.replaceState(window.history.state, "", `/es${pathname}${search}${hash}`);
  }
}

function formatoFecha(valor, aproximada) {
  return Number.isFinite(valor) ? `${aproximada ? "c. " : ""}${valor}` : "?";
}

function textoFechas(persona) {
  if (!persona) return "Fechas no documentadas";
  return `${formatoFecha(persona.nac, persona.nacAprox)} – ${formatoFecha(persona.muer, persona.muerAprox)}`;
}

function resumenPersona(persona) {
  if (!persona) return "";
  if (persona.biografia) return persona.biografia;
  const partes = [persona.titulo, ...(persona.reinos || [])].filter(Boolean);
  return partes.length
    ? `${persona.nombre} · ${partes.join(" · ")}.`
    : `Ficha histórica de ${persona.nombre} en El Árbol de Europa.`;
}

function slugPublico(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "entidad";
}

function rutaEntidadEs(tipo, slug) {
  const segmentos = { persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" };
  const segmento = segmentos[tipo];
  return segmento && slug ? `/es/${segmento}/${encodeURIComponent(slug)}` : "/es/";
}

function ensureMetaTag(selector, attributes) {
  if (typeof document === "undefined") return null;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

function setMetaContent(selector, attributes, content) {
  const element = ensureMetaTag(selector, attributes);
  if (element) element.setAttribute("content", content);
}

function ensureCanonical(href) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setHreflangAlternates(items) {
  if (typeof document === "undefined") return;
  document.head.querySelectorAll('link[data-eade-hreflang="1"]').forEach((node) => node.remove());
  items.filter((item) => item?.hreflang && item?.href).forEach((item) => {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", item.hreflang);
    link.setAttribute("href", item.href);
    link.setAttribute("data-eade-hreflang", "1");
    document.head.appendChild(link);
  });
}

function EnlacesPersonas({ personas, limite = null }) {
  const lista = Array.isArray(personas) ? personas : [];
  const visibles = Number.isFinite(limite) ? lista.slice(0, limite) : lista;
  return (
    <>
      {visibles.map((persona, index) => (
        <React.Fragment key={persona.id || `${persona.nombre}-${index}`}>
          {index > 0 && " · "}
          {persona.slug ? <a href={rutaEntidadEs("persona", persona.slug)}>{persona.nombre}</a> : <span>{persona.nombre}</span>}
        </React.Fragment>
      ))}
      {Number.isFinite(limite) && lista.length > limite ? ` · +${lista.length - limite}` : ""}
    </>
  );
}

function EnlacesValores({ valores, tipo }) {
  const lista = Array.isArray(valores) ? valores.filter(Boolean) : [];
  return (
    <>
      {lista.map((valor, index) => (
        <React.Fragment key={`${tipo}-${valor}`}>
          {index > 0 && " · "}
          <a href={rutaEntidadEs(tipo, slugPublico(valor))}>{valor}</a>
        </React.Fragment>
      ))}
    </>
  );
}

function Welcome({ onEnter, onOpen }) {
  return (
    <div className="welcome-cover" role="dialog" aria-modal="true" aria-label="Bienvenida a El Árbol de Europa">
      <div className="welcome-card">
        <Crown size={28} className="welcome-crown" />
        <div className="welcome-eyebrow">Genealogía histórica interactiva</div>
        <h2>El Árbol de Europa</h2>
        <p>Explora dinastías, parentescos, reinados y territorios de la Europa medieval y moderna en una única red navegable.</p>
        <div className="welcome-stats">
          <span><strong>{SITE_META.personCount}</strong> personas</span>
          <span><strong>1200–1800</strong> periodo principal</span>
        </div>
        <div className="welcome-actions">
          <button type="button" className="welcome-enter" onClick={onEnter}>Explorar el árbol <ArrowRight size={15} /></button>
          <button type="button" className="welcome-history" onClick={() => onOpen("historias")}><BookOpen size={14} /> Historias guiadas</button>
        </div>
        <div className="welcome-links">
          <button type="button" onClick={() => onOpen("acerca")}>Acerca del proyecto</button>
          <button type="button" onClick={() => onOpen("estadisticas")}>Estadísticas</button>
          <button type="button" onClick={() => onOpen("fuentes")}>Fuentes y metodología</button>
          <button type="button" onClick={() => onOpen("agradecimientos")}>Agradecimientos</button>
        </div>
        <div className="welcome-map-credit">Cartografía base: <a href="https://www.mapchart.net/" target="_blank" rel="noreferrer">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></div>
      </div>
    </div>
  );
}

function PersonWelcome({ slug, legacyId, onExplore }) {
  const [persona, setPersona] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPersona(null);
    setError(false);

    async function cargar() {
      try {
        let resolvedSlug = slug;
        if (!resolvedSlug && legacyId) {
          const indexResponse = await fetch(`/personas-meta/index.json?v=${encodeURIComponent(SITE_META.buildVersion || SITE_META.personCount)}`, { credentials: "same-origin", cache: "no-store" });
          if (!indexResponse.ok) throw new Error(`HTTP ${indexResponse.status}`);
          const indexType = indexResponse.headers.get("content-type") || "";
          if (!indexType.includes("application/json")) throw new Error("Índice no JSON");
          const index = await indexResponse.json();
          resolvedSlug = index[legacyId] || null;
        }
        if (!resolvedSlug) throw new Error("Persona no localizada");
        const metaUrl = `/personas-meta/${encodeURIComponent(resolvedSlug)}.json?v=${encodeURIComponent(SITE_META.buildVersion || SITE_META.personCount)}`;
        let lastError = null;
        for (let intento = 0; intento < 3; intento += 1) {
          try {
            const response = await fetch(metaUrl, { credentials: "same-origin", cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) throw new Error("Respuesta no JSON");
            const data = await response.json();
            if (!cancelled) setPersona(data);
            return;
          } catch (err) {
            lastError = err;
            if (intento < 2) await new Promise((resolve) => setTimeout(resolve, intento === 0 ? 180 : 520));
          }
        }
        throw lastError || new Error("Persona no localizada");
      } catch {
        if (!cancelled) setError(true);
      }
    }

    cargar();
    return () => { cancelled = true; };
  }, [slug, legacyId]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || !persona) return;

    const pageTitle = `${persona.nombre} — El Árbol de Europa`;
    const description = resumenPersona(persona).replace(/\s+/g, " ").trim().slice(0, 155);
    const canonicalPath = rutaEntidadEs("persona", persona.slug || slug || slugPublico(persona.nombre));
    const canonicalUrl = new URL(canonicalPath, PUBLIC_SITE_URL || window.location.origin).toString();

    document.documentElement.lang = "es";
    document.title = pageTitle;
    setMetaContent('meta[name="description"]', { name: "description" }, description);
    setMetaContent('meta[property="og:site_name"]', { property: "og:site_name" }, "El Árbol de Europa");
    setMetaContent('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
    setMetaContent('meta[property="og:type"]', { property: "og:type" }, "website");
    setMetaContent('meta[property="og:locale"]', { property: "og:locale" }, "es_ES");
    setMetaContent('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMetaContent('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    ensureCanonical(canonicalUrl);
    setHreflangAlternates([
      { hreflang: "es", href: canonicalUrl },
      { hreflang: "x-default", href: canonicalUrl },
    ]);
  }, [persona, slug]);

  const padres = persona?.padres || [];
  const conyuges = persona?.conyuges || [];
  const hijos = persona?.hijos || [];

  return (
    <main className="welcome-cover person-welcome-page" aria-label={persona ? `Ficha de ${persona.nombre}` : "Ficha de persona"}>
      <article className="welcome-card person-welcome-card">
        <Crown size={28} className="welcome-crown" />
        <div className="welcome-eyebrow">El Árbol de Europa · Persona</div>

        {!persona && !error && (
          <>
            <h1>Cargando ficha…</h1>
            <p>Preparando la información biográfica.</p>
          </>
        )}

        {error && (
          <>
            <h1>Ficha histórica</h1>
            <p>No se ha podido cargar la portada ligera de esta persona. El atlas completo sigue disponible.</p>
            <div className="welcome-actions">
              <button type="button" className="welcome-enter" onClick={onExplore}>Abrir en el atlas <ArrowRight size={15} /></button>
            </div>
          </>
        )}

        {persona && (
          <>
            <h1>{persona.nombre}</h1>
            {persona.sobrenombre && (
              <div style={{ marginTop: -4, marginBottom: 10, color: "#7A2E2E", fontSize: 12, fontWeight: 600 }}>«{persona.sobrenombre}»</div>
            )}
            <p>{resumenPersona(persona)}</p>

            <div className="welcome-stats person-welcome-stats">
              <span><strong>{textoFechas(persona)}</strong> fechas</span>
              {persona.dinastia && (
                <span><strong><a href={rutaEntidadEs("dinastia", slugPublico(persona.dinastia))}>{persona.dinastia}</a></strong> dinastía</span>
              )}
            </div>

            <section className="person-welcome-details" aria-label={`Datos y relaciones de ${persona.nombre}`}>
              {persona.titulo && <div><strong>Título:</strong> {persona.titulo}</div>}
              {(persona.reinos || []).length > 0 && <div><strong>Territorios:</strong> <EnlacesValores valores={persona.reinos} tipo="territorio" /></div>}
              {padres.length > 0 && <div><strong>Padres:</strong> <EnlacesPersonas personas={padres} /></div>}
              {conyuges.length > 0 && <div><strong>Cónyuge{conyuges.length > 1 ? "s" : ""}:</strong> <EnlacesPersonas personas={conyuges} /></div>}
              {hijos.length > 0 && <div><strong>Descendencia registrada:</strong> <EnlacesPersonas personas={hijos} limite={6} /></div>}
            </section>

            <div className="welcome-actions" style={{ marginTop: 26 }}>
              <button type="button" className="welcome-enter" onClick={onExplore}>Explorar a {persona.nombre} en el atlas <ArrowRight size={15} /></button>
            </div>

            <nav className="welcome-links" aria-label="Navegación del proyecto">
              <a href="/es/">Portada del proyecto</a>
            </nav>

            <div className="welcome-map-credit">La ficha completa, el árbol, el mapa, la cronología y las relaciones se cargan solo al abrir el atlas.</div>
          </>
        )}
      </article>
    </main>
  );
}

function EnglishLanding() {
  const irAEspanol = useCallback(() => {
    if (typeof window !== "undefined") window.location.assign("/es/");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = "en";
    document.title = "The Tree of Europe | Interactive historical and genealogical atlas";
  }, []);

  return (
    <div className="wrap">
      <div className="header" style={{ position: "relative" }}>
        <div style={{ textAlign: "center" }}>
          <h1>The Tree of Europe</h1>
          <div className="sub">Genealogy · Dynasties · Reigns · Territories · 1200–1800</div>
        </div>
        <div aria-label="Idioma / Language" style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 5, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 10, color: "#9A8E75" }}>
          <button type="button" onClick={irAEspanol} style={{ border: 0, background: "transparent", padding: "2px 3px", cursor: "pointer", font: "inherit", fontWeight: 600, color: "#8A7F65" }}>ES</button>
          <span aria-hidden="true">|</span>
          <button type="button" aria-current="page" style={{ border: 0, background: "transparent", padding: "2px 3px", font: "inherit", fontWeight: 800, color: "#7A2E2E" }}>EN</button>
        </div>
      </div>
      <main style={{ maxWidth: 760, margin: "70px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#8A7F65" }}>English edition</div>
        <h2 style={{ margin: "12px 0", fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 500, lineHeight: 1.05, color: "#2C2620" }}>The Tree of Europe</h2>
        <p style={{ margin: "0 auto", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#6B6350" }}>An interactive historical and genealogical atlas for exploring the families, dynasties, reigns and political connections that shaped Europe.</p>
        <p style={{ margin: "18px auto 28px", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 13, lineHeight: 1.6, color: "#8A7F65" }}>The English edition is being prepared progressively. The complete interactive application is currently available in Spanish.</p>
        <button type="button" onClick={irAEspanol} style={{ border: "1px solid #7A2E2E", borderRadius: 4, background: "#7A2E2E", color: "#F8F3E6", padding: "10px 16px", cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 12, fontWeight: 700 }}>Explore the Spanish version</button>
      </main>
    </div>
  );
}

export default function App() {
  const initial = useMemo(() => {
    if (typeof window === "undefined") return { locale: "es", entered: false, personSlug: null, legacyPersonId: null };
    const locale = localeDesdePath(window.location.pathname);
    if (locale === "en") return { locale, entered: false, personSlug: null, legacyPersonId: null };
    const personSlug = slugPersonaDesdePath(window.location.pathname);
    const legacyPersonId = personaIdLegacyDesdeSearch(window.location.search);
    const direct = esRutaDirecta(window.location.pathname, window.location.search);
    let visited = false;
    try { visited = window.localStorage.getItem(PORTADA_STORAGE_KEY) === "1"; } catch { /* noop */ }
    const personLanding = Boolean(personSlug || legacyPersonId);
    return { locale, entered: personLanding ? false : (direct || visited), personSlug, legacyPersonId };
  }, []);

  const [entered, setEntered] = useState(initial.entered);
  const [personExplorerRequested, setPersonExplorerRequested] = useState(false);
  const [initialPanel, setInitialPanel] = useState(null);

  useEffect(() => {
    normalizaRutaLigera();
    if (initial.locale === "es" && typeof document !== "undefined") document.documentElement.lang = "es";
  }, [initial.locale]);

  const entrar = useCallback((panel = null) => {
    try { window.localStorage.setItem(PORTADA_STORAGE_KEY, "1"); } catch { /* noop */ }
    setInitialPanel(panel);
    setEntered(true);
  }, []);

  const explorarPersona = useCallback(() => {
    try { window.localStorage.setItem(PORTADA_STORAGE_KEY, "1"); } catch { /* noop */ }
    setPersonExplorerRequested(true);
    setEntered(true);
  }, []);

  if (initial.locale === "en") return <EnglishLanding />;
  if ((initial.personSlug || initial.legacyPersonId) && !personExplorerRequested) return <PersonWelcome slug={initial.personSlug} legacyId={initial.legacyPersonId} onExplore={explorarPersona} />;
  if (!entered) return <Welcome onEnter={() => entrar(null)} onOpen={entrar} />;

  return (
    <Suspense fallback={null}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
