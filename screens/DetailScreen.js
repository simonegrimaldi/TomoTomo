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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

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
        // Se non lo trova (perché forse è stato eliminato), torna indietro
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
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-40}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Barra superiore con logo e pulsanti */}
        <View style={styles.logoBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF600" />
          </TouchableOpacity>

          <Image source={logo} style={styles.logoImage} resizeMode="contain" />

          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButtonOverlay}
          >
            <Image
              source={
                editedBook.favorite
                  ? require("../assets/Preferiti.png")
                  : require("../assets/nonPreferiti.png")
              }
              style={[
                styles.favoriteIconImage,
                { tintColor: editedBook.favorite ? "#ffd700" : "#888" },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* ScrollView “normale” senza flexGrow */}
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Copertina */}
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
          </View>

          {/* Titolo e autore */}
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
              {/* Picker “Stato” */}
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

              {/* DatePickerEdit “Inizio” e (se Letto) “Fine” */}
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

              {/* Valutazione + Note solo se “Letto” */}
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
                    style={[styles.synopsisInput, { color: "white" }]}
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
              {editedBook.synopsis ? (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 20, marginLeft:16, }]}>
                    Sinossi
                  </Text>
                  <Text style={styles.synopsisText}>{editedBook.synopsis}</Text>
                </>
              ) : null}
              {/* Mostra Stato “statico” + bottone Modifica */}
              <View style={styles.stateEditRow}>
                <View style={styles.statusContainer}>
                  <Text
                    style={[styles.cardLabel, styles.statusLabelNonEditing]}
                  >
                    Stato
                  </Text>
                  <Text
                    style={[styles.cardValue, styles.statusValueNonEditing]}
                  >
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

              {/* Visualizza date “Inizio” e “Fine” */}
              <View style={styles.statusDatesContainer}>
                <DatePickerDisplay
                  label="Inizio"
                  date={editedBook.date_start}
                />
                <DatePickerDisplay label="Fine" date={editedBook.date_end} />
              </View>

              {/* Se “Letto”, mostra valutazione e note “statiche” */}
              {editedBook.status === "Letto" && (
                <View style={styles.ratingRow}>
                  <Text style={styles.sectionTitle}>Valutazione</Text>
                  <StarRating
                    rating={editedBook.rating || 0}
                    editable={false}
                  />

                  {editedBook.notes ? (
                    <>
                      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                        Note
                      </Text>
                      <Text style={styles.synopsisText}>
                        {editedBook.notes}
                      </Text>
                    </>
                  ) : null}
                </View>
              )}
            </>
          )}

          {/* Pulsanti “Conferma” / “Annulla” in modifica, o “Elimina” se non in modifica */}
          {isEditing && (
            <EditActionButtons
              onCancel={handleCancelEdit}
              onConfirm={handleConfirmEdit}
            />
          )}
          {!isEditing && <DeleteButton bookId={book.id} />}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
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
    height: 80,
    width: 140,
  },
  favoriteButtonOverlay: {
    position: "absolute",
    right: 16,
    top: "100%",
    transform: [{ translateY: -12 }],
  },
  favoriteIconImage: {
    width: 30,
    height: 30,
  },

  // ③ RIMUOVIAMO flexGrow:1 da contentContainerStyle
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 20,
  },

  loadingText: {
    marginTop: 40,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  coverContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  titleAuthorContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titleAuthorCentered: {
    textAlign: "center",
  },
  titleText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  authorText: {
    color: "#ddd",
    fontSize: 16,
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
  statusContainerEdit: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#222",
    color: "#eee",
  },
  pickerColored: {
    color: "#FFF600",
  },
  pickerItemColored: {
    color: "#FFF600",
  },
  statusDatesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#eee",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },
  synopsisInput: {
    backgroundColor: "#222",
    color: "#eee",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    height: 140,
  },
  editable: { color: "#000" },
  stateEditRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    // opzionale per prevenire overflow:
    flexWrap: "nowrap",
  },

  statusContainer: {
    backgroundColor: "#222",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    // Rimuovo width fissa e uso flex per adattarsi allo spazio
    flex: 1,
    marginRight: 10, // Spazio tra stato e bottone
    justifyContent: "center",
  },
  cardLabel: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 6,
  },
  cardValue: {
    color: "#eee",
    fontSize: 14,
    fontWeight: "700",
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
  ratingRow: {
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
  editButtonRight: {
    backgroundColor: "#FFF600",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    // Impedisce che il bottone si restringa troppo
    flexShrink: 0,
  },

  editText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  synopsisText: {
  color: "#eee",
  fontSize: 16,
  lineHeight: 22,
  paddingHorizontal: 20,
  marginBottom: 20,
  textAlign: "center",
  
},
});
