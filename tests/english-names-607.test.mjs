import test from 'node:test';
import assert from 'node:assert/strict';
import {ENGLISH_DYNASTIES,ENGLISH_TERRITORIES} from '../src/features/english/entityTranslations.js';
import {englishLabel} from '../src/features/english/v6/atlasPresentation.js';
import {englishNameText} from '../src/features/english/nameCorrections.js';

test('the reviewed English names of houses and territories are consistent and keep their URLs',()=>{
 const d=key=>ENGLISH_DYNASTIES.find(e=>e.key===key),t=key=>ENGLISH_TERRITORIES.find(e=>e.key===key);
 for(const [key,name,slug] of [['Saboya','Savoy','saboya'],['Estuardo','Stuart','estuardo'],['Jagellón','Jagiellon','jagellon'],['Farnesio','Farnese','farnesio'],['Hannover','Hanover','hannover'],['Gran Comneno','Grand Komnenos','grand-comnene']]) {
  assert.equal(d(key).name,name);assert.equal(englishLabel(key),name);assert.equal(d(key).en,slug);
 }
 for(const [key,name,slug] of [['Palatinado','Palatinate','pallatin'],['Holanda','Holland','netherlands'],['Moldavia','Moldavia','moldova'],['Pallars Sobirà','Pallars Sobirà','pallars-sobira']]) {
  assert.equal(t(key).name,name);assert.equal(englishLabel(key),name);assert.equal(t(key).en,slug);
 }
 assert.equal(englishNameText('Countess of Pallars will be sober'),'Countess of Pallars Sobirà');
});
