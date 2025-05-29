// components/SearchBar.js
import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cerca libri per titolo o autore..."
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#4a90e2",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 40,           // altezza fissa
    paddingHorizontal: 16,
    fontSize: 16,
    textAlignVertical: "center",  // per iOS, mantiene testo centrato verticalmente
  },
});