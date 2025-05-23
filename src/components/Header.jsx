// components/Header.jsx
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({
  title,
  subtitle,
  align = "left",
  mb = 3,
  divider = false,
  sx = {},
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb={mb} textAlign={align} sx={sx.root}>
      <Typography
        variant="h3"
        fontWeight="bold"
        color={colors.offwhite?.[600] || "primary.main"}
        sx={{ mb: 0.5, ...sx.title }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="h5"
          color={colors.houndGold?.[400] || "secondary.main"}
          sx={sx.subtitle}
        >
          {subtitle}
        </Typography>
      )}

      {divider && (
        <Box
          mt={1}
          mb={1}
          borderBottom="1px solid"
          borderColor="divider"
        />
      )}
    </Box>
  );
};

export default Header;