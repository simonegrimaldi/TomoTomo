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
              <Text style={{ color: filters.status[status] ? "blue" : "black" }}>
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
    backgroundColor: "#e1eaff",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#4a90e2",
  },
  filterCategory: {
    marginHorizontal: 10,
  },
  filterTitle: {
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 14,
    color: "#1a3f72",
  },
  filterLabel: {
    marginBottom: 4,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});