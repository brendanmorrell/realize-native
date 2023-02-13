import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import styled, {css} from '@emotion/native';

const StyledText = styled.Text`
  background: purple;
  font-weight: 600;
`;

export const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text>right above</Text>
      <Text>hello</Text>
      <StyledText style={cssProp}>this is the homepage boyo</StyledText>
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

const cssProp = css`
  border: 5px solid red;
  padding: 10px;
  color: white;
`;
