import {createRoot} from 'react-dom/client';
import Dinastle from '../../src/features/desafio/Dinastle.jsx';
import {PERSONAS} from '../../src/data/personas.js';
export function mount(node){const root=createRoot(node);root.render(<Dinastle people={PERSONAS} onBack={()=>{}}/>);return root;}
