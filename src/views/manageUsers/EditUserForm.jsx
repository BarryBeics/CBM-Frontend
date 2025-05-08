import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_USER_BY_EMAIL_QUERY = `
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      firstName
      lastName
      email
      contact
      role
    }
  }
`;

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      email
      contact
      role
    }
  }
`;

const EditUserForm = () => {
  const { email } = useParams(); // Fetch email from the URL params
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) {
        console.error("Email param is missing");
        return;
      }
  
      try {
        const { getUserByEmail } = await client.request(GET_USER_BY_EMAIL_QUERY, {
          email,
        });
        setInitialValues({
          id: getUserByEmail.id, // Store ID for update
          firstName: getUserByEmail.firstName || "",
          lastName: getUserByEmail.lastName || "",
          email: getUserByEmail.email || "",
          contact: getUserByEmail.contact || "",
          role: getUserByEmail.role || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [email]);

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup.string().required("Contact is required"),
    role: yup.string().required("Role is required"),
  });

  const handleFormSubmit = async (values) => {
    try {
      const response = await client.request(UPDATE_USER_MUTATION, {
        input: {
          id: values.id, // Use the stored ID
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          contact: values.contact,
          role: values.role,
        },
      });
      console.log("User updated:", response);
      alert("User updated!");
      navigate("/manageUsers");
    } catch (err) {
      console.error("Update failed:", err.response?.errors || err);
      alert("Failed to update user.");
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Header
        title="EDIT USER"
        subtitle={`Edit user: ${initialValues.firstName} ${initialValues.lastName}`}
      />

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
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
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
                label="Contact"
                name="contact"
                value={values.contact}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  error={!!touched.role && !!errors.role}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                </Select>
              </FormControl>
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

export default EditUserForm;
