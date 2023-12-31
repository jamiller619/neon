import { Data } from './data'
import { ArtType, LibraryType, MediaType } from './enums'
import { Metadata } from './metadata'

// Just for the ergonomics
export * from './data'
export * from './page'
export * from './user'

export type Library = {
  id: string
  createdAt: number
  name: string
  slug: string
  libraryType: LibraryType
  folders: string[]
}

export type Media<T extends MediaType | null = null> = {
  id: string
  libraryId: string
  createdAt: number

  fileCreatedAt: number | null
  fileLastUpdatedAt: number | null
  fileSize: number | null
  path: string

  title: string
  slug: string
  type: MediaType
  subType: string

  matches: Match[] | null
  art: Art[] | null
  metadata: T extends null ? Metadata : Metadata<T>
  data: Data<T>
  children: Media<T>[] | null
}

export type Match = {
  createdAt: number
  source: string
  sourceId: string
  title: string
  year: number | null
  metadata: Record<string, unknown> | null
  art: Art[] | null
}

export type Art = {
  createdAt: number
  type: ArtType
  url: string
}

export type Person = {
  id: string
  name: string
  aka: string | null
  art: Art[] | null
  biography: string | null
  birthday: string | null
  imdbId: string | null
}
