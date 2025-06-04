import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeOffOutlinedIcon from "@mui/icons-material/CodeOffOutlined";

import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MultilineChartOutlinedIcon from '@mui/icons-material/MultilineChartOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";


export const navItems = [
  /* ---------- Public section ---------- */
  { section: "Public" },
  { text: "Landing",   icon: <HomeOutlinedIcon />, path: "/",          roles: ["guest", "interested", "member", "admin"], adminOnly: false },
  { text: "FAQ",       icon: <HelpOutlineOutlinedIcon />, path: "/faq", roles: ["guest", "interested", "member", "admin"], adminOnly: false },
  { text: "Register",  icon: <PersonOutlinedIcon />, path: "/register", roles: ["guest"], adminOnly: false },

  /* ---------- Strategy (needs login) ---------- */
  { section: "Strategy" },
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", roles: ["interested", "member", "admin"], adminOnly: false },
  { text: "Manage Bots", icon: <CodeOffOutlinedIcon />, path: "/bots", roles: ["member", "admin"], adminOnly: false },

  /* ---------- Charts (needs login) ---------- */
  { section: "Charts" },
  { text: "Pairs Chart", icon: <TimelineOutlinedIcon />, path: "/pairsChart", roles: ["interested", "member", "admin"], adminOnly: false },
  { text: "SMA Chart", icon: <MultilineChartOutlinedIcon />, path: "/smaChart", roles: ["interested", "member", "admin"], adminOnly: false },
  { text: "Avg Gain Chart", icon: <TrendingUpOutlinedIcon />, path: "/avgGainChart", roles: ["interested", "member", "admin"], adminOnly: false },
  { text: "Liquidity Trend Chart", icon: <TrendingUpOutlinedIcon />, path: "/liquidityTrendChart", roles: ["interested", "member", "admin"], adminOnly: false },

  /* ---------- Admin (hidden unless admin) ---------- */
  { section: "Admin", adminOnly: true },
  { text: "Manage Users",    icon: <PeopleAltOutlinedIcon />,   path: "/manageUsers",    roles: ["admin"], adminOnly: true  },
  { text: "Manage Tasks",    icon: <FormatListNumberedOutlinedIcon />, path: "/manageTasks", roles: ["admin"], adminOnly: true  },
  { text: "Manage Projects", icon: <AccountTreeOutlinedIcon />, path: "/manageProjects", roles: ["admin"], adminOnly: true  },
  { text: "Manage SOPs",     icon: <ArticleIcon />,             path: "/manageSOPs",     roles: ["admin"], adminOnly: true  },
  { text: "Kanban Board",    icon: <ViewKanbanIcon />,          path: "/kanban",         roles: ["admin"], adminOnly: true },
];
