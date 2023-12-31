import path from 'node:path'
import logger from 'logger'
import sqlite from 'sqlite3'
import paths from '~/config/paths'
import { Database } from './database'
import schema from './schema.sql'

const log = logger('db.connect')

export const dbFile = path.join(paths.db, 'neon.db')

log.info(`Using database: ${dbFile}`)

const db = await new Promise<sqlite.Database>((resolve, reject) => {
  sqlite.cached.Database(dbFile, function onCreateCallback(err) {
    if (err) reject(err)

    this.exec(schema, (err) => {
      if (err) reject(err)

      resolve(this)
    })
  })
})

export default function connect() {
  return new Database(db)
}
