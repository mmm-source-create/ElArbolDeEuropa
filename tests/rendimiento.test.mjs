import test from 'node:test';
import assert from 'node:assert/strict';
import { treeViewport, intersectsViewport } from '../src/explorer/treeViewport.js';
import { loadTextAsset, loadJsonAsset } from '../src/utils/loadAsset.js';

test('el árbol conserva los grupos que cruzan el borde al desplazarse y cambiar el zoom', () => {
  const viewport = treeViewport({scrollLeft:1000,scrollTop:400,clientWidth:800,clientHeight:600}, 2, 0);
  assert.deepEqual(viewport, {x:500,y:200,width:400,height:300});
  assert.equal(intersectsViewport({x:480,y:210,width:40,height:70}, viewport), true);
  assert.equal(intersectsViewport({x:901,y:210,width:190,height:70}, viewport), false);
  assert.equal(intersectsViewport({x:500,y:501,width:190,height:70}, viewport), false);
  assert.equal(intersectsViewport({x:900,y:500,width:190,height:70}, viewport), true);
  assert.equal(intersectsViewport({x:10000,y:9000,width:190,height:70}, null), true);
  const buffered = treeViewport({scrollLeft:1000,scrollTop:400,clientWidth:800,clientHeight:600}, 2);
  assert.equal(intersectsViewport({x:950,y:210,width:190,height:70}, buffered), true);
});

test('las descargas simultáneas se comparten y los errores de red, HTTP o JSON permiten reintentar', async t => {
  const responses = [
    () => ({ok:true,text:async()=>'{"ready":true}'}),
    () => { throw new Error('Sin conexión'); },
    () => ({ok:false,status:503}),
    () => ({ok:true,text:async()=>'<html>respuesta incompleta</html>'}),
    () => ({ok:true,text:async()=>'{"ready":true}'}),
  ];
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return responses.shift()(); });
  const pending = loadTextAsset('/test/shared');
  assert.equal(loadTextAsset('/test/shared'), pending);
  assert.equal(await pending, '{"ready":true}');
  assert.equal(await loadTextAsset('/test/shared'), '{"ready":true}');
  assert.equal(calls, 1);
  await assert.rejects(loadJsonAsset('/test/retry'), /Sin conexión/);
  await assert.rejects(loadJsonAsset('/test/retry'), /503/);
  await assert.rejects(loadJsonAsset('/test/retry'), SyntaxError);
  assert.deepEqual(await loadJsonAsset('/test/retry'), {ready:true});
  assert.equal(calls, 5);
});
