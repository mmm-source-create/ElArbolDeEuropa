import React, { useMemo } from "react";

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
}) {
  const sugerencias = useMemo(() => {
    if (!persona) return { dinastia: [], epoca: [], historias: [] };
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

    const dinastia = persona.dinastia
      ? personas.filter((p) => p.id !== persona.id && p.dinastia === persona.dinastia && !familia.has(p.id))
        .sort((a, b) => distancia(a) - distancia(b) || relevancia(b) - relevancia(a) || a.nombre.localeCompare(b.nombre, "es"))
        .slice(0, 5)
      : [];

    const inicio = Number.isFinite(persona.nac) ? persona.nac : Number.isFinite(persona.muer) ? persona.muer - 60 : null;
    const fin = Number.isFinite(persona.muer) ? persona.muer : Number.isFinite(persona.nac) ? persona.nac + 65 : null;
    const territoriosPersona = new Set(persona.reinos || []);
    const epoca = Number.isFinite(inicio) && Number.isFinite(fin)
      ? personas.filter((p) => {
          if (familia.has(p.id)) return false;
          const pInicio = Number.isFinite(p.nac) ? p.nac : Number.isFinite(p.muer) ? p.muer - 60 : null;
          const pFin = Number.isFinite(p.muer) ? p.muer : Number.isFinite(p.nac) ? p.nac + 65 : null;
          return Number.isFinite(pInicio) && Number.isFinite(pFin) && inicio <= pFin && pInicio <= fin;
        }).sort((a, b) => {
          const comunesA = (a.reinos || []).filter((r) => territoriosPersona.has(r)).length;
          const comunesB = (b.reinos || []).filter((r) => territoriosPersona.has(r)).length;
          return comunesB - comunesA || relevancia(b) - relevancia(a) || distancia(a) - distancia(b) || a.nombre.localeCompare(b.nombre, "es");
        }).slice(0, 5)
      : [];

    const relacionadas = historias
      .filter((historia) => historia?.disponible && historia?.pasos?.some((paso) => paso?.persona === persona.id || (paso?.personas || []).includes(persona.id)))
      .slice(0, 4);

    return { dinastia, epoca, historias: relacionadas };
  }, [persona, personas, hijosPorId, historias, getSpouses, getLovers, getReigns, normalizeText]);

  if (!persona || (!sugerencias.dinastia.length && !sugerencias.epoca.length && !sugerencias.historias.length)) return null;

  return (
    <div className="bio-discover">
      <h4>Seguir explorando</h4>
      {sugerencias.historias.length > 0 && (
        <div className="bio-discover-group">
          <span>Historias relacionadas</span>
          <div className="bio-discover-links">
            {sugerencias.historias.map((historia) => (
              <a key={historia.id} href={hrefHistoria?.(historia) || "#"} onClick={(event) => { if (onStartHistoria) { event.preventDefault(); onStartHistoria(historia.id); } }}>{historia.titulo}</a>
            ))}
          </div>
        </div>
      )}
      {sugerencias.dinastia.length > 0 && (
        <div className="bio-discover-group">
          <span>Misma dinastía</span>
          <div className="bio-discover-links">
            {sugerencias.dinastia.map((p) => (
              <a key={p.id} href={hrefPersona?.(p) || "#"} onClick={(event) => { if (onSelect) { event.preventDefault(); onSelect(p.id); } }}>{p.nombre}</a>
            ))}
          </div>
        </div>
      )}
      {sugerencias.epoca.length > 0 && (
        <div className="bio-discover-group">
          <span>En su época</span>
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
