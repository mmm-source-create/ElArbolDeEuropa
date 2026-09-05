import React from "react";

export default function BioRelations({ etiqueta, ids, tipo = "familia", byId, hrefForId, onSelect }) {
  const unicos = [...new Set((ids || []).filter(Boolean))];
  if (!unicos.length) return null;
  return (
    <div className="bio-relation-row">
      <div className="bio-relation-label">{etiqueta}</div>
      <div className="bio-relation-list">
        {unicos.map((id) => {
          const persona = byId?.[id];
          const href = persona ? hrefForId?.(id) : null;
          return persona ? (
            <a
              key={id}
              className={`bio-relation-link ${tipo === "amantes" ? "is-lover" : ""}`}
              href={href || "#"}
              onClick={(event) => {
                if (!onSelect) return;
                event.preventDefault();
                onSelect(id);
              }}
              title={`Ir a ${persona.nombre}`}
            >
              {persona.nombre}
            </a>
          ) : (
            <span key={id} className={`bio-relation-link is-disabled ${tipo === "amantes" ? "is-lover" : ""}`} title={`La ficha ${id} todavía no está cargada`}>
              [{id}] sin ficha
            </span>
          );
        })}
      </div>
    </div>
  );
}
