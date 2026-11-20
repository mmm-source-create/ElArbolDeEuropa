// 6.0.10: the condition of each government, labelled like the English page
// (profileVocabulary.js) but in Spanish.
const CONDICIONES={'efectivo':'Gobierno efectivo','titular':'Título nominal','rama':'Rama','corregente':'Corregente','rival':'Rival','jure uxoris':'Iure uxoris','regencia':'Regencia','disputado':'Disputado','pretensión':'Pretensión','ocupación':'Ocupación','gobierno delegado':'Gobierno delegado'};
export const condicionTexto=c=>CONDICIONES[c]||(c?c[0].toUpperCase()+c.slice(1):'');
