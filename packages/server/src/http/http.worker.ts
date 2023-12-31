#!/usr/bin/env node
import http from 'node:http'
import path from 'node:path'
import express from 'express'
import logger from 'logger'
import config from '~/config'
import { sessionMiddleware } from '~/session/session.service'
import open from '~/utils/open'
import apiRouter from './api.router'

const log = logger('http.service')
const app = express()

const PORT = config.get('http.port')
const ADMIN_ROOT_URL = `http://localhost:${PORT}`
const ADMIN_URL = `${ADMIN_ROOT_URL}/app`
const SERVER_ROOT = path.join(process.cwd(), '../admin/src')
const INDEX_HTML = path.join(SERVER_ROOT, 'index.html')
const ASSETS_PATH = path.join(process.cwd(), 'src', 'assets')

log.info(`Starting http server with config: `, {
  PORT,
  ADMIN_URL,
  SERVER_ROOT,
  INDEX_HTML,
  ASSETS_PATH,
})

app.set('x-powered-by', false)

app.use(sessionMiddleware)

app.use('/assets', express.static(ASSETS_PATH))
app.use('/api', apiRouter)

app.get('/app*', (_, res) => res.sendFile(INDEX_HTML))

const server = http.createServer(app)

server.listen(PORT, async () => {
  log.info(`HTTP server listening @ ${ADMIN_ROOT_URL}`)

  if (config.get('admin.autoLaunch')) {
    await open(ADMIN_URL)
  }
})
