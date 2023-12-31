import schema from './schema.json' assert { type: 'json' }

export { type ConfigSchema } from './schema'

export const json = schema
export type ConfigKey = keyof typeof json.properties
