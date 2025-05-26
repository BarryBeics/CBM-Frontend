import React from "react";
import { Button, Box } from "@mui/material";

const CompleteMeetingButton = ({ onComplete, setSnackbar }) => {
  const handleCompleteMeeting = () => {
    const stored = localStorage.getItem("activeMeeting");
    if (!stored) return;

    const meeting = JSON.parse(stored);
    const endTime = new Date();
    const startTime = new Date(meeting.startTime);
    const diffMs = endTime - startTime;
    const duration = Math.round(diffMs / 1000 / 60 / 5) * 5;

    localStorage.removeItem("activeMeeting");

    // ✅ Call global snackbar
    setSnackbar({
      open: true,
      message: `Meeting completed. Duration: ${duration} minutes`,
      severity: "success",
    });

    if (onComplete) onComplete();
  };

  return (
    <Box mt={2}>
      <Button variant="contained" color="error" onClick={handleCompleteMeeting}>
        Complete Meeting
      </Button>
    </Box>
  );
};

export default CompleteMeetingButton;
