import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png";

export default function RandomBooksSection({ books, navigation }) {
  // Funzione per estrarre max 3 libri casuali
  const getRandomBooks = () => {
    if (books.length <= 3) return books;
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const randomBooks = getRandomBooks();

  if (randomBooks.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noBooksText}>Nessun libro disponibile</Text>
      </View>
    );
  }

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Detail", { bookId: item.id })}
    >
      <Image
        source={item.cover_image_uri ? { uri: item.cover_image_uri } : defaultGenreImage}
        style={styles.bookImage}
      />
      <Text style={styles.bookTitle} numberOfLines={3}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Libri Consigliati</Text>
      <FlatList
        data={randomBooks}
        renderItem={renderBook}
        keyExtractor={(item) => item.id.toString()}
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
    paddingHorizontal: 12,
    alignItems: "center",
  },
  bookCard: {
    width: 120,
    marginRight: 16,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 8,
    alignItems: "center"

  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 8,
  },
  bookTitle: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "left",
    color: "#eee",

  },
});