import React, { useEffect, useState } from "react";
import { tokens } from "../theme";
import { useTheme } from "@mui/material/styles";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  FormControl,
  Typography,
} from "@mui/material";

const SymbolDropdown = ({ selectedSymbol, setSelectedSymbol}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme(); // Use the useTheme hook
    const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL}/testSymbols.json`);
        const data = await res.json();
        setOptions(data.symbols || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading symbols:", error);
      }
    };

    fetchSymbols();
  }, []);

  return (
    <Box
      backgroundColor={colors.primary[400]}
      borderRadius="8px"
      boxShadow={1}
      p={2}
      minHeight="100px"
    >
      <FormControl sx={{ width: "250px" }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1, color: colors.grey[100] }}
        >
          Select Trading Pair
        </Typography>

        <Autocomplete
          options={options}
          value={selectedSymbol}
          onChange={(_, newValue) => {
            setSelectedSymbol(newValue);
          }}
          loading={loading}
          sx={{
            "& .MuiInputBase-root": {
              color: colors.greenAccent[500],
            },
            "& .MuiSvgIcon-root": {
              color: colors.greenAccent[500],
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
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
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default SymbolDropdown;
