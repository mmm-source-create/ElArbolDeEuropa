// FNV-1a de 32 bits sobre las unidades UTF-16 del texto: semillas deterministas y colores estables.
export function fnv1a(text) {
  let h = 2166136261;
  const raw = String(text || "");
  for (let i = 0; i < raw.length; i += 1) h = Math.imul(h ^ raw.charCodeAt(i), 16777619);
  return h >>> 0;
}
