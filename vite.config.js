import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

// The cartographic laboratory is a real published entry, with its source
// imports and map assets bundled by the same build as the Atlas.
export default defineConfig({
  build: {
    // Public profiles and the Atlas share chunks. Keep module initialization
    // in source order so a lazy profile cannot call an uninitialized icon factory.
    rolldownOptions: {output: {strictExecutionOrder: true}},
  },
  input: {
    main: fileURLToPath(new URL('./index.html', import.meta.url)),
    mosaic: fileURLToPath(new URL('./prototypes/euv-locations/territorial-corridors.html', import.meta.url)),
  },
});
