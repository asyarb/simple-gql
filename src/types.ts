interface Headers {
  [key: string]: string
}

export interface FetchOptions {
  headers?: Headers
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  method?: RequestInit['method']
  mode?: RequestInit['mode']
  credentials?: RequestInit['credentials']
  cache?: RequestInit['cache']
  redirect?: RequestInit['redirect']
  referrer?: RequestInit['referrer']
  referrerPolicy?: RequestInit['referrerPolicy']
  integrity?: RequestInit['integrity']
}

export interface GQLRequest<V> {
  query: string
  variables?: V
}

export interface GQLResponse {
  data?: any
  errors?: GQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface GQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
}

export interface RequestArgs<V> {
  url: string
  query: string
  variables?: V
  options?: FetchOptions
}

export interface Client {
  request: <T, V>(query: string, variables?: V) => Promise<T>
}
