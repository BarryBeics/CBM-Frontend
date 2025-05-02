import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Register = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log("Ballot Registration:", values);
    // You can replace this with an API call or GraphQL mutation
  };

  return (
    <Box m="20px">
      <Header
        title="BALLOT REGISTRATION"
        subtitle="Apply for Founders’ Club lifetime membership"
      />

      <Typography variant="body1" mb={3}>
        Submit your details to be considered for early access to Scalpel Hound. Selected members will be contacted directly.
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
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telegram (optional)"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telegram}
                name="telegram"
                error={!!touched.telegram && !!errors.telegram}
                helperText={touched.telegram && errors.telegram}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
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
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  telegram: yup.string().notRequired(),
});

// Default Form Values
const initialValues = {
  name: "",
  email: "",
  telegram: "",
};

export default Register;
