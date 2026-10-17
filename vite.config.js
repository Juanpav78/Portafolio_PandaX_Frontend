import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
