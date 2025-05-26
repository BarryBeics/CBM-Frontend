// Third-party libraries
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

// Theme
import { ColorModeContext, useMode } from "./theme";

// Navigation
import Layout from "./navigation/Layout";

// Components
import ProtectedRoute from "./auth/ProtectedRoute";
import EditTaskForm from "./views/manageTasks/EditTaskForm";
import EditProjectForm from "./views/manageProjects/EditProjectForm";
import EditSOPForm from "./views/manageSOPs/EditSOPForm";
import EditUserForm from "./views/manageUsers/EditUserForm";

// Public
import Login from "./auth/LoginPanel";
import LandingPage from "./views/landingPage";
import FAQ from "./views/faq";
import Register from "./views/register";

// Views - Strategy
import Dashboard from "./scenes/dashboard"; // TODO: needs updating to a view
import Bots from "./views/bots";

// Views - Admin
import ManageUsers from "./views/manageUsers";
import ManageTasks from "./views/manageTasks";
import ManageProjects from "./views/manageProjects";
import ManageSOPs from "./views/manageSOPs";
import KanbanBoard from "./views/kanban";

import CreateUser from "./views/createUser";
import CreateTask from "./views/createTask";
import CreateProject from "./views/createProject";

import ManageMeeting from "./views/manageMeeting";

// Views - Charts
import PairsChart from "./views/pairsChart";
import SMAChart from "./views/smaChart";
import AvgGainChart from "./views/avgGainChart";

function App() {
  const [theme, colourMode] = useMode();

  return (
    <ColorModeContext.Provider value={colourMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Topbar link */}
          <Route path="/trackMeeting" element={<ManageMeeting />} />

          {/* Public pages with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected pages wrapped in layout */}
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
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
              path="/users/edit/:email"
              element={
                <ProtectedRoute role={["admin"]}>
                  <EditUserForm />
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
              path="/createProject"
              element={
                <ProtectedRoute role={["admin"]}>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageProjects"
              element={
                <ProtectedRoute role={["admin"]}>
                  <ManageProjects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/edit/:id"
              element={
                <ProtectedRoute role={["admin"]}>
                  <EditProjectForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manageSOPs"
              element={
                <ProtectedRoute role={["admin"]}>
                  <ManageSOPs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sops/edit/:id"
              element={
                <ProtectedRoute role={["admin"]}>
                  <EditSOPForm />
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
