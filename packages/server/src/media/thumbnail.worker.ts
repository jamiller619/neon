import {ArtTypes,MediaTypes} from '@neon/shared/enums'
import {Art,Media} from '@neon/shared/types'
import fs from 'node:fs/promises'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import paths from '~/config/paths'
import {getEventChannel} from '~/event/channel'
import ffmpeg from '~/ffmpeg'
import {toUnixTime} from '~/utils/date'
import {isFolder} from '~/utils/media'
import {MediaRepository} from './media.repository'

const channel = getEventChannel('scanner')

channel.on('scanned', (filePath, data) => {
  if
  const isNotVideo = data.type !== MediaTypes.Video
  const hasThumbnails = hasThumbnailArt(data.art)
  const hasMatchThumbnails = data.matches?.some((i) => hasThumbnailArt(i.art))
  const hasArt = hasThumbnails || hasMatchThumbnails

  if (isFolder(data) || isNotVideo || hasArt) {
    continue
  }

  console.info(`Saving screenshots for "${data.title}"`)

  const filePath = await writeImage(data)
  await saveImage(item.id, filePath)
})

// const libraries = await LibraryRepository.getAll()

// for (const library of libraries) {
//   const media = MediaRepository.stream(decode(library.id))

//   for await (const item of media) {
//     const data = map(item)
//     const isNotVideo = data.type !== MediaTypes.Video
//     const hasThumbnails = hasThumbnailArt(data.art)
//     const hasMatchThumbnails = data.matches?.some((i) => hasThumbnailArt(i.art))
//     const hasArt = hasThumbnails || hasMatchThumbnails

//     if (isFolder(data) || isNotVideo || hasArt) {
//       continue
//     }

//     console.info(`Saving screenshots for "${data.title}"`)

//     const filePath = await writeImage(data)
//     await saveImage(item.id, filePath)
//   }
// }

export

function hasThumbnailArt(art: Art[] | null) {
  if (!art || art.length === 0) return false

  const thumbs = art.some((a) => a.type === ArtTypes.Thumbnail)

  return thumbs != null
}

async function writeImage(data: Media) {
  const outfile = path.join(paths.cache, `${data.id}-${data.slug}`, 'thumb.png')
  const startTime = getStartTime(data).toString()

  await fs.mkdir(path.dirname(outfile), {
    recursive: true,
  })

  const args: string[] = [
    '-ss',
    startTime,
    '-i',
    `${data.path}`,
    '-update',
    '-frames:v',
    '1',
    `${outfile}`,
  ]

  console.info(`ffmpeg command args "${args.join(' ')}"`)

  await ffmpeg(...args)

  return outfile
}

async function saveImage(mediaId: number, filePath: string) {
  const art: Art = {
    createdAt: toUnixTime(),
    type: ArtTypes.Thumbnail,
    url: pathToFileURL(filePath).href,
  }

  await MediaRepository.update(mediaId, {
    art: JSON.stringify([art]),
  })
}

function getStartTime(data: Media) {
  const videoStream = data.streams?.find((s) => s.type === 'video')

  if (videoStream && videoStream.duration) {
    return Math.round(videoStream.duration / 1000 / 5)
  }

  return 5
}
