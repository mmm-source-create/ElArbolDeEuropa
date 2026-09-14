import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {connectionTree,connectionUrl,connectionFromSearch} from '../src/connections/connectionTree.js';
import {selectionLayout,selectionEdges,edgePath} from '../src/connections/selectionLayout.js';
import {treeSvg,pngDimensions,wrapName} from '../src/connections/treeExport.js';
import {sanitizeSession,shouldResumeAtlas} from '../src/explorer/atlasSession.js';
import {resolverRuta} from '../src/routing.js';
import {PERSONAS} from '../src/personas.jsx';
import {buildGraph} from '../src/explorer/relationshipGraph.js';
import {RAMAS_DINASTICAS} from '../src/content/dinastias/index.js';
import {dynastyBranchSelection} from '../src/data/dynastyBranchSelection.js';
const graphOf=(ids,edges)=>Object.fromEntries(ids.map(id=>[id,edges.flatMap(([a,b,type='sangre'])=>id===a?[{id:b,tipos:[type]}]:id===b?[{id:a,tipos:[type]}]:[])]));
const connected=(nodes,edges,terminals)=>{const seen=new Set([terminals[0]]);for(let changed=true;changed;){changed=false;for(const [a,b]of edges)if(seen.has(a)!==seen.has(b)){seen.add(a);seen.add(b);changed=true;}}return terminals.every(id=>seen.has(id));};
function brute(edges,terminals){let best=Infinity;for(let mask=0;mask<1<<edges.length;mask++){const chosen=edges.filter((_,i)=>mask&(1<<i));if(chosen.length<best&&connected([],chosen,terminals))best=chosen.length;}return best;}
test('el árbol mínimo coincide con enumeración exhaustiva en grafos con ciclos y atajos',()=>{
 const ids=['a','b','c','d','e','f'];const possible=ids.flatMap((a,i)=>ids.slice(i+1).map(b=>[a,b]));let seed=73;
 for(let sample=0;sample<36;sample++){const edges=possible.filter(()=>{seed=(1664525*seed+1013904223)>>>0;return seed%4===0;}).concat([['a','b'],['b','c'],['c','d'],['d','e'],['e','f']]);const unique=[...new Map(edges.map(e=>[e.join('|'),e])).values()];const terminals=ids.slice(0,3+sample%3);const result=connectionTree(graphOf(ids,unique),terminals,'sangre');assert.equal(result.edges.length,brute(unique,terminals),JSON.stringify(unique));assert.equal(result.ids.length,result.edges.length+1);assert.ok(connected([],result.edges.map(e=>[e.from,e.to]),terminals));}
});
test('criterios, duplicados, personas desconocidas y componentes separados son explícitos',()=>{
 const graph=graphOf(['a','b','c','d'],[['a','b'],['b','c','matrimonio'],['c','d','amantes']]);
 assert.equal(connectionTree(graph,['a','a','c']).edges.length,2);
 const blood=connectionTree(graph,['a','c'],'sangre');assert.equal(blood.connected,false);assert.equal(blood.groups.length,2);assert.equal(blood.edges.length,0);
 assert.equal(connectionTree(graph,['a','d']).connected,false);assert.equal(connectionTree(graph,[]).ids.length,0);
 assert.throws(()=>connectionTree(graph,['missing']));assert.throws(()=>connectionTree(graph,['a','b','c','d','e','f']));
});
test('selección y criterio sobreviven al enlace y la sesión, con y sin barra final',()=>{
 const ids=['TOMASFRANCISCOSAB','CARLOSEMANUEL1SAB','EMANUELFILIBERTOCAR'];const by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));const url=new URL(connectionUrl(ids,'sangre'),'https://treeofeurope.eu');
 assert.deepEqual(connectionFromSearch(url.search,by),{ids,criterion:'sangre'});
 for(const path of ['/es','/es/'])assert.equal(resolverRuta(path,url.search).view,'explorer');
 assert.equal(shouldResumeAtlas('/es/?continuar=1&conectar=TOMASFRANCISCOSAB'),false);
 const saved=sanitizeSession({version:1,mode:'conexion',connectionIds:[...ids,...ids],connectionCriterion:'sangre'});assert.equal(saved.mode,'conexion');assert.deepEqual(saved.connectionIds,ids);assert.equal(saved.connectionCriterion,'sangre');
 assert.equal(connectionFromSearch('?conectar=missing',by).ids.length,0);
});
test('cada rama abre al fundador y vínculos familiares existentes',()=>{
 const graph=buildGraph(PERSONAS),by=Object.fromEntries(PERSONAS.map(p=>[p.id,p]));
 for(const branch of RAMAS_DINASTICAS){const s=dynastyBranchSelection(branch,PERSONAS);assert.ok(s.ids.includes(branch.fundador));assert.ok(s.ids.length<=5);assert.ok(connectionTree(graph,s.ids,s.criterion).connected,branch.id);for(const id of [by[branch.fundador].padre,by[branch.fundador].madre].filter(Boolean))assert.ok(s.ids.includes(id),branch.id);}
 const s=dynastyBranchSelection(RAMAS_DINASTICAS.find(r=>r.id==='saboya-carignano'),PERSONAS);assert.ok(s.ids.includes('EMANUELFILIBERTOCAR'));
});
test('la selección real de cinco personas comparte los antepasados una sola vez',()=>{
 const ids=['AMEDEO8SAB','TOMAS1SAL','MARGPALEO','EMANUELFILIBERTOCAR','VIOLANTEMONBYZ'];const graph=buildGraph(PERSONAS);const start=performance.now();const result=connectionTree(graph,ids);assert.ok(result.connected);assert.equal(new Set(result.ids).size,result.ids.length);assert.equal(result.edges.length,result.ids.length-1);for(const e of result.edges)assert.ok(graph[e.from].some(x=>x.id===e.to&&x.tipos.includes(e.type)));console.log(`Conexión real: ${result.ids.length} personas, ${Math.round(performance.now()-start)} ms`);
});
test('SVG portable contiene nombres completos, incertidumbre y todos los nodos sin HTML externo',()=>{
 const people=[{id:'a',nombre:'María <de> Ángela & una dinastía con un nombre extraordinariamente largo',nac:1200,nacAprox:true,muer:1250},{id:'b',nombre:'Hijo',nac:1240,muer:1300}];const scene=treeSvg({people,edges:[{from:'a',to:'b',type:'sangre'}],gen:{a:12,b:30},terminals:['a'],url:'https://treeofeurope.eu/es/?a=1&b=2'});const dom=new JSDOM(scene.svg,{contentType:'image/svg+xml'});assert.equal(dom.window.document.querySelector('parsererror'),null);const texts=dom.window.document.documentElement.textContent;assert.ok(texts.includes(people[0].nombre));assert.match(texts,/c\. 1200/);assert.equal(dom.window.document.querySelectorAll('rect').length,3);assert.doesNotMatch(scene.svg,/foreignObject|<image|NaN|Infinity/);assert.ok(scene.height<1000);assert.ok(scene.svg.includes('&amp;'));dom.window.close();assert.throws(()=>treeSvg({people:[],edges:[]}));
});
test('nombres sin espacios, posiciones compactas y tamaños PNG conservan límites legibles',()=>{
 assert.equal(wrapName('a'.repeat(80)).join(''),'a'.repeat(80));const by={a:{},b:{}};const layout=selectionLayout(['a','b'],{a:12,b:50},by);assert.ok(layout.height<1000);assert.doesNotMatch(edgePath({from:'a',to:'b'},layout.positions),/NaN/);
 assert.deepEqual(pngDimensions(600,400),{width:1200,height:800});assert.throws(()=>pngDimensions(9000,9000));assert.equal(selectionEdges(graphOf(['a','b'],[['a','b']]),['a','b']).length,1);
});
