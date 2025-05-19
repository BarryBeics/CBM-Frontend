import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import formOptions from "../../config/formOptions.json";
import Header from "../../components/Header";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_TASK_QUERY = `
  query GetTaskById($id: ID!) {
    taskById(id: $id) {
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
    }
  }
`;

const UPDATE_TASK_MUTATION = `
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
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
    }
  }
`;

const EditTaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const location = useLocation();
  const passedProjectId = location.state?.projectId || "";
  const redirectPath = location.state?.redirectPath || "/manageTasks"; // default fallback

  console.log("Received location state:", location.state);
  console.log("Parsed projectId from location state:", passedProjectId);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { taskById } = await client.request(GET_TASK_QUERY, { id });

        setInitialValues({
          title: taskById.title || "",
          description: taskById.description || "",
          status: taskById.status || "",
          priority: taskById.priority || "",
          type: taskById.type || "",
          labels: taskById.labels || "",
          assignedTo: taskById.assignedTo || "",
          dueDate: taskById.dueDate
            ? new Date(taskById.dueDate).toISOString().split("T")[0]
            : "",
          category: taskById.category || "",
          projectId: taskById.projectId || "",
        });
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };

    fetchTask();
  }, [id]);

  const validationSchema = yup.object().shape({
    title: yup.string().required("required"),
    description: yup.string(),
    status: yup.string().required("required"),
    priority: yup.string(),
    type: yup.string(),
    labels: yup.string(),
    assignedTo: yup.string(),
    dueDate: yup.string(),
    category: yup.string(),
    projectId: yup.string(),
  });

  const handleFormSubmit = async (values) => {
    const formattedValues = {
      ...values,
      id,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };

    try {
      const response = await client.request(UPDATE_TASK_MUTATION, {
        input: formattedValues,
      });
      console.log("Update response:", response);
      alert("Task updated!");
      navigate(redirectPath); 
    } catch (err) {
      console.error("Update failed:", err.response?.errors || err);
      alert("Failed to update task.");
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Header title="EDIT TASK" subtitle={`Edit task: ${initialValues.title}`} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
              <TextField
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
                sx={{ gridColumn: "span 4" }}
              />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  >
                    {formOptions.statusOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
              </FormControl>

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Priority</InputLabel>
                  <Select
                                  name="priority"
                                  value={values.priority}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  {formOptions.priorityOptions.map((opt) => (
                                      <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </MenuItem>
                                    ))}
                                </Select>
              </FormControl>

              <TextField
                label="Type"
                name="type"
                value={values.assignedTo}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Labels"
                name="labels"
                value={values.assignedTo}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Assigned To"
                name="assignedTo"
                value={values.assignedTo}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Category"
                name="category"
                value={values.category}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Project Id"
                name="projectId"
                value={values.sopLink}
                onChange={handleChange}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Save Changes
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditTaskForm;
