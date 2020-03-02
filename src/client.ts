import { FetchOptions, Client, RequestArgs } from './types'
import { ClientError } from './errors'

export const request = async <ReturnType, Variables>({
  url,
  query,
  variables,
  options = {
    fetch: window?.fetch,
  },
}: RequestArgs<Variables>): Promise<ReturnType> => {
  const { headers, fetch: baseFetch, ...otherOptions } = options
  const fetch = baseFetch ?? window?.fetch

  const body = JSON.stringify({
    query,
    variables,
  })

  const request = await fetch(url, {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
    body,
    ...otherOptions,
  })
  const response = await request.json()

  if (!request.ok || !response.data) {
    const error = typeof response === 'string' ? { error: response } : response

    throw new ClientError<Variables>(
      { ...error, status: request.status },
      { query, variables },
    )
  }

  return response.data as ReturnType
}

export const createClient = (
  url: string,
  options: FetchOptions = { fetch: window?.fetch },
): Client => ({
  request: (query, variables) => request({ url, query, variables, options }),
})
