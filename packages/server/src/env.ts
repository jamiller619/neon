import process from 'node:process'
import { parse } from 'dotenv'
import env from '../.env'

Object.assign(process.env, {
  ...parse(env),
})
