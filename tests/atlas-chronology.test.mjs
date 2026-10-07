import assert from 'node:assert/strict';
import test from 'node:test';
import {reviewedLayerLocations, reviewedLayerActive, reviewedLayerEvidence,
  mapLocationsForGovernment} from '../src/data/locationMapPilot.js';
import {politicalMosaicAt} from '../prototypes/euv-locations/location-mosaic.js';

const oldLayer = {name:'Territorio',corridor:'Iberia',versions:[
  {from:1400,ids:['Old_core']},{from:1650,ids:['Last_border']}],temporalExtensions:[{
    periods:[{from:1200,through:1299},{from:1651,through:1800}],
    versions:[{from:1200,ids:['Medieval_core']},{from:1651,ids:[]},
      {from:1700,ids:['New_border']}],
    note:'Transferencia documentada; el núcleo medieval no incluye las conquistas posteriores.',
    sources:[{url:'https://example.org/charter',title:'Documento territorial'}]}]};
const data = {from:1200,through:1800,basePeriod:{from:1400,through:1650},
  territories:[oldLayer],additionalTerritories:[],overrides:[]};

test('chronological expansion uses medieval and eighteenth-century borders instead of the nearest old snapshot',()=>{
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1200),['Medieval_core']);
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1400),['Old_core']);
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1650),['Last_border']);
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1800),['New_border']);
  assert.deepEqual(mapLocationsForGovernment(data,{territorio:'Territorio'},1800),['New_border']);
  assert.equal(politicalMosaicAt(data,1800).byLocation.has('Last_border'),false);
});

test('a missing researched period stays empty and dated additions cannot resurrect an inactive jurisdiction',()=>{
  assert.equal(reviewedLayerActive(data,oldLayer,1300),false);
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1300),[]);
  assert.deepEqual(reviewedLayerLocations(data,oldLayer,1660),[]);
  const expired={name:'Extinguido',active:{from:1400,through:1492},versions:[{from:1400,ids:['A']}]};
  const sample={...data,territories:[expired],overrides:[{territory:'Extinguido',action:'add',id:'A',from:1400,through:1800}]};
  assert.deepEqual(reviewedLayerLocations(sample,expired,1700),[]);
});

test('a new layer has its own coverage and its extension carries the source and scope into the mosaic',()=>{
  const early={name:'Temprano',corridor:'Italia',coverage:{from:1250,through:1500},versions:[{from:1250,ids:['Early_city']}]};
  const sample={...data,additionalTerritories:[early]};
  assert.deepEqual(reviewedLayerLocations(sample,early,1250),['Early_city']);
  assert.deepEqual(reviewedLayerLocations(sample,early,1501),[]);
  assert.equal(politicalMosaicAt(data,1200).layers[0].sources[0].url,'https://example.org/charter');
  assert.match(reviewedLayerEvidence(oldLayer,1200).note,/medieval/);
  assert.deepEqual(reviewedLayerEvidence(oldLayer,1400).sources,[]);
});
