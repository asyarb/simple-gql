type Variables = { [key: string]: any }

interface Headers {
  [key: string]: string
}

export interface Options {
  headers?: Headers
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  method?: RequestInit['method']
  mode?: RequestInit['mode']
  credentials?: RequestInit['credentials']
  cache?: RequestInit['cache']
  redirect?: RequestInit['redirect']
  referrer?: RequestInit['referrer']
  referrerPolicy?: RequestInit['referrerPolicy']
  integrity?: RequestInit['integrity']
}

export interface GQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
}

export interface GQLRequest {
  query: string
  variables?: Variables
}

export interface GQLResponse {
  data?: any
  errors?: GQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface FetchObjArgument {
  url: string
  query: string
  variables?: Variables
  options?: Options
}

export interface FetchPromise<T> {
  data?: T
  extensions?: any
  headers: Headers
  status: number
  errors?: GQLError[]
}

export interface Client {
  request: <T extends any>(
    query: string,
    variables?: Variables,
  ) => Promise<FetchPromise<T>>
}
