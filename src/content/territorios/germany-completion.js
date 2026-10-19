import review from '../../../data/cartography/germany-completion-review.json' with {type:'json'};
export default Object.fromEntries(Object.entries(review.entities).map(([name,entity]) =>
  [name,{resumen:entity.resumen,evolucion:entity.evolucion}]));
