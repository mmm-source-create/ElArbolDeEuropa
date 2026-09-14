import React from "react";
import {createRoot,hydrateRoot} from "react-dom/client";
import {readInitialPage} from "./public/staticData.js";
import "./index.css";

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
