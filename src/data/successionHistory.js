export const MOTIVOS_SUCESION = ['herencia','elección','conquista','matrimonio','abdicación','deposición','acuerdo','regencia','restauración','disputa'];
export const TIPOS_FECHA = {acceso:'Acceso al título',coronación:'Coronación',gobierno:'Gobierno efectivo',inauguración:'Toma de posesión'};
export const coincideMandato = (g, referencia, territorio) => g.territorio === territorio && g.desde === referencia.desde && (!referencia.clase || g.clase === referencia.clase);

// Solo recorre filiaciones registradas. La ausencia de un vínculo no prueba que no exista.
export function parentescoRegistrado(anterior, siguiente, personas) {
  const byId = new Map(personas.map(p=>[p.id,p]));
  if (anterior === siguiente) return {texto:'La misma persona',via:[]};
  const ascendientes = id => {
    const paths = new Map([[id,[id]]]);
    const queue = [id];
    for(let i=0;i<queue.length;i++) {
      const child = queue[i], path = paths.get(child);
      if(path.length > 8) continue;
      for(const parent of [byId.get(child)?.padre,byId.get(child)?.madre]) {
        if(!byId.has(parent)||paths.has(parent)) continue;
        paths.set(parent,[...path,parent]); queue.push(parent);
      }
    }
    return paths;
  };
  const a = ascendientes(anterior), b = ascendientes(siguiente);
  if(b.has(anterior)) {const via=b.get(anterior).slice().reverse(); return {texto:via.length===2?'Hijo o hija de su predecesor':`Descendiente de su predecesor (${via.length-1} generaciones)`,via};}
  if(a.has(siguiente)) {const via=a.get(siguiente); return {texto:via.length===2?'Padre o madre de su predecesor':`Ascendiente de su predecesor (${via.length-1} generaciones)`,via};}
  const p=byId.get(anterior), q=byId.get(siguiente);
  const spouses = x => [x?.conyuge,x?.conyuge2,...x?.conyuges||[]];
  if(spouses(p).includes(siguiente)||spouses(q).includes(anterior)) return {texto:'Cónyuges',via:[anterior,siguiente]};
  const shared=[...a.keys()].filter(id=>b.has(id)).sort((x,y)=>a.get(x).length+b.get(x).length-a.get(y).length-b.get(y).length || x.localeCompare(y));
  if(!shared.length)return {texto:'Sin parentesco identificado en las filiaciones registradas',via:[]};
  const common=shared[0], da=a.get(common).length-1, db=b.get(common).length-1;
  const fullSiblings = p?.padre && p?.madre && p.padre===q?.padre && p.madre===q?.madre;
  const texto=da===1&&db===1?(fullSiblings?'Hermanos':'Hermanos o medio hermanos'):da===2&&db===2?'Primos hermanos':`Ascendiente común: ${byId.get(common).nombre}`;
  return {texto,via:[...a.get(common),...b.get(common).slice(0,-1).reverse()]};
}

export function prepararSucesiones(personas, relevos, crisis, ref, sources) {
  const byId=new Map(personas.map(p=>[p.id,p]));
  const person=id=>ref(byId.get(id));
  const fuentes=urls=>urls.map(url=>{const s=sources.find(s=>s.url===url);return {titulo:s.titulo,url:s.url};});
  return {
    relevos:relevos.map(r=>{
      const relacion=parentescoRegistrado(r.predecesor.persona,r.sucesor.persona,personas);
      return {...r,predecesor:{...r.predecesor,persona:person(r.predecesor.persona)},sucesor:{...r.sucesor,persona:person(r.sucesor.persona)},parentesco:{...relacion,via:relacion.via.map(person)},fuentes:fuentes(r.fuentes)};
    }),
    crisis:crisis.map(c=>({...c,fuentes:fuentes(c.fuentes),candidatos:c.candidatos.map(p=>({...p,persona:person(p.persona),ascendencia:p.ascendencia.map(person)}))})),
  };
}

export function auditarSucesiones(personas, relevos, crisis, territorios, sources) {
  const issues=[];
  const add=(code,id,message)=>issues.push({severity:'ERROR',code,subject:id,message});
  const byId=new Map(personas.map(p=>[p.id,p]));
  const urls=new Set(sources.map(s=>s.url));
  const ids=new Set();
  const validarFuentes=x=>{if(!x.fuentes?.length||x.fuentes.some(url=>!urls.has(url)))add('SUCCESSION_SOURCE',x.id,'La referencia debe existir en la bibliografía general.');};
  const targets=new Set();
  for(const r of relevos) {
    if(ids.has(r.id))add('SUCCESSION_ID',r.id,'Identificador duplicado.');ids.add(r.id);
    if(territorios[r.territorio]?.naturaleza!=='entidad')add('SUCCESSION_TERRITORY',r.id,'El relevo debe pertenecer a una entidad histórica.');
    for(const key of ['predecesor','sucesor']) {
      const term=r[key], p=byId.get(term?.persona);
      const matches=(p?.gobiernos||[]).filter(g=>coincideMandato(g,term,r.territorio));
      if(matches.length!==1)add('SUCCESSION_TERM',r.id,`${key}: debe identificar exactamente un mandato existente.`);
    }
    if(!r.motivos?.length||r.motivos.some(m=>!MOTIVOS_SUCESION.includes(m)))add('SUCCESSION_REASON',r.id,'Motivo desconocido o ausente.');
    if(!r.explicacion?.trim())add('SUCCESSION_EXPLANATION',r.id,'Falta explicación editorial.');
    if(r.predecesor?.persona===r.sucesor?.persona||r.predecesor?.desde>r.sucesor?.desde)add('SUCCESSION_ORDER',r.id,'Orden de personas o mandatos incompatible.');
    const target=[r.territorio,r.sucesor?.persona,r.sucesor?.desde].join('|');
    if(targets.has(target))add('SUCCESSION_TARGET',r.id,'Dos explicaciones para el mismo acceso.');targets.add(target);
    if(r.crisis&&!crisis.some(c=>c.id===r.crisis&&c.territorios.includes(r.territorio)))add('SUCCESSION_CRISIS',r.id,'Crisis ausente o ajena al territorio.');
    const dateTypes=new Set();
    for(const f of r.fechas||[]) {
      const p=byId.get(r.sucesor?.persona);
      if(!TIPOS_FECHA[f.tipo]||!Number.isInteger(f.anio)||!f.nota?.trim()||dateTypes.has(f.tipo)||(Number.isFinite(p?.nac)&&f.anio<p.nac)||(Number.isFinite(p?.muer)&&f.anio>p.muer))add('SUCCESSION_DATE',r.id,'Fecha ambigua, duplicada o fuera de la vida del titular.');
      dateTypes.add(f.tipo);
    }
    validarFuentes(r);
  }
  for(const c of crisis) {
    if(ids.has(c.id))add('CRISIS_ID',c.id,'Identificador duplicado.');ids.add(c.id);
    if(!c.territorios?.length||c.territorios.some(t=>territorios[t]?.naturaleza!=='entidad'))add('CRISIS_TERRITORY',c.id,'Territorio inexistente o agrupación.');
    if(!c.titulo?.trim()||!c.resumen?.trim()||!c.desenlace?.trim()||c.candidatos?.length<2)add('CRISIS_CONTENT',c.id,'Falta explicación o candidatos.');
    const candidates=new Set();
    for(const candidate of c.candidatos||[]) {
      if(!byId.has(candidate.persona)||candidates.has(candidate.persona)||!candidate.fundamento?.trim()||!candidate.resultado?.trim())add('CRISIS_CANDIDATE',c.id,'Candidato inexistente, repetido o sin explicación.');
      candidates.add(candidate.persona);
      const chain=candidate.ascendencia||[];
      if(chain.length<2||chain.at(-1)!==candidate.persona||new Set(chain).size!==chain.length)add('CRISIS_LINEAGE',c.id,'La línea debe acabar en el candidato y no contener ciclos.');
      for(let i=0;i<chain.length;i++) {
        const p=byId.get(chain[i]);
        if(!p||(i>0&&![p.padre,p.madre].includes(chain[i-1])))add('CRISIS_LINEAGE',c.id,`Filiación no registrada: ${chain[i-1]||''} → ${chain[i]}.`);
      }
    }
    validarFuentes(c);
  }
  return issues;
}
