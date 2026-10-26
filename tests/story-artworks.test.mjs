import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import StoryArtworks from '../src/features/stories/StoryArtworks.jsx';

test('the artwork dialog isolates Atlas keyboard shortcuts, loads on request and returns focus on close',async()=>{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/'}),saved=new Map();
 for(const [key,value]of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true})){saved.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});}
 // jsdom has no modal UI; the browser supplies these two native operations.
 dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
 dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new dom.window.Event('close'));};
 const root=createRoot(dom.window.document.getElementById('root'));
 try{
  await act(async()=>root.render(React.createElement(StoryArtworks,{storyId:'borgona',chapter:14})));
  const trigger=document.querySelector('.story-artwork-trigger'),dialog=document.querySelector('dialog');assert.equal(trigger.textContent,'Ver obra');assert.equal(dialog.querySelector('img'),null);
  await act(async()=>trigger.click());assert(dialog.open);assert.match(dialog.querySelector('img').src,/nancy.webp$/);assert(dialog.querySelector('a[href*="commons.wikimedia.org"]'));
  let atlasShortcuts=0;document.addEventListener('keydown',()=>atlasShortcuts++);
  await act(async()=>dialog.querySelector('button').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(atlasShortcuts,0,'Escape must stay inside the modal instead of leaving the Atlas work view');
  await act(async()=>dialog.close());assert.equal(document.activeElement,trigger);assert.equal(dialog.querySelector('img'),null);
 }finally{await act(async()=>root.unmount());dom.window.close();for(const [key,descriptor]of saved){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});
