// Compartir la descarga entre montajes; un fallo permite volver a intentarlo.
const textRequests = new Map();
export function forgetTextAsset(url) {
  textRequests.delete(url);
}
export function loadTextAsset(url) {
  if (!textRequests.has(url)) {
    const request = fetch(url).then(response => {
      if (!response.ok) throw new Error(`No se ha podido cargar ${url}: ${response.status}`);
      return response.text();
    }).catch(error => {
      textRequests.delete(url);
      throw error;
    });
    textRequests.set(url, request);
  }
  return textRequests.get(url);
}

export async function loadJsonAsset(url) {
  try {
    return JSON.parse(await loadTextAsset(url));
  } catch (error) {
    forgetTextAsset(url);
    throw error;
  }
}
