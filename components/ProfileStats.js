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
  title: { 
    fontSize: 18, 
    fontWeight: "900", 
    marginBottom: 8,
    color: "#FFF600", // giallo brillante per il titolo
    textAlign: "left",
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-around" 
  },
  statBox: { 
    alignItems: "left",
    flex: 1,
  },
  value: { 
    fontSize: 22, 
    fontWeight: "medium",
    color: "#FFF600", 
  },
  label: { 
    fontSize: 12, 
    color: "#ccc", // testo leggero per le etichette
    marginTop: 4,
  },
});
