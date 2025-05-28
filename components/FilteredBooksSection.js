// components/FilteredBooksSection.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";

export default function FilteredBooksSection({ filteredBooks, navigation }) {
  if (!filteredBooks || filteredBooks.length === 0) {
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
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookCard}
          onPress={() => navigation.navigate("BookDetail", { book: item })}
        >
          <Image
            source={
              item.cover_image_uri ? { uri: item.cover_image_uri } : defaultGenreImage
            }
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
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontStyle: "italic",
    color: "#666",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bookCard: {
    flex: 1 / 3,
    marginHorizontal: 4,
    alignItems: "center",
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  bookTitle: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});