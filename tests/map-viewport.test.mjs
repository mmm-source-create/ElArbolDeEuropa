import test from 'node:test';
import assert from 'node:assert/strict';
import {clampMapViewBox,fittedMapViewBox,resizeMapViewBox,zoomMapViewBox} from '../src/mapViewport.js';

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

test('zoom controls change scale and stop at the exact outer and inner bounds',()=>{
 const viewport={width:900,height:450};
 const fit=fittedMapViewBox(original,viewport);
 const zoomed=zoomMapViewBox(fit,0.82,original,viewport);
 close(zoomed.width,fit.width*0.82);
 close(zoomed.height,fit.height*0.82);
 close(zoomed.x+zoomed.width/2,fit.x+fit.width/2);
 close(zoomed.y+zoomed.height/2,fit.y+fit.height/2);
 assert.deepEqual(zoomMapViewBox(fit,1/0.82,original,viewport),fit);
 let zoomedOut=zoomed;
 for(let i=0;i<100;i++) zoomedOut=zoomMapViewBox(zoomedOut,1/0.82,original,viewport);
 assert.deepEqual(zoomedOut,fit);
 let zoomedIn=fit;
 for(let i=0;i<100;i++) zoomedIn=zoomMapViewBox(zoomedIn,0.82,original,viewport);
 close(zoomedIn.width,fit.width*0.015);
 close(zoomedIn.height,fit.height*0.015);
});
