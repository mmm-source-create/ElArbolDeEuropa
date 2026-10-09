import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';

// The cartographic laboratory is a real published entry, with its source
// imports and map assets bundled by the same build as the Atlas.
export default defineConfig({
  // Las fichas se hidratan desde entradas dinámicas. Preservar el orden de
  // inicialización evita ciclos entre chunks compartidos de React e iconos.
  // El build existente de Vercel conserva su configuración.
  build: process.env.VITE_HOSTING_PROVIDER === 'cloudflare' ? {
    rolldownOptions: {output: {strictExecutionOrder: true}},
  } : undefined,
  input: {
    main: fileURLToPath(new URL('./index.html', import.meta.url)),
    mosaic: fileURLToPath(new URL('./prototypes/euv-locations/territorial-corridors.html', import.meta.url)),
  },
});
