// Audit visible land, including SVG cells that have never entered a crosswalk.
// The geometry file stores clipped area in SVG units, not square kilometres.
export function auditSpatialSnapshot(geometry, snapshot) {
  const cells = geometry.cells.filter(cell => cell.visibleArea > 0);
  const assigned = cells.filter(cell => snapshot.byLocation.has(cell.id));
  const unassigned = cells.filter(cell => !snapshot.byLocation.has(cell.id));
  const sum = rows => rows.reduce((total, cell) => total + cell.visibleArea, 0);
  const totalArea = sum(cells), assignedArea = sum(assigned), unassignedArea = sum(unassigned);
  return {year:snapshot.year, visibleCells:cells.length, assignedCells:assigned.length,
    unassignedCells:unassigned.length, visibleArea:totalArea, assignedArea, unassignedArea,
    assignedAreaPercent:totalArea ? 100 * assignedArea / totalArea : 0,
    unassigned:unassigned.map(cell => ({id:cell.id,visibleArea:cell.visibleArea,
      centroid:cell.centroid,bounds:cell.bounds})).sort((a,b) => b.visibleArea-a.visibleArea)};
}

export function auditMapSpatial(geometry, snapshots) {
  const ids = geometry.cells.map(cell => cell.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate spatial cells');
  if (geometry.cells.some(cell => !Number.isFinite(cell.visibleArea) || cell.visibleArea < 0))
    throw new Error('Invalid clipped area');
  return {scope:geometry.scope, bbox:geometry.bbox, method:geometry.method,
    units:'Celdas SVG y área visible en unidades SVG cuadradas; no países ni kilómetros cuadrados.',
    limitations:[
      'El marco de inspección incluye también parte de Anatolia y de Europa oriental. Sus cifras no equivalen a un conteo exclusivo de los Balcanes.',
      'Asignar una celda sólo prueba que tiene una capa cartográfica en ese año. No certifica que todo su contorno ni su autoridad estén revisados.',
      'Los huecos incluyen terreno sin correspondencia previa. Se conservan también los polígonos de relieve: su nombre físico no los excluye del control político.',
    ],cuts:snapshots.map(snapshot => auditSpatialSnapshot(geometry,snapshot)),
    windows:(geometry.windows || []).map(window=>({scope:window.scope,bbox:window.bbox,
      method:window.method, cuts:snapshots.map(snapshot=>auditSpatialSnapshot(window,snapshot))}))};
}
