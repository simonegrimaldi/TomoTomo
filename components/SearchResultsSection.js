import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const spacing = 8;
const cardWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

export default function SearchResultsSection({ filteredBooks, navigation }) {
  if (filteredBooks.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>Nessun libro trovato</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredBooks}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookCard}
          onPress={() => navigation.navigate("DetailBook", { bookId: item.id })}
        >
          <Image
            source={item.cover_image_uri ? { uri: item.cover_image_uri } : defaultGenreImage}
            style={styles.bookImage}
          />
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  noResultsContainer: { padding: 20, alignItems: "center" },
  noResultsText: { fontStyle: "italic", color: "#666" },

  row: {
    justifyContent: "flex-start",
    marginBottom: spacing,
    paddingHorizontal: spacing / 2,
  },

  bookCard: {
    width: cardWidth,
    marginHorizontal: spacing / 2,
    marginBottom: spacing,
    alignItems: "flex-start",
  },

  bookImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },

  bookTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "white",
    textAlign: "left",
  },

  bookAuthor: {
    fontSize: 12,
    color: "#666",
    textAlign: "cente",
  },
});