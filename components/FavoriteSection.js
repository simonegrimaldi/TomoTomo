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
      onPress={() => navigation.navigate("Detail", { bookId: item.id })}
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
    paddingVertical: 24,
    backgroundColor: "#121212", 
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: "900",
    paddingHorizontal: 20,
    fontSize: 20,
    marginBottom: 12,
    color: "white",
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
});
