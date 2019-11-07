/**
 * Simple `gql` tag for syntax highlighting in code editors.
 *
 * @param query - GraphQL query template string
 */
export const gql = (query: TemplateStringsArray) =>
  String(query).replace('\n', ' ')
