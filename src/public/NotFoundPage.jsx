import React, {useEffect} from 'react';
import {ArrowRight, BookOpen, Compass, Home} from 'lucide-react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import {usePublicMeta} from './PublicSite.jsx';
import './public.css';

const COPY = {
  es: {
    eyebrow: 'Error 404',
    title: 'Esta rama no existe',
    text: 'La dirección puede haber cambiado o apuntar a una ficha que todavía no forma parte del árbol.',
    home: 'Volver a la portada',
    stories: 'Explorar historias',
    atlas: 'Abrir el Atlas',
    description: 'Página no encontrada en El Árbol de Europa.',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'This branch does not exist',
    text: 'The address may have changed or point to a profile that is not yet part of the tree.',
    home: 'Return home',
    stories: 'Explore stories',
    atlas: 'Open the Atlas',
    description: 'Page not found in The Tree of Europe.',
  },
};

export default function NotFoundPage({locale = 'es'}) {
  const english = locale === 'en';
  const copy = COPY[english ? 'en' : 'es'];
  const home = english ? '/en/' : '/es/';
  const stories = english ? '/en/stories' : '/es/historias';
  usePublicMeta({title: `${copy.eyebrow} — ${copy.title}`, description: copy.description, path: english ? '/en/404' : '/es/404'});
  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex,follow');
    return () => { if (created) robots.remove(); };
  }, []);

  return <div className="public-site">
    <SiteHeader locale={locale} pathname={english ? '/en/404' : '/es/404'} />
    <main className="public-main public-not-found">
      <section aria-labelledby="not-found-title">
        <span>{copy.eyebrow}</span>
        <div className="public-not-found-mark" aria-hidden="true"><span>4</span><Compass size={58}/><span>4</span></div>
        <h1 id="not-found-title">{copy.title}</h1>
        <p>{copy.text}</p>
        <div className="public-hero-actions">
          <a className="public-primary" href={home}><Home size={15}/>{copy.home}</a>
          <a className="public-secondary" href={stories}><BookOpen size={15}/>{copy.stories}</a>
          <a className="public-not-found-atlas" href="/es/?atlas=1&continuar=1">{copy.atlas}<ArrowRight size={14}/></a>
        </div>
      </section>
    </main>
    <SiteFooter locale={locale}/>
  </div>;
}
