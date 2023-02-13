import {ApolloClient, InMemoryCache} from '@apollo/client';

export function createApollo() {
  return new ApolloClient({
    uri: 'https://api.dev.realizeme.io/v1/graphql',
    cache: new InMemoryCache(),
  });
}
