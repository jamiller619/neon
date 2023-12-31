import process from 'node:process'
import electron from 'electron'

const isEnvDev = process.env.NODE_ENV === 'development'

export const IS_DEV = isEnvDev || electron?.app?.isPackaged === false
