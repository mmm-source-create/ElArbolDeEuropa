// The legal title alone cannot select every surface of a partitioned house.
export function successionJurisdictions(names, territory, year, personId) {
  if (territory === 'Dobruja') return ['Despotado de Dobruja'];
  if (territory === 'Bulgaria' && personId === 'CHAKABUL') return ['Bulgaria · Chaka en Tarnovo'];
  if (territory === 'Valaquia' && personId === 'MIRCEA1WAL')
    return [...names.filter(name=>name!=='Núcleos de Dobruja bajo Mircea'),'Dobruja · dominios de Valaquia'];
  if (territory === 'Imperio otomano') return [...names,'Dobruja otomana','Lika otomana','Makarska otomana'];
  if (territory === 'Croacia') return [...names,'Dalmacia bajo la Corona croata'];
  if (['Venecia','República de Venecia'].includes(territory)) return [...names,'Dalmacia veneciana'];
  if (territory === 'Suabia') return ['Ducado de Suabia'];
  if (territory === 'Sajonia-Weimar') return ['Ducado de Sajonia-Weimar'];
  if (territory === 'Sajonia-Gotha') return ['Ducado de Sajonia-Gotha'];
  if (territory === 'Sajonia-Coburgo-Eisenach') return ['Ducados de Sajonia-Coburgo y Sajonia-Eisenach'];
  if (territory === 'Sajonia-Coburgo') return ['Ducado de Sajonia-Coburgo'];
  if (territory === 'Sajonia-Eisenach') return ['Ducado de Sajonia-Eisenach'];
  if (territory === 'Meißen') {
    if (year>=1485) return [];
    if (['FRED1SAX','WILHELM2MEISSEN'].includes(personId) && year>=1382 && year<=1406)
      return ['Osterland'];
    return ['Margraviato de Meißen'];
  }
  if (territory === 'Turingia') return [year<1485?'Landgraviato de Turingia':'Turingia ernestina'];
  if (territory === 'Nassau') {
    if(year<1255) return ['Condado de Nassau'];
    if(['WALRAM2','ADOLFN'].includes(personId)) return ['Nassau · rama walramiana'];
    if(year<1303) return ['Nassau · rama otoniana'];
    if(['ERNSTCASIMIRNASSAU','HENRYCASIMIR1','WILLIAMFREDNASSAU','HENRYCASIMIR2',
      'JOHNWILLIAMFRISO','WILLIAM4ORANGE','WILLIAM5ORANGE'].includes(personId)) return ['Nassau-Dietz'];
    if(['JOHN1DILL','GEORGDILL'].includes(personId)) return ['Nassau-Dillenburg'];
    if(personId==='JOHNLUDWIGHAD') return ['Nassau-Hadamar'];
    if(personId==='JOHN7SIEGEN') return ['Nassau-Siegen'];
    return ['Nassau-Siegen',...(year>=1386&&year<=1606?['Nassau-Dietz']:[])];
  }
  return names;
}
