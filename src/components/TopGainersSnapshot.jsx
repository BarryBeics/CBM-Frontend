// React
import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import { Box, Typography } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { tokens } from "../theme";
import { mean } from "lodash";

const gainKeys = [
  { label: "Top 3", key: "TopAGain" },
  { label: "Top 5", key: "TopBGain" },
  { label: "Top 10", key: "TopCGain" },
];

const TopGainersSnapshot = ({ activityData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const stats = useMemo(() => {
    if (!activityData || !activityData.length) return [];

    const latest = activityData.at(-1);
    const sixHours = activityData.slice(-72); // 6h window at 5min intervals

    return gainKeys.map(({ label, key }) => {
      const current = latest?.[key] ?? 0;
      const avg6hRaw = mean(
        sixHours.map((d) => d[key]).filter((n) => typeof n === "number")
      );
      const avg6h = isNaN(avg6hRaw) ? 0 : avg6hRaw;
      const direction =
        current > avg6h ? "up" : current < avg6h ? "down" : "flat";

      const directionColor =
        direction === "up"
          ? colors?.greenAccent?.[400] || "#4caf50"
          : direction === "down"
          ? colors?.redAccent?.[400] || "#f44336"
          : colors?.grey?.[300] || "#9e9e9e";

      return {
        label,
        current: current.toFixed(2),
        avg6h: avg6h.toFixed(2),
        direction,
        directionColor,
      };
    });
  }, [activityData]);

  return (
    <Box
      p={2}
      backgroundColor={colors.grey[800]}
      borderRadius="8px"
      width="100%"
      boxShadow={2}
    >
      <Typography variant="h6" gutterBottom>
        Avg Gainers Snapshot
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
        <Typography variant="subtitle2">Top N</Typography>
        <Typography variant="subtitle2">Current %</Typography>
        <Typography variant="subtitle2">6h Avg %</Typography>

        {stats.map(({ label, current, avg6h, direction, directionColor }) => (
          <React.Fragment key={label}>
            <Typography>{label}</Typography>
            <Box display="flex" alignItems="center" color={directionColor}>
              {direction === "up" && <ArrowDropUpIcon fontSize="small" />}
              {direction === "down" && <ArrowDropDownIcon fontSize="small" />}
              <Typography>{current}%</Typography>
            </Box>
            <Typography color={colors.grey[300]}>{avg6h}%</Typography>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default TopGainersSnapshot;
