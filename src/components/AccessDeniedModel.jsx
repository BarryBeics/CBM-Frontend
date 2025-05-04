// src/components/AccessDeniedModal.jsx
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccessDeniedModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" gutterBottom>
          You don't have permission to view this page.
        </Typography>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Register
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccessDeniedModal;
