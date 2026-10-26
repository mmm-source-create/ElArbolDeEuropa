import {REVIEWED_100_PROFILES} from './reviewed100Profiles.js';
import {IBERIAN_ENGLISH_PROFILES} from './iberianProfiles.js';
import {EXPANDED_ENGLISH_PROFILES} from './expandedProfiles.js';
import {V535_ENGLISH_PROFILES} from './v535Profiles.js';
import {V536_ENGLISH_PROFILES} from './v536Profiles.js';
// Editorial translations of complete Spanish profiles. Canonical IDs, dates,
// relationships and territorial keys are supplied by the shared generator.
export const COMPLETE_ENGLISH_PROFILES = {
  ...REVIEWED_100_PROFILES,
  ...EXPANDED_ENGLISH_PROFILES,
  ...V535_ENGLISH_PROFILES,
  ...V536_ENGLISH_PROFILES,
  ...IBERIAN_ENGLISH_PROFILES,
  CARLOS3NAP: {
    name: 'Charles of Durazzo', role: 'Charles III of Naples and Charles II of Hungary', nickname: 'the Short',
    aliases: ['Charles III of Naples', 'Charles II of Hungary', 'Charles the Short'],
    summary: 'Charles of Durazzo governed Croatia and Dalmatia on behalf of Louis I before taking the Neapolitan throne in 1381. His domains included Corfu and Butrint; his authority over Achaea was contested by the Navarrese Company. Crowned king of Hungary and Croatia on 31 December 1385, he was attacked in Buda in February 1386 and died shortly afterwards. His title to Jerusalem did not confer control of the Holy Land.',
  },
  LUIS1: {
    name: 'Louis I of Hungary', role: 'King of Hungary, Croatia and Poland', nickname: 'the Great',
    summary: 'His inheritance of the Polish crown added a personal union to his Hungarian monarchy. The succession of his daughters Mary and Jadwiga subsequently took the two kingdoms in separate directions.',
  },
  MARIA1H: {
    name: 'Mary I of Hungary', role: 'Queen of Hungary and Croatia', aliases: ['Mary, Queen of Hungary'],
    summary: 'Her accession to the Hungarian throne triggered a crisis involving her mother, the magnates and Charles of Durazzo. Her marriage to Sigismund of Luxembourg linked him to the crown.',
  },
  EDUV1: {
    name: 'Jadwiga of Poland', role: 'Queen regnant of Poland, crowned as king',
    summary: 'Queen of Poland in her own right and wife of Władysław Jagiełło. Her marriage linked Poland with Lithuania and had decisive consequences for Christianisation and the politics of eastern Europe.',
  },
  HENRY2ING: {
    name: 'Henry II of England', role: 'King of England · Duke of Normandy and Aquitaine · Count of Anjou',
    summary: 'A Plantagenet king who built extensive Anglo-French domains and strengthened royal justice in England. His conflict with Thomas Becket and the rivalry among his sons shaped the final years of his reign.',
    governmentNotes: {
      'Su padre le cedió el ducado en 1150; Luis VII lo invistió en 1151.': 'His father transferred the duchy to him in 1150; Louis VII invested him in 1151.',
      'Heredó Anjou, con Turena, y Maine a la muerte de su padre en 1151.': 'He inherited Anjou, including Touraine, and Maine on his father’s death in 1151.',
      'Por su matrimonio con Leonor de Aquitania en 1152.': 'Through his marriage to Eleanor of Aquitaine in 1152.',
    },
  },
  ELEANORAQUIT: {
    name: 'Eleanor of Aquitaine', role: 'Duchess of Aquitaine · Queen consort of France and England',
    summary: 'Duchess of Aquitaine and queen consort first of France and then of England. Her remarkable family network made her one of the most influential dynastic figures in twelfth-century Europe.',
  },
  RICARDO1ING: {
    name: 'Richard I of England', role: 'King of England · Duke of Normandy and Aquitaine · Count of Anjou', nickname: 'the Lionheart',
    summary: 'The third son of Henry II and Eleanor of Aquitaine, he was Duke of Aquitaine from 1172 and King of England from 1189 to 1199. He led the Third Crusade alongside Philip Augustus, defeated Saladin at Arsuf in 1191 and negotiated access to Jerusalem for pilgrims. Captured on his return by Leopold V of Austria, he was handed over to Emperor Henry VI and held until an enormous ransom was paid in 1194. He spent his final years defending Normandy against France and died at the siege of Châlus.',
    aliases: ['Richard the Lionheart', 'Richard Cœur de Lion'],
    governmentNotes: {
      'Investido duque en Limoges en 1172; gobernó el ducado junto a su madre, la duquesa Leonor.': 'Invested as duke at Limoges in 1172; he governed the duchy alongside his mother, Duchess Eleanor.',
      'Pasó menos de un año en Inglaterra: la tercera cruzada (1190–1192), su cautiverio en Alemania (1192–1194) y la guerra contra Felipe Augusto lo retuvieron en el continente.': 'He spent less than a year in England: the Third Crusade (1190–1192), his captivity in Germany (1192–1194) and war against Philip Augustus kept him on the continent.',
    },
    sections: [
      ['A prince of Aquitaine', 'Born in Oxford in 1157, the third son of Henry II and Eleanor of Aquitaine, Richard grew up closely connected to his mother’s duchy. He was invested as duke at Poitiers and Limoges in 1172. The following year he joined his brothers’ great rebellion against their father. After their reconciliation, he spent a decade subduing the Aquitanian barons. The death of Henry the Young King in 1183 made him the heir, and his distrust of Henry II led him to ally with Philip Augustus. His father died defeated at Chinon in 1189.'],
      ['The Third Crusade', 'Crowned at Westminster in September 1189, Richard sold offices and lands to finance the crusade. He wintered in Sicily, where he secured the release of his sister Joan, conquered Cyprus in 1191 and married Berengaria of Navarre there. After the fall of Acre, which Philip Augustus left to return to France, he defeated Saladin at Arsuf. He did not attempt to capture Jerusalem. In 1192 he negotiated a truce at Jaffa that left the coast to the crusaders and opened the city to pilgrims.'],
      ['Captivity and ransom', 'On his return, a shipwreck forced him to travel through imperial territory. In December 1192 he was captured near Vienna by Leopold V of Austria, whom he had humiliated at Acre, and handed over to Emperor Henry VI. The demanded ransom of 150,000 marks was raised through extraordinary taxes across his domains. Released in February 1194, he suppressed the rebellion of his brother John, whom he pardoned, and took part in another crown-wearing ceremony at Winchester.'],
      ['Defending Normandy', 'His final five years were spent in continuous warfare against Philip Augustus, who had occupied part of Normandy during his captivity. Richard built Château Gaillard in 1196–1198 to defend the Seine valley and won a victory near Gisors in 1198. He died on 6 April 1199 from a crossbow wound received at the siege of Châlus in the Limousin. He was buried at Fontevraud beside his father. John Lackland inherited domains, much of which he would lose in 1204.'],
    ],
  },
  ISABEL1ING: {
    name: 'Elizabeth I of England', role: 'Queen of England and Ireland', nickname: 'the Virgin Queen',
    summary: 'Queen of England during a period of political consolidation, maritime expansion and religious conflict. Her long reign became associated with the Elizabethan cultural flowering and rivalry with Spain.',
    sections: [
      ['An insecure childhood', 'The daughter of Henry VIII and Anne Boleyn, Elizabeth was born at Greenwich in 1533. After her mother’s execution in 1536 she was declared illegitimate, although an Act of 1544 restored her to the succession. She received an exceptional humanist education in classical and modern languages. During the reign of her sister Mary I, suspected of supporting Wyatt’s rebellion, she spent several weeks imprisoned in the Tower of London in 1554.'],
      ['The religious settlement', 'Queen from November 1558, Elizabeth and Parliament restored royal supremacy over the Church in 1559 and a Book of Common Prayer. The Church of England was Protestant in doctrine while retaining bishops and elements of traditional worship. Pope Pius V excommunicated her in 1570. Her principal adviser for forty years was William Cecil, Lord Burghley.'],
      ['Mary Stuart and Spain', 'Her cousin Mary, Queen of Scots, a Catholic with a claim to the English throne, fled to England in 1568 and was detained for almost twenty years. Following several conspiracies, she was executed in 1587. Elizabeth supported the rebels in the Low Countries from 1585 and tolerated privateers such as Francis Drake. The defeat of Philip II’s Spanish Armada in 1588 strengthened her public image, although the war with Spain continued until 1604.'],
      ['The Virgin Queen and her succession', 'Elizabeth never married and made that decision part of her public image. Her reign saw the flourishing of the theatre of Marlowe and Shakespeare, the first attempts at colonisation in North America and the foundation of the East India Company in 1600. She died at Richmond in 1603 and was succeeded by James VI of Scotland, the son of Mary, Queen of Scots.'],
    ],
  },
  LUIS9: {
    name: 'Louis IX of France', role: 'King of France', nickname: 'Saint Louis',
    summary: 'King of France who became a model of medieval Christian kingship and was later canonised. He strengthened royal justice and led two crusades, dying during the expedition to Tunis.',
  },
  SULEIMAN1OSM: {
    name: 'Suleiman I', role: 'Ottoman sultan', nickname: 'the Magnificent', aliases: ['Suleiman the Magnificent', 'Suleiman the Lawgiver', 'Kanuni', 'Süleyman I'],
    summary: 'Ottoman sultan during the empire’s great territorial and cultural expansion in the sixteenth century. His campaigns in Hungary and the Mediterranean made him the Habsburgs’ principal eastern rival.',
    sections: [
      ['A remarkable beginning', 'The only surviving son of Selim I, Suleiman was born at Trebizond in 1494 and governed provinces before succeeding his father in 1520. In the first years of his reign he captured Belgrade in 1521, a gateway to the Danube, and expelled the Knights Hospitaller from Rhodes in 1522.'],
      ['Hungary and Vienna', 'In 1526 he defeated Louis II of Hungary and Bohemia at Mohács; Louis died during the retreat. The kingdom was disputed between Ferdinand of Habsburg and John Zápolya, a vassal of the sultan. In 1529 Suleiman besieged Vienna without taking it. In 1541 he incorporated Buda and central Hungary as an Ottoman province, while Transylvania became a tributary principality.'],
      ['An empire across three continents', 'His campaigns against the Safavids brought him Baghdad in 1534 and Mesopotamia. With Admiral Hayreddin Barbarossa, his fleet dominated much of the Mediterranean and won at Preveza in 1538, although it failed at Malta in 1565. His alliance with Francis I of France made him an actor in the European balance of power against Charles V.'],
      ['Kanuni, the Lawgiver', 'In Ottoman tradition Suleiman is called Kanuni for compiling and harmonising the sultan’s laws. His wife Hürrem played an unprecedented political role, and struggles among his sons led to the executions of Mustafa in 1553 and Bayezid in 1561. He supported the work of the architect Sinan, including the Süleymaniye Mosque in Istanbul. He died in 1566 during the siege of Szigetvár in Hungary.'],
    ],
  },
};
