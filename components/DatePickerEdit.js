import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerEdit({
  label,
  date,
  onChangeDate,
  minimumDate,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (dateString) => {
  if (!dateString) return "";  // rimuovo "Seleziona", lascio vuoto
  const parts = dateString.split("-");
  if (parts.length !== 3) return "";
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString();
};

  const onChange = (_, selected) => {
    setShowPicker(false);
    if (selected) {
      if (minimumDate && selected < minimumDate) {
        Alert.alert(
          "Errore",
          `La data di ${label.toLowerCase()} non può essere precedente a ${minimumDate.toLocaleDateString()}.`
        );
        return;
      }
      onChangeDate(selected.toISOString().substring(0, 10));
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
}

const styles = StyleSheet.create({
  dateCard: {
    backgroundColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    width: "48%",
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