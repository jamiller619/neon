import { LibraryTypes, MediaTypes } from '@neon/shared/enums'
import { Metadata } from '@neon/shared/metadata'
import { Data, Library, Media } from '@neon/shared/types'
import { Staticize } from '~/utils/types'
import { IMediaAgent, MediaAgentBase } from './media.agent'
import tmdb from './provider/tmdb'

export const MovieAgent: Staticize<IMediaAgent<typeof MediaTypes.Video>> = class
  extends MediaAgentBase
  implements IMediaAgent<typeof MediaTypes.Video>
{
  static match(library: Library) {
    return library.libraryType === LibraryTypes.Movie
  }

  findMatches(media: Media) {
    return tmdb.searchMovies(media.title, undefined)
  }

  async refreshMetadata(_: Media) {
    return {} as Metadata
  }

  async findData(_: Media) {
    return {} as Data<typeof MediaTypes.Video>
  }
}
