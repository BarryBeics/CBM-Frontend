import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";

const ThemedDataGrid = ({ rows, columns, height = "75vh", sx = {}, ...props }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      m="40px 0 0 0"
      height={height}
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.scalpelTeal[700],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.grey[700],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.scalpelTeal[500],
        },
        ...sx,
      }}
    >
      <DataGrid rows={rows} columns={columns} {...props} />
    </Box>
  );
};

export default ThemedDataGrid;
