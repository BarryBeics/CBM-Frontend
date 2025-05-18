import {
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
  } from "@mui/material";
  import { useNavigate, useLocation } from "react-router-dom";
  import { Formik, Field } from "formik";
  import * as yup from "yup";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import formOptions from "../../config/formOptions.json";
  import Header from "../../components/Header";
  import { GraphQLClient } from "graphql-request";
  import { graphqlEndpoint } from "../../config";
  
  // GraphQL client
  const client = new GraphQLClient(graphqlEndpoint);
  
  // GraphQL mutation
  const CREATE_PROJECT_MUTATION = `
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        id
        title
        description
        sop
        labels
        assignedTo
        dueDate
        status
      }
    }
  `;
  
  const CreateProjectForm = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const { state } = useLocation();
  
    const sopValue = state?.sop ?? false;
    const name = state?.name ?? "Project";
    const redirectPath = state?.redirectPath ?? "/manageProjects";

    console.log("SOP:", sopValue, "Name:", name);

    // Initial form values
  const initialProjectValues = {
    title: "",
    description: "",
    sop: sopValue,
    labels: [],
    assignedTo: "",
    dueDate: "",
    status: "todo",
  };
  
    const handleFormSubmit = async (values, { resetForm }) => {
      try {
        // Convert empty string to null where necessary
        const formattedValues = {
          ...values,
          labels: values.labels?.length > 0 ? values.labels : [],
        };
  
        await client.request(CREATE_PROJECT_MUTATION, { input: formattedValues });
        alert("Created successfully!");
        resetForm();
        navigate(redirectPath);
      } catch (err) {
        console.error("Error creating project:", err);
        alert("Failed to create project.");
      }
    };
  
    return (
      <Box m="20px">
        <Header title={`CREATE ${name}`} subtitle={`Create a New ${name}`} />  
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialProjectValues}
          validationSchema={projectSchema}
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
  
                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {formOptions.roleOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
  
                <Field type="hidden" name="sop" />

  
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
                  value={values.labels.join(", ")}
                  name="labels"
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>
  
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Create {name}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };
  
  // Form validation schema
  const projectSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    sop: yup.boolean(),
    assignedTo: yup.string(),
    dueDate: yup.string(),
    labels: yup.array().of(yup.string()),
    status: yup.string().required("Status is required"),
  });
  
  
  
  export default CreateProjectForm;
  