import { Library } from '@neon/shared/types'
import { MediaRepository } from '~/media/media.repository'
import { exists } from '~/utils/fs'
import { decode } from '~/utils/id'

export default async function sync(library: Library) {
  console.log(`Syncing library "${library.name}"`)

  const stream = MediaRepository.stream(decode(library.id))

  for await (const data of stream) {
    const doesFileExist = await exists(data.path)

    if (!doesFileExist) {
      await MediaRepository.deleteByPath(data.path)
    }
  }

  console.log(`Syncing library "${library.name}" complete`)
}
