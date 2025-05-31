import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";

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
        onPress={() => handleNavigate("Home")}
        style={styles.navBtn}
      >
        <Image
          source={require("../assets/home.png")}
          style={[styles.icon, isActive("Home") && styles.activeIcon]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate("AddBook")}
        style={styles.navBtn}
      >
        <Image
          source={require("../assets/add.png")}
          style={[styles.icon, isActive("AddBook") && styles.activeIcon]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleNavigate("Profile")}
        style={styles.navBtn}
      >
        <Image
          source={require("../assets/profile.png")}
          style={[styles.icon, isActive("Profile") && styles.activeIcon]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000000", 
    paddingVertical: 8, 
    height: 90, 
  },
  navBtn: {
    alignItems: "center",
    justifyContent: "center", 
    paddingVertical: 6, 
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "white", 
    marginBottom: 20, 
  },
  activeIcon: {
    tintColor: "#FFF600", 
  },
  navLabel: {
    color: "#eee", 
    fontSize: 12, 
    lineHeight: 13, 
  },
  activeLabel: {
    fontWeight: "bold",
    color: "#FFF600", 
  },
});
