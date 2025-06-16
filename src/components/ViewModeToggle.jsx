import { Box, Button } from "@mui/material";

const ViewModeToggle = ({ modes = [], value, onChange }) => {
  return (
    <Box display="flex" justifyContent="space-between" gap={1} flexWrap="wrap">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={value === mode.id ? "contained" : "outlined"}
          onClick={() => onChange(mode.id)}
          size="small"
        >
          {mode.label}
        </Button>
      ))}
    </Box>
  );
};

export default ViewModeToggle;
