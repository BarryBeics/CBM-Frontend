import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { GraphQLClient, gql } from "graphql-request";
import SymbolDropdown from "../../components/SymbolDropdown";
import { graphqlEndpoint } from "../../config";
import Header from "../../components/Header";
import { Box, Typography, Slider } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";

const client = new GraphQLClient(graphqlEndpoint);

const PriceChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [timeFrameQty, setTimeFrameQty] = useState(0);
  const [priceData, setPriceData] = useState([]);
  const theme = useTheme(); // Use the useTheme hook
  const colors = tokens(theme.palette.mode);

  // Fetch dropdown options from JSON

  // Fetch price data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSymbol || timeFrameQty === 0) return;

      const query = gql`
        query getPriceData($symbol: String!, $limit: Int!) {
          getHistoricPrice(symbol: $symbol, limit: $limit) {
            Pair {
              Symbol
              Price
            }
            Timestamp
          }
        }
      `;

      try {
        const res = await client.request(query, {
          symbol: selectedSymbol,
          limit: timeFrameQty,
        });

        const rawData = res.getHistoricPrice || [];

        // Format for Nivo
        const formatted = [
          {
            id: selectedSymbol,
            data: rawData.map((entry) => ({
              x: new Date(entry.Timestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              y: entry.Pair[0]?.Price ?? 0,
            })),
          },
        ];

        setPriceData(formatted);
      } catch (error) {
        console.error("GraphQL error:", error);
      }
    };

    fetchData();
  }, [selectedSymbol, timeFrameQty]);

  return (
    <Box m="20px">
      <Header
        title="TRADING PAIRS"
        subtitle="Here you will see the price data we hold for a given pair"
      />

      <Box display="flex" gap={4} flexWrap="wrap" mb={4}>
        {/* Dropdown */}
        <SymbolDropdown
          selectedSymbol={selectedSymbol}
          setSelectedSymbol={setSelectedSymbol}
          colors={colors}
        />

        {/* Styled Slider Box */}
        <Box
          backgroundColor={colors.primary[400]}
          borderRadius="8px"
          boxShadow={1}
          p={2}
          minHeight="100px"
          width={300}
        >
          <Typography gutterBottom>
            How far back (mins): <strong>{timeFrameQty}</strong>
          </Typography>
          <Slider
            min={5}
            max={45000}
            step={5}
            value={timeFrameQty}
            onChange={(e, newVal) => setTimeFrameQty(newVal)}
            valueLabelDisplay="auto"
            sx={{
              color: colors.greenAccent[500],
              "& .MuiSlider-thumb": {
                borderRadius: "50%",
                backgroundColor: colors.greenAccent[500],
              },
              "& .MuiSlider-track": {
                backgroundColor: colors.greenAccent[500],
              },
              "& .MuiSlider-rail": {
                backgroundColor: colors.grey[700],
              },
            }}
          />
        </Box>
      </Box>

      {/* Chart */}
      <Box height="500px">
        {priceData.length > 0 ? (
          <ResponsiveLine
          data={priceData}
          theme={{
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
                color: colors.primary[500],
                background: colors.primary[400],
              },
            },
          }}
          colors={{ scheme: "nivo" }} // or your own color logic
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: false,
          }}
          axisBottom={{
            orient: "bottom",
            tickRotation: -45,
            legend: "Time",
            legendOffset: 36,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 5,
          }}
          axisLeft={{
            orient: "left",
            legend: "Price",
            legendOffset: -40,
            legendPosition: "middle",
            tickSize: 5,
            tickPadding: 5,
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
        />
      ) : (
          <Typography variant="body1">
            No data yet. Select a pair and time range.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PriceChart;
