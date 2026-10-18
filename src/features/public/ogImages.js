// Share-preview images, generated at build time by generate-og-images.mjs.
// A person with a portrait and a house with arms get their own card; every
// other page shares the site card.
export const OG_IMAGE_SIZE = Object.freeze({width: 1200, height: 630});
export const OG_DEFAULT_IMAGE = '/og/eade.jpg';
export const ogPersonaImage = slug => `/og/persona/${slug}.jpg`;
export const ogDynastyImage = slug => `/og/dinastia/${slug}.jpg`;
