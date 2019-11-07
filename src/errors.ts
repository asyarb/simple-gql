import { GQLRequest, GQLResponse } from './types'

export class ClientError extends Error {
  response: GQLResponse
  request: GQLRequest

  constructor(response: GQLResponse, request: GQLRequest) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request,
    })}`

    super(message)

    this.response = response
    this.request = request

    if (typeof Error.captureStackTrace === 'function')
      Error.captureStackTrace(this, ClientError)
  }

  private static extractMessage(response: GQLResponse): string {
    try {
      return response.errors![0].message
    } catch (error) {
      return `GraphQL Error (Code: ${response.status})`
    }
  }
}
