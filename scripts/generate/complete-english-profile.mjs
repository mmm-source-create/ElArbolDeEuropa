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
  if(sections.length!==(translation.sections||[]).length)throw Error(`Incomplete biography translation: ${source.id}`);
  const result={...source,...translation,translationComplete:true,nombre:translation.name,sobrenombre:translation.nickname||'',aliases:translation.aliases||[],resumen:translation.summary,biografia:translation.biography||translation.summary,
    englishLabels:PROFILE_LABELS,englishNotes:notes,
    biografiaExtensa:sections.map((part,i)=>({...part,titulo:translation.sections[i][0],texto:translation.sections[i][1]})),
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
  if(image){const portrait=ENGLISH_PROFILE_PORTRAITS[source.id];if(!portrait)throw Error(`Missing portrait credit translation: ${source.id}`);result.portrait={...image,...portrait,alt:`Portrait of ${translation.name}`,derechos:image.derechos.replace('Dominio público','Public domain')};}
  const stories=ENGLISH_STORY_LABELS;
  result.historias=source.historias.map(h=>{if(!stories[h.id])throw Error(`Missing related story translation: ${h.id}`);return {...h,titulo:stories[h.id][0],subtitulo:stories[h.id][1]};});
  for(const label of [source.dinastia,...(source.reinos||[]),...governments.flatMap(g=>[g.titulo,g.territorio,g.condicion,g.ambito,etiquetaClaseGobierno(source,g)].filter(Boolean))])if(!PROFILE_LABELS[label])throw Error(`Missing profile label: ${source.id}/${label}`);
  for(const claim of result.localizedClaims)if(claim.field==='Sucesión'&&!PROFILE_LABELS[claim.value.territorio])throw Error(`Missing succession territory label: ${source.id}/${claim.value.territorio}`);
  return result;
}
