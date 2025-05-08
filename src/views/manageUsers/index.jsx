import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { GraphQLClient } from "graphql-request";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import DeleteUserModal from "../../components/DeleteUserModal";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";

const client = new GraphQLClient(graphqlEndpoint);

// GraphQL queries and mutations
const GET_ALL_USERS_QUERY = `
  query {
    getAllUsers {
      id
      firstName
      lastName
      email
      contact
      role
    }
  }
`;

const DELETE_USER_MUTATION = `
  mutation DeleteUser($email: String!) {
    deleteUser(email: $email)
  }
`;


const ManageUsers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const data = await client.request(GET_ALL_USERS_QUERY);
      const formattedUsers = data.getAllUsers.map((user) => ({
        ...user,
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.contact,
        email: user.email,
        access: user.role,
      }));
      setUsers(formattedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle delete
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser?.email) return;
  
    try {
      await client.request(DELETE_USER_MUTATION, { email: selectedUser.email });
      await fetchUsers(); // Refresh list
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };
  

  const handleEdit = (email) => {
    console.log(`Edit user with email ${email}`);
    navigate(`/users/edit/${email}`);
  };
  

  const columns = [
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => (
        <Box
          width="60%"
          m="10px auto"
          p="5px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={
            access === "admin"
              ? colors.greenAccent[600]
              : access === "member"
              ? colors.greenAccent[700]
              : colors.greenAccent[800]
          }
          borderRadius="4px"
          sx={{ maxHeight: "30px" }}
        >
          {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {access === "member" && <SecurityOutlinedIcon />}
          {access === "public" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {access}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px" m="10px auto">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(row.email)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleOpenDeleteModal(row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Managing the Users" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid rows={users} columns={columns} />
      </Box>

      {/* Delete Modal */}
      <DeleteUserModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
      />
    </Box>
  );
};


  export default ManageUsers;
  