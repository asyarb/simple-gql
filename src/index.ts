import { print } from 'graphql/language/printer'
import { ASTNode } from 'graphql'

interface FetchOptions extends Omit<RequestInit, 'body'> {
  fetch?: typeof fetch
}
interface RequestArgs<V> {
  url: string
  query: string | ASTNode
  variables?: V
  options?: FetchOptions
}

const gqlGetURL = <V>(rawUrl: string, query: string, variables: V): string => {
  const url = new URL(rawUrl)
  url.searchParams.set('query', query)
  url.searchParams.set('variables', JSON.stringify(variables))

  return url.toString()
}

/**
 * Make a a graphql request to the requested endpoint.
 */
export const gqlRequest = async <ReturnType, Variables>({
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
