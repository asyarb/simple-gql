import gql from 'graphql-tag'
import nodeFetch, { Response } from 'node-fetch'

import { fetchGql } from '../src'

global.fetch = nodeFetch
const fetchSpy = jest.spyOn(global, 'fetch')

afterEach(() => fetchSpy.mockClear())

const url = 'http://fake-api.com/graphql'
const mockResponse = {
  ok: true,
  data: {
    user: {
      id: 'test-id',
    },
  },
}
const query = `
  query {
    user {
      id
    }
  }
`

test('returns the data requested from a GraphQL query', async () => {
  fetchSpy.mockImplementationOnce(
    async () => new Response(JSON.stringify(mockResponse), { status: 200 }),
  )

  expect(await fetchGql({ url, query })).toEqual(mockResponse.data)
})

test('returns the data request from a GraphQL query made with graphql-tag', async () => {
  fetchSpy.mockImplementationOnce(
    async () => new Response(JSON.stringify(mockResponse), { status: 200 }),
  )
  const query = gql`
    query {
      user {
        id
      }
    }
  `

  expect(await fetchGql({ url, query })).toEqual(mockResponse.data)
})

test('throws an error if the response is not flagged as ok', async () => {
  fetchSpy.mockImplementationOnce(
    async () =>
      new Response(JSON.stringify({ ...mockResponse, ok: false }), {
        status: 500,
      }),
  )

  const promise = fetchGql({ url, query })

  expect(promise).rejects.toThrow()
})
