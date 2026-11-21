// 6.0.16 · Territory names as GND (German) and BnF (French) authority records write them.
// Used only together with an exact span of years; see build616.mjs.
import {KW} from './government-keywords.mjs';
const MORE = {
  'Estados Pontificios': /Papst|Pape\b|pape\b/, 'Croacia': /Kroat|Croatie/, 'Alemania': /deutsch(?:er|en)? König|röm|Germanie|Roi des Romains/i,
  'Hungría': /Ungar|Hongrie/, 'Imericia': /Imeret|Iméréth/, 'Navarra': /Navarr/, 'Suecia': /Schwed|Suède/, 'Chipre': /Zypern|Chypre/,
  'Bohemia': /Böhm|Bohême/, 'Baviera': /Bay(?:er|ern)|Bayr|Bavière/, 'Jerusalén': /Jerusalem|Jérusalem/, 'Rusia': /Russ|Moskau|Moscou|Zar|Tsar/i,
  'Armenia cilicia': /Armen|Arménie|Kilikien|Cilicie/, 'Escocia': /Schott|Écosse|Ecosse/, 'Saboya': /Savoy|Savoie|Savoyen/, 'Kartli': /Kartl|Karthli|Georgien|Géorgie/,
  'Francia': /Frank|Franz|französ|France\b/, 'Noruega': /Norw|Norvège/, 'Georgia': /Georgien|Géorgie/, 'Polonia': /Pol(?:en|n)|Pologne/, 'Bretaña': /Bretagne/,
  'Inglaterra': /Engl|Angleterre/, 'Kajetia': /Kachet|Kakh|Georgien|Géorgie/, 'Condado de Barcelona': /Barcelon/, 'Nápoles': /Neapel|Naples/, 'Mallorca': /Mallorca|Majorque/,
  'Austria': /Österreich|Autriche/, 'Valencia': /Valenc/, 'Lituania': /Litau|Lituanie/, 'Aragón': /Arag/, 'Castilla': /Kastil|Castille/, 'León': /León|Leon\b/,
  'Monferrato': /Montferrat|Monferrat/, 'Sajonia': /Sachsen|Saxe/, 'Serbia': /Serb|Serbie/, 'Henao': /Hennegau|Hainaut/, 'Piamonte': /Piemont|Piémont/,
  'Transilvania': /Siebenbürg|Transylvanie/, 'Zelanda': /Seeland|Zélande/, 'Trinacria': /Sizil|Sicile|Trinacri/, 'Bearne': /Béarn|Bearn/, 'Dinamarca': /Dän|Danemark/,
  'Brandeburgo': /Brandenb/, 'Holanda': /Holland|Hollande/, 'Portugal': /Portug/, 'Valaquia': /Walach|Valachie/, 'Brabante': /Brabant/, 'Milán': /Mailand|Milan/,
  'Bulgaria': /Bulgar/, 'Württemberg': /Württemb|Wurtemberg/, 'Güeldres': /Geldern|Gueldre/, 'Sacro Imperio': /Kaiser|Empereur|röm/i, 'Cerdeña': /Sardin|Sardaigne/,
  'Moldavia': /Moldau|Moldavie/, 'Irlanda': /Irland|Irlande/, 'Mecklemburgo': /Mecklenb/, 'Flandes': /Flandern|Flandre/, 'Foix': /Foix/, 'Nassau': /Nassau/,
  'Urbino': /Urbino/, 'Prusia': /Preuß|Preuss|Prusse/, 'Imperio otomano': /Osman|Sultan|Ottoman/i, 'Antioquía': /Antioch/, 'Pomerania': /Pommern|Poméranie/,
  'Saluzzo': /Saluzz|Saluces/, 'Bizancio': /Byzan|Ostrom/, 'Limburgo': /Limburg|Limbourg/, 'Vendôme': /Vendôme/, 'Baden': /Baden|Bade\b/, 'Trebisonda': /Trapezunt|Trébizonde/,
  'Artois': /Artois/, 'Mantua': /Mantua|Mantoue/, 'Toscana': /Toskana|Toscane/, 'Anjou': /Anjou/, 'Florencia': /Florenz|Florence/, 'Condado de Borgoña': /Burgund|Bourgogne/,
  'Borbón': /Bourbon/, 'Parma': /Parma|Parme/, 'Módena': /Modena|Modène/, 'Lorena': /Lothring|Lorraine/, 'Turingia': /Thüring|Thuringe/, 'Meißen': /Meißen|Meissen|Misnie/,
  'Holstein': /Holstein/, 'Trípoli': /Tripol/, 'Luxemburgo': /Luxemb/, 'Sicilia': /Sizil|Sicile/, 'Imperio Latino': /Lateinisch|latin de Constantinople|Konstantinopel/,
  'Borgoña': /Burgund|Bourgogne/, 'Champaña': /Champagne/, 'Nevers': /Nevers/, 'Orleans': /Orléans|Orleans/, 'Hesse-Kassel': /Hessen-Kassel|Hesse-Cassel/,
  'Rethel': /Rethel/, 'Tarento': /Tarent/, 'Évreux': /Évreux|Evreux/, 'Acaya': /Achaia|Achaïe|Morea|Morée/, 'Provenza': /Provence/, 'Maine': /Maine/, 'Albret': /Albret/,
  'Hannover': /Hannover|Hanovre/, 'Brunswick': /Braunschw|Brunswick/, 'Alençon': /Alençon/, 'Armagnac': /Armagnac/, 'Normandía': /Normand/, 'Aquitania': /Aquitain/,
  'Palatinado': /Pfalz|Palatin/, 'Bosnia': /Bosni/, 'Hesse-Darmstadt': /Hessen-Darmstadt|Hesse-Darmstadt/, 'Ferrara': /Ferrara|Ferrare/, 'Angulema': /Angoulême/,
  'Soissons': /Soissons/, 'Suabia': /Schwaben|Souabe/, 'Moravia': /Mähren|Moravie/, 'Carintia': /Kärnten|Carinthie/, 'Tirol': /Tirol|Tyrol/, 'Dreux': /Dreux/,
  'Penthièvre': /Penthièvre/, 'Cléveris': /Kleve|Clèves/, 'Valois': /Valois/, 'Clermont': /Clermont/, 'Auxerre': /Auxerre/, 'Ponthieu': /Ponthieu/, 'Berry': /Berry/,
  'Urgel': /Urgel/, 'Saint-Pol': /Saint-Pol/, 'Curlandia': /Kurland|Courlande/, 'Ansbach': /Ansbach/, 'Oldemburgo': /Oldenb/, 'Montbéliard': /Montbéliard|Mömpelgard/,
  'Jülich': /Jülich|Juliers/, 'Países Bajos': /Niederland|Pays-Bas/, 'Hesse': /Hessen|Hesse\b/, 'Granada': /Granada|Grenade/, 'Kulmbach': /Kulmbach/, 'Durazzo': /Durazzo|Duras/,
};
export const TERRITORY_KEYWORDS = {...KW, ...MORE};
// Title words: a record clause must name the same kind of office.
export const TITLE_WORDS = {
  Rey: /König\b|Roi\b|roi\b|King/, Reina: /Königin|Reine|reine/, Duque: /Herzog\b|Duc\b|duc\b/, Duquesa: /Herzogin|Duchesse|duchesse/, Conde: /Graf\b|Comte|comte/,
  Condesa: /Gräfin|Comtesse|comtesse/, Papa: /Papst|Pape|pape/, Príncipe: /Fürst\b|Prinz|Prince|prince/, Princesa: /Fürstin|Princesse|princesse/, Emperador: /Kaiser\b|Empereur|empereur/,
  Emperatriz: /Kaiserin|Impératrice|impératrice/, 'Rey de Romanos': /röm|Roi des Romains|roi des Romains/i, Elector: /Kurfürst|Électeur|électeur/, Señor: /Herr\b|Seigneur|seigneur/,
  Voivoda: /Woiwode|Wojewode|Fürst|Voïvode|voïvode|Prince|prince|Hospodar/, Marqués: /Markgraf|Marquis|marquis/, Margrave: /Markgraf|Margrave|margrave/, Zar: /Zar\b|Tsar|tsar/,
  Landgrave: /Landgraf|Landgrave|landgrave/, Vizconde: /Vicomte|vicomte|Vizegraf/, Sultán: /Sultan|sultan/, 'Gran duque': /Großfürst|Großherzog|Grand-duc|grand-duc/,
  'Gran príncipe': /Großfürst|Grand-prince|grand-prince|Grand prince/, Déspota: /Despot|despote/, Archiduque: /Erzherzog|Archiduc|archiduc/, Emir: /Emir|Émir|émir/,
};
