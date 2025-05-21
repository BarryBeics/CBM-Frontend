import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../../config";

// GraphQL client
const client = new GraphQLClient(graphqlEndpoint);

// Updated Mutation
const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

const CreateUserForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const input = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        mobileNumber: values.mobileNumber,
        role: values.role,
        preferredContactMethod: values.preferredContactMethod,
        invitedBy: values.invitedBy || null,
      };

      await client.request(CREATE_USER_MUTATION, { input });
      alert("User created successfully!");
      resetForm();
      navigate("/manageUsers");
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user.");
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
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
              sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Mobile Number"
                name="mobileNumber"
                value={values.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                sx={{ gridColumn: "span 4" }}
              />

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                <InputLabel>Preferred Contact</InputLabel>
                <Select
                  name="preferredContactMethod"
                  value={values.preferredContactMethod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.preferredContactMethod && !!errors.preferredContactMethod}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                label="Invited By"
                name="invitedBy"
                value={values.invitedBy}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText="Optional"
                sx={{ gridColumn: "span 4" }}
              />

              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                <InputLabel>User Role</InputLabel>
                <Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.role && !!errors.role}
                >
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// ✅ Validation
const validationSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  mobileNumber: yup
    .string()
    .matches(/^[+0-9 ]+$/, "Must be a valid phone number")
    .required("Required"),
  preferredContactMethod: yup
    .string()
    .oneOf(["email", "whatsapp"])
    .required("Required"),
  role: yup
    .string()
    .oneOf(["interested", "member", "admin"])
    .required("Required"),
  password: yup.string().min(6).required("Required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  preferredContactMethod: "email",
  invitedBy: "",
  role: "interested",
  password: "",
};

export default CreateUserForm;
