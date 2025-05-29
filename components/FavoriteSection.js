import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookCard from "./BookCard";

export default function FavoriteSection({ books, navigation }) {
  const favoriteBooks = books.filter((b) => b.favorite);

  if (favoriteBooks.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noBooksText}>Nessun libro preferito</Text>
      </View>
    );
  }

  const renderBook = ({ item }) => (
    <BookCard
      book={item}
      onPress={() => navigation.navigate("DetailBook", { bookId: item.id })}
    />
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Preferiti</Text>
      <FlatList
        data={favoriteBooks}
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
});
