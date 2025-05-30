import React, { useContext } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BooksContext } from "../context/BooksContext";

export default function DeleteButton({ bookId }) {
  const navigation = useNavigation();
  const { removeBook } = useContext(BooksContext); // ⬅️ Usa removeBook

  const confirmDelete = () => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questo libro?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          onPress: async () => {
  await removeBook(bookId);
navigation.goBack() },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
      <Text style={styles.deleteText}>Elimina libro</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginTop: 24,
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});