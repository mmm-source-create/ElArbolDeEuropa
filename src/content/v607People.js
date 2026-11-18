// 6.0.7: new people, complete in Spanish and English in the same delivery.
const WIKI_ES_ESTEBAN = {titulo:'Wikipedia en español · Esteban de Zápolya',url:'https://es.wikipedia.org/wiki/Esteban_de_Z%C3%A1polya'};
const WIKI_EN_STEPHEN = {titulo:'Wikipedia en inglés · Stephen Zápolya (con Markó 2006 y la archontología de C. Tóth et al. 2016)',url:'https://en.wikipedia.org/wiki/Stephen_Z%C3%A1polya'};
const MACARTNEY = {titulo:'C. A. Macartney · Hungary: A Short History · MEK',url:'https://mek.oszk.hu/02000/02086/02086.htm'};
const WIKI_ES_EDUVIGES = {titulo:'Wikipedia en español · Eduviges Piast',url:'https://es.wikipedia.org/wiki/Eduviges_Piast'};
const WIKI_PL_JADWIGA = {titulo:'Wikipedia en polaco · Jadwiga cieszyńska (con Sroka 2005 y Jasiński 2007)',url:'https://pl.wikipedia.org/wiki/Jadwiga_cieszy%C5%84ska'};
const WIKI_EN_HEDWIG = {titulo:'Wikipedia en inglés · Hedwig of Cieszyn',url:'https://en.wikipedia.org/wiki/Hedwig_of_Cieszyn'};

const records = {
  ESTEBANZAPOLYA: {
    name:'Stephen Zápolya',
    role:'Palatine of Hungary',
    aliases:['Szapolyai István','Stephen Szapolyai','Esteban Szapolyai','István Zápolya'],
    resumen:'Magnate húngaro de la casa de Zápolya y nádor del reino de Hungría de 1492 a 1499. Sirvió a Matías Corvino en Silesia y en las tierras austríacas ocupadas y apoyó la elección de Vladislao II en 1490. Con Eduviges de Teschen fue padre de Juan I de Zápolya y de Bárbara, reina de Polonia.',
    summary:'A Hungarian magnate of the house of Zápolya and Palatine of Hungary from 1492 to 1499. He served Matthias Corvinus in Silesia and in the occupied Austrian lands and supported the election of Vladislaus II in 1490. With Hedwig of Cieszyn he was the father of John Zápolya and of Barbara, Queen of Poland.',
    refs:[WIKI_EN_STEPHEN,WIKI_ES_ESTEBAN,MACARTNEY],
    parts:[
      ['Una familia en ascenso','A rising family',
       'Esteban era hijo de Ladislao de Zápolya y hermano de Emérico, que fue nádor antes que él. La familia procedía de la nobleza media y alcanzó la primera fila del reino al servicio de Matías Corvino. Esteban gobernó Silesia como capitán del rey entre 1474 y 1481 y, al final del reinado, dirigió el gobierno de las tierras austríacas que Matías había ocupado.',
       'Stephen was the son of Ladislaus Zápolya and the brother of Emeric, who held the office of palatine before him. The family came from the middle nobility and reached the front rank of the kingdom in the service of Matthias Corvinus. Stephen governed Silesia as the king’s captain between 1474 and 1481 and, at the end of the reign, directed the government of the Austrian lands Matthias had occupied.'],
      ['1490: un rey Jagellón para Hungría','1490: a Jagiellonian king for Hungary',
       'Matías murió en 1490 sin hijos legítimos. Esteban apoyó a Vladislao Jagellón, rey de Bohemia, frente a Juan Corvino, hijo natural de Matías, y a otros candidatos. Tras la elección de Vladislao II recibió en 1492 el cargo de nádor, la primera dignidad del reino después del rey, y lo conservó hasta su muerte. También mantuvo un enfrentamiento armado con Juan Corvino por el ducado de Liptó.',
       'Matthias died in 1490 without legitimate sons. Stephen backed Vladislaus Jagiellon, King of Bohemia, against John Corvinus, Matthias’s natural son, and other candidates. After the election of Vladislaus II he received the office of palatine in 1492, the highest dignity in the kingdom after the king, and held it until his death. He also fought a private war with John Corvinus over the duchy of Liptó.'],
      ['Matrimonio y herederos','Marriage and heirs',
       'En segundas nupcias se casó con Eduviges de Teschen, hija del duque Premislao II de Teschen. Tuvieron cuatro hijos: Juan, rey de Hungría desde 1526; Jorge, muerto en Mohács ese mismo año; Bárbara, casada en 1512 con Segismundo I de Polonia; y Magdalena, que murió niña. Esteban murió el 23 de diciembre de 1499 y fue enterrado en la capilla de los Zápolya del capítulo de Szepes.',
       'In his second marriage he wed Hedwig of Cieszyn, daughter of Duke Przemysław II of Cieszyn. They had four children: John, King of Hungary from 1526; George, killed at Mohács that same year; Barbara, married in 1512 to Sigismund I of Poland; and Magdalena, who died in childhood. Stephen died on 23 December 1499 and was buried in the Zápolya chapel of the Szepes chapter.'],
    ],
  },
  EDUVIGESTESCHEN: {
    name:'Hedwig of Cieszyn',
    role:'Princess of Cieszyn',
    aliases:['Eduviges Piast','Eduviges de Cieszyn','Jadwiga cieszyńska','Hedwig of Teschen','Hedvig tescheni hercegnő','Jadwiga Zapolya'],
    resumen:'Princesa de la rama de Teschen de los Piast y esposa del nádor Esteban de Zápolya. Tras enviudar en 1499 administró el patrimonio de la familia en Hungría. Fue madre de Juan I de Zápolya, rey de Hungría, y de Bárbara, primera esposa de Segismundo I de Polonia.',
    summary:'A princess of the Cieszyn branch of the Piasts and wife of Palatine Stephen Zápolya. After she was widowed in 1499 she managed the family’s estates in Hungary. She was the mother of John Zápolya, King of Hungary, and of Barbara, first wife of Sigismund I of Poland.',
    refs:[WIKI_PL_JADWIGA,WIKI_EN_HEDWIG,WIKI_ES_EDUVIGES],
    parts:[
      ['Una princesa Piast de Teschen','A Piast princess of Cieszyn',
       'Eduviges fue la única hija del duque Premislao II de Teschen y de Ana, hija del duque Boleslao IV de Varsovia. Nació entre 1469 y 1472. Su padre murió en 1477 y la tutela de la niña pasó a su primo Casimiro II de Teschen.',
       'Hedwig was the only child of Duke Przemysław II of Cieszyn and of Anna, daughter of Duke Bolesław IV of Warsaw. She was born between 1469 and 1472. Her father died in 1477, and guardianship of the girl passed to her cousin Casimir II of Cieszyn.'],
      ['Un matrimonio con los Zápolya','A marriage into the Zápolya family',
       'Casó con Esteban de Zápolya, uno de los principales magnates de Hungría, que ya había estado casado. La boda se ha fechado tradicionalmente el 11 de agosto de 1483; el estudio de Stanisław Sroka la sitúa en diciembre de 1486. El matrimonio tuvo cuatro hijos: Juan, Jorge, Bárbara y Magdalena. Esteban fue nádor de Hungría de 1492 a 1499.',
       'She married Stephen Zápolya, one of Hungary’s leading magnates, who had been married before. The wedding has traditionally been dated 11 August 1483; Stanisław Sroka’s study places it in December 1486. The couple had four children: John, George, Barbara and Magdalena. Stephen was Palatine of Hungary from 1492 to 1499.'],
      ['Viuda, patrona y madre de reyes','Widow, patron and mother of royalty',
       'Tras la muerte de Esteban en 1499, Eduviges permaneció en Hungría y administró el gran patrimonio familiar. Favoreció la cartuja de Lapis Refugii, en Spiš, donde en 1506 costeó dos celdas y una capilla. En 1512 su hija Bárbara se casó con Segismundo I de Polonia. Eduviges murió en el castillo de Trencsén en abril de 1521 y fue enterrada junto a su marido en Szepes. Cinco años después, su hijo Juan fue coronado rey de Hungría.',
       'After Stephen’s death in 1499 Hedwig remained in Hungary and managed the family’s large estates. She supported the Charterhouse of Lapis Refugii in Spiš, where in 1506 she paid for two cells and a chapel. In 1512 her daughter Barbara married Sigismund I of Poland. Hedwig died at Trencsén Castle in April 1521 and was buried beside her husband at Szepes. Five years later her son John was crowned King of Hungary.'],
    ],
  },
};

export const V607_BIOGRAPHIES=Object.fromEntries(Object.entries(records).map(([id,r])=>[id,r.parts.map(([titulo,,texto])=>({titulo,texto}))]));
export const V607_PERSON_CONTENT=Object.fromEntries(Object.entries(records).map(([id,r])=>[id,{resumen:r.resumen,biografia:r.parts.map(p=>p[2]).join('\n\n')}]));
export const V607_REFERENCES=Object.fromEntries(Object.entries(records).map(([id,r])=>[id,r.refs]));
export const V607_PROFILES=Object.fromEntries(Object.entries(records).map(([id,r])=>[id,{name:r.name,role:r.role,summary:r.summary,nickname:'',aliases:r.aliases,sections:r.parts.map(([,title,,text])=>[title,text])}]));
V607_PROFILES.EDUVIGESTESCHEN.governmentNotes={
 'Nació entre 1469 y 1472; el año exacto no consta.':'She was born between 1469 and 1472; the exact year is not recorded.',
 'Las fuentes polacas e inglesas fechan la muerte el 16 de abril de 1521; la biografía española indica el 6 de abril.':'Polish and English sources date her death to 16 April 1521; the Spanish biography gives 6 April.',
 'La boda se fechaba el 11 de agosto de 1483 (Jasiński); Sroka la sitúa en diciembre de 1486.':'The wedding used to be dated 11 August 1483 (Jasiński); Sroka places it in December 1486.',
};
V607_PROFILES.ESTEBANZAPOLYA.governmentNotes={
 'El año de nacimiento no consta en las referencias consultadas.':'His year of birth is not recorded in the references consulted.',
};
