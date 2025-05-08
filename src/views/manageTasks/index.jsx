import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import DeleteTaskModal from "../../components/DeleteTaskModal";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";
import EditTaskForm from "./EditTaskForm";

const client = new GraphQLClient(graphqlEndpoint);

// GraphQL queries and mutations
const GET_ALL_TASKS_QUERY = `
  query {
    allTasks {
    id
    title
    description
    status
    priority
    assignedTo
    dueDate
    category
    projectId
    createdAt
    updatedAt
  }
}
`;

const DELETE_TASK_MUTATION = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const ManageTasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await client.request(GET_ALL_TASKS_QUERY);
      const formattedTasks = data.allTasks.map((task) => ({
        ...task,
        id: task.id,
      }));
      setTasks(formattedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenDeleteModal = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask?.id) return;
    try {
      await client.request(DELETE_TASK_MUTATION, { id: selectedTask.id });
      await fetchTasks();
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit task with id ${id}`);
    navigate(`/tasks/edit/${id}`);
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px" m="10px auto">
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="TASKS" subtitle="View and Manage Tasks" />
      <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/createTask")}
                >
                  Create Task
                </Button>
              </Box>
              <Box
                m="40px 0 0 0"
                height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
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
        <DataGrid rows={tasks} columns={columns} />
      </Box>

      <DeleteTaskModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        task={selectedTask}
      />
    </Box>
  );
};

export default ManageTasks;
