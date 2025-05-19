import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import formOptions from "../../config/formOptions.json";
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
      // Remove empty optional fields
      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "")
      );

      console.log("Submitting task with values:", cleanedValues);

  
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
                    {formOptions.statusOptions.map((opt) => (
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
                fullWidth
                variant="filled"
                type="text"
                label="Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.type}
                name="type"
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Labels (comma separated)"
                onBlur={handleBlur}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "labels",
                      value: e.target.value
                        .split(",")
                        .map((label) => label.trim()),
                    },
                  })
                }
                value={values.labels?.join(", ")}
                name="labels"
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {formOptions.categoryOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <input
                type="hidden"
                name="projectId"
                value={values.projectId}
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
};

export default CreateTaskForm;
