import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const options = [
  { label: "3 mesi", value: 3 },
  { label: "6 mesi", value: 6 },
  { label: "1 anno", value: 12 },
];

export default function FilterBar({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.option, selected === opt.value && styles.selected]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={[styles.text, selected === opt.value && styles.selectedText]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#ccc",
    borderRadius: 8,
    padding: 4,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  selected: {
    backgroundColor: "#FFF600",
  },
  text: {
    color: "#00000",
    fontWeight: "500",
    fontWeight:"700"
  },
  selectedText: {
    color: "#00000",
  },
});