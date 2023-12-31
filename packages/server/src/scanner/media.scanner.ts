import { Stats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fromFile } from 'file-type'
import { titleCase } from 'title-case'
import { MediaType, MediaTypes } from '@neon/shared/enums'
import { Data, Library, Media } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import { MediaRepository } from '~/media/media.repository'
import { toUnixTime } from '~/utils/date'
import { decode } from '~/utils/id'

// This is the "static" interface
export type MediaScanner = {
  new (library: Library): IMediaScanner

  displayName: string
  match: (library: Library) => boolean
}

// It's more helpful to think of the "I" as "Instance",
// rather than "Interface".
export interface IMediaScanner {
  library: Library
  parseTitle(filePath: string): string | Promise<string>
  fileName(filePath: string): string
  getData<T extends MediaType | null = null>(filePath: string): Promise<Data<T>>
  create(
    filePath: string,
    stats?: Stats,
    parentId?: number,
  ): Promise<Omit<MediaEntity, 'id' | 'art' | 'matches' | 'title' | 'slug'>>
  update(
    filePath: string,
    record: Media,
    stats?: Stats,
    parentId?: number,
  ): Promise<Partial<MediaEntity>>
  remove(filePath: string): Promise<void>
}

export const MediaScannerBase: MediaScanner = class implements IMediaScanner {
  library: Library

  static displayName = 'MediaScanner'
  static match(_: Library) {
    return true
  }

  constructor(library: Library) {
    this.library = library
  }

  getData<T extends MediaType | null = null>(_: string) {
    return Promise.resolve({} as Data<T>)
  }

  fileName(filePath: string) {
    return path.basename(filePath, path.extname(filePath))
  }

  parseTitle(filePath: string) {
    return titleCase(this.fileName(filePath))
  }

  async create(filePath: string, stats?: Stats, parentId?: number) {
    const resolvedStats = stats ?? (await fs.stat(filePath))
    const mime = await parseMimeType(filePath, resolvedStats)

    if (!mime) {
      throw new TypeError(`Unsupported media type for "${filePath}"`)
    }

    const data: Omit<MediaEntity, 'id' | 'art' | 'matches' | 'title' | 'slug'> =
      {
        createdAt: toUnixTime(),
        fileCreatedAt: toUnixTime(resolvedStats.birthtime.getTime()),
        fileLastUpdatedAt: toUnixTime(resolvedStats.ctime.getTime()),
        fileSize: parseFileSize(resolvedStats.size),
        path: filePath,
        type: mime.type,
        subType: mime.subType,
        libraryId: decode(this.library.id),
        metadata: null,
        data: null,
        parentMediaId: parentId ?? null,
      }

    return data
  }

  async update(filePath: string, record: Media, stats?: Stats) {
    const resolvedStats = stats ?? (await fs.stat(filePath))
    const data: Partial<MediaEntity> = {
      fileCreatedAt: toUnixTime(resolvedStats.birthtime.getTime()),
      fileLastUpdatedAt: toUnixTime(resolvedStats.ctime.getTime()),
      fileSize: parseFileSize(resolvedStats.size),
    }

    return data
  }

  async remove(filePath: string) {
    await MediaRepository.deleteByPath(filePath)
  }
}

function parseFileSize(size: number) {
  if (size < 1) {
    return null
  }

  return size
}

type MimeType = {
  type: MediaType
  subType: string
}

async function parseMimeType(
  filePath: string,
  stats: Stats,
): Promise<MimeType | undefined> {
  if (stats.isDirectory()) {
    return {
      type: MediaTypes.Application,
      subType: 'x.folder',
    }
  }

  const fileType = await fromFile(filePath)

  if (!fileType) return undefined

  const [type, subType] = fileType.mime.split('/') as [MediaType, string]

  return {
    type,
    subType,
  }
}
