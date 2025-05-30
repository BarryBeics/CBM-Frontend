import { Box, IconButton, useTheme, Tooltip, Snackbar, Alert, Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { useSettings } from "../context/SettingsProvider";
import SettingsModal from "../components/SettingsModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext } from "../theme";
import {
  DarkModeOutlined as DarkModeOutlinedIcon,
  LightModeOutlined as LightModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  LoginOutlined as LoginOutlinedIcon,
  TimerOutlined as TimerOutlinedIcon,
} from "@mui/icons-material";

// Theme
import { tokens } from "../theme";

import { useAuth } from "../auth/AuthContext";
import LogoutButton from "../auth/LogoutButton";
import MeetingModal from "../components/MeetingModal";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const {
    showComplete,
    setShowComplete,
    showSomedayMaybe,
    setShowSomedayMaybe,
  } = useSettings();

  const meetingInProgress = Boolean(localStorage.getItem("activeMeeting"));
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

            <Tooltip title="Track Meetings">
              <IconButton
                onClick={() => setShowMeetingModal(true)}
                sx={{ color: meetingInProgress ? "red" : "inherit" }}
              >
                <TimerOutlinedIcon />
              </IconButton>
            </Tooltip>

            <MeetingModal
              open={showMeetingModal}
              onClose={() => setShowMeetingModal(false)}
              setSnackbar={setSnackbar}
            />

            <Tooltip
              title="Settings"
              color="secondary"
              onClick={() => setShowSettingsModal(true)}
            >
              <IconButton>
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>

            <SettingsModal
              open={showSettingsModal}
              onClose={() => setShowSettingsModal(false)}
              showComplete={showComplete}
              setShowComplete={setShowComplete}
              showSomedayMaybe={showSomedayMaybe}
              setShowSomedayMaybe={setShowSomedayMaybe}
            />

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
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              fontWeight: "bold",
              background: colors.houndGold[500],
              color: "#222",
              ml: 2,
              boxShadow: 2,
              textTransform: "uppercase",
    '&:hover': {
      background: colors.houndGold[600],
    },
  }}
  onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Topbar;
