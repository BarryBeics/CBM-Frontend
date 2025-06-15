import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

// Graph
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../config";

const client = new GraphQLClient(graphqlEndpoint);

const SymbolDropdown = ({
  selectedSymbols = [],
  setSelectedSymbols = () => {},
  onSelectSymbol = () => {},
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Load options
  useEffect(() => {
  const fetchSymbols = async () => {
    setLoading(true);
    try {
      const query = gql`
        query readAvailableSymbols {
          readAvailableSymbols
        }
      `;

      const res = await client.request(query);
      const symbols = res.readAvailableSymbols ?? [];
      console.log("Fetched symbols:", symbols);

      setOptions(symbols);
    } catch (error) {
      console.error("Failed to load symbols from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSymbols();
}, []);

  return (
    <Box backgroundColor={colors.grey[800]} borderRadius="5px" boxShadow={1} p={2} minHeight="100px">
      <FormControl sx={{ width: "250px" }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: colors.grey[100] }}>
          Select Symbol
        </Typography>

        <Autocomplete
          multiple
          options={options}
          value={selectedSymbols}
          loading={loading}
          onChange={(_, newValues) => {
            // Find new addition
            const added = newValues.find((v) => !selectedSymbols.includes(v));
            if (added) {
              onSelectSymbol("symbol", added);
            }

            // De-duplicate and update
            const unique = Array.from(new Set(newValues));
            setSelectedSymbols(unique);
          }}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Choose symbols"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{
            "& .MuiInputBase-root": {
              color: colors.scalpelTeal[500],
            },
            "& .MuiSvgIcon-root": {
              color: colors.scalpelTeal[500],
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default SymbolDropdown;
