import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Crown } from "lucide-react";
import SITE_META from "./generated/siteMeta.json";
import "./App.css";

const Explorer = lazy(() => import("./Explorer.jsx"));
const PORTADA_STORAGE_KEY = "arbol-europa-portada-v1";

function localeDesdePath(pathname) {
  return /^\/en(?:\/|$)/.test(String(pathname || "")) ? "en" : "es";
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
    if (typeof window === "undefined") return { locale: "es", entered: false };
    const locale = localeDesdePath(window.location.pathname);
    if (locale === "en") return { locale, entered: false };
    const direct = esRutaDirecta(window.location.pathname, window.location.search);
    let visited = false;
    try { visited = window.localStorage.getItem(PORTADA_STORAGE_KEY) === "1"; } catch { /* noop */ }
    return { locale, entered: direct || visited };
  }, []);

  const [entered, setEntered] = useState(initial.entered);
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

  if (initial.locale === "en") return <EnglishLanding />;
  if (!entered) return <Welcome onEnter={() => entrar(null)} onOpen={entrar} />;

  return (
    <Suspense fallback={null}>
      <Explorer initialPanel={initialPanel} />
    </Suspense>
  );
}
