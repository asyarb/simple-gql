# Simple-Gql <!-- omit in toc -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Plain request with JavaScript](#plain-request-with-javascript)
  - [Using `graphql-tag` and TypeScript](#using-graphql-tag-and-typescript)
  - [Creating a re-useable client with TypeScript](#creating-a-re-useable-client-with-typescript)
- [Error handling](#error-handling)
- [API](#api)
  - [`fetchGql`](#fetchgql)
  - [Options](#options)
- [License](#license)

Lightweight GraphQL wrapper around `fetch`. Can also be used in Node by
providing your own implementation of `fetch`.

Built to be used for minimal use cases or in conjunction with any `Promise`
based data-fetching abstraction such as `react-query`.

## Features

- Lightweight. No dependencies.
- Written in TypeScript.
- Functional API.
- Supports plain string queries or `ASTNode`s from `graphql-tag`.

## Installation

```bash
# npm
npm install simple-gql

# yarn
yarn add simple-gql
```

## Usage

### Plain request with JavaScript

```js
import { fetchGql } from 'simple-gql'

const query = `
  query getBook($title: String!) {
    Book(title: $title) {
      publishDate
      author {
        name
      }
    }
  }
`

const response = await fetchGql({
  url: 'https://book-api/graphql',
  query,
  variables: { title: 'Example Title' },
})
```

### Using `graphql-tag` and TypeScript

```ts
import { fetchGql } from 'simple-gql'
import gql from 'graphql-tag'

interface QueryVaraibles {
  title: string
}
interface QueryData {
  Book: {
    publishDate: number
    author: {
      name: string
    }
  }
}

const query = gql`
  query getBook($title: String!) {
    Book(title: $title) {
      publishDate
      author {
        name
      }
    }
  }
`

const response = await fetchGql<QueryData, QueryVariables>({
  url: 'https://book-api/graphql',
  query,
  variables: { title: 'Example Title' },
})
```

### Creating a re-useable client with TypeScript

We can create a re-usable client with some function composition and closures.
See the example below for a TypeScript example.

```ts
import { fetchGql } from 'simple-gql'

export const gqlRequest = async <ReturnType, Variables>(
  query: Parameters<typeof fetchGql>[0]['query']
  variables: Variables,
) => {
  // Perform any pre-request logic you need here.
  const accessToken = myTokenLogic()

  const response = await fetchGql<ReturnType, Variables>({
    query,
    variables,
    url: 'https://your-endpoint.com/graphql',
    options: {
      // Your default options.
      headers: {
        Authorization: `token ${accessToken}`,
      },
    },
  })

  return response
}
```

## Error handling

This library will make no attempt to handle your errors and leaves it up to the
developer to handle them. It will throw any error it receives, just like a
`fetch` request would.

## API

### `fetchGql`

Make a plain GraphQL request.

```js
const fetchGql: <T>({ url: string, query: string | ASTNode, variables?: object, options?: Options, }) => Promise<T>
```

Accepts an object as a parameter with the following keys:

- `url`: The endpoint to request.
- `query`: GraphQL query as a string or `ASTNode` returned from `graphql-tag`.
- `variables`: GraphQL variable object to inject into your query.
- `options`: Options. See [options](#options) for additional information.

Returns a `Promise`.

### Options

`fetchGql` takes an `options` object that accepts the same options a normal
`fetch` would accept in addition to the following:

- `fetch`: Fetch implementation to utilize. Defaults to `window.fetch`. Use this
  if you plan to use this server-side/in Node.

If you need to send your GraphQL request via GET, just set the appropriate
`headers.method` option. `fetchGql` will handle setting your `query` and
`variables` as querystring parameters.

## License

MIT.
