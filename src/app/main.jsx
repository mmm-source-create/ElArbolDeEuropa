import React from "react";
import {createRoot,hydrateRoot} from "react-dom/client";
import {readInitialPage} from "../features/public/staticData.js";
import "../styles/index.css";
// Both editions need the same public layout on a fresh direct visit, before
// any lazy route is loaded. Keep the shared theme ahead of preferences.
import '../features/public/public.css';
import '../styles/theme.css';
import '../features/settings/preferences.css';
import {startSpeedInsights} from "./monitoring.js";
import {applyPreferences,readPreferences} from '../features/settings/preferences.js';

try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); }

for (const query of ['(prefers-color-scheme: dark)','(prefers-reduced-motion: reduce)']) {
  const media=window.matchMedia?.(query);
  const update=()=>{ try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); } };
  if (media?.addEventListener) media.addEventListener('change',update);
  else media?.addListener?.(update);
}

if (import.meta.env.PROD) startSpeedInsights();

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
const page=readInitialPage(document,window.location);
if(page) {
  const loaders={
    english:()=>import('../features/english/EnglishPage.jsx').then(module=>({Component:module.default,props:{page}})),
    historia:()=>import('../features/stories/StoryPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,chapter:page.chapter,initialData:page.data}})),
    persona:()=>import('../features/public/PublicSite.jsx').then(module=>({Component:module.PersonPage,props:{slug:page.slug,initialData:page.data,onExplore:()=>window.location.assign(`${page.path}?atlas=1`)}})),
    dinastia:()=>import('../features/public/DynastyPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,initialData:page.data}})),
    territorio:()=>import('../features/public/TerritoryPage.jsx').then(module=>({Component:module.TerritoryPage,props:{slug:page.slug,initialData:page.data}})),
  };
  loaders[page.kind]?.().then(({Component,props})=>{
    if(Component)hydrateRoot(root,<React.StrictMode><Component {...props}/></React.StrictMode>);
  });
} else {
  import("./App.jsx").then(({default:App})=>{
    createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
  });
}
