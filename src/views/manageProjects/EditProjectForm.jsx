import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import formOptions from "../../config/formOptions.json";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_PROJECT_QUERY = `
  query GetProjectById($id: ID!) {
    projectById(id: $id) {
      id
      title
      description
      labels
      assignedTo
      dueDate
      status
      tasks {
        id
        title
        description
        status
        priority
        type
        labels
        assignedTo
        dueDate
        category
        projectId
        createdAt
        updatedAt
      }
    }
  }
`;



const UPDATE_PROJECT_MUTATION = `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      title
      description
      labels
      assignedTo
      dueDate
      status
    }
  }
`;

const DELETE_TASK_MUTATION = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    labels: yup.string(),
    assignedTo: yup.string(),
    dueDate: yup.string(),
    status: yup.string(),
  });
  
  const ProjectEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  const [initialValues, setInitialValues] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await client.request(GET_PROJECT_QUERY, { id });
        const project = response?.projectById;

        if (project) {
          setInitialValues({
            id: project.id,
            title: project.title || "",
            description: project.description || "",
            labels: (project.labels || []).join(", "),
            assignedTo: project.assignedTo || "",
            dueDate: project.dueDate || "",
            status: project.status || "",
          });

          setTasks(project.tasks || []);
        } else {
          console.error("Project not found for id:", id);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);
  
    const handleFormSubmit = async (values) => {
      try {
        await client.request(UPDATE_PROJECT_MUTATION, {
          input: {
            id: values.id,
            title: values.title,
            description: values.description,
            labels: values.labels.split(",").map(l => l.trim()),
            assignedTo: values.assignedTo,
            dueDate: values.dueDate,
            status: values.status,
          },
        });
        alert("Project updated successfully");
        navigate("/manageProjects");
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Failed to update project");
      }
    };

    const handleDeleteTask = async () => {
      if (!selectedTask?.id) return;
      try {
        await client.request(DELETE_TASK_MUTATION, { id: selectedTask.id });
        setTasks((prev) => prev.filter((task) => task.id !== selectedTask.id));
        setDeleteModalOpen(false);
        setSelectedTask(null);
        alert("Task deleted.");
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task.");
      }
    };
  
    if (!initialValues) return <div>Loading...</div>;
  
    return (
      <Box m="20px">
        <Header title="EDIT PROJECT" subtitle="Modify project details" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Labels (comma-separated)"
                name="labels"
                value={values.labels}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={values.assignedTo}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                margin="normal"
              />
              <Box display="flex" justifyContent="flex-end" mt="20px">
                 <Button type="submit" color="secondary" variant="contained">
                  Save Changes
                </Button>
              </Box>
            </form>
          )}
        </Formik>

{/* Related Tasks */}
<Box mt="40px">
  <Header title="RELATED TASKS" subtitle="Tasks linked to this Project" />
       <Button
    variant="contained"
    color="success"
    size="small"
    onClick={() =>
      navigate("/createTask", {
        state: {
          projectId: id,
          redirectPath: `/projects/edit/${id}`, 
        },
      })
    }
  >
    + Task
  </Button>
  <DataGrid
    autoHeight
    rows={tasks}
    columns={[
      { field: "title", headerName: "Title", flex: 1 },
      { field: "status", headerName: "Status", flex: 1 },
      { field: "priority", headerName: "Priority", flex: 1 },
      { field: "assignedTo", headerName: "Assigned To", flex: 1 },
      { field: "dueDate", headerName: "Due Date", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => (
          <Box display="flex" gap="10px">
            <Button
              size="small"
              variant="contained"
              onClick={() =>
                navigate(`/tasks/edit/${row.id}`, {
                  state: {
                    redirectPath: `/projects/edit/${id}`,
                  },
                })
              }
            >
              View / Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => {
                setSelectedTask(row);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ]}
  />
</Box>

{/* Delete Task Modal */}
<Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
  <Box
    p={4}
    bgcolor="background.paper"
    borderRadius="10px"
    mx="auto"
    my="20vh"
    width="400px"
    boxShadow={24}
  >
    <Typography variant="h6">Delete Task</Typography>
    <Typography mb={2}>
      Are you sure you want to delete this task?
    </Typography>
    <Box display="flex" justifyContent="flex-end" gap={2}>
      <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
      <Button
        color="error"
        variant="contained"
        onClick={handleDeleteTask}
      >
        Delete
      </Button>
    </Box>
  </Box>
</Modal>
</Box>
);
};

export default ProjectEditForm;