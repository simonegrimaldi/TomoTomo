import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BooksProvider } from "./context/BooksContext";
import MainStackNavigator from "./navigation/MainStackNavigator";

export default function App() {
  return (
    <BooksProvider>
      <SafeAreaProvider>
        <NavigationContainer >
          <MainStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </BooksProvider>
  );
}