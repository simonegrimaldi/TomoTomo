import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import defaultImage from "../assets/libri/default_genre_image.png";
import logo from "../assets/icon.png";

export default function GenreBooksScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { genreName, books } = route.params;

  const genreBooks = books.filter((book) => book.genre === genreName);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("DetailBook", { bookId: item.id })}
    >
      <Image
        source={item.cover_image_uri ? { uri: item.cover_image_uri } : defaultImage}
        style={styles.bookImage}
      />
      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra con bottone indietro e logo centrato */}
      <View style={styles.logoBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF600" />
        </TouchableOpacity>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      {/* Titolo categoria centrato */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{genreName}</Text>
      </View>

      <FlatList
        data={genreBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },

  logoBar: {
    height: 100,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    position: "relative",
  },

  backButton: {
    position: "absolute",
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },

  backText: {
    fontSize: 16,
    color: "white",
  },

  logoImage: {
    height: 80,
    width: 140,
  },

  header: {
    paddingVertical: 16,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  listContent: {
    padding: 12,
  },

  bookCard: {
    width: 100,
    margin: 8,
    alignItems: "center",
  },

  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },

  bookAuthor: {
    fontSize: 12,
    color: "#ccc",
    textAlign: "center",
  },
});