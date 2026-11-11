import {englishLabel,englishNote} from '../english/v6/atlasPresentation.js';

const EXACT={
 'Fácil':'Easy','Intermedio':'Intermediate','Difícil':'Hard','Experto':'Expert',
 'Desafío':'Challenge','Duelo cronológico':'Chronology duel','Familia':'Family','Dinastías':'Dynasties','Gobierno':'Government','¿Quién sobra?':'Who does not belong?','Cronología':'Chronology','¿Quién soy?':'Who am I?','Sucesiones':'Successions','Matrimonios':'Marriages','Racha':'Streak','Resolver una sucesión':'Solve a succession',
 '¿Quién nació antes?':'Who was born first?','¿Quién murió más tarde?':'Who died later?','¿Quién comenzó antes su primer gobierno efectivo registrado?':'Who began their first recorded effective government earlier?','¿Quién tuvo el reinado efectivo más largo en un solo territorio?':'Who had the longest effective reign in a single territory?','Ordénalos del más antiguo al más reciente.':'Arrange them from earliest to latest.','Descubre al personaje con el menor número de pistas posible.':'Identify the person using as few clues as possible.','Busca una relación familiar directa.':'Look for a direct family relationship.','La respuesta está en su ficha genealógica.':'The answer is in the genealogical record.','Piensa en sus gobiernos efectivos, no en vínculos matrimoniales.':'Think about effective governments, not marriage ties.','Busca la casa dinástica que comparten dos de ellos.':'Find the dynastic house shared by two of them.','Busca una unión documentada.':'Look for a documented union.',
};

export function challengeText(text,locale='es'){
 if(locale!=='en'||!text)return text;
 if(EXACT[text])return EXACT[text];
 let value=englishNote(text);
 if(value!==text)return value;
 const replacements=[
  [/¿Quién figura como padre de (.+)\?/,'Who is recorded as $1’s father?'],[/¿Quién figura como madre de (.+)\?/,'Who is recorded as $1’s mother?'],[/¿Quién figura como cónyuge de (.+)\?/,'Who is recorded as $1’s spouse?'],[/¿A qué dinastía pertenece (.+)\?/,'Which dynasty does $1 belong to?'],[/¿Cuál de estos territorios gobernó efectivamente (.+)\?/,'Which of these territories did $1 effectively rule?'],[/Dos de estos personajes pertenecen a la casa (.+)\. ¿Quién sobra\?/,'Two of these people belong to House $1. Who does not belong?'],[/Nació en (\d+)\./,'Born in $1.'],[/Casa (.+)\./,'House $1.'],[/La respuesta pertenece a la sucesión de (.+)\./,'The answer belongs to the succession of $1.'],[/ nació en /,' was born in '],[/ murió en /,' died in '],[/ comenzó en /,' began in '],[/ años/,' years'],[/ pertenece a la casa /,' belongs to House '],[/ pertenece a /,' belongs to '],[/ figura en la base como /,' is recorded in the database as '],[/ figuran como cónyuges en la base genealógica/,' are recorded as spouses in the genealogical database'],[/gobierno efectivo registrado en /,'recorded effective government in '],[/los otros dos personajes pertenecen a /,'the other two people belong to '],[/Los tres personajes están situados cerca de la época de /,'All three people are placed near the period around '],[/La diferencia entre ambos nacimientos es de /,'The difference between the two births is '],[/Sus fechas de muerte están separadas por /,'Their death dates are separated by '],[/Uno de los dos comenzó a gobernar /,'One of them began ruling '],[/ antes\./,' earlier.'],[/¿qué motivos explican el acceso de (.+) al gobierno\?/,'which reasons explain $1’s accession to government?'],[/¿quién protagonizó el relevo de (.+) que recoge el Atlas\?/,'who succeeded $1 in the transition recorded by the Atlas?']
 ];
 for(const [pattern,replacement] of replacements)value=value.replace(pattern,replacement);
 return englishLabel(value);
}

export function challengeQuestion(question,locale='es'){
 if(locale!=='en'||!question)return question;
 return {...question,etiqueta:challengeText(question.etiqueta,locale),pregunta:challengeText(question.pregunta,locale),explicacion:challengeText(question.explicacion,locale),hint:challengeText(question.hint,locale),pistas:(question.pistas||[]).map(text=>challengeText(text,locale)),opciones:(question.opciones||[]).map(option=>({...option,label:englishLabel(option.label)}))};
}
