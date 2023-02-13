import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useAuth0} from 'react-native-auth0';

export const LoginPage = () => {
  const {authorize, clearSession, user, getCredentials, error} = useAuth0();
  const [token, setToken] = React.useState('');

  const onLogin = async () => {
    await authorize({scope: 'openid profile email'});
    const {accessToken} = await getCredentials();
    setToken(accessToken);
  };

  const loggedIn = user !== undefined && user !== null;

  const onLogout = async () => {
    // @ts-ignore
    await clearSession({federated: true}, {localStorageOnly: false});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      <Text>{JSON.stringify(user)}</Text>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      <Text>{JSON.stringify({token})}</Text>
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
};

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
});
