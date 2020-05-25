import { print } from 'graphql/language/printer'
import { ASTNode } from 'graphql'

interface FetchOptions extends Omit<RequestInit, 'body'> {
  /** Fetch implementation to use for the request. If used in
   * a server environment, this argument must be used.
   *
   * @default window.fetch
   **/
  fetch?: typeof fetch
}
interface RequestArgs<V> {
  /** The endpoint to make a request to. */
  url: string
  /** The string or ASTNode query to run. */
  query: string | ASTNode
  /** The variables to provide to this query. */
  variables?: V
  /** Any valid `fetch` options to supply to the query. */
  options?: FetchOptions
}

/**
 * Helper to facilitate the creation of the proper querystring for a GET
 * request.
 * @private
 *
 * @param rawUrl The endpoint to send the query to.
 * @param variables The variables to encode as a query string.
 * @returns The full URL with querystring parameters.
 */
const gqlGetURL = <V>(rawUrl: string, query: string, variables: V): string => {
  const url = new URL(rawUrl)
  url.searchParams.set('query', query)
  url.searchParams.set('variables', JSON.stringify(variables))

  return url.toString()
}

/**
 * Make a GraphQL request with the provided arguments
 *
 * @param args Arguments for the query.
 * @returns A promise with the data requested in the GraphQL query.
 */
export const fetchGql = async <ReturnType, Variables>({
  url,
  query,
  variables,
  options = { method: 'POST', headers: {} },
}: RequestArgs<Variables>): Promise<ReturnType> => {
  const { headers, fetch: providedFetch, method, ...otherOptions } = options
  const resolvedFetch = providedFetch ?? fetch

  const isPostRequest = method === 'POST'
  const resolvedQuery = typeof query === 'string' ? query : print(query)
  const resolvedUrl = isPostRequest
    ? url
    : gqlGetURL(url, resolvedQuery, variables)

  const request = await resolvedFetch(resolvedUrl, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: isPostRequest
      ? JSON.stringify({
          query,
          variables,
        })
      : undefined,
    ...otherOptions,
  })
  const response = (await request.json()) as { data: ReturnType }

  if (!request.ok || !response.data) {
    const errorMsg =
      typeof response === 'string' ? { error: response } : response

    throw new Error(JSON.stringify(errorMsg))
  }

  return response.data
}
