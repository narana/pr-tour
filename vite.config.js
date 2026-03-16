import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages deploys to https://<user>.github.io/<repo>/
// Set VITE_BASE in the workflow, or default to '/' for local dev.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
