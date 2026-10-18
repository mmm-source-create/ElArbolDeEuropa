import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAS} from '../src/data/personas.js';
import {gobiernosDe} from '../src/domain/genealogy/personAccessors.js';
import {mandateIdentity, identityLabel} from '../src/cartography/territorialNames.js';
import {territorialIdentity, territorialLabel} from '../src/cartography/territorialIdentity.js';

// Las fichas resuelven los territorios de mandato sin cargar las rutas regionales. Si un mandato nuevo usa un nombre
// que solo identifica una ruta regional, añade su alias editorial en territorialNames.js.
test('los territorios de mandato tienen la misma identidad y etiqueta con y sin las rutas regionales', () => {
  const territories = [...new Set(PERSONAS.flatMap(person => gobiernosDe(person).map(mandate => mandate.territorio)).filter(Boolean))];
  assert.ok(territories.length > 100);
  for (const territory of territories) {
    assert.equal(mandateIdentity(territory), territorialIdentity(territory), territory);
    for (const year of [1200, 1360, 1500, 1570, 1701, 1765, 1792])
      assert.equal(identityLabel(mandateIdentity(territory), year), territorialLabel(territory, year), `${territory} ${year}`);
  }
});
