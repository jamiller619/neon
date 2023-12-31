export type Page = {
  index: number
  length: number
}

export type Paged<T> = Page & {
  total: number
  items: T[]
}

export type Sort<T> = {
  dir: 'asc' | 'desc'
  col: keyof T
}
