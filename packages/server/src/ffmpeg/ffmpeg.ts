import cp from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'
import { exec } from '~/utils/child_process'

export async function version() {
  try {
    const { stdout } = await exec(`${ffmpegPath} -version`)

    return stdout.split('ffmpeg version ')[1].split(' ')[0]
  } catch {
    return undefined
  }
}

export default async function ffmpeg(...args: string[]) {
  if (ffmpegPath == null) {
    throw new Error(`Unable to find ffmpeg binary!`)
  }

  const proc = cp.spawn(ffmpegPath, args)

  return new Promise<void>((resolve, reject) => {
    const handlers = {
      error(err: Error) {
        console.error(`ffmpeg error: `, err)

        proc?.kill('SIGINT')
      },
      // stderr(data: unknown) {
      //   // :: = stderr
      //   // console.debug(`ffmpeg:: ${data}`)
      // },
      // stdout(data: unknown) {
      //   //  : = stdout
      //   // console.debug(`ffmpeg: ${data}`)
      // },
      async close(code: number) {
        cleanup()

        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`ffmpeg exited with error code: ${code}`))
        }
      },
    }

    proc?.on('error', handlers.error)
    proc?.on('close', handlers.close)
    proc?.on('exit', handlers.close)

    // proc?.stderr?.on('data', handlers.stderr)
    // proc?.stdout?.on('data', handlers.stdout)

    const cleanup = () => {
      proc?.off('error', handlers.error)
      proc?.off('close', handlers.close)
      proc?.off('exit', handlers.close)

      // proc?.stderr?.off('data', handlers.stderr)
      // proc?.stdout?.off('data', handlers.stdout)
    }
  })
}
