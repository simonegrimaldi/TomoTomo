import React, { useContext, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { BooksContext } from "../context/BooksContext";
import ProfileStats from "../components/ProfileStats";
import GenrePieChart from "../components/GenrePieChart";
import BookCarousel from "../components/BookCarousel";
import FilterBar from "../components/FilterBar";

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
      count,
      color: `hsl(${idx * 50 % 360}, 70%, 60%)`,
      legendFontColor: "#333",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <ProfileStats
          total={totalBooks}
          avgTime={avgReadTime}
          avgRating={avgRating}
          readingCount={booksReading.length}
        />

        <GenrePieChart data={genreData} />

        <FilterBar
          selected={filterMonths}
          onSelect={setFilterMonths}
          options={[3, 6, 12]}
        />

        <BookCarousel
          title="Libri letti"
          books={filteredReadBooks}
          onBookPress={(book) => navigation.navigate("DetailBook", { book })}
        />

        <BookCarousel
          title="Da leggere"
          books={booksToRead}
          onBookPress={(book) => navigation.navigate("DetailBook", { book })}
        />

        <BookCarousel
          title="In lettura"
          books={booksReading}
          onBookPress={(book) => navigation.navigate("DetailBook", { book })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});