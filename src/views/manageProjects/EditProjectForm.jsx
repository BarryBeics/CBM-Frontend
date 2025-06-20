import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import formOptions from "../../config/formOptions.json";
import { graphqlEndpoint } from "../../config";
import { parse, isValid } from "date-fns";

import LabelSelector from "../../components/LabelSelector";
import DateInput from "../../components/DateInput";
import Header from "../../components/Header";
import AdminUserSelect from "../../components/AdminUserSelect";

const client = new GraphQLClient(graphqlEndpoint);

const READ_PROJECT_QUERY = `
  query ReadSingleProjectById($id: ID!) {
    readSingleProjectById(id: $id) {
      id
    title
    sop
    description
    labels
    assignedTo
    dueDate
    status
    createdAt
    updatedAt
    tasks {
id
    title
    description
    status
    labels
    assignedTo
    dueDate
    deferDate
    department
    projectId
    duration
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
      sop
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
    labels: yup.array().of(yup.string()),
    assignedTo: yup.string(),
    dueDate: yup.string(),
    status: yup.string(),
  });
  
  const ProjectEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await client.request(READ_PROJECT_QUERY, { id });
        const project = response?.readSingleProjectById;

        if (project) {
          setInitialValues({
            id: project.id,
            title: project.title || "",
            description: project.description || "",
            labels: project.labels || [],
            assignedTo: project.assignedTo || "",
            dueDate: project.dueDate && isValid(parse(project.dueDate, "dd-MM-yyyy", new Date()))
                      ? project.dueDate
                      : "",
            status: project.status || "",
            sop: project.sop ?? false,
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
            labels: values.labels,
            assignedTo: values.assignedTo,
            dueDate: values.dueDate,
            status: values.status,
            sop: values.sop,
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
          {({ 
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
           }) => (
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
              <LabelSelector
                selectedLabels={values.labels}
                setFieldValue={setFieldValue}
                error={errors.labels}
                touched={touched.labels}
              />
              <AdminUserSelect
                selectedAdmin={values.assignedTo}
                setFieldValue={setFieldValue}
              />
              <DateInput
                  label="Due Date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={setFieldValue}
                  onBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  error={errors.dueDate}
                  touched={touched.dueDate}
                />

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                   {(formOptions.projectStatusOptions || []).map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
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