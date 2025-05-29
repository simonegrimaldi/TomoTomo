import React, { useState, useEffect, useContext, useCallback } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import logo from "../assets/icon.png";

const sanitizeFilename = (name) =>
  name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

const StarRating = ({ rating, onChange }) => {
  const maxStars = 5;
  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, i) => {
        const starNumber = i + 1;
        const filled = starNumber <= rating;
        return (
          <TouchableOpacity
            key={starNumber}
            onPress={() => onChange(starNumber)}
            activeOpacity={0.7}
            style={styles.starTouchable}
          >
            <Text
              style={[styles.star, filled ? styles.filledStar : styles.emptyStar]}
            >
              {filled ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

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
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permesso negato", "Serve il permesso per accedere alla galleria");
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
      const fileExt = uri.split(".").pop();
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

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setDateStart(selectedDate);
      if (dateEnd && selectedDate > dateEnd) setDateEnd(selectedDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      if (dateStart && selectedDate < dateStart) {
        Alert.alert("Errore", "La data di fine non può essere precedente alla data di inizio");
      } else {
        setDateEnd(selectedDate);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !author || !synopsis || !genre || !coverImageUri) {
      Alert.alert("Errore", "Compila tutti i campi obbligatori incluso la copertina");
      return;
    }
    if (dateStart && dateEnd && dateEnd < dateStart) {
      Alert.alert("Errore", "La data di fine lettura deve essere successiva o uguale alla data di inizio");
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
        (status === "in lettura" || status === "letto") && dateStart
          ? dateStart.toISOString().substring(0, 10)
          : null,
      date_end: status === "letto" && dateEnd ? dateEnd.toISOString().substring(0, 10) : null,
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
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Barra fissa con logo */}
        <View style={styles.logoBar}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            placeholder="Titolo"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#888"
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

          <Text style={styles.label}>Genere</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={genre}
              onValueChange={setGenre}
              style={styles.picker}
              dropdownIconColor="#555"
            >
              {genres.map((genreItem) => (
                <Picker.Item key={genreItem} label={genreItem} value={genreItem} />
              ))}
            </Picker>
          </View>

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
              <Text style={styles.pickImageButtonText}>Seleziona copertina</Text>
            </TouchableOpacity>
            {coverImageUri ? (
              <Image source={{ uri: coverImageUri }} style={styles.coverImage} />
            ) : null}
          </View>

          <Text style={styles.label}>Stato</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={styles.picker}
              dropdownIconColor="#555"
            >
              <Picker.Item label="Da leggere" value="da leggere" />
              <Picker.Item label="In lettura" value="in lettura" />
              <Picker.Item label="Letto" value="letto" />
            </Picker>
          </View>

          {(status === "in lettura" || status === "letto") && (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  Data inizio: {dateStart ? dateStart.toLocaleDateString() : "Nessuna data"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={dateStart || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeStartDate}
                  maximumDate={new Date()}
                />
              )}
            </>
          )}

          {status === "letto" && (
            <>
              <Text style={styles.label}>Valutazione</Text>
              <StarRating rating={rating} onChange={setRating} />

              <TextInput
                placeholder="Note"
                value={notes}
                onChangeText={setNotes}
                style={[styles.input, styles.textArea]}
                multiline
                placeholderTextColor="#888"
              />

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  Data fine: {dateEnd ? dateEnd.toLocaleDateString() : "Nessuna data"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={dateEnd || new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeEndDate}
                  maximumDate={new Date()}
                  minimumDate={dateStart || undefined}
                />
              )}
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
    height: 130,
    paddingTop: 40,
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
    height: 80,
    width: 140,
  },
  scrollContent: {
    paddingTop: 140,
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
  pickerWrapper: {
  backgroundColor: "#222",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#444",
  marginBottom: 20,
  overflow: "hidden",
  height: 60,              // aumento altezza per dare più spazio al picker
  justifyContent: "center" // centra verticalmente il contenuto
},
picker: {
  height: 60,              // stessa altezza del contenitore
  color: "#eee",
},

  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  pickImageButton: {
    backgroundColor: "#FFF600",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom: 16,
  },
  pickImageButtonText: {
    color: "#00000",
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
  starContainer: {
    flexDirection: "row",
    marginVertical: 12,
    justifyContent: "flex-start",
  },
  starTouchable: {
    paddingHorizontal: 6,
  },
  star: {
    fontSize: 32,
    color: "#555",
  },
  filledStar: {
    color: "#f1c40f",
  },
  emptyStar: {
    color: "#555",
  },
  datePickerButton: {
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: "#eee",
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
    color: "#00000",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AddBook;
