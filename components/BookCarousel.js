import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function BookCarousel({ title, books, onBookPress }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onBookPress(item)}>
            <Image source={{ uri: item.cover_image_uri }} style={styles.cover} />
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
    backgroundColor: "#121212", // sfondo scuro
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
   },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    marginLeft:20,
    marginRight:20,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 8,
        marginTop:10,

    marginLeft: 20,
    marginRight:20
  },
});
