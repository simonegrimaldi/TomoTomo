import React, { useContext, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView, Text, Image } from "react-native";
import { BooksContext } from "../context/BooksContext";
import ProfileStats from "../components/ProfileStats";
import GenrePieChart from "../components/GenrePieChart";
import BookCarousel from "../components/BookCarousel";
import FilterBar from "../components/FilterBar";
import logo from "../assets/icon.png";

export default function ProfileScreen({ navigation }) {
  const { books } = useContext(BooksContext);
  const [filterMonths, setFilterMonths] = useState(12);

  const booksRead = books.filter((b) => b.status?.toLowerCase() === "letto");
  const booksToRead = books.filter((b) => b.status?.toLowerCase() === "da leggere");
  const booksReading = books.filter((b) => b.status?.toLowerCase() === "in lettura");
  const booksFavorite = books.filter((b) => b.favorite === true);

  const totalBooks = books.length;
  const avgRating = booksRead.length > 0
    ? booksRead.reduce((sum, b) => sum + (b.rating || 0), 0) / booksRead.length
    : 0;

  const avgReadTime = (() => {
    if (booksRead.length === 0) return 0;
    let totalDays = 0;
    booksRead.forEach((b) => {
      if (b.date_start && b.date_end) {
        const start = new Date(b.date_start);
        const end = new Date(b.date_end);
        const diff = (end - start) / (1000 * 3600 * 24);
        if (!isNaN(diff)) totalDays += diff;
      }
    });
    return Math.round(totalDays / booksRead.length);
  })();

  const genreData = (() => {
    const genreMap = {};
    booksRead.forEach((b, idx) => {
      const genre = b.genre || "Altro";
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    });
    return Object.entries(genreMap).map(([name, count], idx) => ({
      name,
      population: count,
      color: `hsl(${(idx * 50) % 360}, 70%, 50%)`,
      legendFontColor: "#FFD700",
      legendFontSize: 14,
    }));
  })();

  const now = new Date();
  const filteredReadBooks = useMemo(() => {
    return booksRead.filter((b) => {
      if (!b.date_end) return false;
      const end = new Date(b.date_end);
      const diffMonths = (now - end) / (1000 * 3600 * 24 * 30);
      return diffMonths <= filterMonths;
    });
  }, [booksRead, filterMonths]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoBar}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <ProfileStats
            total={totalBooks}
            avgTime={avgReadTime}
            avgRating={avgRating}
            readingCount={booksReading.length}
          />
        </View>

        <GenrePieChart data={genreData} />

        {booksFavorite.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>I tuoi preferiti</Text>
            <BookCarousel
              title=""
              books={booksFavorite}
              onBookPress={(book) =>
                navigation.navigate("DetailBook", { bookId: book.id })
              }
            />
          </>
        )}

        <Text style={styles.sectionTitle}>La tua libreria</Text>

        <FilterBar
          selected={filterMonths}
          onSelect={setFilterMonths}
          options={[3, 6, 12]}
        />

        <BookCarousel
          title="Libri letti"
          books={filteredReadBooks}
          onBookPress={(book) =>
            navigation.navigate("DetailBook", { bookId: book.id })
          }
        />

        <BookCarousel
          title="Da leggere"
          books={booksToRead}
          onBookPress={(book) =>
            navigation.navigate("DetailBook", { bookId: book.id })
          }
        />

        <BookCarousel
          title="In lettura"
          books={booksReading}
          onBookPress={(book) =>
            navigation.navigate("DetailBook", { bookId: book.id })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0a0a",
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
    borderBottomColor: "#FFF600",
    borderBottomWidth: 1,
    zIndex: 100,
  },
  logoImage: {
    width: 140,
    height: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF600",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    backgroundColor: "#0a0a0a",
  },
  statsContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFF600",
  },
});