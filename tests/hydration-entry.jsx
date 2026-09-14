import React from 'react';
import {hydrateRoot,createRoot} from 'react-dom/client';
import StaticPublicPage from '../../src/public/StaticPublicPage.jsx';
import DynastyPage from '../../src/public/DynastyPage.jsx';
export {renderPage} from '../../src/public/ssg-entry.jsx';
export function hydratePage(root,page,options) {
 return hydrateRoot(root,<React.StrictMode><StaticPublicPage page={page}/></React.StrictMode>,options);
}
export function mountDynamicDynasty(root,slug) {
 const app=createRoot(root);app.render(<React.StrictMode><DynastyPage slug={slug}/></React.StrictMode>);return app;
}
