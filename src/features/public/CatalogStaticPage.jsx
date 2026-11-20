// 6.0.10: static pages for the Spanish home, the Spanish catalogues and the
// A–Z people index in both languages. Same tree on the server and the client.
import {HomePage} from './HomePage.jsx';
import {CatalogPage} from './PublicSite.jsx';
import PeopleIndexPage from './PeopleIndexPage.jsx';
import '../../styles/theme.css';

export default function CatalogStaticPage({page}) {
 if(page.slug==='inicio')return <HomePage prerendered/>;
 if(page.slug==='indice')return <PeopleIndexPage data={page.data} locale="es"/>;
 if(page.slug==='index-en')return <PeopleIndexPage data={page.data} locale="en"/>;
 return <CatalogPage tipo={page.slug} initialData={page.data}/>;
}
