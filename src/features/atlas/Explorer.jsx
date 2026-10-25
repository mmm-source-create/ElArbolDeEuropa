import {atlasFilterOptions,personMatchesTerritory} from '../../domain/filters/atlasFilters.js';
import {buildTimelineRows} from './timelineLayout.js';
import {translatedEquivalent} from '../english/routes.js';
import { familyIndex, familyIds, atlasIdsFromLocation, writeAtlasIds, isolatedPopes, groupIsolatedPopes } from './progressiveAtlas.js';
import { safeStoryReturn, storyPeopleIds, saveStoryProgress } from '../stories/storyModel.js';
import {resolveStoryNavigation, writeStoryNavigation} from './storyNavigation.js';
import EnglishPage from "../english/EnglishPage.jsx";
import "../../styles/app.css";
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import {reinadosActivos} from "../../domain/government/reigns.js";
import { PERSONAS } from "../../data/personas.js";
import { EVENTOS_HISTORICOS, HISTORIAS } from "../../data/historias.js";
import { DEFAULT_LOCALE, SITE, localeDesdePath, t } from "../../app/i18n.js";
import { textoBusquedaPersona } from "../../domain/people/personPresentation.js";
import { OTRAS_DINASTIAS, GRUPOS_DINASTICOS, getCategoriaDinastía } from "../../domain/genealogy/dynasties.js";
import { SIN_FECHA, normalizaTexto, CATEGORIAS_TITULO, FILTROS_RELACION, ACCENTS, PATH_COLOR, TIMELINE_SCALES, TIMELINE_FIXED_COLUMN, categoriasDeTitulo, cumpleFiltroRelacion } from "./atlasModel.js";
import { slugPublico } from "../../domain/people/personLabels.js";
import { rutaEntidadLocalizada, slugPersonaPorLocale, rutaPublicaDesdePath, personaIdDesdeRuta, valorPorSlug } from "./atlasRoutes.js";
import { setMetaContent, ensureCanonical, setHreflangAlternates } from "../public/headMetadata.js";
import { BY_ID, HIJOS_POR_ID, listaAmantes, siglosDePersona, fechasIncompletas, estaVivaEn, listaParejas } from "../../domain/genealogy/relations.js";
import { splitPartnerComponents, computeTreeLayout, routeFamilyConnectors } from "../../domain/genealogy/treeLayout.js";
import {
  ancestorsOf, descendantsOf, conjuntoFoco, buildGraph,
  rutasDeComparacion, computeParentGroups,
} from "../../domain/genealogy/relationshipGraph.js";
import {nRomano, nombrePrincipal, TL_MIN, TL_MAX, inicioEvento, nivelTimelineEvento, anioInicioPersona, anioFinPersona} from "./timelineUtils.js";
import { PersonBox } from "./ExplorerPrimitives.jsx";
import {connectionTree,connectionFromSearch,connectionUrl} from "../connections/connectionTree.js";
import {selectionLayout,selectionEdges,edgePath} from "../connections/selectionLayout.js";
import ExplorerView from "./ExplorerView.jsx";
import { useTreeViewport } from "./useTreeViewport.js";
import { intersectsViewport } from "./treeViewport.js";
import { useVirtualRows } from "./useVirtualRows.js";
import { useViewportTask } from "./useViewportTask.js";
import { centeredScroll } from "./virtualRows.js";
import { readAtlasSession, shouldResumeAtlas } from "./atlasSession.js";
import { useAtlasSession } from "./useAtlasSession.js";
import { useAtlasLayout } from "./useAtlasLayout.js";
import { useFavorites } from "./useFavorites.js";
import { useShareStatus } from "./useShareStatus.js";
import { useDragScroll } from "./useDragScroll.js";
import { hasDocumentedClaim } from "../../evidence/claims.js";

const SEARCH_TEXT_BY_ID = Object.fromEntries(PERSONAS.map(persona => [persona.id, normalizaTexto([textoBusquedaPersona(persona), nombrePrincipal(persona)].join(" "))]));

export default function Explorer({ initialPanel = null, treeBase: TREE_BASE, loading = false, loadError = false, onRetry, ready = true }) {
  const familyData = useMemo(() => familyIndex(PERSONAS), []);
  const isolatedPopeIds = useMemo(() => isolatedPopes(familyData), [familyData]);
  const [savedSession] = useState(() => {
    try { return shouldResumeAtlas(window.location.href) ? readAtlasSession(window.sessionStorage) : null; }
    catch { return null; }
  });
  const [atlasIds, setAtlasIds] = useState(() => savedSession ? (savedSession.atlasIds ?? null) : atlasIdsFromLocation(window.location.pathname, window.location.search, familyData));
  const atlasSet = useMemo(() => atlasIds === null ? null : new Set(atlasIds), [atlasIds]);
  const [atlasUndo, setAtlasUndo] = useState([]);
  const [storyReturn, setStoryReturn] = useState(() => savedSession?.storyReturn || safeStoryReturn(window.location.search));
  const restoringSession = useRef(Boolean(savedSession));
  const initialSearchSignature = useRef(undefined);
  const mapViewportRef = useRef(savedSession?.mapViewport || null);
  const recordMapViewport = useCallback(viewport => { mapViewportRef.current = viewport; }, []);
  const scrollRef = useRef(null);
  const tlScrollRef = useRef(null);
  const timelineListRef = useRef(null);
  // The English homepage can launch the bilingual guide inside the Atlas.
  // Keep this entry flag while practice actions update the URL.
  const [tutorialEntry] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tutorial") === "1");
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    return localeDesdePath(window.location.pathname);
  });
  const [query, setQuery] = useState(savedSession?.query ?? "");
  const [territorialFilterMode,setTerritorialFilterMode]=useState(savedSession?.territorialFilterMode||'associated');
  const [territorios, setTerritorios] = useState(savedSession?.territorios ?? []);
  const [dinastias, setDinastias] = useState(savedSession?.dinastias ?? []);
  const [dinastiasExpandidas, setDinastiasExpandidas] = useState(savedSession?.dinastiasExpandidas ?? []);
  const [territoriosExpandidos, setTerritoriosExpandidos] = useState(savedSession?.territoriosExpandidos ?? []);
  const [titulos, setTitulos] = useState(savedSession?.titulos ?? []);
  const [siglos, setSiglos] = useState(savedSession?.siglos ?? []);
  const [relaciones, setRelaciones] = useState(savedSession?.relaciones ?? []);
  const [hovered, setHovered] = useState(null);
  const [seleccion, setSeleccion] = useState(() => BY_ID[savedSession?.selectedId]
    || BY_ID[new URLSearchParams(window.location.search).get('persona')] || null);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(savedSession?.currentSearchIndex ?? -1);
  const [zoom, setZoom] = useState(savedSession?.zoom ?? 0.8);
  const [mode, setMode] = useState(savedSession?.mode ?? "view");
  const [connectionIds, setConnectionIds] = useState(() => (savedSession?.connectionIds || []).filter(id => BY_ID[id]));
  const [connectionCriterion, setConnectionCriterion] = useState(savedSession?.connectionCriterion || "matrimonio");
  const [origen, setOrigen] = useState(savedSession?.origen ?? null);
  const [destino, setDestino] = useState(savedSession?.destino ?? null);
  const [modoComparacion] = useState(savedSession?.modoComparacion ?? "corto");
  const [compareMenuOpen, setCompareMenuOpen] = useState(false);
  const [compareRouteIndex, setCompareRouteIndex] = useState(0);
  const [focoMenuOpen, setFocoMenuOpen] = useState(false);
  const [focoId, setFocoId] = useState(savedSession?.focoId ?? null);
  const [focoAlcance, setFocoAlcance] = useState(savedSession?.focoAlcance ?? "cercana");
  const [anioGlobal, setAnioGlobal] = useState(() => {
    if (savedSession?.anioGlobal != null) return savedSession.anioGlobal;
    const value = new URLSearchParams(window.location.search).get('anio');
    const year = value ? Number(value) : null;
    return Number.isInteger(year) && year >= 0 && year <= 3000 ? year : (initialPanel === "europa" || new URLSearchParams(window.location.search).get("escena") === "europa" ? 1500 : null);
  });
  const [anioInput, setAnioInput] = useState(anioGlobal != null ? String(anioGlobal) : "");
  const [reproduciendoHistoria, setReproduciendoHistoria] = useState(false);

  const [shareStatus, mostrarEstadoCompartir] = useShareStatus();
  const [collapsedIds, setCollapsedIds] = useState(savedSession?.collapsedIds ?? []);
  const [vistasActivas, setVistasActivas] = useState(() => savedSession?.vistasActivas ?? {
    arbol: true,
    mapa: typeof window !== 'undefined' && !window.matchMedia('(max-width: 700px)').matches,
  });
  const { panelesVisibles, filterSectionsOpen, bioSectionsOpen, alternarPanelAuxiliar, alternarSeccionFiltro, alternarSeccionBio } = useAtlasLayout(savedSession, atlasIds);
  const [atlasExpansionFeedback, setAtlasExpansionFeedback] = useState(null);
  const [personHistory, setPersonHistory] = useState(savedSession?.personHistory ?? { ids: [], index: -1 });
  const [modoTrabajo, setModoTrabajo] = useState(false);
  const [infoProyecto, setInfoProyecto] = useState(initialPanel === "europa" ? null : initialPanel);
  const [atlasScene,setAtlasScene] = useState(()=>new URLSearchParams(window.location.search).get("escena") === "europa" || initialPanel === "europa" ? "europa" : savedSession?.atlasScene || "atlas");
  const [timelineScaleIndex, setTimelineScaleIndex] = useState(Math.min(TIMELINE_SCALES.length - 1, savedSession?.timelineScaleIndex ?? 1));
  const [timelineMode, setTimelineMode] = useState(savedSession?.timelineMode ?? "ambos");
  const [eventoSeleccionadoId, setEventoSeleccionadoId] = useState(savedSession?.eventoSeleccionadoId ?? null);
  const { favoritos, setFavoritos, favoritosSet, alternarFavorito } = useFavorites();
  const [favoritosOpen, setFavoritosOpen] = useState(false);
  const [soloFavoritos, setSoloFavoritos] = useState(savedSession?.soloFavoritos ?? false);
  const [soloDocumentados, setSoloDocumentados] = useState(savedSession?.soloDocumentados ?? false);
  const storyActionsRef = useRef(null);
  const [historiaActivaId, setHistoriaActivaId] = useState(savedSession?.historiaActivaId ?? null);
  const [historiaPasoIndex, setHistoriaPasoIndex] = useState(savedSession?.historiaPasoIndex ?? 0);
  const compareMenuRef = useRef(null);
  const focoMenuRef = useRef(null);
  const favoritosMenuRef = useRef(null);
  const historiaSnapshotRef = useRef(savedSession?.historiaSnapshot || null);
  const urlStateLoadedRef = useRef(Boolean(savedSession && !savedSession.historiaActivaId));
  const historyPopRef = useRef(false);

  useEffect(() => {
    if (!modoTrabajo || typeof document === "undefined") return undefined;
    document.body.classList.add("atlas-work-mode-active");
    const salirConEscape = (event) => {
      if (event.key === "Escape" && !infoProyecto) setModoTrabajo(false);
    };
    document.addEventListener("keydown", salirConEscape);
    return () => {
      document.body.classList.remove("atlas-work-mode-active");
      document.removeEventListener("keydown", salirConEscape);
    };
  }, [modoTrabajo, infoProyecto]);

  // La geometría base se calcula durante el prebuild/deployment.
  // Solo las vistas filtradas necesitan recalcular layout en el navegador.
  const gen = TREE_BASE.gen;
  const rows = TREE_BASE.rows;
  const graph = useMemo(() => buildGraph(PERSONAS), []);
  const connectionResult = useMemo(() => connectionTree(graph, connectionIds, connectionCriterion), [graph, connectionIds, connectionCriterion]);
  const connectionSet = useMemo(() => mode === "conexion" && connectionIds.length >= 2 ? new Set(connectionResult.ids) : null, [mode, connectionResult, connectionIds.length]);
  const timelinePxPerYear = TIMELINE_SCALES[timelineScaleIndex];
  const timelineTrackWidth = Math.max(1180, Math.round((TL_MAX - TL_MIN) * timelinePxPerYear));
  const eventosOrdenadosTodos = useMemo(() => EVENTOS_HISTORICOS.slice().sort((a, b) => inicioEvento(a) - inicioEvento(b) || a.titulo.localeCompare(b.titulo, "es")), []);
  // Los hitos puramente narrativos de una Historia no forman parte de la cronología
  // general. Reaparecen automáticamente cuando ese paso de Historia está activo.
  const eventosOrdenados = useMemo(() => eventosOrdenadosTodos.filter((evento) => {
    const nivel = nivelTimelineEvento(evento);
    return nivel !== "historia" || evento.id === eventoSeleccionadoId;
  }), [eventosOrdenadosTodos, eventoSeleccionadoId]);

  const eventoSeleccionado = eventosOrdenadosTodos.find((evento) => evento.id === eventoSeleccionadoId) || null;
  const historiaActiva = HISTORIAS.find((historia) => historia.id === historiaActivaId) || null;
  const historiaPasoActual = historiaActiva?.pasos?.[historiaPasoIndex] || null;
  const historiaPersonasSet = useMemo(() => new Set(historiaPasoActual?.personas || (historiaPasoActual?.persona ? [historiaPasoActual.persona] : [])), [historiaPasoActual]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const isEnglish = locale === "en";
    document.documentElement.lang = isEnglish ? "en" : "es";

    const personaNombre = seleccion ? (nombrePrincipal(seleccion) || seleccion.nombre) : "";
    const dinastiaUnica = !personaNombre && !historiaActiva && dinastias.length === 1 ? dinastias[0] : "";
    const territorioUnico = !personaNombre && !historiaActiva && !dinastiaUnica && territorios.length === 1 ? territorios[0] : "";

    const pageTitle = isEnglish
      ? "The Tree of Europe | Interactive historical and genealogical atlas"
      : atlasScene === "europa"
        ? `Europa en ${anioGlobal ?? 1500} — ${SITE.name}`
      : personaNombre
        ? t("share.personTitle", { name: personaNombre })
        : historiaActiva?.titulo
          ? `${historiaActiva.titulo} — ${SITE.name}`
          : dinastiaUnica
            ? `${dinastiaUnica} — ${SITE.name}`
            : territorioUnico
              ? `${territorioUnico} — ${SITE.name}`
              : t("meta.defaultTitle");

    const description = isEnglish
      ? "Explore the families, dynasties, reigns and political connections that shaped Europe between 1200 and 1800."
      : atlasScene === "europa"
        ? `Mapa político, acontecimientos, protagonistas y gobiernos de Europa en ${anioGlobal ?? 1500}.`
      : personaNombre
        ? `Explora a ${personaNombre}: parentescos, cronología, reinados y territorios en ${SITE.name}.`
        : historiaActiva?.descripcion
          || (dinastiaUnica ? `Explora la dinastía ${dinastiaUnica} en ${SITE.name}.` : "")
          || (territorioUnico ? `Explora las personas, reinados y conexiones históricas de ${territorioUnico} en ${SITE.name}.` : "")
          || t("meta.defaultDescription");

    const canonicalBase = SITE.publicUrl || window.location.origin;
    let canonicalPath = isEnglish ? "/en/" : "/es/";
    if (!isEnglish) {
      canonicalPath = seleccion
        ? rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"))
        : historiaActiva
          ? rutaEntidadLocalizada("es", "historia", slugPublico(historiaActiva.titulo))
          : dinastiaUnica
            ? rutaEntidadLocalizada("es", "dinastia", slugPublico(dinastiaUnica))
            : territorioUnico
              ? rutaEntidadLocalizada("es", "territorio", slugPublico(territorioUnico))
              : "/es/";
    }
    if(atlasScene === "europa"&&!isEnglish)canonicalPath=`/es/?atlas=1&escena=europa&anio=${anioGlobal ?? 1500}`;
    const canonicalUrl = new URL(canonicalPath, canonicalBase).toString();

    document.title = pageTitle;
    setMetaContent('meta[name="description"]', { name: "description" }, description);
    setMetaContent('meta[property="og:site_name"]', { property: "og:site_name" }, isEnglish ? "The Tree of Europe" : SITE.name);
    setMetaContent('meta[property="og:title"]', { property: "og:title" }, pageTitle);
    setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
    setMetaContent('meta[property="og:type"]', { property: "og:type" }, "website");
    setMetaContent('meta[property="og:locale"]', { property: "og:locale" }, isEnglish ? "en_GB" : "es_ES");
    setMetaContent('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMetaContent('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
    setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    ensureCanonical(canonicalUrl);

    const esPath = atlasScene === "europa" ? canonicalPath : seleccion
      ? rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"))
      : "/es/";
    const enPersonSlug = atlasScene !== "europa" && seleccion ? slugPersonaPorLocale(seleccion, "en") : null;
    const alternates = [
      { hreflang: "es", href: new URL(esPath, canonicalBase).toString() },
      { hreflang: "x-default", href: new URL(esPath, canonicalBase).toString() },
    ];
    if (isEnglish || (!seleccion && !historiaActiva && !dinastiaUnica && !territorioUnico)) {
      alternates.push({ hreflang: "en", href: new URL("/en/", canonicalBase).toString() });
    } else if (enPersonSlug) {
      alternates.push({ hreflang: "en", href: new URL(rutaEntidadLocalizada("en", "persona", enPersonSlug), canonicalBase).toString() });
    }
    setHreflangAlternates(alternates);
  }, [locale, seleccion, historiaActiva, dinastias, territorios, atlasScene, anioGlobal]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const normalizarRuta = () => {
      const { pathname, search, hash } = window.location;
      const prefijo = pathname.match(/^\/(es|en)(?=\/|$)/);
      if (prefijo) {
        setLocale(prefijo[1]);
        return;
      }

      // Compatibilidad con los enlaces antiguos: /persona/..., /historia/...
      // pasan a su equivalente /es/... sin recargar la SPA.
      const legacy = rutaPublicaDesdePath(pathname);
      let nuevaRuta = "/es/";
      if (legacy?.tipo && legacy?.slug) {
        nuevaRuta = rutaEntidadLocalizada("es", legacy.tipo, legacy.slug);
      } else if (pathname && pathname !== "/") {
        nuevaRuta = `/es${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
      }
      window.history.replaceState(window.history.state, "", `${nuevaRuta}${search}${hash}`);
      setLocale("es");
    };

    normalizarRuta();
    window.addEventListener("popstate", normalizarRuta);
    return () => window.removeEventListener("popstate", normalizarRuta);
  }, []);

  useEffect(() => {
    if (!compareMenuOpen) return undefined;
    const cerrarFuera = (event) => {
      if (!compareMenuRef.current?.contains(event.target)) setCompareMenuOpen(false);
    };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [compareMenuOpen]);

  useEffect(() => {
    if (!focoMenuOpen) return undefined;
    const cerrarFuera = (event) => {
      if (!focoMenuRef.current?.contains(event.target)) setFocoMenuOpen(false);
    };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [focoMenuOpen]);

  useEffect(() => {
    if (!favoritosOpen) return undefined;
    const cerrarFuera = (event) => {
      if (!favoritosMenuRef.current?.contains(event.target)) setFavoritosOpen(false);
    };
    document.addEventListener("pointerdown", cerrarFuera);
    return () => document.removeEventListener("pointerdown", cerrarFuera);
  }, [favoritosOpen]);

  useEffect(() => {
    if (!favoritos.length && soloFavoritos) setSoloFavoritos(false);
  }, [favoritos, soloFavoritos]);

  useEffect(() => {
    if (!infoProyecto || typeof document === "undefined") return undefined;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const cerrarConEscape = (event) => {
      if (event.key === "Escape") setInfoProyecto(null);
    };
    document.addEventListener("keydown", cerrarConEscape);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [infoProyecto]);

  const opciones = useMemo(() => {
    const filterHierarchy=atlasFilterOptions(PERSONAS);
    const uniq=arr=>[...new Set(arr)];
    const siglosDisponibles = uniq(PERSONAS.flatMap(siglosDePersona)).sort((a, b) => a - b);
    const hayPersonasSinFecha = PERSONAS.some(fechasIncompletas);

    return {
      ...filterHierarchy,
      titulos: CATEGORIAS_TITULO.filter((categoria) => PERSONAS.some((persona) => categoria.test(normalizaTexto(persona.titulo)))),
      siglos: siglosDisponibles,
      hayPersonasSinFecha,
      relaciones: FILTROS_RELACION,
    };
  }, []);

  const personaBio = hovered ? BY_ID[hovered] : seleccion;

  const toggle = (setter, arr, v) => setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const focoSet = useMemo(() => {
    if (mode !== "foco" || !focoId) return null;
    return conjuntoFoco(focoId, focoAlcance);
  }, [mode, focoId, focoAlcance]);

  useEffect(() => {
    if (mode === 'foco' && focoId) centerOn(focoId);
  }, [mode, focoId, focoAlcance]);

  const collapsedSet = useMemo(() => new Set(collapsedIds), [collapsedIds]);
  const hiddenByCollapse = useMemo(() => {
    const ocultos = new Set();
    collapsedIds.forEach((rootId) => {
      const descendientes = descendantsOf(rootId);
      descendientes.delete(rootId);
      descendientes.forEach((id) => ocultos.add(id));

      // Los cónyuges y amantes de una persona ocultada forman parte visual de
      // esa rama, pero no propagamos el cierre hacia sus familias de origen.
      const antepasadosRaiz = ancestorsOf(rootId);
      descendientes.forEach((id) => {
        listaParejas(BY_ID[id]).forEach((partnerId) => {
          if (partnerId !== rootId && !antepasadosRaiz.has(partnerId)) ocultos.add(partnerId);
        });
      });
    });
    return ocultos;
  }, [collapsedIds]);

  const toggleDescendants = useCallback((id) => {
    setCollapsedIds((actuales) =>
      actuales.includes(id) ? actuales.filter((actual) => actual !== id) : [...actuales, id]
    );
  }, []);

  const ajustarAnio = useCallback((valor) => {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return null;
    return Math.max(TL_MIN, Math.min(TL_MAX, Math.round(numero)));
  }, []);

  const actualizarAnioDesdeRango = useCallback((valor) => {
    const ajustado = ajustarAnio(valor);
    if (!Number.isFinite(ajustado)) return;
    setReproduciendoHistoria(false);
    setAnioGlobal(ajustado);
    setAnioInput(String(ajustado));
  }, [ajustarAnio]);

  const confirmarAnioEscrito = useCallback(() => {
    setReproduciendoHistoria(false);
    const limpio = anioInput.trim();
    if (!limpio) {
      setAnioGlobal(null);
      setAnioInput("");
      return;
    }
    const ajustado = ajustarAnio(limpio);
    if (!Number.isFinite(ajustado)) {
      setAnioInput(Number.isFinite(anioGlobal) ? String(anioGlobal) : "");
      return;
    }
    setAnioGlobal(ajustado);
    setAnioInput(String(ajustado));
  }, [ajustarAnio, anioGlobal, anioInput]);

  const restablecerAnio = useCallback(() => {
    setReproduciendoHistoria(false);
    setAnioGlobal(null);
    setAnioInput("");
  }, []);

  const moverAnioHistoria = useCallback((delta) => {
    setReproduciendoHistoria(false);
    setAnioGlobal((actual) => {
      const base = Number.isFinite(actual)
        ? actual
        : (delta >= 0 ? TL_MIN - delta : TL_MAX - delta);
      const siguiente = Math.max(TL_MIN, Math.min(TL_MAX, base + delta));
      setAnioInput(String(siguiente));
      return siguiente;
    });
  }, []);

  const alternarReproduccionHistoria = useCallback(() => {
    setReproduciendoHistoria((actual) => {
      if (!actual && (!Number.isFinite(anioGlobal) || anioGlobal >= TL_MAX)) {
        setAnioGlobal(TL_MIN);
        setAnioInput(String(TL_MIN));
      }
      return !actual;
    });
  }, [anioGlobal]);

  useEffect(() => {
    if (!reproduciendoHistoria) return undefined;
    const timer = window.setInterval(() => {
      setAnioGlobal((actual) => {
        const base = Number.isFinite(actual) ? actual : TL_MIN;
        const siguiente = Math.min(TL_MAX, base + 1);
        setAnioInput(String(siguiente));
        if (siguiente >= TL_MAX) {
          window.setTimeout(() => setReproduciendoHistoria(false), 0);
        }
        return siguiente;
      });
    }, 500);
    return () => window.clearInterval(timer);
  }, [reproduciendoHistoria]);

  const mostrarArbol = vistasActivas.arbol;
  const mostrarMapa = vistasActivas.mapa;
  const mostrarFiltros = panelesVisibles.filtros;
  const mostrarBiografia = panelesVisibles.biografia;
  const mostrarCronologia = panelesVisibles.cronologia;
  const vistaPrincipal = mostrarArbol && mostrarMapa ? "ambos" : (mostrarArbol ? "arbol" : "mapa");
  const layoutLaterales = mostrarFiltros && mostrarBiografia
    ? "workspace-layout-both"
    : mostrarFiltros
      ? "workspace-layout-left"
      : mostrarBiografia
        ? "workspace-layout-right"
        : "workspace-layout-center";

  const personasVivasEnAnio = useMemo(() =>
    Number.isFinite(anioGlobal) ? PERSONAS.filter((persona) => estaVivaEn(persona, anioGlobal)) : [],
  [anioGlobal]);
  const gobernantesActivosEnAnio = useMemo(() =>
    Number.isFinite(anioGlobal)
      ? PERSONAS.filter((persona) => reinadosActivos(persona, anioGlobal, { soloEfectivos: true }).length > 0)
      : [],
  [anioGlobal]);

  // Los filtros distintos se combinan con AND. Dentro de un mismo grupo
  // (varios territorios, dinastías, categorías, siglos o relaciones) se usa
  // OR, que suele ser el comportamiento más útil al explorar una genealogía.
  const matches = (persona) => {
    if (!persona) return false;
    if (soloDocumentados && !documentedPeopleSet.has(persona.id)) return false;
    if (connectionSet) return connectionSet.has(persona.id);
    if (!focoSet && atlasSet && !atlasSet.has(persona.id)) return false;
    if (!focoSet && hiddenByCollapse.has(persona.id)) return false;
    if (focoSet && !focoSet.has(persona.id)) return false;
    if (soloFavoritos && !favoritosSet.has(persona.id)) return false;

    if (territorios.length) {
      const coincideTerritorio = territorios.some(filtro=>personMatchesTerritory(persona,filtro,anioGlobal,territorialFilterMode==='government'));
      if (!coincideTerritorio) return false;
    }

    if (dinastias.length) {
      const coincideDinastia = dinastias.some((filtro) => {
        if (filtro === persona.dinastia) return true;
        if (filtro === OTRAS_DINASTIAS) return opciones.otrasDinastias.has(persona.dinastia);
        return (GRUPOS_DINASTICOS[filtro] || []).includes(persona.dinastia);
      });
      if (!coincideDinastia) return false;
    }

    if (titulos.length) {
      const categorias = categoriasDeTitulo(persona);
      if (!titulos.some((categoria) => categorias.includes(categoria))) return false;
    }

    if (siglos.length) {
      const siglosPersona = siglosDePersona(persona);
      const coincidePeriodo = siglos.some((filtro) =>
        filtro === SIN_FECHA ? fechasIncompletas(persona) : siglosPersona.includes(filtro)
      );
      if (!coincidePeriodo) return false;
    }

    if (relaciones.length && !relaciones.some((filtro) => cumpleFiltroRelacion(persona, filtro))) return false;
    return true;
  };

  const documentedPeopleSet = useMemo(() => soloDocumentados
    ? new Set(PERSONAS.filter(hasDocumentedClaim).map(person => person.id)) : null, [soloDocumentados]);
  const visiblePeople = useMemo(() => PERSONAS.filter(matches), [atlasSet, connectionSet, hiddenByCollapse, focoSet, soloFavoritos, favoritosSet, soloDocumentados, documentedPeopleSet, territorios, dinastias, titulos, siglos, relaciones, opciones.otrasDinastias,anioGlobal,territorialFilterMode]);
  const timelinePeople=atlasScene==='europa'?PERSONAS:visiblePeople;
  const timelineRows = useMemo(()=>timelineMode === 'eventos' ? [] : buildTimelineRows(timelinePeople,timelinePxPerYear),[timelinePeople,timelinePxPerYear,timelineMode]);
  const timelineVirtual = useVirtualRows(timelineRows, tlScrollRef, timelineListRef, mostrarCronologia);
  // A packed lane can contain several people; all retain their own navigation anchor.
  for(const row of timelineVirtual.items) for(const entry of row.people || []) timelineVirtual.byKey.set(`person:${entry.person.id}`,row);
  const visibleIds = visiblePeople.map((persona) => persona.id);
  const visibleSignature = visibleIds.join("|");
  const visibleRows = useMemo(() => {
    const visible = new Set(visibleIds);
    return rows.map((row) =>
      row.flatMap((unit) => {
        const visibleIdsEnUnidad = unit.filter((id) => visible.has(id));
        return splitPartnerComponents(visibleIdsEnUnidad, BY_ID);
      })
    );
    // La firma contiene exactamente los IDs visibles y mantiene el layout
    // estable cuando solo cambia el texto de búsqueda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, visibleSignature]);
  const treeLayout = useMemo(() => {
    if (connectionSet) return selectionLayout(connectionResult.ids, gen, BY_ID, connectionResult.edges);
    const layout = visiblePeople.length === PERSONAS.length ? TREE_BASE.layout : computeTreeLayout(visibleRows, BY_ID, HIJOS_POR_ID);
    return groupIsolatedPopes(layout, [...isolatedPopeIds], BY_ID);
  }, [visibleRows, visiblePeople.length, connectionSet, connectionResult, gen, TREE_BASE.layout]);
  const positions = treeLayout.positions;
  const treeViewport = useTreeViewport(scrollRef, zoom, mostrarArbol);
  const renderedTreeUnits = useMemo(() => treeLayout.units.filter(unit => intersectsViewport(unit, treeViewport)), [treeLayout.units, treeViewport]);
  const canvasSize = { w: treeLayout.width, h: treeLayout.height };

  const queueViewport = useViewportTask((task, secondPass) => {
    const tree = scrollRef.current, timeline = tlScrollRef.current, list = timelineListRef.current;
    const previousTimeline = timeline && { left: timeline.scrollLeft, top: timeline.scrollTop };
    if (task.treeId && tree && positions[task.treeId] && !secondPass) {
      const reader = historiaActiva && document.querySelector('.story-atlas-guide');
      const box = tree.getBoundingClientRect(), overlay = reader?.getBoundingClientRect();
      const overlaps = overlay && overlay.left < box.right && overlay.right > box.left;
      const visibleHeight = historiaActiva ? Math.max(120,Math.min(tree.clientHeight,window.innerHeight-box.top,overlaps?overlay.top-box.top-12:Infinity)) : tree.clientHeight;
      tree.scrollTo({ ...centeredScroll(positions[task.treeId], zoom, {clientWidth:tree.clientWidth,clientHeight:visibleHeight}), behavior: "smooth" });
    }
    if (task.treeCenter && tree && !secondPass) {
      tree.scrollTo({ left: task.treeCenter.x * zoom - tree.clientWidth / 2, top: task.treeCenter.y * zoom - tree.clientHeight / 2, behavior: "instant" });
    }
    if (task.timelineScroll && timeline) {
      const anchor = timelineVirtual.byKey.get(task.timelineAnchor?.key);
      timeline.scrollTo({ ...task.timelineScroll, ...(anchor && list ? { top: list.offsetTop + anchor.start + task.timelineAnchor.offset } : {}), behavior: "instant" });
    }
    const row = task.timelineId && timelineVirtual.byKey.get(`person:${task.timelineId}`);
    const person = task.timelineId && BY_ID[task.timelineId];
    const start = anioInicioPersona(person), end = anioFinPersona(person);
    const year = Number.isFinite(task.timelineYear) ? task.timelineYear : Number.isFinite(start) ? (start + (end ?? start)) / 2 : null;
    if (timeline && (row || Number.isFinite(year))) {
      const left = Number.isFinite(year)
        ? TIMELINE_FIXED_COLUMN + (year - TL_MIN) * timelinePxPerYear - (timeline.clientWidth + TIMELINE_FIXED_COLUMN) / 2
        : timeline.scrollLeft;
      timeline.scrollTo({ left: Math.max(0, left), top: row && list ? list.offsetTop + row.start + row.size / 2 - timeline.clientHeight / 2 : timeline.scrollTop, behavior: "instant" });
    }
    return timeline && (Math.abs(timeline.scrollTop - previousTimeline.top) > 0.5 || Math.abs(timeline.scrollLeft - previousTimeline.left) > 0.5);
  }, task => JSON.stringify([
    zoom, positions[task.treeId], timelineVirtual.byKey.get(`person:${task.timelineId}`)?.start,
    timelineVirtual.byKey.get(`person:${task.timelineId}`)?.size, timelineVirtual.total,
    timelinePxPerYear, timelineListRef.current?.offsetTop,
    ...[scrollRef, tlScrollRef].flatMap(ref => [ref.current?.clientWidth, ref.current?.clientHeight, ref.current?.scrollHeight]),
  ]), [scrollRef, tlScrollRef]);

  useAtlasSession({
    ...savedSession, ready, atlasIds, query, territorios, territorialFilterMode, dinastias, titulos, siglos, relaciones, collapsedIds,
    dinastiasExpandidas, territoriosExpandidos, selectedId: seleccion?.id || null,
    currentSearchIndex, zoom, mode, connectionIds, connectionCriterion, origen, destino, modoComparacion, focoId, focoAlcance,
    anioGlobal, atlasScene, vistasActivas, panelesVisibles, personHistory, timelineScaleIndex, timelineMode,
    eventoSeleccionadoId, soloFavoritos, soloDocumentados, historiaActivaId, historiaPasoIndex, storyReturn, historiaSnapshot: historiaSnapshotRef.current,
  }, scrollRef, tlScrollRef, () => {
    const top = tlScrollRef.current && timelineListRef.current ? tlScrollRef.current.scrollTop - timelineListRef.current.offsetTop : null;
    const anchor = top !== null && timelineVirtual.items.find(row => row.start + row.size >= top);
    return { mapViewport: mapViewportRef.current, ...(anchor ? { timelineAnchor: { key: anchor.key, offset: top - anchor.start } } : {}) };
  });
  useLayoutEffect(() => {
    if (!ready || !restoringSession.current || !savedSession) return;
    restoringSession.current = false;
    queueViewport({ treeCenter: savedSession.treeCenter, timelineScroll: savedSession.timelineScroll, timelineAnchor: savedSession.timelineAnchor });
  }, [savedSession, queueViewport, ready]);

  // Coincidencias del buscador: solo entre las personas que ya son visibles
  // según los filtros de chips (si una persona está oculta por un filtro,
  // no tiene sentido "encontrarla" con el buscador).
  const queryTrim = normalizaTexto(query);
  const searchMatchIds = useMemo(() => {
    if (!queryTrim) return [];
    return PERSONAS.filter((persona) => {
      return SEARCH_TEXT_BY_ID[persona.id].includes(queryTrim);
    }).map((persona) => persona.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTrim]);
  const searchMatchSet = useMemo(() => new Set(searchMatchIds), [searchMatchIds]);
  const searchSignature = searchMatchIds.join("|");
  const searchCurrentId = searchMatchIds.length ? searchMatchIds[((currentSearchIndex % searchMatchIds.length) + searchMatchIds.length) % searchMatchIds.length] : null;

  // La búsqueda del Atlas incluye otros tipos de contenido. El árbol solo se
  // desplaza cuando la persona se elige expresamente en los resultados.
  useEffect(() => {
    const signature = `${queryTrim}|${searchSignature}`;
    if (savedSession && initialSearchSignature.current === undefined) initialSearchSignature.current = signature;
    if (initialSearchSignature.current === signature) return;
    initialSearchSignature.current = null;
    setCurrentSearchIndex(0);
    // `searchSignature` también cambia cuando un filtro altera las coincidencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTrim, searchSignature]);

  const irACoincidencia = (dir) => {
    if (!searchMatchIds.length) return;
    const next = ((currentSearchIndex + dir) % searchMatchIds.length + searchMatchIds.length) % searchMatchIds.length;
    setCurrentSearchIndex(next);
    seleccionarPersonaPorId(searchMatchIds[next], { centrar: Boolean(positions[searchMatchIds[next]]) });
  };

  const limpiarSoloFiltros = () => { setTerritorios([]); setDinastias([]); setTitulos([]); setSiglos([]); setRelaciones([]); setSoloFavoritos(false); setSoloDocumentados(false); };
  const limpiar = () => { setQuery(""); limpiarSoloFiltros(); };

  const lineage = hovered
    ? ancestorsOf(hovered)
    : (seleccion?.id ? ancestorsOf(seleccion.id) : new Set());

  const comparePaths = useMemo(
    () => (origen && destino ? rutasDeComparacion(graph, origen, destino, modoComparacion) : []),
    [graph, origen, destino, modoComparacion]
  );
  useEffect(() => {
    setCompareRouteIndex(0);
  }, [origen, destino, modoComparacion]);
  const comparePath = comparePaths.length
    ? comparePaths[Math.min(compareRouteIndex, comparePaths.length - 1)]
    : null;
  const pathEdges = useMemo(() => {
    const s = new Set();
    if (!comparePath) return s;
    for (let i = 0; i < comparePath.length - 1; i++) {
      s.add(comparePath[i] + "|" + comparePath[i + 1]);
      s.add(comparePath[i + 1] + "|" + comparePath[i]);
    }
    return s;
  }, [comparePath]);

  const groupsByRow = useMemo(() => computeParentGroups(PERSONAS, gen), [gen]);

  const routing = useMemo(() => connectionSet ? {families:[]} : routeFamilyConnectors({
    groupsByRow,
    positions,
    pairContacts: treeLayout.pairContacts,
    gen,
    rows: visibleRows,
    rowBands: treeLayout.rowBands,
    canvasWidth: treeLayout.width,
  }), [connectionSet, groupsByRow, positions, treeLayout.pairContacts, gen, visibleRows, treeLayout.rowBands, treeLayout.width]);

  const relacionFocoId = hovered || seleccion?.id || null;
  const amantesFoco = new Set(relacionFocoId ? listaAmantes(BY_ID[relacionFocoId]) : []);

  const styleForFamilyLine = ({ parentIds, childIds, allChildIds = childIds, childId = null }) => {
    const relevantChildren = childId ? [childId] : childIds;
    const isPath = relevantChildren.some((cid) => parentIds.some((pid) => pathEdges.has(`${pid}|${cid}`)));
    const isImmediate = Boolean(
      relacionFocoId
      && (parentIds.includes(relacionFocoId) || allChildIds.includes(relacionFocoId) || relevantChildren.includes(relacionFocoId))
    );
    const isLineage = relevantChildren.some((cid) =>
      lineage.has(cid) && parentIds.some((pid) => lineage.has(pid))
    );

    if (isPath) return { stroke: PATH_COLOR, strokeWidth: 2.6 };
    if (isImmediate) return { stroke: "#7A2E2E", strokeWidth: 2.05 };
    if (isLineage) return { stroke: "#A9724F", strokeWidth: 1.65 };
    return { stroke: "#B9AF98", strokeWidth: 1.05 };
  };

  // Mantener el SVG montado permite actualizar colores sin recrear todas las líneas.
  const connectorLayerKey = visibleSignature;

  const connectors = connectionSet ? connectionResult.edges.map((edge,i) => <path key={`${edge.from}-${edge.to}`} d={edgePath(edge,positions,i)} fill="none" stroke={edge.type === "sangre" ? "#7a2e2e" : "#a77b43"} strokeWidth={2} strokeDasharray={edge.type === "sangre" ? undefined : "7 5"} />) : routing.families.map((family) => {
    const sharedStyle = styleForFamilyLine(family);
    return (
      <React.Fragment key={`family-${family.key}`}>
        {family.trunkD && (
          <path
            className="family-connector family-connector-trunk"
            d={family.trunkD}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...sharedStyle}
          />
        )}
        {(family.busDs || []).map((busD, index) => (
          <path
            key={`family-${family.key}-bus-${index}`}
            className="family-connector family-connector-bus"
            d={busD}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...sharedStyle}
          />
        ))}
        {family.branches.map((branch) => {
          const branchStyle = styleForFamilyLine({ ...family, childId: branch.childId });
          return (
            <path
              key={`family-${family.key}-${branch.childId}`}
              className="family-connector family-connector-branch"
              d={branch.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...branchStyle}
            />
          );
        })}
      </React.Fragment>
    );
  });

  const scrollBy = (dx, dy) => scrollRef.current?.scrollBy({ left: dx, top: dy, behavior: "smooth" });
  const { onPointerDown, onPointerMove, endDrag } = useDragScroll(scrollRef);

  const centerOn = id => queueViewport({ treeId: id, treeCenter: null });

  useEffect(() => { if (connectionSet && connectionIds[0]) centerOn(connectionIds[0]); }, [connectionSet]);

  // El zoom se ancla SIEMPRE al centro visual actual del viewport. No importa
  // qué persona esté seleccionada, buscada o bajo el cursor: el punto que está
  // justo en el centro de la pantalla antes del zoom debe seguir allí después.
  const pendingZoomCenterRef = useRef(null);

  const cambiarZoomArbol = (objetivo) => {
    const scrollEl = scrollRef.current;
    const zoomNuevo = Math.max(0.4, Math.min(1.4, Number(objetivo.toFixed?.(2) ?? objetivo)));
    if (!Number.isFinite(zoomNuevo) || zoomNuevo === zoom) return;

    if (scrollEl) {
      pendingZoomCenterRef.current = {
        x: (scrollEl.scrollLeft + scrollEl.clientWidth / 2) / Math.max(zoom, 0.001),
        y: (scrollEl.scrollTop + scrollEl.clientHeight / 2) / Math.max(zoom, 0.001),
      };
    }
    setZoom(zoomNuevo);
  };

  useLayoutEffect(() => {
    const center = pendingZoomCenterRef.current;
    const scrollEl = scrollRef.current;
    if (!center || !scrollEl) return;

    const targetLeft = center.x * zoom - scrollEl.clientWidth / 2;
    const targetTop = center.y * zoom - scrollEl.clientHeight / 2;
    const maxLeft = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const maxTop = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);

    scrollEl.scrollLeft = Math.max(0, Math.min(maxLeft, targetLeft));
    scrollEl.scrollTop = Math.max(0, Math.min(maxTop, targetTop));
    pendingZoomCenterRef.current = null;
  }, [zoom]);

  // Centra la barra correspondiente de la línea temporal (si está montada,
  // es decir, si el panel "Línea temporal" está abierto).
  const centerOnTimeline = id => queueViewport({ timelineId: id, timelineYear: null, timelineScroll: null });

  const registrarHistorialPersona = (id) => {
    if (!BY_ID[id]) return;
    setPersonHistory((actual) => {
      if (actual.ids[actual.index] === id) return actual;
      const base = actual.ids.slice(0, actual.index + 1);
      base.push(id);
      const ids = base.slice(-60);
      return { ids, index: ids.length - 1 };
    });
  };

  const actualizarUrlPersonaSeleccionada = (persona, { reemplazar = false, quitarPanorama = false } = {}) => {
    if (!persona || typeof window === "undefined" || historyPopRef.current) return;
    const slug = slugPersonaPorLocale(persona, "es");
    if (!slug) return;
    const url = new URL(window.location.href);
    if (historiaActiva) url.searchParams.set("persona", persona.id);
    else {url.pathname = rutaEntidadLocalizada("es", "persona", slug);url.searchParams.delete("persona");}
    if(quitarPanorama){url.searchParams.delete("escena");if(url.searchParams.get("panel")==="europa")url.searchParams.delete("panel");}
    url.searchParams.set("atlas", "1");
    writeAtlasIds(url, atlasIds);
    const destino = `${url.pathname}${url.search}${url.hash}`;
    const actual = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (destino === actual) return;
    const metodo = reemplazar ? "replaceState" : "pushState";
    window.history[metodo]({ eade: "persona", id: persona.id }, "", destino);
  };

  const seleccionarPersonaPorId = (id, { registrar = true, reemplazarUrl = false, centrar = true, abrirAtlas = false } = {}) => {
    const persona = BY_ID[id];
    if (!persona) return;
    setHovered(null);
    setSeleccion(persona);
    if(abrirAtlas){setAtlasScene("atlas");setReproduciendoHistoria(false);requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});document.querySelector('[aria-label="Modo de exploración"] button[aria-pressed="true"]')?.focus({preventScroll:true});});}
    if (registrar) registrarHistorialPersona(id);
    actualizarUrlPersonaSeleccionada(persona, { reemplazar: reemplazarUrl, quitarPanorama: abrirAtlas });
    if (centrar) {
      centerOn(id);
      centerOnTimeline(id);
    }
  };

  const navegarHistorialPersona = (delta) => {
    const siguiente = Math.max(0, Math.min(personHistory.ids.length - 1, personHistory.index + delta));
    if (siguiente === personHistory.index || siguiente < 0) return;
    const id = personHistory.ids[siguiente];
    if (!BY_ID[id]) return;
    setPersonHistory((actual) => ({ ...actual, index: siguiente }));
    seleccionarPersonaPorId(id, { registrar: false, reemplazarUrl: true, centrar: true });
  };

  const centrarSeleccion = () => {
    if (!seleccion?.id) return;
    setHovered(null);
    centerOn(seleccion.id);
    centerOnTimeline(seleccion.id);
  };

  const cerrarSeleccion = () => {
    setHovered(null);
    setSeleccion(null);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.pathname = "/es/";
    url.searchParams.delete("persona");
    writeAtlasIds(url, atlasIds);
    window.history.pushState({ eade: "atlas" }, "", `${url.pathname}${url.search}${url.hash}`);
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onPopState = () => {
      historyPopRef.current = true;
      const incomingStory = resolveStoryNavigation(window.location.pathname, window.location.search, HISTORIAS);
      if (incomingStory) {
        setAtlasScene("atlas");
        storyActionsRef.current.start(incomingStory.story.id, incomingStory.index, {returnPath:incomingStory.returnPath});
        const selectedId = new URLSearchParams(window.location.search).get('persona');
        if (BY_ID[selectedId]) {setSeleccion(BY_ID[selectedId]);centerOn(selectedId);}
        historyPopRef.current = false;
        return;
      }
      const sceneParams=new URLSearchParams(window.location.search);
      setTerritorialFilterMode(sceneParams.get('criterio')==='gobierno'?'government':'associated');
      // Only legacy links carry the scene; without it, history keeps the current scene.
      const explicitScene=sceneParams.has('escena')||sceneParams.get('panel')==='europa';
      const incomingScene=sceneParams.get('escena')==='europa'||sceneParams.get('panel')==='europa'?'europa':'atlas';
      if(explicitScene)setAtlasScene(incomingScene);
      const yearValue=sceneParams.get('anio');
      const incomingYear=yearValue?Number(yearValue):incomingScene==='europa'?1500:null;
      if(incomingYear===null||Number.isInteger(incomingYear)){setAnioGlobal(incomingYear);setAnioInput(incomingYear===null?'':String(incomingYear));}
      setStoryReturn(null);
      setAtlasIds(atlasIdsFromLocation(window.location.pathname, window.location.search, familyData));
      setAtlasUndo([]);
      const incomingConnection = connectionFromSearch(window.location.search, BY_ID);
      if (incomingConnection.ids.length) {
        setHistoriaActivaId(null);setHistoriaPasoIndex(0);historiaSnapshotRef.current=null;
        setConnectionIds(incomingConnection.ids);setConnectionCriterion(incomingConnection.criterion);setMode('conexion');
        centerOn(incomingConnection.ids[0]);historyPopRef.current = false;return;
      }
      const ruta = rutaPublicaDesdePath(window.location.pathname);
      const personaId = personaIdDesdeRuta(window.location.pathname) || BY_ID[sceneParams.get("persona")]?.id;

      // Al volver atrás desde una Historia, recupera también el estado del Atlas
      // que existía antes de iniciar el recorrido, no solo la URL.
      const anteriorHistoria = historiaSnapshotRef.current;
      if (anteriorHistoria && ruta?.tipo !== "historia") {
        setAtlasIds(anteriorHistoria.atlasIds ?? null);
        setQuery(anteriorHistoria.query);
        setTerritorios(anteriorHistoria.territorios);
        setTerritorialFilterMode(anteriorHistoria.territorialFilterMode||'associated');
        setDinastias(anteriorHistoria.dinastias);
        setTitulos(anteriorHistoria.titulos);
        setSiglos(anteriorHistoria.siglos);
        setRelaciones(anteriorHistoria.relaciones);
        setSoloFavoritos(anteriorHistoria.soloFavoritos);
        setSoloDocumentados(anteriorHistoria.soloDocumentados ?? false);
        setAtlasScene(anteriorHistoria.atlasScene || "atlas");
        setAnioGlobal(anteriorHistoria.anioGlobal);
        setAnioInput(Number.isFinite(anteriorHistoria.anioGlobal) ? String(anteriorHistoria.anioGlobal) : "");
        setVistasActivas(anteriorHistoria.vistasActivas);
        setTimelineMode(anteriorHistoria.timelineMode);
        setEventoSeleccionadoId(anteriorHistoria.eventoSeleccionadoId || null);
        setMode(anteriorHistoria.mode || "view");
    setConnectionIds(anteriorHistoria.connectionIds || []);
    setConnectionCriterion(anteriorHistoria.connectionCriterion || "matrimonio");
        setOrigen(anteriorHistoria.origen || null);
        setDestino(anteriorHistoria.destino || null);
        setFocoId(anteriorHistoria.focoId || null);
        setFocoAlcance(anteriorHistoria.focoAlcance || "cercana");
        setCollapsedIds(anteriorHistoria.collapsedIds || []);
        setCompareRouteIndex(anteriorHistoria.compareRouteIndex || 0);
        setHistoriaActivaId(null);
        setHistoriaPasoIndex(0);
        historiaSnapshotRef.current = null;
      }

      if (personaId && BY_ID[personaId]) {
        setHistoriaActivaId(null);
        setHistoriaPasoIndex(0);
        historiaSnapshotRef.current = null;
        setHovered(null);
        setSeleccion(BY_ID[personaId]);
        setPersonHistory((actual) => {
          const existente = actual.ids.lastIndexOf(personaId);
          if (existente >= 0) return { ...actual, index: existente };
          const base = actual.ids.slice(0, actual.index + 1);
          base.push(personaId);
          const ids = base.slice(-60);
          return { ids, index: ids.length - 1 };
        });
        centerOn(personaId);
        centerOnTimeline(personaId);
      } else if (ruta?.tipo === "dinastia") {
        const valores = [...opciones.dinastias, ...Object.values(opciones.ramasPorPrincipal).flat()];
        const valor = valorPorSlug(ruta.slug, valores);
        if (valor) {
          setSeleccion(null);
          setTerritorios([]);
          setDinastias([valor]);
          setHistoriaActivaId(null);
          historiaSnapshotRef.current = null;
        }
      } else if (ruta?.tipo === "territorio") {
        const valores = [...opciones.territorios, ...Object.values(opciones.subsPorTerritorio).flat()];
        const valor = valorPorSlug(ruta.slug, valores);
        if (valor) {
          setSeleccion(null);
          setDinastias([]);
          setTerritorios([valor]);
          setHistoriaActivaId(null);
          historiaSnapshotRef.current = null;
        }
      } else if (ruta?.tipo === "historia") {
        const historia = HISTORIAS.find((item) => slugPublico(item.titulo) === ruta.slug || slugPublico(item.id) === ruta.slug);
        if (historia?.disponible) window.setTimeout(() => iniciarHistoria(historia.id), 0);
      } else if (["/", "/es", "/es/"].includes(window.location.pathname)) {
        setHistoriaActivaId(null);
        setHistoriaPasoIndex(0);
        historiaSnapshotRef.current = null;
        setHovered(null);
        setSeleccion(null);
      }
      window.setTimeout(() => { historyPopRef.current = false; }, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const centerTimelineOnYear = anio => queueViewport({ timelineYear: anio, timelineId: null, timelineScroll: null });

  const seleccionarEvento = (evento) => {
    if (!evento) return;
    const anio = inicioEvento(evento);
    setEventoSeleccionadoId(evento.id);
    setReproduciendoHistoria(false);
    if (Number.isFinite(anio)) {
      setAnioGlobal(anio);
      setAnioInput(String(anio));
    }
    const personaPrincipal = (evento.personas || []).find((id) => BY_ID[id]);
    if (personaPrincipal) {
      seleccionarPersonaPorId(personaPrincipal, { centrar: false });
    } else {
      setSeleccion(null);
      setHovered(null);
    }
    if (personaPrincipal) centerOn(personaPrincipal);
    centerTimelineOnYear(anio);
  };

  const aplicarPasoHistoria = (historia, index, {replace = false, returnPath = storyReturn} = {}) => {
    const paso = historia?.pasos?.[index];
    if (!paso) return;
    setHistoriaPasoIndex(index);
    limpiar();setMode('view');setFocoId(null);setCollapsedIds([]);
    const ids = storyPeopleIds(historia).filter(id => BY_ID[id]);
    setAtlasIds(ids);
    const currentUrl = new URL(window.location.href);
    for (const key of ['q','territorio','dinastia','funcion','siglo','relacion']) currentUrl.searchParams.delete(key);
    const principal = paso.persona || paso.personas?.find(id=>BY_ID[id]);
    if (principal) currentUrl.searchParams.set('persona',principal);
    const url = writeStoryNavigation(currentUrl, historia, index, returnPath, ids);
    setStoryReturn(url.searchParams.get('regreso'));
    try { saveStoryProgress(window.localStorage, historia.id, historia.pasos.length, index + 1); } catch { /* Storage can be unavailable. */ }
    if (!historyPopRef.current) {
      const destination = url.pathname + url.search;
      if (destination !== window.location.pathname + window.location.search) window.history[replace ? 'replaceState' : 'pushState']({eade:'historia',id:historia.id,index}, '', destination);
    }
    setReproduciendoHistoria(false);
    setTimelineMode("ambos");
    setAnioGlobal(paso.anio);
    setAnioInput(String(paso.anio));
    setEventoSeleccionadoId(paso.eventoId || null);
    const personaId = paso.persona || (paso.personas || []).find((id) => BY_ID[id]);
    if (!personaId && atlasIds?.length) centerOn(atlasIds[0]);
    if (personaId && BY_ID[personaId]) {
      setSeleccion(BY_ID[personaId]);
      setHovered(null);
    }
    if (personaId && BY_ID[personaId]) centerOn(personaId);
    centerTimelineOnYear(paso.anio);
  };

  const iniciarHistoria = (historiaId, index = 0, {returnPath = storyReturn, replace = false} = {}) => {
    const historia = HISTORIAS.find((item) => item.id === historiaId && item.disponible);
    if (!historia?.pasos?.length) return;
    if (!historiaSnapshotRef.current) {
      const historiaAbiertaDesdeEnlace = Boolean(resolveStoryNavigation(window.location.pathname, window.location.search, HISTORIAS));
      historiaSnapshotRef.current = {
        atlasIds, query, territorios, territorialFilterMode, dinastias, titulos, siglos, relaciones, soloFavoritos, soloDocumentados, anioGlobal, atlasScene,
        vistasActivas, seleccionId: seleccion?.id || null, timelineMode, eventoSeleccionadoId,
        mode, connectionIds, connectionCriterion, origen, destino, focoId, focoAlcance, collapsedIds, compareRouteIndex,
        rutaAnterior: typeof window !== "undefined"
          ? (historiaAbiertaDesdeEnlace ? (returnPath || "/es/historias") : `${window.location.pathname}${window.location.search}${window.location.hash}`)
          : "/es/",
        historiaAbiertaDesdeEnlace,
      };
    }
    setQuery("");
    setTerritorios([]);
    setDinastias([]);
    setTitulos([]);
    setSiglos([]);
    setRelaciones([]);
    setSoloFavoritos(false);
    setSoloDocumentados(false);
    setMode("view");
    setFocoId(null);
    setCollapsedIds([]);
    setVistasActivas({ arbol: true, mapa: new URLSearchParams(window.location.search).get("vista") !== "arbol" });
    if (panelesVisibles.filtros) alternarPanelAuxiliar('filtros');
    if (panelesVisibles.cronologia) alternarPanelAuxiliar('cronologia');
    setHistoriaActivaId(historia.id);
    setInfoProyecto(null);
    aplicarPasoHistoria(historia, Math.max(0, Math.min(historia.pasos.length - 1, index)), {returnPath, replace});
  };

  const cambiarPasoHistoria = (delta) => {
    if (!historiaActiva?.pasos?.length) return;
    const siguiente = Math.max(0, Math.min(historiaActiva.pasos.length - 1, historiaPasoIndex + delta));
    aplicarPasoHistoria(historiaActiva, siguiente);
  };

  const salirHistoria = () => {
    setHistoriaActivaId(null);
    setHistoriaPasoIndex(0);
    setEventoSeleccionadoId(null);
    setStoryReturn(null);
    historiaSnapshotRef.current = null;
    // Closing the guide keeps the current selection, year, view and viewport.
    const url = new URL(window.location.href);
    for (const key of ['historia','paso','regreso','resaltar']) url.searchParams.delete(key);
    url.pathname = '/es/';
    url.searchParams.set('atlas','1');
    url.searchParams.set('vista',vistaPrincipal);
    window.history.replaceState({eade:'atlas'}, '', url.pathname+url.search);
  };

  storyActionsRef.current = {start:iniciarHistoria};

  const construirEnlaceCompartido = useCallback(() => {
    if (!seleccion || typeof window === "undefined") return "";
    if (mode === "conexion") return new URL(connectionUrl(connectionIds, connectionCriterion), window.location.origin).href;
    const url = new URL(window.location.href);
    if (historiaActiva) {
      url.searchParams.set('persona',seleccion.id);
      url.searchParams.set('vista',vistaPrincipal);
      return writeStoryNavigation(url,historiaActiva,historiaPasoIndex,storyReturn,storyPeopleIds(historiaActiva).filter(id=>BY_ID[id])).href;
    }
    url.pathname = rutaEntidadLocalizada("es", "persona", slugPersonaPorLocale(seleccion, "es"));
    url.search = "";
    writeAtlasIds(url, focoSet ? visibleIds : atlasIds);
    url.hash = "";
    if (Number.isFinite(anioGlobal)) url.searchParams.set("anio", String(anioGlobal));
    url.searchParams.set("vista", vistaPrincipal);
    if (query.trim()) url.searchParams.set("q", query.trim());
    territorios.forEach((valor) => url.searchParams.append("territorio", valor));
    if(territorialFilterMode==='government')url.searchParams.set('criterio','gobierno');
    dinastias.forEach((valor) => url.searchParams.append("dinastia", valor));
    titulos.forEach((valor) => url.searchParams.append("funcion", valor));
    siglos.forEach((valor) => url.searchParams.append("siglo", String(valor)));
    relaciones.forEach((valor) => url.searchParams.append("relacion", valor));
    if (soloDocumentados) url.searchParams.set("evidencia", "1");
    return url.toString();
  }, [historiaActiva, historiaPasoIndex, storyReturn, focoSet, visibleIds, atlasIds, seleccion, mode, connectionIds, connectionCriterion, anioGlobal, vistaPrincipal, query, territorios, dinastias, titulos, siglos, relaciones, soloDocumentados,territorialFilterMode]);

  const compartirPersona = useCallback(async () => {
    const enlace = construirEnlaceCompartido();
    if (!enlace || !seleccion) return;
    const payload = {
      title: t("share.personTitle", { name: nombrePrincipal(seleccion) || seleccion.nombre }),
      text: t("share.personText", { name: nombrePrincipal(seleccion) || seleccion.nombre }),
      url: enlace,
    };
    try {
      if (mode !== 'foco') window.history.replaceState({}, "", enlace);
      if (navigator.share) {
        await navigator.share(payload);
        mostrarEstadoCompartir("Enlace compartido");
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(enlace);
        mostrarEstadoCompartir("Enlace copiado");
        return;
      }
      window.prompt("Copia este enlace:", enlace);
      mostrarEstadoCompartir("Enlace preparado");
    } catch (error) {
      if (error?.name === "AbortError") return;
      try {
        await navigator.clipboard?.writeText?.(enlace);
        mostrarEstadoCompartir("Enlace copiado");
      } catch {
        window.prompt("Copia este enlace:", enlace);
      }
    }
  }, [construirEnlaceCompartido, seleccion, mostrarEstadoCompartir, mode]);

  useEffect(() => {
    if (!ready || urlStateLoadedRef.current || typeof window === "undefined") return;
    urlStateLoadedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const connection = connectionFromSearch(params, BY_ID);
    if (connection.ids.length) { setConnectionIds(connection.ids); setConnectionCriterion(connection.criterion); setMode("conexion"); centerOn(connection.ids[0]); }
    const incomingStory = resolveStoryNavigation(window.location.pathname, window.location.search, HISTORIAS);
    if (incomingStory) {
      iniciarHistoria(incomingStory.story.id, incomingStory.index, {returnPath:incomingStory.returnPath,replace:true});
      const selectedId = params.get('persona');
      if (BY_ID[selectedId] && incomingStory.ids.includes(selectedId)) {
        setSeleccion(BY_ID[selectedId]);centerOn(selectedId);
        const url=new URL(window.location.href);url.searchParams.set('persona',selectedId);window.history.replaceState({eade:'historia'},'',url.pathname+url.search);
      }
      return;
    }
    if (savedSession?.historiaActivaId) {
      iniciarHistoria(savedSession.historiaActivaId,savedSession.historiaPasoIndex,{returnPath:savedSession.storyReturn,replace:true});
      setVistasActivas(savedSession.vistasActivas);
      const resumedUrl=new URL(window.location.href);
      resumedUrl.searchParams.set("vista",savedSession.vistasActivas.arbol ? (savedSession.vistasActivas.mapa ? "ambos" : "arbol") : "mapa");
      window.history.replaceState({eade:"historia"},"",resumedUrl.pathname+resumedUrl.search);
      if (BY_ID[savedSession.selectedId]) {
        setSeleccion(BY_ID[savedSession.selectedId]);centerOn(savedSession.selectedId);
        const url=new URL(window.location.href);url.searchParams.set('persona',savedSession.selectedId);window.history.replaceState({eade:'historia'},'',url.pathname+url.search);
      }
      return;
    }
    const rutaInicial = rutaPublicaDesdePath(window.location.pathname);
    if (rutaInicial?.locale === "en") return;

    const todosTerritorios = new Set([
      ...opciones.territorios,
      ...Object.values(opciones.subsPorTerritorio).flat(),
    ]);
    const todasDinastias = new Set([
      ...opciones.dinastias,
      ...Object.values(opciones.ramasPorPrincipal).flat(),
    ]);
    const funcionesValidas = new Set(opciones.titulos.map((item) => item.id));
    const relacionesValidas = new Set(FILTROS_RELACION.map((item) => item.id));

    const q = params.get("q");
    if (q) setQuery(q);
    setTerritorialFilterMode(params.get('criterio')==='gobierno'?'government':'associated');
    setTerritorios(params.getAll("territorio").filter((valor) => todosTerritorios.has(valor)));
    setDinastias(params.getAll("dinastia").filter((valor) => todasDinastias.has(valor)));
    setTitulos(params.getAll("funcion").filter((valor) => funcionesValidas.has(valor)));
    setSiglos(params.getAll("siglo").map((valor) => valor === SIN_FECHA ? SIN_FECHA : Number(valor)).filter((valor) =>
      valor === SIN_FECHA || opciones.siglos.includes(valor)
    ));
    setRelaciones(params.getAll("relacion").filter((valor) => relacionesValidas.has(valor)));
    setSoloDocumentados(params.get("evidencia") === "1");

    const rutaPublica = rutaPublicaDesdePath(window.location.pathname);
    if (rutaPublica?.tipo === "territorio") {
      const valor = valorPorSlug(rutaPublica.slug, [...todosTerritorios]);
      if (valor) setTerritorios([valor]);
    } else if (rutaPublica?.tipo === "dinastia") {
      const valor = valorPorSlug(rutaPublica.slug, [...todasDinastias]);
      if (valor) setDinastias([valor]);
    } else if (rutaPublica?.tipo === "historia") {
      const historia = HISTORIAS.find((item) => slugPublico(item.titulo) === rutaPublica.slug || slugPublico(item.id) === rutaPublica.slug);
      if (historia?.disponible && historia?.pasos?.length) {
        window.setTimeout(() => iniciarHistoria(historia.id), 80);
      } else if (historia) {
        setInfoProyecto("historias");
      }
    }

    const vista = params.get("vista");
    if (vista === "arbol") setVistasActivas({ arbol: true, mapa: false });
    else if (vista === "mapa") setVistasActivas({ arbol: false, mapa: true });
    else if (vista === "ambos") setVistasActivas({ arbol: true, mapa: true });

    const anioParam = params.get("anio");
    const año = anioParam === null ? null : ajustarAnio(anioParam);
    if (Number.isFinite(año)) {
      setAnioGlobal(año);
      setAnioInput(String(año));
    }

    const personaId = params.get("persona") || params.get("familia") || personaIdDesdeRuta(window.location.pathname);
    if (!personaId && atlasIds?.length) centerOn(atlasIds[0]);
    if (personaId && BY_ID[personaId]) {
      setSeleccion(BY_ID[personaId]);
      setPersonHistory({ ids: [personaId], index: 0 });
      centerOn(personaId);
      centerOnTimeline(personaId);
    }
  }, [opciones, ajustarAnio, ready]);

  const previousConnectionMode = useRef(false);
  useEffect(() => {
    if (!urlStateLoadedRef.current) return;
    if (mode === 'conexion') {
      if(historiaActivaId){setHistoriaActivaId(null);setStoryReturn(null);historiaSnapshotRef.current=null;}
      const url = new URL(connectionUrl(connectionIds, connectionCriterion), window.location.origin);
      if (seleccion && connectionResult.ids.includes(seleccion.id)) url.searchParams.set('persona', seleccion.id);
      window.history.replaceState({eade:'conexion'}, '', url.pathname + url.search);
    } else if (previousConnectionMode.current && !historiaActivaId) {
      const url = new URL(window.location.href);
      url.searchParams.delete('conectar'); url.searchParams.delete('vinculos');
      url.searchParams.set('atlas','1');
      window.history.replaceState({eade:'atlas'}, '', url.pathname + url.search);
    }
    previousConnectionMode.current = mode === 'conexion';
  }, [mode, connectionIds, connectionCriterion, seleccion?.id, historiaActivaId]);

  const handleBoxClick = (p) => {
    if (mode === "conexion") {
      setConnectionIds(ids => ids.includes(p.id) || ids.length >= 5 ? ids : [...ids, p.id]);
      seleccionarPersonaPorId(p.id);
    } else if (mode === "compare") {
      if (!origen) { setOrigen(p.id); setDestino(null); }
      else if (!destino && p.id !== origen) { setDestino(p.id); }
      else { setOrigen(p.id); setDestino(null); }
    } else if (mode === "foco") {
      setFocoId(p.id);
      seleccionarPersonaPorId(p.id);
    } else {
      seleccionarPersonaPorId(p.id);
    }
  };
  
  const getBoxHandlers = (id) => {
    const p = BY_ID[id];
    return {
      onEnter: () => {
        setHovered(id);
      },
      onLeave: () => {
        setHovered(null);
      },
      onClick: () => {
        if (typeof handleBoxClick === 'function') {
          handleBoxClick(p);
        } else {
          seleccionarPersonaPorId(p.id);
        }
      }
    };
  };

  // Centraliza el cálculo de clases y eventos de cada ficha del árbol.
  const renderPersonBox = (id, boxLayout) => {
    const p = BY_ID[id];
    let cls = "box";
    if (boxLayout?.mini) cls += " box-mini";
    if (seleccion?.id === id) cls += " selected";
    if (hovered === id) cls += " hovered";
    else if (lineage.has(id)) cls += " lineage";
    if (comparePath && comparePath.includes(id)) cls += " path-hl";
    if ((mode === "compare" && (id === origen || id === destino)) || (mode === "conexion" && connectionIds.includes(id))) cls += " pick";
    if (searchMatchSet.has(id)) cls += id === searchCurrentId ? " search-current" : " search-match";
    if (amantesFoco.has(id)) cls += " lover-related";
    if (historiaPersonasSet.has(id)) cls += " story-related";
    if (Number.isFinite(anioGlobal)) {
      if (!estaVivaEn(p, anioGlobal)) cls += " year-inactive";
      if (reinadosActivos(p, anioGlobal, { soloEfectivos: true }).length) cls += " year-ruling";
    }
    const h = getBoxHandlers(id);
    return (
      <PersonBox
        key={id}
        p={p}
        year={anioGlobal}
        cls={cls}
        accent={ACCENTS[p.dinastia] || ACCENTS[getCategoriaDinastía(p.dinastia)] || "#71717A"}
        style={boxLayout ? {
          position: "absolute",
          left: boxLayout.x,
          top: boxLayout.y,
          width: boxLayout.w,
          height: boxLayout.h,
        } : undefined}
        onEnter={h.onEnter}
        onLeave={h.onLeave}
        onClick={h.onClick}
        showDates={zoom >= 1.05}
        hasDescendants={mode !== "conexion" && (HIJOS_POR_ID[id] || []).length > 0}
        descendantsCollapsed={collapsedSet.has(id)}
        onToggleDescendants={() => toggleDescendants(id)}
      />
    );
  };
  
  const miniW = 180, miniH = 110;
  const miniScaleX = canvasSize.w ? miniW / canvasSize.w : 1;
  const miniScaleY = canvasSize.h ? miniH / canvasSize.h : 1;
  const onMinimapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / miniScaleX;
    const relY = (e.clientY - rect.top) / miniScaleY;
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    scrollEl.scrollTo({ left: relX * zoom - scrollEl.clientWidth / 2, top: relY * zoom - scrollEl.clientHeight / 2, behavior: "smooth" });
  };

  const changeAtlasScene = useCallback(scene=>{
    setReproduciendoHistoria(false);
    setAtlasScene(scene);
    if(scene==='europa'&&!Number.isInteger(anioGlobal)){setAnioGlobal(1500);setAnioInput('1500');}
    const url=new URL(window.location.href);
    if(url.searchParams.get('panel')==='europa')url.searchParams.delete('panel');
    // V5.20 · Atlas y Europa comparten URL: la escena vive en la sesión, no en la
    // dirección. Los enlaces antiguos con ?escena=europa se siguen leyendo.
    url.searchParams.delete('escena');
    if(Number.isInteger(anioGlobal))url.searchParams.set('anio',String(anioGlobal));else if(scene==='europa')url.searchParams.set('anio','1500');
    window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
  },[anioGlobal]);
  useEffect(()=>{
    if(!ready||atlasScene!=='europa'||!Number.isInteger(anioGlobal))return;
    const url=new URL(window.location.href);url.searchParams.delete('escena');url.searchParams.set('anio',String(anioGlobal));if(url.searchParams.get('panel')==='europa')url.searchParams.delete('panel');
    window.history.replaceState({eade:'atlas'},'',url.pathname+url.search+url.hash);
  },[atlasScene,anioGlobal,ready]);

  const filtrosActivosCompactos = useMemo(() => {
    const lista = [];
    if (queryTrim) lista.push(`“${query.trim()}”`);
    territorios.forEach((valor) => lista.push(valor));
    dinastias.forEach((valor) => lista.push(valor));
    titulos.forEach((id) => {
      const categoria = opciones.titulos.find((item) => item.id === id);
      lista.push(categoria?.label || id);
    });
    siglos.forEach((valor) => lista.push(valor === SIN_FECHA ? "Fechas incompletas" : `s. ${nRomano[valor] || valor}`));
    relaciones.forEach((id) => {
      const filtro = FILTROS_RELACION.find((item) => item.id === id);
      lista.push(filtro?.label || id);
    });
    if (soloFavoritos) lista.push("Favoritos");
    if (soloDocumentados) lista.push("Con datos documentados");
    return lista;
  }, [queryTrim, query, territorios, dinastias, titulos, siglos, relaciones, soloFavoritos, soloDocumentados, opciones.titulos]);

  const cambiarIdioma = useCallback((siguiente) => {
    if (typeof window === "undefined" || !["es", "en"].includes(siguiente) || siguiente === locale) return;
    const destino = translatedEquivalent(window.location.pathname, siguiente) || (siguiente === "en" ? "/en/" : "/es/");

    window.location.assign(destino);
  }, [locale]);

  if (locale === "en" && !tutorialEntry) return <EnglishPage />;

  const getExportSelection = (scope) => {
    let ids, edges, title;
    if (scope === 'branch') { ids = seleccion ? familyIds(familyData, seleccion.id) : []; title = seleccion ? `Familia de ${seleccion.nombre}` : 'Familia'; }
    else if (scope === 'visible') {
      const el=scrollRef.current;
      ids=el?visibleIds.filter(id=>{const p=positions[id];return p&&p.x+p.w>=el.scrollLeft/zoom&&p.x<=(el.scrollLeft+el.clientWidth)/zoom&&p.y+p.h>=el.scrollTop/zoom&&p.y<=(el.scrollTop+el.clientHeight)/zoom;}):[];
      title='Encuadre visible del Atlas';
    }
    else if (mode === 'conexion' && connectionSet) { ids = connectionResult.ids; edges = connectionResult.edges; title = 'Conexión entre personas'; }
    else if (mode === 'compare') { ids = comparePath || []; title = 'Comparación de parentesco'; }
    else { ids = atlasIds ?? visibleIds; title = seleccion ? `Selección de ${seleccion.nombre}` : 'Selección del Atlas'; }

    return {people:ids.map(id=>BY_ID[id] ? {...BY_ID[id],slug:slugPersonaPorLocale(BY_ID[id], "es")} : null).filter(Boolean),edges:edges || selectionEdges(graph,ids),gen,terminals:mode==='conexion'?connectionIds:[seleccion?.id].filter(Boolean),title,url:mode==='conexion'?new URL(connectionUrl(connectionIds,connectionCriterion), window.location.origin).href:(construirEnlaceCompartido() || window.location.href)};
  };

  const changeAtlasScope = (next, { remember = true, center = null } = {}) => {
    setAtlasExpansionFeedback(null);
    if (remember) setAtlasUndo(previous => [...previous.slice(-19), atlasIds]);
    setAtlasIds(next);
    const url = writeAtlasIds(new URL(window.location.href), next);
    window.history.pushState({ eade: 'atlas-selection' }, '', url.pathname + url.search);
    if (center) centerOn(center);
  };
  const startFamily = id => {
    const ids = familyIds(familyData, id);
    if (!ids.length) return;
    limpiar(); setMode('view'); setFocoId(null); setCollapsedIds([]);
    setSeleccion(BY_ID[id]);
    changeAtlasScope(ids, { center: id });
  };
  const familyBranches = seleccion ? {
    family: familyIds(familyData, seleccion.id),
    ancestors: [...ancestorsOf(seleccion.id)],
    descendants: [...descendantsOf(seleccion.id)],
  } : { family: [], ancestors: [], descendants: [] };
  const additions = Object.fromEntries(Object.entries(familyBranches).map(([kind, ids]) => [kind, atlasSet ? ids.filter(id => !atlasSet.has(id)) : []]));
  const expandFamily = (kind) => {
    if (historiaActiva || !seleccion || atlasIds === null || !additions[kind]?.length) return;
    const count = additions[kind].length;
    changeAtlasScope([...new Set([...atlasIds, ...familyBranches[kind]])], { center: seleccion.id });
    setMode('view');
    setFocoId(null);
    setAtlasExpansionFeedback({ count, kind, person: seleccion.nombre });
  };
  const growth = { ids: atlasIds, selected: seleccion, query, results: searchMatchIds.map(id => BY_ID[id]), additions, feedback: atlasExpansionFeedback,
    onStart: startFamily, onSelect: id => seleccionarPersonaPorId(id, { centrar: Boolean(positions[id]) }),
    onExpand: expandFamily,
    onUndo: () => { setMode('view');setFocoId(null);const previous = atlasUndo.at(-1); setAtlasUndo(atlasUndo.slice(0, -1)); changeAtlasScope(previous, { remember: false, center: previous?.[0] }); },
    canUndo: atlasUndo.length > 0, onFull: () => { limpiar(); setMode('view'); setFocoId(null); setCollapsedIds([]); changeAtlasScope(null); },
    onNew: () => { limpiar(); setMode('view'); setSeleccion(null); changeAtlasScope([]); },
    onFilters: () => alternarPanelAuxiliar('filtros'), filtersOpen: mostrarFiltros, popeCount: treeLayout.isolatedPopeCount,
  };

  const viewModel = {
    growth,
    storyReturn,
    connectionIds, setConnectionIds, connectionCriterion, setConnectionCriterion, connectionResult, getExportSelection,
    initialMapViewport: mapViewportRef.current, recordMapViewport, timelineVirtual, timelineListRef, scrollRef, tlScrollRef, locale, query, setQuery,
    territorios, setTerritorios, dinastias, setDinastias, dinastiasExpandidas, setDinastiasExpandidas, territoriosExpandidos, setTerritoriosExpandidos,
    titulos, setTitulos, siglos, setSiglos, relaciones, setRelaciones, hovered,
    seleccion, currentSearchIndex, zoom, mode, setMode,
    origen, setOrigen, destino, setDestino, modoComparacion, compareMenuOpen, setCompareMenuOpen,
    compareRouteIndex, setCompareRouteIndex, setFocoMenuOpen, focoId, setFocoId, focoAlcance, setFocoAlcance,
    anioGlobal, anioInput, setAnioInput, reproduciendoHistoria, setReproduciendoHistoria,
    shareStatus, collapsedIds, setCollapsedIds, setVistasActivas,
    atlasScene, changeAtlasScene, infoProyecto, setInfoProyecto, timelineScaleIndex, setTimelineScaleIndex, timelineMode, setTimelineMode, setEventoSeleccionadoId,
    favoritos, setFavoritos, favoritosOpen, setFavoritosOpen, soloFavoritos, setSoloFavoritos, soloDocumentados, setSoloDocumentados,
    historiaPasoIndex, compareMenuRef, favoritosMenuRef,
    territorialFilterMode, setTerritorialFilterMode, filterSectionsOpen,
    bioSectionsOpen, personHistory, modoTrabajo, setModoTrabajo,
    alternarSeccionFiltro, alternarSeccionBio,
    graph, favoritosSet, timelinePeople, timelinePxPerYear, timelineTrackWidth,
    eventosOrdenados, eventoSeleccionado,
    historiaActiva, opciones, personaBio, toggle, focoSet,
    hiddenByCollapse, actualizarAnioDesdeRango, confirmarAnioEscrito, restablecerAnio, moverAnioHistoria, alternarReproduccionHistoria,
    mostrarArbol, mostrarMapa, mostrarFiltros, mostrarBiografia, mostrarCronologia, vistaPrincipal, layoutLaterales,
    alternarPanelAuxiliar, personasVivasEnAnio, gobernantesActivosEnAnio, visiblePeople,
    renderedTreeUnits, positions, canvasSize, queryTrim, searchMatchIds,
    irACoincidencia, limpiarSoloFiltros, comparePaths, comparePath,
    connectorLayerKey, connectors, scrollBy, onPointerDown,
    onPointerMove, endDrag, cambiarZoomArbol, seleccionarPersonaPorId, navegarHistorialPersona, centrarSeleccion, cerrarSeleccion,
    centerTimelineOnYear, alternarFavorito, seleccionarEvento, aplicarPasoHistoria, iniciarHistoria, cambiarPasoHistoria, salirHistoria,
    compartirPersona, renderPersonBox, miniScaleX, miniScaleY,
    onMinimapClick, filtrosActivosCompactos, cambiarIdioma,
  };
  return <ExplorerView vm={viewModel} loading={loading} loadError={loadError} onRetry={onRetry} ready={ready} />;
}
