// components/MainLayout.jsx
import SideBarNav from "../navigation/Sidebar";
import Topbar from "../navigation/Topbar";
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
