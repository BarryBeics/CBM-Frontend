// React
import React, { useEffect, useState } from "react";

// Third-party libraries
import { Grid, Box, Button, Slider, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Graph
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../config";

// Theme
import { tokens } from "../theme";

// Components
import Header from "./Header";

// Graph
import { createStrategy } from "../graph/strategies/createStrategy";

// Static data
import namesJson from "../data/names.json";
 

const client = new GraphQLClient(graphqlEndpoint);

const CreateBot = ({ onCreated }) => {
  const [formValues, setFormValues] = useState({
    BotInstanceName: "",
    TradeDuration: 0,
    IncrementsATR: 0,
    LongSMADuration: 0,
    ShortSMADuration: 0,
    WINCounter: 0,
    LOSSCounter: 0,
    TIMEOUTGainCounter: 0,
    TIMEOUTLossCounter: 0,
    NetGainCounter: 0,
    NetLossCounter: 0,
    AccountBalance: 1000.0,
    MovingAveMomentum: 0,
    TakeProfitPercentage: 0,
    StopLossPercentage: 0,
    ATRtollerance: 0.0,
    FeesTotal: 0,
    Tested: false,
    Owner: "Barry Marples",
    CreatedOn: Math.floor(Date.now() / 1000),
  });

  const [botNames, setBotNames] = useState([]);
  const [options, setOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const theme = useTheme(); // Use the useTheme hook
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchBotNames = async () => {
      try {
        const query = `{
          readAllStrategies {
            BotInstanceName
          }
        }`;

        const res = await client.request(query);
        const usedNames = res.readAllStrategies.map((s) => s.BotInstanceName);

        // All names from JSON
        const jsonNames = namesJson.bot_names || [];

        // Filter out used names
      const availableNames = jsonNames.filter((name) => !usedNames.includes(name));

      setBotNames(usedNames);
      setOptions(availableNames);
    } catch (err) {
      console.error("Failed to load bot names", err);
    }
  };

  fetchBotNames();
}, []);

  const handleSliderChange = (name) => (event, newValue) => {
    setFormValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    if (submitting || !formValues.BotInstanceName) return;
  
    try {
      setSubmitting(true);
      await createStrategy(formValues); 
      onCreated?.(); 
    } catch (err) {
      console.error("Error creating bot:", err);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Box m="20px">
      <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center">
        <Header
          title="CREATE A NEW BOT STRATEGY"
          subtitle="Choose the combination of parameters that you would like"
        />
        
        <Grid container spacing={2} mt={2}>
  {/* Bot Name Dropdown */}
  <Grid item xs={12} sm={6} md={4}>
    <Box
      backgroundColor={colors.grey[700]}
      borderRadius="5px"
      boxShadow={1}
      p={2}
       minHeight="100px"
    >
      <FormControl sx={{ width: "250px" }}>
        <InputLabel>Select Bot Name</InputLabel>
        <Select
          value={formValues.BotInstanceName}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              BotInstanceName: e.target.value,
            }))
          }
          label="Bot Name"
          sx={{
            color: colors.scalpelTeal[500],
            "& .MuiSvgIcon-root": {
              color: colors.scalpelTeal[500],
            },
          }}
        >
          {options.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  </Grid>

  {/* Sliders */}
  {[
    ["TakeProfitPercentage", "Take Profit %", 1, 8, 0.1],
    ["StopLossPercentage", "Stop Loss %", -6, -1, 0.1],
    ["IncrementsATR", "ATR Increments", 2, 10, 2],
    ["MovingAveMomentum", "Momentum %", 0.5, 8, 0.5],
    ["TradeDuration", "Trade Duration (mins)", 5, 60, 5],
    ["ShortSMADuration", "Short SMA (mins)", 5, 150, 5],
    ["LongSMADuration", "Long SMA (mins)", 5, 180, 5],
  ].map(([field, label, min, max, step]) => (
    <Grid item xs={12} sm={6} md={4} key={field}>
      <Box
        backgroundColor={colors.grey[700]}
        borderRadius="5px"
        boxShadow={1}
        p={2}
        minHeight="100px"
      >
        <Typography gutterBottom>
          {label}: <strong>{formValues[field]}</strong>
        </Typography>
        <Slider
          value={formValues[field]}
          min={min}
          max={max}
          step={step}
          onChange={handleSliderChange(field)}
          valueLabelDisplay="auto"
          sx={{
            color: colors.scalpelTeal[500],
            "& .MuiSlider-thumb": {
              borderRadius: "50%",
              backgroundColor: colors.scalpelTeal[500],
            },
            "& .MuiSlider-track": {
              backgroundColor: colors.scalpelTeal[500],
            },
            "& .MuiSlider-rail": {
              backgroundColor: colors.grey[700],
            },
          }}
        />
      </Box>
    </Grid>
  ))}

  {/* Submit Button */}
  <Grid item xs={12}>
    <Box
      backgroundColor={colors.grey[700]}
      borderRadius="5px"
      boxShadow={1}
      p={2}
       minHeight="100px"
      display="flex"
      justifyContent="center"
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: colors.scalpelTeal[500],
          color: "#fff",
          "&:hover": {
            backgroundColor: colors.scalpelTeal[700],
          },
          width: "150px",
        }}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </Box>
  </Grid>
</Grid>

      </Box>
      </Box>
    
  );
};

export default CreateBot;
