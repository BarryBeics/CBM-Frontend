import React, { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import DeleteProjectModal from "../../components/DeleteProjectModal";
import TableActions from "../../components/TableActions";
import ThemedDataGrid from "../../components/ThemedDataGrid";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const READ_PROJECTS_FILTER_QUERY = `
  query ReadProjectsFilter($sop: Boolean!) {
    readProjectsFilter(filter: { sop: $sop }) {
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

const ManageSOPs = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { sop = true, name = "SOP" } = location.state || {};

  const [projects, setProjects] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await client.request(READ_PROJECTS_FILTER_QUERY, { sop });
    const formattedProjects = data.readProjectsFilter.map((project) => ({
        ...project,
        labels: project.labels?.join(", ") || "",
        taskCount: project.tasks?.length || 0,
      }));
      setProjects(formattedProjects);
    } catch (err) {
      console.error("Failed to fetch SOP projects:", err);
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
    console.log(`Edit SOP project with id ${id}`);
    navigate(`/sops/edit/${id}`);
  };

 

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "labels", headerName: "Labels", flex: 1 },
    { field: "taskCount", headerName: "Tasks", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <TableActions
        onEdit={() => handleEdit(row.id)}
        onDelete={() => handleOpenDeleteModal(row)}
        onCreateTask={() =>
          navigate("/createTask", {
            state: {
              projectId: row.id,
              redirectPath: "/manageSops", // or whatever is relevant
            },
          })
        }
        hideCreate={false} 
      />
  ),
},
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="SOPs (Standard Operating Proceedures)" subtitle="Manage SOP these are template from which you can create instances" />
      <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            navigate("/createProject", { state: { sop: true, name: "SOP", redirectPath: "/manageSOPs"  } })
          }
        >
          Create SOP
        </Button>

              </Box>
              <ThemedDataGrid rows={projects} columns={columns} />

      <DeleteProjectModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        project={selectedProject}
      />
    </Box>
  );
};

export default ManageSOPs;
