// React
import { useEffect, useState, useMemo } from "react";

// Third-party libraries
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { mean } from "lodash";

// Graph
import { getActivityReports } from "../../graph/reports/getActivityReports";

// Theme
import { tokens } from "../../theme";

// Utils
import { timeNow } from "../../utils/timeNow";

// Componenets
import Header from "../../components/Header";
import TimeRangeSelector from "../../components/TimeRangeSelector";
import ThemedDataGrid from "../../components/ThemedDataGrid";
import ViewModeToggle from "../../components/ViewModeToggle";

export default function TopGainersScatterWithTrend() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activityData, setActivityData] = useState([]);
  const [timeFrameQty, setTimeFrameQty] = useState(12);
  const [viewMode, setViewMode] = useState("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reports = await getActivityReports();
        setActivityData(reports);
      } catch (err) {
        console.error("Failed to load activity reports", err);
      }
    };
    fetchData();
  }, []);

  const { scatterData, trendLines, numPoints, formattedTableRows } =
    useMemo(() => {
      if (!activityData?.length)
        return { scatterData: [], trendLines: [], formattedTableRows: [] };

      const now = timeNow() * 1000;
      const cutoff = now - timeFrameQty * 5 * 60 * 1000;

      const filtered = activityData
        .filter((entry) => new Date(entry.Timestamp * 1000).getTime() >= cutoff)
        .sort((a, b) => a.Timestamp - b.Timestamp);

      const jitter = (x) => x + (Math.random() - 0.5) * 2;

      const seriesKeys = [
        { key: "TopAGain", label: "Top 3", color: "#E4C2A8" },
        { key: "TopBGain", label: "Top 5", color: "#E87C6F" },
        { key: "TopCGain", label: "Top 10", color: "#E1A648" },
      ];

      const scatter = seriesKeys.map(({ key, label, color }) => ({
        id: label,
        color,
        data: filtered
          .filter(
            (entry) =>
              typeof entry[key] === "number" && typeof entry.Qty === "number"
          )
          .map((entry) => ({
            x: jitter(entry.Qty),
            y: entry[key],
          })),
      }));

      const trends = seriesKeys.map(({ key, label, color }) => {
        const validValues = filtered
          .map((e) => e[key])
          .filter((v) => typeof v === "number");
        const qtys = filtered
          .map((e) => e.Qty)
          .filter((q) => typeof q === "number");

        const yAvg = mean(validValues);
        return {
          id: `${label} Avg`,
          color,
          data: [
            { x: Math.min(...qtys), y: yAvg },
            { x: Math.max(...qtys), y: yAvg },
          ],
          trend: true,
        };
      });

      const formattedTableRows = filtered.map((entry, index) => ({
        id: entry.Timestamp ?? index,
        Timestamp: new Date(entry.Timestamp * 1000).toLocaleString(),
        Qty: entry.Qty,
        TopAGain: entry.TopAGain,
        TopBGain: entry.TopBGain,
        TopCGain: entry.TopCGain,
      }));

      return {
        scatterData: scatter,
        trendLines: trends,
        numPoints: filtered.length,
        formattedTableRows,
      };
    }, [activityData, timeFrameQty]);

  const columns = [
    { field: "Timestamp", headerName: "Time", flex: 2 },
    {
      field: "Qty",
      headerName: "Quantity",
      flex: 1,
      type: "number",
    },
    {
      field: "TopAGain",
      headerName: "Top 3 Gain",
      flex: 1,
      type: "number",
    },
    {
      field: "TopBGain",
      headerName: "Top 5 Gain",
      flex: 1,
      type: "number",
    },
    {
      field: "TopCGain",
      headerName: "Top 10 Gain",
      flex: 1,
      type: "number",
    },
  ];

  const themeSettings = {
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
        background: colors.grey[400],
        color: colors.grey[100],
      },
    },
  };

  return (
    <Box m="20px">
      <Header
        title="TOP GAINERS"
        subtitle="Toggle between a scatter chart and a table of recent activity"
      />

      <Box mb={2} display="flex" justifyContent="space-between">
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
        <Box display="flex" alignItems="center">
          <ViewModeToggle
            value={viewMode}
            onChange={setViewMode}
            modes={[
              { id: "chart", label: "Chart View" },
              { id: "table", label: "Table View" },
            ]}
          />
        </Box>
      </Box>

      {viewMode === "chart" ? (
        <Box height="500px">
          <Typography variant="body2" color={colors.grey[300]}>
            Showing {numPoints} data points
          </Typography>
          <ResponsiveScatterPlot
            data={scatterData}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            enableGridY={false}
            enableGridX={false}
            blendMode="normal"
            axisBottom={{
              legend: "Quantity of Gainers",
              legendPosition: "middle",
              legendOffset: 46,
            }}
            axisLeft={{
              legend: "Average % Gain",
              legendPosition: "middle",
              legendOffset: -60,
            }}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                translateX: 130,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                symbolSize: 12,
              },
            ]}
            layers={[
              "grid",
              "axes",
              "nodes",
              ({ xScale, yScale }) => (
                <>
                  {trendLines.map((line) => {
                    const [start, end] = line.data;
                    if (!start || !end) return null;
                    return (
                      <line
                        key={line.id}
                        x1={xScale(start.x)}
                        x2={xScale(end.x)}
                        y1={yScale(start.y)}
                        y2={yScale(end.y)}
                        stroke={line.color}
                        strokeWidth={3}
                        strokeDasharray="6 4"
                      />
                    );
                  })}
                </>
              ),
              "mesh",
              "legends",
            ]}
            theme={themeSettings}
          />
        </Box>
      ) : (
        <ThemedDataGrid rows={formattedTableRows} columns={columns} />
      )}
    </Box>
  );
}
