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

  const booksRead = books.filter((b) => b.status === "letto");
  const booksToRead = books.filter((b) => b.status === "da leggere");
  const booksReading = books.filter((b) => b.status === "in lettura");

  const totalBooks = books.length;
  const avgRating = useMemo(() => {
    if (booksRead.length === 0) return 0;
    const total = booksRead.reduce((sum, b) => sum + (b.rating || 0), 0);
    return total / booksRead.length;
  }, [booksRead]);

  const avgReadTime = useMemo(() => {
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
  }, [booksRead]);

  const genreData = useMemo(() => {
    const genreMap = {};
    booksRead.forEach((b) => {
      const genre = b.genre || "Altro";
      genreMap[genre] = (genreMap[genre] || 0) + 1;
    });
    return Object.entries(genreMap).map(([name, count], idx) => ({
      name,
      population: count,
      color: `hsl(${(idx * 50) % 360}, 70%, 60%)`,
      legendFontColor: "#FFD700",
      legendFontSize: 14,
    }));
  }, [booksRead]);

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
      {/* Barra fissa logo */}
      <View style={styles.logoBar}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      {/* Scrollabile sotto */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20, paddingTop: 160 }}
      >
        {/* Statistiche ben indentate e stilizzate */}
        <View style={styles.statsContainer}>
          <ProfileStats
            total={totalBooks}
            avgTime={avgReadTime}
            avgRating={avgRating}
            readingCount={booksReading.length}
          />
        </View>

        <GenrePieChart data={genreData} />

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
    backgroundColor: "#00000", // tema scuro
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
    borderBottomColor: "#222",
    borderBottomWidth: 1,
    zIndex: 100,
  },
  logoImage: {
    width: 140,
    height: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#00000", // un nero leggermente più chiaro per il contenuto
  },
  statsContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: "#00000", // sfondo scuro per la card statistiche
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  // Se vuoi puoi personalizzare ProfileStats per usare colori gialli / testo bianco
});
