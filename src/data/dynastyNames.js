// Historical names and existing Atlas links keep resolving after a more
// precise house name is adopted. This module has no display dependencies.
export const DINASTIA_ALIASES = Object.freeze({
  'Capeto-Évreux':'Évreux',
  'Montfort':'Montfort-Bretaña',
  'Monfort':'Montfort-Bretaña',
  'Dreux-Montfort':'Montfort-Bretaña',
  'Alfonsina':'Borgoña-Portugal',
  'Afonsina':'Borgoña-Portugal',
});

export const dynastyAliasesFor = name => Object.entries(DINASTIA_ALIASES)
  .filter(([,target])=>target===name).map(([alias])=>alias);
