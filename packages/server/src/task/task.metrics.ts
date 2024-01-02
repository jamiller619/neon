import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { totalmem } from 'node:os'
import process from 'node:process'
import { Logger } from 'logger'

type TaskMetricsData = {
  time: number
  name: string
  pid: number
  ppid: number
  mem: string

  children?: TaskMetricsData[]
}

function isWindows() {
  return process.platform === 'win32'
}

export class TaskMetrics {
  #pid: number
  #root: TaskMetricsData | null = null
  log: Logger
  data = new Map<number, TaskMetricsData>()

  constructor(pid: number, logger: Logger) {
    this.#pid = pid
    this.log = logger
  }

  async capture() {
    return new Promise((resolve, reject) => {
      const proc = isWindows() ? this.#parseWindows() : this.#parseUnix()

      proc.on('error', (err) => reject(err))
      proc.stderr.setEncoding('utf8')
      proc.stderr.on('data', (data) => reject(data.toString()))

      proc.once('close', () => resolve(this.#root))
      proc.once('exit', (code, signal) => {
        if (code != null && code > 0) {
          reject(`Task terminated with exit code: ${code}`)
        }

        if (signal) {
          reject(`Task terminated with signal: ${signal}`)
        }
      })
    })
  }

  cleanup(proc: ChildProcessWithoutNullStreams) {
    proc.removeAllListeners('error')
    proc.stderr.removeAllListeners('data')
  }

  #addToTree(pid: number, ppid: number, cmd: string, mem: string) {
    const parent = this.data.get(ppid)

    if (pid === this.#pid) {
      const data: TaskMetricsData = {
        name: findName(cmd),
        pid,
        ppid,
        mem,
        time: Date.now(),
      }

      this.data.set(pid, data)
      this.#root = data

      if (parent) {
        if (!parent.children) {
          parent.children = []
        }

        parent.children.push(data)
      }
    }
  }

  #parseUnix() {
    const CMD_PAT =
      /^\s*([0-9]+)\s+([0-9]+)\s+([0-9]+\.[0-9]+)\s+([0-9]+\.[0-9]+)\s+(.+)$/

    const TOTAL_MB = totalmem() / 1024 / 1024

    const proc = spawn('/bin/ps', [
      '-ax',
      '-o',
      'pid=,ppid=,pcpu=,pmem=,command=',
    ])

    proc.stdout.setEncoding('utf8')
    proc.stdout.on(
      'data',
      lines((line) => {
        const matches = CMD_PAT.exec(line.trim())
        if (matches && matches.length === 6) {
          const mb = (TOTAL_MB / 100) * parseFloat(matches[4])
          const pid = parseInt(matches[1])
          //if (pid !== p.pid) {
          this.#addToTree(
            pid,
            parseInt(matches[2]),
            matches[5],
            mb.toFixed(2) + 'MB',
          )
          //}
        }
      }),
    )

    return proc
  }

  #parseWindows() {
    const CMD_PAT1 = /^(.+)\s+([0-9]+)\s+([0-9]+)\s+([0-9]+)$/
    const CMD_PAT2 = /^([0-9]+)\s+([0-9]+)$/

    const proc = spawn('wmic', [
      'process',
      'get',
      'CommandLine,ParentProcessId,ProcessId,WorkingSetSize',
    ])

    proc.stdout.setEncoding('utf8')
    proc.stdout.on(
      'data',
      lines((line) => {
        line = line.trim()
        const matches = CMD_PAT1.exec(line)

        if (matches && matches.length === 5) {
          const mem = parseInt(matches[4]) / 1024 / 1024

          this.#addToTree(
            parseInt(matches[3]),
            parseInt(matches[2]),
            matches[1].trim(),
            mem.toFixed(2) + 'MB',
          )
        }
      }),
    )

    return proc
  }
}

function findName(cmd: string): string {
  const RENDERER_PROCESS_HINT = /--disable-blink-features=Auxclick/
  const WINDOWS_WATCHER_HINT = /\\watcher\\win32\\CodeHelper\.exe/
  const WINDOWS_CRASH_REPORTER = /--crashes-directory/
  const WINDOWS_PTY = /\\pipe\\winpty-control/
  const WINDOWS_CONSOLE_HOST = /conhost\.exe/
  const TYPE = /--type=([a-zA-Z-]+)/

  // remove leading device specifier

  const cleanUNCPrefix = (value: string): string => {
    if (value.indexOf('\\\\?\\') === 0) {
      return value.substr(4)
    } else if (value.indexOf('\\??\\') === 0) {
      return value.substr(4)
    } else if (value.indexOf('"\\\\?\\') === 0) {
      return '"' + value.substr(5)
    } else if (value.indexOf('"\\??\\') === 0) {
      return '"' + value.substr(5)
    } else {
      return value
    }
  }

  cmd = cleanUNCPrefix(cmd)

  // find windows file watcher
  if (WINDOWS_WATCHER_HINT.exec(cmd)) {
    return 'watcherService'
  }

  // find windows crash reporter
  if (WINDOWS_CRASH_REPORTER.exec(cmd)) {
    return 'electron-crash-reporter'
  }

  // find windows pty process
  if (WINDOWS_PTY.exec(cmd)) {
    return 'winpty-process'
  }

  //find windows console host process
  if (WINDOWS_CONSOLE_HOST.exec(cmd)) {
    return 'console-window-host (Windows internal process)'
  }

  // find "--type=xxxx"
  let matches = TYPE.exec(cmd)
  if (matches && matches.length === 2) {
    if (matches[1] === 'renderer') {
      if (!RENDERER_PROCESS_HINT.exec(cmd)) {
        return 'shared-process'
      }
      return `renderer`
    }
    return matches[1]
  }

  // find all xxxx.js
  const JS = /[a-zA-Z-]+\.js/g
  let result = ''
  do {
    matches = JS.exec(cmd)
    if (matches) {
      result += matches + ' '
    }
  } while (matches)

  if (result) {
    if (cmd.indexOf('node ') < 0 && cmd.indexOf('node.exe') < 0) {
      return `electron_node ${result}`
    }
  }
  return cmd
}

function lines(callback: (arg: string) => void) {
  let unfinished = '' // unfinished last line of chunk

  return (data: string | Buffer) => {
    const lines = data.toString().split(/\r?\n/)
    const finishedLines = lines.slice(0, lines.length - 1)
    finishedLines[0] = unfinished + finishedLines[0] // complete previous unfinished line
    unfinished = lines[lines.length - 1] // remember unfinished last line of this chunk for next round
    for (const s of finishedLines) {
      callback(s)
    }
  }
}
