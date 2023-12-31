import sql, { raw } from 'sql-template-tag'
import { Page, Paged, Sort } from '@neon/shared/types'

const filters = {
  sort<T>(sort: Sort<T>) {
    const query = sql`
      ORDER BY ${raw(String(sort.col))}
      ${raw(sort.dir.toUpperCase())}
    `

    return query
  },
  page(page: Page) {
    const query = sql`
      LIMIT ${raw(String(page.length))}
      OFFSET ${raw(String(page.length * page.index))}
    `

    return query
  },
}

export default filters

export function createPagedResponse<T>(
  total: number | undefined,
  index: number,
  items: T[],
) {
  const resp: Paged<T> = {
    total: total ?? 0,
    items,
    index,
    length: items.length,
  }

  return resp
}
