import fs from 'node:fs/promises'
import path from 'node:path'
import envPaths, { Paths as EnvPaths } from 'env-paths'

export type Paths = EnvPaths & {
  db: string
  cache: string
  log: string
}

const paths = envPaths('@neon', {
  suffix: '',
}) as Paths

export default paths

paths.db = path.join(paths.data, 'databases')
paths.cache = path.join(paths.data, 'cache')
paths.log = path.join(paths.log, 'neon.log')

for await (const p of [paths.db, paths.cache]) {
  await fs.mkdir(p, {
    recursive: true,
  })
}
