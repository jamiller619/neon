import { LibraryTypes } from '@neon/shared/enums'
import {
  IMediaScanner,
  MediaScannerBase,
  MediaScannerStatic,
} from './media.scanner'

export const PhotoScanner: MediaScannerStatic = class
  extends MediaScannerBase
  implements IMediaScanner
{
  static match() {
    return [LibraryTypes.Photo, LibraryTypes.Magazine]
  }
}
