import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Box, Typography } from "@mui/material";
import StartMeetingForm from "./StartMeetingForm";
import CompleteMeetingButton from "./CompleteMeetingButton";
import { tokens } from "../theme";

const MeetingModal = ({ open, onClose, setSnackbar }) => {
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [meeting, setMeeting] = useState(null);
  

  const colors = tokens("dark"); // or theme.palette.mode if you're passing theme in

  useEffect(() => {
    const data = localStorage.getItem("activeMeeting");
    if (data) {
      setIsMeetingActive(true);
      setMeeting(JSON.parse(data));
    } else {
      setIsMeetingActive(false);
      setMeeting(null);
    }
  }, [open]);

  const handleMeetingEnd = () => {
    setIsMeetingActive(false);
    onClose();
  };

  const renderMeetingSummary = () => {
    if (!meeting) return null;

    const startTime = new Date(meeting.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <Box
        p={2}
        borderRadius="8px"
        mb={2}
        backgroundColor={colors.scalpelTeal[800]}
        color={colors.grey[100]}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Meeting started at {startTime} by you
        </Typography>
        {meeting.topic && (
          <Typography variant="body2" gutterBottom>
            <strong>Topic:</strong> {meeting.topic}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          <strong>Location:</strong> {meeting.location}
        </Typography>
        <Typography variant="body2">
          <strong>Attendees:</strong> {meeting.participants.join(", ")}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ backgroundColor: colors.scalpelTeal[700], color: "#fff" }}>
        {isMeetingActive ? "Meeting In Progress" : "Start Meeting"}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.scalpelTeal[900] }}>
        {isMeetingActive ? (
          <>
            {renderMeetingSummary()}
            <CompleteMeetingButton onComplete={handleMeetingEnd} setSnackbar={setSnackbar} />
          </>
        ) : (
          <StartMeetingForm
            onMeetingStart={() => {
              setSnackbar({
                open: true,
                message: "Meeting started",
                severity: "success",
              });
              onClose();
            }}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
