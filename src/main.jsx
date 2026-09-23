import React from "react";
import {createRoot,hydrateRoot} from "react-dom/client";
import {readInitialPage} from "./public/staticData.js";
import "./index.css";
import './settings/preferences.css';
import {startSpeedInsights} from "./monitoring.js";
import {applyPreferences,readPreferences} from './settings/preferences.js';

try { applyPreferences(readPreferences(window.localStorage)); } catch { applyPreferences({}); }

if (import.meta.env.PROD) startSpeedInsights();

const root=document.getElementById("root");
const page=readInitialPage(document,window.location);
if(page) {
  import("./public/StaticPublicPage.jsx").then(({default:StaticPublicPage})=>{
    hydrateRoot(root,<React.StrictMode><StaticPublicPage page={page}/></React.StrictMode>);
  });
} else {
  import("./App.jsx").then(({default:App})=>{
    createRoot(root).render(<React.StrictMode><App/></React.StrictMode>);
  });
}
