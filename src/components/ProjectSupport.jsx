import React from 'react';
import {ExternalLink, Heart} from 'lucide-react';
import {SUPPORT_URL} from '../siteConfig.js';
import './project-support.css';

const COPY = {
  es: {
    label: 'Apoyar el proyecto',
    title: 'Un atlas gratuito, con apoyo voluntario',
    description: 'El Árbol de Europa es gratuito. Si te resulta útil, puedes apoyar voluntariamente su creación y mantenimiento a través de Ko-fi. Tu aportación no compra productos, servicios ni acceso exclusivo, y puedes utilizar el atlas sin aportar dinero.',
    button: 'Apoyar en Ko-fi',
    external: 'Abre Ko-fi en otra pestaña',
    note: 'La aportación se realiza fuera de esta web, en Ko-fi.',
  },
  en: {
    label: 'Support the project',
    title: 'A free atlas, with optional support',
    description: 'The Tree of Europe is free. If you find it useful, you can voluntarily support its creation and maintenance through Ko-fi. Your contribution does not purchase products, services or exclusive access, and you can use the atlas without contributing.',
    button: 'Support on Ko-fi',
    external: 'Opens Ko-fi in a new tab',
    note: 'Contributions are made outside this website, on Ko-fi.',
  },
};

export function ProjectSupportLink({locale = 'es', prominent = false}) {
  const copy = COPY[locale === 'en' ? 'en' : 'es'];
  const label = prominent ? copy.button : copy.label;
  return <a className={`project-support-link${prominent ? ' is-prominent' : ''}`}
    href={SUPPORT_URL} target="_blank" rel="noopener noreferrer"
    aria-label={`${label} — ${copy.external}`}>
    <Heart size={14} aria-hidden="true" />
    <span>{label}</span>
    <ExternalLink size={12} aria-hidden="true" />
  </a>;
}

export default function ProjectSupport({locale = 'es'}) {
  const copy = COPY[locale === 'en' ? 'en' : 'es'];
  return <section className="public-info-card project-support-card">
    <h2>{copy.title}</h2>
    <p>{copy.description}</p>
    <ProjectSupportLink locale={locale} prominent />
    <p className="project-support-note">{copy.note}</p>
  </section>;
}
