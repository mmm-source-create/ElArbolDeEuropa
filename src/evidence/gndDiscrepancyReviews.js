// V5.26 · Revisión de las fechas en las que el Atlas y la ficha GND discrepaban
// (docs/versiones/V5.25-discrepancias.md). Cada fecha se contrasta con una obra de referencia
// concreta; la ficha GND queda como fuente secundaria y su año, si difiere, en «alternatives».
export const GND_DISCREPANCY_REVIEWS = Object.freeze({
  "person:ADOLFN:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Nassau",
        "url": "https://fmg.ac/Projects/MedLands/NASSAU.htm",
        "locator": "Entrada «ADOLF von Nassau ([1255]-killed in battle near Göllheim 2 Jul 1298)»"
      },
      {
        "title": "Encyclopaedia Britannica · Adolf (German king)",
        "url": "https://www.britannica.com/biography/Adolf-German-king",
        "locator": "Encabezado: «born c. 1250»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118637606",
        "locator": "Datos vitales: fecha de nacimiento (1250)"
      }
    ],
    "note": "MedLands estima 1255 y Britannica da hacia 1250; ninguna fuente fija el año con documento.",
    "alternatives": [
      "c. 1250 (Britannica; GND 1250)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ALB3AUST:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Biographie · Albrecht III., Herzog von Österreich",
        "url": "https://www.deutsche-biographie.de/pnd118644343.html",
        "locator": "NDB 1 (1953), p. 168: «* Ende 1349 oder Anfang 1350»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Austria",
        "url": "https://fmg.ac/Projects/MedLands/AUSTRIA.htm",
        "locator": "Entrada «ALBRECHT (Vienna 9 Sep 1348-Laxenburg 29 Aug 1395)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118644343",
        "locator": "Datos vitales: fecha de nacimiento (1350)"
      }
    ],
    "note": "La NDB duda entre finales de 1349 y comienzos de 1350; MedLands da 1348.",
    "alternatives": [
      "comienzos de 1350 (NDB; GND 1350)",
      "9 sep. 1348 (MedLands)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ALBERICOBARB:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Alberico da Barbiano",
        "url": "https://www.treccani.it/enciclopedia/alberico-da-barbiano_%28Dizionario-Biografico%29/",
        "locator": "Vol. 1 (1960). «Nacque a Barbiano attorno al 1348»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/141916893",
        "locator": "Datos vitales: fecha de nacimiento (1348)"
      }
    ],
    "note": "El DBI sitúa el nacimiento hacia 1348; se corrige el año y se conserva su carácter aproximado.",
    "alternatives": [
      "1344 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1348",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ALBERT7MECK:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Deutsche Biographie · Albrecht VII., Herzog von Mecklenburg",
        "url": "https://www.deutsche-biographie.de/pnd120438879.html",
        "locator": "NDB 1 (1953): «* 25.7.1486, † 7.1.1547»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/120438879",
        "locator": "Datos vitales: fecha de nacimiento (1488-07-25)"
      }
    ],
    "note": "La NDB fecha el nacimiento el 25 de julio de 1486.",
    "alternatives": [
      "25 jul. 1488 (GND)"
    ],
    "exactDate": "1486-07-25",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ALESSFOR:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Alessandro Sforza",
        "url": "https://www.treccani.it/enciclopedia/alessandro-sforza_%28Dizionario-Biografico%29/",
        "locator": "Vol. 92 (2018). «morì per una crisi respiratoria il 3 aprile 1473»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119039346",
        "locator": "Datos vitales: fecha de fallecimiento (1478)"
      }
    ],
    "note": "El DBI fecha la muerte el 3 de abril de 1473.",
    "alternatives": [
      "1478 (GND)"
    ],
    "exactDate": "1473-04-03",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ALEXNEVSKY:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Saint Alexander Nevsky",
        "url": "https://www.britannica.com/biography/Saint-Alexander-Nevsky",
        "locator": "Encabezado: «born c. 1220, Vladimir»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119392577",
        "locator": "Datos vitales: fecha de nacimiento (1200)"
      }
    ],
    "note": "Britannica da hacia 1220; se corrige el año y se marca como aproximado. La ficha GND (1200) no es plausible.",
    "alternatives": [
      "1221 (valor anterior del Atlas, sin fuente específica localizada)",
      "1200 (GND)"
    ],
    "timeLabel": "c. 1220",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANABOLENA:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/557",
        "locator": "Encabezado del artículo: «Anne [Anne Boleyn] (c. 1500–1536)»"
      },
      {
        "title": "Encyclopaedia Britannica · Anne Boleyn",
        "url": "https://www.britannica.com/biography/Anne-Boleyn",
        "locator": "Encabezado: «born 1507?»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118649442",
        "locator": "Datos vitales: fecha de nacimiento (1507)"
      }
    ],
    "note": "La fecha de nacimiento es una discusión historiográfica: el ODNB da hacia 1500 y Britannica 1507 con interrogante.",
    "alternatives": [
      "c. 1500 (ODNB)",
      "1507 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANASFOR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Bona di Savoia",
        "url": "https://www.treccani.it/enciclopedia/bona-di-savoia-duchessa-di-milano_%28Dizionario-Biografico%29/",
        "locator": "Vol. 11 (1969). Hijos de Bona y Galeazzo Maria: «Anna (1473)»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «ANNA Sforza (1473-30 Nov 1497)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/132328283",
        "locator": "Datos vitales: fecha de nacimiento (1473)"
      }
    ],
    "note": "El DBI (artículo de su madre) y MedLands dan 1473; se corrige el año.",
    "alternatives": [
      "1476 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANASTASIAROM:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1329656873",
        "locator": "Datos vitales: fecha de nacimiento (1523)"
      }
    ],
    "note": "No se ha localizado una fuente específica que fije el año; el Atlas y la ficha GND discrepan y el dato queda discutido.",
    "alternatives": [
      "1523 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANDRES2HUN:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hungary",
        "url": "https://fmg.ac/Projects/MedLands/HUNGARY.htm",
        "locator": "Entrada «ANDRÁS (1176-21 Sep 1235)»"
      },
      {
        "title": "Encyclopaedia Britannica · Andrew II (king of Hungary)",
        "url": "https://www.britannica.com/biography/Andrew-II",
        "locator": "Encabezado: «born 1175»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118649175",
        "locator": "Datos vitales: fecha de nacimiento (1176)"
      }
    ],
    "note": "MedLands y la ficha GND dan 1176; Britannica, 1175. Se corrige a 1176 y se registra la alternativa.",
    "alternatives": [
      "1175 (Britannica)",
      "1177 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANDRO2:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Byzantium 12611453",
        "url": "https://fmg.ac/Projects/MedLands/BYZANTIUM%2012611453.htm",
        "locator": "Entrada «ANDRONIKOS Palaiologos (25 Mar 1259-12/13 Feb 1332)»"
      },
      {
        "title": "Encyclopaedia Britannica · Andronicus II Palaeologus",
        "url": "https://www.britannica.com/biography/Andronicus-II-Palaeologus",
        "locator": "Encabezado: «born c. 1260»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119132877",
        "locator": "Datos vitales: fecha de nacimiento (1260)"
      }
    ],
    "note": "MedLands fecha el nacimiento el 25 de marzo de 1259; Britannica da una aproximación compatible.",
    "alternatives": [
      "c. 1260 (Britannica; GND 1260)"
    ],
    "exactDate": "1259-03-25",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANDRO3PALA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Andronicus III Palaeologus",
        "url": "https://www.britannica.com/biography/Andronicus-III-Palaeologus",
        "locator": "Encabezado: «born March 25, 1297, Constantinople»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Byzantium 12611453",
        "url": "https://fmg.ac/Projects/MedLands/BYZANTIUM%2012611453.htm",
        "locator": "Entrada «ANDRONIKOS Palaiologos (Constantinople 25 Mar 1297-Constantinople 15 Jun 1341)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118645218",
        "locator": "Datos vitales: fecha de nacimiento (1298)"
      }
    ],
    "note": "Britannica y MedLands coinciden en el 25 de marzo de 1297.",
    "alternatives": [
      "1298 (GND)"
    ],
    "exactDate": "1297-03-25",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ANTHONYULRICHBRUN:death": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Biographie · Anton Ulrich, Prinz von Braunschweig-Wolfenbüttel",
        "url": "https://www.deutsche-biographie.de/pnd121094421.html",
        "locator": "Lebensdaten: «1714 – 1775 oder 1774»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/121094421",
        "locator": "Datos vitales: fecha de fallecimiento (1776-05-15)"
      }
    ],
    "note": "Murió en el destierro de Jolmogory; las fuentes dudan entre 1774 y 1775 y la ficha GND da 1776.",
    "alternatives": [
      "1775 (Deutsche Biographie)",
      "15 may. 1776 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BALDWIN3JER:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Baldwin III (king of Jerusalem)",
        "url": "https://www.britannica.com/biography/Baldwin-III-king-of-Jerusalem",
        "locator": "Encabezado: «born 1129»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/142659800",
        "locator": "Datos vitales: fecha de nacimiento (1129)"
      }
    ],
    "note": "Britannica y la ficha GND dan 1129; se corrige el año.",
    "alternatives": [
      "1130 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BAYEZID2OSM:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Bayezid II",
        "url": "https://www.britannica.com/biography/Bayezid-II",
        "locator": "Encabezado: «born December 1447/January 1448?»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118506056",
        "locator": "Datos vitales: fecha de nacimiento (1448)"
      }
    ],
    "note": "Britannica deja el nacimiento entre diciembre de 1447 y enero de 1448.",
    "alternatives": [
      "enero de 1448 (Britannica; GND 1448)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BEATCONST:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Costanza di Svevia, regina d'Aragona e di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/costanza-di-svevia-regina-d-aragona-e-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 30 (1984). «Nacque tra il 1249 e il 1250»"
      },
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Constanza de Sicilia (I)",
        "url": "https://historia-hispanica.rah.es/biografias/12362-constanza-de-sicilia-i",
        "locator": "Cabecera: «1248 – 1302»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119334364",
        "locator": "Datos vitales: fecha de nacimiento (1247)"
      }
    ],
    "note": "El DBI la hace nacer entre 1249 y 1250; el DBE da 1248 y la ficha GND 1247.",
    "alternatives": [
      "1250 (DBI)",
      "1248 (DBE)",
      "1247 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BEATPROV:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Beatrice di Provenza, regina di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/beatrice-di-provenza-regina-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 7 (1970). «nacque, ultima di quattro figlie, nel 1233»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Provence",
        "url": "https://fmg.ac/Projects/MedLands/PROVENCE.htm",
        "locator": "Entrada «BEATRICE de Provence ([1232/34]-Naples 23 Sep 1267)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/133550575",
        "locator": "Datos vitales: fecha de nacimiento (1233)"
      }
    ],
    "note": "El DBI y la ficha GND dan 1233; se corrige el año.",
    "alternatives": [
      "1229 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BEATSCALA:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Beatrice (Regina) Della Scala",
        "url": "https://www.treccani.it/enciclopedia/beatrice-della-scala_%28Dizionario-Biografico%29/",
        "locator": "Vol. 37 (1989). «sono però ignoti sia il luogo sia l'anno della sua nascita»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/142755338",
        "locator": "Datos vitales: fecha de nacimiento (1333)"
      }
    ],
    "note": "El DBI declara desconocidos el lugar y el año de nacimiento; ni el año del Atlas ni el de la ficha GND están documentados.",
    "alternatives": [
      "1333 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BEATSIL:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Silesia",
        "url": "https://fmg.ac/Projects/MedLands/SILESIA.htm",
        "locator": "Entrada «BEATRIX ([1290]-Munich 24 Aug 1322)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136803660",
        "locator": "Datos vitales: fecha de nacimiento (1292)"
      }
    ],
    "note": "MedLands estima 1290; se conserva como fecha aproximada.",
    "alternatives": [
      "después de 1292 (GND)"
    ],
    "timeLabel": "c. 1290",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BLANCA1NAV:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Blanca I de Navarra",
        "url": "https://historia-hispanica.rah.es/biografias/6953-blanca-i-de-navarra",
        "locator": "Cabecera: «VIII.1385 – V.1441»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/131860992",
        "locator": "Datos vitales: fecha de nacimiento (1385)"
      }
    ],
    "note": "El DBE y la ficha GND dan 1385; se corrige el año.",
    "alternatives": [
      "1387 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BLANCABORG1296:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Matrimonio de Carlos IV: «BLANCHE de Bourgogne [...] (1296-Abbaye de Maubuisson Apr 1326)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1218738847",
        "locator": "Datos vitales: fecha de nacimiento (1295)"
      }
    ],
    "note": "MedLands da 1296.",
    "alternatives": [
      "1295 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BLANMARVISC:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Bianca Maria Visconti, duchessa di Milano",
        "url": "https://www.treccani.it/enciclopedia/bianca-maria-visconti-duchessa-di-milano_%28Dizionario-Biografico%29/",
        "locator": "Vol. 10 (1968). «nacque nel castello di Settimo Pavese, secondo il Simonetta, il 31 marzo 1425»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «BIANCA MARIA Visconti (Castello di Settimo 31 Mar 1425-Cremona 23 Oct 1468)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118805460",
        "locator": "Datos vitales: fecha de nacimiento (1424)"
      }
    ],
    "note": "El DBI y MedLands fechan el nacimiento el 31 de marzo de 1425.",
    "alternatives": [
      "1424 (GND)"
    ],
    "exactDate": "1425-03-31",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BLANVAL:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136817475",
        "locator": "Datos vitales: fecha de nacimiento (1317)"
      }
    ],
    "note": "No se ha localizado una fuente específica que decida entre 1316 y 1317; el dato queda discutido.",
    "alternatives": [
      "1317 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:BOGDAN1MOLD:death": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1109767595",
        "locator": "Datos vitales: fecha de fallecimiento (1365)"
      }
    ],
    "note": "No se ha localizado una fuente específica que decida entre 1365 y 1367; el dato queda discutido.",
    "alternatives": [
      "1365 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CATHAB:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Austria",
        "url": "https://fmg.ac/Projects/MedLands/AUSTRIA.htm",
        "locator": "Entrada «KATHARINA (1256-Landshut 4 Apr 1282)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/138780021",
        "locator": "Datos vitales: fecha de fallecimiento (1282)"
      }
    ],
    "note": "MedLands y la ficha GND dan 1282; se corrige el año.",
    "alternatives": [
      "1283 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1282-04-04",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CHRISTIANALBERTHG:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Dansk Biografisk Leksikon · Christian Albrecht",
        "url": "https://biografiskleksikon.lex.dk/Christian_Albrecht",
        "locator": "Cabecera: «3.2.1641-27.12.1694, hertug af Slesvig-Holsten-Gottorp»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/102125880",
        "locator": "Datos vitales: fecha de fallecimiento (1694-12-27)"
      }
    ],
    "note": "El DBL fecha la muerte el 27 de diciembre de 1694 en el calendario juliano, entonces vigente en Gottorp, que corresponde al 6 de enero de 1695 gregoriano; el Atlas usa el año gregoriano.",
    "alternatives": [
      "27 dic. 1694 en calendario juliano (DBL; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CONSTANCEANT:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Antioch",
        "url": "https://fmg.ac/Projects/MedLands/ANTIOCH.htm",
        "locator": "Entrada «CONSTANCE of Antioch ([1127]-[1163/67])»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1332645100",
        "locator": "Datos vitales: fecha de nacimiento (1127)"
      }
    ],
    "note": "MedLands estima 1127, como la ficha GND; se corrige el año como aproximado.",
    "alternatives": [
      "1128 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1127",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CONSTANCEAUVASA:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Kunsthistorisches Museum Wien · Erzherzogin Konstanze, Königin von Polen",
        "url": "https://www.khm.at/en/artworks/erzherzogin-konstanze-1588-1631-koenigin-von-polen-mit-einer-meerkatze-2377",
        "locator": "Ficha del retrato: «Erzherzogin Konstanze (1588-1631), Königin von Polen»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/122911466",
        "locator": "Datos vitales: fecha de fallecimiento (1635)"
      }
    ],
    "note": "La ficha del museo da 1631 como año de muerte.",
    "alternatives": [
      "1635 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CONSTANMAN:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Constanza Manuel",
        "url": "https://historia-hispanica.rah.es/biografias/27042-constanza-manuel",
        "locator": "Cabecera: nacimiento «c. 1313»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1081796332",
        "locator": "Datos vitales: fecha de nacimiento (1320)"
      }
    ],
    "note": "El DBE da hacia 1313; se corrige el año y se conserva como aproximado.",
    "alternatives": [
      "1316 (valor anterior del Atlas, sin fuente específica localizada)",
      "1320 (GND)"
    ],
    "timeLabel": "c. 1313",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CONSTANMAN:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Constanza Manuel",
        "url": "https://historia-hispanica.rah.es/biografias/27042-constanza-manuel",
        "locator": "Cabecera: muerte el «13.XI.1345», en Santarém"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1081796332",
        "locator": "Datos vitales: fecha de fallecimiento (1349)"
      }
    ],
    "note": "El DBE fecha la muerte el 13 de noviembre de 1345.",
    "alternatives": [
      "1349 (GND)"
    ],
    "exactDate": "1345-11-13",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CRISTINALORENA:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Cristina di Lorena, granduchessa di Toscana",
        "url": "https://www.treccani.it/enciclopedia/cristina-di-lorena-granduchessa-di-toscana_%28Dizionario-Biografico%29/",
        "locator": "Vol. 31 (1985). «il 20 dic. 1636, morì nella villa medicea di Castello»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119429411",
        "locator": "Datos vitales: fecha de fallecimiento (1636)"
      }
    ],
    "note": "El DBI fecha la muerte el 20 de diciembre de 1636; se corrige el año.",
    "alternatives": [
      "1637 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1636-12-20",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CRISTOBALBAVSUE:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Dansk Biografisk Leksikon · Christoffer 3. af Bayern",
        "url": "https://biografiskleksikon.lex.dk/Christoffer_3._af_Bayern",
        "locator": "Cabecera: «26.2.(?)1416-5 el. 6.1.1448, konge»"
      },
      {
        "title": "Encyclopaedia Britannica · Christopher III (king of Denmark, Norway and Sweden)",
        "url": "https://www.britannica.com/biography/Christopher-III",
        "locator": "Encabezado: «born Feb. 26, 1418»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118871099",
        "locator": "Datos vitales: fecha de nacimiento (1418)"
      }
    ],
    "note": "Ambas obras coinciden en el 26 de febrero, pero el DBL da 1416 y Britannica 1418.",
    "alternatives": [
      "26 feb. 1418 (Britannica; GND 1418)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:CUNS:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Bohemia",
        "url": "https://fmg.ac/Projects/MedLands/BOHEMIA.htm",
        "locator": "Matrimonio de Wenceslao I: «KUNIGUNDE von Staufen [...] ([Feb/Mar] 1202-13 Sep 1248)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/137080867",
        "locator": "Datos vitales: fecha de nacimiento (1202)"
      }
    ],
    "note": "MedLands y la ficha GND dan 1202; se corrige el año.",
    "alternatives": [
      "1200 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ENRIQ4ING:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/12951",
        "locator": "Encabezado del artículo: «Henry IV [known as Henry Bolingbroke] (1367–1413)»"
      },
      {
        "title": "Encyclopaedia Britannica · Henry IV (king of England)",
        "url": "https://www.britannica.com/biography/Henry-IV-king-of-England",
        "locator": "Encabezado: «born April? 1366, Bolingbroke Castle»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118709771",
        "locator": "Datos vitales: fecha de nacimiento (1366)"
      }
    ],
    "note": "El ODNB da 1367 y Britannica 1366 con interrogante.",
    "alternatives": [
      "1366 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ENRIQ5ING:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/12952",
        "locator": "Encabezado del artículo: «Henry V (1386–1422)»"
      },
      {
        "title": "Encyclopaedia Britannica · Henry V (king of England)",
        "url": "https://www.britannica.com/biography/Henry-V-king-of-England",
        "locator": "Encabezado: «born September 16?, 1387, Monmouth»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118548182",
        "locator": "Datos vitales: fecha de nacimiento (1387-09-16)"
      }
    ],
    "note": "El ODNB da 1386 y Britannica 1387 con interrogante.",
    "alternatives": [
      "16 sep. 1387 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ENRIQ7:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Biographie · Heinrich VII., Kaiser",
        "url": "https://www.deutsche-biographie.de/pnd118548301.html",
        "locator": "Lebensdaten: «vermutlich 1274 oder 1275 – 1313»"
      },
      {
        "title": "Encyclopaedia Britannica · Henry VII (Holy Roman emperor)",
        "url": "https://www.britannica.com/biography/Henry-VII-Holy-Roman-emperor",
        "locator": "Encabezado: «born c. 1269/74, Valenciennes»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118548301",
        "locator": "Datos vitales: fecha de nacimiento (1274)"
      }
    ],
    "note": "La Deutsche Biographie duda entre 1274 y 1275; Britannica amplía el margen a 1269–1274.",
    "alternatives": [
      "1274 (GND)",
      "c. 1269/1274 (Britannica)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ESTENSTUREJOVEN:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Sten Sture, the Younger",
        "url": "https://www.britannica.com/biography/Sten-Sture-the-Younger",
        "locator": "Encabezado: «born c. 1492, Sweden»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1158739591",
        "locator": "Datos vitales: fecha de nacimiento (1492)"
      }
    ],
    "note": "Britannica da hacia 1492, como la ficha GND; se corrige el año como aproximado.",
    "alternatives": [
      "1493 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1492",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:EUGENIOMAURICIOSAB:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Savoia-Soissons, Eugenio Maurizio di",
        "url": "https://www.treccani.it/enciclopedia/savoia-soissons-eugenio-maurizio-di_%28Dizionario-Biografico%29/",
        "locator": "Vol. 91 (2018). «Nacque a Chambéry il 2 maggio 1633»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/135915910",
        "locator": "Datos vitales: fecha de nacimiento (1633-05-02)"
      }
    ],
    "note": "El DBI y la ficha GND fechan el nacimiento el 2 de mayo de 1633; se corrige el año.",
    "alternatives": [
      "1635 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1633-05-02",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:FERN1NAP:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Ferrante I",
        "url": "https://historia-hispanica.rah.es/biografias/16625-ferrante-i",
        "locator": "Cabecera: «c. 1423 – 25.I.1494»"
      },
      {
        "title": "Encyclopaedia Britannica · Ferdinand I (king of Naples)",
        "url": "https://www.britannica.com/biography/Ferdinand-I-king-of-Naples",
        "locator": "Encabezado: «born 1423, Valencia»"
      },
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Ferdinando I d'Aragona, re di Napoli",
        "url": "https://www.treccani.it/enciclopedia/ferdinando-i-d-aragona-re-di-napoli_%28Dizionario-Biografico%29/",
        "locator": "Vol. 46 (1996). La fecha «più convincente dal punto di vista cronologico» es «il 2 giugno 1424»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/122377680",
        "locator": "Datos vitales: fecha de nacimiento (1424-06-02)"
      }
    ],
    "note": "El DBE y Britannica dan 1423; el DBI prefiere el 2 de junio de 1424.",
    "alternatives": [
      "2 jun. 1424 (DBI; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:FRANCESCOMELZI:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Francesco Melzi",
        "url": "https://www.treccani.it/enciclopedia/francesco-melzi_%28Dizionario-Biografico%29/",
        "locator": "Vol. 73 (2009). «nacque probabilmente a Milano nel 1491 o nel 1493»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/121378632",
        "locator": "Datos vitales: fecha de nacimiento (1492)"
      }
    ],
    "note": "El DBI duda entre 1491 y 1493.",
    "alternatives": [
      "1491 (DBI)",
      "1492 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:FRANCISCOANJOU:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Francisco de Alençon",
        "url": "https://historia-hispanica.rah.es/biografias/926-francisco-de-alencon",
        "locator": "Cabecera: «18.III.1554 – 10.VI.1584»"
      },
      {
        "title": "Encyclopaedia Britannica · François, duc d’Anjou",
        "url": "https://www.britannica.com/biography/Francois-duc-dAnjou",
        "locator": "Encabezado: «born March 18, 1554, Saint-Germain-en-Laye»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118692887",
        "locator": "Datos vitales: fecha de nacimiento (1554)"
      }
    ],
    "note": "El DBE y Britannica fechan el nacimiento el 18 de marzo de 1554; se corrige el año.",
    "alternatives": [
      "1555 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1554-03-18",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:FRANCOIS2BRET:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Francis II (duke of Brittany)",
        "url": "https://www.britannica.com/biography/Francis-II-duke-of-Brittany",
        "locator": "Encabezado: «born June 23, 1435»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/133171884",
        "locator": "Datos vitales: fecha de nacimiento (1435-06-23)"
      }
    ],
    "note": "Britannica y la ficha GND fechan el nacimiento el 23 de junio de 1435; se corrige el año.",
    "alternatives": [
      "1433 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1435-06-23",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:FRED5NUREMBERG:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Deutsche Biographie · Friedrich V., Burggraf von Nürnberg",
        "url": "https://www.deutsche-biographie.de/pnd129880019.html",
        "locator": "NDB 5 (1961): «* vor 1332»; ADB 7 (1878): «geb. ca. 1332»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129880019",
        "locator": "Datos vitales: fecha de nacimiento (1332)"
      }
    ],
    "note": "La NDB lo hace nacer antes de 1332 y la ADB hacia 1332; se corrige el año como aproximado.",
    "alternatives": [
      "1333 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1332",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GABRIELLEESTREES:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Gabrielle d’Estrées",
        "url": "https://www.britannica.com/biography/Gabrielle-dEstrees-duchesse-de-Beaufort",
        "locator": "Encabezado: «born 1573»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119150263",
        "locator": "Datos vitales: fecha de nacimiento (1571)"
      }
    ],
    "note": "Britannica da 1573.",
    "alternatives": [
      "1571 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GAL2VISC:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Galeazzo II Visconti",
        "url": "https://www.treccani.it/enciclopedia/galeazzo-visconti_%28Dizionario-Biografico%29/",
        "locator": "Vol. 99 (2020). «nacque in un anno imprecisato successivo al 1323, data di nascita del secondogenito Bernabò»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «GALEAZZO [II] Visconti ([1324/27]-Pavia 6 Aug 1378)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/14397159X",
        "locator": "Datos vitales: fecha de nacimiento (1319)"
      }
    ],
    "note": "El DBI lo hace nacer después de 1323, año de su hermano mayor Bernabò, y MedLands estima 1324–1327; se corrige a 1324 como límite inferior.",
    "alternatives": [
      "1320 (valor anterior del Atlas, sin fuente específica localizada)",
      "1319 (GND)"
    ],
    "timeLabel": "después de 1323",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GERMANAFOIX:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Germana de Foix",
        "url": "https://historia-hispanica.rah.es/biografias/19028-germana-de-foix",
        "locator": "Cabecera: «c. 1488 – 15.X.1536»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/142342971",
        "locator": "Datos vitales: fecha de fallecimiento (1538)"
      }
    ],
    "note": "El DBE fecha la muerte el 15 de octubre de 1536.",
    "alternatives": [
      "1538 (GND)"
    ],
    "exactDate": "1536-10-15",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GIANANDREADORIA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Doria, Giovanni Andrea",
        "url": "https://www.treccani.it/enciclopedia/giovanni-andrea-doria_%28Dizionario-Biografico%29/",
        "locator": "Vol. 41 (1992). «Nacque a Genova agli inizi del 1540»"
      },
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Juan Andrea Doria",
        "url": "https://historia-hispanica.rah.es/biografias/14028-juan-andrea-doria",
        "locator": "Cabecera: «1540 – 2.II.1606»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/122665104",
        "locator": "Datos vitales: fecha de nacimiento (1540)"
      }
    ],
    "note": "El DBI, el DBE y la ficha GND dan 1540; se corrige el año.",
    "alternatives": [
      "1539 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GUIDANTMONTE:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Guidantonio di Montefeltro",
        "url": "https://www.treccani.it/enciclopedia/guidantonio-di-montefeltro_%28Dizionario-Biografico%29/",
        "locator": "Vol. 76 (2012). «nacque nel 1378»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129045748",
        "locator": "Datos vitales: fecha de nacimiento (1378)"
      }
    ],
    "note": "El DBI y la ficha GND dan 1378; se corrige el año.",
    "alternatives": [
      "1377 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GUIDOFLA:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Guy (count of Flanders)",
        "url": "https://www.britannica.com/biography/Guy-count-of-Flanders",
        "locator": "Encabezado: «born c. 1225»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136200583",
        "locator": "Datos vitales: fecha de nacimiento (1225)"
      }
    ],
    "note": "Britannica da hacia 1225; se corrige el año y se conserva como aproximado.",
    "alternatives": [
      "1226 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1225",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GUIDOFLA:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Guy (count of Flanders)",
        "url": "https://www.britannica.com/biography/Guy-count-of-Flanders",
        "locator": "Encabezado: «died March 7, 1305, Compiègne»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136200583",
        "locator": "Datos vitales: fecha de fallecimiento (1304)"
      }
    ],
    "note": "Britannica fecha la muerte el 7 de marzo de 1305.",
    "alternatives": [
      "1304 (GND)"
    ],
    "exactDate": "1305-03-07",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:GUILLERMO3HENAO:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hainaut",
        "url": "https://fmg.ac/Projects/MedLands/HAINAUT.htm",
        "locator": "Entrada «GUILLAUME de Hainaut ([1286]-7 Jun 1337)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/137334761",
        "locator": "Datos vitales: fecha de nacimiento (1285)"
      }
    ],
    "note": "MedLands estima 1286; se conserva como fecha aproximada.",
    "alternatives": [
      "1285 (GND)"
    ],
    "timeLabel": "c. 1286",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:HUG4BORG:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Burgundy",
        "url": "https://fmg.ac/Projects/MedLands/BURGUNDY.htm",
        "locator": "Entrada «HUGUES de Bourgogne (9 Mar 1213-[...] 27 or 30 Oct 1272)», con los Annales S. Benigni: «Anno 1212 VII Idus Marcii»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136213057",
        "locator": "Datos vitales: fecha de nacimiento (1212-03-09)"
      }
    ],
    "note": "MedLands convierte a 1213 la noticia de los Annales de San Benigno, que la datan en 1212; la diferencia depende del cómputo del año.",
    "alternatives": [
      "9 mar. 1212 (Annales S. Benigni; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:INESCASTRO:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Inés de Castro",
        "url": "https://historia-hispanica.rah.es/biografias/23964-ines-de-castro",
        "locator": "Cabecera: «17.XII.1320 sup. – 7.I.1355»"
      },
      {
        "title": "Encyclopaedia Britannica · Inês de Castro",
        "url": "https://www.britannica.com/biography/Ines-de-Castro",
        "locator": "Encabezado: «born 1323?»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118667475",
        "locator": "Datos vitales: fecha de nacimiento (1320)"
      }
    ],
    "note": "El DBE propone, como supuesta, la fecha de 1320; Britannica da 1323 con interrogante. Se corrige a 1320.",
    "alternatives": [
      "1323 (Britannica)",
      "1325 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:INGEBORGDIN:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Dansk Biografisk Leksikon · Ingeborg, dronning af Frankrig",
        "url": "https://biografiskleksikon.lex.dk/Ingeborg_-_dronning,_d%C3%B8d_1238",
        "locator": "Cabecera: «ca.1175»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118775502",
        "locator": "Datos vitales: fecha de nacimiento (1175)"
      }
    ],
    "note": "El DBL da hacia 1175, como la ficha GND; se corrige el año como aproximado.",
    "alternatives": [
      "1174 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1175",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:INGEBORGDIN:death": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Dansk Biografisk Leksikon · Ingeborg, dronning af Frankrig",
        "url": "https://biografiskleksikon.lex.dk/Ingeborg_-_dronning,_d%C3%B8d_1238",
        "locator": "Cabecera: «ca.1175-29.(el 30.)7.1237/1238»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118775502",
        "locator": "Datos vitales: fecha de fallecimiento (1236)"
      }
    ],
    "note": "El DBL deja la muerte en 1237 o 1238; la ficha GND da 1236.",
    "alternatives": [
      "1238 (DBL)",
      "1236 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:IRENEANGELINA:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Byzantium 10571204",
        "url": "https://fmg.ac/Projects/MedLands/BYZANTIUM%2010571204.htm",
        "locator": "Entrada «EIRENE Angelina ([1180/84]-Hohenstaufen 27 Aug 1208)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129360449",
        "locator": "Datos vitales: fecha de nacimiento (1178)"
      }
    ],
    "note": "MedLands estima entre 1180 y 1184; el año del Atlas cae en ese intervalo.",
    "alternatives": [
      "1178 (GND)"
    ],
    "timeLabel": "c. 1180–1184",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABARAG:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Isabel de Aragón",
        "url": "https://historia-hispanica.rah.es/biografias/24065-isabel-de-aragon",
        "locator": "Cabecera: «1247 – 28.I.1271»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/113643142X",
        "locator": "Datos vitales: fecha de nacimiento (1243)"
      }
    ],
    "note": "El DBE da 1247; se corrige el año.",
    "alternatives": [
      "1248 (valor anterior del Atlas, sin fuente específica localizada)",
      "1243 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABBOS:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Bosnia",
        "url": "https://fmg.ac/Projects/MedLands/BOSNIA.htm",
        "locator": "Entrada «JELISAVETA ([1340]-in prison Novigrad [...] shortly before 16 Jan 1387)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/132134551",
        "locator": "Datos vitales: fecha de nacimiento (1340)"
      }
    ],
    "note": "MedLands estima 1340, como la ficha GND; se corrige el año como aproximado.",
    "alternatives": [
      "1339 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1340",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABBRAG:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Portugal",
        "url": "https://fmg.ac/Projects/MedLands/PORTUGAL.htm",
        "locator": "Entrada «ISABELLA de Portugal [- Bragança] ([1512]-Vila Viçosa 16 Sep 1576)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1297436660",
        "locator": "Datos vitales: fecha de nacimiento (1511)"
      }
    ],
    "note": "MedLands estima 1512; se corrige el año como aproximado.",
    "alternatives": [
      "1514 (valor anterior del Atlas, sin fuente específica localizada)",
      "1511 (GND)"
    ],
    "timeLabel": "c. 1512",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABELHAB:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Austria",
        "url": "https://fmg.ac/Projects/MedLands/AUSTRIA.htm",
        "locator": "Entrada «ELISABETH Adss of Austria ([1435/36]-Krakow 30 Aug 1505)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/123396980",
        "locator": "Datos vitales: fecha de fallecimiento (1506-08-30)"
      }
    ],
    "note": "MedLands fecha la muerte el 30 de agosto de 1505.",
    "alternatives": [
      "30 ago. 1506 (GND)"
    ],
    "exactDate": "1505-08-30",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABELNUR:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Palatinate",
        "url": "https://fmg.ac/Projects/MedLands/PALATINATE.htm",
        "locator": "Matrimonio de Ruprecht: «ELISABETH von Nürnberg [...] (1358-Heidelberg 26 Jul 1411)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/138737274",
        "locator": "Datos vitales: fecha de fallecimiento (1410)"
      }
    ],
    "note": "MedLands fecha la muerte el 26 de julio de 1411.",
    "alternatives": [
      "1410 (GND)"
    ],
    "exactDate": "1411-07-26",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABELSICILIA:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Entrada «ISABELLA of Sicily ([1310]-Landshut 21 Mar 1349)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1108565948",
        "locator": "Datos vitales: fecha de nacimiento (1309)"
      }
    ],
    "note": "MedLands estima 1310; se conserva como fecha aproximada.",
    "alternatives": [
      "1309 (GND)"
    ],
    "timeLabel": "c. 1310",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABELVALOISESP:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Isabel de Valois",
        "url": "https://historia-hispanica.rah.es/biografias/24126-isabel-de-valois",
        "locator": "Cabecera: «2.IV.1546 – 3.X.1568»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119232820",
        "locator": "Datos vitales: fecha de nacimiento (1546-04-02)"
      }
    ],
    "note": "El DBE y la ficha GND fechan el nacimiento el 2 de abril de 1546; se corrige el año.",
    "alternatives": [
      "1545 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1546-04-02",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABFRAING:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/14484",
        "locator": "Encabezado del artículo: «Isabella [Isabella of France] (1295–1358)»"
      },
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Isabel de Francia",
        "url": "https://historia-hispanica.rah.es/biografias/24096-isabel-de-francia",
        "locator": "Cabecera: «1292 – 1358»"
      },
      {
        "title": "Encyclopaedia Britannica · Isabella of France",
        "url": "https://www.britannica.com/biography/Isabella-of-France",
        "locator": "Encabezado: «born 1292»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118555901",
        "locator": "Datos vitales: fecha de nacimiento (1291)"
      }
    ],
    "note": "El ODNB da 1295; el DBE y Britannica, 1292; MedLands, 1291/1292.",
    "alternatives": [
      "1292 (DBE; Britannica)",
      "1291 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABFRAING:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/14484",
        "locator": "Encabezado del artículo: «Isabella [Isabella of France] (1295–1358)»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «ISABELLE de France (Paris [1291/92]-[...] 21 Nov 1358)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118555901",
        "locator": "Datos vitales: fecha de fallecimiento (1357)"
      }
    ],
    "note": "El ODNB y MedLands sitúan la muerte en 1358.",
    "alternatives": [
      "1357 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ISABPORT:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Isabel de Aragón o de Portugal",
        "url": "https://historia-hispanica.rah.es/biografias/24066-isabel-de-aragon-o-de-portugal",
        "locator": "Cabecera: «4.VI.1271 – 4.VII.1336»"
      },
      {
        "title": "Encyclopaedia Britannica · St. Elizabeth of Portugal",
        "url": "https://www.britannica.com/biography/Saint-Elizabeth-of-Portugal",
        "locator": "Encabezado: «born c. 1271»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118995219",
        "locator": "Datos vitales: fecha de nacimiento (1270-01-04)"
      }
    ],
    "note": "El DBE fecha el nacimiento el 4 de junio de 1271.",
    "alternatives": [
      "4 ene. 1270 (GND)"
    ],
    "exactDate": "1271-06-04",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JORGEMAN:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Jorge Manrique",
        "url": "https://historia-hispanica.rah.es/biografias/27168-jorge-manrique",
        "locator": "Cabecera: «c. 1440 – 24.IV.1479»"
      },
      {
        "title": "Encyclopaedia Britannica · Jorge Manrique",
        "url": "https://www.britannica.com/biography/Jorge-Manrique",
        "locator": "Encabezado: «died March 27, 1479»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/11878160X",
        "locator": "Datos vitales: fecha de fallecimiento (1478)"
      }
    ],
    "note": "El DBE y Britannica sitúan la muerte en 1479, aunque difieren en el día.",
    "alternatives": [
      "1478 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JOSE1PORT:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Joseph (king of Portugal)",
        "url": "https://www.britannica.com/biography/Joseph-king-of-Portugal",
        "locator": "Encabezado: «born June 6, 1714, Lisbon»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/101081715",
        "locator": "Datos vitales: fecha de nacimiento (1713)"
      }
    ],
    "note": "Britannica fecha el nacimiento el 6 de junio de 1714.",
    "alternatives": [
      "1713 (GND)"
    ],
    "exactDate": "1714-06-06",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUAN1BR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Arlima · Archives de littérature du Moyen Âge · Jan I van Brabant",
        "url": "https://arlima.net/il/jan_i_van_brabant.html",
        "locator": "Biographie: «Né à Louvain en 1252 — Mort à Bar-le-Duc en 1294»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119203111",
        "locator": "Datos vitales: fecha de nacimiento (1253)"
      }
    ],
    "note": "Arlima da 1252.",
    "alternatives": [
      "1253 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANA2NAV:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «JEANNE de France (Conflans Sainte Honorine 28 Jan 1312-[...] 6 Oct 1349)»; Bernard Gui la data «V Kal Feb» de 1311 (estilo antiguo)"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1102227951",
        "locator": "Datos vitales: fecha de nacimiento (1311-01-28)"
      }
    ],
    "note": "Nació el 28 de enero de 1312; la fuente medieval la data en 1311 porque el año comenzaba más tarde.",
    "alternatives": [
      "28 ene. 1311 en estilo antiguo (GND; DBE 1311)"
    ],
    "exactDate": "1312-01-28",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANACBORG:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Burgundy",
        "url": "https://fmg.ac/Projects/MedLands/BURGUNDY.htm",
        "locator": "Entrada «JEANNE \"la Boiteuse\" de Bourgogne ([1293/94]-[...] 12 Dec 1349)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1102229083",
        "locator": "Datos vitales: fecha de fallecimiento (1348)"
      }
    ],
    "note": "MedLands fecha la muerte el 12 de diciembre de 1349.",
    "alternatives": [
      "1348 (GND)"
    ],
    "exactDate": "1349-12-12",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANANAP2:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Entrada «GIOVANNA of Naples (Naples 15 Apr 1479-Naples 27 Aug 1518)», según la crónica de Fuscolillo"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1019764848",
        "locator": "Datos vitales: fecha de nacimiento (1478)"
      }
    ],
    "note": "MedLands fecha el nacimiento el 15 de abril de 1479.",
    "alternatives": [
      "1478 (GND)"
    ],
    "exactDate": "1479-04-15",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANASEYMOUR:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/14647",
        "locator": "Encabezado del artículo: «Jane [née Jane Seymour] (1508/9–1537)»"
      },
      {
        "title": "Encyclopaedia Britannica · Jane Seymour",
        "url": "https://www.britannica.com/biography/Jane-Seymour",
        "locator": "Encabezado: «born 1509?»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/121675858",
        "locator": "Datos vitales: fecha de nacimiento (1509)"
      }
    ],
    "note": "El ODNB deja el nacimiento en 1508 o 1509.",
    "alternatives": [
      "1509 (ODNB; Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANDURAZZO:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Conti di Gravina: «JEAN of Sicily, son of CHARLES II [...] (1294-Naples 1336)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/137355947",
        "locator": "Datos vitales: fecha de nacimiento (1315)"
      }
    ],
    "note": "MedLands da 1294; el 1315 de la ficha GND corresponde a su sucesión en el condado de Gravina.",
    "alternatives": [
      "1315 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANDURAZZO:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Conti di Gravina: «JEAN of Sicily, son of CHARLES II [...] (1294-Naples 1336)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/137355947",
        "locator": "Datos vitales: fecha de fallecimiento (1335)"
      }
    ],
    "note": "MedLands sitúa la muerte en 1336.",
    "alternatives": [
      "1335 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANORLEANS:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «JEAN d'Orléans ([May] 1400-Château de Cognac [...] 30 Apr 1467)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/134221699",
        "locator": "Datos vitales: fecha de nacimiento (1404)"
      }
    ],
    "note": "MedLands estima mayo de 1400; se corrige el año y se mantiene como discutido.",
    "alternatives": [
      "1399 (valor anterior del Atlas, sin fuente específica localizada)",
      "1404 (GND)"
    ],
    "timeLabel": "c. mayo de 1400",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JUANSINTIERRA:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · John (king of England)",
        "url": "https://www.britannica.com/biography/John-king-of-England",
        "locator": "Encabezado: «born c. 1166»"
      },
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/14841",
        "locator": "Encabezado del artículo: «John (1167–1216)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118639927",
        "locator": "Datos vitales: fecha de nacimiento (1167-12-24)"
      }
    ],
    "note": "Britannica da hacia 1166 y el ODNB 1167.",
    "alternatives": [
      "24 dic. 1167 (ODNB; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:JURAJ5ZRIN:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Hrvatska enciklopedija · Zrinski, Juraj V.",
        "url": "https://www.enciklopedija.hr/clanak/zrinski-juraj-v",
        "locator": "Cabecera: «Čakovec, 31. I. 1598 – Požun, 18. XII. 1626»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1013657020",
        "locator": "Datos vitales: fecha de nacimiento (1599-01-31)"
      }
    ],
    "note": "La Hrvatska enciklopedija fecha el nacimiento el 31 de enero de 1598.",
    "alternatives": [
      "31 ene. 1599 (GND)"
    ],
    "exactDate": "1598-01-31",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LADI1:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Poland",
        "url": "https://fmg.ac/Projects/MedLands/POLAND.htm",
        "locator": "Entrada «WŁADYSŁAW ([3 Mar 1260/19 Jan 1261]-Wawel Castle 2 Mar 1333)»"
      },
      {
        "title": "Encyclopaedia Britannica · Władysław I (king of Poland)",
        "url": "https://www.britannica.com/biography/Wladyslaw-I",
        "locator": "Encabezado: «born 1260/61»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119135280",
        "locator": "Datos vitales: fecha de nacimiento (1260)"
      }
    ],
    "note": "MedLands y Britannica sitúan el nacimiento entre marzo de 1260 y enero de 1261.",
    "alternatives": [
      "1260 (MedLands; Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LADI2:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Biographie · Władysław II. Jagiełło",
        "url": "https://www.deutsche-biographie.de/pnd119009927.html",
        "locator": "Lebensdaten: «vor 1362 – 1434»"
      },
      {
        "title": "Encyclopaedia Britannica · Władysław II Jagiełło",
        "url": "https://www.britannica.com/biography/Wladyslaw-II-Jagiello",
        "locator": "Encabezado: «born c. 1351»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119009927",
        "locator": "Datos vitales: fecha de nacimiento (1351)"
      }
    ],
    "note": "La fecha de nacimiento de Jogaila es discutida: hacia 1351 en la tradición recogida por Britannica, antes de 1362 en la Deutsche Biographie.",
    "alternatives": [
      "c. 1351 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LADI4:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Ladislas IV (king of Hungary)",
        "url": "https://www.britannica.com/biography/Ladislas-IV",
        "locator": "Encabezado: «born 1262»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hungary",
        "url": "https://fmg.ac/Projects/MedLands/HUNGARY.htm",
        "locator": "Entrada «LÁSZLÓ (1262-murdered Kereczeg [...] 10 Jul 1290)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118908014",
        "locator": "Datos vitales: fecha de nacimiento (1250)"
      }
    ],
    "note": "Britannica y MedLands dan 1262.",
    "alternatives": [
      "1250 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LADISLAO3HUN:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hungary",
        "url": "https://fmg.ac/Projects/MedLands/HUNGARY.htm",
        "locator": "Entrada «LÁSZLÓ (1199-7 May 1205)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1332363466",
        "locator": "Datos vitales: fecha de nacimiento (1201)"
      }
    ],
    "note": "MedLands da 1199; se corrige el año y se registran las alternativas.",
    "alternatives": [
      "1200 (valor anterior del Atlas, sin fuente específica localizada)",
      "1201 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LADISLAONAP:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Ladislao d'Angiò Durazzo, re di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/ladislao-d-angio-durazzo-re-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 63 (2004). «nacque il 15 febbr. 1377 a Napoli»"
      },
      {
        "title": "Encyclopaedia Britannica · Ladislas (king of Naples)",
        "url": "https://www.britannica.com/biography/Ladislas",
        "locator": "Encabezado: «born Feb. 11, 1377, Naples»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1124810234",
        "locator": "Datos vitales: fecha de nacimiento (1376-07)"
      }
    ],
    "note": "El DBI y Britannica dan 1377, aunque difieren en el día.",
    "alternatives": [
      "julio de 1376 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LEONORCASTING:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/8619",
        "locator": "Encabezado del artículo: «Eleanor [Eleanor of Castile] (1241–1290)»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Castile",
        "url": "https://fmg.ac/Projects/MedLands/CASTILE.htm",
        "locator": "Entrada «LEONOR de Castilla y León (1240-Herdeby [...] 29 Nov 1290)»"
      },
      {
        "title": "Encyclopaedia Britannica · Eleanor of Castile",
        "url": "https://www.britannica.com/biography/Eleanor-of-Castile",
        "locator": "Encabezado: «born 1246»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119281694",
        "locator": "Datos vitales: fecha de nacimiento (1244)"
      }
    ],
    "note": "El ODNB da 1241; MedLands, 1240; Britannica, 1246.",
    "alternatives": [
      "1240 (MedLands)",
      "1246 (Britannica)",
      "1244 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LEONORINGCAST:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/111296",
        "locator": "Encabezado del artículo: «Eleanor [Leonor, Alienor] of England (1161–1214)»"
      },
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Leonor Plantagenet",
        "url": "https://historia-hispanica.rah.es/biografias/25671-leonor-plantagenet",
        "locator": "Cabecera: «13.X.1162 – 31.X.1214»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/136924069",
        "locator": "Datos vitales: fecha de nacimiento (1162)"
      }
    ],
    "note": "El ODNB da 1161; el DBE, el 13 de octubre de 1162.",
    "alternatives": [
      "13 oct. 1162 (DBE; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LEONORPOR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Portugal",
        "url": "https://fmg.ac/Projects/MedLands/PORTUGAL.htm",
        "locator": "Entrada «LEONOR de Portugal (Torres Novas Vedras 18 Sep 1434-Wiener Neustadt 3 Sep 1467)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119367459",
        "locator": "Datos vitales: fecha de nacimiento (1436)"
      }
    ],
    "note": "MedLands fecha el nacimiento el 18 de septiembre de 1434.",
    "alternatives": [
      "1436 (GND)"
    ],
    "exactDate": "1434-09-18",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LIVIOODESCALCHI:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Odescalchi, Livio",
        "url": "https://www.treccani.it/enciclopedia/livio-odescalchi_%28Dizionario-Biografico%29/",
        "locator": "Vol. 79 (2013). «Nacque a Como il 10 marzo 1658»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/130234168",
        "locator": "Datos vitales: fecha de nacimiento (1655-03-10)"
      }
    ],
    "note": "El DBI fecha el nacimiento el 10 de marzo de 1658.",
    "alternatives": [
      "10 mar. 1655 (GND)"
    ],
    "exactDate": "1658-03-10",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LUCREZIATORNABUONI:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Tornabuoni, Lucrezia",
        "url": "https://www.treccani.it/enciclopedia/lucrezia-tornabuoni_%28Dizionario-Biografico%29/",
        "locator": "Vol. 96 (2019). «Nacque a Firenze il 22 giugno 1427»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119131242",
        "locator": "Datos vitales: fecha de nacimiento (1425)"
      }
    ],
    "note": "El DBI fecha el nacimiento el 22 de junio de 1427.",
    "alternatives": [
      "1425 (GND)"
    ],
    "exactDate": "1427-06-22",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LUDOVICO1SAL:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Saluzzo, Ludovico I da",
        "url": "https://www.treccani.it/enciclopedia/saluzzo-ludovico-i-da-marchese-di-saluzzo_%28Dizionario-Biografico%29/",
        "locator": "Vol. 89 (2017). Nacimiento en los «primi mesi del 1405»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129465801",
        "locator": "Datos vitales: fecha de nacimiento (1416)"
      }
    ],
    "note": "El DBI lo hace nacer en los primeros meses de 1405.",
    "alternatives": [
      "1416 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LUIS1BAV:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Bavaria",
        "url": "https://fmg.ac/Projects/MedLands/BAVARIA.htm",
        "locator": "Entrada «LUDWIG von Wittelsbach (23 Nov 1173-murdered on the Kelheimer Bridge 14/15 Sep 1231)»"
      },
      {
        "title": "Encyclopaedia Britannica · Louis I (duke of Bavaria)",
        "url": "https://www.britannica.com/biography/Louis-I-duke-of-Bavaria",
        "locator": "Encabezado: «born Dec. 23, 1174, Kelheim»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/100952429",
        "locator": "Datos vitales: fecha de nacimiento (1174-12-23)"
      }
    ],
    "note": "MedLands da el 23 de noviembre de 1173; Britannica, el 23 de diciembre de 1174.",
    "alternatives": [
      "23 dic. 1174 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:LUIS1BOR:death": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Louis I, 1st duke de Bourbon",
        "url": "https://www.britannica.com/biography/Louis-I-1er-duc-de-Bourbon",
        "locator": "Encabezado: «died c. 1342»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/13795655X",
        "locator": "Datos vitales: fecha de fallecimiento (1341)"
      }
    ],
    "note": "Britannica da hacia 1342; se conserva como fecha aproximada.",
    "alternatives": [
      "1341 (GND)"
    ],
    "timeLabel": "c. 1342",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MADELEINEAUV:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Maddalena de la Tour d'Auvergne, duchessa di Urbino",
        "url": "https://www.treccani.it/enciclopedia/maddalena-de-la-tour-d-auvergne-duchessa-di-urbino_%28Dizionario-Biografico%29/",
        "locator": "Vol. 67 (2006). «Madeleine nacque intorno al 1500»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1204516375",
        "locator": "Datos vitales: fecha de nacimiento (1495)"
      }
    ],
    "note": "El DBI la hace nacer hacia 1500; se corrige el año y se registran las alternativas.",
    "alternatives": [
      "1498 (valor anterior del Atlas, sin fuente específica localizada)",
      "1495 (GND)"
    ],
    "timeLabel": "c. 1500",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARG2HEN:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hainaut",
        "url": "https://fmg.ac/Projects/MedLands/HAINAUT.htm",
        "locator": "Entrada «MARGUERITE de Hainaut (24 Jun 1310-Le Quesnoy 23 Jun 1356)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/121735362",
        "locator": "Datos vitales: fecha de nacimiento (1310)"
      }
    ],
    "note": "MedLands fecha el nacimiento el 24 de junio de 1310, como el año de la ficha GND; se corrige el año.",
    "alternatives": [
      "1311 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1310-06-24",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARGABORG1290:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Margarita de Borgoña",
        "url": "https://historia-hispanica.rah.es/biografias/28328-margarita-de-borgona",
        "locator": "Cabecera: «1290 – 1315»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Burgundy",
        "url": "https://fmg.ac/Projects/MedLands/BURGUNDY.htm",
        "locator": "Entrada «MARGUERITE de Bourgogne (1290-Château-Gaillard [...] 30 Apr 1315)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/139100806",
        "locator": "Datos vitales: fecha de nacimiento (1292)"
      }
    ],
    "note": "El DBE y MedLands dan 1290.",
    "alternatives": [
      "1292 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARGDUR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Margherita d'Angiò Durazzo, regina di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/margherita-d-angio-durazzo-regina-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 70 (2008). «nacque nella prima metà del 1348 in Provenza»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/124248519",
        "locator": "Datos vitales: fecha de nacimiento (1348)"
      }
    ],
    "note": "El DBI y la ficha GND dan 1348; se corrige el año.",
    "alternatives": [
      "1347 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARGFRAFLA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «MARGUERITE de France (1309-Paris 9 May 1382)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1268054798",
        "locator": "Datos vitales: fecha de nacimiento (1309)"
      }
    ],
    "note": "MedLands y la ficha GND dan 1309; se corrige el año.",
    "alternatives": [
      "1310 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARGLORENA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Lorraine",
        "url": "https://fmg.ac/Projects/MedLands/LORRAINE.htm",
        "locator": "Entrada «MARGUERITE de Lorraine (22 Jul 1615-Palais d’Orléans, Paris 13 Apr 1672)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119095025",
        "locator": "Datos vitales: fecha de nacimiento (1613)"
      }
    ],
    "note": "MedLands fecha el nacimiento el 22 de julio de 1615.",
    "alternatives": [
      "1613 (GND)"
    ],
    "exactDate": "1615-07-22",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIA1H:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Hungary",
        "url": "https://fmg.ac/Projects/MedLands/HUNGARY.htm",
        "locator": "Entrada «MÁRIA of Hungary (1371-Buda 1395)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/132134454",
        "locator": "Datos vitales: fecha de nacimiento (1370)"
      }
    ],
    "note": "MedLands da 1371.",
    "alternatives": [
      "1370 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIA1SIC:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · María de Sicilia",
        "url": "https://historia-hispanica.rah.es/biografias/28772-maria-de-sicilia",
        "locator": "Cabecera: «1363 – 1401»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Entrada «MARIA of Sicily (Catania 18 Jul 1363-Sentini 25 May 1401)»"
      },
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Maria d'Aragona, regina di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/maria-d-aragona-regina-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 70 (2008). «nacque nel 1362»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/131424998",
        "locator": "Datos vitales: fecha de nacimiento (1362)"
      }
    ],
    "note": "El DBE y MedLands dan 1363; el DBI, 1362.",
    "alternatives": [
      "1362 (DBI; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIABOHUN:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · English Nobility Medieval",
        "url": "https://fmg.ac/Projects/MedLands/ENGLISH%20NOBILITY%20MEDIEVAL.htm",
        "locator": "Entrada «MARY de Bohun ([1369/70]-Peterborough Castle 4 Jun 1394)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/144005263",
        "locator": "Datos vitales: fecha de nacimiento (1370)"
      }
    ],
    "note": "MedLands estima 1369 o 1370; se conserva como fecha aproximada.",
    "alternatives": [
      "1370 (GND)"
    ],
    "timeLabel": "1369/1370",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIAHUNNAP:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Maria d'Ungheria, regina di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/maria-d-ungheria-regina-di-sicilia_%28Dizionario-Biografico%29/",
        "locator": "Vol. 70 (2008). «Nacque verso il 1255»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129839310",
        "locator": "Datos vitales: fecha de nacimiento (1255)"
      }
    ],
    "note": "El DBI la hace nacer hacia 1255, como la ficha GND. No se corrige todavía: en el Atlas su madre, Isabel de Cumania, tendría entonces 11 años, así que ambas fechas deben revisarse juntas.",
    "alternatives": [
      "c. 1255 (DBI; GND 1255)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIAMOL:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · María de Molina",
        "url": "https://historia-hispanica.rah.es/biografias/28710-maria-de-molina",
        "locator": "Cabecera: «c. 1260 – 1.VII.1321»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/130515353",
        "locator": "Datos vitales: fecha de nacimiento (1265)"
      }
    ],
    "note": "El DBE da hacia 1260; se corrige el año y se conserva como aproximado.",
    "alternatives": [
      "1264 (valor anterior del Atlas, sin fuente específica localizada)",
      "1265 (GND)"
    ],
    "timeLabel": "c. 1260",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MARIAVALOISCAL:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «MARIE de Valois (-28 Oct 1331)», con los Annales de Raimo"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1346358923",
        "locator": "Datos vitales: fecha de fallecimiento (1331)"
      }
    ],
    "note": "MedLands y la ficha GND dan 1331; se corrige el año.",
    "alternatives": [
      "1332 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1331-10-28",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MATHAB:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Austria",
        "url": "https://fmg.ac/Projects/MedLands/AUSTRIA.htm",
        "locator": "Entrada «MECHTILD (Rheinfelden [1253]-Munich 22 or 23 Dec 1304)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/120266318",
        "locator": "Datos vitales: fecha de nacimiento (1251)"
      }
    ],
    "note": "MedLands estima 1253; se conserva como fecha aproximada.",
    "alternatives": [
      "1251 (GND)"
    ],
    "timeLabel": "c. 1253",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MATILDAING:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/18339",
        "locator": "Encabezado del artículo: «Matilda, duchess of Saxony (1156–1189)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118731718",
        "locator": "Datos vitales: fecha de nacimiento (1157)"
      }
    ],
    "note": "El ODNB da 1156.",
    "alternatives": [
      "1157 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MEHMED4OSM:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Mehmed IV",
        "url": "https://www.britannica.com/biography/Mehmed-IV",
        "locator": "Encabezado: «died Jan. 6, 1693, Edirne»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/103143556",
        "locator": "Datos vitales: fecha de fallecimiento (1692)"
      }
    ],
    "note": "Britannica fecha la muerte el 6 de enero de 1693.",
    "alternatives": [
      "1692 (GND)"
    ],
    "exactDate": "1693-01-06",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MICHAEL8PALA:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Byzantium 12611453",
        "url": "https://fmg.ac/Projects/MedLands/BYZANTIUM%2012611453.htm",
        "locator": "Entrada «MIKHAEL Doukas Komnenos Palaiologos ([1224/25]-11 Dec 1282)»"
      },
      {
        "title": "Encyclopaedia Britannica · Michael VIII Palaeologus",
        "url": "https://www.britannica.com/biography/Michael-VIII-Palaeologus",
        "locator": "Encabezado: «born 1224 or 1225»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/11878370X",
        "locator": "Datos vitales: fecha de nacimiento (1224)"
      }
    ],
    "note": "MedLands y Britannica dudan entre 1224 y 1225; se corrige a 1224.",
    "alternatives": [
      "1225 (MedLands; Britannica)",
      "1223 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MICHAEL9PALA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Byzantium 12611453",
        "url": "https://fmg.ac/Projects/MedLands/BYZANTIUM%2012611453.htm",
        "locator": "Hijo de Andronikos II y Anna de Hungría: «(1277-Thessaloniki 12 Oct 1320)»"
      },
      {
        "title": "Encyclopaedia Britannica · Michael IX Palaeologus",
        "url": "https://www.britannica.com/biography/Michael-IX-Palaeologus",
        "locator": "Encabezado: «born c. 1277»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/107767385X",
        "locator": "Datos vitales: fecha de nacimiento (1278-04-12)"
      }
    ],
    "note": "MedLands y Britannica dan 1277.",
    "alternatives": [
      "12 abr. 1278 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MUHAMMAD1NASR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Muhammad I (Ibn al-Ahmar)",
        "url": "https://historia-hispanica.rah.es/biografias/32127-muhammad-i",
        "locator": "Cabecera: «1195 – 20.I.1273»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1148770658",
        "locator": "Datos vitales: fecha de nacimiento (1199)"
      }
    ],
    "note": "El DBE da 1195.",
    "alternatives": [
      "1199 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:MUHAMMAD5NASR:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Muhammad V",
        "url": "https://historia-hispanica.rah.es/biografias/31694-muhammad-v",
        "locator": "Cabecera: «1339 – 1391»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1180671155",
        "locator": "Datos vitales: fecha de nacimiento (1338)"
      }
    ],
    "note": "El DBE da 1339.",
    "alternatives": [
      "1338 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:NICCPICC:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Piccinino, Niccolò",
        "url": "https://www.treccani.it/enciclopedia/niccolo-piccinino_%28Dizionario-Biografico%29/",
        "locator": "Vol. 83 (2015). «nacque probabilmente a Perugia nel 1386»"
      },
      {
        "title": "Encyclopaedia Britannica · Niccolò Piccinino",
        "url": "https://www.britannica.com/biography/Niccolo-Piccinino",
        "locator": "Encabezado: «born 1386, Perugia»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/123293243",
        "locator": "Datos vitales: fecha de nacimiento (1375)"
      }
    ],
    "note": "El DBI y Britannica dan 1386.",
    "alternatives": [
      "1375 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:OLIMPIAMAIDALCHINI:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Maidalchini, Olimpia",
        "url": "https://www.treccani.it/enciclopedia/olimpia-maidalchini_%28Dizionario-Biografico%29/",
        "locator": "Vol. 67 (2006). «Nacque a Viterbo il 26 maggio 1592 - o, secondo una meno affidabile tradizione, nel 1594»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119061961",
        "locator": "Datos vitales: fecha de nacimiento (1591-05-26)"
      }
    ],
    "note": "El DBI fecha el nacimiento el 26 de mayo de 1592 y considera menos fiable la tradición de 1594; se corrige el año.",
    "alternatives": [
      "1594 (tradición menos fiable según el DBI; valor anterior del Atlas)",
      "26 may. 1591 (GND)"
    ],
    "exactDate": "1592-05-26",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:OLIMPIAMANCINI:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Mancini, Olimpia",
        "url": "https://www.treccani.it/enciclopedia/olimpia-mancini_%28Dizionario-Biografico%29/",
        "locator": "Vol. 68 (2007). «Nacque a Roma l'11 luglio 1637»"
      },
      {
        "title": "Encyclopaedia Britannica · Olympe Mancini, comtesse de Soissons",
        "url": "https://www.britannica.com/biography/Olympe-Mancini-comtesse-de-Soissons",
        "locator": "Encabezado: «born 1639»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1177064650",
        "locator": "Datos vitales: fecha de nacimiento (1639)"
      }
    ],
    "note": "El DBI fecha el nacimiento el 11 de julio de 1637; Britannica da 1639. Se corrige a 1637.",
    "alternatives": [
      "1639 (Britannica; GND)",
      "1638 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:OTAK2:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Bohemia",
        "url": "https://fmg.ac/Projects/MedLands/BOHEMIA.htm",
        "locator": "Entrada «OTAKAR (1233-killed in battle Dürnkrut 26 Aug 1278)»"
      },
      {
        "title": "Encyclopaedia Britannica · Otakar II (king of Bohemia)",
        "url": "https://www.britannica.com/biography/Otakar-II",
        "locator": "Encabezado: «born 1230»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118590898",
        "locator": "Datos vitales: fecha de nacimiento (1232)"
      }
    ],
    "note": "MedLands da 1233; Britannica, 1230.",
    "alternatives": [
      "1230 (Britannica)",
      "1232 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PAND3MAL:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Malatesta, Pandolfo",
        "url": "https://www.treccani.it/enciclopedia/pandolfo-malatesta_%28Dizionario-Biografico%29/",
        "locator": "Vol. 68 (2007). «nacque il 2 genn. 1370»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119249073",
        "locator": "Datos vitales: fecha de nacimiento (1369)"
      }
    ],
    "note": "El DBI fecha el nacimiento el 2 de enero de 1370.",
    "alternatives": [
      "1369 (GND)"
    ],
    "exactDate": "1370-01-02",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PAPA_BENEDICTO13:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Benedict XIII (pope)",
        "url": "https://www.britannica.com/biography/Benedict-XIII-pope",
        "locator": "Encabezado: «born Feb. 2, 1649, Gravina»"
      },
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Benedetto XIII, papa",
        "url": "https://www.treccani.it/enciclopedia/papa-benedetto-xiii_%28Dizionario-Biografico%29/",
        "locator": "Vol. 8 (1966). «nacque a Gravina il 2 febbr. 1650, secondo i calcoli del Vignato, mentre la maggior parte dei biografi lo dice nato nel 1649»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119539780",
        "locator": "Datos vitales: fecha de nacimiento (1650)"
      }
    ],
    "note": "El día (2 de febrero) es seguro; el año oscila entre 1649, que da la mayoría de los biógrafos, y 1650.",
    "alternatives": [
      "2 feb. 1650 (DBI, según Vignato; GND 1650)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PAPA_CLEMENTE4:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Clemente IV, papa",
        "url": "https://www.treccani.it/enciclopedia/papa-clemente-iv_%28Dizionario-Biografico%29/",
        "locator": "Vol. 26 (1982). «nacque, probabilmente poco prima del 1200, a Saint-Gilles»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/11922030X",
        "locator": "Datos vitales: fecha de nacimiento (1200)"
      }
    ],
    "note": "El DBI lo hace nacer poco antes de 1200; se corrige el año y se conserva como aproximado.",
    "alternatives": [
      "1190 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "poco antes de 1200",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PEDRO2AR:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Pedro II de Aragón",
        "url": "https://historia-hispanica.rah.es/biografias/35775-pedro-ii-de-aragon",
        "locator": "«debió de nacer en Huesca hacia 1178»"
      },
      {
        "title": "Encyclopaedia Britannica · Peter II (king of Aragon)",
        "url": "https://www.britannica.com/biography/Peter-II-king-of-Aragon",
        "locator": "Encabezado: «born 1174»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1018870210",
        "locator": "Datos vitales: fecha de nacimiento (1174)"
      }
    ],
    "note": "El DBE da hacia 1178; Britannica, 1174.",
    "alternatives": [
      "1174 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PIEROSODERINI:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Piero di Tommaso Soderini",
        "url": "https://www.britannica.com/biography/Piero-di-Tommaso-Soderini",
        "locator": "Encabezado: «born May 18, 1452, Florence»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129070912",
        "locator": "Datos vitales: fecha de nacimiento (1452)"
      }
    ],
    "note": "Britannica fecha el nacimiento el 18 de mayo de 1452, como el año de la ficha GND; se corrige el año.",
    "alternatives": [
      "1451 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1452-05-18",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:PIEROSODERINI:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Piero di Tommaso Soderini",
        "url": "https://www.britannica.com/biography/Piero-di-Tommaso-Soderini",
        "locator": "Encabezado: «died June 13, 1522, Rome»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129070912",
        "locator": "Datos vitales: fecha de fallecimiento (1524)"
      }
    ],
    "note": "Britannica fecha la muerte el 13 de junio de 1522.",
    "alternatives": [
      "1524 (GND)"
    ],
    "exactDate": "1522-06-13",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:REDHUGHODONNELL:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/20554",
        "locator": "Encabezado del artículo: «O'Donnell, Hugh [...] lord of Tyrconnell (1572–1602)»"
      },
      {
        "title": "Encyclopaedia Britannica · Hugh Roe O’Donnell",
        "url": "https://www.britannica.com/biography/Hugh-Roe-ODonnell",
        "locator": "Encabezado: «born c. 1572, County Donegal»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/13204725X",
        "locator": "Datos vitales: fecha de nacimiento (1571)"
      }
    ],
    "note": "El ODNB da 1572 y Britannica hacia 1572.",
    "alternatives": [
      "c. 1571 (DBE; GND 1571)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:RENEAFRA:death": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Renée of France",
        "url": "https://www.britannica.com/biography/Renee-of-France",
        "locator": "Encabezado: «died June 12, 1574, Montargis»"
      },
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Renata di Valois-Orléans",
        "url": "https://www.treccani.it/enciclopedia/renata-di-valois-orleans_%28Dizionario-Biografico%29/",
        "locator": "Vol. 86 (2016). «Morì a Montargis il 12 giugno 1575»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/11892933X",
        "locator": "Datos vitales: fecha de fallecimiento (1575)"
      }
    ],
    "note": "Britannica y el DBI coinciden en el 12 de junio en Montargis, pero difieren en el año.",
    "alternatives": [
      "12 jun. 1575 (DBI; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:RENEALENCON:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Capet",
        "url": "https://fmg.ac/Projects/MedLands/CAPET.htm",
        "locator": "Entrada «RENE d'Alençon ([1439]-Château d’Alençon 1 Nov 1492)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1037225007",
        "locator": "Datos vitales: fecha de fallecimiento (1454-11-01)"
      }
    ],
    "note": "MedLands fecha la muerte el 1 de noviembre de 1492; la ficha GND (1454) es un error evidente.",
    "alternatives": [
      "1 nov. 1454 (GND)"
    ],
    "exactDate": "1492-11-01",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ROB1NAP:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Roberto d'Angiò, re di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/roberto-d-angio-re-di-sicilia-napoli_%28Dizionario-Biografico%29/",
        "locator": "Vol. 87 (2017). «Nacque nel 1278 nella torre di Sant’Erasmo»"
      },
      {
        "title": "Encyclopaedia Britannica · Robert (king of Naples)",
        "url": "https://www.britannica.com/biography/Robert-king-of-Naples",
        "locator": "Encabezado: «born 1278»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118789066",
        "locator": "Datos vitales: fecha de nacimiento (1278)"
      }
    ],
    "note": "El DBI, Britannica y la ficha GND dan 1278; se corrige el año.",
    "alternatives": [
      "1277 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ROB2BORG:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Burgundy",
        "url": "https://fmg.ac/Projects/MedLands/BURGUNDY.htm",
        "locator": "Entrada «ROBERT de Bourgogne ([1245/48]-Vernon-sur-Seine, Eure 21 Mar 1306)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118834533",
        "locator": "Datos vitales: fecha de fallecimiento (1305)"
      }
    ],
    "note": "MedLands fecha la muerte el 21 de marzo de 1306; la ficha GND (1305) parece seguir el estilo antiguo.",
    "alternatives": [
      "1305 (GND)"
    ],
    "exactDate": "1306-03-21",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ROB3FLAND:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/132605570",
        "locator": "Datos vitales: fecha de nacimiento (1246)"
      }
    ],
    "note": "No se ha localizado una fuente específica que decida entre 1249 y 1246; el dato queda discutido.",
    "alternatives": [
      "1246 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:ROD3HAB:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Austria",
        "url": "https://fmg.ac/Projects/MedLands/AUSTRIA.htm",
        "locator": "Entrada «RUDOLF ([1282]-Heerlager/Horažďovice 4 Jul 1307)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/128689056",
        "locator": "Datos vitales: fecha de nacimiento (1282)"
      }
    ],
    "note": "MedLands estima 1282, como la ficha GND; se corrige el año como aproximado.",
    "alternatives": [
      "1281 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "timeLabel": "c. 1282",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:SANCHAARAG:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Aragona, Sancia d'",
        "url": "https://www.treccani.it/enciclopedia/sancia-d-aragona_%28Dizionario-Biografico%29/",
        "locator": "Vol. 3 (1961). «Figlia naturale di Alfonso II e di Trusia Gazzella, nata nel 1478»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Entrada «SANCHA d'Aragona (Gaeta 1478-Naples 1506)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129899879",
        "locator": "Datos vitales: fecha de nacimiento (1476)"
      }
    ],
    "note": "El DBI y MedLands dan 1478.",
    "alternatives": [
      "1476 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:SANCHAARAG:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Sicily",
        "url": "https://fmg.ac/Projects/MedLands/SICILY.htm",
        "locator": "Entrada «SANCHA d'Aragona (Gaeta 1478-Naples 1506)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/129899879",
        "locator": "Datos vitales: fecha de fallecimiento (1504)"
      }
    ],
    "note": "MedLands sitúa la muerte en 1506.",
    "alternatives": [
      "1504 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:SANCHAMALL:birth": {
    "certainty": "approximate",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Sancia di Maiorca, regina di Sicilia",
        "url": "https://www.treccani.it/enciclopedia/sancia-di-maiorca-regina-di-sicilia-napoli_%28Dizionario-Biografico%29/",
        "locator": "Vol. 90 (2017). «Nacque nel 1285/1286, forse a Montpellier»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/122383745",
        "locator": "Datos vitales: fecha de nacimiento (1286)"
      }
    ],
    "note": "El DBI deja el nacimiento entre 1285 y 1286.",
    "alternatives": [
      "1286 (DBI; GND)"
    ],
    "timeLabel": "1285/1286",
    "precision": "circa",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:SANCHO1MALL:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Sancho I de Mallorca",
        "url": "https://historia-hispanica.rah.es/biografias/41188-sancho-i-de-mallorca",
        "locator": "Cabecera: «1277 sup. – 4.IX.1324»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1362079146",
        "locator": "Datos vitales: fecha de nacimiento (1272)"
      }
    ],
    "note": "El DBE propone 1277 como fecha supuesta; se corrige el año y se mantiene como discutido.",
    "alternatives": [
      "1274 (valor anterior del Atlas, sin fuente específica localizada)",
      "1272 (GND)"
    ],
    "timeLabel": "1277 (supuesto)",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:SERPIERODAVINCI:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/113689523X",
        "locator": "Datos vitales: fecha de nacimiento (1427)"
      }
    ],
    "note": "No se ha localizado una fuente específica que decida entre 1426 y 1427; el dato queda discutido.",
    "alternatives": [
      "1427 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:STEFANFIRSTSER:death": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Serbia",
        "url": "https://fmg.ac/Projects/MedLands/SERBIA.htm",
        "locator": "Entrada «STEFAN (-24 Sep 1227, bur Studenica)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/119462796",
        "locator": "Datos vitales: fecha de fallecimiento (1227)"
      }
    ],
    "note": "MedLands fecha la muerte el 24 de septiembre de 1227, como el año de la ficha GND. No se corrige todavía: el reinado y el relevo de Stefan Radoslav están cortados en 1228 y deben revisarse a la vez.",
    "alternatives": [
      "24 sep. 1227 (MedLands; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:STEFANNEMANJASER:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Serbia",
        "url": "https://fmg.ac/Projects/MedLands/SERBIA.htm",
        "locator": "Entrada «STEFAN NEMANJA (near Podgorica [1113]-Mount Athos 13 Feb 1199)»"
      },
      {
        "title": "Encyclopaedia Britannica · Stefan Nemanja",
        "url": "https://www.britannica.com/biography/Stefan-Nemanja",
        "locator": "Encabezado: «died c. 1200»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118922459",
        "locator": "Datos vitales: fecha de fallecimiento (1200)"
      }
    ],
    "note": "MedLands fecha la muerte el 13 de febrero de 1199; Britannica da una aproximación compatible.",
    "alternatives": [
      "c. 1200 (Britannica; GND 1200)"
    ],
    "exactDate": "1199-02-13",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:TEOB2NAV:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Teobaldo II",
        "url": "https://historia-hispanica.rah.es/biografias/43152-teobaldo-ii",
        "locator": "Cabecera: «6.XII.1239 - 7.XII.1239 – 4.XII.1270 - 5.XII.1270»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118893467",
        "locator": "Datos vitales: fecha de nacimiento (1237)"
      }
    ],
    "note": "El DBE fecha el nacimiento el 6 o 7 de diciembre de 1239.",
    "alternatives": [
      "1237 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:THEODORE2MOREA:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1074438248",
        "locator": "Datos vitales: fecha de nacimiento (1394)"
      }
    ],
    "note": "No se ha localizado una fuente específica que decida entre 1396 y 1394; el dato queda discutido.",
    "alternatives": [
      "1394 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:TOMAS1SAB:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Savoy",
        "url": "https://fmg.ac/Projects/MedLands/SAVOY.htm",
        "locator": "Entrada «THOMAS de Maurienne (Château de Carbonara 1178 after 26 Jun-Moncalieri 1 Mar 1233)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/137465963",
        "locator": "Datos vitales: fecha de nacimiento (1177)"
      }
    ],
    "note": "MedLands da 1178.",
    "alternatives": [
      "1177 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:TRIVULZIO:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Trivulzio, Gian Giacomo detto il Magno",
        "url": "https://www.treccani.it/enciclopedia/trivulzio-gian-giacomo-detto-il-magno_%28Dizionario-Biografico%29/",
        "locator": "Vol. 97 (2020). «Nacque a Crema il 24 giugno 1442»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/122477391",
        "locator": "Datos vitales: fecha de nacimiento (1442-06-24)"
      }
    ],
    "note": "El DBI y la ficha GND fechan el nacimiento el 24 de junio de 1442; se corrige el año.",
    "alternatives": [
      "1440 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "exactDate": "1442-06-24",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VALVISC:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «VALENTINA Visconti (Pavia 1371-Château de Blois [...] 14 Dec 1408)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/133638502",
        "locator": "Datos vitales: fecha de nacimiento (1366)"
      }
    ],
    "note": "MedLands da 1371.",
    "alternatives": [
      "1366 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VIOLARAG:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Violante de Aragón (I)",
        "url": "https://historia-hispanica.rah.es/biografias/46148-violante-de-aragon-i",
        "locator": "Cabecera: «1236 - 1237 – 1300»; murió en Roncesvalles al regreso de su peregrinación a Roma"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1401281435",
        "locator": "Datos vitales: fecha de fallecimiento (1300)"
      }
    ],
    "note": "El DBE y la ficha GND dan 1300; se corrige el año.",
    "alternatives": [
      "1301 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VIRIDISV:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «VERDE [Viridis] Visconti (Milan 1352-before 11 Mar 1414)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/13035936X",
        "locator": "Datos vitales: fecha de nacimiento (1350)"
      }
    ],
    "note": "MedLands da 1352.",
    "alternatives": [
      "1350 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VIRIDISV:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Milan",
        "url": "https://fmg.ac/Projects/MedLands/MILAN.htm",
        "locator": "Entrada «VERDE [Viridis] Visconti (Milan 1352-before 11 Mar 1414)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/13035936X",
        "locator": "Datos vitales: fecha de fallecimiento (1407)"
      }
    ],
    "note": "MedLands sitúa la muerte antes del 11 de marzo de 1414.",
    "alternatives": [
      "1407 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VITTORIACOL:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Treccani · Dizionario Biografico degli Italiani · Colonna, Vittoria",
        "url": "https://www.treccani.it/enciclopedia/vittoria-colonna_%28Dizionario-Biografico%29/",
        "locator": "Vol. 27 (1982). «Nacque a Marino nell'anno 1490»"
      },
      {
        "title": "Encyclopaedia Britannica · Vittoria Colonna",
        "url": "https://www.britannica.com/biography/Vittoria-Colonna",
        "locator": "Encabezado: «born 1492?, Marino»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118669818",
        "locator": "Datos vitales: fecha de nacimiento (1492)"
      }
    ],
    "note": "El DBI da 1490; Britannica, 1492 con interrogante.",
    "alternatives": [
      "1492 (Britannica; GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:VLAD3DRACULA:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · Vlad the Impaler",
        "url": "https://www.britannica.com/biography/Vlad-the-Impaler",
        "locator": "Encabezado: «born 1431, Sighișoara»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/118627333",
        "locator": "Datos vitales: fecha de nacimiento (1430)"
      }
    ],
    "note": "Britannica da 1431.",
    "alternatives": [
      "1430 (GND)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:WALRAM2:death": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Nassau",
        "url": "https://fmg.ac/Projects/MedLands/NASSAU.htm",
        "locator": "Entrada «WALRAM [II] ([1220]-24 Jan 1276)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/138721475",
        "locator": "Datos vitales: fecha de fallecimiento (1266)"
      }
    ],
    "note": "MedLands fecha la muerte el 24 de enero de 1276.",
    "alternatives": [
      "1266 (GND)"
    ],
    "exactDate": "1276-01-24",
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:WILLIAM1SCOT:birth": {
    "certainty": "disputed",
    "sources": [
      {
        "title": "Encyclopaedia Britannica · William I (king of Scotland)",
        "url": "https://www.britannica.com/biography/William-I-king-of-Scotland",
        "locator": "Encabezado: «born 1143»"
      },
      {
        "title": "Foundation for Medieval Genealogy · MedLands · Scotland",
        "url": "https://fmg.ac/Projects/MedLands/SCOTLAND.htm",
        "locator": "Entrada «WILLIAM (1143-Stirling 4 Dec 1214)»"
      },
      {
        "title": "Oxford Dictionary of National Biography",
        "url": "https://doi.org/10.1093/ref:odnb/29452",
        "locator": "Encabezado del artículo: «William I [known as William the Lion] (c. 1142–1214)»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/1017398216",
        "locator": "Datos vitales: fecha de nacimiento (1142)"
      }
    ],
    "note": "Britannica y MedLands dan 1143; el ODNB, hacia 1142.",
    "alternatives": [
      "c. 1142 (ODNB; GND 1142)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  },
  "person:YOLANDAARAG:birth": {
    "certainty": "documented",
    "sources": [
      {
        "title": "Real Academia de la Historia · Diccionario Biográfico español · Violante de Aragón (IV)",
        "url": "https://historia-hispanica.rah.es/biografias/46150-violante-de-aragon-iv",
        "locator": "Cabecera: «1385 – c. 1444»"
      },
      {
        "title": "Deutsche Nationalbibliothek · Ficha de autoridad GND",
        "url": "https://d-nb.info/gnd/128686669",
        "locator": "Datos vitales: fecha de nacimiento (1385)"
      }
    ],
    "note": "El DBE y la ficha GND dan 1385; se corrige el año.",
    "alternatives": [
      "1384 (valor anterior del Atlas, sin fuente específica localizada)"
    ],
    "reviewedAt": "2026-10-17",
    "editor": "El Árbol de Europa"
  }
});
