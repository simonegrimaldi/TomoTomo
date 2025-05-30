import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

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
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate('AddOrEditBook')}
        style={styles.navBtn}
      >
        <Image
          source={require('../assets/add.png')}
          style={[styles.icon, isActive('AddOrEditBook') && styles.activeIcon]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate('Profile')}
        style={styles.navBtn}
      >
        <Image
          source={require('../assets/profile.png')}
          style={[styles.icon, isActive('Profile') && styles.activeIcon]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000000', // nero vero
    paddingVertical: 8,          // un po' più di padding verticale
    height: 80,                  // aumenta altezza tab bar
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',    // centra anche verticalmente
    paddingVertical: 6,          // padding per ingrandire area cliccabile
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: 'white',        // giallo acceso per icona attiva
    marginBottom: 20,              // margine per separare icona e testo
  },
  activeIcon: {
    tintColor: '#FFF600',        // giallo acceso per icona attiva
  },
  navLabel: {
    color: '#eee',               // testo chiaro per contrasto su nero
    fontSize: 12,                // testo più leggibile
    lineHeight: 13,              // line height per evitare tagli
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#FFF600',            // giallo acceso per label attiva
  },
});
