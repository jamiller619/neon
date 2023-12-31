import { Stats } from 'node:fs'
import chokidar, { FSWatcher } from 'chokidar'
import { Library } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import map from '~/media/media.map'
import { MediaRepository } from '~/media/media.repository'
import { MediaScannerBase, scanners } from '~/scanner'
import { IMediaScanner } from '~/scanner/media.scanner'
import { fromUnixTime } from '~/utils/date'
import { slugify } from '~/utils/string'

// export class LibraryAgent {
//   library: Library
//   #agent: IMediaAgent | null = null

//   constructor(library: Library) {
//     this.library = library
//   }

//   get agent() {
//     if (this.#agent) {
//       return this.#agent
//     }

//     const Agent = agents.find((a) => a.match(this.library)) ?? MediaAgentBase

//     return (this.#agent = new Agent(this.library) as IMediaAgent)
//   }
// }

export class LibraryScanner {
  library: Library
  watcher: FSWatcher
  ready: Promise<void>

  #scanner: IMediaScanner | null = null

  get scanner() {
    if (this.#scanner) {
      return this.#scanner
    }

    const Scanner =
      scanners.find((s) => s.match(this.library)) ?? MediaScannerBase

    return (this.#scanner = new Scanner(this.library))
  }

  constructor(library: Library) {
    const name = `"${library.name}"`
    this.library = library
    this.watcher = chokidar.watch(this.library.folders)

    this.ready = new Promise((resolve) => {
      this.watcher.on('ready', resolve)
    })

    this.watcher.on('add', this.upsert.bind(this))

    this.watcher.on('addDir', async (dirPath, stats) => {
      // No need to act on root directories
      if (!library.folders.includes(dirPath)) {
        await this.upsert(dirPath, stats)
      }
    })

    this.watcher.on('unlink', async (filePath) => {
      await MediaRepository.deleteByPath(filePath)
    })

    this.watcher.on('unlinkDir', async (dirPath) => {
      if (library.folders.includes(dirPath)) {
        this.watcher.unwatch(dirPath)
      }

      await MediaRepository.deleteByPath(dirPath)
    })

    this.watcher.on('error', (err) => {
      console.error(`Error in library scanner ${name}: ${err.message}`)
    })
  }

  async upsert(filePath: string, stats?: Stats) {
    const record = await MediaRepository.findByPath(filePath)

    if (record) {
      await this.update(filePath, record, stats)
    } else {
      await this.insert(filePath, stats)
    }
  }

  async update(filePath: string, record: MediaEntity, stats?: Stats) {
    const ctime = record.fileLastUpdatedAt
      ? fromUnixTime(record.fileLastUpdatedAt)
      : undefined

    if (ctime === stats?.ctime) return

    const updated = await this.scanner.update(filePath, map(record), stats)

    await MediaRepository.update(record.id, updated)
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

  close() {
    return this.watcher.close()
  }
}
