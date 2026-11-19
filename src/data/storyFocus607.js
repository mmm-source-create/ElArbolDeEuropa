// 6.0.7: each recurring protagonist leads at least one chapter. The chapter
// keeps its text and people; only the person the Atlas centres changes.
// Chapter numbers are 1-based; opening chapters keep their focus.
export const STORY_FOCUS_607 = Object.freeze({
  "federico-emperador-excomulgado": {2:"PAPA_GREGORIO9"},
  "reino-partido-dos": {3:"BEATCONST", 6:"CARLOS2NAP"},
  "don-juan-manuel": {3:"CONSTANMAN", 5:"ALF11"},
  "conspiracion-pazzi": {2:"GIROLAMORIARIO", 3:"GIULIANOMEDICI1453", 6:"FERN1NAP"},
  "maritsa-1371": {3:"JOVANUGLJESA"},
  "mindaugas-jogaila": {5:"KESTUTISLIT", 7:"VYTAUTASLIT"},
  "duque-lerma": {4:"FEL3ESP", 5:"CRISTOBALSANDOVALUCEDA"},
  "dos-rosas": {4:"CECILIANEVILLE", 7:"RICHARDNEVILLESALISBURY", 8:"JASPERTUDOR", 10:"ISABELWOODVILLE", 12:"MARGANJOUING", 14:"EDWARDWESTMINSTER", 16:"EDUARDO5ING", 18:"MARGARETBEAUFORT", 20:"ISABELYORK", 21:"EDWARDWARWICK"},
  "dos-coronas-dos-hijas": {2:"ISABBOS", 4:"LADI2", 6:"SEGIS1"},
  "corona-demasiado-grande": {4:"CARLOS9SUE"},
  "borgona": {10:"FED3HAB", 16:"MAXIM1"},
  "emperadores-sucesion": {2:"MARIATERESAHAB"},
  "habsburgo-capetos": {2:"FED3HAB", 3:"LUIS11FRA", 4:"MARGAUST", 6:"FEL1CAST"},
  "iberia": {6:"FELIPLANC"},
  "condotieros": {4:"MUZIOSFOR", 7:"FELMARVISC", 8:"BLANMARVISC"},
  "cien-anos": {15:"JUANBEDFORD"},
  "republica-nobles": {5:"ANAJAG", 10:"MIGUELKORYBUT", 16:"CATHERINE2RUS"},
  "corona-dos-credos": {2:"FRAN1GUISA", 5:"MARGVALOIS", 8:"CHARLESMAYENNE"},
  "lepanto-alianza": {4:"FEL2ESP", 6:"MARCANTONIO2COL", 7:"AGOSTINOBARBARIGO", 9:"GIANANDREADORIA"},
  "puertas-viena": {7:"KARAMUSTAFA", 8:"PAPA_INOCENCIO11", 9:"MAX2EMANBAV"},
  "ochenta-anos": {6:"MAURICEORANGE"},
  "guerras-italianas": {2:"FERN2ARAG", 6:"CARLOS5"},
  "ultimo-austria": {2:"MARIANAAUSTESP", 5:"LUIS14FRA", 7:"CARLOS6HRE"},
  "estuardo-hannover": {3:"MARY2ING", 4:"SOPHIAPALHAN"},
  "leonor-aquitania": {2:"LUIS7FRA", 5:"HENRY2ING", 6:"RICARDO1ING", 8:"JUANSINTIERRA"},
  "visconti-sforza": {3:"BLANMARVISC", 8:"GIANGALSFOR"},
  "dracula-detras-de-la-leyenda": {3:"MEHMED2OSM"},
  "balduino-saladino": {5:"BALDWIN5JER"},
  "constantinopla-dos-conquistas": {5:"CONSTANTINE11PALA"},
  "ricardo-felipe-cruzada": {6:"FEL2FRA", 7:"SALADIN"},
});

export function applyStoryFocus607(story) {
  const focus=STORY_FOCUS_607[story.id];
  if(!focus||!Array.isArray(story.pasos))return story;
  return {...story,pasos:story.pasos.map((step,index)=>{
    const id=focus[index+1];
    const people=[...new Set(step.personas||[step.persona])].filter(Boolean);
    if(!id||!people.includes(id))return step;
    return {...step,persona:id,personas:[id,...people.filter(other=>other!==id)]};
  })};
}
