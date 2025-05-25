import { Box, IconButton, useTheme, Tooltip } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../theme";
import {
  DarkModeOutlined as DarkModeOutlinedIcon,
  LightModeOutlined as LightModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  LoginOutlined as LoginOutlinedIcon,
} from "@mui/icons-material";

import { useAuth } from "../auth/AuthContext";
import LogoutButton from "../auth/LogoutButton";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const { user } = useAuth();
const role = user?.role;
const isLoggedIn = !!user;


  const showPrivateIcons = role === "member" || role === "admin";

  useEffect(() => {
    console.log("Topbar re-rendered - role:", role, "| logged in:", isLoggedIn);
  }, [role, isLoggedIn]);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* LEFT */}
      <Box />

      {/* RIGHT */}
      <Box display="flex" alignItems="center">
        <Tooltip title="Toggle theme" color="secondary">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        {showPrivateIcons && (
          <>
            <Tooltip title="Notifications" color="secondary">
              <IconButton>
                <NotificationsOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings" color="secondary">
              <IconButton>
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile" color="secondary">
              <IconButton>
                <PersonOutlinedIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {isLoggedIn ? (
          <Tooltip title="Logout" color="secondary">
            <LogoutButton />
          </Tooltip>
        ) : (
          <Tooltip title="Login" >
            <IconButton onClick={() => navigate("/login")}>
              <LoginOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
