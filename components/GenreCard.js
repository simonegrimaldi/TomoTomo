import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

export default function GenreCard({ genreName, genreImageUri, onPress }) {
  return (
    <View style={styles.cardWrapper}>
      {/* Blocchetto sfalsato dietro */}
      <View style={styles.shadowBlock} />
      
      <TouchableOpacity style={styles.genreCard} onPress={onPress}>
        <Image source={genreImageUri} style={styles.genreImage} resizeMode="cover" />
        <Text style={styles.genreTitleHorizontal} numberOfLines={1}>
          {genreName}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginRight: 18,
    position: 'relative',
  },
  shadowBlock: {
    position: 'absolute',
    top: 15,
    left: -5,
    width: 120,
    height: 170,
    borderRadius: 12,
    backgroundColor: '#919191',
    zIndex: 0,
    opacity: 0.7,
  },
  genreCard: {
    width: 120,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  genreImage: {
    width: 120,
    height: 170,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 8,
  },
  genreTitleHorizontal: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    paddingLeft: 8,
    textAlign: 'left',
  },
});
