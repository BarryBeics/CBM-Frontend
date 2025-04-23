// components/TimeRangeSelector.jsx
import React from "react";
import { Box, Button } from "@mui/material";

const timeOptions = [
  { label: "30 min", minutes: 6 },
  { label: "1 hour", minutes: 12 },
  { label: "2 hours", minutes: 24 },
  { label: "4 hours", minutes: 48 },
  { label: "12 hours", minutes: 144 },
];

const TimeRangeSelector = ({ value, onChange, colorMode }) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={1}>
      {timeOptions.map(({ label, minutes }) => (
        <Button
          key={minutes}
          onClick={() => onChange(minutes)}
          sx={{
            backgroundColor:
              value === minutes
                ? colorMode.greenAccent[600]
                : colorMode.blueAccent[700],
            color: colorMode.grey[100],
            fontWeight: "bold",
            padding: "6px 12px",
            fontSize: "13px",
            "&:hover": {
              backgroundColor: colorMode.greenAccent[500],
            },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};

export default TimeRangeSelector;
