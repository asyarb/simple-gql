import { GQLRequest, GQLResponse } from './types'

const extractMessage = (response: GQLResponse) => {
  if (response.errors && response.errors.length)
    return response.errors[0].message

  return `GraphQL Error (Code: ${response.status})`
}

export class ClientError extends Error {
  constructor(response: GQLResponse, request: GQLRequest) {
    super(
      `${extractMessage(response)}: ${JSON.stringify({
        response,
        request,
      })}`,
    )
  }
}
