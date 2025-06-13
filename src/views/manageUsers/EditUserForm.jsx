import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient, gql } from "graphql-request";
import Header from "../../components/Header";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const READ_USER_BY_EMAIL = gql`
  query ReadUserByEmail($email: String!) {
    readUserByEmail(email: $email) {
      id
      firstName
      lastName
      email
      mobileNumber
      verifiedEmail
      verifiedMobile
      role
      openToTrade
      binanceAPI
      preferredContactMethod
      notes
      invitedBy
      joinedBallot
      isPaidMember
      isDeleted
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  role: yup.string().oneOf(["guest", "interested", "member", "admin"]).required("Required"),
  mobileNumber: yup.string().notRequired(),
  preferredContactMethod: yup.string().oneOf(["email", "whatsapp"]).notRequired(),
});

const EditUserForm = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { readUserByEmail } = await client.request(READ_USER_BY_EMAIL, { email });
        setInitialValues({
          id: readUserByEmail.id,
          firstName: readUserByEmail.firstName || "",
          lastName: readUserByEmail.lastName || "",
          email: readUserByEmail.email || "",
          mobileNumber: readUserByEmail.mobileNumber || "",
          verifiedEmail: readUserByEmail.verifiedEmail || false,
          verifiedMobile: readUserByEmail.verifiedMobile || false,
          role: readUserByEmail.role || "guest",
          openToTrade: readUserByEmail.openToTrade || false,
          binanceAPI: readUserByEmail.binanceAPI || "",
          preferredContactMethod: readUserByEmail.preferredContactMethod || "email",
          notes: readUserByEmail.notes || "",
          invitedBy: readUserByEmail.invitedBy || "",
          joinedBallot: readUserByEmail.joinedBallot || false,
          isPaidMember: readUserByEmail.isPaidMember || false,
          isDeleted: readUserByEmail.isDeleted || false,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [email]);

  const handleSubmit = async (values) => {
    try {
      const input = {
        ...values,
        isDeleted: values.isDeleted ?? false,
      };
      await client.request(UPDATE_USER, { input });
      alert("User updated successfully.");
      navigate("/manageUsers");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <Box m="20px">
      <Header title="EDIT USER" subtitle={`Edit ${initialValues.firstName} ${initialValues.lastName}`} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(4, 1fr)">
              <TextField label="First Name" name="firstName" value={values.firstName}
                onChange={handleChange} onBlur={handleBlur} error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName} sx={{ gridColumn: "span 2" }} />

              <TextField label="Last Name" name="lastName" value={values.lastName}
                onChange={handleChange} onBlur={handleBlur} error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName} sx={{ gridColumn: "span 2" }} />

              <TextField label="Email" name="email" value={values.email}
                onChange={handleChange} onBlur={handleBlur} error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email} sx={{ gridColumn: "span 4" }} />

              <TextField label="Mobile Number" name="mobileNumber" value={values.mobileNumber}
                onChange={handleChange} sx={{ gridColumn: "span 2" }} />

              <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                <InputLabel>Role</InputLabel>
                <Select name="role" value={values.role} onChange={handleChange}>
                  <MenuItem value="guest">Guest</MenuItem>
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Binance API Key" name="binanceAPI" value={values.binanceAPI}
                onChange={handleChange} sx={{ gridColumn: "span 4" }} />

              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Preferred Contact</InputLabel>
                <Select name="preferredContactMethod" value={values.preferredContactMethod} onChange={handleChange}>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Invited By" name="invitedBy" value={values.invitedBy}
                onChange={handleChange} sx={{ gridColumn: "span 2" }} />

              <TextField label="Notes" name="notes" value={values.notes}
                onChange={handleChange} multiline minRows={3} sx={{ gridColumn: "span 4" }} />

              <FormControlLabel control={<Switch checked={values.verifiedEmail} onChange={handleChange} name="verifiedEmail" />} label="Verified Email" />
              <FormControlLabel control={<Switch checked={values.verifiedMobile} onChange={handleChange} name="verifiedMobile" />} label="Verified Mobile" />
              <FormControlLabel control={<Switch checked={values.openToTrade} onChange={handleChange} name="openToTrade" />} label="Open To Trade" />
              <FormControlLabel control={<Switch checked={values.joinedBallot} onChange={handleChange} name="joinedBallot" />} label="Joined Ballot" />
              <FormControlLabel control={<Switch checked={values.isPaidMember} onChange={handleChange} name="isPaidMember" />} label="Paid Member" />
              <FormControlLabel control={<Switch checked={values.isDeleted} onChange={handleChange} name="isDeleted" />} label="Is Deleted" />

            </Box>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button type="submit" variant="contained" color="secondary">
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
