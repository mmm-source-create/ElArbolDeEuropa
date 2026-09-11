import React from 'react';
import {formatDocumentaryDate} from '../utils/documentaryDates.js';

export default function DocumentationNotes({persona}) {
  const dates=Object.entries(persona?.documentacion?.fechas || {});
  const notes=persona?.documentacion?.notas || [];
  if(!dates.length&&!notes.length)return null;
  return <details className="documentary-notes">
    <summary>Fechas y notas documentales</summary>
    <dl>{dates.map(([field,d])=><React.Fragment key={field}>
      <dt>{field==='nac'?'Nacimiento':'Fallecimiento'} · {formatDocumentaryDate(persona,field)}</dt><dd>{d.nota}</dd>
    </React.Fragment>)}{notes.map((note,i)=><React.Fragment key={i}>
      <dt>{note.campo}{note.estado==='discutida'?' · atribución discutida':note.estado==='variantes'?' · variantes documentadas':''}</dt><dd>{note.texto}</dd>
    </React.Fragment>)}</dl>
  </details>;
}
