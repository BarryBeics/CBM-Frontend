import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AccessDeniedModal from "./AccessDeniedModel";

const ProtectedRoute = ({ children, role }) => {
  const [showModal, setShowModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
    } else if (role && (!user || !role.includes(user.role))) {
      setIsAuthorized(false);
      setShowModal(true);
    }
  }, [token, role, user]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized && showModal) {
    return <AccessDeniedModal open={showModal} onClose={() => setShowModal(false)} />;
  }

  return children;
};

export default ProtectedRoute;
