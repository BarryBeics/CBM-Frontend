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
  duration,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import formOptions from "../../config/formOptions.json";
import { graphqlEndpoint } from "../../config";
import { parseUKDate } from "../../utils/dateUtiles"; 
import { parse, isValid } from "date-fns";

import Header from "../../components/Header";
import AdminUserSelect from "../../components/AdminUserSelect";
import LabelSelector from "../../components/LabelSelector";
import DateInput from "../../components/DateInput";


const client = new GraphQLClient(graphqlEndpoint);

const GET_TASK_QUERY = `
  query GetTaskById($id: ID!) {
    taskById(id: $id) {
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
    labels
    assignedTo
    dueDate
    deferDate
    department
    projectId
    duration
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
          labels: taskById.labels || [],
          assignedTo: taskById.assignedTo || "",
          dueDate: taskById.dueDate && isValid(parse(taskById.dueDate, "dd-MM-yyyy", new Date()))
          ? taskById.dueDate
          : "",
          deferDate: taskById.deferDate && isValid(parse(taskById.deferDate, "dd-MM-yyyy", new Date()))
          ? taskById.deferDate
          : "",
          department: taskById.department || "",
          projectId: taskById.projectId || "",
          duration: taskById.duration || "",
        });
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };

    fetchTask();
  }, [id]);

  const allowedLabels = formOptions?.labelOptions.map((l) => l.value) || [];

const validationSchema = yup.object().shape({
    title: yup.string().required("required"),
    description: yup.string(),
    status: yup.string().required("required"),
    priority: yup.string(),
    type: yup.string(),
    labels: yup
    .array()
    .of(yup.string().oneOf(allowedLabels, "Invalid label"))
    .min(1, "Select at least one label")
    .required("Select at least one label"),

    assignedTo: yup.string(),
    dueDate: yup.string(),
    category: yup.string(),
    projectId: yup.string(),
  });

  const handleFormSubmit = async (values) => {
    const formattedValues = {
      ...values,
      id,
      dueDate: parseUKDate(values.dueDate),
      deferDate: parseUKDate(values.deferDate),
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
          setFieldValue,
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

<LabelSelector
  selectedLabels={values.labels}
  setFieldValue={setFieldValue}
  error={errors.labels}
  touched={touched.labels}
/>

<FormControl fullWidth sx={{ gridColumn: "span 2" }}>
  <InputLabel>Status</InputLabel>
  <Select
    name="status"
    value={values.status}
    onChange={handleChange}
    onBlur={handleBlur}
  >
    {formOptions.taskStatusOptions.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>


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

<DateInput
  label="Defer Until"
  name="deferDate"
  value={values.deferDate}
  onChange={setFieldValue}
  onBlur={handleBlur}
  setFieldValue={setFieldValue}
  error={errors.deferDate}
  touched={touched.deferDate}
/>


<FormControl fullWidth sx={{ gridColumn: "span 2" }}>
  <InputLabel>Department</InputLabel>
  <Select
    name="department"
    value={values.department}
    onChange={handleChange}
  >
    {formOptions.departmentOptions?.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<TextField
  label="Project ID"
  name="projectId"
  value={values.projectId}
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
