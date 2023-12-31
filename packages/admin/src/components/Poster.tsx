import { AspectRatio } from '@radix-ui/themes'
import styled from 'styled-components'
import { ArtTypes } from '@neon/shared/enums'
import { Art, Media } from '@neon/shared/types'

type PosterProps = {
  data: Media
}

const Image = styled('img')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-3);
`

function getAllArt(media: Media) {
  const matchArt = media.matches
    ?.map((i) => i.art)
    .flat()
    .filter(Boolean) as Art[] | undefined

  return (media.art ?? []).concat(matchArt ?? [])
}

function getImage(media: Media) {
  const all = getAllArt(media)
  const posters = all.filter((a) => a.type === ArtTypes.Poster)
  const poster = posters.at(0)

  if (poster) return parseURL(poster.url)

  const thumbs = all.filter((a) => a.type === ArtTypes.Thumbnail)
  const thumb = thumbs.at(0)

  if (thumb) return parseURL(thumb.url)
}

export default function Poster({ data, ...props }: PosterProps) {
  const src = getImage(data) ?? 'https://placehold.co/600x900'

  return (
    <AspectRatio ratio={6 / 9} {...props}>
      <Image src={src} />
    </AspectRatio>
  )
}

function parseURL(url: string) {
  if (url.startsWith('file://')) {
    return `/api/image?url=${url}`
  }

  return url
}
