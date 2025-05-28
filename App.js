import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BooksProvider } from './context/BooksContext';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  return (
    <BooksProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </BooksProvider>
  );
}