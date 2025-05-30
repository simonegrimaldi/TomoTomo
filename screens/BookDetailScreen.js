import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import DatePickerDisplay from "../components/DatePickerDisplay";
import DatePickerEdit from "../components/DatePickerEdit";
import StarRating from "../components/StarRating";
import EditActionButtons from "../components/EditActionButton";
import DeleteButton from "../components/DeleteButton";
import defaultImage from "../assets/libri/default_genre_image.png";
import { BooksContext } from "../context/BooksContext";
import logo from "../assets/icon.png";
import { Ionicons } from "@expo/vector-icons";

export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const { books, updateBook } = useContext(BooksContext);

  const [book, setBook] = useState(null);
  const [editedBook, setEditedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const toggleFavorite = async () => {
    const updated = { ...editedBook, favorite: !editedBook.favorite };
    const { id, ...updatedFields } = updated;
    await updateBook(id, updatedFields);
    setEditedBook(updated);
  };

  useFocusEffect(
    useCallback(() => {
      setIsEditing(false);
    }, [])
  );

  useEffect(() => {
    if (books.length > 0) {
      const found = books.find((b) => b.id === bookId);
      if (found) {
        setBook(found);
        setEditedBook({ ...found });
      } else {
        Alert.alert("Errore", "Libro non trovato.");
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      }
    }
  }, [books, bookId]);

  useEffect(() => {
    if (books.length > 0) {
      const found = books.find((b) => b.id === bookId);
      if (found) {
        setBook(found);
        setEditedBook({ ...found });
      } else {
        // Invece di alert e reset, torna indietro semplice se il libro è stato eliminato
        navigation.goBack();
      }
    }
  }, [books, bookId]);

  if (!book || !editedBook) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Caricamento libro...</Text>
      </SafeAreaView>
    );
  }

  const handleCancelEdit = () => {
    setEditedBook({ ...book });
    setIsEditing(false);
  };

  const handleConfirmEdit = async () => {
    const { status, date_start, date_end } = editedBook;

    if ((status === "In lettura" || status === "Letto") && !date_start) {
      Alert.alert("Errore", "Devi inserire una data di inizio lettura.");
      return;
    }

    if (status === "Letto" && !date_end) {
      Alert.alert("Errore", "Devi inserire una data di fine lettura.");
      return;
    }

    if (date_start && date_end && new Date(date_end) < new Date(date_start)) {
      Alert.alert(
        "Errore",
        "La data di fine lettura non può precedere quella di inizio."
      );
      return;
    }

    try {
      const { id, ...updatedFields } = editedBook;
      await updateBook(id, updatedFields);
      setIsEditing(false);
    } catch (err) {
      console.error("Errore durante la conferma modifica:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF600" />
        </TouchableOpacity>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image
            source={
              editedBook.cover_image_uri
                ? { uri: editedBook.cover_image_uri }
                : defaultImage
            }
            style={styles.coverImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButtonOverlay}
          >
            <Text
              style={[
                styles.favoriteIcon,
                editedBook.favorite && styles.favoriteActive,
              ]}
            >
              {editedBook.favorite ? "❤" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleAuthorContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.titleText, styles.titleInput]}
                value={editedBook.title}
                onChangeText={(text) =>
                  setEditedBook({ ...editedBook, title: text })
                }
                multiline
                numberOfLines={2}
                placeholder="Titolo"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={[styles.authorText, styles.authorInput]}
                value={editedBook.author}
                onChangeText={(text) =>
                  setEditedBook({ ...editedBook, author: text })
                }
                numberOfLines={1}
                placeholder="Autore"
                placeholderTextColor="#aaa"
              />
            </>
          ) : (
            <>
              <Text
                style={[styles.titleText, styles.titleAuthorCentered]}
                numberOfLines={2}
              >
                {editedBook.title}
              </Text>
              <Text
                style={[styles.authorText, styles.titleAuthorCentered]}
                numberOfLines={1}
              >
                {editedBook.author}
              </Text>
            </>
          )}
        </View>

        {isEditing && (
          <>
            <View style={styles.statusContainerEdit}>
              <Text style={styles.sectionTitle}>Stato</Text>
              <Picker
                selectedValue={capitalize(editedBook.status) || "Da leggere"}
                onValueChange={(value) => {
                  setEditedBook((prev) => {
                    let updated = { ...prev, status: value };
                    if (value === "Da leggere") {
                      updated.date_start = null;
                      updated.date_end = null;
                      updated.rating = null;
                      updated.notes = "";
                    }
                    if (
                      (value === "Letto" || value === "In lettura") &&
                      !prev.date_start
                    ) {
                      updated.date_start = new Date()
                        .toISOString()
                        .substring(0, 10);
                    }
                    if (value !== "Letto") {
                      updated.date_end = null;
                      updated.rating = null;
                      updated.notes = "";
                    }
                    return updated;
                  });
                }}
                style={[styles.picker, styles.pickerColored]}
                dropdownIconColor="#FFF600"
                itemStyle={styles.pickerItemColored}
              >
                <Picker.Item
                  label="Da leggere"
                  value="Da leggere"
                  color="#FFF600"
                />
                <Picker.Item
                  label="In lettura"
                  value="In lettura"
                  color="#FFF600"
                />
                <Picker.Item label="Letto" value="Letto" color="#FFF600" />
              </Picker>
            </View>

            {editedBook.status !== "Da leggere" && (
              <View style={styles.statusDatesContainer}>
                <DatePickerEdit
                  label="Inizio"
                  date={editedBook.date_start}
                  onDateChange={(newDate) => {
                    setEditedBook((prev) => ({
                      ...prev,
                      date_start: newDate,
                      date_end:
                        prev.date_end && prev.date_end < newDate
                          ? null
                          : prev.date_end,
                    }));
                  }}
                />

                {editedBook.status === "Letto" && (
                  <DatePickerEdit
                    label="Fine"
                    date={editedBook.date_end}
                    minimumDate={
                      editedBook.date_start
                        ? new Date(editedBook.date_start)
                        : null
                    }
                    onDateChange={(newDate) => {
                      setEditedBook((prev) => ({
                        ...prev,
                        date_end: newDate,
                      }));
                    }}
                  />
                )}
              </View>
            )}

            {/* Valutazione e Note solo se stato = Letto */}
            {editedBook.status === "Letto" && (
              <>
                <Text style={styles.sectionTitle}>Valutazione</Text>
                <StarRating
                  rating={editedBook.rating || 0}
                  onChange={(val) =>
                    setEditedBook((prev) => ({ ...prev, rating: val }))
                  }
                />

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Note
                </Text>
                <TextInput
                  placeholder="Inserisci note..."
                  value={editedBook.notes || ""}
                  onChangeText={(text) =>
                    setEditedBook((prev) => ({ ...prev, notes: text }))
                  }
                  style={[styles.synopsisInput, styles.editable]}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#888"
                />
              </>
            )}
          </>
        )}

        {!isEditing && (
          <>
            <View style={styles.stateEditRow}>
              <View style={styles.statusContainer}>
                <Text style={[styles.cardLabel, styles.statusLabelNonEditing]}>
                  Stato
                </Text>
                <Text style={[styles.cardValue, styles.statusValueNonEditing]}>
                  {editedBook.status}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={styles.editButtonRight}
              >
                <Text style={styles.editText}>Modifica</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusDatesContainer}>
              <DatePickerDisplay label="Inizio" date={editedBook.date_start} />
              <DatePickerDisplay label="Fine" date={editedBook.date_end} />
            </View>

            {/* Valutazione e note solo se stato = Letto */}
            {editedBook.status === "Letto" && (
              <View style={styles.ratingRow}>
                <Text style={styles.sectionTitle}>Valutazione</Text>
                <StarRating rating={editedBook.rating || 0} editable={false} />

                {editedBook.notes ? (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                      Note
                    </Text>
                    <Text style={styles.synopsisText}>{editedBook.notes}</Text>
                  </>
                ) : null}
              </View>
            )}
          </>
        )}

        {isEditing && (
          <EditActionButtons
            onCancel={handleCancelEdit}
            onConfirm={handleConfirmEdit}
          />
        )}

        {!isEditing && <DeleteButton bookId={book.id} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontSize: 15,
    color: "#eee",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingTop: 100, // più spazio per barra logo più alta
    paddingBottom: 40,
    backgroundColor: "#000", // nero anche qui
  },

  logoBar: {
    height: 130,
    paddingTop: 40,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#FFD700",
    borderBottomWidth: 1,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: "100%",
    transform: [{ translateY: -12 }],
  },
  logoImage: {
    height: 80, // aumentato da 30 a 40
    width: 140, // aumentato da 120 a 140
  },

  loadingText: {
    padding: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  coverContainer: {
    width: "100%",
    height: 400, // altezza per dare spazio all'immagine
    backgroundColor: "#000",
    marginBottom: 16,
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  titleAuthorContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  titleAuthorCentered: {
    textAlign: "center",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  titleOverlay: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  titleText: {
    color: "#fff",
    fontSize: 24, // da 28 a 24
    fontWeight: "bold",
    marginBottom: 6,
  },
  authorText: {
    color: "#ddd",
    fontSize: 16, // da 18 a 16
  },
  stateEditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  statusContainer: {
    backgroundColor: "#222",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 180, // più largo per vedere tutto il testo
    justifyContent: "center",
  },

  statusPicker: {
    marginTop: 20,
    fontSize: 14, // font ridotto
    height: 60, // altezza un po' più contenuta
    marginBottom: 50,
  },

  pickerColored: {
    color: "#FFF600",
  },

  pickerItemColored: {
    color: "#FFF600",
  },

  dateCard: {
    backgroundColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    width: "48%", // metà larghezza per stare in riga
    alignItems: "center",
    flexDirection: "row", // testo e label su una riga
    justifyContent: "center",
    marginBottom: 12,
  },

  cardLabel: {
    color: "#aaa",
    fontSize: 12, // font più piccolo
    fontWeight: "600",
    marginRight: 6, // spazio a destra per separare dal valore
  },

  cardValue: {
    color: "#eee",
    fontSize: 14,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#eee",
    fontWeight: "bold",
    fontSize: 18, // da 20 a 18
    marginBottom: 12,
  },
  synopsisText: {
    color: "#ccc",
    fontSize: 14, // da 16 a 14
    lineHeight: 20,
  },

  titleInput: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#1e90ff",
    paddingVertical: 4,
    marginBottom: 8,
  },

  authorInput: {
    color: "#ddd",
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1e90ff",
    paddingVertical: 2,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteButtonOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
    zIndex: 10,
  },

  favoriteIcon: {
    fontSize: 30,
    color: "#888",
  },

  favoriteActive: {
    color: "#ffd700",
  },

  editButton: {
    backgroundColor: "#FFF600",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
  },

  editButtonRight: {
    backgroundColor: "#FFF600",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  editText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },

  ratingRow: {
    paddingHorizontal: 10,
    marginBottom: 24,
  },

  starRatingCentered: {
    alignItems: "center",
  },

  statusLabelNonEditing: {
    fontSize: 14,
    fontWeight: "600",
    color: "#aaa",
  },
  statusValueNonEditing: {
    fontSize: 22,
    fontWeight: "700",
    color: "#eee",
  },

  stateOnlyContainer: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  statusContainerEdit: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  statusDatesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 16,
    width: "32%",
    alignItems: "center",
  },

  genreContainer: {
    paddingHorizontal: 10,
    marginBottom: 32,
  },

  picker: {
    backgroundColor: "#222",
    color: "#eee",
  },

  synopsisContainer: {
    paddingHorizontal: 10,
    marginBottom: 40,
  },

  synopsisInput: {
    backgroundColor: "#222",
    color: "#eee",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    height: 140,
  },
  editable: {},
});
