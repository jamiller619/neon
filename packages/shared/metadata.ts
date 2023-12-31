import { Genre, Ratings } from './enums'

export type Credit = {
  personId: string
  role: string | null
  order: number | null
}

type Video = {
  cast: Credit[] | null
  description: string | null
  imdbId: string | null
  releaseYear: number | null
  runtime: number | null
  shortDescription: string | null
  tagline: string | null
  genres: Genre[] | null
}

export type Movie = Video & {
  rating: typeof Ratings.MPAA | null
  revenue: number | null
}

export type TVShow = Video & {
  creators: string[] | null
  episode: number | null
  rating: typeof Ratings.ESRB | null
  season: number | null
  series: string | null
}

export type Metadata<T = object> = {
  createdAt: number
} & T
