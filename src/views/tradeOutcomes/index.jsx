import { useEffect, useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import ThemedDataGrid from "../../components/ThemedDataGrid";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";
import {
  formatElapsedTime,
  formatFloat,
  formatPercentage,
  formatTimestamp,
} from "../../utils/formatters";


const client = new GraphQLClient(graphqlEndpoint);

const GET_TRADE_OUTCOME_REPORTS = `
  query {
    TradeOutcomeReports {
      Timestamp
      BotName
      Balance
      Symbol
      Outcome
      Volume
      ElapsedTime
      PercentageChange
       FearGreedIndex    
      MarketStatus  
    }
  }
`;

const TradeReports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reports, setReports] = useState([]);

 const fetchReports = useCallback(async () => {
  try {
    const data = await client.request(GET_TRADE_OUTCOME_REPORTS);

    const formatted = data.TradeOutcomeReports.map((report) => ({
      id: report.Timestamp, 
      ...report,
      TimestampFormatted: new Date(report.Timestamp).toLocaleString(),
      PercentageChange: report.PercentageChange?.toFixed(2), // Keep it as number for sorting
    }));

    setReports(formatted);
  } catch (err) {
    console.error("Failed to fetch trade reports:", err);
  }
}, []);


  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const columns = [
  {
    field: "Timestamp",
    headerName: "Time",
    flex: 1.5,
  },
  {
    field: "BotName",
    headerName: "Bot",
    flex: 1,
  },
  {
    field: "Symbol",
    headerName: "Pair",
    flex: 1,
  },
  {
    field: "Outcome",
    headerName: "Result",
    flex: 1,
  },
  {
  field: "PercentageChange",
  headerName: "% Change",
  flex: 1,
  type: "number",
},
{
  field: "Balance",
  headerName: "Balance ($)",
  flex: 1,
  type: "number",
},

  {
    field: "ElapsedTime",
    headerName: "Elapsed",
    flex: 1,
  },
  {
    field: "Volume",
    headerName: "Vol",
    flex: 1,
  },
  {
    field: "FearGreedIndex",
    headerName: "Fear/Greed",
    flex: 1,
  },
  {
    field: "MarketStatus",
    headerName: "Market",
    flex: 1,
  },
];


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TRADE REPORTS" subtitle="Bot Outcome History" />
      </Box>
      <ThemedDataGrid rows={reports} columns={columns} />
    </Box>
  );
};

export default TradeReports;
