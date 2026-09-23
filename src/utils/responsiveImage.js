import { IMAGE_VARIANTS } from '../data/imageVariants.js';

export function responsiveImage(src, sizes = '320px') {
  const image = IMAGE_VARIANTS[src];
  if (!image) return { src };
  const preferred = image.variants.find(v => v.width >= 384) || image.variants.at(-1);
  // Only the generated variants are deployed; the original path is a lookup key.
  const variants = image.variants;
  return {
    src: preferred.src,
    srcSet: variants.map(v => `${v.src} ${v.width}w`).join(', '),
    sizes,
    width: image.width,
    height: image.height,
  };
}
