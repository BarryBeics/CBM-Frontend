import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../../config";

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

const Register = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    const client = new GraphQLClient(graphqlEndpoint);

    const input = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: "ballot-temp-password", // Placeholder, or you could randomize & never expose
      mobileNumber: values.mobileNumber,
      role: "interested",
      invitedBy: null,
      preferredContactMethod: values.preferredContactMethod,
    };

    try {
      const data = await client.request(CREATE_USER_MUTATION, { input });
      console.log("Registration successful:", data.createUser);
      resetForm();
      // Show success banner/snackbar here
    } catch (error) {
      console.error("Registration error", error);
      // Show error banner/snackbar here
    }
  };

  return (
    <Box m="20px">
      <Header
        title="BALLOT REGISTRATION"
        subtitle="Apply for Founders’ Club lifetime membership"
      />

      <Typography variant="body1" mb={3}>
        Submit your details to be considered for early access to Scalpel Hound.
        Selected members will be contacted directly.
      </Typography>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
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
                label="First Name"
                name="firstName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Last Name"
                name="lastName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                type="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Mobile Number"
                name="mobileNumber"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.mobileNumber}
                error={!!touched.mobileNumber && !!errors.mobileNumber}
                helperText={touched.mobileNumber && errors.mobileNumber}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                select
                fullWidth
                variant="filled"
                label="Preferred Contact Method"
                name="preferredContactMethod"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.preferredContactMethod}
                error={
                  !!touched.preferredContactMethod &&
                  !!errors.preferredContactMethod
                }
                helperText={
                  touched.preferredContactMethod &&
                  errors.preferredContactMethod
                }
                sx={{ gridColumn: "span 4" }}
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
              </TextField>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                Submit Application
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Validation Schema
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: yup.string()
    .required("Mobile number is required")
    .matches(/^[+0-9 ]+$/, "Must be a valid phone number"),
  preferredContactMethod: yup
    .string()
    .oneOf(["email", "whatsapp"])
    .required("Preferred contact method is required"),
});

// Default Form Values
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  preferredContactMethod: "email",
};

export default Register;
