import { Library, Media } from '@neon/shared/types'
import { User } from '@neon/shared/user'

export type BroadcastChannelEventMap = {
  user: {
    create: (user: User) => Promise<void> | void
  }

  library: {
    create: (library: Library) => Promise<void> | void
    scancomplete: (library: Library) => Promise<void> | void
  }

  media: {
    scanned: (media: Media, library: Library) => Promise<void> | void
    create: (media: Media) => Promise<void> | void
    update: (media: Media) => Promise<void> | void
  }

  scanner: {
    scanned: (
      filePath: string,
      library: Library,
      record?: Media,
    ) => Promise<void> | void
  }

  worker: {
    start: (name: string) => void | Promise<void>
    stop: (name: string) => void | Promise<void>
  }
}
