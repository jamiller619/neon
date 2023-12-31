import process from 'node:process'
import connectSQLite from 'connect-sqlite3'
import session, { Store } from 'express-session'
// import { User } from '@neon/shared/user'
import paths from '~/config/paths'

// import { UserRepository } from '~/user/user.repository'

const SQLiteStore = connectSQLite(session)

// export async function create(user?: User) {
//   const { default: connect } = await import('~/db/connect')
//   const resolvedUser = user ?? (await UserRepository.getDefaultUser())

//   const sesh

//   const client = connect()
// }

export const sessionMiddleware = session({
  name: 'neon.sid',
  store: new SQLiteStore({ dir: paths.db }) as Store,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
})
