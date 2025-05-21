import { useState, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { navItems } from "./navItems";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../theme";
import userImage from "../assets/logo.png";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const SidebarNav = () => {
  const { user, role = "guest" } = useAuth() || {};
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const userRole = user?.role || "";

  const hasAccess = (itemRoles = []) =>
    itemRoles.length === 0 || itemRoles.includes(role);
  
  console.log("Current role:", role);
  console.log("Visible nav items:", navItems.filter(item => !item.section && (item.roles.length === 0 || item.roles.includes(role))));

 useEffect(() => {
    console.log("Topbar re-rendered - role:", role);
  }, [role]);

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
        {navItems.map((item) => {
          /* hide whole Admin section for non-admins */
          if (item.adminOnly && role !== "admin") return null;

          /* render section label */
          if (item.section) {
            return (
              !isCollapsed && (
                <Typography key={`section-${item.section}`} sx={{ m: "20px 0 5px 15px" }}
                  variant="h6" color={colors.grey[300]}>
                  {item.section}
                </Typography>
              )
            );
          }

          const accessible = hasAccess(item.roles);
          const isActive   = location.pathname === item.path;

          const listItem = (
            <ListItem
              key={item.text}
              button={accessible}
              component={accessible ? Link : "div"}
              to={accessible ? item.path : undefined}
              disabled={!accessible}
              sx={{
                mb: 1,
                opacity: accessible ? 1 : 0.45,
                bgcolor: isActive && accessible ? "#6870fa" : "transparent",
                "&:hover": {
                  bgcolor: accessible ? "#868dfb" : "transparent",
                },
                borderRadius: 1,
                cursor: accessible ? "pointer" : "default",
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItem>
          );

          return accessible ? (
            listItem
          ) : (
            <Tooltip
              key={item.text}
              title="Login or upgrade to access"
              arrow
              placement="right"
            >
              {/* span wrapper lets tooltip show on disabled item */}
              <span>{listItem}</span>
            </Tooltip>
          );
        })}
      </List>
      </Box> 
    </Drawer>
  );
};

export default SidebarNav;
