import React from "react";
import {createRoot,hydrateRoot} from "react-dom/client";
import "../styles/index.css";
// Both editions need the same public layout on a fresh direct visit, before
// any lazy route is loaded. Keep the shared theme ahead of preferences.
import '../features/public/public.css';
import '../styles/theme.css';
import '../features/settings/preferences.css';
import {startAnalytics} from "./monitoring.js";
import {IS_CLOUDFLARE} from "./hosting.js";
import {applyPreferences,readPreferences} from '../features/settings/preferences.js';

try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); }

for (const query of ['(prefers-color-scheme: dark)','(prefers-reduced-motion: reduce)']) {
  const media=window.matchMedia?.(query);
  const update=()=>{ try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); } };
  if (media?.addEventListener) media.addEventListener('change',update);
  else media?.addListener?.(update);
}

if (import.meta.env.PROD && IS_CLOUDFLARE) startAnalytics();

// A new deployment removes the hashed chunks an open tab still references.
// Without a reload, the next lazy view fails and React leaves a blank page.
// Reload once: a reloaded page already has the current HTML, so a failure
// there is a real outage and must not loop.
window.addEventListener('vite:preloadError', event => {
  if (window.performance?.getEntriesByType?.('navigation')[0]?.type === 'reload') return;
  event.preventDefault();
  window.location.reload();
});

const root=document.getElementById("root");
const renderApp=()=>import("./App.jsx").then(({default:App})=>{
  createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
});
const loaders={
  english:page=>import('../features/english/EnglishPage.jsx').then(module=>({Component:module.default,props:{page}})),
  historia:page=>import('../features/stories/StoryPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,chapter:page.chapter,initialData:page.data}})),
  persona:page=>import('../features/public/PublicSite.jsx').then(module=>({Component:module.PersonPage,props:{slug:page.slug,initialData:page.data,onExplore:()=>window.location.assign(`${page.path}?atlas=1`)}})),
  dinastia:page=>import('../features/public/DynastyPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,initialData:page.data}})),
  catalogo:page=>import('../features/public/CatalogStaticPage.jsx').then(module=>({Component:module.default,props:{page}})),
  territorio:page=>import('../features/public/TerritoryPage.jsx').then(module=>({Component:module.TerritoryPage,props:{slug:page.slug,initialData:page.data}})),
};
// 6.3.0: the entry point imports no page module. staticData.js reaches the
// English routes and their data (about 800 KB compressed); it loads with the
// page code, after the page itself (portrait and stylesheet). The static page
// is complete without JavaScript.
const params=new URLSearchParams(window.location.search);
const homePanel=/^\/es\/?$/.test(window.location.pathname)&&(params.has('panel')||params.has('persona'));
const staticPage=Boolean(document.getElementById('eade-initial-page'))&&params.get('atlas')!=='1'&&!homePanel;
if(staticPage) {
  // The full validation of the embedded data comes with its code; an invalid
  // page falls back to the application. The Atlas and the home panels open the
  // application at once, as before.
  const hydrate=()=>import('../features/public/staticData.js').then(({readInitialPage})=>{
    const page=readInitialPage(document,window.location);
    if(!page||!loaders[page.kind])return renderApp();
    return loaders[page.kind](page).then(({Component,props})=>{
      if(Component)hydrateRoot(root,<React.StrictMode><Component {...props}/></React.StrictMode>);
    });
  });
  // 6.3.1: and only after a frame has been painted. On a fast connection the
  // page loads before its first paint, and hydrating at once delayed the
  // portrait by the time the code takes to run.
  const nextFrame=window.requestAnimationFrame?.bind(window)||(callback=>setTimeout(callback,16));
  const afterPaint=()=>nextFrame(()=>setTimeout(hydrate,0));
  if(document.readyState==='complete')afterPaint();
  else window.addEventListener('load',afterPaint,{once:true});
} else renderApp();
