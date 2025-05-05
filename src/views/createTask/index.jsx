import { Box, Button, TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";

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

const CreateTaskForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await client.request(CREATE_TASK_MUTATION, { input: values });
      alert("Task created successfully!");
      resetForm();
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
        initialValues={initialTaskValues}
        validationSchema={taskSchema}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Assigned To"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.assignedTo}
                name="assignedTo"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Due Date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dueDate}
                name="dueDate"
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="inProgress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={values.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Category"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.category}
                name="category"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="SOP Link"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sopLink}
                name="sopLink"
                sx={{ gridColumn: "span 2" }}
              />
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

const taskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().required("Status is required"),
  priority: yup.string().required("Priority is required"),
  assignedTo: yup.string(),
  dueDate: yup.string(),
  category: yup.string(),
  sopLink: yup.string(),
});

const initialTaskValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignedTo: "",
  dueDate: "",
  category: "",
  sopLink: "",
};

export default CreateTaskForm;
