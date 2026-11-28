// Common direction is dated separately from titles and family membership.
export const ORDER_MALTA_COLOR = '#9B3A3A';
export const TEUTONIC_ORDER_COLOR = '#7070C2';
export const FORELANDS_TYROL_COLOR = '#A85662';
export const INSTITUTIONAL_POLITY_SOURCES = Object.freeze({
  hospitallers: {title:'University of Malta · A Maltese rural village in the first years of the Order’s rule',url:'https://www.um.edu.mt/library/oar/handle/123456789/89457',locator:'Resumen: cesión del archipiélago maltés y de Trípoli a la Orden en marzo de 1530.',locatorEn:'Abstract: grant of the Maltese archipelago and Tripoli to the Order in March 1530.'},
  livonia: {title:'Visuotinė lietuvių enciklopedija · Livonijos ordinas',url:'https://www.vle.lt/straipsnis/livonijos-ordinas/',locator:'Creación como rama autónoma en 1237; coordinación de campañas en los siglos XIII–XIV; abstención de 1410 y política distinta en 1431.',locatorEn:'Foundation as an autonomous branch in 1237; coordinated thirteenth- and fourteenth-century campaigns; abstention in 1410 and a separate policy in 1431.'},
});
export function institutionalPolityAt(identity, year, locationId = null) {
  if(identity === 'Condado de Lingen · dominio disputado' && locationId === 'Lingen' && year>=1622 && year<=1630)
    return {id:'control-espanol-lingen',label:'Lingen bajo control militar español',color:'#C5A62B',source:{title:'Niedersächsisches Landesarchiv · Osnabrück, Rep 130',url:'https://www.arcinsys.niedersachsen.de/arcinsys/showFondsDetails?fondsId=3042',locator:'Historia institucional: dominio español de Lingen entre 1605 y 1630.',locatorEn:'Institutional history: Spanish rule in Lingen from 1605 to 1630.'}};
  if (identity === 'Austria Anterior' && locationId === 'Ensisheim' && year >= 1633 && year <= 1789) {
    const source = {title:'Archives d’Alsace · Régence d’Ensisheim, introduction',url:'https://archives68.alsace.eu/media/1ad66d00-cd5f-4f55-bc65-efc86dc4e8dc.pdf',locator:'Páginas 2 y 6: retirada de la Regencia, ocupaciones sueca y francesa, caída de Brisach en diciembre de 1638; cesión de derechos alsacianos a Francia en 1648.',locatorEn:'Pages 2 and 6: retreat of the Regency, Swedish and French occupations, fall of Breisach in December 1638; cession of Alsatian rights to France in 1648.'};
    if (year <= 1634) return {id:'ocupacion-sueca-alsacia',label:'Ocupación sueca de Alsacia',color:'#6E8F93',source};
    if (year <= 1638) return {id:'ocupacion-weimar-alsacia',label:'Ensisheim · ocupaciones militares y control disputado',color:'#897658',source};
    return {id:'control-frances-alsacia',label:'Alsacia bajo control francés',color:'#295D8E',source};
  }
  if (year >= 1530 && year <= 1797 && ['Malta','Trípoli de los caballeros de Malta'].includes(identity))
    return {id:'orden-de-san-juan',label:'Orden de San Juan',color:ORDER_MALTA_COLOR,source:INSTITUTIONAL_POLITY_SOURCES.hospitallers};
  // The Livonian branch increasingly pursued its own diplomacy; Prussia's
  // secularisation in 1525 did not turn Livonia into the duke's dependency.
  if (year >= 1237 && year <= 1409 && ['Orden de Livonia','Prusia de la Orden'].includes(identity))
    return {id:'orden-teutonica-livonia',label:'Orden Teutónica y rama de Livonia',color:TEUTONIC_ORDER_COLOR,source:INSTITUTIONAL_POLITY_SOURCES.livonia};
  return null;
}
