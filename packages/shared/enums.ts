type Keys<T> = T[keyof T]

export const LibraryTypes = {
  Application: 'application',
  AudioBook: 'audio_book',
  Book: 'book',
  Clip: 'clip',
  Game: 'game',
  HomeVideo: 'home_video',
  Magazine: 'magazine',
  Mixed: 'mixed',
  Movie: 'movie',
  Music: 'music',
  MusicVideo: 'music_video',
  Photo: 'photo',
  Podcast: 'podcast',
  TVShow: 'tv_show',
} as const

export type LibraryType = Keys<typeof LibraryTypes>

// https://en.wikipedia.org/wiki/Media_type
export const MediaTypes = {
  Application: 'application',
  Audio: 'audio',
  Font: 'font',
  Image: 'image',
  Model: 'model',
  Text: 'text',
  Video: 'video',
} as const

export type MediaType = Keys<typeof MediaTypes>

export const ArtTypes = {
  Poster: 'poster',
  Backdrop: 'backdrop',
  Logo: 'logo',
  Banner: 'banner',
  Thumbnail: 'thumbnail',
} as const

export type ArtType = Keys<typeof ArtTypes>

export const Genres = {
  Action: 'action',
  Adventure: 'adventure',
  Animation: 'animation',
  Comedy: 'comedy',
  Crime: 'crime',
  Documentary: 'documentary',
  Drama: 'drama',
  Family: 'family',
  Fantasy: 'fantasy',
  History: 'history',
  Horror: 'horror',
  Kids: 'kids',
  Music: 'music',
  Mystery: 'mystery',
  News: 'news',
  Politics: 'politics',
  Reality: 'reality',
  Romance: 'romance',
  ScienceFiction: 'science_fiction',
  Soap: 'soap',
  Talk: 'talk',
  TVMovie: 'tv_movie',
  Thriller: 'thriller',
  War: 'war',
  Western: 'western',
} as const

export type Genre = Keys<typeof Genres>

const ESRB = {
  E: 'E',
  E10: 'E10',
  T: 'T',
  M: 'M',
  AO: 'AO',
  RP: 'RP',
}

const MPAA = {
  G: 'G',
  PG: 'PG',
  PG_13: 'PG-13',
  R: 'R',
  NC_17: 'NC-17',
  NR: 'NR',
}

export const Ratings = {
  ESRB,
  MPAA,
}
