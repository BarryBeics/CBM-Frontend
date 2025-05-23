import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // make sure path is correct

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user, isLoading } = useAuth();

  if (isLoading) return null; // or show loading spinner

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
