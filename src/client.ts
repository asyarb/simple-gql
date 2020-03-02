import { FetchOptions, Client, RequestArgs, FetchData } from './types'
import { ClientError } from './errors'

export const request = async <ReturnType, Variables>({
  url,
  query,
  variables,
  options = {
    fetch: window?.fetch,
  },
}: RequestArgs<Variables>): Promise<FetchData<ReturnType>> => {
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
  const contentType = request.headers.get('Content-Type')
  const response: FetchData<ReturnType> = contentType?.startsWith(
    'application/json',
  )
    ? await request.json()
    : await request.text()

  if (!request.ok || response.errors || !response.data) {
    const error = typeof response === 'string' ? { error: response } : response

    throw new ClientError<Variables>(
      { ...error, status: request.status },
      { query, variables },
    )
  }

  return response
}

export const createClient = (
  url: string,
  options: FetchOptions = { fetch: window?.fetch },
): Client => ({
  request: (query, variables) => request({ url, query, variables, options }),
})
