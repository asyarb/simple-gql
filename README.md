# Simple-Gql <!-- omit in toc -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Plain request](#plain-request)
  - [Creating a re-useable client](#creating-a-re-useable-client)
- [Handling Errors](#handling-errors)
- [API](#api)
- [Why this over `graphql-request`?](#why-this-over-graphql-request)
- [License](#license)

Lightweight GraphQL request/client aimed at usage in the browser. Can also be
used in Node by providing your own implementation of `fetch`.

Built to be used for minimal use cases or with any `Promise` data-fetching
abstraction.

## Features

- Light and treeshakeable. No dependencies.
- Functional API. Compose away as needed.
- Tiny `gql` utility for editor syntax highlighting.
- TypeScript support.

## Installation

```bash
# npm
npm install simple-gql

# yarn
yarn add simple-gql
```

## Usage

### Plain request

```js
import { request, gql } from 'simple-gql'

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

const response = await request({
  url: 'https://book-api/graphql',
  query,
  options: { headers: {} },
  variables: { title: 'Example Title' },
})

console.log(response.data)
```

### Creating a re-useable client

```js
import { createClient, gql } from 'simple-gql'

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

const variables = {
  title: 'Example Book',
}

const client = createClient('https://book-api/graphql', { headers: {} })
const response = client.request(query, variables)

console.log(response.data)
```

## Handling Errors

Utilizing `try` and `catch` blocks or any other `Promise`-based strategy for
handling errors will work.

## API

### `request`

Make a plain GraphQL request.

```js
const request: <T>({ url: string, query: string, variables?: object, options?: Options, }) => Promise<T>
```

Accepts an object as a parameter with the following keys:

- `url`: The endpoint to request.
- `query`: GraphQL query as a string.
- `variables`: GraphQL variable object to inject into your query.
- `options`: Options. See [options](#options) for all available options.

Returns a `Promise`.

### `createClient`

Creates a reusable client with a reusable `url` endpoint and `options` object.

```js
const createClient: (url: string, options?: Options) => Client
```

For more information about all available options available to `createClient`,
see [options](#options).

The returned `Client` has a `request` property that fires a GraphQL request.

```js
client.request = <T>(query: string, variables?: Variables) => Promise<T>
```

`client.request` takes the following parameters:

- `query`: The GraphQL request.
- `variables`: GraphQL variables object to inject into your query.

### `gql`

Simple utility for enabling GraphQL syntax highlighting in supported editors:

```js
const query = gql`
  {
    Books {
      author
      name
    }
  }
`
```

Returns the query string as is.

### Options

`request` and `createClient` take an `options` object that accepts the same
options a normal fetch `Request` would accept in addition to the following keys:

- `headers`: Headers to pass along with the request. Use this to send tokens and
  other custom headers.
- `fetch`: Fetch implementation to utilize. Defaults to `window.fetch`. Use this
  if you plan to use this package in Node.

## Why this over `graphql-request`?

Functional API, lighter & tree-shakeable, and no `fetch` polyfill bundled by
default.

## License

MIT.
