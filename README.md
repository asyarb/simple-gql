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

TODO

## Why this over `graphql-request`?

Functional API, lighter & tree-shakeable, and no `fetch` polyfill bundled by
default.

## License

MIT.
