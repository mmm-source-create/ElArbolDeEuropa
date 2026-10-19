import review from '../../../data/cartography/german-swiss-expansion-review.json' with {type:'json'};
// Public entities share the reviewed names used by the map; map anchors are not foundation dates.
export const GERMAN_SWISS_TERRITORIES = Object.freeze(Object.fromEntries(
  Object.entries(review.entities).filter(([,entity]) => !entity.existing)
    .map(([name,{clase,naturaleza,componentes,nota}]) =>
      [name,{clase,naturaleza,componentes,nota}])
));
