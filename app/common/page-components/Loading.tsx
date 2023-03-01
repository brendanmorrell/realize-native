import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export function Loading() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40,
  },
  text: { fontSize: 40 },
})
