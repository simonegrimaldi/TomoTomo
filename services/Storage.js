import * as FileSystem from 'expo-file-system';

const FILE_NAME = 'books.json';
const FILE_PATH = FileSystem.documentDirectory + FILE_NAME;

/**
 * Carica i libri salvati dal file JSON.
 * Se non esiste file, ritorna array vuoto.
 * @returns {Promise<Array>} array libri
 */
export async function loadBooks() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
    if (!fileInfo.exists) {
      // File non esiste, ritorna lista vuota
      return [];
    }
    const json = await FileSystem.readAsStringAsync(FILE_PATH);
    const books = JSON.parse(json);
    return books;
  } catch (error) {
    console.error('Errore caricamento libri:', error);
    return [];
  }
}

/**
 * Salva l’intero array di libri nel file JSON.
 * @param {Array} books 
 * @returns {Promise<void>}
 */
export async function saveBooks(books) {
  try {
    const json = JSON.stringify(books, null, 2); // indentato per leggibilità
    await FileSystem.writeAsStringAsync(FILE_PATH, json);
  } catch (error) {
    console.error('Errore salvataggio libri:', error);
  }
}