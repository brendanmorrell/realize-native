import { Auth0ContextInterface, useAuth0 } from 'react-native-auth0'

// !! use this VERY sparingly. better to use useAuth0 if the functionality is within the component tree. Use only if you
// absolutely need to access auth0 context while outside the component tree such as in apollo links

export let DANGEROUSLY_ACCESS_AUTH0_CONTEXT_OUTSIDE_TREE: Auth0ContextInterface | undefined

export function Auth0ExternalUsageModuleSetter() {
  const auth0Context = useAuth0()
  DANGEROUSLY_ACCESS_AUTH0_CONTEXT_OUTSIDE_TREE = auth0Context
  return null
}
