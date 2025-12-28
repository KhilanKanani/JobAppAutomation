import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from "@tailwindcss/vite"

// vite.config.js
export default defineConfig({
  plugins: [react(), tailwind()],
});
