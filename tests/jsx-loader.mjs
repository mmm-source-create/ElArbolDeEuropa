// Usa el transformador que ya incluye Vite; no necesita servidor ni navegador.
import {registerHooks} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {transformSync} from 'rolldown/utils';
registerHooks({
  load(url,context,nextLoad) {
    if(url.endsWith('.css'))return {format:'module',source:'export default {};',shortCircuit:true};
    // Public pages import generated JSON through Vite. Keep their real SSR
    // component testable in Node without changing the production imports.
    if(url.endsWith('.json'))return {format:'json',source:readFileSync(fileURLToPath(url),'utf8'),shortCircuit:true};
    if(url.endsWith('.jsx')) {
      const path=fileURLToPath(url);
      const result=transformSync(path,readFileSync(path,'utf8').replaceAll('import.meta.env.', '({}).'),{lang:'jsx',jsx:{runtime:'automatic'}});
      if(result.errors?.length)throw new Error(result.errors.map(e=>e.message).join('\n'));
      return {format:'module',source:result.code,shortCircuit:true};
    }
    return nextLoad(url,context);
  },
});
