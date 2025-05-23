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
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Labels
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {formOptions.labelOptions.map((label) => (
          <Chip
            key={label}
            label={label}
            clickable
            onClick={() => handleToggle(label)}
            color={selectedLabels.includes(label) ? "gold" : "default"}
            variant={selectedLabels.includes(label) ? "filled" : "outlined"}
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
