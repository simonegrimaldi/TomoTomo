import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
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
import { useCallback } from "react";

const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

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
            style={{ paddingHorizontal: 6 }}
          >
            <Text
              style={[
                styles.star,
                filled ? styles.filledStar : styles.emptyStar,
              ]}
            >
              {filled ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AddBook = ({ navigation, route }) => {
  const { addBook, updateBook } = useContext(BooksContext);
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
  const [genre, setGenre] = useState(genres[0]);
  useFocusEffect(
    useCallback(() => {
      // Reset all fields on screen focus
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrected to MediaTypeOptions
      quality: 1,
    });

    if (pickerResult.canceled) {
      console.log("Image picker was canceled");
      return; // attention: now it's 'canceled' not 'cancelled'
    }

    const uri = pickerResult.assets[0].uri; // Get the uri from assets
    console.log("Selected image URI:", uri); // Debugging line

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
      console.error("Error saving image:", error); // Debugging line
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setDateStart(selectedDate);
      if (dateEnd && selectedDate > dateEnd) {
        setDateEnd(selectedDate);
      }
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      if (dateStart && selectedDate < dateStart) {
        Alert.alert(
          "Errore",
          "La data di fine non può essere precedente alla data di inizio"
        );
      } else {
        setDateEnd(selectedDate);
      }
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
      favorite: false, // ora fisso a false
      rating: status === "letto" ? rating : null,
      notes: status === "letto" ? notes : null,
      date_start:
        (status === "in lettura" || status === "letto") && dateStart
          ? dateStart.toISOString().substring(0, 10)
          : null,
      date_end:
        status === "letto" && dateEnd
          ? dateEnd.toISOString().substring(0, 10)
          : null,
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
        <View style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Author"
              value={author}
              onChangeText={setAuthor}
              style={styles.input}
            />
            <TextInput
              placeholder="Synopsis"
              value={synopsis}
              onChangeText={setSynopsis}
              style={[styles.input, styles.textArea]}
              multiline
            />
            <Text style={styles.label}>Genere</Text>
            <Picker
              selectedValue={genre}
              onValueChange={(itemValue) => setGenre(itemValue)}
              style={styles.picker}
            >
              {genres.map((genreItem) => (
                <Picker.Item
                  key={genreItem}
                  label={genreItem}
                  value={genreItem}
                />
              ))}
            </Picker>

            <View style={styles.imagePickerContainer}>
              <Button title="Pick Cover Image" onPress={pickImage} />
              {coverImageUri ? (
                <Image
                  source={{ uri: coverImageUri }}
                  style={styles.coverImage}
                />
              ) : null}
            </View>

            <Text style={styles.label}>Status</Text>
            <Picker
              selectedValue={status}
              onValueChange={(itemValue) => setStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Da leggere" value="da leggere" />
              <Picker.Item label="In lettura" value="in lettura" />
              <Picker.Item label="Letto" value="letto" />
            </Picker>

            {(status === "in lettura" ||
              status === "letto" ||
              status === "in lettura") && (
              <>
                <Button
                  title={`Select Start Date: ${
                    dateStart ? dateStart.toLocaleDateString() : "Nessuna data"
                  }`}
                  onPress={() => setShowStartDatePicker(true)}
                />

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
                <Text style={styles.label}>Rating</Text>
                <StarRating rating={rating} onChange={setRating} />

                <TextInput
                  placeholder="Notes"
                  value={notes}
                  onChangeText={setNotes}
                  style={[styles.input, styles.textArea]}
                  multiline
                />

                <Button
                  title={`Select End Date: ${
                    dateEnd ? dateEnd.toLocaleDateString() : "Nessuna data"
                  }`}
                  onPress={() => setShowEndDatePicker(true)}
                />

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

            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Save Book</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#f5f7fa",
  },
  input: {
    height: 44,
    borderColor: "#bbb",
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "black",
    fontSize: 16,
    color: "white",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  coverImage: {
    width: 140,
    height: 210,
    marginTop: 12,
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  picker: {
    backgroundColor: "black",
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  star: {
    fontSize: 32,
    color: "#ccc",
  },
  filledStar: {
    color: "#ffd700",
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddBook;
