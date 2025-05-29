import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function EditActionButtons({ onCancel, onConfirm }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
        <Text style={styles.text}>Annulla</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
        <Text style={styles.text}>Conferma</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  button: {
    flex: 0.45,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#ccc",
  },
  confirm: {
    backgroundColor: "#0C8E15",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});
