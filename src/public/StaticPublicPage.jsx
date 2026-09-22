import React from 'react';
import EnglishPage from '../english/EnglishPage.jsx';
import StoryPage from '../stories/StoryPage.jsx';
import {PersonPage} from './PublicSite.jsx';
import DynastyPage from './DynastyPage.jsx';
import {TerritoryPage} from './TerritoryPage.jsx';
import '../styles/theme.css';

// Mismo árbol React, mismos datos y mismas condiciones iniciales en Node y cliente.
// Los tres componentes se cargan antes de hidratar: ningún Suspense sustituye la ficha.
export default function StaticPublicPage({page}) {
 if(page.kind==='english')return <EnglishPage page={page}/>;
 const props={slug:page.slug,initialData:page.data};
 if(page.kind==='historia')return <StoryPage {...props} chapter={page.chapter}/>;
 if(page.kind==='persona')return <PersonPage {...props} onExplore={()=>window.location.assign(`${page.path}?atlas=1`)}/>;
 if(page.kind==='dinastia')return <DynastyPage {...props}/>;
 if(page.kind==='territorio')return <TerritoryPage {...props}/>;
 throw new Error(`Ficha estática no soportada: ${page.kind}`);
}
