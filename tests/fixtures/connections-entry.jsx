import React from 'react';
import {createRoot} from 'react-dom/client';
import Explorer from '../../src/Explorer.jsx';
export function mountAtlas(container,treeBase){const root=createRoot(container);root.render(<Explorer treeBase={treeBase}/>);return root;}
import {PERSONAS} from '../../src/personas.jsx';
import {BY_ID,HIJOS_POR_ID} from '../../src/explorer/model.js';
import {computeGenerations,buildRows,computeTreeLayout} from '../../src/explorer/treeLayout.js';
export function makeTreeBase(){const gen=computeGenerations(PERSONAS),rows=buildRows(PERSONAS,gen);return {gen,rows,layout:computeTreeLayout(rows,BY_ID,HIJOS_POR_ID)};}
