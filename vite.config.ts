import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  // Tailwind v4 é processado pelo plugin @tailwindcss/vite — desabilitamos o
  // auto-discovery do PostCSS para evitar que o Vite tente carregar configs
  // remanescentes (ex.: postcss.config.* de um setup Next.js anterior).
  css: {
    postcss: {},
  },
  server: {
    host: true,
    port: 5173,
  },
})
