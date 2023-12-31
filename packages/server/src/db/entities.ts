import { Library, Media, User } from '@neon/shared/types'

export type LibraryEntity = Omit<Library, 'id' | 'folders'> & {
  id: number
  folders: string
}

export type MediaEntity = Omit<
  Media,
  'id' | 'libraryId' | 'children' | 'matches' | 'art' | 'metadata' | 'data'
> & {
  id: number
  libraryId: number
  parentMediaId: number | null

  matches: string | null
  art: string | null
  metadata: string | null
  data: string | null
}

export type UserEntity = Omit<User, 'id' | 'providers'> & {
  id: number
  providers: string
}
