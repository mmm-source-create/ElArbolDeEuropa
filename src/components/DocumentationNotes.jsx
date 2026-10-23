import React from 'react';
import {formatDocumentaryDate} from '../domain/time/documentaryDates.js';
import {profileLabel,profileNote} from '../features/english/profilePresentation.js';

export default function DocumentationNotes({persona,locale='es'}) {
  const en=locale==='en';
  const dates=Object.entries(persona?.documentacion?.fechas || {});
  const notes=persona?.documentacion?.notas || [];
  if(!dates.length&&!notes.length)return null;
  return <details className="documentary-notes">
    <summary>{en?'Dates and documentary notes':'Fechas y notas documentales'}</summary>
    <dl>{dates.map(([field,d])=><React.Fragment key={field}>
      <dt>{field==='nac'?(en?'Birth':'Nacimiento'):(en?'Death':'Fallecimiento')} · {formatDocumentaryDate(persona,field).replace('antes de ',en?'before ':'antes de ').replace('después de ',en?'after ':'después de ')}</dt><dd>{profileNote(persona,d.nota)}</dd>
    </React.Fragment>)}{notes.map((note,i)=><React.Fragment key={i}>
      <dt>{profileLabel(persona,note.campo)}{note.estado==='discutida'?(en?' · disputed attribution':' · atribución discutida'):note.estado==='variantes'?(en?' · documented variants':' · variantes documentadas'):''}</dt><dd>{profileNote(persona,note.texto)}</dd>
    </React.Fragment>)}</dl>
  </details>;
}
