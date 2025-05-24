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
import AdminUserSelect from "../../components/AdminUserSelect";
import { GraphQLClient } from "graphql-request";
import { graphqlEndpoint } from "../../config";
import LabelSelector from "../../components/LabelSelector";

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
      isWaitingFor
      isSomedayMaybe
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
      const cleanedValues = {
        ...values,
        labels: values.labels || [],
        isWaitingFor: !!values.isWaitingFor,
        isSomedayMaybe: !!values.isSomedayMaybe,
      };
      
      

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
                    {formOptions.taskStatusOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
  fullWidth
  variant="filled"
  type="date"
  label="Defer Date"
  InputLabelProps={{ shrink: true }}
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.deferDate}
  name="deferDate"
  sx={{ gridColumn: "span 2" }}
/>

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

<FormControl
  fullWidth
  sx={{ gridColumn: "span 2", display: "flex", flexDirection: "row", alignItems: "center" }}
>
  <label style={{ marginRight: "10px" }}>
    <input
      type="checkbox"
      name="isWaitingFor"
      checked={values.isWaitingFor}
      onChange={handleChange}
    />
    Waiting For
  </label>

  <label>
    <input
      type="checkbox"
      name="isSomedayMaybe"
      checked={values.isSomedayMaybe}
      onChange={handleChange}
    />
    Someday/Maybe
  </label>
</FormControl>

              
<LabelSelector
  selectedLabels={values.labels}
  setFieldValue={setFieldValue}
  error={errors.labels}
  touched={touched.labels}
/>
           
              
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
  isWaitingFor: yup.boolean(),
  isSomedayMaybe: yup.boolean(),
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
  isWaitingFor: false,
  isSomedayMaybe: false,
};


export default CreateTaskForm;
