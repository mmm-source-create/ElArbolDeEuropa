// 6.3.2: miniaturas de las tarjetas de persona desde la tabla de retratos.
// La importan las páginas que muestran personas sin miniatura en sus datos
// (catálogos, casas, páginas en inglés); una ficha trae las suyas.
import {IMAGENES_PERSONAS} from '../../data/imagenesPersonas.js';
import {responsiveImage} from '../../utils/responsiveImage.js';
import {setThumbnailLookup} from './publicShared.jsx';

export function personThumbnail(id) {
  const image = IMAGENES_PERSONAS[id];
  if (!image?.archivo) return null;
  const {sizes, ...responsive} = responsiveImage(image.archivo);
  return {...responsive, position: image.encuadre || image.posicion || '50% 20%'};
}
setThumbnailLookup(personThumbnail);
