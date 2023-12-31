import process from 'node:process'
import logger from 'logger'
import paths from '~/config/paths'
import '~/env'
import { ffmpegVersion, ffprobeVersion } from '~/ffmpeg'
import '~/log/log.service'
import '~/match/match.service'
import '~/tray/tray.service'
import { version } from '../package.json'
import { createWorker } from './worker'

await logger.init(paths.log)

const log = logger('server.index')

const { chrome, electron, openssl, uv, v8 } = process.versions

log.info('Versions: ', {
  neon: version,
  electron,
  chrome,
  ffmpeg: await ffmpegVersion(),
  ffprobe: await ffprobeVersion(),
  openssl,
  uv,
  v8,
})

createWorker({
  name: 'library.worker',
  path: './dist/library/library.worker.js',
}).start()
