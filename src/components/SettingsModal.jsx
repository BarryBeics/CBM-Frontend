import { Modal, Box, Typography, Divider, FormControlLabel, Switch } from "@mui/material";

const SettingsModal = ({ open, onClose, showComplete, setShowComplete, showSomedayMaybe, setShowSomedayMaybe }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        p={4}
        bgcolor="background.paper"
        borderRadius={2}
        boxShadow={24}
        mx="auto"
        my="15vh"
        width="400px"
      >
        <Typography variant="h5" mb={2}>Settings</Typography>

        <Typography variant="h6" mt={2}>Kanban</Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection="column" gap={2}>
          <FormControlLabel
            control={<Switch checked={showComplete} onChange={() => setShowComplete((prev) => !prev)} />}
            label="Show Completed Tasks"
          />
          <FormControlLabel
            control={<Switch checked={showSomedayMaybe} onChange={() => setShowSomedayMaybe((prev) => !prev)} />}
            label="Show Someday/Maybe Tasks"
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
