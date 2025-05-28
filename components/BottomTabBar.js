import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

export default function BottomTabBar({ navigation }) {
  const state = navigation.getState();
  const activeRouteIndex = state.index;
  const routes = state.routes;

  const isActive = (routeName) => routes[activeRouteIndex]?.name === routeName;

  const handleNavigate = (routeName) => {
    if (!isActive(routeName)) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        onPress={() => handleNavigate('Home')}
        style={styles.navBtn}
      >
        <Image
          source={require('../assets/home.png')}
          style={[styles.icon, isActive('Home') && styles.activeIcon]}
        />
        <Text style={[styles.navLabel, isActive('Home') && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate('AddOrEditBook')}
        style={styles.navBtn}
      >
        <Image
          source={require('../assets/add.png')}
          style={[styles.icon, isActive('AddOrEditBook') && styles.activeIcon]}
        />
        <Text style={[styles.navLabel, isActive('AddOrEditBook') && styles.activeLabel]}>
          Aggiungi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate('Profile')}
        style={styles.navBtn}
      >
        <Image
          source={require('../assets/profile.png')}
          style={[styles.icon, isActive('Profile') && styles.activeIcon]}
        />
        <Text style={[styles.navLabel, isActive('Profile') && styles.activeLabel]}>
          Profilo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
  },
  navBtn: {
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: 'white',
    resizeMode: 'contain',
    marginBottom: 2,
  },
  activeIcon: {
    tintColor: '#ffd700',
  },
  navLabel: {
    color: 'white',
    fontSize: 12,
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#ffd700',
  },
});