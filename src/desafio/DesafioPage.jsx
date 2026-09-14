import {ensureCanonical} from "../public/headMetadata.js";
import {resolveSiteUrl, SITE_NAME} from "../siteConfig.js";
import "../App.css";
import React, { useEffect } from "react";
import { PERSONAS } from "../personas.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import Desafio from "./Desafio.jsx";

const SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL);

export default function DesafioPage() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = "es";
    document.title = `Desafío — ${SITE_NAME}`;
    let meta = document.head.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Pon a prueba lo que sabes de las familias, reinados, dinastías y cronología de Europa con El Camino, Racha, Retratos, sucesiones documentadas, repaso de errores y desafíos compartidos.");
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
