// 6.0.10: every person in one A–Z page with plain links, in each language.
// It lets crawlers and readers reach all records without running a search.
import {usePublicMeta, Breadcrumbs} from './publicShared.jsx';
import SiteHeader from '../../components/SiteHeader.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';
import {SITE_NAME, SITE_NAME_EN} from '../../app/siteConfig.js';
import {PEOPLE_INDEX_PATHS, groupByLetter} from './peopleIndex.js';

export default function PeopleIndexPage({data, locale = 'es'}) {
  const en = locale === 'en', tr = (es, english) => en ? english : es;
  const path = PEOPLE_INDEX_PATHS[en ? 'en' : 'es'];
  const groups = groupByLetter(data.items);
  const title = tr('Índice de personas de la A a la Z', 'People from A to Z');
  usePublicMeta({
    title: `${title} — ${en ? SITE_NAME_EN : SITE_NAME}`,
    description: tr(`Las ${data.items.length} personas del Atlas por orden alfabético, con sus fechas y su casa.`, `All ${data.items.length} people in the Atlas in alphabetical order, with their dates and house.`),
    path,
  });
  return <div className="public-site">
    <SiteHeader locale={locale} pathname={path} prerendered/>
    <main className="public-main public-catalog people-index">
      <Breadcrumbs locale={locale} items={[{label: tr('Inicio', 'Home'), href: en ? '/en' : '/es'}, {label: tr('Personas', 'People'), href: en ? '/en/people' : '/es/personas'}, {label: tr('Índice A–Z', 'A–Z index')}]}/>
      <section className="public-page-title"><span>{tr('Índice alfabético', 'Alphabetical index')}</span><h1>{title}</h1><p>{tr(`${data.items.length} personas. Cada nombre lleva a su ficha.`, `${data.items.length} people. Each name opens their profile.`)}</p></section>
      <nav className="people-index-letters" aria-label={tr('Letras', 'Letters')}>{groups.map(([letter]) => <a key={letter} href={`#letra-${letter === '#' ? 'otros' : letter.toLowerCase()}`}>{letter}</a>)}</nav>
      {groups.map(([letter, items]) => <section key={letter} id={`letra-${letter === '#' ? 'otros' : letter.toLowerCase()}`} className="people-index-group">
        <h2>{letter}</h2>
        <ul>{items.map(item => <li key={item.p}><a href={item.p}>{item.n}</a>{(item.d || item.c) && <span>{[item.d, item.c].filter(Boolean).join(' · ')}</span>}</li>)}</ul>
      </section>)}
    </main>
    <SiteFooter locale={locale}/>
  </div>;
}
