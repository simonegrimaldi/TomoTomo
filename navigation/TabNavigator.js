// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import AddBook from '../screens/AddBook';
import ProfileScreen from '../screens/ProfileScreen';
import BookDetailScreen from '../screens/BookDetailScreen';

// Importa la barra personalizzata
import BottomTabBar from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}  // <- Usa qui la tua BottomTabBar
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddOrEditBook" component={AddBook} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="DetailBook" component={BookDetailScreen} />
    </Tab.Navigator>
  );
}