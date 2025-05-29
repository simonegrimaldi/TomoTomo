import React, { useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";
import GenreCard from "./GenreCard"; 

export default function PlaylistSection({ books, navigation }) {
    const booksByGenre = useMemo(() => {
    const grouped = {};
    books.forEach((book) => {
      const genre = book.genre || "Altro";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(book);
    });
    return grouped;
  }, [books]);

  const genres = Object.entries(booksByGenre).map(([genreName, booksInGenre]) => {
    const lastAddedBook = booksInGenre[0];
    return {
      genreName,
      genreImageUri: lastAddedBook?.cover_image_uri
        ? { uri: lastAddedBook.cover_image_uri }
        : defaultGenreImage,
    };
  });

const renderGenre = ({ item }) => (
  <GenreCard
    genreName={item.genreName}
    genreImageUri={item.genreImageUri}
    onPress={() =>
      navigation.navigate("GenreBooks", {
        genreName: item.genreName,
        books,
      })
    }
  />
);

  if (genres.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noBooksText}>Nessun libro disponibile</Text>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Playlist per Genere</Text>
      <FlatList
        data={genres}
        renderItem={renderGenre}
        keyExtractor={(item) => item.genreName}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 12,
    color: "#1a3f72",
  },
  noBooksText: {
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
    paddingVertical: 24,
  },
  listContent: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  genreCard: {
    width: 140,
    marginRight: 18,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
    paddingVertical: 10,
  },
  genreImage: {
    width: 120,
    height: 170,
    borderRadius: 12,
  },
  genreTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a3f72",
    marginTop: 10,
    textAlign: "center",
  },
});