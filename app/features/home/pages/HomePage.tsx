import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import styled, {css} from '@emotion/native';
import {gql, useQuery} from '@apollo/client';
import {TypeItem} from '../atoms/TypeItem';

const StyledText = styled.Text`
  background: purple;
  font-weight: 600;
`;

const FEATURED_PACKAGES = gql`
  query FeaturedPackages {
    stripe_price {
      product {
        name
      }
    }
  }
`;

type FeaturedPackagesApi = {stripe_price: {product: {name: string}}[]};

const useFeaturedPackages = () => {
  const {data} = useQuery<FeaturedPackagesApi>(FEATURED_PACKAGES);

  return (
    data?.stripe_price
      .map(x => x.product?.name)
      .filter(Boolean)
      .slice(0, 10) ?? []
  );
};

export const HomePage = () => {
  const featuredPackages = useFeaturedPackages();
  return (
    <View style={styles.container}>
      <TypeItem type={'script'} />
      {featuredPackages?.map(x => (
        <Text key={x}>{x}</Text>
      ))}
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