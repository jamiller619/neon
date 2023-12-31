import sql from 'sql-template-tag'
import { Page, Sort } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import filters, { createPagedResponse } from '~/db/filters'
import { Repository } from '~/db/repository'
import { OptionalId } from '~/db/types'
import { getEventChannel } from '~/event/channel'
import map from './media.map'

const channel = getEventChannel('media')

const onUpdateSkipKeys: (keyof MediaEntity)[] = [
  'createdAt',
  'fileCreatedAt',
  'fileLastUpdatedAt',
]

export const MediaRepository = {
  stream(libraryId: number) {
    const query = sql`
      SELECT * FROM media
      WHERE libraryId = ${libraryId}
    `

    return Repository.client.stream<MediaEntity>(query)
  },

  async page(libraryId: number, page: Page, sort: Sort<MediaEntity>) {
    const query = sql`
      SELECT * FROM media
      WHERE libraryId = ${libraryId}
      AND type != "application"
      AND subType != "x.folder"
      ${filters.sort(sort)}
      ${filters.page(page)}
    `

    const countQuery = sql`
      SELECT COUNT(*) AS total
      FROM media
      WHERE libraryId = ${libraryId}
    `

    const count = await Repository.client.query<{ total: number }>(countQuery)
    const data = await Repository.client.queryMany<MediaEntity>(query)

    return createPagedResponse(count?.total, page.index, data.map(map))
  },

  async findById(id: number) {
    const result = await Repository.findById<MediaEntity>('media', id)

    if (result) return map(result)
  },

  async update(id: number, data: Partial<MediaEntity>) {
    const result = await Repository.update('media', id, data)

    if (result) {
      channel.emit('update', map(result))
    }

    return result
  },

  // async import(filePath: string, library: Library) {
  //   const data = await importMedia(filePath, library)

  //   if (data) {
  //     const saved = await this.upsert(filePath, data)

  //     return map(saved)
  //   }
  // },
  insert(data: Omit<OptionalId<MediaEntity>, 'art' | 'matches'>) {
    return Repository.insert('media', data)
  },

  upsert(
    filePath: string,
    data: Partial<Omit<OptionalId<MediaEntity>, 'art' | 'matches'>>,
  ) {
    return Repository.upsert<MediaEntity>(
      'media',
      'path',
      filePath,
      data,
      onUpdateSkipKeys,
    )
  },

  findByPath(filePath: string) {
    return Repository.findByKey<MediaEntity>('media', 'path', filePath)
  },

  deleteByPath(filePath: string) {
    const query = sql`
      DELETE FROM media
      WHERE path = ${filePath}
    `

    return Repository.client.exec(query)
  },
}
