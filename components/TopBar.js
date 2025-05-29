import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TopBar({ toggleFilters, searchText, onSearchChange }) {
  return (
    <View style={styles.topBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cerca libri per titolo o autore..."
        value={searchText}
        onChangeText={onSearchChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      <TouchableOpacity
        onPress={toggleFilters}  // funzione passata da HomeScreen
        accessibilityRole="button"
        accessibilityLabel="Toggle filters"
        style={styles.hamburgerBtn}
      >
        <Text style={styles.hamburgerIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#4a90e2",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
  },
  hamburgerBtn: {
    marginLeft: 12,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: "white",
  },
});