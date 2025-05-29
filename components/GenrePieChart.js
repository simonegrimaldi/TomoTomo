import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { BooksContext } from '../context/BooksContext';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
  labelColor: () => '#333',
};

export default function GenrePieChart() {
  const { books } = useContext(BooksContext);

  const data = useMemo(() => {
    const readBooks = books.filter(b => b.status === 'letto' && b.genre);
    const genreCounts = {};

    readBooks.forEach(book => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });

    const chartData = Object.keys(genreCounts).map((genre, index) => ({
      name: genre,
      population: genreCounts[genre],
      color: getColor(index),
      legendFontColor: '#555',
      legendFontSize: 14,
    }));

    return chartData;
  }, [books]);

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </View>
  );
}

function getColor(index) {
  const colors = ['#4a90e2', '#50e3c2', '#f5a623', '#b8e986', '#bd10e0', '#f8e71c'];
  return colors[index % colors.length];
}