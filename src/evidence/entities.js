// Distinct IDs stop identical words from implying identical historical concepts.
export const ENTITY_KINDS = Object.freeze(['person','dynasty','territory','politicalEntity','crown','title','office','government','event']);
export const entityId = (kind, id) => `${kind}:${id}`;

export function buildEntityIndex(people, territories, events = []) {
  const entities = new Map();
  const add = (kind, id, label, extra = {}) => {
    if (!id) return;
    const key = entityId(kind,id);
    if (!entities.has(key)) entities.set(key,{id:key,kind,label,...extra});
  };
  for (const [name, territory] of Object.entries(territories)) {
    add('territory',name,name,{nature:territory.naturaleza});
    if (['entidad','compuesta'].includes(territory.naturaleza)) add('politicalEntity',name,name,{territory:entityId('territory',name),class:territory.clase});
    if (territory.clase?.startsWith('corona')) add('crown',name,name,{politicalEntity:entityId('politicalEntity',name)});
  }
  for (const person of people) {
    add('person',person.id,person.nombre);
    add('dynasty',person.dinastia,person.dinastia);
    add('title',person.titulo,person.titulo);
    for (const government of person.gobiernos || person.reinados || []) {
      const id = `${person.id}:${government.territorio}:${government.desde}:${government.titulo}`;
      add('government',id,`${person.nombre} · ${government.territorio}`,{
        person:entityId('person',person.id), territory:entityId('territory',government.territorio),
        politicalEntity:entityId('politicalEntity',government.territorio), title:entityId('title',government.titulo),
        from:government.desde,to:government.hasta,
      });
      if (['gobierno','regencia','estatuderato','cargo'].includes(government.clase)) add('office',government.titulo,government.titulo);
    }
  }
  for (const event of events) add('event',event.id,event.titulo,{year:event.anio});
  return entities;
}
