import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import StarRating from "./StarRating";

export default function FiltersMenu({ filters, toggleFilter, resetFilters }) {
  return (
    <View style={styles.filtersMenu}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Stato */}
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Stato</Text>
          {Object.keys(filters.status).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => toggleFilter("status", status)}
              style={styles.filterLabel}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: filters.status[status] }}
            >
              <Text
                style={[
                  styles.filterLabelText,
                  filters.status[status] && styles.filterLabelActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetFilters}
          accessibilityRole="button"
          accessibilityLabel="Reset filtri"
        >
          <Text style={styles.resetButtonText}>Annulla filtri</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersMenu: {
    marginTop: 71,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#121212",
    zIndex: 200,
    paddingVertical: 16,
    borderEndStartRadius: 10,
  },
  filterCategory: {
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: "flex-end",
  },
  filterTitle: {
    fontWeight: "900",
    marginBottom: 12,
    fontSize: 18,
    color: "#FFF600",
    textAlign: "center",
    width: "100%",
  },
  filterLabel: {
    marginBottom: 12,
    width: "100%",
    alignItems: "flex-end",
  },
  filterLabelText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "right",
    width: "100%",
  },
  filterLabelActive: {
    color: "white",
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: "#FFF600",
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  resetButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});
