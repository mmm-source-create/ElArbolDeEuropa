import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CatalogPage, HomePage, InfoPage, PersonPage } from "./public/PublicSite.jsx";

import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import "./styles/theme.css";

const DynastyPage = lazy(() => import("./public/DynastyPage.jsx"));
const TerritoryPage = lazy(() => import("./public/TerritoryPage.jsx").then(m => ({ default: m.TerritoryPage })));
const Explorer = lazy(() => import("./explorer/AtlasLoader.jsx"));
const DesafioPage = lazy(() => import("./desafio/DesafioPage.jsx"));

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

function esRutaDesafio(pathname) {
  return /^\/es\/desafio\/?$/.test(String(pathname || "/"));
}


function infoDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/es\/(proyecto|fuentes|licencias|agradecimientos)\/?$/);
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
    <div className="public-site">
      <SiteHeader locale="en" />
      <main style={{ maxWidth: 760, margin: "70px auto", textAlign: "center", padding: "0 24px 70px" }}>
        <div style={{ fontFamily: "var(--eade-sans)", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "var(--eade-muted-soft)" }}>English edition</div>
        <h1 style={{ margin: "12px 0", fontFamily: "var(--eade-serif)", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 500, lineHeight: 1.05, color: "var(--eade-ink)" }}>The Tree of Europe</h1>
        <p style={{ margin: "0 auto", maxWidth: 620, fontFamily: "var(--eade-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--eade-muted)" }}>An interactive historical and genealogical atlas for exploring the families, dynasties, reigns and political connections that shaped Europe.</p>
        <p style={{ margin: "18px auto 28px", maxWidth: 620, fontFamily: "var(--eade-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--eade-muted-soft)" }}>The English edition is being prepared progressively. The complete interactive application is currently available in Spanish.</p>
        <a className="public-primary" href="/es/">Explore the Spanish version <ArrowRight size={14} /></a>
      </main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  const initial = useMemo(() => {
    if (typeof window === "undefined") return { locale: "es", view: "home", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };
    const rawPathname = window.location.pathname;
    const pathname = rawPathname === "/"
      ? "/es/"
      : /^\/(persona|dinastia|territorio|historia)(?:\/|$)/.test(rawPathname)
        ? `/es${rawPathname}`
        : rawPathname;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const locale = localeDesdePath(pathname);
    if (locale === "en") return { locale, view: "english", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };

    const personSlug = slugPersonaDesdePath(pathname);
    const legacyPersonId = personaIdLegacyDesdeSearch(search);
    const catalog = catalogoDesdePath(pathname);
    const info = infoDesdePath(pathname);
    const atlasRequested = params.get("atlas") === "1";
    const dynastyMatch = pathname.match(/^\/es\/dinastia\/([^/]+)\/?$/);
    if (dynastyMatch && !atlasRequested) return { locale, view: "dynasty", dynastySlug: decodeURIComponent(dynastyMatch[1]) };
    const territoryMatch = pathname.match(/^\/es\/territorio\/([^/]+)\/?$/);
    if (territoryMatch && !atlasRequested) return { locale, view: "territory", territorySlug: decodeURIComponent(territoryMatch[1]) };
    const panel = params.get("panel") || null;

    if (esRutaDesafio(pathname) || (["/", "/es", "/es/"].includes(pathname) && panel === "desafio")) {
      return { locale, view: "desafio", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };
    }
    if ((personSlug || legacyPersonId) && !atlasRequested) return { locale, view: "person", personSlug, legacyPersonId, catalog: null, info: null, panel: null };
    if (catalog && !atlasRequested) return { locale, view: "catalog", personSlug: null, legacyPersonId: null, catalog, info: null, panel: null };
    if (info && !atlasRequested) return { locale, view: "info", personSlug: null, legacyPersonId: null, catalog: null, info, panel: null };
    if (["/", "/es", "/es/"].includes(pathname) && !atlasRequested && !panel) return { locale, view: "home", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };
    return { locale, view: "explorer", personSlug, legacyPersonId, catalog: null, info: null, panel };
  }, []);

  const [explorerRequested, setExplorerRequested] = useState(initial.view === "explorer");
  const [initialPanel, setInitialPanel] = useState(initial.panel || null);

  useEffect(() => {
    normalizaRutaLigera();
    if (typeof document !== "undefined" && initial.locale === "es") document.documentElement.lang = "es";
  }, [initial.locale]);

  const entrarAtlas = useCallback((panel = null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("atlas", "1");
    if (initial.view === "home") url.searchParams.set("continuar", "1");
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    setInitialPanel(panel);
    setExplorerRequested(true);
  }, [initial.view]);

  if (!explorerRequested && initial.view === "dynasty") return <Suspense fallback={<p role="status">Cargando dinastía…</p>}><DynastyPage slug={initial.dynastySlug} /></Suspense>;
  if (!explorerRequested && initial.view === "territory") return <Suspense fallback={<p role="status">Cargando territorio…</p>}><TerritoryPage slug={initial.territorySlug} /></Suspense>;
  if (initial.view === "english") return <EnglishLanding />;
  if (initial.view === "desafio") {
    return (
      <Suspense fallback={null}>
        <DesafioPage />
      </Suspense>
    );
  }
  if (!explorerRequested && initial.view === "person") return <PersonPage slug={initial.personSlug} legacyId={initial.legacyPersonId} onExplore={() => entrarAtlas(null)} />;
  if (!explorerRequested && initial.view === "catalog") return <CatalogPage tipo={initial.catalog} />;
  if (!explorerRequested && initial.view === "info") return <InfoPage tipo={initial.info} />;
  if (!explorerRequested && initial.view === "home") return <HomePage onEnterAtlas={entrarAtlas} onOpenPanel={entrarAtlas} />;

  return (
    <Suspense fallback={<p role="status" style={{ padding: 24 }}>Cargando Atlas…</p>}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
