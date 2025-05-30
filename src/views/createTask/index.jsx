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
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import formOptions from "../../config/formOptions.json";

import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

import LabelSelector from "../../components/LabelSelector";
import DateInput from "../../components/DateInput";
import Header from "../../components/Header";
import AdminUserSelect from "../../components/AdminUserSelect";

// GraphQL client
const client = new GraphQLClient(graphqlEndpoint);

// GraphQL mutation
const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
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
`;

const CreateTaskForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const location = useLocation();
  const passedProjectId = location.state?.projectId || "";
  const redirectPath = location.state?.redirectPath || "/manageTasks"; // default fallback

  console.log("Received location state:", location.state);
  console.log("Parsed projectId from location state:", passedProjectId);

 const handleFormSubmit = async (values, { resetForm }) => {
  try {
    // Clean up values: convert empty strings to null or omit
    const cleanedValues = { ...values };
for (const key of Object.keys(cleanedValues)) {
  if (cleanedValues[key] === "") {
    cleanedValues[key] = null;
  }
}

    // Ensure labels is always an array
    cleanedValues.labels = cleanedValues.labels || [];

    // Ensure date fields are in ISO format if not null
    if (cleanedValues.dueDate)
      cleanedValues.dueDate = cleanedValues.dueDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
    if (cleanedValues.deferDate)
      cleanedValues.deferDate = cleanedValues.deferDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");

    console.log("Submitting task with cleaned values:", cleanedValues);

    await client.request(CREATE_TASK_MUTATION, { input: cleanedValues });
    alert("Task created successfully!");
    resetForm();
    navigate(redirectPath);
  } catch (err) {
    console.error("Error creating task:", err);
    alert("Failed to create task.");
  }
};

  return (
    <Box m="20px">
      <Header title="CREATE TASK" subtitle="Create a New Task" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={{ ...initialTaskValues, projectId: passedProjectId }}
        validationSchema={taskSchema}
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
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={3}
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
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

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
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

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {formOptions.departmentOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <LabelSelector
                selectedLabels={values.labels}
                setFieldValue={setFieldValue}
                error={errors.labels}
                touched={touched.labels}
              />

              <input type="hidden" name="projectId" value={values.projectId} />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Task
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const allowedLabels = formOptions?.labelOptions.map((l) => l.value) || [];

const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().required("Status is required"),
  labels: yup
    .array()
    .of(yup.string().oneOf(allowedLabels, "Invalid label"))
    .min(1, "Select at least one label")
    .required("Select at least one label"),
  assignedTo: yup.string(),
  dueDate: yup.string(),
  deferDate: yup.string(),
  department: yup.string(),
  duration: yup.string(),
});

const initialTaskValues = {
  title: "",
  description: "",
  status: "inbox",
  labels: [],
  assignedTo: "",
  dueDate: "",
  deferDate: "",
  department: "",
  duration: "",
};

export default CreateTaskForm;
