import logger from 'logger'
import { MediaTypes } from '@neon/shared/enums'
import { Library, Media } from '@neon/shared/types'
import { getEventChannel } from '~/event/channel'
import { MediaRepository } from '~/media/media.repository'
import { decode } from '~/utils/id'
import tmdb from './provider/tmdb'

const log = logger('match.service')
const queue: [Media, Library][] = [] as const

log.info('Starting match.service')

const channel = getEventChannel('media')

channel.on('scanned', async (media, library) => {
  queue.push([media, library])

  processQueue()
})

async function processQueue() {
  const data = queue.shift()

  if (data == null) return

  const [media, library] = data

  if (media == null || library == null || !validate(media)) return

  const matchLimit = 10 // limit matches to ten
  const matches =
    (await tmdb.findMatch(media.title, library.libraryType, matchLimit)) ?? []

  logMatches(matches, media.title)

  await MediaRepository.update(decode(media.id), {
    matches: JSON.stringify(matches),
  })
}

function validate(media: Media) {
  if (!media.type.startsWith(MediaTypes.Video)) {
    return false
  }

  if (media.matches != null) {
    return false
  }

  return true
}

function logMatches<T>(matches: T[], mediaTitle: string) {
  if (matches.length < 1) {
    return log.info(`No matches found for "${mediaTitle}"`)
  }

  const txt = `match${matches.length > 1 ? 'es' : ''}`

  log.info(`Saving ${matches.length} ${txt} for "${mediaTitle}"`)
}
