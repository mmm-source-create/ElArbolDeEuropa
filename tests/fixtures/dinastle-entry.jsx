import React from 'react';
import {createRoot} from 'react-dom/client';
import Dinastle from '../../src/desafio/Dinastle.jsx';
import {PERSONAS} from '../../src/personas.jsx';
export function mount(node){const root=createRoot(node);root.render(<Dinastle people={PERSONAS} onBack={()=>{}}/>);return root;}
