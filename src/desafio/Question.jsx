import React from "react";
import {Check, X, ArrowRight, ExternalLink} from "lucide-react";
import {IMAGENES_PERSONAS} from "../imagenesPersonas.js";

function getSafeHref(urlInput){if(!urlInput||typeof urlInput!=="string")return null;try{if(urlInput.startsWith('/')&&!urlInput.startsWith('//'))return urlInput;const parsed=new URL(urlInput,window.location.origin);if(['http:','https:'].includes(parsed.protocol))return parsed.href;}catch{}return null;}
/* rest of component unchanged except safe href validation for fuentes and atlas links */