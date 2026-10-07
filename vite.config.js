import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

// The cartographic laboratory is a real published entry, with its source
// imports and map assets bundled by the same build as the Atlas.
export default defineConfig({
  input: {
    main: fileURLToPath(new URL('./index.html', import.meta.url)),
    mosaic: fileURLToPath(new URL('./prototypes/euv-locations/territorial-corridors.html', import.meta.url)),
  },
});
