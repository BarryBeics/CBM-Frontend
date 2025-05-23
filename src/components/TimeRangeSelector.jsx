// React
import React from "react";

// Third-party libraries
import { Box, Button } from "@mui/material";

const timeOptions = [
  { label: "30 min", intervals: 6 },
  { label: "1 hour", intervals: 12 },
  { label: "2 hours", intervals: 24 },
  { label: "4 hours", intervals: 48 },
  { label: "12 hours", intervals: 144 },
];


const TimeRangeSelector = ({ value, onChange, colorMode }) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={1}>
      {timeOptions.map(({ label, intervals }) => (
        <Button
          key={intervals}
          onClick={() => onChange(intervals)}
          sx={{
            backgroundColor:
              value === intervals
                ? colorMode.houndGold[500]
                : colorMode.scalpelTeal[500],
            color: colorMode.grey[100],
            fontWeight: "bold",
            padding: "6px 12px",
            fontSize: "13px",
            "&:hover": {
              backgroundColor: colorMode.scalpelTeal[400],
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
