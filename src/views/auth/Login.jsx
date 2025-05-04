import { useState, useEffect } from "react"; // ✅ Import useEffect
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../../config";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Already logged in, redirecting...");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    const client = new GraphQLClient(graphqlEndpoint);
    console.log("Attempting login with", { email, password });

    try {
      const data = await client.request(LOGIN_MUTATION, {
        input: { email, password },
      });
      const { token, user } = data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login successful:", data);

      navigate("/dashboard");
    } catch (err) {
      console.log("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
      <Typography variant="h4" mb={2}>Login</Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2, width: "300px" }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
