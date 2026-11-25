import {useMemo} from 'react';
import {crownTimelineModel} from '../domain/government/crownTimelineModel.js';
import CrownTimelineView from './CrownTimelineView.jsx';

export default function CrownTimeline({persona,accesos=[],...props}) {
 // The accessions derive from the person; callers build a new array on each render.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 const model=useMemo(()=>crownTimelineModel(persona,accesos),[persona]);
 return <CrownTimelineView persona={persona} model={model} {...props}/>;
}
