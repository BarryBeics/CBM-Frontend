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
import AdminUserSelect from "../../components/AdminUserSelect";
import { graphqlEndpoint } from "../../config";
import LabelSelector from "../../components/LabelSelector";


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
    isWaitingFor
    isSomedayMaybe
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
    isWaitingFor
    isSomedayMaybe
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
          dueDate: taskById.dueDate
            ? new Date(taskById.dueDate).toISOString().split("T")[0]
            : "",
          deferDate: taskById.deferDate
            ? new Date(taskById.deferDate).toISOString().split("T")[0]
            : "",
          department: taskById.department || "",
          projectId: taskById.projectId || "",
          isWaitingFor: taskById.isWaitingFor || false,
          isSomedayMaybe: taskById.isSomedayMaybe || false,
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
  label="Defer Date"
  name="deferDate"
  type="date"
  value={values.deferDate}
  onChange={handleChange}
  InputLabelProps={{ shrink: true }}
  sx={{ gridColumn: "span 2" }}
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

<FormControl
  fullWidth
  sx={{ gridColumn: "span 2", display: "flex", flexDirection: "row", alignItems: "center" }}
>
  <label style={{ marginRight: "20px" }}>
    <input
      type="checkbox"
      name="isWaitingFor"
      checked={values.isWaitingFor}
      onChange={handleChange}
    />{" "}
    Waiting For
  </label>

  <label>
    <input
      type="checkbox"
      name="isSomedayMaybe"
      checked={values.isSomedayMaybe}
      onChange={handleChange}
    />{" "}
    Someday/Maybe
  </label>
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
