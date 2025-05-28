import { useState, useMemo } from "react";

export function useBookFilters(books) {
  const [filters, setFilters] = useState({
    language: { ITA: false, ING: false },
    status: { "da leggere": false, "in lettura": false, letto: false },
    rating: 0,
  });

  const toggleFilter = (category, key) => {
    if (category === "rating") {
      setFilters((prev) => ({ ...prev, rating: key }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key],
        },
      }));
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Filtra per lingua (se almeno una selezionata)
      const langsSelected = Object.values(filters.language).some(Boolean);
      if (langsSelected) {
        if (!filters.language[book.language]) return false;
      }

      // Filtra per stato (se almeno uno selezionato)
      const statusSelected = Object.values(filters.status).some(Boolean);
      if (statusSelected) {
        if (!filters.status[book.status]) return false;
      }

      // Filtra per rating
      if (filters.rating > 0) {
        if (!book.rating || book.rating < filters.rating) return false;
      }

      return true;
    });
  }, [books, filters]);

  return { filters, toggleFilter, filteredBooks };
}