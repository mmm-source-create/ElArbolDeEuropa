// Share-preview images, generated at build time by generate-og-images.mjs.
// A person with a portrait and a house with arms get their own card; every
// other page shares the site card.
export const OG_IMAGE_SIZE = Object.freeze({width: 1200, height: 630});
export const OG_DEFAULT_IMAGE = '/og/eade.jpg';
export const ogPersonaImage = slug => `/og/persona/${slug}.jpg`;
export const ogDynastyImage = slug => `/og/dinastia/${slug}.jpg`;
// A share card shows a CC BY or CC BY-SA shield only with its credit written in.
// The credit lines are pre-rendered by build-og-arms-credits.mjs (no server
// fonts at build time); public-domain and CC0 shields need none.
export const OG_FREE_LICENCE = /^(Dominio público|CC0)/;
// A portrait fills the card's whole panel and leaves no room for a credit, so
// only public-domain portraits become share cards; the rest use the general one.
export const ogPortraitAvailable = image => Boolean(image) && OG_FREE_LICENCE.test(image.derechos || '');
export const ogArmsCreditFile = archivo => `scripts/generate/og-credits/${archivo.split('/').pop().replace(/\.[a-z]+$/i, '')}.png`;
