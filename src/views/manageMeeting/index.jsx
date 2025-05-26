import StartMeetingForm from "../../components/StartMeetingForm";
import CompleteMeetingButton from "../../components/CompleteMeetingButton";
import { Box, Typography } from "@mui/material";

const ManageMeeting = () => (
  <Box m={2}>
    <Typography variant="h4" gutterBottom>
      Meeting Tracker
    </Typography>
    <StartMeetingForm />
    <CompleteMeetingButton />
  </Box>
);

export default ManageMeeting;
