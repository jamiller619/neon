declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_GEMINI_API_KEY: string
      TMDB_API_KEY: string
      TMDB_READ_ACCESS_TOKEN: string
    }
  }
}

export {}
