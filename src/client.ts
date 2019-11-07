import { Options, Client, FetchObjArgument, FetchPromise } from './types'
import { ClientError } from 'errors'

export const request = async <T extends any>({
  url,
  query,
  variables,
  options = {
    fetch: window && window.fetch,
  },
}: FetchObjArgument): Promise<FetchPromise<T>> => {
  const { headers, fetch, ...otherOptions } = options

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
  const contentType = request.headers.get('Content-Type')
  const result =
    contentType && contentType.startsWith('application/json')
      ? await request.json()
      : await request.text()

  if (!request.ok || result.errors || !result.data) {
    const error = typeof result === 'string' ? { error: result } : result
    throw new ClientError(
      { ...error, status: request.status },
      { query, variables },
    )
  }

  return result.data
}

export const createClient = (
  url: string,
  options: Options = { fetch: window && window.fetch },
): Client => ({
  request: (query, variables) => request({ url, query, variables, options }),
})
