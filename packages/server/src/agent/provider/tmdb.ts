import {
  MovieDb,
  MovieResult,
  SearchMovieRequest,
  SearchTvRequest,
  TvResult,
} from 'moviedb-promise'
import { Art, Match } from '@neon/shared/types'
import { toUnixTime } from '~/utils/date'

const BASE_URL = 'https://image.tmdb.org/t/p/'
const sizes = {
  backdrop: ['w300', 'w780', 'w1280', 'original'],
  logo: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
  poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
  profile: ['w45', 'w185', 'h632', 'original'],
  still: ['w92', 'w185', 'w300', 'original'],
}
const BACKDROP_SIZE = sizes.backdrop[2]
const POSTER_SIZE = sizes.poster[4]

const tmdb = new MovieDb(process.env.TMDB_API_KEY)

const parseImageURL = (imgPath: string, size: string) => {
  return `${BASE_URL}${size}${imgPath}`
}

const searchMovies = (title: string, opts?: Partial<SearchMovieRequest>) => {
  const params: SearchMovieRequest = {
    ...opts,
    query: title,
  }

  return tmdb.searchMovie(params)
}

const searchTvShows = (title: string, opts?: Partial<SearchTvRequest>) => {
  const params: SearchTvRequest = {
    ...opts,
    query: title,
  }

  return tmdb.searchTv(params)
}

const parseResultForArt = (result: MovieResult | TvResult) => {
  const works: Art[] = []
  const keys = ['backdrop_path', 'poster_path'] as const
  const createdAt = toUnixTime()

  for (const key of keys) {
    if (result[key] != null) {
      const urlPath = result[key]

      if (urlPath == null) continue

      const type = key === 'backdrop_path' ? 'backdrop' : 'poster'
      const size = type === 'backdrop' ? BACKDROP_SIZE : POSTER_SIZE
      const url = parseImageURL(urlPath, size)

      const art: Art = {
        url,
        type,
        createdAt,
      }

      works.push(art)
    }
  }

  return works && works.length > 0 ? works : null
}

const parseDate = (date?: string) => {
  try {
    if (!date) return null

    const year = date.substring(0, 4)
    const num = Number(year)

    if (Number.isNaN(num) || num < 1900 || num > new Date().getFullYear()) {
      return null
    }

    return num
  } catch (err) {
    return null
  }
}

const mapMovieResult = (result: MovieResult) => {
  const title = result.title ?? result.original_title

  if (!title || !result.id) {
    throw new Error(`Invalid result: ${JSON.stringify(result)}`)
  }

  const match: Match = {
    title,
    createdAt: toUnixTime(),
    art: parseResultForArt(result),
    source: 'tmdb',
    sourceId: result.id.toString(),
    year: parseDate(result.release_date),
    metadata: {
      ...result,
    },
  }

  return match
}

const mapTvShowResult = (result: TvResult) => {
  if (!result.id) {
    throw new Error(`Invalid result: ${JSON.stringify(result)}`)
  }

  const title = result.name ?? result.original_name

  if (!title) return

  const match: Match = {
    title,
    createdAt: toUnixTime(),
    art: parseResultForArt(result),
    source: 'tmdb',
    sourceId: result.id?.toString(),
    year: parseDate(result.first_air_date),
    metadata: {
      ...result,
    },
  }

  return match
}

const DEFAULT_LIMIT = 10

export default class TmdbAPI {
  static async searchMovies(
    title: string,
    year?: number,
    limit = DEFAULT_LIMIT,
  ) {
    const { results } = await searchMovies(title, {
      year,
    })

    return limitResults(limit, results?.map(mapMovieResult))
  }

  static async searchTvShows(title: string, limit = DEFAULT_LIMIT) {
    const { results } = await searchTvShows(title)

    return limitResults(
      limit,
      results?.map(mapTvShowResult).filter(Boolean) as Match[],
    )
  }
}

function limitResults<T>(limit?: number, data?: T[]) {
  if (limit) {
    return data?.slice(0, limit)
  }

  return data
}
