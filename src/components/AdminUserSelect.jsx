import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../config";

const client = new GraphQLClient(graphqlEndpoint);

const READ_ADMINS = `
  query {
    readUsersByRole(role: "admin") {
      id
      firstName
      lastName
    }
  }
`;

const AdminUserSelect = ({ selectedAdmin, setFieldValue, disabled = false }) => {
  const [admins, setAdmins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await client.request(READ_ADMINS);
        setAdmins(data.readUsersByRole);
      } catch (err) {
        console.error("Failed to fetch admins", err);
        setError("Could not load admin users");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" mt={2} sx={{ gridColumn: "span 2" }}>
        <CircularProgress size={20} />
        <Typography variant="body2" ml={1}>Loading admins...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="body2" mt={2} sx={{ gridColumn: "span 2" }}>
        {error}
      </Typography>
    );
  }

  return (
    <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
      <InputLabel>Assign To</InputLabel>
      <Select
        value={selectedAdmin || ""}
        onChange={(e) => setFieldValue("assignedTo", e.target.value)}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>Unassigned</em>
        </MenuItem>
        {admins.map((admin) => (
          <MenuItem
          key={admin.id}
          value={`${admin.firstName} ${admin.lastName}`}
        >
          {admin.firstName} {admin.lastName}
        </MenuItem>
        
        ))}
      </Select>
    </FormControl>
  );
};

export default AdminUserSelect;
