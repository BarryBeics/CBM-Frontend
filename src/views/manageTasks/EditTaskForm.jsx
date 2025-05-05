import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Header from "../../components/Header";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_TASK_QUERY = `
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assignedTo
      dueDate
      category
      sopLink
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
      assignedTo
      dueDate
      category
      sopLink
      createdAt
      updatedAt
    }
  }
`;


const EditTaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { task } = await client.request(GET_TASK_QUERY, { id });
        setInitialValues(task);
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
    assignedTo: yup.string(),
    dueDate: yup.string(),
    category: yup.string(),
    sopLink: yup.string(),
  });

  const handleFormSubmit = async (values) => {
    console.log("Form is submitting")
    const formattedValues = {
      ...values,
      id,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };
  
    try {
      console.log("Submitting:", formattedValues);
      const response = await client.request(UPDATE_TASK_MUTATION, {
        input: formattedValues,
      });
      console.log("Update response:", response);
      alert("Task updated!");
      navigate("/manageTasks");
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
                <Select name="status" value={values.status} onChange={handleChange}>
                  <MenuItem value="toDo">To Do</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Priority</InputLabel>
                <Select name="priority" value={values.priority} onChange={handleChange}>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
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
                label="SOP Link"
                name="sopLink"
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
