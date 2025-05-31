import * as FileSystem from 'expo-file-system';

const FILE_NAME = 'books.json';
const FILE_PATH = FileSystem.documentDirectory + FILE_NAME;

export async function loadBooks() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
    if (!fileInfo.exists) {
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

export async function saveBooks(books) {
  try {
    const json = JSON.stringify(books, null, 2); 
    await FileSystem.writeAsStringAsync(FILE_PATH, json);
  } catch (error) {
    console.error('Errore salvataggio libri:', error);
  }
}

/* 
  Queste due funzioni permettono di salvare e caricare la lista dei libri in un file JSON locale persistente.
	In questo modo siamo in grado di matenere i dati tra sessioni, senza bisogno di un database esterno.
*/