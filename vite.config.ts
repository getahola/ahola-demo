import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` controls the public path the app is served from.
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/, so
// the CI build sets VITE_BASE=/<repo>/. Locally it defaults to '/'.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
