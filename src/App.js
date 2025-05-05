// Third-party libraries
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

// Theme
import { ColorModeContext, useMode } from "./theme";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import EditTaskForm from "./views/manageTasks/EditTaskForm";

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
import Topbar from "./scenes/global/Topbar";
import SideBarNav from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";

import FAQ from "./views/faq";
import KanbanBoard from "./views/kanban";

function App() {
  const [theme, colourMode] = useMode();

  return (
    <ColorModeContext.Provider value={colourMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SideBarNav />
          <main className="content">
            <Topbar />
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Authenticated Only */}
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

              {/* Admin Only */}
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

              {/* Default fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
