import { IconButton, Tooltip } from "@mui/material";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/"); // Redirect after logout to clear protected view state
  };

  return (
    <Tooltip title="Logout">
      <IconButton onClick={handleLogout} color="inherit">
        <ExitToAppOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
