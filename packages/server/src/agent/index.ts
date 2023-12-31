import { MediaTypes } from '@neon/shared/enums'
import { Staticize } from '~/utils/types'
import { IMediaAgent } from './media.agent'
import { MovieAgent } from './movie.agent'
import { TVAgent } from './tv.agent'

export const agents: Staticize<IMediaAgent<typeof MediaTypes.Video>>[] = [
  MovieAgent,
  TVAgent,
]
