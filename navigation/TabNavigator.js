import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import AddBook from '../screens/AddBook';
import ProfileStackNavigator from './ProfileStackNavigator';
import BookDetailScreen from '../screens/BookDetailScreen'; // ✅ Importato
import BottomTabBar from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddOrEditBook" component={AddBook} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />

      {/* 👇 Aggiunto come schermata nascosta, con tabBarButton disattivato */}
      <Tab.Screen
        name="DetailBook"
        component={BookDetailScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}