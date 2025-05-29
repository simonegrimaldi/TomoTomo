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
    backgroundColor: "#e6ecf0",
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
    backgroundColor: "#4a90e2",
  },
  text: {
    color: "#333",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
  },
});