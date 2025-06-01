import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function BookCarousel({ title, books, onBookPress }) {
  return (
    <View style={styles.section}>
      {title ? (
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.bookCount}>{books.length}</Text>
        </View>
      ) : null}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onBookPress(item)}>
            <Image
              source={{ uri: item.cover_image_uri }}
              style={styles.cover}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#121212",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    marginBottom: 13,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  bookCount: {
    fontSize: 12,
    color: "white",
    borderWidth: 2,
    borderColor: "white",
    opacity: "0.15",
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 20,
    overflow: "hidden",
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginTop: 10,

    marginLeft: 20,
    marginRight: 20,
  },
});
