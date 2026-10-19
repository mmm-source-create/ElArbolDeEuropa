import review from '../../../data/cartography/german-swiss-expansion-review.json' with {type:'json'};
export default Object.fromEntries(Object.entries(review.entities).map(([name,entity]) =>
  [name,{resumen:entity.resumen,evolucion:entity.evolucion}]));
