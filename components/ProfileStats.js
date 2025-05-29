// components/ProfileStats.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileStats({ total, avgTime, avgRating, readingCount }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiche</Text>
      <View style={styles.row}>
        <Stat label="Totale libri" value={total} />
        <Stat label="Media lettura" value={`${avgTime} gg`} />
        <Stat label="Media valutazione" value={avgRating.toFixed(1)} />
        <Stat label="In lettura" value={readingCount} />
      </View>
    </View>
  );
}

const Stat = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-around" },
  statBox: { alignItems: "center" },
  value: { fontSize: 20, fontWeight: "bold" },
  label: { fontSize: 12, color: "#666" },
});