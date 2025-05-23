import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { GraphQLClient } from "graphql-request";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import DeleteUserModal from "../../components/DeleteUserModal";
import TableActions from "../../components/TableActions";
import ThemedDataGrid from "../../components/ThemedDataGrid";
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
              ? colors.scalpelTeal[600]
              : access === "member"
              ? colors.scalpelTeal[700]
              : colors.scalpelTeal[800]
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
        <TableActions
        onEdit={() => handleEdit(row.id)}
        onDelete={() => handleOpenDeleteModal(row)}
        hideCreate={true} 
      />
  ),
},
  ];

  return (
    <Box m="20px">
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Header title="USERS" subtitle="Managing the Users" />
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate("/createUser")}
    >
      Create User
    </Button>
  </Box>
  <ThemedDataGrid rows={users} columns={columns} />

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
  