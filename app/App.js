import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {Auth0Provider} from 'react-native-auth0';
import config from './auth0-configuration';
import {LoginPage} from './features/auth/pages/LoginPage';
import {HomePage} from './features/home/pages/HomePage';

const pages = ['home', 'login'];

const App = () => {
  const [page, setPage] = React.useState(pages[0]);
  const isHome = page === pages[0];
  const otherPage = pages[isHome ? 1 : 0];
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
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
    </Auth0Provider>
  );
};

const styles = StyleSheet.create({
  button: {backgroundColor: 'blue', color: 'white'},
});

export default App;
