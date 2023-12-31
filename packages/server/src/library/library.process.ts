import { Stats } from 'node:fs'
import chokidar, { FSWatcher } from 'chokidar'
import { Library } from '@neon/shared/types'
import { agents } from '~/agent'
import { IMediaAgent, MediaAgentBase } from '~/agent/media.agent'
import { MediaEntity } from '~/db/entities'
import map from '~/media/media.map'
import { MediaRepository } from '~/media/media.repository'
import { scanners } from '~/scanner'
import { IMediaScanner } from '~/scanner/media.scanner'
import { fromUnixTime } from '~/utils/date'
import { slugify } from '~/utils/string'

export class LibraryBase {
  library: Library

  constructor(library: Library) {
    this.library = library
  }
}

export class LibraryProcess {
  #scanner: IMediaScanner | null = null
  #agent: IMediaAgent | null = null
  #watcher!: FSWatcher
  library: Library

  get scanner() {
    if (this.#scanner) {
      return this.#scanner
    }

    const Scanner = scanners.find((s) => s.match(this.library))

    if (!Scanner) {
      throw new Error(
        `Unable to find a valid scanner for library "${this.library.name}"`,
      )
    }

    return (this.#scanner = new Scanner(this.library))
  }

  get agent() {
    if (this.#agent) {
      return this.#agent
    }

    const Agent = agents.find((a) => a.match(this.library)) ?? MediaAgentBase

    return (this.#agent = new Agent(this.library) as IMediaAgent)
  }

  async insert(filePath: string, stats?: Stats) {
    const data = await this.scanner.create(filePath, stats)
    const title = await this.scanner.parseTitle(filePath)
    const slug = slugify(title)

    await MediaRepository.insert({
      ...data,
      title,
      slug,
    })
  }

  start() {
    const { library } = this
    const name = `"${library.name}"`

    this.#watcher = chokidar.watch(this.library.folders)

    this.#watcher.on('add', this.upsert.bind(this))

    this.#watcher.on('addDir', async (dirPath, stats) => {
      // No need to act on root directories
      if (!library.folders.includes(dirPath)) {
        await this.upsert(dirPath, stats)
      }
    })

    this.#watcher.on('unlink', async (filePath) => {
      await MediaRepository.deleteByPath(filePath)
    })

    this.#watcher.on('unlinkDir', async (dirPath) => {
      if (library.folders.includes(dirPath)) {
        this.#watcher.unwatch(dirPath)
      }

      await MediaRepository.deleteByPath(dirPath)
    })

    this.#watcher.on('error', (err) => {
      console.error(`Error in library scanner ${name}: ${err.message}`)
    })

    return new Promise((resolve) => {
      this.#watcher.once('ready', resolve)
    })
  }

  async stop() {
    const events = ['add', 'addDir', 'unlink', 'unlinkDir', 'error']

    for (const event of events) {
      this.#watcher.removeAllListeners(event)
    }

    await this.#watcher.close()
  }

  async update(filePath: string, record: MediaEntity, stats?: Stats) {
    const ctime = record.fileLastUpdatedAt
      ? fromUnixTime(record.fileLastUpdatedAt)
      : undefined

    if (ctime === stats?.ctime) return

    const updated = await this.scanner.update(filePath, map(record), stats)

    await MediaRepository.update(record.id, updated)
  }

  async upsert(filePath: string, stats?: Stats) {
    const record = await MediaRepository.findByPath(filePath)

    if (record) {
      await this.update(filePath, record, stats)
    } else {
      await this.insert(filePath, stats)
    }
  }
}
