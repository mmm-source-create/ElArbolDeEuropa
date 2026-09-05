import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CatalogPage, HomePage, PersonPage } from "./public/PublicSite.jsx";
import "./App.css";

const Explorer = lazy(() => import("./Explorer.jsx"));

function localeDesdePath(pathname) {
  return /^\/en(?:\/|$)/.test(String(pathname || "")) ? "en" : "es";
}

function slugPersonaDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/(?:es\/)?persona\/([^/]+)\/?$/);
  if (!match) return null;
  try { return decodeURIComponent(match[1]); } catch { return match[1]; }
}

function catalogoDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/es\/(personas|dinastias|territorios|historias)\/?$/);
  return match?.[1] || null;
}

function personaIdLegacyDesdeSearch(search) {
  const params = new URLSearchParams(search || "");
  return params.get("persona") || null;
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

function EnglishLanding() {
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
          <a href="/es/" style={{ border: 0, background: "transparent", padding: "2px 3px", cursor: "pointer", font: "inherit", fontWeight: 600, color: "#8A7F65", textDecoration: "none" }}>ES</a>
          <span aria-hidden="true">|</span>
          <span aria-current="page" style={{ padding: "2px 3px", fontWeight: 800, color: "#7A2E2E" }}>EN</span>
        </div>
      </div>
      <main style={{ maxWidth: 760, margin: "70px auto", textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#8A7F65" }}>English edition</div>
        <h2 style={{ margin: "12px 0", fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 500, lineHeight: 1.05, color: "#2C2620" }}>The Tree of Europe</h2>
        <p style={{ margin: "0 auto", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#6B6350" }}>An interactive historical and genealogical atlas for exploring the families, dynasties, reigns and political connections that shaped Europe.</p>
        <p style={{ margin: "18px auto 28px", maxWidth: 620, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 13, lineHeight: 1.6, color: "#8A7F65" }}>The English edition is being prepared progressively. The complete interactive application is currently available in Spanish.</p>
        <a href="/es/" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #7A2E2E", borderRadius: 4, background: "#7A2E2E", color: "#F8F3E6", padding: "10px 16px", textDecoration: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 12, fontWeight: 700 }}>Explore the Spanish version <ArrowRight size={14} /></a>
      </main>
    </div>
  );
}

export default function App() {
  const initial = useMemo(() => {
    if (typeof window === "undefined") return { locale: "es", view: "home", personSlug: null, legacyPersonId: null, catalog: null, panel: null };
    const rawPathname = window.location.pathname;
    const pathname = rawPathname === "/"
      ? "/es/"
      : /^\/(persona|dinastia|territorio|historia)(?:\/|$)/.test(rawPathname)
        ? `/es${rawPathname}`
        : rawPathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const locale = localeDesdePath(pathname);
    if (locale === "en") return { locale, view: "english", personSlug: null, legacyPersonId: null, catalog: null, panel: null };

    const personSlug = slugPersonaDesdePath(pathname);
    const legacyPersonId = personaIdLegacyDesdeSearch(search);
    const catalog = catalogoDesdePath(pathname);
    const atlasRequested = params.get("atlas") === "1";
    const panel = params.get("panel") || null;

    if ((personSlug || legacyPersonId) && !atlasRequested) return { locale, view: "person", personSlug, legacyPersonId, catalog: null, panel: null };
    if (catalog && !atlasRequested) return { locale, view: "catalog", personSlug: null, legacyPersonId: null, catalog, panel: null };
    if (["/", "/es", "/es/"].includes(pathname) && !atlasRequested && !panel) return { locale, view: "home", personSlug: null, legacyPersonId: null, catalog: null, panel: null };
    return { locale, view: "explorer", personSlug, legacyPersonId, catalog: null, panel };
  }, []);

  const [explorerRequested, setExplorerRequested] = useState(initial.view === "explorer");
  const [initialPanel, setInitialPanel] = useState(initial.panel || null);

  useEffect(() => {
    normalizaRutaLigera();
    if (typeof document !== "undefined" && initial.locale === "es") document.documentElement.lang = "es";
  }, [initial.locale]);

  const entrarAtlas = useCallback((panel = null) => {
    setInitialPanel(panel);
    setExplorerRequested(true);
  }, []);

  if (initial.view === "english") return <EnglishLanding />;
  if (!explorerRequested && initial.view === "person") return <PersonPage slug={initial.personSlug} legacyId={initial.legacyPersonId} onExplore={() => entrarAtlas(null)} />;
  if (!explorerRequested && initial.view === "catalog") return <CatalogPage tipo={initial.catalog} />;
  if (!explorerRequested && initial.view === "home") return <HomePage onEnterAtlas={entrarAtlas} onOpenPanel={entrarAtlas} />;

  return (
    <Suspense fallback={null}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
