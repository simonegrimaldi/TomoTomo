import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerEdit = ({ label, date, onDateChange, minimumDate }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Seleziona";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "Seleziona";
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(dateObj.getTime())) return "Seleziona";
    return dateObj.toLocaleDateString();
  };

  const onChange = (_, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (minimumDate && selectedDate < minimumDate) {
        Alert.alert(
          "Errore",
          `La data di ${label.toLowerCase()} non può essere precedente a ${minimumDate.toLocaleDateString()}.`
        );
        return;
      }
      onDateChange(selectedDate.toISOString().substring(0, 10));
    }
  };

  return (
    <View style={styles.dateCard}>
      <Text style={styles.cardLabel}>{label}</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={[styles.cardValue, { color: "#FFF600" }]}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="default"
          themeVariant="dark"
          value={date ? new Date(date) : new Date()}
          onChange={onChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateCard: {
    backgroundColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 6,
  },
  cardValue: {
    color: "#eee",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default DatePickerEdit;
