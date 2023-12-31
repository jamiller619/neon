import { Stats } from 'node:fs'
import { filenameParse } from '@ctrl/video-filename-parser'
import { titleCase } from 'title-case'
import { VideoData } from '@neon/shared/data'
import { LibraryTypes, MediaType } from '@neon/shared/enums'
import { Media } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import probe from '~/media/media.probe'
import {
  IMediaScanner,
  MediaScannerBase,
  MediaScannerStatic,
} from '~/scanner/media.scanner'

export const VideoScanner: MediaScannerStatic = class
  extends MediaScannerBase
  implements IMediaScanner
{
  static match() {
    return [
      LibraryTypes.Movie,
      LibraryTypes.Clip,
      LibraryTypes.HomeVideo,
      LibraryTypes.TVShow,
      LibraryTypes.MusicVideo,
    ]
  }

  async create(
    filePath: string,
    stats?: Stats,
    parentId?: number,
  ): Promise<Omit<MediaEntity, 'id' | 'matches' | 'art' | 'title' | 'slug'>> {
    const created = await super.create(filePath, stats, parentId)
    const data = await parseData(filePath, created.type)

    return {
      ...created,
      data,
    }
  }

  async update(
    filePath: string,
    record: Media,
    stats?: Stats,
    parentId?: number,
  ): Promise<Partial<MediaEntity>> {
    const updated = await super.update(filePath, record, stats, parentId)
    const data = await parseData(
      filePath,
      record.type,
      record.data as VideoData,
    )

    return {
      ...updated,
      data: JSON.stringify(data),
    }
  }

  parseTitle(filePath: string) {
    const parsed = filenameParse(
      this.fileName(filePath),
      this.library.libraryType === LibraryTypes.TVShow,
    )

    if (parsed.title) return titleCase(parsed.title)

    return super.parseTitle(filePath)
  }
}

async function parseData(
  filePath: string,
  mediaType: MediaType,
  existingData?: VideoData,
) {
  const data: VideoData = {
    ...existingData,
    streams: (await probe(filePath, mediaType)).streams ?? null,
  }

  return JSON.stringify(data)
}
