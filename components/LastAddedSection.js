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
      onPress={() => navigation.navigate("DetailBook", { bookId: item.id })} // Passa bookId
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
        horizontal={true} // scorrimento orizzontale
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    color: "#1a3f72",
  },
  bookCard: {
    width: 120,
    marginRight: 16,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
    padding: 8,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a3f72",
  },
});
