import {ADVANCED_TUTORIAL_COURSES} from './atlasTutorialAdvanced.js';
// Los identificadores y la clave de V1 se conservan al completar el tutorial.
export const TUTORIAL_STORAGE_KEY = 'eade:atlas-tutorial:v1';
export const ATLAS_TUTORIAL = {
  es: {
    title:'Ayuda del Atlas', intro:'Aprende a explorar una persona, su familia y su época. Puedes practicar en el Atlas mientras lees.',
    sections:['Recorridos','Guía de lectura','Controles'], start:'Empezar', resume:'Reanudar', restart:'Volver a empezar', completed:'Completado',
    previous:'Anterior', next:'Siguiente', finish:'Completar recorrido', index:'Todos los recorridos', close:'Cerrar guía', collapse:'Plegar guía', expand:'Desplegar guía',
    saved:'El avance se guarda en este navegador. Cerrar la ayuda conserva el paso; reanudarlo no cambia la vista.',
    practice:'Los botones de práctica actúan sobre el Atlas: selección, año, mapas, conexiones o filtros. Algunos pliegan la ayuda para dejar ver el resultado; puedes desplegarla de nuevo. Anterior y Siguiente solo cambian la explicación.',
    ready:'El Atlas se está preparando. Puedes leer la guía; los ejemplos estarán disponibles al terminar.',
    courses:[
      {id:'persona',title:'Encontrar y leer una persona',description:'De la búsqueda a los gobiernos y las fuentes.',steps:[
        {id:'buscar',title:'Busca un nombre',body:'La búsqueda está en la barra superior. Escribe Carlos V: aparecen personas, casas, territorios e historias. Comprueba el nombre del resultado antes de abrirlo.',action:'search',label:'Buscar a Carlos V',result:'Verás las coincidencias de la búsqueda. Puedes elegir el resultado o continuar con el ejemplo.'},
        {id:'ficha',title:'Abre su ficha',body:'Al elegir una persona se abre su biografía. Seleccionarla no añade automáticamente toda su familia al árbol. El botón siguiente prepara a Carlos V como ejemplo.',action:'select',person:'CARLOS5',label:'Mostrar a Carlos V',result:'La ficha identifica a la persona seleccionada; el árbol conserva su selección de personas.'},
        {id:'fuentes',title:'Lee gobiernos y fuentes',body:'Resumen presenta a la persona; Coronas reúne sus gobiernos y distingue el poder efectivo de una regencia o pretensión. En Fuentes puedes contrastar los datos. «Leer ficha completa» abre su página de lectura.',action:'sources',person:'CARLOS5',label:'Ver las fuentes de Carlos V',result:'Una relación familiar o un título reclamado no demuestra que gobernase un territorio.'},
        {id:'volver',title:'Vuelve al árbol',body:'Centrar persona recupera su posición cuando ya está en el árbol. Si la selección está vacía, usa el recorrido de familia para añadir personas. Puedes plegar esta guía para ver mejor el área de trabajo.',action:'center',label:'Centrar persona',result:'La ficha y el árbol son dos formas de consultar la misma persona.'},
      ]},
      {id:'familia',title:'Recorrer una familia',description:'Añade familiares y sigue una nueva generación.',steps:[
        {id:'origen',title:'Parte de una persona',body:'Usaremos a Carlos V. Si vienes de una historia, de Europa o de una comparación, este botón abre su ficha en la vista del Atlas.',action:'select',person:'CARLOS5',label:'Mostrar a Carlos V',result:'El punto de partida queda seleccionado, sin sustituir las personas que ya has añadido.'},
        {id:'anadir',title:'Añade la familia cercana',body:'En Familia puedes añadir padres, hermanos, parejas e hijos registrados. El botón añade solo las personas que faltan. Deshacer permite retirar la última ampliación.',action:'family',person:'CARLOS5',label:'Añadir familia de Carlos V',result:'Las líneas representan relaciones registradas. La ausencia de una línea puede deberse a que el dato aún no esté incorporado.'},
        {id:'generacion',title:'Sigue otra generación',body:'Elige a Felipe el Hermoso, padre de Carlos V. En su apartado Familia puedes añadir sus propios familiares y seguir ampliando la red. Seleccionar una tarjeta y ampliar una rama son acciones distintas.',action:'relative',person:'FEL1CAST',label:'Mostrar a Felipe el Hermoso',result:'El parentesco se sigue persona a persona; compartir una casa no equivale por sí solo a un parentesco concreto.'},
        {id:'orientacion',title:'Recupera la orientación',body:'Arrastra el árbol para moverte y usa + y − para ampliar. Con el árbol enfocado también puedes usar el teclado. Centrar persona vuelve a la seleccionada si forma parte del árbol.',action:'center',label:'Centrar persona',result:'Para practicar otra rama, selecciona a una persona y abre Familia en su ficha.'},
      ]},
      {id:'tiempo',title:'Situarse en el tiempo',description:'Compara dos años y consulta la cronología.',steps:[
        {id:'persona',title:'Prepara el ejemplo',body:'Volvemos a Carlos V para observar cómo cambian sus gobiernos con el año. La selección de una persona y la elección del año son controles independientes.',action:'select',person:'CARLOS5',label:'Mostrar a Carlos V',result:'Mantén la misma persona mientras comparas distintos momentos.'},
        {id:'1500',title:'Elige el año 1500',body:'El año de la barra superior cambia el momento que estás consultando. En 1500 Carlos V acaba de nacer: sus gobiernos posteriores no deben leerse como si ya los ejerciera.',action:'year',year:1500,label:'Ir al año 1500',result:'La fecha de vida y las fechas de gobierno responden a preguntas distintas.'},
        {id:'1530',title:'Compara con 1530',body:'Cambia ahora a 1530 y consulta sus gobiernos y el mapa personal. El año también afecta a Europa en este año. El mapa personal y el común se interpretan con los criterios de Cómo leer el mapa, en la Guía de lectura.',action:'year',year:1530,label:'Ir al año 1530',result:'Consulta el inspector de cada territorio para conocer autoridades, límites de la atribución y fuentes.'},
        {id:'cronologia',title:'Consulta la cronología',body:'Cronología se abre desde Paneles y permite situar personas, gobiernos y acontecimientos. Cambiar el año no añade personas al árbol. Puedes quitar la selección temporal con el control de año de la barra superior.',action:'timeline',label:'Mostrar cronología',result:'Ya puedes repetir la comparación con otra persona y otros años.'},
      ]},
    ],
    reading:[
      {id:'fichas',title:'Leer una ficha',paragraphs:['Resumen reúne la biografía y las fechas de vida. Familia permite recorrer relaciones. Coronas distingue gobiernos, regencias y pretensiones. Historias ofrece relatos relacionados y Fuentes permite contrastar los datos.','Las fechas aproximadas y las relaciones discutidas llevan sus notas. Una ficha incompleta no prueba que históricamente no existiera una persona, relación o gobierno.']},
      {id:'arbol',title:'Leer y ampliar el árbol',paragraphs:['Buscar una persona abre su ficha; añadir su familia amplía el árbol. Padres, parejas e hijos se consultan en Familia. Las ampliaciones se pueden deshacer. «Centrar persona» requiere que esa persona forme parte del árbol.','Conectar personas permite estudiar una conexión entre dos y cinco personas. Lee el criterio de vínculos elegido y distingue el parentesco documentado de la pertenencia a una misma casa.']},
      {id:'tiempo',title:'Años, filtros y cronología',paragraphs:['El año sitúa la consulta en un momento; no cambia las fechas originales de una persona. Los periodos de gobierno pueden ser distintos de sus fechas de vida. Cronología se abre desde Paneles.','Los filtros pueden ocultar a personas del árbol. «Vinculados» reúne relaciones registradas con un territorio; «Gobernaban en el año» exige un gobierno en ese año. Retira filtros si necesitas recuperar una selección.']},
      {id:'casas',title:'Casas, favoritos y enlaces',paragraphs:['Las páginas de dinastías reúnen personas e historias de cada casa. Casas de origen y ramas explica sus conexiones; una filiación, un matrimonio y una sucesión no son la misma relación.','Los favoritos se guardan en este navegador. Compartir crea un enlace a una exploración; no envía tu lista privada de favoritos. Exportar permite conservar una imagen del árbol seleccionado.']},
    ],
    controls:[['Moverse','Arrastra el árbol o enfócalo y utiliza las flechas. En una tarjeta, las flechas recorren tarjetas próximas.'],['Ampliar','Utiliza los botones + y − del árbol. En pantalla táctil, usa los controles visibles.'],['Elegir una persona','Haz clic, toca una tarjeta o enfócala con Tab y pulsa Enter.'],['Leer mientras practicas','La guía no bloquea el Atlas. Pliégala para dejar más espacio y vuelve a desplegarla cuando quieras.'],['Navegar y salir','Tab recorre los controles. Escape cierra la guía y devuelve el foco al control desde el que la abriste.'] ],
  },
};

// El Atlas en inglés conserva una ayuda traducida con el mismo alcance de V1.
ATLAS_TUTORIAL.en = {
  ...ATLAS_TUTORIAL.es, title:'Atlas help',intro:'Explore a person, their family and their time. You can use the Atlas while reading.',
  sections:['Walkthroughs','Reading guide','Controls'],start:'Start',resume:'Resume',restart:'Start again',completed:'Completed',previous:'Back',next:'Next',finish:'Complete walkthrough',index:'All walkthroughs',close:'Close guide',collapse:'Collapse guide',expand:'Expand guide',
  saved:'Progress is saved in this browser. Closing keeps your step; resuming does not change the view.',practice:'Practice buttons act on the Atlas: selection, year, maps, connections or filters. Some collapse the guide to reveal the result; you can reopen it. Back and Next only change the explanation.',ready:'The Atlas is loading. You can read the guide while the examples become available.',
  courses:[
    {id:'persona',title:'Find and read a person',description:'From search results to governments and sources.',steps:[
      {id:'buscar',title:'Search for a name',body:'Use the search at the top. Enter Charles V and check the person, house, territory or story in the results.',action:'search',label:'Search for Charles V',result:'Select a result or continue with the example.'},
      {id:'ficha',title:'Open a record',body:'Selecting someone opens their biography. It does not automatically add their family to the tree.',action:'select',person:'CARLOS5',label:'Show Charles V',result:'The biography identifies the selected person; the tree keeps your chosen people.'},
      {id:'fuentes',title:'Read governments and sources',body:'Summary introduces the person. Crowns distinguishes effective rule, regencies and claims. Sources lets you check the evidence; the full profile offers a reading view.',action:'sources',person:'CARLOS5',label:"Read Charles V's sources",result:'A family relationship or a claimed title does not establish effective rule.'},
      {id:'volver',title:'Return to the tree',body:'Centre person returns to the selected person if they are in the tree. Use the family walkthrough to add people to an empty selection.',action:'center',label:'Centre person',result:'The biography and tree describe the same person.'},
    ]},
    {id:'familia',title:'Explore a family',description:'Add relatives and follow another generation.',steps:[
      {id:'origen',title:'Start with a person',body:'Use Charles V as the example. The button opens his biography in the Atlas.',action:'select',person:'CARLOS5',label:'Show Charles V',result:'The selected person changes; people you already added stay in the tree.'},
      {id:'anadir',title:'Add close family',body:'Family adds registered parents, siblings, partners and children. Only missing people are added. Undo removes the latest expansion.',action:'family',person:'CARLOS5',label:"Add Charles V's family",result:'Lines represent recorded relationships; missing lines may reflect incomplete data.'},
      {id:'generacion',title:'Follow another generation',body:'Choose Philip the Handsome, Charles V’s father. His Family section lets you add more relatives. Selecting a person and expanding a branch are separate actions.',action:'relative',person:'FEL1CAST',label:'Show Philip the Handsome',result:'Sharing a house does not establish a specific family relationship.'},
      {id:'orientacion',title:'Find your bearings',body:'Drag the tree, use + and −, or focus the tree to use the keyboard. Centre person works when the selected person belongs to the tree.',action:'center',label:'Centre person',result:'Choose another person and open Family to explore a new branch.'},
    ]},
    {id:'tiempo',title:'Explore a year',description:'Compare two years and read the timeline.',steps:[
      {id:'persona',title:'Prepare the example',body:'Return to Charles V. Selecting a person and choosing a year are independent controls.',action:'select',person:'CARLOS5',label:'Show Charles V',result:'Keep the same person while comparing years.'},
      {id:'1500',title:'Choose 1500',body:'Charles V has just been born. His later governments should not be read as powers he already exercised.',action:'year',year:1500,label:'Go to 1500',result:'Dates of life and dates of government answer different questions.'},
      {id:'1530',title:'Compare with 1530',body:'Change to 1530 and compare his governments and personal map. The year also affects Europe in this year. The Reading guide links to the shared map criteria.',action:'year',year:1530,label:'Go to 1530',result:'Inspect a territory to consult its authorities and sources.'},
      {id:'cronologia',title:'Read the timeline',body:'Open Timeline from Panels to locate people, governments and events. Changing the year does not add people to the tree.',action:'timeline',label:'Show timeline',result:'You can now repeat the comparison with other people and years.'},
    ]},
  ],
  reading:[
    {id:'fichas',title:'Read a record',paragraphs:['Summary introduces the person. Family shows relationships, Crowns shows governments, Stories offers related narratives, and Sources lets you check the evidence. Approximate dates and disputed relationships carry notes.']},
    {id:'arbol',title:'Read and expand the tree',paragraphs:['Selecting a person opens their record; adding family expands the tree. Expansions can be undone. Centre person requires that person to be in the tree. Connecting people distinguishes recorded relationships from shared house membership.']},
    {id:'tiempo',title:'Years, filters and timeline',paragraphs:['The selected year does not change original dates. Filters may hide people. Associated means a recorded territorial connection; Ruling in the year requires a government in that year. Timeline is available from Panels.']},
    {id:'casas',title:'Houses, favourites and links',paragraphs:['House pages explain origins and branches. Descent, marriage and succession are different connections. Favourites stay in this browser; sharing creates a link to an exploration, and exporting preserves an image of the selected tree.']},
  ],
  controls:[['Move','Drag the tree or focus it and use the arrow keys. On a card, arrows move between nearby cards.'],['Zoom','Use the visible + and − controls, including on a touch screen.'],['Select','Click, tap, or focus a card with Tab and press Enter.'],['Read and practise','The guide does not block the Atlas. Collapse it to leave more room.'],['Leave','Tab moves between controls. Escape closes the guide and returns focus to its opener.']],
};

ATLAS_TUTORIAL.es.courses.push(...ADVANCED_TUTORIAL_COURSES.es);
ATLAS_TUTORIAL.en.courses.push(...ADVANCED_TUTORIAL_COURSES.en);

export function tutorialProgress(value) {
  const progress = {};
  for (const course of ATLAS_TUTORIAL.es.courses) {
    const entry = value?.courses?.[course.id];
    const step = course.steps.some(s => s.id === entry?.step) ? entry.step : course.steps[0].id;
    if (entry && typeof entry === 'object') progress[course.id] = {step,complete:entry.complete === true};
  }
  return {version:1,courses:progress};
}
