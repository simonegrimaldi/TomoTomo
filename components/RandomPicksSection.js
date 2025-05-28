import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookCard from "./BookCard";

export default function RandomPicksSection({ books, navigation }) {
  if (books.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.noBooksText}>Nessun libro disponibile</Text>
      </View>
    );
  }

  const renderBook = ({ item }) => (
    <BookCard book={item} onPress={() => navigation.navigate("BookDetail", { book: item })} />
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Scelte a Caso</Text>
      <FlatList
        data={books}
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