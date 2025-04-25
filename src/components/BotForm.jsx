// Third-party libraries
import { Box, Typography, useTheme } from "@mui/material";

// Theme
import { tokens } from "../theme";

const BotForm = ({ title, subtitle, icon, progress, increase, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      width="100%"
      p={2}
      backgroundColor={colors.primary[400]}
      borderRadius="8px"
      boxShadow={1}
      m="10px"
    >
      {icon && (
        <Box display="flex" justifyContent="space-between">
          <Box>{icon}</Box>
          {progress !== undefined && <Box>{progress}</Box>}
        </Box>
      )}

      {title && (
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.grey[100], mb: 1 }}
        >
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="h5" sx={{ color: colors.greenAccent[500], mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      {/* 🧩 Inject your form elements or sliders here */}
      {children}
    </Box>
  );
};

export default BotForm;

