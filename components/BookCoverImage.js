// components/BookCoverImage.js
import React from "react";
import { Image, StyleSheet } from "react-native";
import defaultImage from "../assets/libri/default_genre_image.png";

const BookCoverImage = ({ uri }) => {
  return (
    <Image
      source={uri ? { uri } : defaultImage}
      style={styles.coverImage}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: "100%",
    height: 400,
    borderRadius: 12,
  },
});

export default BookCoverImage;