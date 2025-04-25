// React
import React, { useState, useEffect } from "react";

// Third-party libraries
import { Box, Typography, MenuItem, Select, FormControl } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material/styles";

// Theme and Utils
import { tokens } from "../../theme";
import { calculateSMA } from "../../utils/smaUtils";

// Graph
import { graphqlEndpoint } from "../../config";
import { GraphQLClient } from "graphql-request";

// Componenets
import SymbolDropdown from "../../components/SymbolDropdown";
import Header from "../../components/Header";

const client = new GraphQLClient(graphqlEndpoint);

const SMAChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [symbolOptions, setSymbolOptions] = useState([]);
  const [strategyOptions, setStrategyOptions] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState("Baz");
  const [priceData, setPriceData] = useState([]);
  const [smaData, setSmaData] = useState({ short: [], long: [] });

  const themeSettings = {
    axis: {
      domain: {
        line: {
          stroke: colors.grey[100],
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
        },
      },
      ticks: {
        line: {
          stroke: colors.grey[100],
          strokeWidth: 1,
        },
        text: {
          fill: colors.grey[100],
        },
      },
    },
    legends: {
      text: {
        fill: colors.grey[100],
      },
    },
    tooltip: {
      container: {
        background: colors.primary[400],
        color: colors.primary[100],
      },
    },
  };

  useEffect(() => {
    async function fetchDropdowns() {
      const res = await client.request(`{
        getAllStrategies {
          BotInstanceName
        }
      }`);
      setStrategyOptions(res.getAllStrategies.map(s => s.BotInstanceName));

      const local = await fetch("/your/testSymbols.json").then(res => res.json());
      setSymbolOptions(local.symbols || []);
    }

    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!selectedSymbol || !selectedStrategy) return;

    async function fetchChartData() {
      const smaMeta = await client.request(`{
        getAllStrategies {
          BotInstanceName
          LongSMADuration
          ShortSMADuration
        }
      }`);

      const strategy = smaMeta.getAllStrategies.find(s => s.BotInstanceName === selectedStrategy);
      if (!strategy) return;

      const limit = strategy.LongSMADuration + 140;

      const res = await client.request(
        `
        query getPriceData($symbol: String!, $limit: Int!) {
          getHistoricPrice(symbol: $symbol, limit: $limit) {
            Pair {
              Symbol
              Price
            }
            Timestamp
          }
        }
      `,
        { symbol: selectedSymbol, limit }
      );

      const prices = res.getHistoricPrice;
      const short = calculateSMA(prices, strategy.ShortSMADuration);
      const long = calculateSMA(prices, strategy.LongSMADuration);

      setPriceData(prices);
      setSmaData({ short, long });
    }

    fetchChartData();
  }, [selectedSymbol, selectedStrategy]);

  const formatChartData = () => {
    const format = arr => arr.map(d => ({ x: new Date(d.Timestamp * 1000).toLocaleTimeString(), y: d.SMA }));

    const base = priceData.map((d, i) => ({
      x: new Date(d.Timestamp * 1000).toLocaleTimeString(),
      y: Number.parseFloat(d.Pair[0].Price),
    }));

    return [
      { id: "Price", color: "#81D4FA", data: base },
      { id: "Short SMA", color: "#FFCC80", data: format(smaData.short) },
      { id: "Long SMA", color: "#FF4081", data: format(smaData.long) },
    ];
  };

  return (
    <Box m="20px">
      <Header
        title="SMA PRICE CHART"
        subtitle="Here you will see the price data we hold for a given pair"
      />


      <Box display="flex" gap={2} mb={4}>
        {/* Dropdown */}
        <SymbolDropdown
          selectedSymbol={selectedSymbol}
          setSelectedSymbol={setSelectedSymbol}
          colors={colors}
        />

        {/* Dropdown */}
         <Box
              backgroundColor={colors.primary[400]}
              borderRadius="8px"
              boxShadow={1}
              p={2}
               minHeight="100px"
            >
        <FormControl sx={{ width: "250px" }}>
          <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, color: colors.grey[100] }}
                  >
                    Strategy
                  </Typography>
          <Select value={selectedStrategy} onChange={e => setSelectedStrategy(e.target.value)}>
            {strategyOptions.map(strat => (
              <MenuItem key={strat} value={strat}>{strat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        </Box>
      </Box>

      {priceData.length > 0 ? (
        <Box height="500px">
          <ResponsiveLine
            data={formatChartData()}
            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            axisBottom={{
              orient: "bottom",
              tickRotation: -45,
              legend: "Time",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              legend: "Price",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={5}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh
            enableGridX={false}
            enableGridY={false}
            legends={[
              {
                anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemWidth: 80,
              itemHeight: 20,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            theme={themeSettings}
          />
        </Box>
      ) : (
        <Typography variant="body1">Please select a symbol and strategy to view the chart.</Typography>
      )}
    </Box>
  );
};

export default SMAChart;
