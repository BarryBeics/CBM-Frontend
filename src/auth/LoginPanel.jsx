import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useTheme } from "@mui/material";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GraphQLClient, gql } from "graphql-request";
import { graphqlEndpoint } from "../config";
import logo from "../assets/logo.png";

// Theme
import { tokens } from "../theme";

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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { login } = useAuth();

  const handleLogin = async () => {
    const client = new GraphQLClient(graphqlEndpoint);
    try {
      const data = await client.request(LOGIN_MUTATION, { input: { email, password } });
      const { token, user } = data.login;

      // Store in localStorage
      localStorage.setItem("token", token);

      // Update context (this triggers re-renders everywhere)
      login(user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Paper elevation={3} sx={{ p: 4, width: "350px", textAlign: "center" }}>
        
        <Typography variant="h3" fontWeight="bold" color={colors.houndGold[500]} mb={2}>
          Welcome to Scalpel Hound
        </Typography>
        <img src={logo} alt="Scalpel Hound Logo" style={{ width: 220, marginBottom: "1rem" }} />
        <Typography variant="h6" fontWeight="bold" color={colors.scalpelTeal[400]} mb={2}>
        Taking cuts from the market with surgeon-like precision
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <Button variant="contained" color="secondary" fullWidth onClick={handleLogin}>
          Enter
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
