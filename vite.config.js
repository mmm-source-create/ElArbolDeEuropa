import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

// Research data is kept indented in the repository for review; `?url` emits
// it verbatim. The Atlas downloads and parses it on load, so ship it compact.
const minifyJsonAssets = () => ({
  name: 'minify-json-assets',
  apply: 'build',
  generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== 'asset' || !asset.fileName.endsWith('.json') || asset.fileName.startsWith('.vite/')) continue;
      const text = typeof asset.source === 'string' ? asset.source : new TextDecoder().decode(asset.source);
      asset.source = JSON.stringify(JSON.parse(text));
    }
  },
});

// The cartographic laboratory is a real published entry, with its source
// imports and map assets bundled by the same build as the Atlas.
export default defineConfig({
  plugins: [minifyJsonAssets()],
  build: {
    // Public profiles and the Atlas share chunks. Keep module initialization
    // in source order so a lazy profile cannot call an uninitialized icon factory.
    rolldownOptions: {output: {strictExecutionOrder: true}},
  },
  input: {
    main: fileURLToPath(new URL('./index.html', import.meta.url)),
    mosaic: fileURLToPath(new URL('./labs/cartography/territorial-corridors.html', import.meta.url)),
  },
});
