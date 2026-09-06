import React, { useEffect } from "react";
import { PERSONAS } from "../personas.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Desafio from "./Desafio.jsx";

const SITE_URL = String(import.meta.env.VITE_SITE_URL || "https://www.treeofeurope.eu").replace(/\/+$/, "");

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

export default function DesafioPage() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = "es";
    document.title = "Desafío — El Árbol de Europa";
    let meta = document.head.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Pon a prueba lo que sabes de las familias, reinados, dinastías y cronología de Europa con El Camino, Racha y el Desafío diario.");
    ensureCanonical(`${SITE_URL}/es/desafio`);
  }, []);

  return (
    <div className="desafio-page">
      <SiteHeader />
      <main className="desafio-page-main">
        <nav className="desafio-breadcrumbs" aria-label="Migas de pan">
          <a href="/es/">Inicio</a><span aria-hidden="true">›</span><span aria-current="page">Desafío</span>
        </nav>
        <Desafio personas={PERSONAS} />
      </main>
      <SiteFooter />
    </div>
  );
}
