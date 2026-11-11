import {useMemo} from 'react';
import '../../styles/app.css';
import Desafio from '../desafio/Desafio.jsx';
import {PERSONAS} from '../../data/personas.js';
import {applyEnglishPersonPresentation} from './v6/atlasPresentation.js';

export default function EnglishChallenge() {
  const people=useMemo(()=>applyEnglishPersonPresentation(PERSONAS),[]);
  return <main className="desafio-page-main"><nav className="desafio-breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span aria-hidden="true">›</span><span aria-current="page">Challenge</span></nav><Desafio personas={people} locale="en"/></main>;
}
