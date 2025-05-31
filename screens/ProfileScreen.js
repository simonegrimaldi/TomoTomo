import React, { useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
} from "react-native";
import { BooksContext } from "../context/BooksContext";
import ProfileStats from "../components/ProfileStats";
import GenrePieChart from "../components/GenrePieChart";
import BookCarousel from "../components/BookCarousel";
import logo from "../assets/icon.png";

export default function ProfileScreen({ navigation }) {
  const { books } = useContext(BooksContext);

  const booksRead = books.filter((b) => b.status?.toLowerCase() === "letto");
  const booksToRead = books.filter(
    (b) => b.status?.toLowerCase() === "da leggere"
  );
  const booksReading = books.filter(
    (b) => b.status?.toLowerCase() === "in lettura"
  );
  const booksFavorite = books.filter((b) => b.favorite === true);

  const totalBooks = books.length;

  const avgRating =
    booksRead.length > 0
      ? booksRead.reduce((sum, b) => sum + (b.rating || 0), 0) /
        booksRead.length
      : 0;

  const avgReadTime = (() => {
    if (booksRead.length === 0) return 0;
    let totalDays = 0;
    let count = 0;
    booksRead.forEach((b) => {
      if (b.date_start && b.date_end) {
        const start = new Date(b.date_start);
        const end = new Date(b.date_end);
        const diff = (end - start) / (1000 * 3600 * 24);
        if (!isNaN(diff) && diff >= 0) {
          totalDays += diff;
          count++;
        }
      }
    });
    return count > 0 ? Math.round(totalDays / count) : 0;
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoBar}>
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
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
                navigation.navigate("Detail", { bookId: book.id })
              }
            />
          </>
        )}

        <Text style={styles.sectionTitle}>La tua libreria</Text>

        <BookCarousel
          title="Libri letti"
          books={booksRead}
          onBookPress={(book) =>
            navigation.navigate("Detail", { bookId: book.id })
          }
        />
        <BookCarousel
          title="Da leggere"
          books={booksToRead}
          onBookPress={(book) =>
            navigation.navigate("Detail", { bookId: book.id })
          }
        />

        <BookCarousel
          title="In lettura"
          books={booksReading}
          onBookPress={(book) =>
            navigation.navigate("Detail", { bookId: book.id })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    borderBottomColor: "#FFF600",
    borderBottomWidth: 1,
    zIndex: 100,
  },
  logoImage: {
    width: 140,
    height: 80,
  },
  container: {
    flex: 1,
    paddingTop: 140,
    backgroundColor: "#0a0a0a",
  },
  statsContainer: {
    marginTop: 10,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#111111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFF600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF600",
    margin: 20,
    textAlign: "left",
  },
});
