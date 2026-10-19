import review from '../../../data/cartography/germany-completion-review.json' with {type:'json'};
export const GERMANY_COMPLETION_TERRITORIES = Object.freeze(Object.fromEntries(
  Object.entries(review.entities).map(([name,{clase,naturaleza,componentes,nota}]) =>
    [name,{clase,naturaleza,componentes,nota}])
));
