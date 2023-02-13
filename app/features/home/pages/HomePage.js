import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text>this is the homepage boyo</Text>
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
});
