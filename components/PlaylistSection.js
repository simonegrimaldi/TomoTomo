import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
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
        navigation.navigate("Genre", {
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
    paddingVertical: 24,
    backgroundColor: "#121212",
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "900",
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF600",
    textAlign: "left",
  },
  noBooksText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    paddingVertical: 24,
  },
  listContent: {
    alignItems: "center",
    paddingHorizontal:25,
  },
});
