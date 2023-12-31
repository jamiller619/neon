export type Base = {
  id: number
  createdAt: number
}

export type OptionalId<T extends Base> = Omit<T, 'id'> & {
  id?: number
}
