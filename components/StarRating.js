import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const StarRating = ({ rating, onChange = () => {}, editable = true }) => {
  const maxStars = 5;

  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const filled = starNumber <= rating;

        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => {
              if (editable) onChange(starNumber);
            }}
            activeOpacity={editable ? 0.7 : 1}
            accessibilityLabel={`${starNumber} stars`}
            disabled={!editable}
          >
            <Text
              style={[
                styles.star,
                filled ? styles.filledStar : styles.emptyStar,
              ]}
            >
              {filled ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  filledStar: {
    color: "#ffd700",
  },
  emptyStar: {
    color: "#aaa",
  },
});

export default StarRating;
