import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '../screens/ProfileScreen';
import DetailScreen from '../screens/DetailScreen';

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
    screenOptions={{
    headerShown: false, // nasconde header in tutte le schermate
  }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profilo' }} />
            <ProfileStack.Screen name="Detail" component={DetailScreen} />

    </ProfileStack.Navigator>
  );
}