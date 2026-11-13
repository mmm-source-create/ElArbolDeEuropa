import {englishAliases} from '../../src/features/english/aliasTranslations.js';
import {localizedPortrait} from '../../src/features/english/imageCredits.js';
import {ENGLISH_STORY_LABELS} from '../../src/features/english/storyLabels.js';
import {COMPLETE_ENGLISH_PROFILES} from '../../src/features/english/fullProfiles.js';
import {PROFILE_LABELS,ENGLISH_NAMES,translatedProfileText} from '../../src/features/english/profileVocabulary.js';
import {ENGLISH_PROFILE_PORTRAITS} from '../../src/features/english/profilePortraits.js';
import {IMAGENES_PERSONAS} from '../../src/data/imagenesPersonas.js';
import {personClaims} from '../../src/evidence/claims.js';
import {governmentGroupsAt} from '../../src/domain/government/governmentPresentation.js';
import {etiquetaClaseGobierno} from '../../src/domain/people/personLabels.js';
import {sourcesForPerson} from '../../src/content/sources.js';
import {englishSourceTitle} from '../../src/features/english/v535Vocabulary.js';

function profileLabels(source) {
 const values=new Set();
 const visit=value=>{if(typeof value==='string')values.add(value);else if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')Object.values(value).forEach(visit);};
 visit(source);
 for(const government of source.gobiernos||[])values.add(etiquetaClaseGobierno(source,government));
 for(const government of source.gobiernos||[])for(const group of governmentGroupsAt(source,government.desde))if(group.label)values.add(group.label);
 return Object.fromEntries([...values].filter(value=>PROFILE_LABELS[value]).map(value=>[value,PROFILE_LABELS[value]]));
}

const names={...ENGLISH_NAMES,...Object.fromEntries(Object.entries(COMPLETE_ENGLISH_PROFILES).map(([id,p])=>[id,p.name]))};
export function completeEnglishProfile(source, translatedNames={}) {
  const translation=COMPLETE_ENGLISH_PROFILES[source.id];
  if(!translation)return null;
  const knownNames={...names,...translatedNames};
  const notes={...translation.governmentNotes},governments=source.gobiernos||[];
  const translate=text=>notes[text] ||= translatedProfileText(text,knownNames);
  for(const g of governments){if(g.nota)translate(g.nota);for(const group of governmentGroupsAt(source,g.desde)){if(group.note)translate(group.note);if(group.label&&!PROFILE_LABELS[group.label])throw Error(`Missing government group label: ${source.id}/${group.label}`);}}
  for(const d of Object.values(source.documentacion?.fechas||{}))if(d.nota)translate(d.nota);
  for(const n of source.documentacion?.notas||[]){translate(n.texto);if(n.campo&&!PROFILE_LABELS[n.campo])throw Error(`Missing documentation field label: ${source.id}/${n.campo}`);}
  for(const a of source.accesosCoronas||[]){translate(a.explicacion);for(const m of a.motivos||[])if(!PROFILE_LABELS[m])throw Error(`Missing accession reason: ${m}`);}
  const sections=source.biografiaExtensa||[];
  const translatedSections=(translation.sections||[]).map(part=>Array.isArray(part)?part:[part.title||part.titulo,(part.paragraphs||[part.text||part.texto]).filter(Boolean).join('\n\n')]);
  if(sections.length!==translatedSections.length)throw Error(`Incomplete biography translation: ${source.id}`);
  const result={...source,...translation,translationComplete:true,nombre:translation.name,sobrenombre:translation.nickname||'',aliases:englishAliases(translation.aliases),searchAliases:[...(source.aliases||[]),source.nombre],resumen:translation.summary,biografia:translation.biography||translation.summary,
    englishLabels:profileLabels(source),englishNotes:notes,
    biografiaExtensa:sections.map((part,i)=>({...part,titulo:translatedSections[i][0],texto:translatedSections[i][1]})),
    localizedClaims:personClaims(source).map(claim=>({...claim,
      note:translatedProfileText(claim.note,knownNames,claim),
      alternatives:(claim.alternatives||[]).map(text=>translatedProfileText(text,knownNames,claim)),
      sources:claim.sources.map(s=>({...s,title:englishSourceTitle(s.title),locator:translatedProfileText(s.locator,knownNames,claim)})),
    })),
    ...(source.fuentes?{fuentes:source.fuentes.map(f=>({...f,titulo:englishSourceTitle(f.titulo)}))}:{}),
    englishSourceTitles:Object.fromEntries(sourcesForPerson(source.id).map(s=>[s.titulo,englishSourceTitle(s.titulo)]).filter(([es,en])=>es!==en)),
    evidenceNames:Object.fromEntries(Object.entries(source.evidenceNames||{}).map(([id,name])=>{if(!knownNames[id])throw Error(`Missing evidence name ${id}: ${name}`);return[id,knownNames[id]];})),
  };
  for(const field of ['padres','conyuges','hijos','relacionadosDinastia','contemporaneos'])result[field]=source[field].map(p=>{
    const name=knownNames[p.id];if(!name)throw Error(`Missing English name: ${p.id} (${p.nombre})`);
    const role=p.id==='JUANA2NAP'?'Queen':PROFILE_LABELS[p.titulo];if(p.titulo&&!role)throw Error(`Missing related role: ${p.titulo}`);
    return {...p,nombre:name,role};
  });
  const image=IMAGENES_PERSONAS[source.id];
  if(image){const portrait=ENGLISH_PROFILE_PORTRAITS[source.id]||{tipo:'Historical portrait',obra:translation.name,autor:image.autor,fecha:image.fecha,institucion:image.institucion};result.portrait={...localizedPortrait(source.id,image,ENGLISH_PROFILE_PORTRAITS),alt:portrait.alt || `Portrait of ${translation.name}`};}
  const stories=ENGLISH_STORY_LABELS;
  result.historias=source.historias.map(h=>{if(!stories[h.id])throw Error(`Missing related story translation: ${h.id}`);return {...h,titulo:stories[h.id][0],subtitulo:stories[h.id][1]};});
  for(const label of [source.dinastia,...(source.reinos||[]),...governments.flatMap(g=>[g.titulo,g.territorio,g.condicion,g.ambito,etiquetaClaseGobierno(source,g)].filter(Boolean))].filter(Boolean))if(!PROFILE_LABELS[label])throw Error(`Missing profile label: ${source.id}/${label}`);
  for(const claim of result.localizedClaims)if(claim.field==='Sucesión'&&!PROFILE_LABELS[claim.value.territorio])throw Error(`Missing succession territory label: ${source.id}/${claim.value.territorio}`);
  return result;
}
