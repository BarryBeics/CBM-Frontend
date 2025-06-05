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
import TimeRangeSelector from "../../components/TimeRangeSelector";

const client = new GraphQLClient(graphqlEndpoint);

const SMAChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [strategyOptions, setStrategyOptions] = useState([]);
  const [timeFrameQty, setTimeFrameQty] = useState(12);
  const [selectedStrategy, setSelectedStrategy] = useState("Gopher");
  const [chartData, setChartData] = useState([]);

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
        background: colors.grey[800],
        color: colors.houndGold[100],
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
      setStrategyOptions(res.getAllStrategies.map((s) => s.BotInstanceName));
    }
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!selectedStrategy || !selectedSymbols.length) return;

    const fetchDataForSymbol = async (symbol) => {
      const smaMeta = await client.request(`{
        getAllStrategies {
          BotInstanceName
          LongSMADuration
          ShortSMADuration
        }
      }`);

      const strategy = smaMeta.getAllStrategies.find(
        (s) => s.BotInstanceName === selectedStrategy
      );
      if (!strategy) return;

      const limit = strategy.LongSMADuration + timeFrameQty;

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
        { symbol, limit }
      );

      const prices = res.getHistoricPrice;
      const short = calculateSMA(prices, strategy.ShortSMADuration);
      const long = calculateSMA(prices, strategy.LongSMADuration);

      const format = (arr, label) =>
        [...arr]
          .sort((a, b) => a.Timestamp - b.Timestamp)
          .map((d) => ({
            x: new Date(d.Timestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            y: d.SMA,
          }));

      const base = prices.map((d) => ({
        x: new Date(d.Timestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        y: Number.parseFloat(d.Pair[0].Price),
      }));

      setChartData((prev) => {
        const filtered = prev.filter((s) => !s.id.startsWith(symbol));
        return [
          ...filtered,
          { id: `${symbol} Price`, data: base },
          { id: `${symbol} Short SMA`, data: format(short) },
          { id: `${symbol} Long SMA`, data: format(long) },
        ];
      });
    };

    selectedSymbols.forEach((symbol) => {
      fetchDataForSymbol(symbol);
    });

    setChartData((prev) =>
      prev.filter((entry) =>
        selectedSymbols.some((s) => entry.id.startsWith(s))
      )
    );
  }, [selectedSymbols, selectedStrategy, timeFrameQty]);

  return (
    <Box m="20px">
      <Header
        title="SMA PRICE CHART"
        subtitle="Here you will see the price data we hold for selected pairs"
      />

      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <SymbolDropdown
          selectedSymbols={selectedSymbols}
          setSelectedSymbols={setSelectedSymbols}
        />

        <Box
          backgroundColor={colors.grey[800]}
          borderRadius="5px"
          p={2}
          width={300}
        >
          <TimeRangeSelector
            value={timeFrameQty}
            onChange={setTimeFrameQty}
            colorMode={colors}
          />
        </Box>

        <Box
          backgroundColor={colors.grey[800]}
          borderRadius="5px"
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
            <Select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
            >
              {strategyOptions.map((strat) => (
                <MenuItem key={strat} value={strat}>
                  {strat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {chartData.length > 0 ? (
        <Box height="500px">
          <ResponsiveLine
            data={chartData}
            theme={themeSettings}
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
                translateX: 100,
                itemWidth: 80,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        </Box>
      ) : (
        <Typography variant="body1">
          Select symbols and a strategy to begin.
        </Typography>
      )}
    </Box>
  );
};

export default SMAChart;
