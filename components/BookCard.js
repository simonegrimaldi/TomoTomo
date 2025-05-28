import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import defaultGenreImage from '../assets/libri/default_genre_image.png';

export default function BookCard({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={book.cover_image_uri ? { uri: book.cover_image_uri } : defaultGenreImage}
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={1}>
        {book.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a3f72',
  },
});