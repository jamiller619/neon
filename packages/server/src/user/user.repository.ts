import sql from 'sql-template-tag'
import { User } from '@neon/shared/types'
import { UserEntity } from '~/db/entities'
import { Repository } from '~/db/repository'
import { fromUnixTime } from '~/utils/date'
import { encode } from '~/utils/id'

function mapUser(data: UserEntity) {
  const user: User = {
    ...data,
    id: encode(data.id),
    createdAt: fromUnixTime(data.createdAt).getTime(),
    providers: JSON.parse(data.providers),
  }

  return user
}

export const UserRepository = Object.assign({}, Repository, {
  async getDefaultUser() {
    const query = sql`
      SELECT * FROM user
      WHERE username = 'Default'
    `

    const data = await Repository.client.query<UserEntity>(query)

    if (data) {
      return mapUser(data)
    }
  },
})
