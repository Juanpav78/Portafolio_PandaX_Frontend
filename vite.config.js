import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import seo from './vite-plugin-seo.js'

// https://vite.dev/config/
export default defineConfig({
  // El admin y el login no deben aparecer en Google
  plugins: [react(), tailwindcss(), seo({ rutas: ['/', '/proyectos'], bloquear: ['/admin', '/login', '/recover-password'] })],
  // El admin se carga bajo demanda y es el único que usa algunos paquetes de iconos: si Vite los
  // descubre recién al abrir el panel, re-empaqueta en caliente y la página falla con
  // "Failed to fetch dynamically imported module" hasta recargar. Así se empaquetan al arrancar.
  optimizeDeps: {
    include: [
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/free-regular-svg-icons',
      '@fortawesome/free-brands-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
  build: {
    rolldownOptions: {
      output: {
        // Las librerías van en chunks separados para que el navegador las cachee entre despliegues
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\/](react|react-dom|react-router|scheduler|cookie|set-cookie-parser)[\/]/ },
            { name: 'motion', test: /node_modules[\/](framer-motion|motion-dom|motion-utils)[\/]/ },
            { name: 'vendor', test: /node_modules[\/]/ },
          ],
        },
      },
    },
  },
})
