import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {Auth0Provider} from 'react-native-auth0';
import config from './auth0-configuration';
import {LoginPage} from './features/auth/pages/LoginPage';
import {HomePage} from './features/home/pages/HomePage';
import {AppRegistry} from 'react-native';
import {ApolloProvider} from '@apollo/client';
import {createApollo} from './features/apollo/createApollo';

const client = createApollo();

const pages = ['home', 'login'];

const App = () => {
  const [page, setPage] = React.useState(pages[0]);
  const isHome = page === pages[0];
  const otherPage = pages[isHome ? 1 : 0];
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <ApolloProvider client={client}>
        <>
          <Button
            title=""
            accessibilityLabel="Learn more about this purple button"
          />
          <Button
            color="purple"
            title={`Switch to ${otherPage}`}
            onPress={() => setPage(otherPage)}
          />
          {isHome ? <HomePage /> : <LoginPage />}
        </>
      </ApolloProvider>
    </Auth0Provider>
  );
};

AppRegistry.registerComponent('MyApplication', () => App);

const styles = StyleSheet.create({
  button: {backgroundColor: 'blue', color: 'white'},
});

export default App;
