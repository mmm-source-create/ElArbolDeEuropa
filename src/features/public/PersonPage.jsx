// 6.3.2: la ficha de una persona vive en su propio módulo. Al hidratar una
// ficha estática solo se carga este código: las afirmaciones, el retrato y las
// etapas de gobierno llegan calculados en los datos de la página.
import {CLAIM_TEXTS_621} from '../english/claimTexts621.js';
import {governmentDateRange, governmentCalendarLabel} from '../../domain/time/governmentDates.js';
import {isNamedDynasty} from '../../data/dynastyNames.js';
import {profileLabel,profileNote,profileClaims,profileEntityPath} from '../english/profilePresentation.js';
import {displayedNickname} from '../../domain/people/personNaming.js';
import {territoriosDe, gobiernosDe} from '../../domain/genealogy/personAccessors.js';
import {entityMeta} from './publicMeta.js';
import CrownTimelineView, {staticCrownModel} from '../../components/CrownTimelineView.jsx';
import DocumentationNotes from '../../components/DocumentationNotes.jsx';
import EvidencePanel, {EvidenceMark} from '../../components/EvidencePanel.jsx';
import {formatClaimDate} from '../../evidence/claimFormat.js';
import React, {useState, useEffect} from 'react';
import {Shield, ExternalLink, Users, ArrowRight, ArrowLeft, GitBranch} from 'lucide-react';
import {usePublicMeta, PublicLayout, Breadcrumbs, PersonaMiniCard, rutaEntidad, personaDates, BUILD_VERSION} from './publicShared.jsx';
import {etiquetaClaseGobierno} from '../../domain/people/personLabels.js';
import ReadingSkeleton from '../stories/ReadingSkeleton.jsx';
import {translatedEquivalent} from '../english/routes.js';
import {loadJsonAsset} from '../../utils/loadAsset.js';
import '../../styles/theme.css';

function Portrait({ persona, locale = 'es' }) {
  // 6.3.2: the record brings its portrait with its responsive variants.
  const image = locale === 'en' && persona.portrait || persona.retrato;
  if (!image?.archivo) return null;
  const responsive = persona.retrato?.archivo === image.archivo && persona.retrato.responsive || {src: image.archivo};
  const objectPosition = image.encuadre || image.posicion || "50% 20%";
  const zoom = Number.isFinite(image.zoom) && image.zoom > 0 ? image.zoom : 1;
  return (
    <figure className="public-portrait">
      <div className="public-portrait-frame"><img {...responsive} alt={locale === 'en' ? `Portrait of ${persona.nombre}` : image.alt || `Retrato de ${persona.nombre}`} decoding="async" fetchPriority="high" style={{ objectPosition, transform: `scale(${zoom})`, transformOrigin: objectPosition }} /></div>
      <figcaption lang={locale === 'en' ? persona.translationComplete ? 'en' : 'es' : undefined}><strong>{image.tipo}</strong><span>{image.obra}</span><span>{image.autor}{image.fecha ? ` · ${image.fecha}` : ""}</span>{image.institucion && <span>{image.institucion}</span>}<small>{image.derechos}{image.fuenteUrl && <> · <a href={image.fuenteUrl} target="_blank" rel="noreferrer">{locale === 'en' ? 'Source' : 'Fuente'} <ExternalLink size={10} /></a></>}</small>{image.alternativas?.map(work=><details className="public-portrait-alternative" key={work.archivo}><summary>{locale==='en'?'Another portrait':'Otro retrato'}</summary><img src={work.archivo} alt={work.alt} loading="lazy" decoding="async"/><span>{work.obra}</span><span>{work.autor}{work.fecha?` · ${work.fecha}`:''}</span>{work.institucion&&<span>{work.institucion}</span>}<small>{work.derechos} · <a href={work.fuenteUrl} target="_blank" rel="noreferrer">{locale==='en'?'Source':'Fuente'} <ExternalLink size={10}/></a></small></details>)}</figcaption>
    </figure>
  );
}

function RelationList({ label, items, locale = 'es', claims = [], field }) {
  if (!items?.length) return null;
  return <div className="public-relation-row"><strong>{label}</strong><div>{items.map((p) => { const path = p.path || (locale === 'en' && translatedEquivalent(rutaEntidad('persona', p.slug), 'en')) || rutaEntidad('persona', p.slug); const claim=claims.find(c=>c.value===p.id && (field==='parents' ? ['Padre','Madre'].includes(c.field) : field==='partners' ? c.field==='Matrimonio o vínculo conyugal' : false)); return <span key={p.id} className="public-relation-evidence"><a href={path}>{p.nombre}{locale === 'en' && path.startsWith('/es/') ? ' · ES' : ''}</a>{claim&&<EvidenceMark claim={claim} locale={locale}/>}</span>; })}</div></div>;
}

export function PersonPage({ slug, legacyId, onExplore, initialData = null }) {
  const [resolvedSlug, setResolvedSlug] = useState(slug || null);
  const [state, setState] = useState(() => ({ loading: !initialData, persona: initialData, error: false }));

  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    setState({loading:true,persona:null,error:false});
    async function load() {
      try {
        let finalSlug = slug;
        if (!finalSlug && legacyId) {
          const index = await loadJsonAsset(`/personas-meta/index.json?v=${encodeURIComponent(BUILD_VERSION)}`);
          finalSlug = index[legacyId] || null;
        }
        if (!finalSlug) throw new Error("slug");
        setResolvedSlug(finalSlug);
        // 6.2.0: on Cloudflare the record is read from its static page.
        const persona = await loadJsonAsset(`/personas-meta/${encodeURIComponent(finalSlug)}.json?v=${encodeURIComponent(BUILD_VERSION)}`);
        if (!cancelled) setState({ loading: false, persona, error: false });
      } catch {
        if (!cancelled) setState({ loading: false, persona: null, error: true });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug, legacyId, initialData]);

  const persona = initialData || state.persona;
  const metadata=entityMeta('persona',persona,resolvedSlug||slug);
  usePublicMeta(metadata);

  if (state.loading) return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><main className="public-main"><ReadingSkeleton kind="person"/></main></PublicLayout>;
  if (state.error || !persona) return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><main className="public-main"><Breadcrumbs items={[{ label: "Inicio", href: "/es" }, { label: "Personas", href: "/es/personas" }, { label: "Ficha" }]} /><div className="public-error" role="alert"><h1>Ficha no disponible</h1><p>No se ha podido cargar esta ficha. El atlas completo sigue disponible.</p><button className="public-primary" onClick={() => window.location.reload()}>Reintentar</button> <a className="public-secondary" href="/es/?atlas=1">Abrir atlas <ArrowRight size={15} /></a></div></main></PublicLayout>;

  return <PublicLayout pathname={metadata.path} prerendered={Boolean(initialData)}><PersonContent persona={persona} path={metadata.path} onExplore={initialData?undefined:onExplore}/></PublicLayout>;
}

export function PersonContent({ persona, locale = 'es', path, onExplore }) {
  const en = locale === 'en';
  const label = (es, english) => en ? english : es;
  const profilePath = path || rutaEntidad('persona', persona.slug);
  const atlasPath = en ? `/en/?atlas=1&familia=${encodeURIComponent(persona.id)}` : `${profilePath}?atlas=1`;
  const peoplePath = en ? '/en/people' : '/es/personas';
  const sourcePath = en ? '/en/methodology' : '/es/fuentes';
  const biography=persona.biografiaExtensa?.length?persona.biografiaExtensa:[{titulo:label('Trayectoria','Life and career'),texto:(en?persona.biografia||persona.summary:persona.biografia||persona.resumen)||label('La documentación biográfica disponible es limitada.','The available biographical record is limited.')}];
  const claims=profileClaims(persona);
  const fact=field=>claims.find(claim=>claim.field===field);
  return <main className="public-main public-person-page">
    <Breadcrumbs locale={locale} items={[{label:label('Inicio','Home'),href:en?'/en':'/es'},{label:label('Personas','People'),href:peoplePath},{label:persona.nombre}]}/>
    <article>
      <header className="public-person-hero">
        <div className="public-person-hero-copy">
          <span>{label('El Árbol de Europa · Persona','The Tree of Europe · Person')}</span>
          <h1>{persona.nombre}</h1>
          {(!en || persona.translationComplete) && displayedNickname(persona) && <div className="public-person-nickname">«{displayedNickname(persona)}»</div>}
          <p>{en ? persona.summary||persona.resumen||'' : persona.resumen||persona.biografia||''}</p>
          <div className="public-person-badges"><span>{personaDates(persona,locale)}</span>{(en?persona.role:persona.titulo)&&<span>{en?persona.role:persona.titulo}</span>}{isNamedDynasty(persona.dinastia)&&<a href={profileEntityPath('dinastia',persona.dinastia,locale)}>{profileLabel(persona,persona.dinastia)}{en&&profileEntityPath('dinastia',persona.dinastia,locale).startsWith('/es/')?' · ES':''}</a>}</div>
          <div className="public-person-actions"><a className="public-primary" href={atlasPath} onClick={onExplore?e=>{e.preventDefault();onExplore();}:undefined}>{label('Abrir en el atlas interactivo','Explore this family in the Atlas')}<ArrowRight size={15}/></a><a className="public-secondary" href={peoplePath}><ArrowLeft size={14}/>{label('Volver a personas','Back to people')}</a></div>
        </div>
        <Portrait persona={persona} locale={locale}/>
      </header>
      <section className="public-long-bio" aria-labelledby="public-long-bio-title"><span>{label('Biografía','Biography')}</span><h2 id="public-long-bio-title">{label('Vida de','Life of')} {persona.nombre}</h2>{biography.map(part=><section key={part.titulo}><h3>{part.titulo}</h3><p>{part.texto}</p>{!!part.fuentes?.length&&<p className="public-long-bio-refs">{label('Referencias:','References:')} {part.fuentes.map((f,i)=><React.Fragment key={f.url}>{i>0&&' · '}<a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></React.Fragment>)}</p>}</section>)}</section>
      {en&&<p className="public-translation-note">{persona.translationComplete?'This complete profile is available in English. Bibliographic titles retain their original language. Links marked ES open the Spanish edition.':'This short profile is translated. Names of dynasties and territories, picture credits and original documentary records retain their source language. Links marked ES open the Spanish edition.'}</p>}
      <div className="public-person-columns">
        <section className="public-content-card"><span>{label('Perfil histórico','Historical profile')}</span><h2>{label('Datos principales','Key details')}</h2>{fact('Nacimiento')&&<p><strong>{label('Nacimiento:','Birth:')}</strong> {formatClaimDate(fact('Nacimiento'),locale)} <EvidenceMark claim={fact('Nacimiento')} locale={locale}/></p>}{fact('Fallecimiento')&&<p><strong>{label('Fallecimiento:','Death:')}</strong> {formatClaimDate(fact('Fallecimiento'),locale)} <EvidenceMark claim={fact('Fallecimiento')} locale={locale}/></p>}{(en?persona.role:persona.titulo)&&<p><strong>{label('Título:','Role:')}</strong> {en?persona.role:persona.titulo}</p>}{!!persona.aliases?.length&&<p><strong>{label('Otros nombres:','Other recorded names:')}</strong> {persona.aliases.join(' · ')}</p>}{persona.dinastia&&<p><strong>{label('Dinastía:','Dynasty:')}</strong> {isNamedDynasty(persona.dinastia)?<a href={profileEntityPath('dinastia',persona.dinastia,locale)}>{profileLabel(persona,persona.dinastia)}{en&&profileEntityPath('dinastia',persona.dinastia,locale).startsWith('/es/')?' · ES':''}</a>:<span>{en?'No identified house':persona.dinastia}</span>}</p>}{!!territoriosDe(persona).length&&<p><strong>{label('Territorios:','Territories:')}</strong> {territoriosDe(persona).map((r,i)=><React.Fragment key={r}>{i>0&&' · '}<a href={profileEntityPath('territorio',r,locale)}>{profileLabel(persona,r)}{en&&profileEntityPath('territorio',r,locale).startsWith('/es/')?' (ES)':''}</a></React.Fragment>)}</p>}{(!en||persona.translationComplete)&&<RecordedGovernments persona={persona} claims={claims} locale={locale}/>}</section>
        <section className="public-content-card"><span>{label('Red familiar','Family network')}</span><h2>{label('Relaciones registradas','Recorded relationships')}</h2><RelationList locale={locale} label={label('Padres','Parents')} items={persona.padres} claims={claims} field="parents"/><RelationList locale={locale} label={label(persona.conyuges?.length>1?'Cónyuges':'Cónyuge','Partners')} items={persona.conyuges} claims={claims} field="partners"/><RelationList locale={locale} label={label('Hijos/as','Children')} items={persona.hijos}/>{!persona.padres?.length&&!persona.conyuges?.length&&!persona.hijos?.length&&<p className="public-muted">{label('No hay relaciones directas cargadas para esta persona.','No direct relationships are recorded for this person.')}</p>}</section>
      </div>
      {en && !persona.translationComplete ? <details className="public-original-content"><summary>Governments and documentary notes · Spanish original</summary><div lang="es"><RecordedGovernments persona={persona}/><CrownTimelineView key={persona.id} persona={persona} model={staticCrownModel(persona.crownTimeline)} fuentes={persona.fuentes}/><DocumentationNotes persona={persona}/></div><p className="public-translation-note"><a href={persona.esPath}>Read the complete Spanish record →</a></p></details> : <><CrownTimelineView key={persona.id} persona={persona} model={staticCrownModel(persona.crownTimeline)} fuentes={persona.fuentes} locale={locale}/><DocumentationNotes persona={persona} locale={locale}/></>}
      {!!persona.fuentes?.length&&<section className="public-content-card"><span>{label('Documentación','Documentation')}</span><h2>{label('Fuentes de esta ficha','Sources for this profile')}</h2><ul>{persona.fuentes.map((f,i)=><li key={f.url||i}><a href={f.url} target="_blank" rel="noreferrer">{f.titulo}</a></li>)}</ul><p className="public-muted">{label('Referencias biográficas y de contexto.','Biographical and contextual references in their original language.')} <a href={sourcePath}>{label('Consultar metodología y bibliografía completa','Sources and methodology')}</a>.</p></section>}
      <EvidencePanel person={persona} locale={locale} />
      {!!persona.historias?.length&&<section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Historias relacionadas','Related stories')}</span><h2>{label('Aparece en estos recorridos','Follow this person through history')}</h2></div></div><div className="public-story-grid">{persona.historias.map(h=><a key={h.id} className="public-story-card" href={h.path||rutaEntidad('historia',h.slug)}><span>{en&&!h.path?'Story · Spanish original':label('Historia','Story')}</span><h3>{h.titulo}</h3>{h.revisionPendiente&&<strong className="story-review-note">{en?'Needs review':'Pendiente de revisión'}</strong>}<p>{h.subtitulo}</p><b>{label('Comenzar','Start reading')}<ArrowRight size={13}/></b></a>)}</div></section>}
      <section className="public-section public-person-section"><div className="public-section-heading"><div><span>{label('Seguir explorando','Keep exploring')}</span><h2>{en?`More paths from ${persona.nombre}`:`Más caminos desde ${persona.nombre}`}</h2></div></div><div className="public-follow-grid">
        <div><h3><GitBranch size={16}/>{label('Familia','Family')}</h3>{[...(persona.padres||[]),...(persona.conyuges||[]),...(persona.hijos||[])].slice(0,6).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Shield size={16}/>{label('Misma dinastía','Same dynasty')}</h3>{(persona.relacionadosDinastia||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
        <div><h3><Users size={16}/>{label('En su época','In their lifetime')}</h3>{(persona.contemporaneos||[]).map(p=><PersonaMiniCard key={p.id} persona={p} compact locale={locale}/>)}</div>
      </div></section>
    </article>
  </main>;
}

function RecordedGovernments({persona,claims=[],locale='es'}) {
  const en=locale==='en';
  const gobiernos = gobiernosDe(persona);
  if(!gobiernos.length)return null;
  return <div className="public-reigns"><strong>{en?'Recorded governments and reigns':'Gobiernos y reinados registrados'}</strong>{gobiernos.map((r,index)=>{const claim=claims.find(c=>c.field==='Gobierno'&&c.value.territorio===r.territorio&&c.interval.from===r.desde&&c.interval.to===r.hasta&&c.value.titulo===r.titulo);return <div key={`${r.territorio}-${r.desde}-${index}`}><span>{profileLabel(persona,r.titulo)} · {profileLabel(persona,r.territorio)|| (en?'Territory':'Territorio')} · {profileLabel(persona,etiquetaClaseGobierno(persona,r))} {claim&&<EvidenceMark claim={claim} locale={locale}/>}</span><b>{governmentDateRange(r,locale)}</b>{governmentCalendarLabel(r,locale)&&<small>{governmentCalendarLabel(r,locale)}</small>}{r.condicion&&<small>{profileLabel(persona,r.condicion)}</small>}{en&&r.nota&&<small>{(en&&CLAIM_TEXTS_621[r.nota])||profileNote(persona,r.nota)}</small>}</div>;})}</div>;
}
