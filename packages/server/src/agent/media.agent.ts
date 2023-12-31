import { Metadata } from '@neon/shared/metadata'
import { Library, Match, Media } from '@neon/shared/types'
import { Staticize } from '~/utils/types'

export type MediaAgent = {
  new (library: Library): IMediaAgent

  displayName: string
  match: (library: Library) => boolean
}

export interface IMediaAgent {
  library: Library
  findMatches(media: Media): Promise<Match[] | undefined>
  refreshMetadata(media: Media): Promise<Metadata | undefined>
}

export const MediaAgentBase: Staticize<IMediaAgent> = class
  implements IMediaAgent
{
  library: Library

  static match(_: Library) {
    return true
  }

  constructor(library: Library) {
    this.library = library
  }

  findMatches(_: Media) {
    return Promise.resolve(undefined)
  }

  findData(_: Media) {
    return Promise.resolve(undefined)
  }

  refreshMetadata(_: Media) {
    return Promise.resolve(undefined)
  }
}
