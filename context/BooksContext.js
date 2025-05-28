import React, { createContext, useState, useEffect } from 'react';
import { loadBooks, saveBooks } from '../services/Storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica libri all’avvio
  useEffect(() => {
    (async () => {
      const loadedBooks = await loadBooks();
      setBooks(loadedBooks);
      setLoading(false);
    })();
  }, []);

  // Salva libri su modifica
  const persistBooks = async (newBooks) => {
    setBooks(newBooks);
    await saveBooks(newBooks);
  };

  // Aggiungi nuovo libro
  const addBook = async (bookData) => {
    const newBook = { id: uuidv4(), ...bookData };
    const newBooks = [newBook, ...books];
    await persistBooks(newBooks);
  };

  // Modifica libro esistente (per id)
  const updateBook = async (id, updatedData) => {
    const newBooks = books.map(b => (b.id === id ? { ...b, ...updatedData } : b));
    await persistBooks(newBooks);
  };

  // Rimuovi libro (opzionale)
  const removeBook = async (id) => {
    const newBooks = books.filter(b => b.id !== id);
    await persistBooks(newBooks);
  };

  return (
    <BooksContext.Provider value={{
      books,
      loading,
      addBook,
      updateBook,
      removeBook,
    }}>
      {children}
    </BooksContext.Provider>
  );
};