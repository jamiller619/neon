import { MediaType, MediaTypes } from './enums'

export type Stream = {
  aspectRatio: string | null
  channelLayout: string | null
  channels: number | null
  codec: string
  duration: number
  frameRate: number | null
  height: number | null
  index: number
  lang: string | null
  level: number | null
  pixelFormat: string | null
  profile: string | null
  sampleRate: string | null
  timeBase: string | null
  type: 'audio' | 'video'
  width: number | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BaseData = Record<string, any>

export type VideoData = BaseData & {
  streams: Stream[] | null
}

export type ImageData = BaseData & {
  width: number
  height: number
}

export type AudioData = BaseData & {
  channels: number | null
  codec: string
  duration: number
}

export type ApplicationData = BaseData & {
  version: string | null
  platform: string | null
}

export type TextData = BaseData & {
  language: string | null
}

export type FontData = BaseData & {
  family: string | null
}

export type Data<T extends MediaType | null = null> =
  T extends typeof MediaTypes.Video
    ? VideoData
    : T extends typeof MediaTypes.Application
      ? ApplicationData
      : T extends typeof MediaTypes.Audio
        ? AudioData
        : T extends typeof MediaTypes.Font
          ? FontData
          : BaseData
