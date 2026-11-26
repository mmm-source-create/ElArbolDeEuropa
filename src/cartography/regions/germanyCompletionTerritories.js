import review from '../../../data/cartography/germany-completion-review.json' with {type:'json'};
// 6.3.5: dated stages (a county raised to principality) stay on the record.
export const GERMANY_COMPLETION_TERRITORIES = Object.freeze(Object.fromEntries(
  Object.entries(review.entities).map(([name,{clase,naturaleza,componentes,nota,etapas}]) =>
    [name,{clase,naturaleza,componentes,nota,...(etapas?{etapas}:{})}])
));
