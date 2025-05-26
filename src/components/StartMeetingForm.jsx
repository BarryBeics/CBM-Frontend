import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import AdminUserSelect from "./AdminUserSelect";

const StartMeetingForm = ({ onMeetingStart, onClose }) => {
  const [attendees, setAttendees] = useState([]);
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleStartMeeting = () => {
    if (!attendees.length || !location) {
      setSnackbar({
        open: true,
        message: "Participants and location are required.",
        severity: "error",
      });
      return;
    }

    const meetingData = {
      meetingId: `meeting-${Date.now()}`,
      startTime: new Date().toISOString(),
      participants: attendees,
      location,
      topic,
    };

    localStorage.setItem("activeMeeting", JSON.stringify(meetingData));

    // Notify parent
    if (onMeetingStart) onMeetingStart();

    setSnackbar({
      open: true,
      message: "Meeting started.",
      severity: "success",
    });
    if (onClose) onClose();
  };

  const handleAddAttendee = (field, selected) => {
    if (!attendees.includes(selected)) {
      setAttendees((prev) => [...prev, selected]);
    }
  };

  const removeAttendee = (name) => {
    setAttendees((prev) => prev.filter((a) => a !== name));
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h6">Start a Meeting</Typography>

      <AdminUserSelect selectedAdmin={""} setFieldValue={handleAddAttendee} />

      <Box display="flex" flexWrap="wrap" gap={1}>
        {attendees.map((name) => (
          <Chip key={name} label={name} onDelete={() => removeAttendee(name)} />
        ))}
      </Box>

      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <TextField
        label="Meeting Topic (optional)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={handleStartMeeting}
      >
        Start Meeting
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbar({ ...snackbar, open: false })} // ✅ correct handler
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StartMeetingForm;
