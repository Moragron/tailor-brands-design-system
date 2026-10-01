// Dev server and build for the showcase app that Lovable previews in the design-system project.
// The components themselves are plain source: connected projects compile them with their own Vite setup.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: '::', port: 8080 },
});
