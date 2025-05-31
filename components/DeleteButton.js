// components/DeleteButton.js
import React, { useContext } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BooksContext } from "../context/BooksContext";

export default function DeleteButton({ bookId }) {
  const navigation = useNavigation();
  const { removeBook } = useContext(BooksContext);

  const confirmDelete = () => {
    Alert.alert(
      "Conferma eliminazione",
      "Sei sicuro di voler eliminare questo libro?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Elimina",
          style: "destructive",
          onPress: async () => {
            // 1) Rimuovo il libro dai dati e aggiorno il file persistente
            await removeBook(bookId);

            // 2) Cerco di tornare indietro nella pila corrente:
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }

            // 3) Se qui non c'era uno schermo precedente,
            //    invio il reset al parent (cioè al TabNavigator)
            const parentNav = navigation.getParent();
            if (parentNav) {
              parentNav.reset({
                index: 0,
                routes: [{ name: "MainHome" }],
              });
            }
          },
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