import useSWR, { SWRConfiguration } from 'swr'
import { Library, Media, Paged } from '@neon/shared/types'

// based on "server/http/api.router.ts"
export type API = {
  ['library.all']: Library[]
  ['media.paged']: Paged<Media>
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (response.status !== 200) {
    const err = (await response.json()) as Error

    throw err
  }

  return response.json()
}

type URL = `/${string}`

export default function useAPI<K extends keyof API, R = API[K]>(
  url: URL,
  config?: SWRConfiguration<R, Error>,
) {
  const { data, error, mutate } = useSWR<R, Error>(
    `/api${url}`,
    fetcher,
    config,
  )

  const isLoading = !data && !error

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}
