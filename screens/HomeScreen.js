import React, { useState, useContext, useMemo, useCallback } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { loadBooks } from "../services/Storage";
import { BooksContext } from "../context/BooksContext";

import TopBar from "../components/TopBar";
import FiltersMenu from "../components/FiltersMenu";
import LastAddedSection from "../components/LastAddedSection";
import PlaylistSection from "../components/PlaylistSection";
import FavoriteSection from "../components/FavoriteSection"; 
import SearchResultsSection from "../components/SearchResultsSection";
import FilteredBooksSection from "../components/FilteredBooksSection";

const HomeScreen = ({ navigation }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState({
    status: { "da leggere": false, "in lettura": false, letto: false },
    rating: 0,
  });

  const toggleFilters = () => setFiltersOpen((open) => !open);

  const toggleFilter = (category, key) => {
    if (category === "rating") {
      setFilters((prev) => ({ ...prev, rating: key }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          ...(category === "status"
            ? Object.fromEntries(Object.keys(prev[category]).map((k) => [k, false]))
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

  const { books, setBooks } = useContext(BooksContext);

  useFocusEffect(
    useCallback(() => {
      const updateBooks = async () => {
        const freshBooks = await loadBooks();
        setBooks(freshBooks);
      };
      updateBooks();
    }, [])
  );

  const lastThreeBooks = books.slice(0, 3);

  const filteredBooksBySearch = useMemo(() => {
    if (!searchText) return [];
    const lower = searchText.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(lower) ||
        book.author.toLowerCase().includes(lower)
    );
  }, [books, searchText]);

  const filteredBooksByFilters = useMemo(() => {
    const { status, rating } = filters;
    const anyStatusActive = Object.values(status).some((v) => v);
    const ratingActive = rating > 0;
    if (!anyStatusActive && !ratingActive) return [];

    return books.filter((book) => {
      if (anyStatusActive && !status[book.status]) return false;
      if (ratingActive && (!book.rating || book.rating < rating)) return false;
      return true;
    });
  }, [books, filters]);

  const isFilteringActive =
    Object.values(filters.status).some((v) => v) || filters.rating > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar
          toggleFilters={toggleFilters}
          searchText={searchText}
          onSearchChange={setSearchText}
        />

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
              <FavoriteSection books={books} navigation={navigation} />
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
