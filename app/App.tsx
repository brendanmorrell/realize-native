import React from 'react'
import { AppRegistry } from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { createApollo } from './features/apollo/createApollo'
import { Navigation } from './features/auth/Navigation'
import Toast from 'react-native-toast-message'
import { AuthProvider } from './features/auth/AuthProvider'

const client = createApollo()

const App = () => {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Navigation />
        <Toast />
      </ApolloProvider>
    </AuthProvider>
  )
}

AppRegistry.registerComponent('MyApplication', () => App)

export default App
