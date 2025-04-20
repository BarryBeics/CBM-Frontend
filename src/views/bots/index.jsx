// src/scenes/bots/Bots.jsx
import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CreateBot from "../../components/CreateBot";
import { getAllStrategies } from "../../graph/getAllStrategies";


const Bots = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [botData, setBotData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllStrategies();
      setBotData(data);
    };
    getData();
  }, []);

  const columns = [
    { field: "BotInstanceName", headerName: "Bot Name", flex: 1 },
    { field: "TakeProfitPercentage", headerName: "Take Profit %", flex: 1 },
    { field: "StopLossPercentage", headerName: "Stop Loss %", flex: 1 },
    { field: "IncrementsATR", headerName: "ATR Increments", flex: 1 },
    { field: "ATRtollerance", headerName: "ATR Tolerance %", flex: 1 },
    { field: "MovingAveMomentum", headerName: "Momentum %", flex: 1 },
    { field: "TradeDuration", headerName: "Duration", flex: 1 },
    { field: "LongSMADuration", headerName: "Long SMA", flex: 1 },
    { field: "ShortSMADuration", headerName: "Short SMA", flex: 1 },
    { field: "WINCounter", headerName: "Wins", flex: 1 },
    { field: "LOSSCounter", headerName: "Losses", flex: 1 },
    { field: "TIMEOUTGainCounter", headerName: "Gain Timeouts", flex: 1 },
    { field: "TIMEOUTLossCounter", headerName: "Loss Timeouts", flex: 1 },
    { field: "NetLossCounter", headerName: "Net Losses", flex: 1 },
    { field: "AccountBalance", headerName: "Balance ($)", flex: 1 },
  ];

  return (
    <Box m="20px">
      <CreateBot onCreated={() => {
        getAllStrategies().then(setBotData);
      }} />
  
  <Header title="BOT STRATEGIES" subtitle="Live strategy bot metrics" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={botData}
          columns={columns}
          getRowId={(row) => row.CreatedOn}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}  

export default Bots;
