import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabNavigator from "./TabNavigator";
import DetailScreen from "../screens/DetailScreen";

const MainStack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      {/* TabNavigator è il tab principale */}
      <MainStack.Screen name="Tabs" component={TabNavigator} />

      {/* Schermate extra fuori dalla tab bar */}
      <MainStack.Screen name="Detail" component={DetailScreen} />
    </MainStack.Navigator>
  );
}
