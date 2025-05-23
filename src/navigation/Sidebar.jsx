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
import { useLocation } from "react-router-dom";
import { tokens } from "../theme";
import userImage from "../assets/logo.png";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const SidebarNav = () => {
  const { user } = useAuth() || {};
const role = user?.role || "guest";
useEffect(() => {
  console.log("Sidebar re-rendered — role:", role);
}, [role]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const userRole = user?.role || "";

  const hasAccess = (itemRoles = []) => {
    if (!role) return false;
    return itemRoles.length === 0 || itemRoles.includes(role);
  };
  
  
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
          backgroundColor: colors.grey[800],
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
            <MenuOutlinedIcon sx={{ color: colors.scalpelTeal[500] }} />
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
            <Typography variant="h3" color={colors.scalpelTeal[500]} mt={1}>
              {userName}
            </Typography>
            <Typography variant="body2" color={colors.houndGold[500]}>
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
                  variant="h5" color={colors.houndGold[400]}>
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
            component={accessible ? "a" : "div"}
            href={accessible ? item.path : undefined}
            disabled={!accessible}
            sx={{
              mb: 1,
              opacity: accessible ? 1 : 0.45,
              bgcolor: isActive && accessible ? colors.scalpelTeal?.[600] : "transparent",
              "&:hover": {
                bgcolor: accessible ? colors.scalpelTeal?.[400] : "transparent",
              },
              borderRadius: 1,
              cursor: accessible ? "pointer" : "default",
              color: colors.grey?.[100],
            }}
          >
            <ListItemIcon sx={{ color: colors.houndGold?.[500], minWidth: 36 }}>
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
