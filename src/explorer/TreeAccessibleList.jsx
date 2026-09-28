import React from 'react';
import { normalizaTexto } from './model.js';

const PAGE_SIZE = 40;

export default function TreeAccessibleList({ people, selectedId, onSelect }) {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const filtered = React.useMemo(() => {
    const term = normalizaTexto(query);
    return term ? people.filter(person => normalizaTexto([person.nombre, person.titulo, person.dinastia].join(' ')).includes(term)) : people;
  }, [people, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  return <details className="tree-list-alternative">
    <summary>Ver personas como lista <span>({people.length})</span></summary>
    <div className="tree-list-content">
      <label>Buscar en las personas visibles
        <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} />
      </label>
      <p role="status">{filtered.length} persona{filtered.length === 1 ? '' : 's'} encontrada{filtered.length === 1 ? '' : 's'}</p>
      <ul>{filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map(person => <li key={person.id}>
        <button type="button" aria-current={selectedId === person.id ? 'true' : undefined} onClick={() => onSelect(person.id)}>
          <strong>{person.nombre}</strong><span>{person.titulo} · {person.dinastia}</span>
        </button>
      </li>)}</ul>
      {pages > 1 && <div className="tree-list-pages">
        <button type="button" disabled={current === 0} onClick={() => setPage(current - 1)}>Anterior</button>
        <span>Página {current + 1} de {pages}</span>
        <button type="button" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Siguiente</button>
      </div>}
    </div>
  </details>;
}
