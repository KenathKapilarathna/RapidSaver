import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "user" | "admin" | "driver";
}

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);

  // Redirect if user is not logged in
  if (!user) {
    if (requiredRole === "admin") return <Navigate to="/admin-login" />;
    if (requiredRole === "driver") return <Navigate to="/driver-login" />;
    return <Navigate to="/login" />;
  }

  // Redirect if user doesn't have the required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
