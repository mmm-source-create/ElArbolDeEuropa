import test from 'node:test';
import assert from 'node:assert/strict';
import {clampMapViewBox,fittedMapViewBox,resizeMapViewBox} from '../src/mapViewport.js';

const original={x:0,y:0,width:1000,height:400};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} should equal ${b}`);

test('the outer zoom limit stays on the real map bounds in wide and tall panels',()=>{
 const wide=fittedMapViewBox(original,{width:1200,height:300});
 const tall=fittedMapViewBox(original,{width:400,height:800});
 assert.deepEqual(wide,original);
 assert.deepEqual(tall,original);
});

test('zooming out and panning cannot expose space beyond the map frame',()=>{
 const viewport={width:900,height:450},fit=fittedMapViewBox(original,viewport);
 const maxed=clampMapViewBox({x:9999,y:9999,width:fit.width*4,height:fit.height*4},original,viewport);
 assert.deepEqual(maxed,fit);
 const minZoom=clampMapViewBox({x:0,y:0,width:fit.width/1000,height:fit.height/1000},original,viewport);
 close(minZoom.width,fit.width*0.015);close(minZoom.height,fit.height*0.015);
 const panned=clampMapViewBox({...fit,x:-999,y:999},original,viewport);
 close(panned.x,fit.x);close(panned.y,fit.y);
 const zoomed={x:200,y:80,width:500,height:200};
 const edge=clampMapViewBox({...zoomed,x:9999,y:-9999},original,viewport);
 close(edge.x+edge.width,original.x+original.width);
 close(edge.y,original.y);
});

test('resizing preserves zoom level and re-clamps to the map bounds',()=>{
 const before={width:1000,height:400},after={width:500,height:800};
 const start={x:250,y:100,width:500,height:200};
 const resized=resizeMapViewBox(start,original,before,after);
 const fit=fittedMapViewBox(original,after);
 close(fit.width/resized.width,2);
 close(resized.width/resized.height,original.width/original.height);
 assert.ok(resized.x>=fit.x&&resized.x+resized.width<=fit.x+fit.width);
 assert.ok(resized.y>=fit.y&&resized.y+resized.height<=fit.y+fit.height);
});
