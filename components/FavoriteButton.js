// components/FavoriteButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FavoriteButton = ({ isFavorite, onPress }) => {
  return (
    <TouchableOpacity style={styles.favoriteButton} onPress={onPress}>
      <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteActive]}>
        {isFavorite ? "❤" : "🤍"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  favoriteButton: {
    padding: 10,
  },
  favoriteIcon: {
    fontSize: 30,
    color: "#888",
  },
  favoriteActive: {
    color: "#ffd700",
  },
});

export default FavoriteButton;