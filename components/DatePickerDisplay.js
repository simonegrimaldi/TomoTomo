import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DatePickerDisplay = ({ label, date }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "-";
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(dateObj.getTime())) return "-";
    return dateObj.toLocaleDateString();
  };

  return (
    <View style={styles.dateCard}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{formatDate(date)}</Text>
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

export default DatePickerDisplay;
