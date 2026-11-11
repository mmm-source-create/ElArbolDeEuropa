import {territoriosDe} from '../../domain/genealogy/personAccessors.js';
import { useMemo } from "react";
import {ENGLISH_STORIES} from '../english/storyContent.js';
import runtime from '../../generated/englishStoriesRuntime.json' with {type:'json'};

export default function BioDiscovery({
  persona,
  personas,
  hijosPorId,
  historias,
  getSpouses,
  getLovers,
  getReigns,
  normalizeText,
  hrefPersona,
  hrefHistoria,
  onSelect,
  onStartHistoria,
  locale='es',
}) {
  const en=locale==='en',tr=(es,english)=>en?english:es;
  const storyTitle=story=>en?(runtime.stories[story.id]?.content?.titulo||ENGLISH_STORIES[story.id]?.title||story.titulo):story.titulo;
  const sugerencias = useMemo(() => {
    if (!persona) return { epoca: [], historias: [] };
    const familia = new Set([
      persona.id,
      persona.padre,
      persona.madre,
      ...(getSpouses?.(persona) || []),
      ...(getLovers?.(persona) || []),
      ...(hijosPorId?.[persona.id] || []),
    ].filter(Boolean));

    const centro = Number.isFinite(persona.nac) && Number.isFinite(persona.muer)
      ? (persona.nac + persona.muer) / 2
      : Number.isFinite(persona.nac) ? persona.nac + 30 : Number.isFinite(persona.muer) ? persona.muer - 30 : null;
    const centroPersona = (p) => Number.isFinite(p?.nac) && Number.isFinite(p?.muer)
      ? (p.nac + p.muer) / 2
      : Number.isFinite(p?.nac) ? p.nac + 30 : Number.isFinite(p?.muer) ? p.muer - 30 : null;
    const distancia = (p) => Number.isFinite(centro) && Number.isFinite(centroPersona(p)) ? Math.abs(centroPersona(p) - centro) : 999;
    const relevancia = (p) => {
      const titulo = normalizeText?.(p?.titulo) || String(p?.titulo || "").toLowerCase();
      let score = /emperador|emperatriz/.test(titulo) ? 12 : /rey|reina|soberan/.test(titulo) ? 9 : /duque|duquesa|papa|elector/.test(titulo) ? 5 : 0;
      score += Math.min(8, (getReigns?.(p) || []).length * 2);
      score += Math.min(6, (hijosPorId?.[p?.id] || []).length);
      return score;
    };

    const inicio = Number.isFinite(persona.nac) ? persona.nac : Number.isFinite(persona.muer) ? persona.muer - 60 : null;
    const fin = Number.isFinite(persona.muer) ? persona.muer : Number.isFinite(persona.nac) ? persona.nac + 65 : null;
    const territoriosPersona = new Set(territoriosDe(persona));
    const epoca = Number.isFinite(inicio) && Number.isFinite(fin)
      ? personas.filter((p) => {
          if (familia.has(p.id)) return false;
          const pInicio = Number.isFinite(p.nac) ? p.nac : Number.isFinite(p.muer) ? p.muer - 60 : null;
          const pFin = Number.isFinite(p.muer) ? p.muer : Number.isFinite(p.nac) ? p.nac + 65 : null;
          return Number.isFinite(pInicio) && Number.isFinite(pFin) && inicio <= pFin && pInicio <= fin;
        }).sort((a, b) => {
          const comunesA = territoriosDe(a).filter((r) => territoriosPersona.has(r)).length;
          const comunesB = territoriosDe(b).filter((r) => territoriosPersona.has(r)).length;
          return comunesB - comunesA || relevancia(b) - relevancia(a) || distancia(a) - distancia(b) || a.nombre.localeCompare(b.nombre, "es");
        }).slice(0, 3)
      : [];

    const relacionadas = historias
      .filter((historia) => historia?.disponible && historia?.pasos?.some((paso) => paso?.persona === persona.id || (paso?.personas || []).includes(persona.id)))
      .slice(0, 3);

    return { epoca, historias: relacionadas };
  }, [persona, personas, hijosPorId, historias, getSpouses, getLovers, getReigns, normalizeText]);

  if (!persona || (!sugerencias.epoca.length && !sugerencias.historias.length)) return null;

  return (
    <div className="bio-discover">
      <h4>{tr('También puede interesarte','You may also be interested in')}</h4>
      {sugerencias.historias.length > 0 && (
        <div className="bio-discover-group">
          <span>{tr('Historias relacionadas','Related stories')}</span>
          <div className="bio-discover-links">
            {sugerencias.historias.map((historia) => (
              <a key={historia.id} href={hrefHistoria?.(historia) || "#"} onClick={(event) => { if (onStartHistoria) { event.preventDefault(); onStartHistoria(historia.id); } }}>{storyTitle(historia)}</a>
            ))}
          </div>
        </div>
      )}
      {sugerencias.epoca.length > 0 && (
        <div className="bio-discover-group">
          <span>{tr('En su época','In their time')}</span>
          <div className="bio-discover-links">
            {sugerencias.epoca.map((p) => (
              <a key={p.id} href={hrefPersona?.(p) || "#"} onClick={(event) => { if (onSelect) { event.preventDefault(); onSelect(p.id); } }}>{p.nombre}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
