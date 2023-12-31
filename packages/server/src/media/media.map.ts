import { Media } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import { fromUnixTime } from '~/utils/date'
import { encode } from '~/utils/id'

function parseDate<T extends number | null>(val: T) {
  if (val == null) {
    return null as T
  }

  return fromUnixTime(val).getTime() as T
}

export default function map(data: MediaEntity) {
  const media: Media = {
    ...data,
    id: encode(data.id),
    libraryId: encode(data.libraryId),
    createdAt: parseDate(data.createdAt),
    fileCreatedAt: parseDate(data.fileCreatedAt),
    fileLastUpdatedAt: parseDate(data.fileLastUpdatedAt),
    art: data.art ? JSON.parse(data.art) : null,
    matches: data.matches ? JSON.parse(data.matches) : null,
    streams: data.streams ? JSON.parse(data.streams) : null,
    metadata: data.metadata ? JSON.parse(data.metadata) : null,
    children: null,
  }

  return media
}
