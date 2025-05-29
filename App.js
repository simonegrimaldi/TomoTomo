import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BooksProvider } from './context/BooksContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <BooksProvider>
      <SafeAreaProvider>
        <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
      </SafeAreaProvider>
    </BooksProvider>
  );
}