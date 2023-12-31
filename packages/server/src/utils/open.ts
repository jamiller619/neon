import { shell } from 'electron'

export default function open(url: string) {
  return shell.openExternal(url)
}
