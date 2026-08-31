import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const dependency = (path: string) => fileURLToPath(new URL(`./node_modules/${path}`, import.meta.url))

export default defineConfig(({ command }) => {
  const variant = command === 'build' ? 'production' : 'development'
  return {
    plugins: [react()],
    base: process.env.VITE_BASE_PATH || './',
    resolve: {
      alias: [
        { find: /^react\/jsx-dev-runtime$/, replacement: dependency(`react/cjs/react-jsx-dev-runtime.${variant}.js`) },
        { find: /^react\/jsx-runtime$/, replacement: dependency(`react/cjs/react-jsx-runtime.${variant}.js`) },
        { find: /^react-dom\/client$/, replacement: dependency(`react-dom/cjs/react-dom-client.${variant}.js`) },
        { find: /^react-dom$/, replacement: dependency(`react-dom/cjs/react-dom.${variant}.js`) },
        { find: /^react$/, replacement: dependency(`react/cjs/react.${variant}.js`) },
        { find: /^scheduler$/, replacement: dependency(`scheduler/cjs/scheduler.${variant}.js`) },
      ],
    },
  }
})

