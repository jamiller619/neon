#!/usr/bin/env node
import {Library} from '@neon/shared/types'
import {getEventChannel} from '~/event/channel'
// import { LibraryAgent, LibraryScanner } from
// './library.process'
import {LibraryRepository} from './library.repository'
import {LibraryAgent,LibraryScanner} from './library.scanner'

type LibraryProcess = {
  scanner: LibraryScanner
  agent: LibraryAgent
}

// const agents = new Map<string, LibraryAgent>()
// const scanners = new Map<string, LibraryScanner>()
const libraries = await LibraryRepository.getAll()
const procs = new Map<string, LibraryProcess>()
const channel = getEventChannel('library')

for await (const library of libraries) {
  await init(library)
}

channel.on('create', init)

async function init(library: Library) {
  if (procs.has(library.id)) {
    const { agent, scanner } = procs.get(library.id)!

    scanner.close()
    agent.
  }
  // await agents.get(library.id)?.stop()

  const pipeline = new LibraryPipeline(library)

  agents.set(library.id, pipeline)

  await pipeline.start()
}
