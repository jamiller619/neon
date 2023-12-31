type Disposition = {
  attached_pic: number
  clean_effects: number
  comment: number
  default: number
  dub: number
  forced: number
  hearing_impaired: number
  karaoke: number
  lyrics: number
  original: number
  visual_impaired: number
}

type StreamTag = {
  creation_time: string
  handler_name: string
  language: string
}

type FormatTag = {
  artist: string
  compatible_brands: string
  composer: string
  creation_time: string
  date: string
  encoder: string
  major_brand: string
  minor_version: string
  title: string
}

export type Stream = {
  avg_frame_rate: string
  bit_rate: string
  channel_layout: string
  channels: number
  codec_long_name: string
  codec_name: string
  codec_tag_string: string
  codec_tag: string
  codec_time_base: string
  codec_type: string
  display_aspect_ratio: string
  disposition: Disposition
  duration_ts: number
  duration: string
  has_b_frames: number
  height: number
  index: number
  level: number
  nb_frames: string
  pix_fmt: string
  profile: string
  r_frame_rate: string
  sample_aspect_ratio: string
  sample_rate: string
  start_pts: number
  start_time: string
  tags: StreamTag
  time_base: string
  width: number
}

export type Format = {
  bit_rate: string
  duration: string
  filename: string
  format_long_name: string
  format_name: string
  nb_streams: number
  size: string
  start_time: string
  tags: FormatTag
}

export type FfprobeData = {
  streams: Stream[]
  format: Format
}
