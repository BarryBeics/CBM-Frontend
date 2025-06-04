// React
import React, { useEffect, useState } from "react";

// MUI
import {
  useTheme,
  Box,
  Typography,
  CircularProgress,
  TextField,
  FormControl,
  Autocomplete,
  Chip,
} from "@mui/material";

// Theme
import { tokens } from "../theme";

const SymbolDropdown = ({
  selectedSymbols = [],
  setSelectedSymbols = () => {},
  onSelectSymbol = () => {},
  onRemoveSymbol = () => {},
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL}/testSymbols.json`);
        const data = await res.json();
        const list = data.symbols || [];

        // Normalize options
        const normalized = list.map((item) =>
          typeof item === "string" ? item : item.Symbol
        );

        setOptions(normalized);
      } catch (error) {
        console.error("Error loading symbols:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);

  return (
    <Box
      backgroundColor={colors.grey[800]}
      borderRadius="5px"
      boxShadow={1}
      p={2}
      minHeight="100px"
    >
      <FormControl sx={{ width: "250px" }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, color: colors.grey[100] }}
        >
          Select Symbol
        </Typography>

        <Autocomplete
          options={options}
          onChange={(_, newValue) => {
            if (
              newValue &&
              typeof newValue === "string" &&
              !selectedSymbols.includes(newValue)
            ) {
              console.log("🔁 Symbol selected from dropdown:", newValue);
              onSelectSymbol("symbol", newValue);
              setSelectedSymbols((prev) => [...prev, newValue]);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Choose symbols"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                input: {
                  color: colors.scalpelTeal[500],
                },
                "& .MuiSvgIcon-root": {
                  color: colors.scalpelTeal[500],
                },
              }}
            />
          )}
        />
      </FormControl>

      {/* External chip list */}
      <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
        {selectedSymbols.map((symbol) => (
          <Chip
            key={symbol}
            label={symbol}
            onDelete={() => onRemoveSymbol(symbol)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SymbolDropdown;
