import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const StarRating = ({ rating, onChange }) => {
  const maxStars = 5;

  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const filled = starNumber <= rating;

        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => onChange(starNumber)}
            activeOpacity={0.7}
            accessibilityLabel={`${starNumber} stars`}
          >
            <Text style={[styles.star, filled ? styles.filledStar : styles.emptyStar]}>
              {filled ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  filledStar: {
    color: '#ffd700', // oro
  },
  emptyStar: {
    color: '#aaa',
  },
});

export default StarRating;