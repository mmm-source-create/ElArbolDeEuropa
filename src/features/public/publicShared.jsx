import {resolveSiteUrl} from '../../app/siteConfig.js';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import {IMAGENES_PERSONAS} from '../../data/imagenesPersonas.js';
import {documentaryLife} from '../../domain/time/documentaryDates.js';
import SITE_META from '../../generated/siteMeta.json';
import {loadJsonAsset} from '../../utils/loadAsset.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import {setMetaContent, ensureCanonical, setHreflangAlternates} from './headMetadata.js';
import {publicMeta} from './publicMeta.js';
import {Crown, ArrowRight} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import './public.css';

// Piezas comunes de las páginas públicas: metadatos, carga de JSON, maqueta y tarjetas.

const PUBLIC_SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL);
const BUILD_VERSION = String(SITE_META.buildVersion || SITE_META.personCount || "v2");


export function rutaEntidad(tipo, slug, { atlas = false } = {}) {
  const segmentos = { persona: "persona", dinastia: "dinastia", territorio: "territorio", historia: "historia" };
  const segmento = segmentos[tipo];
  if (!segmento || !slug) return "/es/";
  return `/es/${segmento}/${encodeURIComponent(slug)}${atlas ? "?atlas=1" : ""}`;
}

function textoFechas(persona) { return persona ? documentaryLife(persona) : "Fechas no documentadas"; }
export function personaDates(persona, locale) { return locale === 'en' ? textoFechas(persona).replaceAll('antes de ', 'before ').replaceAll('después de ', 'after ').replace('Fechas no documentadas', 'Dates not recorded') : textoFechas(persona); }


export function usePublicMeta({ title, description, path, image, imageAlt }) {
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    const metadata=publicMeta({title,description,path,...(image?{image,imageAlt}:{})},PUBLIC_SITE_URL);
    document.documentElement.lang=metadata.lang;
    document.title=metadata.title;
    for(const [attribute,key,value] of metadata.meta)setMetaContent(`meta[${attribute}="${key}"]`,{[attribute]:key},value);
    ensureCanonical(metadata.canonical);
    setHreflangAlternates(metadata.alternates);
  }, [title, description, path, image, imageAlt]);
}

export function useJson(path, initialData = null) {
  const [state, setState] = useState(() => ({ path, loading: !initialData, data: initialData, error: false }));
  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setState({ path, loading: true, data: null, error: false });
    loadJsonAsset(`${path}?v=${encodeURIComponent(BUILD_VERSION)}`)
      .then((data) => { if (!cancelled) setState({ path, loading: false, data, error: false }); })
      .catch(() => { if (!cancelled) setState({ path, loading: false, data: null, error: true }); });
    return () => { cancelled = true; };
  }, [path, initialData]);
  return initialData ? {loading:false,data:initialData,error:false} : state.path===path ? state : {loading:true,data:null,error:false};
}

export function PublicLayout({ children, pathname, prerendered = false }) {
  return <div className="public-site"><SiteHeader pathname={pathname} prerendered={prerendered}/>{children}<SiteFooter /></div>;
}

export function Breadcrumbs({ items, locale = 'es' }) {
  return (
    <nav className="public-breadcrumbs" aria-label={locale === 'en' ? 'Breadcrumb' : 'Migas de pan'}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true">›</span>}
          {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PersonaMiniCard({ persona, compact = false, locale = 'es' }) {
  if (!persona) return null;
  const image = IMAGENES_PERSONAS[persona.id];
  return (
    <a className={`public-person-card${compact ? " is-compact" : ""}`} href={persona.path || rutaEntidad("persona", persona.slug)}>
      {image ? (
        <span className="public-person-thumb"><img {...responsiveImage(image.archivo, compact ? "44px" : "58px")} alt="" loading="lazy" decoding="async" style={{ objectPosition: image.encuadre || image.posicion || "50% 20%" }} /></span>
      ) : (
        <span className="public-person-thumb is-placeholder"><Crown size={18} /></span>
      )}
      <span className="public-person-copy">
        <strong>{persona.nombre}{locale==='en'&&persona.role&&(!persona.path||persona.path.startsWith('/es/'))?' · ES':''}</strong>
        {locale==='en'&&persona.path?.startsWith('/en/')&&persona.sobrenombre&&<small>“{persona.sobrenombre}”</small>}
        <small>{locale === 'en' ? persona.role || 'Historical profile · ES' : [persona.titulo, persona.dinastia].filter(Boolean).join(" · ") || "Ficha histórica"}</small>
        {(Number.isFinite(persona.nac) || Number.isFinite(persona.muer)) && <span>{personaDates(persona, locale)}</span>}
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </a>
  );
}
