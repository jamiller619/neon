import fs from 'node:fs/promises'

export async function exists(filePath: string) {
  try {
    await fs.access(filePath)

    return true
  } catch {
    return false
  }
}
