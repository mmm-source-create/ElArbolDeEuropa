// Flag explicit comments about the reader, the author's correction or the Atlas.
// Historical negation, attributed arguments and source uncertainty remain valid.
const patterns=[
 ['reader-instruction',/\b(?:para leer (?:sus|estos) títulos|hay que distinguir|conviene distinguir|debemos recordar|el lector debe|the reader (?:must|should)|we must distinguish)\b/iu],
 ['narrative-reference',/\b(?:nuestro recorrido|este recorrido|el recorrido (?:termina|comienza|conecta|se detiene)|nuestro viaje|el viaje nos|aquí (?:ya no hablamos|comienza la pista)|our journey|this journey|our tour|the narrative (?:must|should)|the story (?:must|should))\b/iu],
 ['map-correction',/\b(?:no debe colorearse|no debe (?:presentarse|confundirse)|sin (?:colorear|confundir)|must not be (?:coloured|colored|confused)|should not be (?:coloured|colored|confused))\b/iu],
 ['imagined-refutation',/presentar (?:la|el) .{0,90} como (?:una |un )?simple|(?:este|el) recorrido .{0,90} sin presentar|this is not about|this does not mean that/iu],
];
export function storyEditorialIssues(stories,englishStories){
 const issues=[];
 const check=(id,locale,chapter,field,text)=>{
  for(const [code,pattern]of patterns){const match=typeof text==='string'&&text.match(pattern);if(match)issues.push({id,locale,chapter,field,code,excerpt:match[0]});}
 };
 for(const story of stories.filter(h=>h.disponible)){
  for(const field of ['titulo','subtitulo','descripcion','contexto'])check(story.id,'es',null,field,story[field]);
  for(const[i,step]of story.pasos.entries())for(const field of ['titulo','texto'])check(story.id,'es',i+1,field,step[field]);
  const en=englishStories[story.id];if(!en){issues.push({id:story.id,code:'missing-english-story'});continue;}
  for(const field of ['title','subtitle','description','contexto'])check(story.id,'en',null,field,en[field]);
  for(const[i,step]of en.chapters.entries())for(const[j,field]of ['titulo','texto'].entries())check(story.id,'en',i+1,field,step[j]);
 }
 return issues;
}
