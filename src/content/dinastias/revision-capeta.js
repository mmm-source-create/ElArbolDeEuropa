const ANJOU='https://www.larousse.fr/encyclopedie/autre-region/Anjou/105538';
const COURTENAY='https://www.larousse.fr/encyclopedie/groupe-personnage/maison_de_Courtenay/114979';
const ORLEANS='https://www.larousse.fr/encyclopedie/groupe-homonymes/maisons_d_Orléans/136334';
const CASTIGLIONE='https://www.treccani.it/enciclopedia/baldassarre-castiglione_(Dizionario-Biografico)/';
export const CASAS_REVISION_CAPETA={
 'Anjou':{
  resumen:'La casa capeta de Anjou, iniciada por Carlos I, hermano de Luis IX, gobernó en el Mediterráneo y dio origen a las ramas de Hungría, Tarento y Durazzo.',
  origen:'Carlos recibió Anjou en 1246. Su ascendencia capeta lo distingue de los antiguos condes de Anjou-Gâtinais, de los que procedían Fulco V y los Plantagenet. Compartir el título de Anjou no convierte ambos linajes en una misma rama.',
  trayectoria:'Carlos conquistó el reino de Sicilia en 1266. Tras las Vísperas sicilianas de 1282 conservó el reino peninsular, conocido como Nápoles. De Carlos II descienden Carlos Martel, origen de la rama húngara, Felipe de Tarento y Juan de Durazzo. Sus patrimonios y pretensiones tuvieron historias propias.',
  legado:'La adopción de Luis I por Juana I de Nápoles no trasladó a Luis a la genealogía de Carlos I: pertenecía a Valois-Anjou, una segunda casa angevina. El lambel rojo del escudo capeto permite distinguirla de la bordura roja de los Valois-Anjou.',
  territorios:['Anjou','Nápoles','Sicilia','Provenza'],protagonistas:['CARLOS1ANJ','CARLOS2NAP','ROB1NAP','JUANA1NAP'],fuentes:[ANJOU],
 },
 'Anjou-Gâtinais':{
  resumen:'Los antiguos condes angevinos enlazaron con la monarquía inglesa y con el reino de Jerusalén antes de la aparición de los Anjou capetos.',
  origen:'Fulco V fue conde de Anjou y padre de Godofredo, que se casó con Matilde de Inglaterra. Godofredo y Matilde fueron padres de Enrique II, origen de la continuidad Plantagenet en Inglaterra.',
  trayectoria:'Fulco se casó con Melisenda y fue rey de Jerusalén desde 1131. Balduino III, Amalarico I y Balduino IV pertenecen a esta descendencia. Sibila e Isabel transmitieron derechos sucesorios a sus propios descendientes y matrimonios.',
  legado:'La ficha separa esta primera casa angevina de la fundada por Carlos I en el siglo XIII. El modelo heráldico de Godofredo identifica su ámbito familiar, sin atribuir a cada rey de Jerusalén unas armas personales idénticas.',
  territorios:['Anjou','Jerusalén'],protagonistas:['FULK5JER','BALDWIN3JER','AMALRIC1JER','BALDWIN4JER','SIBYLLAJER','ISABELLA1JER'],fuentes:[ANJOU,'https://fmg.ac/Projects/MedLands/JERUSALEM.htm'],
 },
 'Valois-Anjou':{
  resumen:'La segunda casa capeta de Anjou procede de Luis I, hijo de Juan II de Francia, y disputó Nápoles a otras ramas angevinas y a Aragón.',
  origen:'Luis I recibió Anjou como apanage y fue duque desde 1360. Era hermano de Carlos V de Francia y pertenecía a los Valois. Juana I de Nápoles lo adoptó como heredero en 1380, sin convertirlo en descendiente masculino de la primera casa de Anjou.',
  trayectoria:'Luis I y Luis II disputaron el reino napolitano a los Durazzo. Renato reunió herencias y derechos en Lorena, Bar y Provenza y perdió Nápoles ante Alfonso V en 1442. Margarita de Anjou, hija de Renato, fue reina de Inglaterra por su matrimonio con Enrique VI; María de Anjou fue reina de Francia junto a Carlos VII.',
  legado:'La bordura roja diferencia las armas de esta rama de las de los primeros Anjou capetos, que emplean un lambel. Las pretensiones a Jerusalén y Nápoles no equivalen a gobiernos efectivos sobre todos los territorios representados en sus armas compuestas.',
  territorios:['Anjou','Nápoles','Provenza','Lorena','Bar'],protagonistas:['LUIS1ANJOU','LUIS2ANJOU','RENATOANJOU','MARGANJOUING','MARIAANJOU'],fuentes:[ANJOU,'https://history.queens.cam.ac.uk/sites/default/files/downloads/record-2004.pdf'],
 },
 'Courtenay':{
  resumen:'La casa capeta de Courtenay procede de Pedro, hijo de Luis VI, y de Isabel, heredera del señorío de la primera casa de Courtenay.',
  origen:'El matrimonio de Pedro con Isabel transmitió el nombre y el patrimonio de Courtenay a una nueva descendencia de ascendencia capeta. La primera casa, a la que perteneció Inés de Courtenay, se presenta por separado como Courtenay-Edesa.',
  trayectoria:'Pedro II y sus descendientes accedieron al Imperio latino de Constantinopla. El título imperial subsistió después de la pérdida de la ciudad en 1261. Catalina de Courtenay lo transmitió a su hija Catalina de Valois, que conserva la casa de su padre Carlos de Valois.',
  legado:'La transmisión de un título por línea femenina no transforma al cónyuge ni a los hijos en una rama masculina de la casa que lo poseía. Los tres roeles son un emblema compartido por continuidad patrimonial, no prueba de una filiación masculina entre las dos casas.',
  territorios:['Francia','Bizancio y Oriente latino'],protagonistas:['ROB1COUR','BALD2COUR','FELCOUR','CATHCOUR'],fuentes:[COURTENAY],
 },
 'Courtenay-Edesa':{
  resumen:'La primera casa de Courtenay participó en los Estados cruzados y dio condes a Edesa. Es anterior y distinta de la casa capeta del mismo nombre.',
  origen:'Los antiguos señores de Courtenay extendieron sus conexiones hacia Oriente. La línea de los condes Joscelino de Edesa pertenece a este linaje, sin descender de Pedro, hijo de Luis VI.',
  trayectoria:'Inés de Courtenay, hija de Joscelino II de Edesa, se casó con Amalarico de Jerusalén y fue madre de Balduino IV y Sibila. El Atlas recoge esta conexión sin completar conjeturalmente las generaciones aún ausentes.',
  legado:'La separación evita incluir a Inés dentro de los Capeto por el solo nombre Courtenay. Su descendencia jerosolimitana conserva la identidad familiar de sus respectivos padres.',
  territorios:['Jerusalén'],protagonistas:['AGNESCOURJER','BALDWIN4JER','SIBYLLAJER'],fuentes:[COURTENAY,'https://fmg.ac/Projects/MedLands/JERUSALEM.htm'],
 },
 'Borbón-Orleans-Gastón':{
  resumen:'La creación de Orleans para Gastón, hermano de Luis XIII, pertenece a una línea distinta de la fundada después por Felipe I.',
  origen:'Gastón, hijo de Enrique IV y María de Médici, recibió el ducado de Orleans en 1626. Su título no lo convierte en antepasado masculino de Felipe I, su sobrino, que recibiría Orleans en 1661.',
  trayectoria:'Sus hijas enlazaron con varias cortes europeas. Margarita Luisa, hija de su matrimonio con Margarita de Lorena, se casó con Cosme III de Médici. La clasificación distingue esas conexiones de la descendencia de Felipe I y del regente Felipe II.',
  legado:'La línea masculina de Gastón terminó con su muerte en 1660. Las dos creaciones pueden compartir el escudo de Francia al lambel de plata, que se reutiliza sin duplicar el archivo de imagen.',
  territorios:['Francia','Toscana'],protagonistas:['GASTONORLEANS','MARGARITALUISAORL'],fuentes:[ORLEANS],
 },
 'Borbón-Orleans':{
  resumen:'La casa de Orleans fundada por Felipe I, hermano de Luis XIV, continuó a través del regente Felipe II y de sus descendientes.',
  origen:'Felipe I era hijo de Luis XIII y Ana de Austria. Recibió Orleans en 1661, después de morir su tío Gastón. Ambas creaciones son ramas de Borbón, pero Felipe no desciende de Gastón.',
  trayectoria:'Sus matrimonios con Enriqueta de Inglaterra e Isabel Carlota del Palatinado conectaron la casa con los Estuardo y los Wittelsbach. Felipe II, hijo del segundo matrimonio, fue regente durante la minoría de Luis XV.',
  legado:'La descendencia de Felipe I prolongó la casa hasta la monarquía de Luis Felipe en el siglo XIX. El lambel de plata diferencia sus armas; el mismo dibujo no elimina la separación entre esta creación y la de Gastón.',
  territorios:['Francia'],protagonistas:['FELIPE1ORLEANS','FELIPE2ORLEANS'],fuentes:[ORLEANS],
 },
 'Castiglione-Mantua':{
  resumen:'La familia mantuana del humanista Baldassare Castiglione, autor de El cortesano, enlazó con los Gonzaga y los Torelli.',
  origen:'La biografía de Treccani documenta a Cristoforo Castiglione y Luigia, o Aloisa, Gonzaga como padres de Baldassare. La ficha mantiene esta familia separada de los Castiglione milaneses representados por el papa Celestino IV: no se inventa una cadena intermedia de parentescos.',
  trayectoria:'Baldassare nació en Casatico en 1478, sirvió en Mantua y Urbino y se casó con Ippolita Torelli en 1516. Su actividad diplomática lo llevó a Roma y España, donde fue nuncio de Clemente VII ante Carlos V.',
  legado:'El cortesano, publicado en 1528, convirtió la conversación de la corte de Urbino en un modelo de educación y conducta. Los lugares de servicio no se registran como gobiernos territoriales de la familia.',
  territorios:['Mantua','Urbino'],protagonistas:['BALDASSARECASTIGLIONE','CRISTOFOROCASTIGLIONE','LUIGIAGONZAGACASTIGLIONE','IPPOLITATORELLI'],fuentes:[CASTIGLIONE],
 },
 'Torelli':{
  resumen:'La conexión Torelli representada en el Atlas es Ippolita, esposa de Baldassare Castiglione.',
  origen:'La ficha parte del matrimonio documentado de Ippolita con Castiglione en 1516. No completa la genealogía de los Torelli con personas o filiaciones aún no verificadas.',
  trayectoria:'Ippolita murió en 1520, antes de la etapa eclesiástica y española de su marido. Su presencia permite distinguir la familia de Castiglione de las relaciones de servicio con los Gonzaga y los duques de Urbino.',
  legado:'El enlace matrimonial es una conexión entre casas; no implica que los Torelli fueran una rama de los Castiglione ni que gobernasen todos los territorios asociados a su trayectoria.',
  territorios:['Mantua'],protagonistas:['IPPOLITATORELLI','BALDASSARECASTIGLIONE'],fuentes:[CASTIGLIONE],
 },
};
export const RAMAS_REVISION_CAPETA=[
 {id:'anjou-capeta',origen:'Capeto',destino:'Anjou',periodo:'1246',fundador:'CARLOS1ANJ',personas:['CARLOS1ANJ','CARLOS2NAP'],texto:'Carlos I, hermano de Luis IX, inicia la casa capeta de Anjou. Es distinta de los antiguos condes angevinos.'},
 {id:'anjou-hungria-capeta',origen:'Anjou',destino:'Anjou-Hungría',periodo:'Siglos XIII–XIV',fundador:'CARLOSM',personas:['CARLOS2NAP','CARLOSM','CARLOS1','LUIS1'],texto:'Carlos Martel, hijo de Carlos II de Nápoles, encabeza la rama de la que procede Carlos Roberto de Hungría.'},
 {id:'anjou-tarento-capeta',origen:'Anjou',destino:'Anjou-Tarento',periodo:'Finales del siglo XIII',fundador:'FELIPETARENTO',personas:['CARLOS2NAP','FELIPETARENTO'],texto:'Felipe, hijo de Carlos II, inicia la línea de Tarento.'},
 {id:'anjou-durazzo-capeta',origen:'Anjou',destino:'Anjou-Durazzo',periodo:'Siglo XIV',fundador:'JUANDURAZZO',personas:['CARLOS2NAP','JUANDURAZZO','CARLOS3NAP'],texto:'La rama procede de Juan, hijo de Carlos II de Nápoles. Sus descendientes disputaron Nápoles a Juana I y a los Valois-Anjou.'},
 {id:'valois-anjou',origen:'Valois',destino:'Valois-Anjou',periodo:'1360',fundador:'LUIS1ANJOU',personas:['JUAN2FRA','LUIS1ANJOU','LUIS2ANJOU','RENATOANJOU'],texto:'Luis I de Anjou era hijo de Juan II de Francia. La adopción napolitana no lo convierte en una rama masculina de los primeros Anjou capetos.'},
 {id:'artois-capeta',origen:'Capeto',destino:'Artois',periodo:'1237',fundador:'ROB1ART',personas:['ROB1ART'],texto:'Roberto I, hermano de Luis IX, recibió Artois. El lambel cargado de castillos diferencia sus armas.'},
 {id:'orleans-gaston',origen:'Borbón',destino:'Borbón-Orleans-Gastón',periodo:'1626',fundador:'GASTONORLEANS',personas:['ENRIQ4FRA','GASTONORLEANS','MARGARITALUISAORL'],texto:'Gastón, hijo de Enrique IV, recibió Orleans. Su línea masculina terminó en 1660.',fuentes:[ORLEANS]},
 {id:'orleans-felipe',origen:'Borbón',destino:'Borbón-Orleans',periodo:'1661',fundador:'FELIPE1ORLEANS',personas:['LUIS13FRA','FELIPE1ORLEANS','FELIPE2ORLEANS'],texto:'Felipe I, hijo de Luis XIII, inicia otra creación de Orleans. El regente Felipe II es su hijo; no desciende de Gastón.',fuentes:[ORLEANS]},
].map(r=>({tipo:'rama_cadete',fuentes:[ANJOU],...r}));
