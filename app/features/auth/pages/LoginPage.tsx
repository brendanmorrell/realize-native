import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useAuth0 } from 'react-native-auth0'

export const LogInPage = () => {
  const { authorize, clearSession, user, error } = useAuth0()

  const onLogIn = async () => {
    await authorize({ scope: 'openid profile email' })
  }

  const loggedIn = user !== undefined && user !== null

  const onLogout = async () => {
    // @ts-ignore
    await clearSession({ federated: true }, { localStorageOnly: false })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Login to Realize Me </Text>
      <Button onPress={loggedIn ? onLogout : onLogIn} title={loggedIn ? 'Log Out' : 'Log In'} />
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: 'center',
    color: 'red',
  },
})
