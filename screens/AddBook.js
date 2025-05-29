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
import { loadBooks, saveBooks } from '../services/Storage';
import { BooksContext } from "../context/BooksContext";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Alert } from 'react-native';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({ ...book });
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const { updateBook } = useContext(BooksContext);

  useEffect(() => {
    const fetchBooks = async () => {
      const loadedBooks = await loadBooks();
    };
    fetchBooks();
  }, []);

  const handleCancelEdit = () => {
    setEditedBook({ ...book });
    setIsEditing(false);
  };

  const handleConfirmEdit = async () => {
    const { status, date_start, date_end } = editedBook;

    if ((status === "in lettura" || status === "letto") && !date_start) {
      Alert.alert("Errore", "Devi inserire una data di inizio lettura.");
      return;
    }

    if (status === "letto" && !date_end) {
      Alert.alert("Errore", "Devi inserire una data di fine lettura.");
      return;
    }

    if (date_start && date_end && new Date(date_end) < new Date(date_start)) {
      Alert.alert("Errore", "La data di fine lettura non può precedere quella di inizio.");
      return;
    }

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

        <Image
          source={
            editedBook.cover_image_uri
              ? { uri: editedBook.cover_image_uri }
              : defaultImage
          }
          style={styles.image}
        />

        <TextInput
          style={[styles.input, isEditing && styles.editable]}
          value={editedBook.author}
          editable={isEditing}
          onChangeText={(text) => setEditedBook({ ...editedBook, author: text })}
        />

        <View style={styles.datesContainer}>
          <Text style={styles.dateText}>Inizio: {editedBook.date_start || "—"}</Text>
          <Text style={styles.dateText}>Fine: {editedBook.date_end || "—"}</Text>
        </View>

        <TextInput
          style={[styles.input, styles.multiline, isEditing && styles.editable]}
          value={editedBook.synopsis}
          editable={isEditing}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setEditedBook({ ...editedBook, synopsis: text })}
        />

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

        {/* Stato */}
        <Text style={styles.sectionTitle}>Stato</Text>
        <Picker
          selectedValue={editedBook.status}
          onValueChange={(value) => {
            const updated = { ...editedBook, status: value };

            if (value !== "letto") updated.date_end = null;

            if ((value === "letto" || value === "in lettura") && !editedBook.date_start) {
              updated.date_start = new Date().toISOString().substring(0, 10);
            }

            setEditedBook(updated);
          }}
          enabled={isEditing}
          style={styles.picker}
        >
          <Picker.Item label="Da leggere" value="da leggere" />
          <Picker.Item label="In lettura" value="in lettura" />
          <Picker.Item label="Letto" value="letto" />
        </Picker>

        {(editedBook.status === "in lettura" || editedBook.status === "letto") && (
          <>
            <Text style={styles.sectionTitle}>Data inizio lettura</Text>
            <TouchableOpacity
              onPress={() => setShowStartDate(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {editedBook.date_start || "Seleziona data"}
              </Text>
            </TouchableOpacity>
            {showStartDate && (
              <DateTimePicker
                mode="date"
                value={editedBook.date_start ? new Date(editedBook.date_start) : new Date()}
                onChange={(_, selected) => {
                  setShowStartDate(false);
                  if (selected) {
                    setEditedBook((prev) => ({
                      ...prev,
                      date_start: selected.toISOString().substring(0, 10),
                      date_end:
                        prev.date_end && new Date(prev.date_end) < selected
                          ? null
                          : prev.date_end,
                    }));
                  }
                }}
              />
            )}
          </>
        )}

        {editedBook.status === "letto" && (
          <>
            <Text style={styles.sectionTitle}>Data fine lettura</Text>
            <TouchableOpacity
              onPress={() => setShowEndDate(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {editedBook.date_end || "Seleziona data"}
              </Text>
            </TouchableOpacity>
            {showEndDate && (
              <DateTimePicker
                mode="date"
                value={editedBook.date_end ? new Date(editedBook.date_end) : new Date()}
                onChange={(_, selected) => {
                  setShowEndDate(false);
                  if (selected) {
                    if (
                      editedBook.date_start &&
                      new Date(selected) < new Date(editedBook.date_start)
                    ) {
                      Alert.alert(
                        "Errore",
                        "La data di fine non può precedere quella di inizio."
                      );
                      return;
                    }
                    setEditedBook((prev) => ({
                      ...prev,
                      date_end: selected.toISOString().substring(0, 10),
                    }));
                  }
                }}
              />
            )}
          </>
        )}

        {isEditing && (
          <EditActionButtons
            onCancel={handleCancelEdit}
            onConfirm={handleConfirmEdit}
          />
        )}

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
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
});