// screens/WebViewScreen.js

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen({ route }) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView source={{ uri: url }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
