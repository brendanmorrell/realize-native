import { ApolloClient, from, InMemoryCache } from '@apollo/client'
import { authLink } from './links/authLink'
import { gqlLink } from './links/gqlLink'

export function createApollo() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, gqlLink]),
  })
}
