import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { InlineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

function root(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

const config: InlineConfig = {
  root: root('src'),
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    manifest: true,
    target: 'esnext',
    modulePreload: {
      polyfill: false,
    },
    outDir: root('../server/dist/admin'),
    watch: process.argv.includes('-w') ? {} : undefined,
  },
}

export default config
