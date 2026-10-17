// Actualizar el head no altera los nodos que React hidrata.
export function ensureMetaTag(selector, attributes) {
  if (typeof document === 'undefined') return null;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

export function setMetaContent(selector, attributes, content) {
  ensureMetaTag(selector, attributes)?.setAttribute('content', content);
}

export function ensureCanonical(href) {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export function setHreflangAlternates(items) {
  if (typeof document === 'undefined') return;
  document.head.querySelectorAll('link[data-eade-hreflang="1"]').forEach(node => node.remove());
  items.filter(item => item?.hreflang && item?.href).forEach(item => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', item.hreflang);
    link.setAttribute('href', item.href);
    link.setAttribute('data-eade-hreflang', '1');
    document.head.appendChild(link);
  });
}
