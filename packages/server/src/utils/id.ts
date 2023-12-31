import process from 'node:process'
import Hashids from 'hashids'

const salt =
  process.env['USERPROFILE'] ??
  process.env['HOME'] ??
  process.env['USERDOMAIN'] ??
  process.env['NAME'] ??
  'neon'

const hashids = new Hashids(salt, 6, 'abcdefghijklmnopqrstuvwxyz')

export const encode = (id: number) => {
  return hashids.encode(id)
}

export const decode = (id: string) => {
  return hashids.decode(id).at(0) as number
}
