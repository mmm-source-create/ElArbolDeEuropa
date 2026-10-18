import {resolverRuta} from "./routing.js";
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { HomePage } from "../features/public/HomePage.jsx";

import AtlasSkeleton from "../features/atlas/AtlasSkeleton.jsx";
import ReadingSkeleton from "../features/stories/ReadingSkeleton.jsx";
import { englishRoute, englishSkeletonKind } from "../features/english/routes.js";
import SiteHeader from "../components/SiteHeader.jsx";
import NotFoundPage from "../features/public/NotFoundPage.jsx";
import PrivacyPage from '../features/public/PrivacyPage.jsx';
import "../styles/theme.css";

const EmbedPage = lazy(() => import("../features/embed/EmbedPage.jsx"));
const EnglishPage = lazy(() => import("../features/english/EnglishPage.jsx"));
const StoryPage = lazy(() => import("../features/stories/StoryPage.jsx"));
const DynastyPage = lazy(() => import("../features/public/DynastyPage.jsx"));
const TerritoryPage = lazy(() => import("../features/public/TerritoryPage.jsx").then(m => ({ default: m.TerritoryPage })));
const Explorer = lazy(() => import("../features/atlas/AtlasLoader.jsx"));
const DesafioPage = lazy(() => import("../features/desafio/DesafioPage.jsx"));
// Fichas, índices y páginas informativas cargan su propio chunk: la portada no los necesita.
const publicPage = name => lazy(() => import("../features/public/PublicSite.jsx").then(m => ({ default: m[name] })));
const PersonPage = publicPage("PersonPage");
const CatalogPage = publicPage("CatalogPage");
const InfoPage = publicPage("InfoPage");
// Mientras llega el chunk, el esqueleto tiene la forma de la página que se abre.
const readingFallback = (kind, locale = "es") => <div className="public-site"><SiteHeader locale={locale}/><main className={`public-main${kind === "story" ? " story-page" : ""}`}><ReadingSkeleton locale={locale} kind={kind}/></main></div>;

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

  if (initial.view === "embed") return <Suspense fallback={<p role="status">Preparando ficha…</p>}><EmbedPage personId={initial.personId}/></Suspense>;
  if (!explorerRequested && initial.view === "story") return <Suspense fallback={<div className="public-site"><SiteHeader/><main className="public-main story-page"><ReadingSkeleton/></main></div>}><StoryPage slug={initial.storySlug} chapter={initial.chapter}/></Suspense>;
  if (!explorerRequested && initial.view === "dynasty") return <Suspense fallback={readingFallback("entity")}><DynastyPage slug={initial.dynastySlug} /></Suspense>;
  if (!explorerRequested && initial.view === "territory") return <Suspense fallback={readingFallback("entity")}><TerritoryPage slug={initial.territorySlug} /></Suspense>;
  if (initial.view === "english") return <Suspense fallback={readingFallback(englishSkeletonKind(englishRoute(window.location.pathname)), "en")}><EnglishPage /></Suspense>;
  if (initial.view === "not-found") return <NotFoundPage locale={initial.locale} />;
  if (initial.view === 'privacy') return <PrivacyPage locale={initial.locale}/>;
  if (initial.view === "desafio") {
    return (
      <Suspense fallback={<SiteHeader />}>
        <DesafioPage />
      </Suspense>
    );
  }
  if (!explorerRequested && initial.view === "person") return <Suspense fallback={readingFallback("person")}><PersonPage slug={initial.personSlug} legacyId={initial.legacyPersonId} onExplore={() => entrarAtlas(null)} /></Suspense>;
  if (!explorerRequested && initial.view === "catalog") return <Suspense fallback={readingFallback("catalog")}><CatalogPage tipo={initial.catalog} /></Suspense>;
  if (!explorerRequested && initial.view === "info") return <Suspense fallback={readingFallback("methodology")}><InfoPage tipo={initial.info} /></Suspense>;
  if (!explorerRequested && initial.view === "home") return <HomePage onEnterAtlas={entrarAtlas} onOpenPanel={entrarAtlas} />;

  return (
    <Suspense fallback={<AtlasSkeleton/>}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
