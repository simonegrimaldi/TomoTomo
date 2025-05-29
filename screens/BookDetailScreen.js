import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StarRating from "../components/StarRating";
import EditActionButtons from "../components/EditActionButton";
import DeleteButton from "../components/DeleteButton";
import defaultImage from "../assets/libri/default_genre_image.png";
import { loadBooks, saveBooks } from '../services/Storage'; // Assicurati di importare le funzioni
import { BooksContext } from "../context/BooksContext"; // Importa il contesto

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...book });

  useEffect(() => {
    const fetchBooks = async () => {
      const loadedBooks = await loadBooks();
      setBooks(loadedBooks);
    };
    fetchBooks();
  }, []);

  const handleCancelEdit = () => {
    setEditedBook({ ...book });
    setIsEditing(false);
  };

  const { updateBook } = useContext(BooksContext);

const handleConfirmEdit = async () => {
  try {
    await updateBook(editedBook.id, editedBook);
    setIsEditing(false);
  } catch (err) {
    console.error("Errore durante la conferma modifica:", err);
  }
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Indietro</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Titolo centrato + Modifica */}
        <View style={styles.header}>
          <View style={styles.titleWrapper}>
            <TextInput
              style={[styles.title, isEditing && styles.editable]}
              value={editedBook.title}
              editable={isEditing}
              onChangeText={(text) => setEditedBook({ ...editedBook, title: text })}
            />
          </View>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editBtn}>
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Copertina */}
        <Image
          source={
            editedBook.cover_image_uri
              ? { uri: editedBook.cover_image_uri }
              : defaultImage
          }
          style={styles.image}
        />

        {/* Autore */}
        <TextInput
          style={[styles.input, isEditing && styles.editable]}
          value={editedBook.author}
          editable={isEditing}
          onChangeText={(text) => setEditedBook({ ...editedBook, author: text })}
        />

        {/* Date */}
        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>Inizio: {editedBook.date_start || "—"}</Text>
          <Text style={styles.dateText}>Fine: {editedBook.date_end || "—"}</Text>
        </View>

        {/* Sinossi */}
        <TextInput
          style={[styles.input, styles.multiline, isEditing && styles.editable]}
          value={editedBook.synopsis}
          editable={isEditing}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setEditedBook({ ...editedBook, synopsis: text })}
        />

        {/* Valutazione */}
        <Text style={styles.sectionTitle}>Valutazione</Text>
        <StarRating
          rating={editedBook.rating || 0}
          editable={isEditing}
          onChange={(r) => {
            if (isEditing) {
              setEditedBook({ ...editedBook, rating: r });
            }
          }}
        />

        {/* Bottoni modifica */}
        {isEditing && (
          <EditActionButtons
            onCancel={handleCancelEdit}
            onConfirm={handleConfirmEdit} // Passa la funzione di conferma
          />
        )}

        {/* Elimina */}
        <DeleteButton bookId={book.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eaeef1",
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  backButtonText: {
    fontSize: 18,
    color: "#007aff",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  editBtn: {
    paddingHorizontal: 8,
    backgroundColor: "#007aff",
    borderRadius: 5,
  },
  editText: {
    fontSize: 22,
    color: "#fff",
  },
  image: {
    width: 250,
    height: 350,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  editable: {
    backgroundColor: "#e0f7fa",
    borderColor: "#007aff",
  },
  multiline: {
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    alignSelf: "flex-start",
    color: "#333",
  },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
});
