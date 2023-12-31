import { createReadStream } from 'node:fs'
import { Router } from 'express'
import { Page, Sort } from '@neon/shared/types'
import { MediaEntity } from '~/db/entities'
import { LibraryRepository } from '~/library/library.repository'
import { MediaRepository } from '~/media/media.repository'
import { decode } from '~/utils/id'

const api = Router()

api.get('/library/all', async (_, res) => {
  res.json(await LibraryRepository.getAll())
})

api.get('/library/:libraryId/media', async (req, res) => {
  const { libraryId } = req.params
  const { col, dir, page, length } = req.query as {
    col: keyof MediaEntity
    dir: 'asc' | 'desc'
    page: string
    length: string
  }

  const pageParam: Page = {
    index: Number(page),
    length: Number(length),
  }

  const sortParam: Sort<MediaEntity> = {
    col,
    dir,
  }

  res.json(await MediaRepository.page(decode(libraryId), pageParam, sortParam))
})

api.get('/image', (req, res) => {
  const imageURL = new URL(decodeURIComponent(req.query.url as string))

  const stream = createReadStream(imageURL)

  stream.on('error', () => res.status(404).end()).pipe(res)
})

export default api
