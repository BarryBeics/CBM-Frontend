import React, { useEffect, useState, useCallback } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import DeleteProjectModal from "../../components/DeleteProjectModal";
import { graphqlEndpoint } from "../../config";
import { tokens } from "../../theme";

const client = new GraphQLClient(graphqlEndpoint);

// GraphQL queries and mutations
const GET_ALL_PROJECTS_QUERY = `
  query getAllSopProjects {
    filterProjects(filter: { sop: false }) {
      id
      title
      description
      labels
      assignedTo
      dueDate
      status
      tasks {
        id
      }
    }
  }
`;

const DELETE_PROJECT_MUTATION = `
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

const ManageProjects = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const location = useLocation();
  const { sop = false, name = "Project" } = location.state || {};

  const [projects, setProjects] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await client.request(GET_ALL_PROJECTS_QUERY);
      const formattedProjects = data.filterProjects.map((project) => ({
        ...project,
        labels: project.labels?.join(", ") || "",
        taskCount: project.tasks?.length || 0,
      }));
      setProjects(formattedProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenDeleteModal = (project) => {
    setSelectedProject(project);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProject(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject?.id) return;
    try {
      await client.request(DELETE_PROJECT_MUTATION, { id: selectedProject.id });
      await fetchProjects();
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit project with id ${id}`);
    navigate(`/projects/edit/${id}`);
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "assignedTo", headerName: "Assigned To", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    { field: "labels", headerName: "Labels", flex: 1 },
    { field: "taskCount", headerName: "Tasks", flex: 0.5 },
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
            onClick={() => handleEdit(row.id)}
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
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={() => navigate("/createTask", { state: { projectId: row.id } })}
      >
        + Task
      </Button>
    </Box>
  ),
},
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="PROJECTS" subtitle="Manage All Projects" />
      <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate("/createProject", { state: { sop: false, name: "PROJECT", redirectPath: "/manageProjects" } })
            }
          >
            Create Project
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
        <DataGrid rows={projects} columns={columns} />
      </Box>

      <DeleteProjectModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        project={selectedProject}
      />
    </Box>
  );
};

export default ManageProjects;
