export default function BurgundyProjectMap({locale='es'}) {
 const en=locale==='en',path=`/historias/borgona-proyecto-1473-${en?'en':'es'}.svg`;
 return <figure className="story-project-map" id="mapa-proyecto-1473">
  <h2>{en?'The proposed kingdom · 1473':'El reino propuesto · 1473'}</h2>
  <img src={path} width="750" height="530" alt={en?'Location map of Charles’s imperial lands, the proposed vassal principalities and his French fiefs':'Mapa de localización de los dominios imperiales de Carlos, los principados propuestos como feudos y sus feudos franceses'}/>
  <ul className="story-map-legend"><li><i style={{background:'#843e4a'}}/>{en?'Imperial lands of Charles':'Dominios imperiales de Carlos'}</li><li><i style={{background:'#32697d'}}/>{en?'Proposed vassal principalities':'Principados propuestos como feudos'}</li><li><i style={{background:'#af7c2e'}}/>{en?'French fiefs of Charles':'Feudos franceses de Carlos'}</li><li><i style={{background:'#34302d'}}/>{en?'Negotiations':'Negociación'}</li></ul>
  <figcaption>{en?'Schematic locations of the 1473 proposal; symbols do not draw a frontier. Imperial cities were excepted.':'Localización esquemática del proyecto de 1473; los símbolos no dibujan una frontera. Las ciudades imperiales quedaban exceptuadas.'} <a href={path} target="_blank" rel="noreferrer">{en?'Enlarge map ↗':'Ampliar mapa ↗'}</a><br/>{en?'Proposal:':'Proyecto:'} <a href="https://bmgn-lchr.nl/article/download/URN:NBN:NL:UI:10-1-102331/584/661">A. G. Jongkees, pp. 326–327</a>. {en?'Background:':'Base:'} <a href="https://www.mapchart.net/">MapChart</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. {en?'Adaptation: The Tree of Europe.':'Adaptación: El Árbol de Europa.'}</figcaption>
 </figure>;
}
