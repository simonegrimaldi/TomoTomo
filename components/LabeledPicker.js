// components/LabeledPicker.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const LabeledPicker = ({ label, selectedValue, onValueChange, items, pickerStyle, itemStyle }) => {
  return (
    <View style={styles.pickerWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={pickerStyle}
        itemStyle={itemStyle}
        dropdownIconColor="#FFF600"
      >
        {items.map(({ label, value }) => (
          <Picker.Item key={value} label={label} value={value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: "#222",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#666",
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#aaa",
  },
});

export default LabeledPicker;