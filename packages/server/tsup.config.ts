import { glob } from 'glob'
import { defineConfig } from 'tsup'

const workerFiles = await glob('src/**/*.worker.ts')

export default defineConfig({
  clean: true,
  entry: ['src/index.ts', ...workerFiles],
  format: 'esm',
  external: ['electron'],
})
