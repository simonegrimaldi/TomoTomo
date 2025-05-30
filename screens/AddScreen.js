import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BooksContext } from "../context/BooksContext";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import logo from "../assets/icon.png";

import DatePickerEdit from "../components/DatePickerEdit";
import LabeledPicker from "../components/LabeledPicker";
import StarRating from "../components/StarRating";

const sanitizeFilename = (name) =>
  name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

const AddBook = ({ navigation }) => {
  const { addBook } = useContext(BooksContext);

  const genres = [
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
  ];

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [coverImageUri, setCoverImageUri] = useState("");
  const [status, setStatus] = useState("da leggere");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [genre, setGenre] = useState(genres[0]);

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setAuthor("");
      setSynopsis("");
      setGenre(genres[0]);
      setCoverImageUri("");
      setStatus("da leggere");
      setRating(0);
      setNotes("");
      setDateStart(null);
      setDateEnd(null);
    }, [])
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Permesso negato",
        "Serve il permesso per accedere alla galleria"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;

    try {
      const dirUri = FileSystem.documentDirectory + "assets/libri/";
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }
      // Estrai estensione in modo sicuro
      const uriParts = uri.split(".");
      const fileExt = uriParts[uriParts.length - 1].split(/\#|\?/)[0];
      const safeName = sanitizeFilename(title || "unnamed") + "." + fileExt;
      const destUri = dirUri + safeName;
      await FileSystem.copyAsync({ from: uri, to: destUri });
      setCoverImageUri(destUri);
      Alert.alert("Successo", "Immagine salvata correttamente!");
    } catch (error) {
      Alert.alert("Errore", "Impossibile salvare immagine: " + error.message);
      console.error("Error saving image:", error);
    }
  };

  const handleSubmit = async () => {
    if (!title || !author || !synopsis || !genre || !coverImageUri) {
      Alert.alert(
        "Errore",
        "Compila tutti i campi obbligatori incluso la copertina"
      );
      return;
    }
    if (dateStart && dateEnd && dateEnd < dateStart) {
      Alert.alert(
        "Errore",
        "La data di fine lettura deve essere successiva o uguale alla data di inizio"
      );
      return;
    }

    const bookData = {
      title,
      author,
      synopsis,
      genre,
      cover_image_uri: coverImageUri,
      status,
      favorite: false,
      rating: status === "letto" ? rating : null,
      notes: status === "letto" ? notes : null,
      date_start:
        status === "in lettura" || status === "letto" ? dateStart : null,
      date_end: status === "letto" ? dateEnd : null,
    };

    try {
      await addBook(bookData);
      Alert.alert("Successo", "Libro salvato!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Errore", "Si è verificato un errore durante il salvataggio");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoBar}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Aggiungi libro</Text>

          <TextInput
            placeholder="Titolo"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#888"
            autoFocus
          />
          <TextInput
            placeholder="Autore"
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Sinossi"
            value={synopsis}
            onChangeText={setSynopsis}
            style={[styles.input, styles.textArea]}
            multiline
            placeholderTextColor="#888"
          />

          <LabeledPicker
            label="Genere"
            selectedValue={genre}
            onValueChange={setGenre}
            items={genres.map((g) => ({ label: g, value: g }))}
            pickerStyle={styles.pickerColored}
            itemStyle={styles.pickerItemColored}
          />

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              style={styles.pickImageButton}
              onPress={pickImage}
            >
              <Text style={styles.pickImageButtonText}>
                Seleziona copertina
              </Text>
            </TouchableOpacity>
            {coverImageUri ? (
              <Image
                source={{ uri: coverImageUri }}
                style={styles.coverImage}
              />
            ) : null}
          </View>

          <LabeledPicker
            label="Stato"
            selectedValue={status}
            onValueChange={setStatus}
            items={[
              { label: "Da leggere", value: "da leggere" },
              { label: "In lettura", value: "in lettura" },
              { label: "Letto", value: "letto" },
            ]}
            pickerStyle={styles.pickerColored}
            itemStyle={styles.pickerItemColored}
          />

          {status === "in lettura" && (
            <View style={styles.statusDatesContainer}>
              <DatePickerEdit
                label="Inizio"
                date={dateStart}
                onDateChange={setDateStart}
              />
            </View>
          )}

          {status === "letto" && (
            <View style={styles.statusDatesContainer}>
              <DatePickerEdit
                label="Inizio"
                date={dateStart}
                onDateChange={setDateStart}
              />
              {status === "letto" && (
                <DatePickerEdit
                  label="Fine"
                  date={dateEnd}
                  minimumDate={dateStart ? new Date(dateStart) : undefined}
                  onDateChange={setDateEnd}
                />
              )}
            </View>
          )}

          {status === "letto" && (
            <>
              <Text style={styles.label}>Valutazione</Text>
              <View style={{ marginBottom: 16 }}>
                <StarRating rating={rating} onChange={setRating} />
              </View>
              <TextInput
                placeholder="Note"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.textArea]}
                multiline
                placeholderTextColor="#888"
              />
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Salva libro</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  logoBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    paddingTop: 40,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#FFF600",
    borderBottomWidth: 1,
    zIndex: 100,
  },
  logoImage: {
    width: 140,
    height: 80,
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFF600",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContent: {
    paddingTop: 140, // spazio sotto barra logo assoluta
    paddingBottom: 40,
    backgroundColor: "#000",
  },

  input: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#444",
    color: "#eee",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#aaa",
  },
  pickerColored: {
    color: "#FFF600", // colore testo picker selezionato
  },
  pickerItemColored: {
    color: "#FFF600", // colore testo elenco item
    fontSize: 16,
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  pickImageButton: {
    backgroundColor: "#FFF600",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom: 16,
  },
  pickImageButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  coverImage: {
    width: 150,
    height: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444",
    resizeMode: "cover",
  },

  statusDatesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 24,
  },

  submitButton: {
    backgroundColor: "#FFF600",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AddBook;