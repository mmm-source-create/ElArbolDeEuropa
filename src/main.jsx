import React from "react";
import {createRoot,hydrateRoot} from "react-dom/client";
import {readInitialPage} from "./public/staticData.js";
import "./index.css";
import './settings/preferences.css';
import {startSpeedInsights} from "./monitoring.js";
import {applyPreferences,readPreferences} from './settings/preferences.js';

try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); }

for (const query of ['(prefers-color-scheme: dark)','(prefers-reduced-motion: reduce)']) {
  const media=window.matchMedia?.(query);
  const update=()=>{ try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); } };
  if (media?.addEventListener) media.addEventListener('change',update);
  else media?.addListener?.(update);
}

if (import.meta.env.PROD) startSpeedInsights();

const root=document.getElementById("root");
const page=readInitialPage(document,window.location);
if(page) {
  const loaders={
    english:()=>import('./english/EnglishPage.jsx').then(module=>({Component:module.default,props:{page}})),
    historia:()=>import('./stories/StoryPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,chapter:page.chapter,initialData:page.data}})),
    persona:()=>import('./public/PublicSite.jsx').then(module=>({Component:module.PersonPage,props:{slug:page.slug,initialData:page.data,onExplore:()=>window.location.assign(`${page.path}?atlas=1`)}})),
    dinastia:()=>import('./public/DynastyPage.jsx').then(module=>({Component:module.default,props:{slug:page.slug,initialData:page.data}})),
    territorio:()=>import('./public/TerritoryPage.jsx').then(module=>({Component:module.TerritoryPage,props:{slug:page.slug,initialData:page.data}})),
  };
  loaders[page.kind]?.().then(({Component,props})=>{
    if(Component)hydrateRoot(root,<React.StrictMode><Component {...props}/></React.StrictMode>);
  });
} else {
  import("./App.jsx").then(({default:App})=>{
    createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
  });
}
