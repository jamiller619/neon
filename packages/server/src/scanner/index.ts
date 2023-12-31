import { Staticize } from '~/utils/types'
import { IMediaScanner } from './media.scanner'
import { PhotoScanner } from './photo.scanner'
import { VideoScanner } from './video.scanner'

export { MediaScannerBase } from './media.scanner'

export const scanners: Staticize<IMediaScanner>[] = [VideoScanner, PhotoScanner]
