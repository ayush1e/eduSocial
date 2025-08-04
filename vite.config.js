import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  const isGitHubPages = process.env.DEPLOY_TARGET === 'github'

  return {
    plugins: [react()],
    server: {
      port: 5173, // Use standard Vite port
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    base: isGitHubPages ? '/eduSocial/' : '/'
  }
})
