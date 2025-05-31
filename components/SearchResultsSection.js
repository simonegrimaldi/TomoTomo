import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";

const numColumns = 3;
const spacing = 12;

export default function SearchResultsSection({ filteredBooks, navigation }) {
  const { width: screenWidth } = useWindowDimensions();

  const itemSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

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
      contentContainerStyle={styles.listContent(spacing)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookCard(itemSize, spacing)}
          onPress={() => navigation.navigate("Detail", { bookId: item.id })}
          activeOpacity={0.8}
        >
          <Image
            source={
              item.cover_image_uri
                ? { uri: item.cover_image_uri }
                : defaultGenreImage
            }
            style={styles.bookImage(itemSize)}
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
  listContent: (spacing) => ({
    padding: spacing,
  }),
  bookCard: (itemSize, spacing) => ({
    width: itemSize,
    margin: spacing / 2,
    alignItems: "center",
    borderRadius: 8,
    padding: 6,
    backgroundColor: "#121212", // mantieni grigio anche nei singoli card
  }),
  bookImage: (itemSize) => ({
    width: itemSize * 0.9,
    height: itemSize * 1.5,
    borderRadius: 8,
    margin: 6,
    resizeMode: "cover", // per miglior adattamento immagine
  }),
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