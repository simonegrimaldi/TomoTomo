import React, { useState, useContext, useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BooksContext } from "../context/BooksContext";

import TopBar from "../components/TopBar";
import FiltersMenu from "../components/FiltersMenu";
import LastAddedSection from "../components/LastAddedSection";
import PlaylistSection from "../components/PlaylistSection";
import RandomPicksSection from "../components/RandomPicksSection";
import SearchResultsSection from "../components/SearchResultsSection";
import FilteredBooksSection from "../components/FilteredBooksSection";

const HomeScreen = ({ navigation }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: { "da leggere": false, "in lettura": false, letto: false },
    rating: 0,
  });

  const toggleFilters = () => setFiltersOpen((open) => !open);

  // Funzione che aggiorna i filtri nel modo corretto
  const toggleFilter = (category, key) => {
    if (category === "rating") {
      setFilters((prev) => ({ ...prev, rating: key }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          // Per 'status' vogliamo solo UN filtro attivo per volta
          ...(category === "status"
            ? Object.fromEntries(
                Object.keys(prev[category]).map((k) => [k, false])
              )
            : {}),
          [key]: !prev[category][key],
        },
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      status: { "da leggere": false, "in lettura": false, letto: false },
      rating: 0,
    });
  };

  const { books } = useContext(BooksContext);

  // Ultimi 3 libri
  const lastThreeBooks = books.slice(0, 3);

  // Random pick libri
  const getRandomBooks = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };
  const randomBooks = useMemo(() => getRandomBooks(books, 10), [books]);

  // Stato ricerca
  const [searchText, setSearchText] = useState("");
  const filteredBooksBySearch = useMemo(() => {
    if (!searchText) return [];
    const lower = searchText.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(lower) ||
        book.author.toLowerCase().includes(lower)
    );
  }, [books, searchText]);

  // Filtraggio per status e rating
  const filteredBooksByFilters = useMemo(() => {
    const { status, rating } = filters;

    // Se non c'è filtro attivo (tutti false e rating 0), ritorna []
    const anyStatusActive = Object.values(status).some((v) => v);
    const ratingActive = rating > 0;
    if (!anyStatusActive && !ratingActive) return [];

    return books.filter((book) => {
      // Controllo stato (se filtro attivo)
      if (anyStatusActive) {
        // Se il libro NON è in uno stato attivo, escludi
        if (!status[book.status]) return false;
      }
      // Controllo rating
      if (ratingActive) {
        if (!book.rating || book.rating < rating) return false;
      }
      return true;
    });
  }, [books, filters]);

  // Decide cosa mostrare: priorità search > filtro > home
  const isFilteringActive =
    Object.values(filters.status).some((v) => v) || filters.rating > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TopBar sempre visibile con ricerca */}
        <TopBar
          toggleFilters={toggleFilters}
          searchText={searchText}
          onSearchChange={setSearchText}
        />

        {/* Filtro visibile solo se aperto e non stai cercando */}
        {!searchText && filtersOpen && (
          <FiltersMenu
            filters={filters}
            toggleFilter={toggleFilter}
            resetFilters={resetFilters}
          />
        )}
        <View style={styles.contentContainer}>
          {searchText ? (
            <SearchResultsSection
              filteredBooks={filteredBooksBySearch}
              navigation={navigation}
            />
          ) : isFilteringActive ? (
            <FilteredBooksSection
              filteredBooks={filteredBooksByFilters}
              navigation={navigation}
            />
          ) : (
            <ScrollView
              style={styles.centralSection}
              contentContainerStyle={styles.centralContentContainer}
              keyboardShouldPersistTaps="handled"
            >
              <LastAddedSection
                books={lastThreeBooks}
                navigation={navigation}
              />
              <PlaylistSection books={books} navigation={navigation} />
              <RandomPicksSection books={randomBooks} navigation={navigation} />
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  container: { flex: 1 },
  contentContainer: { flex: 1 },
  centralSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  centralContentContainer: {
    paddingBottom: 40,
  },
});

export default HomeScreen;
