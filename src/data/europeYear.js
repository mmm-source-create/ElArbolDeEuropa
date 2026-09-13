import {documentaryBounds,documentaryDate} from '../utils/documentaryDates.js';
import {gobiernosDe,mandatoEn} from './crowns.js';
import {gobiernoEfectivo} from './territorios.js';

export function vidaEnAnio(p,anio) {
 if(!Number.isInteger(anio))return null;
 const [nMin,nMax]=documentaryBounds(p,'nac'),[mMin,mMax]=documentaryBounds(p,'muer');
 if(anio<nMin||anio>mMax)return null;
 const activo=gobiernosDe(p).some(g=>mandatoEn(g,anio)&&gobiernoEfectivo(g));
 if(Number.isFinite(nMax)&&Number.isFinite(mMin)&&anio>=nMax&&anio<=mMin) {
  const aprox=['nac','muer'].some(c=>p[`${c}Aprox`]||documentaryDate(p,c)?.tipo==='aproximada');
  return aprox?'Fechas aproximadas':'Vida registrada';
 }
 if(activo)return 'Documentada por un gobierno';
 if(['nac','muer'].some(c=>Number.isInteger(p[c])&&p[c]===anio&&(!documentaryDate(p,c)||documentaryDate(p,c).tipo==='aproximada')))return ['nac','muer'].some(c=>p[`${c}Aprox`]||documentaryDate(p,c)?.tipo==='aproximada')?'Fechas aproximadas':'Fecha vital registrada';
 // No prolongar indefinidamente vidas con nacimiento o muerte desconocidos.
 if(!Number.isFinite(nMin)||!Number.isFinite(mMax))return null;
 return 'Compatible con el intervalo';
}
const intervaloEn=(x,anio)=>Number.isInteger(x.desde)&&x.desde<=anio&&(x.hasta===null||Number.isInteger(x.hasta)&&anio<=x.hasta);

export function europaEnAnio({personas,anio,eventos=[],crisis=[],uniones=[],territorioIncluido=()=>true,alcanceCompleto=true}) {
 if(!Number.isInteger(anio))return {gobiernos:[],nominales:[],vivas:[],eventos:[],crisis:[],uniones:[]};
 const ids=new Set(personas.map(p=>p.id)),territorios=new Set();
 for(const p of personas)for(const t of [...p.reinos||[],...gobiernosDe(p).map(g=>g.territorio)])if(territorioIncluido(t))territorios.add(t);
 const mandatos=personas.flatMap(p=>gobiernosDe(p).filter(g=>territorioIncluido(g.territorio)&&mandatoEn(g,anio)).map(g=>({...g,persona:p})));
 const vinculado=x=>alcanceCompleto||(x.personas||[]).some(id=>ids.has(id))||(x.territorios||[]).some(t=>territorios.has(t));
 return {
  gobiernos:mandatos.filter(gobiernoEfectivo).sort((a,b)=>a.territorio.localeCompare(b.territorio,'es')||a.desde-b.desde||a.persona.nombre.localeCompare(b.persona.nombre,'es')),
  nominales:mandatos.filter(g=>!gobiernoEfectivo(g)),
  vivas:personas.flatMap(persona=>{const estado=vidaEnAnio(persona,anio);return estado?[{persona,estado}]:[];}).sort((a,b)=>a.persona.nombre.localeCompare(b.persona.nombre,'es')),
  eventos:eventos.filter(e=>{const desde=e.desde??e.anio,hasta=e.hasta??desde;return mandatoEn({desde,hasta},anio)&&vinculado(e);}),
  crisis:crisis.filter(c=>intervaloEn(c,anio)&&(alcanceCompleto||c.candidatos.some(x=>ids.has(x.persona))||c.territorios.some(t=>territorios.has(t)))),
  uniones:uniones.filter(u=>intervaloEn(u,anio)&&(alcanceCompleto||u.territorios.some(t=>territorios.has(t)))),
 };
}
