import { UtilityProcess, app, utilityProcess } from 'electron'
import logger, { Logger } from 'logger'
import { getEventChannel } from '~/event/channel'

// for a process manager:
// https://github.com/weinand/vscode-processes/blob/master/src/ps.ts

type WorkerOptions = {
  name: string
  path: string
}

class Worker {
  #pid: number | null = null

  log: Logger
  name: string
  path: string
  process: UtilityProcess | null = null

  constructor({ name, path }: WorkerOptions) {
    this.name = name
    this.path = path
    this.log = logger(this.name)
  }

  get id() {
    const { metrics } = this

    return `${this.#pid}.${metrics.at(0)?.creationTime}`
  }

  get metrics() {
    return app.getAppMetrics()
  }

  start() {
    const { log } = this

    log.info(`Starting worker "${this.name}"`)

    const infoLogger = (msgs: string[]) => {
      msgs.map((msg) => log.info(msg))
    }

    const errLogger = (msgs: string[]) => {
      log.error(`Error in "${this.name}"`, new Error(msgs.join(' ')))
    }

    this.process = utilityProcess.fork(this.path, [], {
      stdio: 'pipe',
      serviceName: this.name,
    })

    this.#pid = this.process.pid ?? null

    this.process.stdout?.on('data', createLogHandler(infoLogger))
    this.process.stderr?.on('data', createLogHandler(errLogger))

    channel.emit('start', this.name)

    this.process.once('exit', () => {
      log.info(`Exiting "${this.name}"`)

      this.stop()
    })
  }

  stop() {
    this.process?.stdout?.removeAllListeners('data')
    this.process?.stderr?.removeAllListeners('data')

    const success = this.process?.kill()

    if (!success) {
      this.log.error(`Unable to kill utility process "${this.name}"!`)
    } else {
      channel.emit('stop', this.name)
    }
  }
}

function createLogHandler(onEachLineCallback: (msgs: string[]) => void) {
  return function handleLogMessage(arg: Uint8Array) {
    onEachLineCallback(toLines(arg))
  }
}

export function createWorker(opts: WorkerOptions) {
  return new Worker(opts)
}

function toLines(data: Uint8Array) {
  const decoded = decoder.decode(data)

  return decoded
    .replaceAll('\r', '')
    .split('\n')
    .filter((s) => typeof s === 'string' && s.trim() !== '')
}

const channel = getEventChannel('worker')
const decoder = new TextDecoder()
