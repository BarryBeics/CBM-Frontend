import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material/styles";
import { gql, GraphQLClient } from "graphql-request";

import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";

import SymbolDropdown from "../../components/SymbolDropdown";
import Header from "../../components/Header";
import TimeRangeSelector from "../../components/TimeRangeSelector";

const client = new GraphQLClient(graphqlEndpoint);

const PriceChart = () => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [timeFrameQty, setTimeFrameQty] = useState(12);
  const [priceData, setPriceData] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchDataForSymbol = async (symbol) => {
      const query = gql`
        query readPriceData($symbol: String!, $limit: Int!) {
          readHistoricPrice(symbol: $symbol, limit: $limit) {
            Pair {
              Symbol
              Price
              PercentageChange
            }
            Timestamp
          }
        }
      `;

      try {
        const res = await client.request(query, {
          symbol,
          limit: timeFrameQty,
        });

        const rawData = res.readHistoricPrice || [];

        const cleanedData = rawData
          .slice()
          .reverse()
          .filter((entry) => {
            const pricePoint = entry?.Pair?.find((p) => p?.Symbol === symbol);
            return entry?.Timestamp && pricePoint?.PercentageChange;
          })
          .map((entry) => ({
            x: new Date(entry.Timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            y: parseFloat(
              entry.Pair.find((p) => p.Symbol === symbol)?.PercentageChange ??
                "0"
            ),
          }));

        if (!cleanedData.length) return;

        setPriceData((prev) => [
          ...prev.filter((s) => s.id !== symbol),
          { id: symbol, data: cleanedData },
        ]);
      } catch (error) {
        console.error(`Error fetching price data for ${symbol}:`, error);
      }
    };

    // Fetch each selected symbol's price data
    selectedSymbols.forEach((symbol) => fetchDataForSymbol(symbol));

    // Remove any old series that aren't in selectedSymbols anymore
    setPriceData((prev) =>
      prev.filter((entry) => selectedSymbols.includes(entry.id))
    );
  }, [selectedSymbols, timeFrameQty]);

  const removeSymbol = (symbolToRemove) => {
    setSelectedSymbols((prev) => prev.filter((s) => s !== symbolToRemove));
  };

  return (
    <Box m="20px">
      <Header
        title="PRICE CHART"
        subtitle="Compare recent price trends across pairs"
      />

      <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6">Select Trading Pairs</Typography>

          <SymbolDropdown
            selectedSymbols={selectedSymbols}
            setSelectedSymbols={setSelectedSymbols}
          />
        </Box>

        <Box
          backgroundColor={colors.grey[800]}
          borderRadius="5px"
          boxShadow={1}
          p={2}
          minHeight="100px"
          width={300}
        >
          <TimeRangeSelector
            value={timeFrameQty}
            onChange={setTimeFrameQty}
            colorMode={colors}
          />
        </Box>
      </Box>

      <Box height="500px">
        {priceData.length > 0 ? (
          <ResponsiveLine
            data={priceData}
            theme={{
              axis: {
                domain: { line: { stroke: colors.grey[100] } },
                legend: { text: { fill: colors.grey[100] } },
                ticks: {
                  line: { stroke: colors.grey[100], strokeWidth: 1 },
                  text: { fill: colors.grey[100] },
                },
              },
              legends: { text: { fill: colors.grey[100] } },
              tooltip: {
                container: {
                  background: colors.grey[800],
                  color: colors.houndGold[500],
                },
              },
            }}
            colors={{ scheme: "category10" }}
            margin={{ top: 50, right: 50, bottom: 100, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
            }}
            axisBottom={{
              tickRotation: -45,
              legend: "Time",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              legend: "% Change",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh
            enableGridX={false}
            enableGridY={false}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateY: 60, // pushes legend below chart
                itemWidth: 80,
                itemHeight: 20,
                itemsSpacing: 10,
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#fff",
                      itemBackground: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <Typography variant="body1">
            No data yet. Select trading pairs and time range.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PriceChart;
