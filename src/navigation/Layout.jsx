import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SidebarNav from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  return (
    <Box display="flex">
      <SidebarNav />
      <Box flex="1">
        <Topbar />
        <Box m={2}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

