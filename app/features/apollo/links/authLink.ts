import { setContext } from '@apollo/client/link/context'
import { DANGEROUSLY_ACCESS_AUTH0_CONTEXT_OUTSIDE_TREE } from '../Auth0ExternalModuleSetter'

export const authLink = setContext(async (_operation, { headers, ...context }) => {
  const auth0Context = DANGEROUSLY_ACCESS_AUTH0_CONTEXT_OUTSIDE_TREE

  const token = auth0Context?.user ? (await auth0Context?.getCredentials())?.accessToken : ''
  console.log(`🚀 ~ token:`, token)
  return {
    headers: {
      ...headers,
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    ...context,
  }
})
