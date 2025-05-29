import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import StarRating from "../components/StarRating";
import defaultImage from "../assets/libri/default_genre_image.png";

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;

  const [editable, setEditable] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...book });

  const handleConfirm = () => {
    // TODO: salva le modifiche nel contesto o database
    setEditable(false);
    Alert.alert("Modifiche salvate");
  };

  const handleCancel = () => {
    setEditedBook({ ...book });
    setEditable(false);
  };

  const handleDelete = () => {
    // TODO: rimuovi dal database o contesto
    Alert.alert("Libro eliminato", "", [{ text: "OK", onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={styles.container}>
      {/* Pulsante modifica */}
      <View style={styles.header}>
        {!editable ? (
          <TouchableOpacity onPress={() => setEditable(true)} style={styles.editBtn}>
            <Text style={styles.editText}>✏️ Modifica</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
              <Text style={styles.actionText}>✔️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.actionText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Immagine copertina */}
      <Image
        source={book.cover_image_uri ? { uri: book.cover_image_uri } : defaultImage}
        style={styles.coverImage}
      />

      {/* Titolo */}
      <TextInput
        style={styles.input}
        editable={editable}
        value={editedBook.title}
        onChangeText={(text) => setEditedBook({ ...editedBook, title: text })}
      />

      {/* Autore */}
      <TextInput
        style={styles.input}
        editable={editable}
        value={editedBook.author}
        onChangeText={(text) => setEditedBook({ ...editedBook, author: text })}
      />

      {/* Sinossi */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        editable={editable}
        value={editedBook.synopsis}
        multiline
        onChangeText={(text) => setEditedBook({ ...editedBook, synopsis: text })}
      />

      {/* Stato */}
      <Picker
        enabled={editable}
        selectedValue={editedBook.status}
        onValueChange={(itemValue) =>
          setEditedBook({ ...editedBook, status: itemValue })
        }
        style={styles.picker}
      >
        <Picker.Item label="Da leggere" value="da leggere" />
        <Picker.Item label="In lettura" value="in lettura" />
        <Picker.Item label="Letto" value="letto" />
      </Picker>

      {/* Rating */}
      <StarRating
        rating={editedBook.rating || 0}
        onChange={(r) => editable && setEditedBook({ ...editedBook, rating: r })}
      />

      {/* Elimina libro */}
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑️ Elimina libro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 },
  editBtn: { padding: 6 },
  editText: { fontSize: 16, color: "#007bff" },
  editActions: { flexDirection: "row", gap: 10 },
  confirmBtn: { padding: 6 },
  cancelBtn: { padding: 6 },
  actionText: { fontSize: 20 },
  coverImage: { width: 150, height: 220, alignSelf: "center", marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    marginBottom: 12,
    paddingVertical: 4,
  },
  picker: {
    marginVertical: 12,
  },
  deleteButton: {
    marginTop: 30,
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});