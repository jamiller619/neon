import { Library } from '@neon/shared/types'

export type Staticize<T> = {
  new (library: Library): T
  match: (library: Library) => boolean
}
