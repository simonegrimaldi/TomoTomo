import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import defaultGenreImage from "../assets/libri/default_genre_image.png"; // Puoi continuare a mostrare un’immagine di placeholder se preferisci

export default function LastAddedSection({ books, navigation }) {
  // Se non ci sono libri, ritorna UI “vuota”
  if (!books || books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nessun libro disponibile</Text>
      </View>
    );
  }

  // Altrimenti, mostriamo la lista orizzontale
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Detail", { bookId: item.id })}
      activeOpacity={0.8}
    >
      <Image
        source={ item.cover_image_uri ? { uri: item.cover_image_uri } : defaultGenreImage }
        style={styles.bookImage}
      />
      <Text style={styles.bookTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ultimi Aggiunti</Text>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 24,
    backgroundColor: "#121212",
    marginVertical: 16,
  },
  title: {
    fontWeight: "900",
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 10,
    color: "#FFF600",
    textAlign: "left",
  },
  listContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bookCard: {
    width: 120,
    marginRight: 16,
    padding: 8,
    alignItems: "center",
    borderRadius: 10,
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
    fontSize: 14,
    fontWeight: "600",
    color: "#eee",
    textAlign: "center",
  },

  // Stile per quando non ci sono libri
  emptyContainer: {
    width: "100%",
    paddingVertical: 47,
    backgroundColor: "#121212",
    marginVertical: 16,
    alignItems: "center",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
});