import { promisify } from 'node:util'
import imagesize from 'image-size'
import { MediaType, MediaTypes } from '@neon/shared/enums'
import { MediaStream } from '@neon/shared/types'
import { ffprobeFromFile } from '~/ffmpeg'
import { Stream } from '~/ffmpeg/types'
import { isNumber, toNumber } from '~/utils/number'

const imageSize = promisify(imagesize)

async function parseDimensions(
  filePath: string,
  type: MediaType,
  streams?: MediaStream[],
) {
  if (type === MediaTypes.Image) {
    const size = await imageSize(filePath)

    return {
      width: size?.width ?? null,
      height: size?.height ?? null,
    }
  }

  if (type === MediaTypes.Video) {
    const videoStream = streams?.find((stream) => stream.type === 'video')

    return {
      width: videoStream?.width ?? null,
      height: videoStream?.height ?? null,
    }
  }

  return {
    width: null,
    height: null,
  }
}

function parseAspectRatio(val?: string) {
  if (!val) {
    return undefined
  }

  const parts = val.split(':')

  if (parts.length !== 2) {
    return undefined
  }

  const u = isNumber(parts.at(0))
  const d = isNumber(parts.at(1))

  if (!u || !d) {
    return undefined
  }

  return val
}

function parseFrameRate(str: string | null | undefined) {
  if (!str) {
    return undefined
  }

  const [top, bottom] = str.split('/')
  const dividend = toNumber(top)
  const divisor = toNumber(bottom)

  if (dividend != null && divisor != null) {
    return toNumber((dividend / divisor).toFixed(2))
  }
}

function parseProfile(val?: string | number) {
  if (!val) {
    return null
  }

  if (val === 'unknown') {
    return null
  }

  return val.toString()
}

function parseStream(stream: Stream): MediaStream {
  return {
    aspectRatio: parseAspectRatio(stream.display_aspect_ratio) ?? null,
    channelLayout: stream.channel_layout || null,
    channels: stream.channels ?? null,
    codec: stream.codec_name,
    frameRate: parseFrameRate(stream.r_frame_rate) ?? null,
    height: stream.height ?? null,
    index: stream.index,
    lang: stream.tags?.language || null,
    level: toNumber(stream.level) ?? null,
    pixelFormat: stream.pix_fmt || null,
    profile: parseProfile(stream.profile),
    sampleRate: stream.sample_rate || null,
    timeBase: stream.time_base || null,
    type: stream.codec_type as 'audio' | 'video',
    width: stream.width ?? null,
    duration: stream.duration_ts,
  }
}

export default async function probe(filePath: string, mediaType: MediaType) {
  const data =
    mediaType === MediaTypes.Video || mediaType === MediaTypes.Audio
      ? await ffprobeFromFile(filePath)
      : undefined

  // TODO: Why do we filter streams based on this "codec_name" property?
  const streams = data?.streams.filter((s) => s.codec_name).map(parseStream)
  const dimensions = await parseDimensions(filePath, mediaType)

  return {
    ...dimensions,
    streams,
    format: data?.format,
  }
}
