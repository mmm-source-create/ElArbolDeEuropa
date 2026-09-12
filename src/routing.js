// Resolución inicial sin dependencias del DOM; los enlaces conservan el contrato público.
function decodificarSlug(slug) { try { return decodeURIComponent(slug); } catch { return slug; } }

function localeDesdePath(pathname) {
  return /^\/en(?:\/|$)/.test(String(pathname || "")) ? "en" : "es";
}

function slugPersonaDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/(?:es\/)?persona\/([^/]+)\/?$/);
  if (!match) return null;
  return decodificarSlug(match[1]);
}

function catalogoDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/es\/(personas|dinastias|territorios|historias)\/?$/);
  return match?.[1] || null;
}

function esRutaDesafio(pathname) {
  return /^\/es\/desafio\/?$/.test(String(pathname || "/"));
}


function infoDesdePath(pathname) {
  const match = String(pathname || "/").match(/^\/es\/(proyecto|fuentes|licencias|agradecimientos)\/?$/);
  return match?.[1] || null;
}

function personaIdLegacyDesdeSearch(search) {
  const params = new URLSearchParams(search || "");
  return params.get("persona") || null;
}

export function resolverRuta(rawPathname = "/", search = "") {
    const pathname = rawPathname === "/"
      ? "/es/"
      : /^\/(persona|dinastia|territorio|historia)(?:\/|$)/.test(rawPathname)
        ? `/es${rawPathname}`
        : rawPathname;
    const params = new URLSearchParams(search);
    const locale = localeDesdePath(pathname);
    if (locale === "en") return { locale, view: "english", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };

    const personSlug = slugPersonaDesdePath(pathname);
    const legacyPersonId = personaIdLegacyDesdeSearch(search);
    const catalog = catalogoDesdePath(pathname);
    const info = infoDesdePath(pathname);
    const atlasRequested = params.get("atlas") === "1";
    const dynastyMatch = pathname.match(/^\/es\/dinastia\/([^/]+)\/?$/);
    if (dynastyMatch && !atlasRequested) return { locale, view: "dynasty", dynastySlug: decodificarSlug(dynastyMatch[1]) };
    const territoryMatch = pathname.match(/^\/es\/territorio\/([^/]+)\/?$/);
    if (territoryMatch && !atlasRequested) return { locale, view: "territory", territorySlug: decodificarSlug(territoryMatch[1]) };
    const panel = params.get("panel") || null;

    if (esRutaDesafio(pathname) || (["/", "/es", "/es/"].includes(pathname) && panel === "desafio")) {
      return { locale, view: "desafio", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };
    }
    if ((personSlug || legacyPersonId) && !atlasRequested) return { locale, view: "person", personSlug, legacyPersonId, catalog: null, info: null, panel: null };
    if (catalog && !atlasRequested) return { locale, view: "catalog", personSlug: null, legacyPersonId: null, catalog, info: null, panel: null };
    if (info && !atlasRequested) return { locale, view: "info", personSlug: null, legacyPersonId: null, catalog: null, info, panel: null };
    if (["/", "/es", "/es/"].includes(pathname) && !atlasRequested && !panel) return { locale, view: "home", personSlug: null, legacyPersonId: null, catalog: null, info: null, panel: null };
    return { locale, view: "explorer", personSlug, legacyPersonId, catalog: null, info: null, panel };
}
