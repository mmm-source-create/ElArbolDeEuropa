import {normalizarBusquedaPublica} from '../../domain/people/personLabels.js';
export function portraitSuggestions(personas, consulta, limite = 7, locale = 'es') {
  const q = normalizarBusquedaPublica(consulta);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);
  return personas
    .map((persona) => {
      const nombreOriginal = String(persona.nombre || "");
      const nombre = normalizarBusquedaPublica(nombreOriginal);
      const aliases = (Array.isArray(persona.aliases) ? persona.aliases : []).map(normalizarBusquedaPublica).filter(Boolean);
      const variantes = [nombre, ...aliases].filter(Boolean);
      const alias = normalizarBusquedaPublica([persona.nombre, ...(persona.aliases || []), persona.sobrenombre].filter(Boolean).join(" "));
      let score = Number.POSITIVE_INFINITY;
      if (variantes.some((variante) => variante === q)) score = 0;
      else if (variantes.some((variante) => variante.startsWith(`${q} `))) score = 1;
      else if (tokens.length > 1 && tokens.every((token) => alias.includes(token))) score = 2;
      else if (variantes.some((variante) => variante.includes(q))) score = 3;
      else if (alias.includes(q)) score = 4;
      else if (tokens.every((token) => alias.split(" ").some((parte) => parte.startsWith(token)))) score = 5;
      return { persona, score };
    })
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score || String(a.persona.nombre).localeCompare(String(b.persona.nombre), locale))
    .slice(0, limite)
    .map((item) => item.persona);
}


export function nextPortrait(people,used=[],rng=Math.random){const remaining=people.filter(p=>!used.includes(p.id));return remaining.length?remaining[Math.floor(rng()*remaining.length)]:null;}
