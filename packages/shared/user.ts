export enum Issuer {
  LOCAL = 'local',
}

export type Provider = {
  id: string
}

export type LocalProvider = {
  hash: string
  salt: string
}

export type User = {
  id: string
  createdAt: number
  username: string
  providers: {
    [K in Issuer]: Provider | LocalProvider
  }
}
