import fetchMock from 'fetch-mock'
import fetch from 'node-fetch'

import { request, gql, createClient } from '../dist'

const mockResponse = {
  ok: true,
  data: {
    user: {
      id: 'test-id',
    },
  },
}
const url = 'http://fake-api.com/graphql'
const options = {
  overwriteRoutes: false,
}
const query = gql`
  query {
    user {
      id
    }
  }
`
//@ts-ignore
global.fetch = fetch

describe('minimal use cases', () => {
  test('minimal request use case', async () => {
    fetchMock.once(url, mockResponse, options)

    const res = await request({ url, query })
    expect(res.data).toEqual(mockResponse.data)
  })

  test('minimal createClient use case', async () => {
    fetchMock.once(url, mockResponse, options)

    const client = createClient(url)

    const res = await client.request(query)
    expect(res.data).toEqual(mockResponse.data)
  })
})

describe('specifying headers', () => {
  test('request headers', async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'custom',
    }
    const response = {
      ...mockResponse,
      headers,
    }
    fetchMock.once(url, response, options)

    const res = await request({
      url,
      query,
      options: {
        headers,
      },
    })

    expect(res.headers).toEqual(response.headers)
    expect(res.data).toEqual(response.data)
  })

  test('client request headers', async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'custom',
    }
    const response = {
      ...mockResponse,
      headers,
    }
    fetchMock.once(url, response, options)

    const client = createClient(url, {
      headers,
    })
    const res = await client.request(query)

    expect(res.headers).toEqual(response.headers)
    expect(res.data).toEqual(response.data)
  })
})

describe('errors', () => {
  test('request error', async () => {
    const response = {
      ...mockResponse,
      status: 500,
      ok: false,
      errors: 'Syntax Error GraphQL request...',
    }
    fetchMock.once(url, response, options)

    await expect(request({ url, query })).rejects.toThrow()
  })

  test('client request error', async () => {
    const response = {
      ...mockResponse,
      status: 500,
      ok: false,
      errors: 'Syntax Error GraphQL request...',
    }
    fetchMock.once(url, response, options)

    const client = createClient(url)

    await expect(client.request(query)).rejects.toThrow()
  })
})
