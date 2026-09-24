import {resolverRuta} from "./routing.js";
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { CatalogPage, HomePage, InfoPage, PersonPage } from "./public/PublicSite.jsx";

import AtlasSkeleton from "./explorer/AtlasSkeleton.jsx";
import ReadingSkeleton from "./stories/ReadingSkeleton.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import EnglishLanding from "./public/EnglishLanding.jsx";
import NotFoundPage from "./public/NotFoundPage.jsx";
import PrivacyPage from './public/PrivacyPage.jsx';
import "./styles/theme.css";

const EmbedPage = lazy(() => import("./embed/EmbedPage.jsx"));
const StoryPage = lazy(() => import("./stories/StoryPage.jsx"));
const DynastyPage = lazy(() => import("./public/DynastyPage.jsx"));
const TerritoryPage = lazy(() => import("./public/TerritoryPage.jsx").then(m => ({ default: m.TerritoryPage })));
const Explorer = lazy(() => import("./explorer/AtlasLoader.jsx"));
const DesafioPage = lazy(() => import("./desafio/DesafioPage.jsx"));
const RendererLab = lazy(() => import("./lab/RendererLab.jsx"));

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

export default function App() {
  const initial = useMemo(() => typeof window === "undefined" ? resolverRuta() : resolverRuta(window.location.pathname, window.location.search), []);

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

  if (typeof window !== "undefined" && /^\/es\/laboratorio-render\/?$/.test(window.location.pathname)) {
    return <Suspense fallback={<AtlasSkeleton/>}><RendererLab /></Suspense>;
  }

  if (initial.view === "embed") return <Suspense fallback={<p role="status">Preparando ficha…</p>}><EmbedPage personId={initial.personId}/></Suspense>;
  if (!explorerRequested && initial.view === "story") return <Suspense fallback={<div className="public-site"><SiteHeader/><main className="public-main story-page"><ReadingSkeleton/></main></div>}><StoryPage slug={initial.storySlug} chapter={initial.chapter}/></Suspense>;
  if (!explorerRequested && initial.view === "dynasty") return <Suspense fallback={<p role="status">Cargando dinastía…</p>}><DynastyPage slug={initial.dynastySlug} /></Suspense>;
  if (!explorerRequested && initial.view === "territory") return <Suspense fallback={<p role="status">Cargando territorio…</p>}><TerritoryPage slug={initial.territorySlug} /></Suspense>;
  if (initial.view === "english") return <EnglishLanding />;
  if (initial.view === "not-found") return <NotFoundPage locale={initial.locale} />;
  if (initial.view === 'privacy') return <PrivacyPage locale={initial.locale}/>;
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
    <Suspense fallback={<AtlasSkeleton/>}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
