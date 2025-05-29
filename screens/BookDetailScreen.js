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
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";

import StarRating from "../components/StarRating";
import EditActionButtons from "../components/EditActionButton";
import DeleteButton from "../components/DeleteButton";
import defaultImage from "../assets/libri/default_genre_image.png";
import { BooksContext } from "../context/BooksContext";
import logo from "../assets/icon.png";


export default function BookDetailScreen({ route, navigation }) {
  const { bookId } = route.params;
  const { books, updateBook } = useContext(BooksContext);

  const [book, setBook] = useState(null);
  const [editedBook, setEditedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const toggleFavorite = () => {
    const updated = { ...editedBook, favorite: !editedBook.favorite };
    setEditedBook(updated);
    updateBook(updated.id, updated);
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
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
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
       {/* Barra fissa con logo */}
      <View style={styles.logoBar}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover + Favorite overlay */}
<View style={styles.coverContainer}>
  <Image
    source={editedBook.cover_image_uri ? { uri: editedBook.cover_image_uri } : defaultImage}
    style={styles.coverImage}
    resizeMode="contain"
  />
  <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButtonOverlay}>
    <Text style={[styles.favoriteIcon, editedBook.favorite && styles.favoriteActive]}>
      {editedBook.favorite ? "⭐" : "☆"}
    </Text>
  </TouchableOpacity>
</View>

{/* Titolo + autore */}
<View style={styles.titleAuthorContainer}>
  {isEditing ? (
    <>
      <TextInput
        style={[styles.titleText, styles.titleInput]}
        value={editedBook.title}
        onChangeText={(text) => setEditedBook({ ...editedBook, title: text })}
        multiline
        numberOfLines={2}
        autoFocus
        placeholder="Titolo"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={[styles.authorText, styles.authorInput]}
        value={editedBook.author}
        onChangeText={(text) => setEditedBook({ ...editedBook, author: text })}
        numberOfLines={1}
        placeholder="Autore"
        placeholderTextColor="#aaa"
      />
    </>
  ) : (
    <>
      <Text style={styles.titleText} numberOfLines={2}>
        {editedBook.title}
      </Text>
      <Text style={styles.authorText} numberOfLines={1}>
        {editedBook.author}
      </Text>
    </>
  )}
</View>

<View style={styles.stateEditRow}>
  <View style={styles.statusContainer}>
    <Text style={styles.cardLabel}>Stato</Text>
    {isEditing ? (
      <Picker
        selectedValue={editedBook.status || "Da leggere"}
        onValueChange={(value) => {
          setEditedBook((prev) => {
            let updated = { ...prev, status: value };

            if (value !== "Letto") {
              updated.date_end = null;
            }

            if ((value === "Letto" || value === "In lettura") && !prev.date_start) {
              updated.date_start = new Date().toISOString().substring(0, 10);
            }

            return updated;
          });
        }}
        style={styles.statusPicker}
        dropdownIconColor="#fff"
      >
        <Picker.Item label="Da leggere" value="Da leggere" />
        <Picker.Item label="In lettura" value="In lettura" />
        <Picker.Item label="Letto" value="Letto" />
      </Picker>
    ) : (
      <Text style={styles.cardValue}>{editedBook.status}</Text>
    )}
  </View>

  {!isEditing && (
    <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButtonRight}>
      <Text style={styles.editText}>Modifica</Text>
    </TouchableOpacity>
  )}
</View>

        <View style={styles.ratingRow}>
          <StarRating
            rating={editedBook.rating || 0}
            editable={isEditing}
            onChange={(r) => isEditing && setEditedBook({ ...editedBook, rating: r })}
          />
        </View>

        <View style={styles.statusDatesContainer}>

          {(editedBook.status === "In lettura" || editedBook.status === "Letto") && (
            <View style={styles.dateCard}>
              <Text style={styles.cardLabel}>Inizio</Text>
              {isEditing ? (
                <TouchableOpacity onPress={() => setShowStartDate(true)}>
                  <Text style={styles.cardValue}>
                    {editedBook.date_start || "Seleziona"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.cardValue}>{editedBook.date_start || "—"}</Text>
              )}
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
            </View>
          )}

          {editedBook.status === "Letto" && (
            <View style={styles.dateCard}>
              <Text style={styles.cardLabel}>Fine</Text>
              {isEditing ? (
                <TouchableOpacity onPress={() => setShowEndDate(true)}>
                  <Text style={styles.cardValue}>
                    {editedBook.date_end || "Seleziona"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.cardValue}>{editedBook.date_end || "—"}</Text>
              )}
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
                        Alert.alert("Errore", "La data di fine non può precedere quella di inizio.");
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
            </View>
          )}
        </View>

        {/* Genre */}
        <View style={styles.genreContainer}>
          <Text style={styles.sectionTitle}>Genere</Text>
          {isEditing ? (
            <Picker
              selectedValue={editedBook.genre}
              onValueChange={(value) =>
                setEditedBook((prev) => ({ ...prev, genre: value }))
              }
              style={styles.picker}
            >
              {[
                "Narrativa",
                "Fantasy",
                "Fantascienza",
                "Giallo",
                "Horror",
                "Romanzo storico",
                "Biografia",
                "Saggio",
                "Avventura",
                "Poesia",
                "Thriller",
                "Young Adult",
                "Classico",
                "Altro",
              ].map((g) => (
                <Picker.Item key={g} label={g} value={g} />
              ))}
            </Picker>
          ) : (
            <Text style={styles.cardValue}>{editedBook.genre}</Text>
          )}
        </View>

        {/* Synopsis */}
        <View style={styles.synopsisContainer}>
          <Text style={styles.sectionTitle}>Sinossi</Text>
          {isEditing ? (
            <TextInput
              style={[styles.synopsisInput, styles.editable]}
              value={editedBook.synopsis}
              editable
              multiline
              numberOfLines={6}
              onChangeText={(text) => setEditedBook({ ...editedBook, synopsis: text })}
            />
          ) : (
            <Text style={styles.synopsisText}>
              {editedBook.synopsis || "Nessuna sinossi disponibile."}
            </Text>
          )}
        </View>

        {/* Edit action buttons */}
        {isEditing && (
          <EditActionButtons onCancel={handleCancelEdit} onConfirm={handleConfirmEdit} />
        )}

        <DeleteButton bookId={book.id} />
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
    paddingTop: 100,     // più spazio per barra logo più alta
    paddingBottom: 40,
    backgroundColor: "#000",  // nero anche qui
  },


  logoBar: {
    height: 130,            // aumentato per più spazio
    paddingTop: 40,        // padding per evitare notch
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  logoImage: {
    height: 80,  // aumentato da 30 a 40
    width: 140,  // aumentato da 120 a 140
  },

  loadingText: {
    padding: 20,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  coverContainer: {
    width: "100%",
    height: 400,           // altezza per dare spazio all'immagine
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
    fontSize: 24,  // da 28 a 24
    fontWeight: "bold",
    marginBottom: 6,
  },
  authorText: {
    color: "#ddd",
    fontSize: 16,  // da 18 a 16
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
    width: 180,   // più largo per vedere tutto il testo
    justifyContent: "center",
  },


  statusPicker: {
    color: "#eee",
    fontSize: 14,   // font ridotto
    height: 60,    // altezza un po' più contenuta
  },

  dateCard: {
    backgroundColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    width: "48%",    // metà larghezza per stare in riga
    alignItems: "center",
    flexDirection: "row",  // testo e label su una riga
    justifyContent: "center",
    marginBottom: 12,
  },

  cardLabel: {
    color: "#aaa",
    fontSize: 12,   // font più piccolo
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
    fontSize: 18,  // da 20 a 18
    marginBottom: 12,
  },
  synopsisText: {
    color: "#ccc",
    fontSize: 14,  // da 16 a 14
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

  statusDatesContainer: {
    flexDirection: "row",
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
