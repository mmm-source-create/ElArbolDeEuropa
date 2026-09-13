import React from 'react';
import CrownTimeline from '../components/CrownTimeline.jsx';
import {ACCESOS_CORONAS} from '../content/coronas/index.js';
import {RELEVOS} from '../content/sucesiones/index.js';
import {SOURCES} from '../content/sources.js';
import {accesosDe} from '../data/crowns.js';
export default function AtlasCrowns({persona,...props}) {
 return <CrownTimeline persona={persona} accesos={accesosDe(persona,ACCESOS_CORONAS,RELEVOS)} fuentes={SOURCES} compact {...props}/>;
}
