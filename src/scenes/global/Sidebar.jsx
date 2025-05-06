import { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import userImage from "../../assets/logo.png";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import CodeOffOutlined from "@mui/icons-material/CodeOffOutlined";

const navItems = [
  { text: "Landing Page", icon: <HomeOutlinedIcon />, path: "/" },
  { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "/dashboard" },
  {
    text: "Register Interest",
    icon: <PersonOutlinedIcon />,
    path: "/register",
  },
  { section: "Data" },
  // { text: "Template - Manage Team", icon: <PeopleOutlinedIcon />, path: "/team" },
  //  { text: "Template - Contacts Info", icon: <ContactsOutlinedIcon />, path: "/contacts" },
  { text: "Manage Bots", icon: <CodeOffOutlined />, path: "/bots" },
  // { text: "Template - Invoices", icon: <ReceiptOutlinedIcon />, path: "/invoices" },
  { section: "Pages" },
  { text: "Create User", icon: <PersonAddOutlinedIcon />, path: "/createUser" },
  {
    text: "Manage Users",
    icon: <PeopleAltOutlinedIcon />,
    path: "/manageUsers",
  },
  { text: "Create Task", icon: <ListAltOutlinedIcon />, path: "/createTask" },
  {
    text: "Manage Tasks",
    icon: <PeopleAltOutlinedIcon />,
    path: "/manageTasks",
  },
  { text: "Kanban Board", icon: <PeopleAltOutlinedIcon />, path: "/kanban" },
  { text: "FAQ Page", icon: <HelpOutlineOutlinedIcon />, path: "/faq" },
  { section: "Charts" },
  { text: "Pairs Chart", icon: <TimelineOutlinedIcon />, path: "/pairsChart" },
  { text: "SMA Chart", icon: <TimelineOutlinedIcon />, path: "/smaChart" },
  {
    text: "Avg Gain Chart",
    icon: <TimelineOutlinedIcon />,
    path: "/avgGainChart",
  },
  // { text: "Template - Bar Chart", icon: <BarChartOutlinedIcon />, path: "/bar" },
  // { text: "Template - Pie Chart", icon: <PieChartOutlineOutlinedIcon />, path: "/pie" },
  // { text: "Template - Line Chart", icon: <TimelineOutlinedIcon />, path: "/line" },
];

const SidebarNav = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const userRole = user?.role || "N/A";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 80 : 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 80 : 250,
          boxSizing: "border-box",
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
        },
      }}
    >
      <Box p={2}>
        {/* Menu Toggle */}
        <Box
          display="flex"
          justifyContent={isCollapsed ? "center" : "space-between"}
          alignItems="center"
        >
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            <MenuOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>

        {/* Profile Info */}
        {!isCollapsed && (
          <Box textAlign="center" mt={2}>
            <Avatar
              src={userImage}
              alt="user"
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                cursor: "pointer",
              }}
            />
            <Typography variant="h4" mt={1}>
              {userName}
            </Typography>
            <Typography variant="body2" color={colors.greenAccent[500]}>
              {userRole}
            </Typography>
          </Box>
        )}

        {/* Navigation */}
        <List>
          {navItems.map((item, index) => {
            if (item.section) {
              return (
                !isCollapsed && (
                  <Typography
                    key={`section-${item.section}`}
                    sx={{ m: "20px 0 5px 15px" }}
                    variant="h6"
                    color={colors.grey[300]}
                  >
                    {item.section}
                  </Typography>
                )
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                button
                component={Link}
                to={item.path}
                sx={{
                  mb: 1,
                  bgcolor: isActive ? "#6870fa" : "transparent",
                  color: isActive ? "#ffffff" : colors.grey[100],
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#868dfb",
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={item.text} />}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default SidebarNav;
