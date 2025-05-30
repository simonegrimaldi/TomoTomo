import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

export default function LastAddedSection({ books, navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Detail", { bookId: item.id })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.cover_image_uri }} style={styles.bookImage} />
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
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 24,
    backgroundColor: "#121212", // sfondo scuro
    marginVertical: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  title: {
    fontWeight: "900",
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF600",
    textAlign: "left",
  },
  bookCard: {
    width: 120,
    marginRight: 16,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    

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
});
