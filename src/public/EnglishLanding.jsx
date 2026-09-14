import React, {useEffect} from "react";
import {ArrowRight} from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import {SITE_NAME_EN} from "../siteConfig.js";

export default function EnglishLanding() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = "en";
    document.title = `${SITE_NAME_EN} | Interactive historical and genealogical atlas`;
  }, []);

  return (
    <div className="public-site">
      <SiteHeader locale="en" />
      <main style={{ maxWidth: 760, margin: "70px auto", textAlign: "center", padding: "0 24px 70px" }}>
        <div style={{ fontFamily: "var(--eade-sans)", fontSize: 10, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "var(--eade-muted-soft)" }}>English edition</div>
        <h1 style={{ margin: "12px 0", fontFamily: "var(--eade-serif)", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 500, lineHeight: 1.05, color: "var(--eade-ink)" }}>{SITE_NAME_EN}</h1>
        <p style={{ margin: "0 auto", maxWidth: 620, fontFamily: "var(--eade-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--eade-muted)" }}>An interactive historical and genealogical atlas for exploring the families, dynasties, reigns and political connections that shaped Europe.</p>
        <p style={{ margin: "18px auto 28px", maxWidth: 620, fontFamily: "var(--eade-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--eade-muted-soft)" }}>The English edition is being prepared progressively. The complete interactive application is currently available in Spanish.</p>
        <a className="public-primary" href="/es/">Explore the Spanish version <ArrowRight size={14} /></a>
      </main>
      <SiteFooter />
    </div>
  );
}
