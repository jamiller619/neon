import sql, { bulk, raw } from 'sql-template-tag'
import connect from './connect'
import { Base, OptionalId } from './types'

export const Repository = {
  client: connect(),

  findById<T>(table: string, id: number) {
    const query = sql`
      SELECT * FROM ${raw(table)}
      WHERE id = ${id}
    `

    return this.client.query<T>(query)
  },

  findByKey<T, K extends keyof T = keyof T>(
    table: string,
    key: K,
    value: T[K],
  ) {
    const query = sql`
      SELECT * FROM ${raw(table)}
      WHERE ${raw(String(key))} = ${value}
    `

    return this.client.query<T>(query)
  },

  async upsert<T extends Base, K extends keyof T = keyof T>(
    table: string,
    key: K,
    value: T[K],
    data: Partial<T>,
    skipUpdateKeys: (keyof T)[] = ['createdAt'],
  ) {
    const existing = await this.findByKey<T>(table, key, value)

    if (existing) {
      return this.update<T>(table, existing.id, data, skipUpdateKeys)
    }

    return this.insert<T>(table, data as T)
  },

  async insert<T extends Base>(table: string, data: OptionalId<T>) {
    const cols = Object.keys(data)
    const vals = Object.values(data)
    const query = sql`
      INSERT INTO ${raw(table)}
      (${raw(cols.toString())}) VALUES ${bulk([vals])}
    `

    const id = await this.client.run(query)

    const result = {
      ...data,
      id,
    }

    return result as T
  },

  async update<T extends Base>(
    table: string,
    id: number,
    data: Partial<T>,
    skipUpdateKeys: (keyof T)[] = ['createdAt'],
  ) {
    const existing = await this.findById<T>(table, id)

    if (!existing) {
      throw new Error(`Unable to find a record with id "${id}" to update!`)
    }

    const updates: Partial<T> = {}
    const keys = Object.keys(data).filter(
      (k) => !skipUpdateKeys.includes(k as keyof T),
    ) as (keyof T)[]

    for (const key of keys) {
      const newValue = data[key] as T[typeof key]
      const oldValue = existing[key]

      // if (Array.isArray(newValue) && Array.isArray(oldValue))

      // Only update if:
      // - The values are different
      // - The new value is NOT null/undefined
      if (newValue !== oldValue && newValue != null) {
        // @ts-ignore: Not really sure how to fix this + no point
        updates[key] = newValue
      }
    }

    const updateKeys = Object.keys(updates) as (keyof T)[]
    const record = {
      ...existing,
      ...data,
      ...updates,
    } as T

    // return early if there are no updates
    if (!updateKeys.length) return record

    const query = updateKeys.reduce(
      (queryResult, updateKey) => {
        return sql`
          ${queryResult}
          ${raw(String(updateKey))} = ${updates[updateKey]}
        `
      },
      sql`UPDATE ${raw(table)} SET`,
    )

    await this.client.run(sql`
      ${query}
      WHERE id = ${id}
    `)

    return record
  },
}
