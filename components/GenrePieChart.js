import React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
  labelColor: () => "#333",
};

export default function GenrePieChart({ data }) {
  const { width: screenWidth } = useWindowDimensions();

  if (!data || data.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginVertical: 20, color: "grey" }}>
        Grafico non disponibile
      </Text>
    );
  }

  const marginHorizontal = 10;
  const maxChartWidth = 400;

  const chartWidth = Math.min(
    Math.max(screenWidth - marginHorizontal * 2, 400),
    maxChartWidth
  );

  return (
    <View style={[styles.container, { paddingHorizontal: marginHorizontal }]}>
      <PieChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft={10}
        absolute
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10, 
    backgroundColor: "#222",
  },
});
