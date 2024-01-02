import { UtilityProcess, utilityProcess } from 'electron'
import logger, { Logger } from 'logger'

type TaskOptions = {
  name: string
  path: string
}

export class Task {
  name: string
  path: string
  process: UtilityProcess | null = null
  log: Logger

  get pid() {
    return this.process?.pid
  }

  constructor({ name, path }: TaskOptions) {
    this.name = name
    this.path = path
    this.log = logger(this.name)
  }

  start(...args: string[]) {
    this.process = utilityProcess.fork(this.path, args, {
      stdio: 'pipe',
      serviceName: this.name,
    })

    this.process.stdout?.on('data', (data: Uint8Array) => {
      for (const msg of toLines(data)) {
        this.log.info(msg)
      }
    })

    this.process.stderr?.on('data', (data: Uint8Array) => {
      for (const msg of toLines(data)) {
        this.log.error(msg)
      }
    })

    this.process.once('exit', () => {
      this.log.info(`Exiting task`)

      this.cleanup()
    })
  }

  cleanup() {
    this.process?.stdout?.removeAllListeners('data')
    this.process?.stderr?.removeAllListeners('data')
  }

  toJSON() {
    return {
      name: this.name,
      path: this.path,
    }
  }
}

function toLines(data: Uint8Array) {
  const decoded = decoder.decode(data)

  return decoded
    .replaceAll('\r', '')
    .split('\n')
    .filter((s) => typeof s === 'string' && s.trim() !== '')
}

const decoder = new TextDecoder()
