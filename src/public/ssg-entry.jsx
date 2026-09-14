import React from 'react';
import {renderToString} from 'react-dom/server';
import StaticPublicPage from './StaticPublicPage.jsx';
import {validatePage} from './staticData.js';
import {entityMeta,publicMeta} from './publicMeta.js';
export function renderPage(page,siteUrl) {
 if(!validatePage(page))throw new Error(`Datos iniciales inválidos: ${page?.path}`);
 return {html:renderToString(<React.StrictMode><StaticPublicPage page={page}/></React.StrictMode>),meta:publicMeta(entityMeta(page.kind,page.data,page.slug),siteUrl)};
}
