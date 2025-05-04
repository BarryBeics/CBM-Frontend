import { IconButton, Tooltip } from "@mui/material";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
