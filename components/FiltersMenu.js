import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import StarRating from "./StarRating";

export default function FiltersMenu({ filters, toggleFilter, resetFilters }) {
  return (
    <View style={styles.filtersMenu}>
      <ScrollView>
        {/* Stato */}
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Stato</Text>
          {Object.keys(filters.status).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => toggleFilter("status", status)}
              style={styles.filterLabel}
            >
              <Text style={{ color: filters.status[status] ? "#1e90ff" : "#ccc" }}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Valutazione */}
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Valutazione</Text>
          <StarRating
            rating={filters.rating}
            onChange={(val) => toggleFilter("rating", val)}
          />
        </View>

        {/* Bottone reset filtri */}
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Annulla filtri</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersMenu: {
    backgroundColor: "#121212",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#FFF600", // blu acceso coerente
  },
  filterCategory: {
    marginHorizontal: 10,
  },
  filterTitle: {
    fontWeight: "900",
    marginBottom: 6,
    fontSize: 16,
    color: "white", // testo chiaro
  },
  filterLabel: {
    marginBottom: 8,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#FFF600",
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
