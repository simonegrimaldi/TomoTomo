import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function GenreCard({ genreName, genreImageUri, onPress }) {
  return (
    <TouchableOpacity style={styles.genreCard} onPress={onPress}>
      <Image source={genreImageUri} style={styles.genreImage} resizeMode="cover" />
      <Text style={styles.genreTitleHorizontal} numberOfLines={1}>
        {genreName}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  genreCard: {
    width: 140,
    marginRight: 18,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
    paddingVertical: 10,
  },
  genreImage: {
    width: 120,
    height: 170,
    borderRadius: 12,
  },
  genreTitleHorizontal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a3f72',
    marginTop: 10,
    textAlign: 'center',
  },
});