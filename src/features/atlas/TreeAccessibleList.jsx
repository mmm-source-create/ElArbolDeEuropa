import {governmentSummary} from '../../domain/government/governmentPresentation.js';
import React from 'react';
import { normalizaTexto } from './atlasModel.js';
import {englishLabel} from '../english/v6/atlasPresentation.js';

const PAGE_SIZE = 40;

export default function TreeAccessibleList({ people, selectedId, onSelect, year = null, locale='es' }) {
  const en=locale==='en',tr=(es,english)=>en?english:es,term=value=>en?englishLabel(value):value;
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const filtered = React.useMemo(() => {
    const queryTerm = normalizaTexto(query);
    return queryTerm ? people.filter(person => normalizaTexto([person.nombre, person.titulo, term(person.titulo), person.dinastia, term(person.dinastia)].join(' ')).includes(queryTerm)) : people;
  }, [people, query, en]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  return <section className="tree-list-alternative" aria-labelledby="tree-list-heading">
    <h2 id="tree-list-heading">{tr('Personas del árbol','People in the tree')} <span>({people.length})</span></h2>
    <div className="tree-list-content">
      <label>{tr('Buscar en las personas visibles','Search visible people')}
        <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} />
      </label>
      <p role="status">{en?`${filtered.length} ${filtered.length===1?'person':'people'} found`:`${filtered.length} persona${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`}</p>
      <ul>{filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map(person => <li key={person.id}>
        <button type="button" aria-current={selectedId === person.id ? 'true' : undefined} onClick={() => onSelect(person.id)}>
          <strong>{person.nombre}</strong><span>{term(person.titulo)} · {governmentSummary(person,year).map(term).join(" · ") || term(person.dinastia)}</span>
        </button>
      </li>)}</ul>
      {pages > 1 && <div className="tree-list-pages">
        <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)}>{tr('Anterior','Previous')}</button>
        <span>{tr('Página','Page')} {current + 1} {tr('de','of')} {pages}</span>
        <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>{tr('Siguiente','Next')}</button>
      </div>}
    </div>
  </section>;
}
