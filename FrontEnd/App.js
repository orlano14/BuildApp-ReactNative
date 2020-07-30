import React from 'react';
import { StyleSheet, Text, View ,I18nManager,NativeModules,AsyncStorage} from 'react-native';
import Login from './Pages/Login';
import Connection from './Pages/Connection';
import { ThemeProvider } from 'react-native-elements';

export default function App() {  
  
  
  return (
    <View style={styles.container}>
      <ThemeProvider>
      <Connection/>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
