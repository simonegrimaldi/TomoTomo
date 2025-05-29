import React, { useState, useContext, useMemo, useCallback } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Image } from "react-native";
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

import logo from "../assets/icon.png";  // import logo

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
    <View style={styles.container}>
      {/* Barra fissa logo */}
      <SafeAreaView style={styles.logoBarSafeArea}>
        <View style={styles.logoBar}>
          <Image source={logo} style={styles.logoImage} resizeMode="contain" />
        </View>
      </SafeAreaView>

      {/* Barra fissa ricerca */}
      <SafeAreaView style={styles.searchBarSafeArea}>
        <TopBar
          toggleFilters={toggleFilters}
          searchText={searchText}
          onSearchChange={setSearchText}
          style={styles.topBar}
        />
        {/* Filtro sotto ricerca */}
        { !searchText && filtersOpen && (
          <FiltersMenu
            filters={filters}
            toggleFilter={toggleFilter}
            resetFilters={resetFilters}
          />
        )}
      </SafeAreaView>

      {/* Contenuto scrollabile */}
      <View style={styles.contentContainer}>
        {searchText ? (
          <SearchResultsSection filteredBooks={filteredBooksBySearch} navigation={navigation} />
        ) : isFilteringActive ? (
          <FilteredBooksSection filteredBooks={filteredBooksByFilters} navigation={navigation} />
        ) : (
          <ScrollView
            style={styles.centralSection}
            contentContainerStyle={styles.centralContentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <LastAddedSection books={lastThreeBooks} navigation={navigation} />
            <PlaylistSection books={books} navigation={navigation} />
            <FavoriteSection books={books} navigation={navigation} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",       // sfondo nero
  },

  logoBarSafeArea: {
    backgroundColor: "#000",
  },

  logoBar: {
    height: 130,
    paddingTop: 40,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },

  logoImage: {
    height: 80,
    width: 140,
  },

  searchBarSafeArea: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },

  topBar: {
    backgroundColor: "#000",
  },

  contentContainer: {
    flex: 1,
  },

  centralSection: {
    flex: 1,
    paddingHorizontal: 16,
  },

  centralContentContainer: {
    paddingBottom: 40,
  },
});

export default HomeScreen;
