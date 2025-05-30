import { Box, Chip, Typography } from "@mui/material";
import formOptions from "../config/formOptions.json";

const LabelSelector = ({ selectedLabels, setFieldValue, error, touched }) => {
  const handleToggle = (label) => {
    const newLabels = selectedLabels.includes(label)
      ? selectedLabels.filter((l) => l !== label)
      : [...selectedLabels, label];

    setFieldValue("labels", newLabels);
  };

  return (
    <Box width="100%" sx={{ gridColumn: "span 4" }}>
      <Typography variant="subtitle2" gutterBottom>
        Labels
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {formOptions.labelOptions.map((label) => (
          <Chip
          key={label.value}
          label={label.value}
          onClick={() => handleToggle(label.value)}
          clickable
          style={{
            backgroundColor: label.color,
            color: "#333",
            fontWeight: selectedLabels.includes(label.value) ? "bold" : "normal",
            border: selectedLabels.includes(label.value) ? "2px solid #444" : "none",
          }}
        />
        ))}
      </Box>
      {touched && error && (
        <Typography variant="caption" color="error" mt={1}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LabelSelector;
