import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { loadBooks } from "../services/Storage";
import { BooksContext } from "../context/BooksContext";

import TopBar from "../components/TopBar";
import FiltersMenu from "../components/FiltersMenu";
import LastAddedSection from "../components/LastAddedSection";
import PlaylistSection from "../components/PlaylistSection";
import SearchResultsSection from "../components/SearchResultsSection";
import FilteredBooksSection from "../components/FilteredBooksSection";
import RandomBooksSection from "../components/RandomBooksSection"; // importa qui

import logo from "../assets/icon.png";

const HomeScreen = ({ navigation }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    status: { "da leggere": false, "in lettura": false, letto: false },
    rating: 0,
  });

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
      if (anyStatusActive && !status[book.status?.toLowerCase()]) return false;
      if (ratingActive && (!book.rating || book.rating !== rating))
        return false;
      return true;
    });
  }, [books, filters]);

  const isFilteringActive =
    Object.values(filters.status).some((v) => v) || filters.rating > 0;

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
            ? Object.fromEntries(
                Object.keys(prev[category]).map((k) => [k, false])
              )
            : {}),
          [key]: !prev[category][key],
        },
      }));
    }
  };
  const resetFilters = () =>
    setFilters({
      status: { "da leggere": false, "in lettura": false, letto: false },
      rating: 0,
    });

  useEffect(() => {
    if (searchText === "") {
      resetFilters();
    }
  }, [searchText]);

  return (
    <View style={styles.safeArea}>
      {/* LOGO */}
      <View style={styles.logoBar}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      {/* BARRA DI RICERCA */}
      <View style={styles.topBarWrapper}>
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
      </View>

      {/* CONTENUTO */}
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
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollInner}
            keyboardShouldPersistTaps="handled"
          >
            <LastAddedSection books={lastThreeBooks} navigation={navigation} />
            <PlaylistSection books={books} navigation={navigation} />
            <RandomBooksSection books={books} navigation={navigation} />
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    zIndex: 100,
  },
  logoImage: {
    height: 80,
    width: 140,
  },
  topBarWrapper: {
    position: "relative",
    marginTop: 140,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    borderBottomColor: "#FFF600",
    borderBottomWidth: 1,
    zIndex: 100,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    flex: 1,
  },
});

export default HomeScreen;
