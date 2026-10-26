// Chapter-linked works: event dates and artwork dates are recorded separately.
export const STORY_ARTWORKS = {
  "nancy": {
    "width": 1300,
    "height": 853,
    "story": "borgona",
    "year": 1477,
    "chapter": 14,
    "artist": "Auguste Feyen-Perrin",
    "date": 1865,
    "collection": "Musée des Beaux-Arts de Nancy",
    "source": "https://commons.wikimedia.org/wiki/File:The-Finding-of-the-body-of-Charles-the-Bold-after-the-Battle-of-Nancy-1865-Found-in-the-collection.jpg",
    "es": {
      "title": "El hallazgo del cuerpo de Carlos el Temerario tras la batalla de Nancy",
      "caption": "Recreación posterior. Feyen-Perrin representa el hallazgo del cuerpo casi cuatro siglos después de la batalla."
    },
    "en": {
      "title": "The finding of the body of Charles the Bold after the Battle of Nancy",
      "caption": "Later reconstruction. Feyen-Perrin depicts the discovery of the body almost four centuries after the battle."
    }
  },
  "crecy": {
    "width": 1800,
    "height": 1175,
    "story": "cien-anos",
    "year": 1346,
    "chapter": 3,
    "artist": "Julian Russell Story",
    "date": 1888,
    "collection": "Telfair Museums",
    "source": "https://commons.wikimedia.org/wiki/File:The_Black_Prince_at_Cr%C3%A9cy.jpg",
    "es": {
      "title": "El Príncipe Negro en Crécy",
      "caption": "Recreación posterior. Story representa a Eduardo de Woodstock ante el cadáver de Juan de Bohemia. La composición pertenece a la pintura de historia del siglo XIX."
    },
    "en": {
      "title": "The Black Prince at Crécy",
      "caption": "Later reconstruction. Story depicts Edward of Woodstock before the body of John of Bohemia. The composition belongs to nineteenth-century history painting."
    }
  }
};
export function chapterArtworks(storyId,chapter){return Object.entries(STORY_ARTWORKS).filter(([,work])=>work.story===storyId&&work.chapter===chapter).map(([id,work])=>({id,...work}));}
