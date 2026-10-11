// Read-only canonical readers. Validate source records with the data
// contract before using these readers; they do not certify historical facts.
function optionalArray(value, field) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new TypeError(`${field} debe ser un array`);
  return value;
}

// IDs only. Public cards contain expanded spouses as well as the explicitly
// recorded IDs. Preserve the existing public fallback when that list is empty.
// Reciprocal relationships belong to the family index, never to this reader.
export function conyugesDe(persona) {
  const declared = optionalArray(persona?.conyugesIds, 'conyugesIds');
  const values = declared.length ? declared : optionalArray(persona?.conyuges, 'conyuges');
  const ids = values.filter(value => value != null && value !== '').map(value => {
    const id = typeof value === 'string' ? value : value?.id;
    if (typeof id !== 'string' || !id) throw new TypeError('Cónyuge sin ID válido');
    return id;
  });
  return [...new Set(ids)];
}

// Return the original array and mandate objects: claims and map caches use identity.
export function gobiernosDe(persona) {
  return optionalArray(persona?.gobiernos, 'gobiernos');
}

// Association, not sovereignty. Never infer mandates or merge their names.
export function territoriosDe(persona) {
  return optionalArray(persona?.reinos, 'reinos');
}

// Keep individual period objects intact, including their documentary notes.
export function intervalosDisputadosDe(gobierno) {
  return optionalArray(gobierno?.controlDisputado, 'controlDisputado');
}
