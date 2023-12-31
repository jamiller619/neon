import { MediaTypes } from '@neon/shared/enums'
import { Media } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'

export function isFolder(media: Pick<Media | MediaEntity, 'type' | 'subType'>) {
  return media.type === MediaTypes.Application && media.subType === 'x.folder'
}
