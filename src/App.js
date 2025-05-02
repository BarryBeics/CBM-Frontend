// Third-party libraries
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

// Theme
import { ColorModeContext, useMode } from "./theme";

// Views
import LandingPage from "./views/landingPage";
import Bots from "./views/bots";
import PairsChart from "./views/pairsChart";
import SMAChart from "./views/smaChart";
import AvgGainChart from "./views/avgGainChart";
import Register from "./views/register";

// To be deleted
import Topbar from "./scenes/global/Topbar";
import SideBarNav from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";


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
              <Route path="/bots" element={<Bots />} />
              <Route path="/pairsChart" element={<PairsChart />} />
              <Route path="/smaChart" element={<SMAChart />} />
              <Route path="/avgGainChart" element={<AvgGainChart />} />

              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/register" element={<Register />} />

              <Route path="/team" element={<Team />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/form" element={<Form />} />
              <Route path="/line" element={<Line />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
            </main>  
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}

export default App;
