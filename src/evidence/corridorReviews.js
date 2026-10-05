const bayern = {title:'Historisches Lexikon Bayerns · Bayerische Teilungen',url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Bayerische_Teilungen',locator:'División de 1392 y sucesiones de Straubing, Ingolstadt y Landshut'};
const bayernTerritory = {title:'Historisches Lexikon Bayerns · Territorialentwicklung in Altbayern',url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Territorialentwicklung_in_Altbayern_%281180-1505%29',locator:'Particiones y reunión de 1505'};
const kurpfalz = {title:'Historisches Lexikon Bayerns · Kurpfalz: Politische Geschichte',url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45783',locator:'Cronología de electores, pérdida de 1623 y restitución de 1648'};
const neuburg = {title:'Historisches Lexikon Bayerns · Pfalz-Neuburg: Territorium und Verwaltung',url:'https://www.historisches-lexikon-bayerns.de/Lexikon/Artikel_45318',locator:'Sección Belehnung y tabla Die Herzöge von Pfalz-Neuburg: 1522–1716'};
const kleve = {title:'LVR · Herzogtum Kleve',url:'https://www.rheinische-geschichte.lvr.de/Orte-und-Raeume/herzogtum-kleve/DE-2086/lido/57d118b2e01a18.97969392',locator:'Unión de 1511/1521 y reparto de 1614/1666'};
const partition = {title:'LVR · Erbfolgestreit 1609–1794',url:'https://rheinische-geschichte.lvr.de/Epochen-und-Themen/Epochen/1609-bis-1794---vom-juelich-klevischen-erbfolgestreit-bis-zum-ende-des-ancien-regime/DE-2086/lido/57ab23395bb740.19018833',locator:'Tratado de Xanten de 1614'};
const johann1 = {title:'Deutsche Biographie · Johann I. von Kleve',url:'https://www.deutsche-biographie.de/pnd132254948.html',locator:'Biografía y genealogía'};
const johann2 = {title:'Deutsche Biographie · Johann II. von Kleve',url:'https://www.deutsche-biographie.de/sfz37469.html',locator:'Cabecera, familia y gobierno'};

const selectedPalatines = new Set(['LUIS3PAL','LUIS4PAL','FRED1PAL','PHILIPPAL','LUIS5PAL','FRED2PAL','OTTHEINRICHPAL','FRED3PAL','LUIS6PAL','FRED4PAL','FED5PALBOH','KARLLUDWIGPAL','KARL2PAL','PHILIPWILHELMPAL','JUANGUILLERMOPAL']);
const rhineland = new Set(['WILHELM4JULBERG','JOHN3CLEVES','WILHELM5CLEVES','JOHNWILLIAMCLEVES','WOLFGANGWILHELMNEUBURG','PHILIPWILHELMPAL','JUANGUILLERMOPAL','JOHN1CLEVES','JOHN2CLEVES','JOHNSIGBRAND','GEORGEWILLIAMBRAND','FREDWILGREAT','FRED1PRUSSIA']);
const bavarianBranches = new Set(['ESTEBAN3BAV','FED1BAV','JUAN2BAV','ENRIQ16BAV','ERNESTBAV','GUILLERMO3BAV','GUILLERMO2BAV','LUIS7BAV','JUAN3BAV','ALB3BAV','LUIS8BAV','LUIS9BAV','JUAN4BAV','SIGISBAV','JORGE1BAV','ALB4BAV']);
export function buildCorridorReviews(people) {
const reviewed = {};
for (const person of people) {
  for (const government of person.gobiernos || []) {
    const {territorio,desde,hasta,titulo} = government;
    let sources = null;
    let note = '';
    if (selectedPalatines.has(person.id) && territorio === 'Palatinado') {
      sources = [kurpfalz];
      note = 'La cronología distingue la dignidad electoral, las regencias y el territorio; el SVG es una aproximación regional.';
    } else if (territorio === 'Palatinado-Neoburgo') {
      sources = [neuburg];
      note = 'Principado separado del Palatinado electoral; sus dominios no se atribuyen al polígono Palatinate.';
    } else if (rhineland.has(person.id) && ['Cléveris','Mark','Ravensberg','Jülich','Berg'].includes(territorio)) {
      sources = [kleve,partition];
      note = 'Los ducados y condados conservaron instituciones distintas. La posesión de 1614 fue provisional y el reparto definitivo llegó en 1666; Mark y Ravensberg no tienen geometría propia.';
    } else if (bavarianBranches.has(person.id) && territorio === 'Baviera') {
      sources = [bayern,bayernTerritory];
      note = 'Rama dinástica del ducado dividido: solo se colorea un núcleo regional aproximado, sin atribuir Franconia, Suabia, Salzburgo o Tirol por proximidad.';
    }
    if (sources) reviewed[`person:${person.id}:government:${territorio}:${desde}:${hasta}:${titulo}`] = {
      certainty:'inferred',sources,note,reviewedAt:'2026-10-04',editor:'El Árbol de Europa',
    };
  }
}
for (const [id,field,source,note] of [
  ['JOHN1CLEVES','father',johann1,'La biografía identifica a Adolfo I como padre.'],
  ['JOHN1CLEVES','mother',johann1,'La biografía identifica a María de Borgoña como madre.'],
  ['JOHN2CLEVES','father',johann2,'La biografía enlaza a Juan II con Juan I.'],
  ['JOHN3CLEVES','father',johann2,'La biografía identifica a Juan III entre sus hijos.'],
  ['JOHN3CLEVES','mother',johann2,'La biografía identifica a Matilde de Hesse como madre.'],
]) reviewed[`person:${id}:${field}`] = {certainty:'documented',sources:[source],note,reviewedAt:'2026-10-04',editor:'El Árbol de Europa'};

return Object.freeze(reviewed);
}
