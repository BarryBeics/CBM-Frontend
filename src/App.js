// Third-party libraries
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

// Theme
import { ColorModeContext, useMode } from "./theme";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import EditTaskForm from "./views/manageTasks/EditTaskForm";
import MainLayout from "./components/MainLayout";

// Views
import ManageUsers from "./views/manageUsers";
import ManageTasks from "./views/manageTasks";
import LandingPage from "./views/landingPage";
import Bots from "./views/bots";
import PairsChart from "./views/pairsChart";
import SMAChart from "./views/smaChart";
import AvgGainChart from "./views/avgGainChart";
import Register from "./views/register";
import CreateUser from "./views/createUser";
import CreateTask from "./views/createTask";
import Login from "./views/auth/Login";

// To be deleted
import Dashboard from "./scenes/dashboard";

import FAQ from "./views/faq";
import KanbanBoard from "./views/kanban";

function App() {
  const [theme, colourMode] = useMode();

  return (
    <ColorModeContext.Provider value={colourMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Authenticated layout routes */}
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bots"
              element={
                <ProtectedRoute>
                  <Bots />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pairsChart"
              element={
                <ProtectedRoute>
                  <PairsChart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smaChart"
              element={
                <ProtectedRoute>
                  <SMAChart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/avgGainChart"
              element={
                <ProtectedRoute>
                  <AvgGainChart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createUser"
              element={
                <ProtectedRoute role={["admin"]}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageUsers"
              element={
                <ProtectedRoute role={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createTask"
              element={
                <ProtectedRoute role={["admin"]}>
                  <CreateTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageTasks"
              element={
                <ProtectedRoute role={["admin"]}>
                  <ManageTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/edit/:id"
              element={
                <ProtectedRoute role={["admin"]}>
                  <EditTaskForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kanban"
              element={
                <ProtectedRoute role={["admin"]}>
                  <KanbanBoard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
