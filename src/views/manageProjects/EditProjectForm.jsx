import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { GraphQLClient } from "graphql-request";
import Header from "../../components/Header";
import formOptions from "../../config/formOptions.json";
import { graphqlEndpoint } from "../../config";

const client = new GraphQLClient(graphqlEndpoint);

const GET_PROJECT_QUERY = `
  query GetProjectById($id: ID!) {
    projectById(id: $id) {
      id
      title
      description
      labels
      assignedTo
      dueDate
      status
    }
  }
`;



const UPDATE_PROJECT_MUTATION = `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      id
      title
      description
      labels
      assignedTo
      dueDate
      status
    }
  }
`;


const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    labels: yup.string(),
    assignedTo: yup.string(),
    dueDate: yup.string(),
    status: yup.string(),
  });
  
  const ProjectEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState(null);
  
    useEffect(() => {
      const fetchProject = async () => {
        try {
            const response = await client.request(GET_PROJECT_QUERY, { id });
            console.log("GraphQL response:", response);

            const project = response?.projectById;
            
            if (!project) {
              console.error("Project not found for id:", id);
              return;
            }
            
            setInitialValues({
              id: project.id,
              title: project.title || "",
              description: project.description || "",
              labels: (project.labels || []).join(", "),
              assignedTo: project.assignedTo || "",
              dueDate: project.dueDate || "",
              status: project.status || "",
            });
            
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      };
  
      fetchProject();
    }, [id]);
  
    const handleFormSubmit = async (values) => {
      try {
        await client.request(UPDATE_PROJECT_MUTATION, {
          input: {
            id: values.id,
            title: values.title,
            description: values.description,
            labels: values.labels.split(",").map(l => l.trim()),
            assignedTo: values.assignedTo,
            dueDate: values.dueDate,
            status: values.status,
          },
        });
        alert("Project updated successfully");
        navigate("/manageProjects");
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Failed to update project");
      }
    };
  
    if (!initialValues) return <div>Loading...</div>;
  
    return (
      <Box m="20px">
        <Header title="EDIT PROJECT" subtitle="Modify project details" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Labels (comma-separated)"
                name="labels"
                value={values.labels}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={values.assignedTo}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                margin="normal"
              />
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
  
  export default ProjectEditForm;