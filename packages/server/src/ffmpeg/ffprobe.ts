import ffprobeStatic from 'ffprobe-static'
import logger from 'logger'
import { exec } from '~/utils/child_process'
import { FfprobeData } from './types'

if (ffprobeStatic.path == null) {
  throw new Error(`Unable to find ffprobe binary!`)
}

const log = logger('ffprobe.index')

export async function version() {
  try {
    const { stdout } = await exec(`${ffprobeStatic.path} -version`)

    return stdout.split('ffprobe version ')[1].split(' ')[0]
  } catch {
    return undefined
  }
}

export async function fromFile(filePath: string) {
  try {
    const result = await ffprobe(
      '-v quiet -print_format json -show_format -show_streams',
      filePath,
    )

    return JSON.parse(result) as FfprobeData
  } catch (err) {
    log.warn(`ffprobe command failed with:`, err)

    return undefined
  }
}

export default async function ffprobe(cmd: string, filePath: string) {
  const { stderr, stdout } = await exec(
    `${ffprobeStatic.path} ${cmd} "${filePath}"`,
  )

  if (stderr) {
    throw new Error(stderr)
  }

  return stdout
}
