import sql from 'sql-template-tag'
import { LibraryType, LibraryTypes } from '@neon/shared/enums'
import { Library } from '@neon/shared/types'
import { IS_DEV } from '~/config/constants'
import { LibraryEntity } from '~/db/entities'
import { Repository } from '~/db/repository'
import { getEventChannel } from '~/event/channel'
import { fromUnixTime, toUnixTime } from '~/utils/date'
import { encode } from '~/utils/id'
import { slugify } from '~/utils/string'

const channel = getEventChannel('library')

function mapLibrary(data: LibraryEntity) {
  const library: Library = {
    ...data,
    id: encode(data.id),
    createdAt: fromUnixTime(data.createdAt).getTime(),
    folders: JSON.parse(data.folders),
  }

  return library
}

export const LibraryRepository = Object.assign({}, Repository, {
  async getAll(): Promise<Library[]> {
    const data = await Repository.client.queryMany<LibraryEntity>(
      sql`SELECT * FROM library`,
    )

    if (IS_DEV && !data.length) {
      await this.seed()

      return this.getAll()
    }

    return data.map(mapLibrary)
  },

  async createLibrary(
    libraryType: LibraryType,
    name: string,
    ...folders: string[]
  ) {
    const library = await Repository.insert<LibraryEntity>('library', {
      libraryType,
      createdAt: toUnixTime(),
      name,
      slug: slugify(name),
      folders: JSON.stringify(folders),
    })

    channel.emit('create', mapLibrary(library))
  },

  async seed() {
    await this.createLibrary(
      LibraryTypes.Movie,
      'Movies',
      'C:\\media-library\\movies',
      'C:\\media-library\\movies2',
    )

    await this.createLibrary(
      LibraryTypes.Photo,
      'Photos',
      'C:\\media-library\\photos',
    )

    await this.createLibrary(
      LibraryTypes.TVShow,
      'TV Shows',
      'C:\\media-library\\shows',
    )
  },
})
