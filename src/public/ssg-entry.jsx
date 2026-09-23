import React from 'react';
import {renderToString} from 'react-dom/server';
import StaticPublicPage from './StaticPublicPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import {validatePage} from './staticData.js';
import {entityMeta,publicMeta} from './publicMeta.js';
export function renderPage(page,siteUrl) {
 if(!validatePage(page))throw new Error(`Datos iniciales inválidos: ${page?.path}`);
 return {html:renderToString(<React.StrictMode><StaticPublicPage page={page}/></React.StrictMode>),meta:publicMeta(entityMeta(page.kind,page.data,page.slug),siteUrl)};
}
export function renderNotFound(locale='es',siteUrl) {
 const english=locale==='en',meta=publicMeta({title:english?'Error 404 — This branch does not exist':'Error 404 — Esta rama no existe',description:english?'Page not found in The Tree of Europe.':'Página no encontrada en El Árbol de Europa.',path:english?'/en/404':'/es/404'},siteUrl);
 meta.meta.push(['name','robots','noindex,follow']);
 return {html:renderToString(<React.StrictMode><NotFoundPage locale={locale}/></React.StrictMode>),meta};
}
