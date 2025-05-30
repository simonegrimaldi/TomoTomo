import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TopBar({ toggleFilters, searchText, onSearchChange }) {
  return (
    <View style={styles.topBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Cerca"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={onSearchChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        selectionColor="#1e90ff"
      />
      <TouchableOpacity
        onPress={toggleFilters}
        accessibilityRole="button"
        accessibilityLabel="Toggle filters"
        style={styles.filterBtn}
      >
        <Text style={styles.filterIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#000", // sfondo nero
    borderRadius: 24,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 45,
    fontSize: 14,
    color: "#eee",           // testo chiaro
  },
  filterBtn: {
    marginLeft: 8,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 20,
    color: "#FFF600",
    fontWeight: "bold",
  },
});
