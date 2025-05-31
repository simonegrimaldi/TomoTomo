import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const spacing = 12;
const itemSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

export default function SearchResultsSection({ filteredBooks, navigation }) {
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
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookCard}
          onPress={() => navigation.navigate("Detail", { bookId: item.id })}
          activeOpacity={0.8}
        >
          <Image
            source={
              item.cover_image_uri
                ? { uri: item.cover_image_uri }
                : defaultGenreImage
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
    color: "#aaa",
  },
  listContent: {
    padding: spacing,
  },
  bookCard: {
    width: itemSize,
    margin: spacing / 2,
    alignItems: "flex-start",
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#121212",
  },
  bookImage: {
    width: itemSize,
    height: itemSize * 1.5,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: "cover",
  },
  bookTitle: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "left",
    color: "#eee",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#888",
    textAlign: "left",
  },
});