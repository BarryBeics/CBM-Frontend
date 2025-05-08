// components/MainLayout.jsx
import SideBarNav from "../scenes/global/Sidebar";
import Topbar from "../scenes/global/Topbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="app">
      <SideBarNav />
      <main className="content">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
