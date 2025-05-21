import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" />;

  if (role) {
    const hasAccess = Array.isArray(role)
      ? role.includes(user.role)
      : user.role === role;

    if (!hasAccess) return <Navigate to="/unauthorized" />;
  }

  return children;
};
export default ProtectedRoute;
